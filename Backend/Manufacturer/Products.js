const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Schema for 'Products' collection
const productSchema = new mongoose.Schema(
  {
    manufacturerId: { type: String, required: true },
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
        { fabric: { $regex: s, $options: "i" } },
        { weave: { $regex: s, $options: "i" } }
      ];
    }

    const items = await ProductModel.find(query).sort({ createdAt: -1 });

    const formatted = items.map((doc) => {
      const p = doc.toObject ? doc.toObject() : doc;
      const stock = Number(p.stock) || 0;
      return {
        id: p._id,
        _id: p._id,
        manufacturerId: p.manufacturerId || "kathar_weaves",
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
        createdAt: p.createdAt || new Date()
      };
    });

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

// GET single product by ID from DB
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await ProductModel.findById(id);
    } else {
      product = await ProductModel.findOne({ _id: id });
    }

    if (!product) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    return res.json({ status: "success", data: product });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// CREATE new product in DB with manufacturerId
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
    const stockNum = Number(stock) || 1;

    const newProduct = await ProductModel.create({
      manufacturerId: mfrId,
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
      description: description ? description.trim() : ""
    });

    return res.status(201).json({
      status: "success",
      message: "Product created in database successfully",
      data: newProduct
    });
  } catch (error) {
    console.error("Product Create Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// UPDATE product in DB
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.stock !== undefined) {
      const stockNum = Number(updateData.stock);
      updateData.stock = stockNum;
      updateData.status = stockNum > 5 ? "In Stock" : stockNum > 0 ? "Low Stock" : "Out of Stock";
    }

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      updated = await ProductModel.findOneAndUpdate({ _id: id }, updateData, { new: true });
    }

    if (!updated) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

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
