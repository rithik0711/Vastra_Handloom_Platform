const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// MongoDB Schemas
const customerOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String },
    customerEmail: { type: String, default: "customer@example.com" },
    customer: { type: String, default: "Ananya Deshmukh" },
    customerPhone: { type: String, default: "+91 98451 23456" },
    product: { type: String, required: true },
    manufacturer: { type: String, default: "Kathar Weaves" },
    manufacturerId: { type: String, default: "kathar_weaves" },
    artisanName: { type: String, default: "Rithikeswaran M" },
    price: { type: Number, required: true },
    amount: { type: String },
    orderDate: { type: String },
    status: { type: String, default: "Order Placed" },
    estimatedDelivery: { type: String, default: "In 7-10 Days" },
    image: { type: String, default: "/images/kanchi.png" },
    currentStage: { type: Number, default: 1 },
    stages: { type: Array, default: [] },
    deliveryAddress: { type: String },
    paymentMethod: { type: String, default: "UPI / Online" },
    transactionId: { type: String },
    paymentStatus: { type: String, default: "Paid" },
    isReviewed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "Orders", timestamps: true, strict: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String },
    customerEmail: { type: String, default: "customer@example.com" },
    customerName: { type: String, default: "Ananya Deshmukh" },
    customerPhone: { type: String, default: "+91 98451 23456" },
    deliveryAddress: { type: String },
    manufacturer: { type: String, default: "Kathar Weaves" },
    artisanName: { type: String, default: "Rithikeswaran M" },
    loomType: { type: String, default: "Traditional Pit Loom" },
    fabricChoice: { type: String, default: "Pure Mulberry Silk & Gold Zari" },
    zariType: { type: String, default: "Tested Half-Fine Gold Zari" },
    customPattern: { type: String, default: "Custom Motif" },
    bodyColor: { type: String, default: "Royal Crimson Red" },
    borderColor: { type: String, default: "Temple Gold Border" },
    dimensions: { type: String, default: "Standard 6.3m (with blouse)" },
    notes: { type: String, default: "" },
    bookingDate: { type: String },
    targetCompletion: { type: String, default: "In 3 Weeks" },
    status: { type: String, default: "Warp Planned" },
    currentStage: { type: Number, default: 1 },
    stages: { type: Array, default: [] },
    advancePaid: { type: String, default: "₹3,000" },
    estimatedPrice: { type: String, default: "₹14,500" },
    balanceDue: { type: String, default: "₹11,500" },
    paymentMethod: { type: String, default: "UPI / Escrow" },
    transactionId: { type: String },
    paymentStatus: { type: String, default: "Advance Paid" },
    isReviewed: { type: Boolean, default: false },
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
    activeLooms: { type: Number, default: 18 },
    description: { type: String }
  },
  { collection: "Manufacturer", timestamps: true, strict: false }
);

const reviewSchema = new mongoose.Schema(
  {
    reviewId: { type: String },
    artisanName: { type: String, required: true },
    manufacturer: { type: String, default: "Kathar Weaves" },
    customerName: { type: String, default: "Verified Patron" },
    customerEmail: { type: String, default: "customer@example.com" },
    orderId: { type: String },
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

const CustomerOrderModel =
  mongoose.models.CustomerOrder ||
  mongoose.model("CustomerOrder", customerOrderSchema, "Orders");

const BookingModel =
  mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema, "Bookings");

const ManufacturerModel =
  mongoose.models.Manufacturer ||
  mongoose.model("Manufacturer", manufacturerSchema, "Manufacturer");

const ReviewModel =
  mongoose.models.Review ||
  mongoose.model("Review", reviewSchema, "Reviews");

// Ready-made default 5-stage workflow
const getReadyMadeStages = (currentStage = 1) => [
  { name: "Order Placed & Confirmed", desc: "Artisan received order and validated inventory", completed: currentStage >= 1, date: currentStage >= 1 ? "Completed" : "Upcoming" },
  { name: "Artisan Quality Inspection", desc: "Saree inspected, measured & finished by master weaver", completed: currentStage >= 2, date: currentStage >= 2 ? "Completed" : "Upcoming" },
  { name: "Silk Mark & GI Tagging", desc: "Authenticity QR code and Silk Mark certified seal attached", completed: currentStage >= 3, date: currentStage >= 3 ? "Completed" : "Upcoming" },
  { name: "Handloom Express Dispatched", desc: "Courier package in transit with tracking insurance", completed: currentStage >= 4, date: currentStage >= 4 ? "Completed" : "Upcoming" },
  { name: "Delivered to Doorstep", desc: "Package handed over safely to patron", completed: currentStage >= 5, date: currentStage >= 5 ? "Delivered" : "Upcoming" }
];

// Custom Bespoke Loom default 7-stage workflow
const getCustomLoomStages = (currentStage = 1) => [
  { name: "Custom Request Confirmed", desc: "Design specs reviewed by master weaver", completed: currentStage >= 1, date: currentStage >= 1 ? "Completed" : "Upcoming" },
  { name: "Mulberry Silk Dyeing", desc: "Natural botanical dye formulation & yarn extraction", completed: currentStage >= 2, date: currentStage >= 2 ? "Completed" : "Upcoming" },
  { name: "Loom Setup & Warping", desc: "Warp beam drafted with 104 dents/inch density", completed: currentStage >= 3, date: currentStage >= 3 ? "Completed" : "Upcoming" },
  { name: "Master Artisan Weaving", desc: "Korvai 3-shuttle interlocking & zari border weaving", completed: currentStage >= 4, date: currentStage >= 4 ? "Completed" : "Upcoming" },
  { name: "Finishing & Loom Cut", desc: "Saree woven to completion & inspected off the loom", completed: currentStage >= 5, date: currentStage >= 5 ? "Completed" : "Upcoming" },
  { name: "Silk Mark Insured Dispatch", desc: "Special heirloom packaging with artisan certificate", completed: currentStage >= 6, date: currentStage >= 6 ? "Completed" : "Upcoming" },
  { name: "Delivered & Artisan Handover", desc: "Bespoke saree delivered to patron", completed: currentStage >= 7, date: currentStage >= 7 ? "Delivered" : "Upcoming" }
];

// ============================================================================
// ORDERS (READY-MADE)
// ============================================================================

// GET all customer orders
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
      const currentStage = item.currentStage || (item.status === "Delivered" ? 5 : item.status === "Dispatched" ? 4 : 2);
      return {
        id: item.orderId || item._id,
        _id: item._id,
        orderId: item.orderId || `ORD-${String(item._id).slice(-4).toUpperCase()}`,
        product: item.product || "Handcrafted Silk Saree",
        manufacturer: item.manufacturer || item.businessName || "Kathar Weaves",
        artisanName: item.artisanName || "Master Weaver Rithikeswaran M",
        price: item.price || 8500,
        amount: item.amount || `₹${Number(item.price || 8500).toLocaleString("en-IN")}`,
        orderDate: item.date || item.orderDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: item.status || "Order Confirmed",
        estimatedDelivery: item.estimatedDelivery || "In 7-10 Days",
        image: item.image || "/images/kanchi.png",
        currentStage: currentStage,
        stages: item.stages && item.stages.length === 5 ? item.stages : getReadyMadeStages(currentStage),
        deliveryAddress: item.deliveryAddress || item.shippingAddress || "Flat 402, Lotus Residency, Indiranagar, Bengaluru",
        customer: item.customer || "Ananya Deshmukh",
        customerEmail: item.customerEmail || "customer@example.com",
        customerPhone: item.customerPhone || "+91 98451 23456",
        paymentMethod: item.paymentMethod || "UPI / Online Paid",
        transactionId: item.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentStatus: item.paymentStatus || "Paid",
        isReviewed: Boolean(item.isReviewed)
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

// GET single customer order by ID
router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await CustomerOrderModel.findById(id);
    } else {
      order = await CustomerOrderModel.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    const item = order.toObject ? order.toObject() : order;
    const currentStage = item.currentStage || 2;
    return res.json({
      status: "success",
      data: {
        ...item,
        stages: item.stages && item.stages.length === 5 ? item.stages : getReadyMadeStages(currentStage)
      }
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// POST place customer ready-made order
router.post("/orders", async (req, res) => {
  try {
    const {
      product,
      price,
      manufacturer,
      artisanName,
      image,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      transactionId
    } = req.body;

    const count = await CustomerOrderModel.countDocuments();
    const orderId = `ORD-${1000 + count}`;
    const cAddress = address || shippingAddress || "Flat 402, Lotus Residency, Indiranagar";
    const cCity = city || "Bengaluru";
    const cState = state || "Karnataka";
    const cPin = pincode || "560038";
    const fullAddr = shippingAddress || `${cAddress}, ${cCity}, ${cState} - ${cPin}`;
    const generatedTxn = transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

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
      artisanName: artisanName || "Rithikeswaran M",
      price: Number(price) || 8500,
      amount: `₹${Number(price || 8500).toLocaleString("en-IN")}`,
      orderDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Order Placed",
      estimatedDelivery: "In 7-10 Days",
      image: image || "/images/kanchi.png",
      currentStage: 1,
      stages: getReadyMadeStages(1),
      paymentMethod: paymentMethod || "UPI / Online Payment",
      transactionId: generatedTxn,
      paymentStatus: "Paid",
      isReviewed: false
    });

    return res.status(201).json({
      status: "success",
      message: "Ready-made order placed successfully in database",
      data: newOrder
    });
  } catch (error) {
    console.error("Customer Order Place Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// PATCH update ready-made order stage / status
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, currentStage } = req.body;
    const stageNum = Number(currentStage) || 1;

    const updateFields = {
      status: status || "In Quality Inspection",
      currentStage: stageNum,
      stages: getReadyMadeStages(stageNum)
    };

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await CustomerOrderModel.findByIdAndUpdate(id, updateFields, { new: true });
    } else {
      updated = await CustomerOrderModel.findOneAndUpdate({ orderId: id }, updateFields, { new: true });
    }

    return res.json({ status: "success", data: updated });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// ============================================================================
// BOOKINGS (CUSTOM BESPOKE LOOM ORDERS)
// ============================================================================

// GET loom bookings from DB
router.get("/bookings", async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email && email.trim()) {
      query.customerEmail = { $regex: new RegExp(`^${email.trim()}$`, "i") };
    }
    const bookings = await BookingModel.find(query).sort({ createdAt: -1 });

    const formatted = bookings.map((b) => {
      const doc = b.toObject ? b.toObject() : b;
      const currentStage = doc.currentStage || (doc.status === "Delivered" ? 7 : doc.status === "In Weaving" ? 4 : 2);
      return {
        ...doc,
        id: doc.bookingId || doc._id,
        currentStage,
        stages: doc.stages && doc.stages.length === 7 ? doc.stages : getCustomLoomStages(currentStage)
      };
    });

    return res.json({
      status: "success",
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error("Bookings Fetch Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// GET single booking by ID
router.get("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let booking = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      booking = await BookingModel.findById(id);
    } else {
      booking = await BookingModel.findOne({ bookingId: id });
    }

    if (!booking) {
      return res.status(404).json({ status: "error", message: "Custom booking not found" });
    }

    const doc = booking.toObject ? booking.toObject() : booking;
    const currentStage = doc.currentStage || 2;
    return res.json({
      status: "success",
      data: {
        ...doc,
        stages: doc.stages && doc.stages.length === 7 ? doc.stages : getCustomLoomStages(currentStage)
      }
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// POST place bespoke loom custom booking in DB
router.post("/bookings", async (req, res) => {
  try {
    const {
      manufacturer,
      artisanName,
      loomType,
      fabricChoice,
      zariType,
      customPattern,
      bodyColor,
      borderColor,
      dimensions,
      notes,
      targetCompletion,
      customerEmail,
      customerName,
      customerPhone,
      deliveryAddress,
      advancePaid,
      estimatedPrice,
      paymentMethod,
      transactionId
    } = req.body;

    const count = await BookingModel.countDocuments();
    const bookingId = `BK-${500 + count}`;
    const generatedTxn = transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = await BookingModel.create({
      bookingId,
      customerEmail: customerEmail || "customer@example.com",
      customerName: customerName || "Ananya Deshmukh",
      customerPhone: customerPhone || "+91 98451 23456",
      deliveryAddress: deliveryAddress || "Flat 402, Lotus Residency, Indiranagar, Bengaluru",
      manufacturer: manufacturer || "Kathar Weaves",
      artisanName: artisanName || "Rithikeswaran M",
      loomType: loomType || "Traditional Pit Loom",
      fabricChoice: fabricChoice || "Pure Mulberry Silk & Gold Zari",
      zariType: zariType || "Tested Half-Fine Gold Zari",
      customPattern: customPattern || "Custom Motif",
      bodyColor: bodyColor || "Royal Crimson Red",
      borderColor: borderColor || "Temple Gold Border",
      dimensions: dimensions || "Standard 6.3m (with blouse)",
      notes: notes || "",
      bookingDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      targetCompletion: targetCompletion || "In 3-4 Weeks",
      status: "Custom Request Confirmed",
      currentStage: 1,
      stages: getCustomLoomStages(1),
      advancePaid: advancePaid || "₹3,000",
      estimatedPrice: estimatedPrice || "₹14,500",
      balanceDue: "₹11,500",
      paymentMethod: paymentMethod || "UPI / Artisan Escrow",
      transactionId: generatedTxn,
      paymentStatus: "Advance Paid",
      isReviewed: false
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

// ============================================================================
// REVIEWS (CONNECTED TO ARTISAN / MASTER WEAVER)
// ============================================================================

// GET reviews for an artisan
router.get("/reviews", async (req, res) => {
  try {
    const { artisanName, manufacturer } = req.query;
    let query = {};
    if (artisanName && artisanName.trim()) {
      query.artisanName = { $regex: new RegExp(`^${artisanName.trim()}$`, "i") };
    } else if (manufacturer && manufacturer.trim()) {
      query.manufacturer = { $regex: new RegExp(`^${manufacturer.trim()}$`, "i") };
    }

    const reviews = await ReviewModel.find(query).sort({ createdAt: -1 });

    return res.json({
      status: "success",
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error("Reviews Fetch Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// POST submit feedback/review for a Master Weaver
router.post("/reviews", async (req, res) => {
  try {
    const {
      artisanName,
      manufacturer,
      customerName,
      customerEmail,
      orderId,
      rating,
      craftsmanshipRating,
      communicationRating,
      comment,
      productContext
    } = req.body;

    if (!artisanName || !rating || !comment) {
      return res.status(400).json({
        status: "error",
        message: "Artisan name, rating score, and feedback comment are required"
      });
    }

    const count = await ReviewModel.countDocuments();
    const reviewId = `REV-${100 + count}`;

    const newReview = await ReviewModel.create({
      reviewId,
      artisanName: artisanName.trim(),
      manufacturer: manufacturer || "Kathar Weaves",
      customerName: customerName || "Ananya Deshmukh",
      customerEmail: customerEmail || "customer@example.com",
      orderId: orderId || "",
      rating: Number(rating) || 5,
      craftsmanshipRating: Number(craftsmanshipRating) || 5,
      communicationRating: Number(communicationRating) || 5,
      comment: comment.trim(),
      productContext: productContext || "Authentic Handloom Weave",
      verifiedPurchase: true
    });

    // Recalculate average rating & review count for this artisan/manufacturer
    const allArtisanReviews = await ReviewModel.find({
      $or: [
        { artisanName: { $regex: new RegExp(`^${artisanName.trim()}$`, "i") } },
        { manufacturer: { $regex: new RegExp(`^${(manufacturer || "").trim()}$`, "i") } }
      ]
    });

    const totalRatings = allArtisanReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
    const avgRating = allArtisanReviews.length > 0 ? Number((totalRatings / allArtisanReviews.length).toFixed(1)) : 4.9;

    await ManufacturerModel.findOneAndUpdate(
      {
        $or: [
          { ownerName: { $regex: new RegExp(`^${artisanName.trim()}$`, "i") } },
          { businessName: { $regex: new RegExp(`^${(manufacturer || "").trim()}$`, "i") } },
          { name: { $regex: new RegExp(`^${(manufacturer || "").trim()}$`, "i") } }
        ]
      },
      {
        rating: avgRating,
        reviewsCount: allArtisanReviews.length
      }
    );

    // Mark order as reviewed if orderId provided
    if (orderId) {
      await CustomerOrderModel.findOneAndUpdate(
        { orderId },
        { isReviewed: true }
      );
      await BookingModel.findOneAndUpdate(
        { bookingId: orderId },
        { isReviewed: true }
      );
    }

    return res.status(201).json({
      status: "success",
      message: `Feedback for Master Weaver ${artisanName} submitted successfully`,
      data: newReview,
      artisanStats: {
        newRating: avgRating,
        totalReviews: allArtisanReviews.length
      }
    });
  } catch (error) {
    console.error("Review Submit Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// ============================================================================
// ARTISAN / MANUFACTURERS DIRECTORY & PROFILE
// ============================================================================

// GET all manufacturers directory
router.get("/manufacturers", async (req, res) => {
  try {
    const items = await ManufacturerModel.find({}).sort({ rating: -1 });

    const formatted = items.map((m) => {
      const doc = m.toObject ? m.toObject() : m;
      return {
        id: doc._id,
        _id: doc._id,
        name: doc.businessName || doc.name || "Handloom Weaves",
        businessName: doc.businessName || doc.name || "Kathar Weaves",
        artisanName: doc.ownerName || "Master Weaver",
        ownerName: doc.ownerName || "Master Weaver",
        location: doc.location || "Tamil Nadu, India",
        rating: doc.rating || 4.9,
        reviewsCount: doc.reviewsCount || 120,
        specialization: doc.specialization || "Handloom Silk & Cotton",
        experience: doc.experience || "15+ Years",
        image: doc.image || "/images/kathar.png",
        verified: doc.verified !== false,
        activeLooms: doc.loomsActive || doc.activeLooms || 18,
        description: doc.description || "Generational master weavers preserving traditional pit-loom and frame-loom heritage."
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

// GET single Master Weaver / Artisan full details by ID or Name
router.get("/manufacturers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let artisan = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      artisan = await ManufacturerModel.findById(id);
    }

    if (!artisan) {
      artisan = await ManufacturerModel.findOne({
        $or: [
          { businessName: { $regex: new RegExp(`^${id.replace(/-/g, " ")}$`, "i") } },
          { name: { $regex: new RegExp(`^${id.replace(/-/g, " ")}$`, "i") } },
          { ownerName: { $regex: new RegExp(`^${id.replace(/-/g, " ")}$`, "i") } },
          { email: { $regex: new RegExp(`^${id}$`, "i") } }
        ]
      });
    }

    // Default fallback if not in DB yet
    if (!artisan) {
      artisan = {
        _id: id,
        name: id.includes("aura") ? "Aura Handlooms" : id.includes("varanasi") ? "Varanasi Silk Guild" : "Kathar Weaves",
        businessName: id.includes("aura") ? "Aura Handlooms" : id.includes("varanasi") ? "Varanasi Silk Guild" : "Kathar Weaves",
        artisanName: id.includes("aura") ? "Senthil Kumar" : id.includes("varanasi") ? "Rajeshwar Pandey" : "Rithikeswaran M",
        ownerName: id.includes("aura") ? "Senthil Kumar" : id.includes("varanasi") ? "Rajeshwar Pandey" : "Rithikeswaran M",
        location: id.includes("varanasi") ? "Varanasi, Uttar Pradesh" : id.includes("aura") ? "Salem, Tamil Nadu" : "Coimbatore & Kanchipuram, Tamil Nadu",
        rating: 4.9,
        reviewsCount: 142,
        specialization: "Kanchipuram Pure Silk & Korvai Handloom",
        experience: "15+ Years Generational Heritage",
        activeLooms: 18,
        description: "Preserving centuries-old pit-loom techniques, our artisan guild creates heirloom silks dyed with certified organic botanical pigments and pure tested gold zari."
      };
    }

    const doc = artisan.toObject ? artisan.toObject() : artisan;
    const aName = doc.ownerName || doc.artisanName || "Rithikeswaran M";
    const gName = doc.businessName || doc.name || "Kathar Weaves";

    // Fetch linked reviews for this artisan
    const linkedReviews = await ReviewModel.find({
      $or: [
        { artisanName: { $regex: new RegExp(`^${aName}$`, "i") } },
        { manufacturer: { $regex: new RegExp(`^${gName}$`, "i") } }
      ]
    }).sort({ createdAt: -1 });

    return res.json({
      status: "success",
      data: {
        ...doc,
        reviews: linkedReviews
      }
    });
  } catch (error) {
    console.error("Single Artisan Fetch Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// ============================================================================
// PAYMENT VERIFICATION & SIMULATION
// ============================================================================

router.post("/payment", async (req, res) => {
  try {
    const {
      orderType, // "ready_made" | "custom_loom"
      amount,
      paymentMethod,
      customerEmail,
      orderDetails
    } = req.body;

    const transactionId = `TXN-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    return res.json({
      status: "success",
      message: "Payment authorized and verified successfully",
      data: {
        transactionId,
        paymentStatus: "Paid",
        paymentMethod: paymentMethod || "UPI (Instant)",
        paidAmount: amount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
