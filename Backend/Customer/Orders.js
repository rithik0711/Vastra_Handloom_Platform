const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Schema strictly mapped to the 'Bookings' collection
const bookingOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String },
    bookingId: { type: String },
    orderType: { type: String, default: "Ready-Made Handloom" },
    customerEmail: { type: String, required: true },
    customerId: { type: String, default: "" },
    customer: { type: String, default: "" },
    customerName: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    product: { type: String, required: true },
    category: { type: String, default: "Silk" },
    fabricChoice: { type: String, default: "" },
    customPattern: { type: String, default: "" },
    manufacturer: { type: String, default: "" },
    manufacturerId: { type: String, default: "" },
    artisanName: { type: String, default: "" },
    price: { type: Number, required: true },
    amount: { type: String, default: "" },
    advancePaid: { type: String, default: "" },
    estimatedPrice: { type: String, default: "" },
    balanceDue: { type: String, default: "" },
    orderDate: { type: String, default: "" },
    bookingDate: { type: String, default: "" },
    status: { type: String, default: "Order Placed" },
    estimatedDelivery: { type: String, default: "In 7-10 Days" },
    image: { type: String, default: "/images/kanchi.png" },
    designImage: { type: String, default: "" },
    designId: { type: String, default: "" },
    designDetails: { type: Object },
    currentStage: { type: Number, default: 1 },
    stages: { type: Array, default: [] },
    deliveryAddress: { type: String, default: "" },
    shippingAddress: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    paymentMethod: { type: String, default: "UPI / Online" },
    transactionId: { type: String, default: "" },
    paymentStatus: { type: String, default: "Paid" },
    isReviewed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "Bookings", timestamps: true, strict: false }
);

const BookingOrderModel =
  mongoose.models.CustomerBookingOrder ||
  mongoose.model("CustomerBookingOrder", bookingOrderSchema, "Bookings");

const getProductionStages = (currentStage = 1) => [
  { name: "Order Placed", desc: "Order details received & verified with Master Weaver", completed: currentStage >= 1, date: currentStage >= 1 ? "Completed" : "Upcoming" },
  { name: "Quality Check", desc: "Zari authenticity & silk warp inspection", completed: currentStage >= 2, date: currentStage >= 2 ? "Completed" : "Upcoming" },
  { name: "Silk Mark Tagging", desc: "Government Silk Mark certification & labeling", completed: currentStage >= 3, date: currentStage >= 3 ? "Completed" : "Upcoming" },
  { name: "Handloom Dispatched", desc: "Handcrafted packaging & courier tracking generated", completed: currentStage >= 4, date: currentStage >= 4 ? "Completed" : "Upcoming" },
  { name: "Delivered", desc: "Handloom saree safely delivered to patron", completed: currentStage >= 5, date: currentStage >= 5 ? "Delivered" : "Upcoming" }
];

// 1. GET all orders / bookings for a customer from Bookings collection
router.get("/", async (req, res) => {
  try {
    const rawEmail = req.query.customerEmail || "";
    const customerEmail = rawEmail.trim();

    let query = {};
    if (customerEmail && customerEmail !== "all") {
      query.customerEmail = { $regex: new RegExp(`^${customerEmail}$`, "i") };
    }

    const items = await BookingOrderModel.find(query).sort({ createdAt: -1 }).lean();

    const normalized = items.map((o) => ({
      _id: o._id,
      id: o._id ? o._id.toString() : o.id,
      orderId: o.orderId || o.bookingId || `ORD-${String(o._id).slice(-4).toUpperCase()}`,
      bookingId: o.bookingId || o.orderId || `ORD-${String(o._id).slice(-4).toUpperCase()}`,
      orderType: o.orderType || (o.bookingId && o.bookingId.startsWith("BK") ? "Bespoke Loom Reservation" : "Ready-Made Handloom"),
      customer: o.customer || o.customerName || "Patron",
      customerName: o.customerName || o.customer || "Patron",
      customerEmail: o.customerEmail || "",
      customerPhone: o.customerPhone || "",
      product: o.product || o.customPattern || o.fabricChoice || "Handloom Saree",
      category: o.category || "Silk",
      manufacturer: o.manufacturer || o.manufacturerId || "Kathar Weaves",
      artisanName: o.artisanName || o.manufacturer || "Master Weaver",
      price: o.price || (o.advancePaid ? Number(String(o.advancePaid).replace(/[^\d.]/g, "")) : 0),
      amount: o.amount || (o.price ? `₹${Number(o.price).toLocaleString("en-IN")}` : "₹0"),
      advancePaid: o.advancePaid || "",
      estimatedPrice: o.estimatedPrice || "",
      balanceDue: o.balanceDue || "",
      orderDate: o.orderDate || o.bookingDate || (o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""),
      bookingDate: o.bookingDate || o.orderDate || "",
      status: o.status || "Order Placed",
      estimatedDelivery: o.estimatedDelivery || "In 7-10 Days",
      image: o.image || o.designImage || "/images/kanchi.png",
      designImage: o.designImage || "",
      designId: o.designId || "",
      designDetails: o.designDetails || null,
      currentStage: o.currentStage || 1,
      stages: o.stages && o.stages.length > 0 ? o.stages : getProductionStages(o.currentStage || 1),
      deliveryAddress: o.deliveryAddress || o.shippingAddress || o.address || "",
      shippingAddress: o.shippingAddress || o.deliveryAddress || o.address || "",
      city: o.city || "",
      state: o.state || "",
      pincode: o.pincode || "",
      paymentMethod: o.paymentMethod || "UPI / Online",
      transactionId: o.transactionId || "",
      paymentStatus: o.paymentStatus || "Paid",
      isReviewed: o.isReviewed || false,
      createdAt: o.createdAt || new Date()
    }));

    return res.json({
      status: "success",
      count: normalized.length,
      data: normalized
    });
  } catch (error) {
    console.error("Get Customer Orders Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 2. GET single order by ID from Bookings collection
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : { $or: [{ _id: id }, { orderId: id }, { bookingId: id }] };

    const order = await BookingOrderModel.findOne(filter).lean();
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    const normalized = {
      _id: order._id,
      id: order._id ? order._id.toString() : order.id,
      orderId: order.orderId || order.bookingId || `ORD-${String(order._id).slice(-4).toUpperCase()}`,
      bookingId: order.bookingId || order.orderId || "",
      orderType: order.orderType || "Ready-Made Handloom",
      customer: order.customer || order.customerName || "Patron",
      customerName: order.customerName || order.customer || "Patron",
      customerEmail: order.customerEmail || "",
      customerPhone: order.customerPhone || "",
      product: order.product || order.customPattern || "Handloom Saree",
      category: order.category || "Silk",
      manufacturer: order.manufacturer || order.manufacturerId || "Kathar Weaves",
      artisanName: order.artisanName || order.manufacturer || "Master Weaver",
      price: order.price || 0,
      amount: order.amount || (order.price ? `₹${Number(order.price).toLocaleString("en-IN")}` : "₹0"),
      advancePaid: order.advancePaid || "",
      estimatedPrice: order.estimatedPrice || "",
      orderDate: order.orderDate || order.bookingDate || "",
      status: order.status || "Order Placed",
      estimatedDelivery: order.estimatedDelivery || "In 7-10 Days",
      image: order.image || order.designImage || "/images/kanchi.png",
      designImage: order.designImage || "",
      designId: order.designId || "",
      designDetails: order.designDetails || null,
      currentStage: order.currentStage || 1,
      stages: order.stages && order.stages.length > 0 ? order.stages : getProductionStages(order.currentStage || 1),
      deliveryAddress: order.deliveryAddress || order.shippingAddress || order.address || "",
      city: order.city || "",
      state: order.state || "",
      pincode: order.pincode || "",
      paymentMethod: order.paymentMethod || "UPI / Online",
      transactionId: order.transactionId || "",
      paymentStatus: order.paymentStatus || "Paid",
      isReviewed: order.isReviewed || false,
      createdAt: order.createdAt || new Date()
    };

    return res.json({ status: "success", data: normalized });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 3. POST create new order directly into Bookings collection
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const totalDocs = await BookingOrderModel.countDocuments();
    const generatedOrderId = payload.orderId || `ORD-${1001 + totalDocs}`;
    const generatedTxn =
      payload.transactionId || `TXN-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;

    const priceNum =
      typeof payload.price === "number"
        ? payload.price
        : Number(String(payload.price || "").replace(/[^\d.]/g, "")) || 0;

    const fullAddr = payload.deliveryAddress || payload.shippingAddress || payload.address || "";

    const newDoc = await BookingOrderModel.create({
      ...payload,
      orderId: generatedOrderId,
      bookingId: generatedOrderId,
      orderType: payload.orderType || "Ready-Made Handloom",
      customerEmail: (payload.customerEmail || "").trim().toLowerCase(),
      customer: (payload.customer || payload.customerName || "").trim(),
      customerName: (payload.customerName || payload.customer || "").trim(),
      customerPhone: payload.customerPhone || "",
      product: payload.product || "Handloom Pure Silk Saree",
      category: payload.category || "Silk",
      manufacturer: payload.manufacturer || "Kathar Weaves",
      manufacturerId: payload.manufacturerId || payload.manufacturer || "Kathar Weaves",
      artisanName: payload.artisanName || "Master Weaver",
      price: priceNum,
      amount: payload.amount || `₹${priceNum.toLocaleString("en-IN")}`,
      orderDate:
        payload.orderDate ||
        new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      bookingDate:
        payload.bookingDate ||
        new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Order Placed",
      estimatedDelivery: payload.estimatedDelivery || "In 7-10 Days",
      image: payload.image || payload.designImage || "/images/kanchi.png",
      designImage: payload.designImage || "",
      designId: payload.designId || "",
      designDetails: payload.designDetails || null,
      currentStage: 1,
      stages: getProductionStages(1),
      deliveryAddress: fullAddr,
      shippingAddress: fullAddr,
      address: fullAddr,
      city: payload.city || "",
      state: payload.state || "",
      pincode: payload.pincode || "",
      paymentMethod: payload.paymentMethod || "UPI / Online",
      transactionId: generatedTxn,
      paymentStatus: "Paid",
      isReviewed: false
    });

    return res.status(201).json({
      status: "success",
      message: "Order created successfully in Bookings collection",
      data: newDoc
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
