const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const manufacturerSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: "" },
    name: { type: String, default: "" },
    ownerName: { type: String, default: "" },
    artisanName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    address: { type: String, default: "" },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 0 },
    specialization: { type: String, default: "" },
    experience: { type: String, default: "" },
    image: { type: String, default: "/images/kathar.png" },
    verified: { type: Boolean, default: true },
    activeLooms: { type: Number, default: 0 },
    artisanCount: { type: Number, default: 0 },
    description: { type: String, default: "" }
  },
  { collection: "Manufacturer", timestamps: true, strict: false }
);

const ManufacturerModel =
  mongoose.models.Manufacturer ||
  mongoose.model("Manufacturer", manufacturerSchema, "Manufacturer");

// GET all manufacturers / artisans directly from DB
router.get("/", async (req, res) => {
  try {
    let list = await ManufacturerModel.find({}).lean();
    if (!list || list.length === 0) {
      list = await mongoose.connection.collection("Manufacturer").find({}).toArray();
    }

    const normalized = (list || []).map((m) => ({
      _id: m._id,
      id: m._id ? m._id.toString() : m.id,
      name: m.businessName || m.name || "Master Weaver Guild",
      businessName: m.businessName || m.name || "Master Weaver Guild",
      ownerName: m.ownerName || m.artisanName || "Master Weaver",
      artisanName: m.artisanName || m.ownerName || "Master Weaver",
      email: m.email || "",
      phone: m.phone || "",
      location: m.location || "Tamil Nadu, India",
      address: m.address || "",
      rating: m.rating || 4.9,
      reviewsCount: m.reviewsCount || 0,
      specialization: m.specialization || "Pure Silk & Cotton Handloom",
      experience: m.experience || "Generational Heritage",
      image: m.image || "/images/kathar.png",
      verified: m.verified !== false,
      activeLooms: m.loomsActive || m.activeLooms || 18,
      artisanCount: m.artisanCount || 30,
      description: m.description || "Generational master weavers preserving traditional pit-loom techniques."
    }));

    return res.json({ status: "success", count: normalized.length, data: normalized });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// GET single manufacturer / artisan
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : {
          $or: [
            { _id: id },
            { id: id },
            { email: id },
            { businessName: { $regex: new RegExp(`^${id}$`, "i") } },
            { name: { $regex: new RegExp(`^${id}$`, "i") } }
          ]
        };

    let artisan = await ManufacturerModel.findOne(filter).lean();
    if (!artisan) {
      return res.status(404).json({ status: "error", message: "Artisan / Manufacturer not found" });
    }

    const formatted = {
      _id: artisan._id,
      id: artisan._id ? artisan._id.toString() : artisan.id,
      name: artisan.businessName || artisan.name || "Master Weaver Guild",
      businessName: artisan.businessName || artisan.name || "Master Weaver Guild",
      ownerName: artisan.ownerName || artisan.artisanName || "Master Weaver",
      artisanName: artisan.artisanName || artisan.ownerName || "Master Weaver",
      email: artisan.email || "",
      phone: artisan.phone || "",
      location: artisan.location || "Tamil Nadu, India",
      address: artisan.address || "",
      rating: artisan.rating || 4.9,
      reviewsCount: artisan.reviewsCount || 0,
      specialization: artisan.specialization || "Pure Silk & Cotton Handloom",
      experience: artisan.experience || "Generational Heritage",
      image: artisan.image || "/images/kathar.png",
      verified: artisan.verified !== false,
      activeLooms: artisan.loomsActive || artisan.activeLooms || 18,
      artisanCount: artisan.artisanCount || 30,
      description: artisan.description || "Generational master weavers preserving traditional pit-loom techniques."
    };

    return res.json({ status: "success", data: formatted });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
