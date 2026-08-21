const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// MongoDB Schemas
const customerOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String },
    customerEmail: { type: String, default: "customer@example.com" },
    product: { type: String, required: true },
    manufacturer: { type: String, default: "Kathar Weaves" },
    price: { type: Number, required: true },
    amount: { type: String },
    orderDate: { type: String },
    status: { type: String, default: "Order Confirmed" },
    estimatedDelivery: { type: String, default: "In 14 Days" },
    image: { type: String, default: "/images/kanchi.png" },
    currentStage: { type: Number, default: 1 },
    stages: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "Orders", timestamps: true, strict: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String },
    customerEmail: { type: String, default: "customer@example.com" },
    manufacturer: { type: String, default: "Kathar Weaves" },
    loomType: { type: String, default: "Traditional Pit Loom" },
    fabricChoice: { type: String, default: "Pure Silk & Zari" },
    customPattern: { type: String, default: "Custom Motif" },
    bookingDate: { type: String },
    targetCompletion: { type: String, default: "In 3 Weeks" },
    status: { type: String, default: "Confirmed" },
    advancePaid: { type: String, default: "₹3,000" },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "Bookings", timestamps: true, strict: false }
);

const manufacturerSchema = new mongoose.Schema(
  {
    businessName: { type: String },
    name: { type: String },
    ownerName: { type: String },
    email: { type: String },
    location: { type: String },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 120 },
    specialization: { type: String },
    experience: { type: String },
    image: { type: String, default: "/images/kathar.png" },
    verified: { type: Boolean, default: true },
    activeLooms: { type: Number, default: 18 }
  },
  { collection: "Manufacturer", timestamps: true, strict: false }
);

const CustomerOrderModel =
  mongoose.models.CustomerOrder ||
  mongoose.model("CustomerOrder", customerOrderSchema, "Orders");

const BookingModel =
  mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema, "Bookings");

const ManufacturerModel =
  mongoose.models.Manufacturer ||
  mongoose.model("Manufacturer", manufacturerSchema, "Manufacturer");

// GET customer orders from DB
router.get("/orders", async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email && email.trim()) {
      query.customerEmail = { $regex: new RegExp(`^${email.trim()}$`, "i") };
    }
    const orders = await CustomerOrderModel.find(query).sort({ createdAt: -1 });

    const formatted = orders.map((o) => {
      const item = o.toObject ? o.toObject() : o;
      return {
        id: item.orderId || item._id,
        _id: item._id,
        product: item.product || "Handcrafted Silk Saree",
        manufacturer: item.manufacturer || item.businessName || "Kathar Weaves",
        price: item.price || 8500,
        amount: item.amount || `₹${Number(item.price || 8500).toLocaleString("en-IN")}`,
        orderDate: item.date || item.orderDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: item.status || "In Production",
        estimatedDelivery: item.estimatedDelivery || "In 14 Days",
        image: item.image || "/images/kanchi.png",
        currentStage: item.currentStage || 2,
        stages: item.stages && item.stages.length > 0 ? item.stages : [
          { name: "Order Confirmed", completed: true, date: "Completed" },
          { name: "Yarn Preparation", completed: true, date: "In Progress" },
          { name: "Loom Weaving", completed: false, date: "Upcoming" },
          { name: "Quality Check", completed: false, date: "Upcoming" },
          { name: "Dispatched", completed: false, date: "Upcoming" }
        ]
      };
    });

    return res.json({
      status: "success",
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error("Customer Orders Fetch Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// POST place customer order in DB
router.post("/orders", async (req, res) => {
  try {
    const {
      product,
      price,
      manufacturer,
      image,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      address,
      city,
      state,
      pincode
    } = req.body;
    const count = await CustomerOrderModel.countDocuments();
    const orderId = `ORD-${1000 + count}`;
    const cAddress = address || shippingAddress || "Flat 402, Lotus Residency, Indiranagar";
    const cCity = city || "Bengaluru";
    const cState = state || "Karnataka";
    const cPin = pincode || "560038";
    const fullAddr = shippingAddress || `${cAddress}, ${cCity}, ${cState} - ${cPin}`;

    const newOrder = await CustomerOrderModel.create({
      manufacturerId: (manufacturer || "Kathar Weaves").toLowerCase().replace(/\s+/g, "_"),
      orderId,
      customer: customerName || "Ananya Deshmukh",
      customerEmail: customerEmail || "customer@example.com",
      customerPhone: customerPhone || "+91 98451 23456",
      address: cAddress,
      city: cCity,
      state: cState,
      pincode: cPin,
      deliveryAddress: fullAddr,
      product: product || "Handcrafted Silk Saree",
      manufacturer: manufacturer || "Kathar Weaves",
      price: Number(price) || 8500,
      amount: `₹${Number(price || 8500).toLocaleString("en-IN")}`,
      orderDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Order Confirmed",
      estimatedDelivery: "In 14 Days",
      image: image || "/images/kanchi.png",
      currentStage: 1,
      stages: [
        { name: "Order Confirmed", completed: true, date: "Today" },
        { name: "Yarn Preparation", completed: false, date: "Upcoming" },
        { name: "Loom Weaving", completed: false, date: "Upcoming" },
        { name: "Finishing & QC", completed: false, date: "Upcoming" },
        { name: "Dispatched", completed: false, date: "Upcoming" }
      ]
    });

    return res.status(201).json({
      status: "success",
      message: "Order placed successfully in database",
      data: newOrder
    });
  } catch (error) {
    console.error("Customer Order Place Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// GET manufacturers directory from DB
router.get("/manufacturers", async (req, res) => {
  try {
    const items = await ManufacturerModel.find({}).sort({ rating: -1 });

    const formatted = items.map((m) => {
      const doc = m.toObject ? m.toObject() : m;
      return {
        id: doc._id,
        _id: doc._id,
        name: doc.businessName || doc.name || "Handloom Weaves",
        artisanName: doc.ownerName || "Master Weaver",
        location: doc.location || "Tamil Nadu, India",
        rating: doc.rating || 4.9,
        reviewsCount: doc.reviewsCount || 100,
        specialization: doc.specialization || "Handloom Silk & Cotton",
        experience: doc.experience || "15+ Years",
        image: doc.image || "/images/kathar.png",
        verified: doc.verified !== false,
        activeLooms: doc.loomsActive || doc.activeLooms || 18
      };
    });

    return res.json({
      status: "success",
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error("Manufacturers Fetch Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// GET loom bookings from DB
router.get("/bookings", async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email && email.trim()) {
      query.customerEmail = { $regex: new RegExp(`^${email.trim()}$`, "i") };
    }
    const bookings = await BookingModel.find(query).sort({ createdAt: -1 });

    return res.json({
      status: "success",
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error("Bookings Fetch Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// POST loom booking in DB
router.post("/bookings", async (req, res) => {
  try {
    const { manufacturer, loomType, fabricChoice, customPattern, targetCompletion, customerEmail } = req.body;
    const count = await BookingModel.countDocuments();
    const bookingId = `BK-${500 + count}`;

    const newBooking = await BookingModel.create({
      bookingId,
      customerEmail: customerEmail || "customer@example.com",
      manufacturer: manufacturer || "Kathar Weaves",
      loomType: loomType || "Traditional Pit Loom",
      fabricChoice: fabricChoice || "Pure Silk & Zari",
      customPattern: customPattern || "Custom Motif",
      bookingDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      targetCompletion: targetCompletion || "In 3 Weeks",
      status: "Confirmed",
      advancePaid: "₹3,000"
    });

    return res.status(201).json({
      status: "success",
      message: "Loom slot booked successfully in database",
      data: newBooking
    });
  } catch (error) {
    console.error("Booking Create Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
