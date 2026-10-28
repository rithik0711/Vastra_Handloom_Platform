const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const QRCode = require("qrcode");
const router = express.Router();
const os = require("os");
const { uploadToCloudinary } = require("../cloudinary");

// Helper to get local network IP address so mobile phones on the same Wi-Fi can open the URL
const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === "IPv4" &&
        !iface.internal &&
        !iface.address.startsWith("169.254")
      ) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

// Helper to generate unique product ID
const generateUniqueId = (category = "SILK") => {
  const prefix = "VASTRA";
  const cat = (category || "GEN").slice(0, 3).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${cat}-${timestamp}-${random}`;
};

// Helper to generate QR code data URL encoding mobile product URL
const generateProductQRCode = async (productInfo) => {
  try {
    const ip = getLocalIpAddress();
    const identifier = productInfo.uniqueId || productInfo._id || productInfo.code;
    const mobileProductUrl = `http://${ip}:5173/product/${identifier}`;

    const qrDataUrl = await QRCode.toDataURL(mobileProductUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 400,
      color: {
        dark: "#4A1525",
        light: "#FFFFFF"
      }
    });

    return { qrCode: qrDataUrl, qrData: mobileProductUrl, qrUrl: mobileProductUrl };
  } catch (err) {
    console.error("QR Code Generation Error:", err);
    return { qrCode: "", qrData: "", qrUrl: "" };
  }
};

// Helper to format weaver / artisan name into a clean name instead of an email or slug
const formatWeaverName = (val) => {
  if (!val) return "Kathar Weaves";
  const s = String(val).trim();
  if (!s.includes("@") && !s.includes("_")) return s;
  const sLower = s.toLowerCase();
  if (sLower.includes("rithik") || sLower.includes("kathar")) return "Kathar Weaves";
  if (sLower.includes("lakshmi") || sLower.includes("arun")) return "Sri Lakshmi Handlooms";
  if (sLower.includes("annapoorna") || sLower.includes("meenakshi")) return "Annapoorna Weaves";
  if (sLower.includes("kerala") || sLower.includes("suresh")) return "Kerala Loom Crafts";
  if (s.includes("@")) {
    const user = s.split("@")[0];
    return (
      user
        .replace(/[._-]/g, " ")
        .replace(/\d+/g, "")
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ") || "Master Weaver"
    );
  }
  if (s.includes("_") || s.includes("-")) {
    return s
      .replace(/[_-]/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }
  return s;
};

const productSchema = new mongoose.Schema(
  {
    manufacturerId: { type: String, default: "" },
    uniqueId: { type: String, index: true },
    code: { type: String, default: "" },
    name: { type: String, required: true },
    category: { type: String, default: "Silk" },
    fabric: { type: String, default: "Pure Silk" },
    weave: { type: String, default: "Hand Woven" },
    price: { type: Number, required: true },
    stock: { type: Number, default: 1 },
    maxStock: { type: Number, default: 20 },
    status: { type: String, default: "In Stock" },
    image: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    description: { type: String, default: "" },
    artisan: { type: String, default: "" },
    artisanName: { type: String, default: "" },
    origin: { type: String, default: "" },
    tag: { type: String, default: "Silk Mark Certified" },
    qrCode: { type: String, default: "" },
    qrData: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "Products", timestamps: true, strict: false }
);

const ProductModel =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema, "Products");

// 1. GET all products from DB for Customer Explore
// Performance Optimization: Uses MongoDB projection to completely exclude heavy base64 'image' and 'qrCode' fields
router.get("/", async (req, res) => {
  try {
    const { category, search, fabric, weave, manufacturerId, artisan } = req.query;

    let query = {};
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }
    if (fabric && fabric !== "All") {
      query.fabric = { $regex: new RegExp(fabric.trim(), "i") };
    }
    if (weave && weave !== "All") {
      query.weave = { $regex: new RegExp(weave.trim(), "i") };
    }
    if (manufacturerId && manufacturerId.trim() && manufacturerId !== "All") {
      query.$or = [
        { manufacturerId: { $regex: new RegExp(`^${manufacturerId.trim()}$`, "i") } },
        { artisan: { $regex: new RegExp(manufacturerId.trim(), "i") } }
      ];
    }
    if (artisan && artisan.trim()) {
      query.$or = [
        { artisan: { $regex: new RegExp(artisan.trim(), "i") } },
        { artisanName: { $regex: new RegExp(artisan.trim(), "i") } }
      ];
    }
    if (search && search.trim()) {
      const s = search.trim();
      const searchConditions = [
        { name: { $regex: s, $options: "i" } },
        { code: { $regex: s, $options: "i" } },
        { uniqueId: { $regex: s, $options: "i" } },
        { fabric: { $regex: s, $options: "i" } },
        { weave: { $regex: s, $options: "i" } },
        { artisan: { $regex: s, $options: "i" } },
        { artisanName: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } }
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    // Now that images are hosted on Cloudinary (~85-byte CDN URLs instead of 500KB base64 strings),
    // we include 'image' in the list response while keeping the large base64 'qrCode' excluded.
    const items = await ProductModel.find(query)
      .select("-qrCode")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = items.map((item) => {
      const artisanNameClean = formatWeaverName(item.artisanName || item.artisan || item.manufacturerId);
      return {
        ...item,
        artisan: artisanNameClean,
        artisanName: artisanNameClean,
        weaver: artisanNameClean
      };
    });

    return res.json({
      status: "success",
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error("Get Customer Products Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 2. GET single product by ID / uniqueId / code
// [Change 2]: Dedicated single product endpoint that explicitly fetches and includes 'image' and 'qrCode'
router.get("/:id", async (req, res) => {
  try {
    const rawId = req.params.id ? decodeURIComponent(req.params.id).trim() : "";
    if (!rawId) {
      return res.status(400).json({ status: "error", message: "Product ID is required" });
    }

    const searchConditions = [
      { uniqueId: rawId },
      { uniqueId: { $regex: new RegExp(`^${rawId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
      { code: rawId },
      { code: { $regex: new RegExp(`^${rawId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } }
    ];

    if (mongoose.Types.ObjectId.isValid(rawId) && rawId.length === 24) {
      searchConditions.unshift({ _id: new mongoose.Types.ObjectId(rawId) });
    }

    // Explicitly include all fields including base64 image and qrCode for item details view
    let item = await ProductModel.findOne({ $or: searchConditions }).select("+image +qrCode");

    // Fallback: search by partial uniqueId or name
    if (!item) {
      item = await ProductModel.findOne({
        $or: [
          { uniqueId: { $regex: new RegExp(rawId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") } },
          { name: { $regex: new RegExp(rawId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") } }
        ]
      }).select("+image +qrCode");
    }

    if (!item) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    let pObj = item.toObject ? item.toObject() : item;

    // Only backfill/generate QR code for this single product if missing
    if (!pObj.uniqueId || !pObj.qrCode) {
      if (!pObj.uniqueId) pObj.uniqueId = generateUniqueId(pObj.category || "Silk");
      const generated = await generateProductQRCode({
        uniqueId: pObj.uniqueId,
        code: pObj.code || `KW-${(pObj.category || "GEN").slice(0, 3).toUpperCase()}-001`,
        name: pObj.name,
        category: pObj.category,
        fabric: pObj.fabric,
        weave: pObj.weave,
        price: pObj.price,
        manufacturerId: pObj.manufacturerId || pObj.artisan || "kathar_weaves"
      });
      pObj.qrCode = generated.qrCode;
      pObj.qrData = generated.qrData;

      await ProductModel.updateOne(
        { _id: item._id },
        { $set: { uniqueId: pObj.uniqueId, qrCode: pObj.qrCode, qrData: pObj.qrData } }
      );
    }

    const artisanNameClean = formatWeaverName(pObj.artisanName || pObj.artisan || pObj.manufacturerId);
    pObj.artisan = artisanNameClean;
    pObj.artisanName = artisanNameClean;
    pObj.weaver = artisanNameClean;

    return res.json({
      status: "success",
      data: pObj
    });
  } catch (error) {
    console.error("Get Single Product Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 3. CREATE new product with Cloudinary image upload and QR code
router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      fabric,
      weave,
      price,
      stock,
      maxStock,
      image,
      description,
      featured,
      manufacturerId,
      artisan,
      artisanName,
      origin,
      tag
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ status: "error", message: "Name and price are required" });
    }

    const mfrId = manufacturerId || artisan || "kathar_weaves";
    const count = await ProductModel.countDocuments({ manufacturerId: mfrId });
    const categoryPrefix = (category || "SILK").slice(0, 3).toUpperCase();
    const code = `KW-${categoryPrefix}-${String(count + 1).padStart(3, "0")}`;
    const uniqueId = generateUniqueId(category);
    const stockNum = Number(stock) || 1;

    // Upload to Cloudinary if provided as Base64 Data URI
    let imageUrl = "";
    if (image && typeof image === "string" && image.trim()) {
      imageUrl = await uploadToCloudinary(image, "vastra_products", `product_${uniqueId}`);
    }

    const { qrCode, qrData } = await generateProductQRCode({
      uniqueId,
      code,
      name: name.trim(),
      category: category || "Silk",
      fabric: fabric || "Handloom Silk",
      weave: weave || "Hand Woven",
      price: Number(price),
      manufacturerId: mfrId
    });

    const newProduct = await ProductModel.create({
      manufacturerId: mfrId,
      uniqueId,
      code,
      name: name.trim(),
      category: category || "Silk",
      fabric: fabric || "Pure Silk",
      weave: weave || "Hand Woven",
      price: Number(price),
      stock: stockNum,
      maxStock: Number(maxStock) || 20,
      status: stockNum > 5 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock",
      image: imageUrl,
      featured: Boolean(featured),
      description: description ? description.trim() : "",
      artisan: artisan || mfrId,
      artisanName: artisanName || formatWeaverName(mfrId),
      origin: origin || "",
      tag: tag || "Silk Mark Certified",
      qrCode,
      qrData
    });

    return res.status(201).json({
      status: "success",
      message: "Product created with Cloudinary image and QR Code successfully",
      data: newProduct
    });
  } catch (error) {
    console.error("Product Create Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 4. UPDATE product with Cloudinary image upload
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.stock !== undefined) {
      const stockNum = Number(updateData.stock);
      updateData.stock = stockNum;
      updateData.status = stockNum > 5 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock";
    }

    let existing = mongoose.Types.ObjectId.isValid(id)
      ? await ProductModel.findById(id)
      : await ProductModel.findOne({ _id: id });

    if (!existing) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    const uniqueId = existing.uniqueId || generateUniqueId(updateData.category || existing.category);
    updateData.uniqueId = uniqueId;

    // Upload new image to Cloudinary if Base64
    if (updateData.image && typeof updateData.image === "string" && updateData.image.trim()) {
      if (!updateData.image.startsWith("http://") && !updateData.image.startsWith("https://")) {
        updateData.image = await uploadToCloudinary(
          updateData.image,
          "vastra_products",
          `product_${uniqueId}`
        );
      }
    }

    const { qrCode, qrData } = await generateProductQRCode({
      uniqueId,
      code: updateData.code || existing.code,
      name: updateData.name || existing.name,
      category: updateData.category || existing.category,
      fabric: updateData.fabric || existing.fabric,
      weave: updateData.weave || existing.weave,
      price: updateData.price || existing.price,
      manufacturerId: updateData.manufacturerId || existing.manufacturerId
    });
    updateData.qrCode = qrCode;
    updateData.qrData = qrData;

    let updated = await ProductModel.findByIdAndUpdate(existing._id, updateData, { new: true });

    return res.json({
      status: "success",
      message: "Product updated with Cloudinary image successfully",
      data: updated
    });
  } catch (error) {
    console.error("Product Update Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
