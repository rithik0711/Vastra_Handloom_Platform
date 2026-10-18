const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const customerProfileSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    city: { type: String, default: "" },
    deliveryAddress: { type: String, default: "" },
    pincode: { type: String, default: "" },
    bio: { type: String, default: "" },
    preferredFabrics: { type: [String], default: [] },
    blouseSize: { type: String, default: "" },
    sareeLengthPreference: { type: String, default: "" },
    avatar: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: "CustomerProfiles", timestamps: true, strict: false }
);

const CustomerProfileModel =
  mongoose.models.CustomerProfile ||
  mongoose.model("CustomerProfile", customerProfileSchema, "CustomerProfiles");

// Helper to format email prefix into a readable name if no name is set
const deriveNameFromEmail = (email = "") => {
  if (!email) return "";
  const prefix = email.split("@")[0] || "";
  return prefix
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
};

// 1. GET Customer Profile
router.get("/", async (req, res) => {
  try {
    const rawEmail = req.query.email || "";
    const email = rawEmail.trim().toLowerCase();
    const providedName = (req.query.name || "").trim();

    if (!email) {
      return res.status(400).json({ status: "error", message: "Email is required" });
    }

    let profile = await CustomerProfileModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") }
    }).lean();

    // If profile does not exist yet, create a clean initial profile
    if (!profile) {
      const initialName = providedName || deriveNameFromEmail(email);
      const newDoc = await CustomerProfileModel.create({
        email,
        fullName: initialName,
        phone: "",
        city: "",
        deliveryAddress: "",
        pincode: "",
        bio: "",
        preferredFabrics: [],
        blouseSize: "",
        sareeLengthPreference: "",
        avatar: req.query.avatar || ""
      });
      profile = newDoc.toObject ? newDoc.toObject() : newDoc;
    } else if (providedName && (!profile.fullName || profile.fullName === "Handloom Patron" || profile.fullName === "Ananya Deshmukh")) {
      // Sync Google name if profile had empty or placeholder name
      profile = await CustomerProfileModel.findOneAndUpdate(
        { email: { $regex: new RegExp(`^${email}$`, "i") } },
        { $set: { fullName: providedName, updatedAt: new Date() } },
        { new: true }
      ).lean();
    }

    const BookingModel =
      mongoose.models.Booking ||
      mongoose.model("Booking", new mongoose.Schema({}, { strict: false }), "Bookings");
    const DesignModel =
      mongoose.models.ManufacturerDesign ||
      mongoose.model("ManufacturerDesign", new mongoose.Schema({}, { strict: false }), "ManufacturerDesigns");

    const [totalBookingsCount, readyOrdersCount, designsCount] = await Promise.all([
      BookingModel.countDocuments({
        customerEmail: { $regex: new RegExp(`^${email}$`, "i") }
      }).catch(() => 0),
      BookingModel.countDocuments({
        customerEmail: { $regex: new RegExp(`^${email}$`, "i") },
        $or: [{ orderType: "Ready-Made Handloom" }, { orderId: { $regex: /^ORD/i } }]
      }).catch(() => 0),
      DesignModel.countDocuments({
        $or: [
          { customerEmail: { $regex: new RegExp(`^${email}$`, "i") } },
          { customerId: { $regex: new RegExp(`^${email}$`, "i") } }
        ]
      }).catch(() => 0)
    ]);

    return res.json({
      status: "success",
      data: {
        ...profile,
        stats: {
          totalOrders: readyOrdersCount || totalBookingsCount || 0,
          activeLoomBookings: (totalBookingsCount - readyOrdersCount) > 0 ? (totalBookingsCount - readyOrdersCount) : totalBookingsCount || 0,
          savedDesigns: designsCount || 0,
          patronTier: totalBookingsCount > 3 ? "Heritage Silk Connoisseur (Gold)" : "Handloom Silk Patron"
        }
      }
    });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 2. PUT Update Customer Profile
router.put("/", async (req, res) => {
  try {
    const payload = req.body;
    const rawEmail = payload.email || "";
    const email = rawEmail.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ status: "error", message: "Email is required to update profile" });
    }

    const updated = await CustomerProfileModel.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${email}$`, "i") } },
      { $set: { ...payload, email, updatedAt: new Date() } },
      { upsert: true, new: true }
    );

    return res.json({ status: "success", message: "Profile updated successfully in CustomerProfiles", data: updated });
  } catch (error) {
    console.error("Profile PUT Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
