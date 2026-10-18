const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const bookingSchema = new mongoose.Schema({}, { collection: "Bookings", strict: false });
const BookingModel = mongoose.models.ManufacturerBooking || mongoose.model("ManufacturerBooking", bookingSchema, "Bookings");

const getStatusClass = (status = "") => {
  const s = String(status).toLowerCase();
  if (s === "completed" || s === "delivered") {
    return "bg-[#EAF6ED] text-[#2E7D32] border-[#C8E6C9]";
  }
  if (s === "in production" || s.includes("weaving") || s.includes("dyeing") || s.includes("warping")) {
    return "bg-[#FFF4DF] text-[#A16B16] border-[#F5DEC0]";
  }
  if (s === "quality check" || s.includes("inspection")) {
    return "bg-[#F4EAFA] text-[#704C91] border-[#E8D4F5]";
  }
  if (s === "ready to ship" || s.includes("dispatched") || s.includes("transit")) {
    return "bg-[#E6F4FA] text-[#1E6589] border-[#C9E7F6]";
  }
  return "bg-[#FBEEEE] text-[#A44747] border-[#F4CFCF]";
};

const ManufacturerModel =
  mongoose.models.Manufacturer ||
  mongoose.model("Manufacturer", new mongoose.Schema({}, { collection: "Manufacturer", strict: false }));

// GET all orders from Bookings collection for manufacturer
router.get("/", async (req, res) => {
  try {
    const { status, search, manufacturerId } = req.query;

    const mId = (manufacturerId || "").trim();
    const query = {};

    if (mId && mId !== "All") {
      const mVariants = new Set([mId, "kathar_weaves", "Kathar Weaves", "rithikeswaran.it23@bitsathy.ac.in"]);

      let mDoc = null;
      if (mongoose.Types.ObjectId.isValid(mId) && mId.length === 24) {
        mDoc = await ManufacturerModel.findById(new mongoose.Types.ObjectId(mId)).lean();
      }
      if (!mDoc) {
        mDoc = await ManufacturerModel.findOne({
          $or: [
            { email: { $regex: new RegExp(`^${mId}$`, "i") } },
            { businessName: { $regex: new RegExp(`^${mId}$`, "i") } }
          ]
        }).lean();
      }
      if (mDoc) {
        if (mDoc._id) mVariants.add(String(mDoc._id));
        if (mDoc.email) mVariants.add(mDoc.email);
        if (mDoc.businessName) {
          mVariants.add(mDoc.businessName);
          mVariants.add(mDoc.businessName.toLowerCase().replace(/\s+/g, "_"));
        }
        if (mDoc.ownerName) mVariants.add(mDoc.ownerName);
      }

      const variantsArr = Array.from(mVariants);
      query.$or = [
        { manufacturerId: { $in: variantsArr } },
        { manufacturer: { $in: variantsArr } },
        { artisanName: { $in: variantsArr } },
        { manufacturerId: { $regex: new RegExp(`^${mId}$`, "i") } },
        { manufacturer: { $regex: new RegExp(`^${mId}$`, "i") } }
      ];
    }

    if (status && status !== "All") {
      query.status = { $regex: new RegExp(`^${status}$`, "i") };
    }

    const bookingsList = await BookingModel.find(query).sort({ createdAt: -1 }).lean();

    let allCombined = (bookingsList || []).map((b) => {
      const fullAddr = b.deliveryAddress || b.shippingAddress || b.address || "";
      const dateVal =
        b.orderDate ||
        b.bookingDate ||
        b.date ||
        (b.createdAt
          ? new Date(b.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
          : "");

      const isBespoke = b.bookingId && b.bookingId.startsWith("BK") || b.orderType?.includes("Bespoke");
      const orderIdVal = b.orderId || b.bookingId || `BK-${String(b._id).slice(-4).toUpperCase()}`;

      return {
        id: b._id,
        _id: b._id,
        orderId: orderIdVal,
        bookingId: orderIdVal,
        orderType: b.orderType || (isBespoke ? "Bespoke Loom Reservation" : "Ready-Made Handloom"),
        manufacturerId: b.manufacturerId || b.manufacturer || "Kathar Weaves",
        customerId: b.customerId || b.customerEmail || "",
        productId: b.productId || b.designId || "",
        date: dateVal,
        customer: b.customer || b.customerName || "Patron",
        customerPhone: b.customerPhone || b.phone || "",
        customerEmail: b.customerEmail || b.email || "",
        address: fullAddr,
        deliveryAddress: fullAddr,
        shippingAddress: fullAddr,
        pincode: b.pincode || "",
        city: b.city || "",
        state: b.state || "",
        product: b.product || b.customPattern || b.fabricChoice || "Handloom Saree",
        category: b.category || (isBespoke ? "Bespoke Silk" : "Silk"),
        quantity: b.quantity || 1,
        price: b.price || (b.advancePaid ? Number(String(b.advancePaid).replace(/[^\d.]/g, "")) : 0),
        amount: b.amount || (b.estimatedPrice ? `Advance: ${b.advancePaid} / Est: ${b.estimatedPrice}` : (b.advancePaid || "₹0")),
        advancePaid: b.advancePaid || "",
        estimatedPrice: b.estimatedPrice || "",
        payment: b.paymentStatus || b.payment || "Paid",
        status: b.status || (isBespoke ? "Custom Request Confirmed" : "Order Placed"),
        deliveryNotes: b.notes || b.deliveryNotes || "",
        statusClass: getStatusClass(b.status || "Pending"),
        currentStage: b.currentStage || 1,
        stages: b.stages || [],
        createdAt: b.createdAt || new Date()
      };
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      allCombined = allCombined.filter(
        (o) =>
          (o.orderId && o.orderId.toLowerCase().includes(q)) ||
          (o.customer && o.customer.toLowerCase().includes(q)) ||
          (o.product && o.product.toLowerCase().includes(q)) ||
          (o.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
          (o.customerPhone && o.customerPhone.toLowerCase().includes(q)) ||
          (o.address && o.address.toLowerCase().includes(q)) ||
          (o.city && o.city.toLowerCase().includes(q)) ||
          (o.pincode && String(o.pincode).toLowerCase().includes(q))
      );
    }

    return res.json({
      status: "success",
      count: allCombined.length,
      data: allCombined
    });
  } catch (error) {
    console.error("Manufacturer Orders Fetch Error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// GET single order/booking from Bookings collection
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : { $or: [{ _id: id }, { orderId: id }, { bookingId: id }] };

    const order = await BookingModel.findOne(filter).lean();
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found in Bookings collection" });
    }

    const fullAddr = order.deliveryAddress || order.shippingAddress || order.address || "";
    const dateVal =
      order.orderDate ||
      order.bookingDate ||
      order.date ||
      (order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "");

    const orderIdVal = order.orderId || order.bookingId || "";

    return res.json({
      status: "success",
      data: {
        id: order._id,
        _id: order._id,
        orderId: orderIdVal,
        bookingId: orderIdVal,
        orderType: order.orderType || "Ready-Made Handloom",
        manufacturerId: order.manufacturerId || "",
        customerId: order.customerId || order.customerEmail || "",
        productId: order.productId || order.designId || "",
        date: dateVal,
        customer: order.customer || order.customerName || "Patron",
        customerPhone: order.customerPhone || order.phone || "",
        customerEmail: order.customerEmail || order.email || "",
        address: fullAddr,
        deliveryAddress: fullAddr,
        shippingAddress: fullAddr,
        pincode: order.pincode || "",
        city: order.city || "",
        state: order.state || "",
        product: order.product || order.customPattern || order.fabricChoice || "Handloom Weave",
        category: order.category || "Silk",
        quantity: order.quantity || 1,
        price: order.price || (order.advancePaid ? Number(String(order.advancePaid).replace(/[^\d.]/g, "")) : 0),
        amount: order.amount || (order.estimatedPrice ? `Advance: ${order.advancePaid} / Est: ${order.estimatedPrice}` : (order.advancePaid || "₹0")),
        payment: order.payment || order.paymentStatus || "Paid",
        status: order.status || "Pending",
        deliveryNotes: order.deliveryNotes || order.notes || "",
        statusClass: getStatusClass(order.status || "Pending"),
        currentStage: order.currentStage || 1,
        stages: order.stages || []
      }
    });
  } catch (error) {
    console.error("Single Order Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// PATCH order status in Bookings collection
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, currentStage } = req.body;

    if (!status) {
      return res.status(400).json({ status: "error", message: "Status is required" });
    }

    let filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : { $or: [{ _id: id }, { orderId: id }, { bookingId: id }] };

    const updateFields = { status, updatedAt: new Date() };
    if (currentStage) {
      updateFields.currentStage = Number(currentStage);
    }

    const updated = await BookingModel.findOneAndUpdate(filter, { $set: updateFields }, { new: true });
    if (!updated) {
      return res.status(404).json({ status: "error", message: "Order not found in Bookings collection" });
    }

    return res.json({
      status: "success",
      message: "Order status updated successfully in Bookings collection",
      data: updated
    });
  } catch (error) {
    console.error("Order Status Update Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE order from Bookings collection
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : { $or: [{ _id: id }, { orderId: id }, { bookingId: id }] };

    const deleted = await BookingModel.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Order not found in Bookings collection" });
    }

    return res.json({
      status: "success",
      message: "Order deleted from Bookings collection",
      data: deleted
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;