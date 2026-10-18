const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    deliveryAddress: { type: String, default: "" },
    manufacturer: { type: String, default: "" },
    artisanName: { type: String, default: "" },
    loomType: { type: String, default: "Traditional Pit Loom" },
    fabricChoice: { type: String, default: "" },
    zariType: { type: String, default: "" },
    customPattern: { type: String, default: "" },
    bodyColor: { type: String, default: "" },
    borderColor: { type: String, default: "" },
    dimensions: { type: String, default: "Standard 6.3m (with blouse)" },
    notes: { type: String, default: "" },
    bookingDate: { type: String, default: "" },
    targetCompletion: { type: String, default: "In 3-4 Weeks" },
    status: { type: String, default: "Custom Request Confirmed" },
    currentStage: { type: Number, default: 1 },
    stages: { type: Array, default: [] },
    advancePaid: { type: String, default: "₹3,000" },
    estimatedPrice: { type: String, default: "₹14,500" },
    balanceDue: { type: String, default: "₹11,500" },
    paymentMethod: { type: String, default: "UPI / Escrow" },
    transactionId: { type: String, default: "" },
    paymentStatus: { type: String, default: "Advance Paid" },
    image: { type: String, default: "/images/kanchi.png" },
    designId: { type: String, default: "" },
    designDetails: { type: Object },
    isReviewed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "Bookings", timestamps: true, strict: false }
);

const BookingModel =
  mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema, "Bookings");

const getCustomLoomStages = (currentStage = 1) => [
  { name: "Custom Request Confirmed", desc: "Design specs reviewed by master weaver", completed: currentStage >= 1, date: currentStage >= 1 ? "Completed" : "Upcoming" },
  { name: "Mulberry Silk Dyeing", desc: "Natural botanical dye formulation & yarn extraction", completed: currentStage >= 2, date: currentStage >= 2 ? "Completed" : "Upcoming" },
  { name: "Loom Setup & Warping", desc: "Warp beam drafted with high-density dents", completed: currentStage >= 3, date: currentStage >= 3 ? "Completed" : "Upcoming" },
  { name: "Master Artisan Weaving", desc: "Korvai 3-shuttle interlocking & zari border weaving", completed: currentStage >= 4, date: currentStage >= 4 ? "Completed" : "Upcoming" },
  { name: "Finishing & Loom Cut", desc: "Saree woven to completion & inspected off the loom", completed: currentStage >= 5, date: currentStage >= 5 ? "Completed" : "Upcoming" },
  { name: "Silk Mark Insured Dispatch", desc: "Special heirloom packaging with certificate", completed: currentStage >= 6, date: currentStage >= 6 ? "Completed" : "Upcoming" },
  { name: "Delivered & Handover", desc: "Bespoke saree delivered to patron", completed: currentStage >= 7, date: currentStage >= 7 ? "Delivered" : "Upcoming" }
];

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const rawEmail = req.query.customerEmail || "";
    const customerEmail = rawEmail.trim();

    let query = {};
    if (customerEmail && customerEmail !== "all") {
      query.customerEmail = { $regex: new RegExp(`^${customerEmail}$`, "i") };
    }

    const list = await BookingModel.find(query).sort({ createdAt: -1 }).lean();

    return res.json({ status: "success", count: list.length, data: list });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// GET single booking
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : { $or: [{ _id: id }, { id: id }, { bookingId: id }] };

    const booking = await BookingModel.findOne(filter).lean();
    if (!booking) {
      return res.status(404).json({ status: "error", message: "Booking not found" });
    }

    return res.json({ status: "success", data: booking });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// POST create custom loom booking
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const count = await BookingModel.countDocuments();
    const bookingId = payload.bookingId || `BK-${501 + count}`;
    const generatedTxn =
      payload.transactionId || `TXN-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    const newBooking = await BookingModel.create({
      ...payload,
      bookingId,
      customerEmail: (payload.customerEmail || "").trim().toLowerCase(),
      customerName: (payload.customerName || "").trim(),
      customerPhone: payload.customerPhone || "",
      deliveryAddress: payload.deliveryAddress || payload.shippingAddress || payload.address || "",
      manufacturer: payload.manufacturer || "",
      artisanName: payload.artisanName || "",
      bookingDate:
        payload.bookingDate ||
        new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Custom Request Confirmed",
      currentStage: 1,
      stages: getCustomLoomStages(1),
      advancePaid: payload.advancePaid || "₹3,000",
      estimatedPrice: payload.estimatedPrice || "₹14,500",
      balanceDue: payload.balanceDue || "₹11,500",
      paymentMethod: payload.paymentMethod || "UPI / Escrow",
      transactionId: generatedTxn,
      paymentStatus: "Advance Paid",
      image: payload.designImage || payload.imageUrl || payload.image || "/images/kanchi.png",
      designId: payload.designId || "",
      designDetails: payload.designDetails || null,
      isReviewed: false
    });

    return res.status(201).json({ status: "success", message: "Loom slot booked successfully", data: newBooking });
  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
