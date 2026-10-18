const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const wishlistSchema = new mongoose.Schema(
  {
    customerId: { type: String, default: "" },
    userId: { type: String, default: "" },
    customerEmail: { type: String, default: "" },
    productId: { type: String, required: true },
    code: { type: String, default: "" },
    name: { type: String, required: true },
    category: { type: String, default: "Silk" },
    fabric: { type: String, default: "Pure Silk" },
    weave: { type: String, default: "Hand Woven" },
    price: { type: Number, required: true },
    image: { type: String, default: "/images/kanchi.png" },
    artisan: { type: String, default: "" },
    artisanName: { type: String, default: "" },
    tag: { type: String, default: "Silk Mark Certified" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "Wishlist", timestamps: true, strict: false }
);

const WishlistModel =
  mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema, "Wishlist");

// Helper to build customer matching filter
const buildCustomerFilter = (idOrEmail) => {
  if (!idOrEmail) return {};
  const cleaned = String(idOrEmail).trim();
  return {
    $or: [
      { customerId: { $regex: new RegExp(`^${cleaned}$`, "i") } },
      { customerEmail: { $regex: new RegExp(`^${cleaned}$`, "i") } },
      { userId: { $regex: new RegExp(`^${cleaned}$`, "i") } },
      { customerId: cleaned },
      { customerEmail: cleaned },
      { userId: cleaned }
    ]
  };
};

// 1. GET all liked products for a customer from Wishlist/WishList collection
router.get("/", async (req, res) => {
  try {
    const rawId = req.query.customerId || req.query.customerEmail || req.query.userId || req.query.email || "";
    const customerIdentifier = rawId.trim();

    if (!customerIdentifier) {
      return res.json({ status: "success", count: 0, data: [] });
    }

    const customerQuery = buildCustomerFilter(customerIdentifier);

    // 1. Fetch from standard Wishlist collection
    let items = [];
    try {
      items = await WishlistModel.find(customerQuery)
        .sort({ createdAt: -1 })
        .lean();
    } catch (e) {
      console.warn("WishlistModel find warning:", e.message);
    }

    // 2. Fetch from 'WishList' collection if exists
    let altItems = [];
    try {
      const altCollection = mongoose.connection.collection("WishList");
      altItems = await altCollection
        .find(customerQuery)
        .sort({ createdAt: -1 })
        .toArray();
    } catch {}

    // Combine and deduplicate by productId
    const combined = [...(items || []), ...(altItems || [])];
    const seenMap = new Map();
    const deduped = [];

    for (const item of combined) {
      const pKey = String(item.productId || item.code || item._id);
      if (!seenMap.has(pKey)) {
        seenMap.set(pKey, true);
        deduped.push(item);
      }
    }

    return res.json({
      status: "success",
      count: deduped.length,
      data: deduped
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 2. GET single liked product by productId
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const rawId = req.query.customerId || req.query.customerEmail || req.query.userId || req.query.email || "";
    const customerIdentifier = rawId.trim();

    let filter = {
      $or: [
        { productId: String(productId) },
        { code: String(productId) },
        { _id: mongoose.Types.ObjectId.isValid(productId) ? productId : null }
      ]
    };

    if (customerIdentifier) {
      filter.$and = [buildCustomerFilter(customerIdentifier)];
    }

    let item = await WishlistModel.findOne(filter).lean();
    if (!item) {
      try {
        const altCollection = mongoose.connection.collection("WishList");
        item = await altCollection.findOne(filter);
      } catch {}
    }

    if (!item) {
      return res.status(404).json({ status: "error", message: "Item not in Wishlist" });
    }

    return res.json({ status: "success", data: item });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 3. POST add or toggle product in Wishlist collection
router.post("/", async (req, res) => {
  try {
    const { customerId, customerEmail, userId, email, product, productId } = req.body;
    const custId = String(customerId || userId || customerEmail || email || "").trim();
    const custEmail = String(customerEmail || email || customerId || "").trim().toLowerCase();
    const prodId = String(productId || product?.id || product?._id || product?.code || "");

    if (!custId || !prodId) {
      return res.status(400).json({
        status: "error",
        message: "Customer ID/Email and productId are required"
      });
    }

    const customerMatch = buildCustomerFilter(custId);
    const existingQuery = {
      $and: [
        customerMatch,
        {
          $or: [
            { productId: prodId },
            { code: prodId },
            { _id: mongoose.Types.ObjectId.isValid(prodId) ? prodId : null }
          ]
        }
      ]
    };

    // Check if already liked in Wishlist or WishList collection
    const existing = await WishlistModel.findOne(existingQuery);

    if (existing) {
      await WishlistModel.deleteMany(existingQuery);
      try {
        await mongoose.connection.collection("WishList").deleteMany(existingQuery);
      } catch {}

      return res.json({
        status: "success",
        action: "removed",
        message: "Product removed from Wishlist collection",
        productId: prodId
      });
    }

    const priceNum = typeof product?.price === "number" ? product.price : Number(product?.price) || 0;

    const newWishData = {
      customerId: custId,
      userId: custId,
      customerEmail: custEmail || custId,
      productId: prodId,
      code: product?.code || prodId,
      name: product?.name || "Handloom Saree",
      category: product?.category || "Silk",
      fabric: product?.fabric || "Pure Silk",
      weave: product?.weave || "Hand Woven",
      price: priceNum,
      image: product?.image || "/images/kanchi.png",
      artisan: product?.artisan || "",
      artisanName: product?.artisanName || "",
      tag: product?.tag || "Silk Mark Certified",
      description: product?.description || "",
      createdAt: new Date()
    };

    const newWish = await WishlistModel.create(newWishData);

    // Also mirror to WishList collection for maximum compatibility
    try {
      await mongoose.connection.collection("WishList").insertOne({
        ...newWishData,
        _id: newWish._id
      });
    } catch {}

    return res.status(201).json({
      status: "success",
      action: "added",
      message: "Product saved in Wishlist collection",
      data: newWish
    });
  } catch (error) {
    console.error("Save Wishlist Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 4. DELETE product from Wishlist collection
router.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const rawId = req.query.customerId || req.query.customerEmail || req.query.userId || req.body?.customerId || req.body?.customerEmail || "";
    const customerIdentifier = rawId.trim();

    let query = {
      $or: [
        { productId: String(productId) },
        { code: String(productId) },
        { _id: mongoose.Types.ObjectId.isValid(productId) ? productId : null }
      ]
    };

    if (customerIdentifier) {
      query.$and = [buildCustomerFilter(customerIdentifier)];
    }

    const deleted = await WishlistModel.findOneAndDelete(query);
    try {
      await mongoose.connection.collection("WishList").deleteMany(query);
    } catch {}

    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Product not found in Wishlist" });
    }

    return res.json({
      status: "success",
      message: "Product removed from Wishlist collection",
      data: deleted
    });
  } catch (error) {
    console.error("Delete Wishlist Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
