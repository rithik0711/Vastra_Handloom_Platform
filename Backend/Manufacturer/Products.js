const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const QRCode = require("qrcode");
const router = express.Router();

const os = require("os");

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
        dark: "#4A1525", // Authentic Maroon Brand Color
        light: "#FFFFFF"
      }
    });

    return { qrCode: qrDataUrl, qrData: mobileProductUrl, qrUrl: mobileProductUrl };
  } catch (err) {
    console.error("QR Code Generation Error:", err);
    return { qrCode: "", qrData: "", qrUrl: "" };
  }
};

// Schema for 'Products' collection
const productSchema = new mongoose.Schema(
  {
    manufacturerId: { type: String, required: true },
    uniqueId: { type: String, index: true },
    code: { type: String },
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
    qrCode: { type: String, default: "" },
    qrData: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
  },
  {
    collection: "Products",
    timestamps: true,
    strict: false
  }
);

const ProductModel =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema, "Products");

// GET all products by manufacturerId from DB
router.get("/", async (req, res) => {
  try {
    const { category, search, manufacturerId } = req.query;

    let query = {};
    if (manufacturerId && manufacturerId.trim() && manufacturerId !== "All") {
      query.manufacturerId = { $regex: new RegExp(`^${manufacturerId.trim()}$`, "i") };
    }
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: "i" } },
        { code: { $regex: s, $options: "i" } },
        { uniqueId: { $regex: s, $options: "i" } },
        { fabric: { $regex: s, $options: "i" } },
        { weave: { $regex: s, $options: "i" } }
      ];
    }

    const items = await ProductModel.find(query).sort({ createdAt: -1 });

    const formatted = await Promise.all(
      items.map(async (doc) => {
        const p = doc.toObject ? doc.toObject() : doc;
        const stock = Number(p.stock) || 0;
        let uniqueId = p.uniqueId;
        let qrCode = p.qrCode;
        let qrData = p.qrData;

        // Auto-backfill if uniqueId or qrCode is missing
        if (!uniqueId || !qrCode) {
          if (!uniqueId) {
            uniqueId = generateUniqueId(p.category || "Silk");
          }
          const generated = await generateProductQRCode({
            uniqueId,
            code: p.code || `KW-${(p.category || "GEN").slice(0, 3).toUpperCase()}-001`,
            name: p.name,
            category: p.category,
            fabric: p.fabric,
            weave: p.weave,
            price: p.price,
            manufacturerId: p.manufacturerId || "kathar_weaves"
          });
          qrCode = generated.qrCode;
          qrData = generated.qrData;

          // Asynchronously update in DB
          ProductModel.updateOne(
            { _id: p._id },
            { $set: { uniqueId, qrCode, qrData } }
          ).catch((e) => console.error("Backfill error:", e));
        }

        return {
          id: p._id,
          _id: p._id,
          manufacturerId: p.manufacturerId || "kathar_weaves",
          uniqueId,
          code: p.code || `KW-${(p.category || "GEN").slice(0, 3).toUpperCase()}-001`,
          name: p.name || "Handloom Saree",
          category: p.category || "Silk",
          fabric: p.fabric || "Pure Silk",
          weave: p.weave || "Hand Woven",
          price: typeof p.price === "number" ? p.price : Number(p.price) || 0,
          stock,
          maxStock: Number(p.maxStock) || 20,
          status: stock > 5 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock",
          image: p.image || "",
          featured: Boolean(p.featured),
          description: p.description || "",
          qrCode,
          qrData,
          createdAt: p.createdAt || new Date()
        };
      })
    );

    return res.json({
      status: "success",
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error("Products Fetch Error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// GET single product by ID / uniqueId / code from DB
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

    let product = await ProductModel.findOne({ $or: searchConditions });

    if (!product) {
      product = await ProductModel.findOne({
        $or: [
          { uniqueId: { $regex: new RegExp(rawId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") } },
          { name: { $regex: new RegExp(rawId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") } }
        ]
      });
    }

    if (!product) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    let pObj = product.toObject ? product.toObject() : product;
    if (!pObj.uniqueId || !pObj.qrCode) {
      if (!pObj.uniqueId) pObj.uniqueId = generateUniqueId(pObj.category || "Silk");
      const generated = await generateProductQRCode({
        uniqueId: pObj.uniqueId,
        code: pObj.code,
        name: pObj.name,
        category: pObj.category,
        fabric: pObj.fabric,
        weave: pObj.weave,
        price: pObj.price,
        manufacturerId: pObj.manufacturerId
      });
      pObj.qrCode = generated.qrCode;
      pObj.qrData = generated.qrData;
      await ProductModel.updateOne(
        { _id: product._id },
        { $set: { uniqueId: pObj.uniqueId, qrCode: pObj.qrCode, qrData: pObj.qrData } }
      );
    }

    return res.json({ status: "success", data: pObj });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// CREATE new product in DB with unique ID and QR Code
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
      manufacturerId
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ status: "error", message: "Name and price are required" });
    }

    const mfrId = manufacturerId || "kathar_weaves";
    const count = await ProductModel.countDocuments({ manufacturerId: mfrId });
    const categoryPrefix = (category || "SILK").slice(0, 3).toUpperCase();
    const code = `KW-${categoryPrefix}-${String(count + 1).padStart(3, "0")}`;
    const uniqueId = generateUniqueId(category);
    const stockNum = Number(stock) || 1;

    // Generate authentic QR code Data URL containing product info and authenticity verification
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
      fabric: fabric || "Handloom Silk",
      weave: weave || "Hand Woven",
      price: Number(price),
      stock: stockNum,
      maxStock: Number(maxStock) || 20,
      status: stockNum > 5 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock",
      image: image || "",
      featured: Boolean(featured),
      description: description ? description.trim() : "",
      qrCode,
      qrData
    });

    return res.status(201).json({
      status: "success",
      message: "Product created in database with unique ID & QR Code successfully",
      data: newProduct
    });
  } catch (error) {
    console.error("Product Create Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// UPDATE product in DB (re-generates QR code if name/price/category change)
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

    // Refresh QR Code with updated details
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
      message: "Product updated in database successfully",
      data: updated
    });
  } catch (error) {
    console.error("Product Update Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE product from DB
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await ProductModel.findByIdAndDelete(id);
    } else {
      deleted = await ProductModel.findOneAndDelete({ _id: id });
    }

    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    return res.json({
      status: "success",
      message: "Product deleted from database successfully",
      data: deleted
    });
  } catch (error) {
    console.error("Product Delete Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
