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

    const items = await ProductModel.find(query).sort({ createdAt: -1 });

    const formatted = await Promise.all(
      items.map(async (doc) => {
        const item = doc.toObject ? doc.toObject() : doc;
        let uniqueId = item.uniqueId;
        let qrCode = item.qrCode;
        let qrData = item.qrData;

        if (!uniqueId || !qrCode) {
          if (!uniqueId) uniqueId = generateUniqueId(item.category || "Silk");
          const generated = await generateProductQRCode({
            uniqueId,
            code: item.code || `KW-${(item.category || "GEN").slice(0, 3).toUpperCase()}-001`,
            name: item.name,
            category: item.category,
            fabric: item.fabric,
            weave: item.weave,
            price: item.price,
            manufacturerId: item.manufacturerId || item.artisan || "kathar_weaves"
          });
          qrCode = generated.qrCode;
          qrData = generated.qrData;

          ProductModel.updateOne(
            { _id: item._id },
            { $set: { uniqueId, qrCode, qrData } }
          ).catch((e) => console.error("Backfill error:", e));
        }

        const artisanNameClean = formatWeaverName(item.artisanName || item.artisan || item.manufacturerId);

        return {
          ...item,
          artisan: artisanNameClean,
          artisanName: artisanNameClean,
          weaver: artisanNameClean,
          uniqueId,
          qrCode,
          qrData
        };
      })
    );

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

    let item = await ProductModel.findOne({ $or: searchConditions });

    // Fallback: search by partial uniqueId or name
    if (!item) {
      item = await ProductModel.findOne({
        $or: [
          { uniqueId: { $regex: new RegExp(rawId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") } },
          { name: { $regex: new RegExp(rawId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") } }
        ]
      });
    }

    if (!item) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    let pObj = item.toObject ? item.toObject() : item;
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

module.exports = router;
