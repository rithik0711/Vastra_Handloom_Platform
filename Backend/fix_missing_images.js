require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const connectDB = require("./db");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

async function fix() {
  await connectDB();
  const col = mongoose.connection.collection("Products");
  const products = await col.find({}).toArray();

  const missing = products.filter((p) => !p.image || p.image.trim() === "");
  console.log(`Found ${missing.length} products with missing image.`);

  for (const p of missing) {
    const isZari = (p.name || "").toLowerCase().includes("zari");
    const filename = isZari ? "zari.png" : "cotton.png";
    const localPath = path.resolve(__dirname, "../Frontend/public/images", filename);

    if (fs.existsSync(localPath)) {
      console.log(`Uploading ${filename} for "${p.name}" (${p._id})...`);
      const upload = await cloudinary.uploader.upload(localPath, {
        folder: "vastra_products",
        public_id: `product_${p.uniqueId || p.code || p._id}`,
        overwrite: true
      });

      await col.updateOne(
        { _id: p._id },
        { $set: { image: upload.secure_url, imageMigratedAt: new Date() } }
      );
      console.log(`Updated "${p.name}" -> ${upload.secure_url}`);
    }
  }

  console.log("All missing product images fixed!");
  await mongoose.disconnect();
  process.exit(0);
}

fix().catch((err) => {
  console.error("Fix error:", err);
  process.exit(1);
});
