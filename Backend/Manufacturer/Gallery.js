const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Exact MongoDB Schema for the 'Gallery' collection with manufacturerId
const gallerySchema = new mongoose.Schema(
  {
    manufacturerId: { type: String, default: "kathar_weaves" },
    title: { type: String, required: true },
    category: { type: String, default: "Workshop" },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  {
    collection: "Gallery",
    timestamps: true,
    strict: false
  }
);

const GalleryModel =
  mongoose.models.Gallery ||
  mongoose.model("Gallery", gallerySchema, "Gallery");

// GET all items directly from MongoDB 'Gallery' collection
router.get("/", async (req, res) => {
  try {
    const { category, search, manufacturerId } = req.query;

    let query = {};
    if (manufacturerId && manufacturerId.trim()) {
      query.manufacturerId = manufacturerId.trim();
    }
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
        { name: { $regex: s, $options: "i" } }
      ];
    }

    const items = await GalleryModel.find(query).sort({ createdAt: -1 });

    const formatted = items.map((doc) => {
      const item = doc.toObject ? doc.toObject() : doc;
      return {
        id: item._id,
        _id: item._id,
        manufacturerId: item.manufacturerId || "kathar_weaves",
        title: item.title || item.name || "Handloom Photo",
        category: item.category || "Workshop",
        description: item.description || item.desc || "",
        image:
          item.image ||
          item.imageUrl ||
          item.img ||
          item.photo ||
          item.url ||
          "",
        featured: Boolean(item.featured),
        createdAt: item.createdAt || item.date || new Date()
      };
    });

    return res.json({
      status: "success",
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error("MongoDB Gallery Fetch Error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// POST: Add new photo to MongoDB 'Gallery' collection
router.post("/", async (req, res) => {
  try {
    const { title, category, description, image, featured, manufacturerId } = req.body;

    if (!title || !image) {
      return res.status(400).json({
        status: "error",
        message: "Title and Image are required"
      });
    }

    const payload = {
      manufacturerId: manufacturerId || "kathar_weaves",
      title: title.trim(),
      category: category || "Workshop",
      description: description ? description.trim() : "",
      image: image.trim(),
      featured: Boolean(featured),
      createdAt: new Date()
    };

    const newPhoto = await GalleryModel.create(payload);

    return res.status(201).json({
      status: "success",
      message: "Photo saved to MongoDB Gallery collection successfully",
      data: {
        id: newPhoto._id,
        _id: newPhoto._id,
        manufacturerId: newPhoto.manufacturerId,
        title: newPhoto.title,
        category: newPhoto.category,
        description: newPhoto.description,
        image: newPhoto.image,
        featured: newPhoto.featured,
        createdAt: newPhoto.createdAt
      }
    });
  } catch (error) {
    console.error("MongoDB Gallery Create Error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

// DELETE: Remove photo from MongoDB 'Gallery' collection
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await GalleryModel.findByIdAndDelete(id);
    } else {
      deleted = await GalleryModel.findOneAndDelete({ _id: id });
    }

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Photo not found in Gallery collection"
      });
    }

    return res.json({
      status: "success",
      message: "Photo removed from MongoDB Gallery collection",
      data: deleted
    });
  } catch (error) {
    console.error("MongoDB Gallery Delete Error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

module.exports = router;