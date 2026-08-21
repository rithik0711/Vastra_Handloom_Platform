const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Schema for 'Customers' collection
const customerSchema = new mongoose.Schema(
  {
    manufacturerId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    totalOrders: { type: Number, default: 1 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: { type: String },
    status: { type: String, default: "Active" },
    preferences: { type: String, default: "Pure Silk, Bridal Sarees" },
    notes: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
  },
  {
    collection: "Customers",
    timestamps: true,
    strict: false
  }
);

const CustomerModel =
  mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema, "Customers");

// GET all customers by manufacturerId from DB
router.get("/", async (req, res) => {
  try {
    const { search, status, manufacturerId } = req.query;

    let query = {};
    if (manufacturerId && manufacturerId.trim() && manufacturerId !== "All") {
      query.manufacturerId = { $regex: new RegExp(`^${manufacturerId.trim()}$`, "i") };
    }
    if (status && status !== "All") {
      query.status = { $regex: new RegExp(`^${status}$`, "i") };
    }
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { location: { $regex: s, $options: "i" } },
        { phone: { $regex: s, $options: "i" } }
      ];
    }

    const items = await CustomerModel.find(query).sort({ totalSpent: -1 }).lean();

    const formatted = items.map((c) => {
      const initials = c.name
        ? c.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "CU";

      return {
        ...c,
        id: c._id,
        _id: c._id,
        manufacturerId: c.manufacturerId || "rithikeswaran.it23@bitsathy.ac.in",
        name: c.name || "Patron",
        initials,
        email: c.email || "",
        phone: c.phone || "+91 98765 43210",
        location: c.location || "India",
        totalOrders: c.totalOrders || 1,
        totalSpent: c.totalSpent || 0,
        lastOrderDate: c.lastOrderDate || "Recently",
        status: c.status || "Active",
        preferences: c.preferences || "Pure Handloom Silk & Cotton",
        notes: c.notes || "",
        createdAt: c.createdAt || new Date()
      };
    });

    return res.json({
      status: "success",
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error("Customers Fetch Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// GET single customer by ID from DB
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let customer = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      customer = await CustomerModel.findById(id);
    } else {
      customer = await CustomerModel.findOne({ _id: id });
    }
    if (!customer) {
      return res.status(404).json({ status: "error", message: "Customer not found" });
    }
    return res.json({ status: "success", data: customer });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// CREATE customer in DB
router.post("/", async (req, res) => {
  try {
    const { manufacturerId, name, email, phone, location, totalOrders, totalSpent, preferences, notes } = req.body;
    if (!name || !email) {
      return res.status(400).json({ status: "error", message: "Name and email are required" });
    }

    const newCustomer = await CustomerModel.create({
      manufacturerId: manufacturerId || "kathar_weaves",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || "+91 98765 43210",
      location: location || "India",
      totalOrders: Number(totalOrders) || 1,
      totalSpent: Number(totalSpent) || 0,
      lastOrderDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Active",
      preferences: preferences || "Pure Silk",
      notes: notes || ""
    });

    return res.status(201).json({
      status: "success",
      message: "Customer created successfully in database",
      data: newCustomer
    });
  } catch (error) {
    console.error("Customer Create Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// UPDATE customer notes/details in DB
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let updated = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await CustomerModel.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      updated = await CustomerModel.findOneAndUpdate({ _id: id }, req.body, { new: true });
    }

    if (!updated) {
      return res.status(404).json({ status: "error", message: "Customer not found" });
    }

    return res.json({
      status: "success",
      message: "Customer details updated successfully in database",
      data: updated
    });
  } catch (error) {
    console.error("Customer Update Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
