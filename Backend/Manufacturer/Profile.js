const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Exact MongoDB Schema for the 'Manufacturer' collection
const manufacturerSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: "Kathar Weaves" },
    ownerName: { type: String, default: "Rithikeswaran M" },
    email: { type: String, required: true },
    phone: { type: String, default: "+91 98765 43210" },
    location: { type: String, default: "Coimbatore, Tamil Nadu" },
    address: { type: String, default: "124, Handloom Weaver Colony, Coimbatore, Tamil Nadu 641048" },
    specialization: { type: String, default: "Handloom Silk & Cotton Sarees" },
    experience: { type: String, default: "15+ Years" },
    loomsActive: { type: Number, default: 18 },
    artisanCount: { type: Number, default: 32 },
    gstin: { type: String, default: "33AABCK1234F1Z9" },
    description: {
      type: String,
      default:
        "Kathar Weaves is a traditional handloom manufacturer dedicated to preserving ancient weaving techniques while producing authentic pure silk and organic cotton sarees of peerless elegance."
    },
    createdAt: { type: Date, default: Date.now }
  },
  {
    collection: "Manufacturer",
    timestamps: true,
    strict: false
  }
);

const ManufacturerModel =
  mongoose.models.Manufacturer ||
  mongoose.model("Manufacturer", manufacturerSchema, "Manufacturer");

// GET profile by email
router.get("/", async (req, res) => {
  try {
    const email = (req.query.email || req.headers["x-user-email"] || "rithikeswaran.it23@bitsathy.ac.in").trim().toLowerCase();

    let profile = await ManufacturerModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") }
    });

    // If not in collection yet, initialize default record
    if (!profile) {
      profile = await ManufacturerModel.create({
        businessName: "Kathar Weaves",
        ownerName: email.includes("rithik") ? "Rithikeswaran M" : "Master Weaver",
        email: email,
        phone: "+91 98765 43210",
        location: "Coimbatore, Tamil Nadu",
        address: "124, Handloom Weaver Colony, Coimbatore, Tamil Nadu 641048",
        specialization: "Handloom Silk & Cotton Sarees",
        experience: "15+ Years",
        loomsActive: 18,
        artisanCount: 32,
        gstin: "33AABCK1234F1Z9",
        description:
          "Kathar Weaves is a traditional handloom manufacturer dedicated to preserving ancient weaving techniques while producing authentic pure silk and organic cotton sarees of peerless elegance."
      });
    }

    return res.json({
      status: "success",
      data: profile
    });
  } catch (error) {
    console.error("Manufacturer Profile Fetch Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// UPDATE profile by email
router.put("/", async (req, res) => {
  try {
    const email = (req.body.email || req.query.email || "rithikeswaran.it23@bitsathy.ac.in").trim().toLowerCase();
    const updateData = { ...req.body, email };

    const updated = await ManufacturerModel.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${email}$`, "i") } },
      updateData,
      { new: true, upsert: true }
    );

    return res.json({
      status: "success",
      message: "Manufacturer profile updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Manufacturer Profile Update Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
