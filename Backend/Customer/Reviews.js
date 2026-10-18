const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const reviewSchema = new mongoose.Schema(
  {
    reviewId: { type: String, required: true },
    artisanName: { type: String, required: true },
    manufacturer: { type: String, default: "" },
    customerName: { type: String, default: "Patron" },
    customerEmail: { type: String, default: "" },
    orderId: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    craftsmanshipRating: { type: Number, default: 5, min: 1, max: 5 },
    communicationRating: { type: Number, default: 5, min: 1, max: 5 },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: true },
    productContext: { type: String, default: "Handloom Saree" },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "Reviews", timestamps: true, strict: false }
);

const ReviewModel =
  mongoose.models.Review ||
  mongoose.model("Review", reviewSchema, "Reviews");

// GET reviews
router.get("/", async (req, res) => {
  try {
    const { artisanName, manufacturer } = req.query;
    let query = {};
    if (artisanName) query.artisanName = { $regex: new RegExp(artisanName.trim(), "i") };
    if (manufacturer) query.manufacturer = { $regex: new RegExp(manufacturer.trim(), "i") };

    const reviews = await ReviewModel.find(query).sort({ createdAt: -1 }).lean();

    return res.json({ status: "success", count: reviews.length, data: reviews });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// POST submit review
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const reviewId = `REV-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const newRev = await ReviewModel.create({
      ...payload,
      reviewId,
      customerName: payload.customerName || "Patron",
      createdAt: new Date()
    });

    return res.status(201).json({ status: "success", message: "Review submitted successfully", data: newRev });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
