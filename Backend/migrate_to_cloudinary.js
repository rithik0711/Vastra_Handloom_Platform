require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const connectDB = require("./db");

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const sanitizeId = (str) => {
  return String(str || "").replace(/[^a-zA-Z0-9_-]/g, "_");
};

async function runMigration() {
  console.log("==================================================");
  console.log("  VASTRA - BASE64 TO CLOUDINARY DATA MIGRATION   ");
  console.log("==================================================\n");

  // Step 1: Verify Cloudinary credentials
  console.log(">>> Verifying Cloudinary configuration...");
  console.log(`    Cloud Name : ${process.env.CLOUDINARY_CLOUD_NAME || "(missing)"}`);
  console.log(`    API Key    : ${process.env.CLOUDINARY_API_KEY || "(missing)"}`);
  console.log(`    API Secret : ${process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.slice(0, 4) + "..." : "(missing)"}`);

  try {
    await new Promise((resolve, reject) => {
      cloudinary.api.ping((err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
    console.log(">>> [OK] Cloudinary credentials authenticated successfully.\n");
  } catch (authErr) {
    console.error("\n>>> [ERROR] Cloudinary Authentication Failed!");
    console.error(`    Details: ${authErr.message || JSON.stringify(authErr)}`);
    if (authErr.message && authErr.message.includes("api_secret mismatch")) {
      console.error("\n>>> [CAUSE] CLOUDINARY_API_SECRET in Backend/.env matches the API Key.");
      console.error("    Please open your Cloudinary Dashboard (https://console.cloudinary.com/),");
      console.error("    copy the 'API Secret' (not API Key), and update CLOUDINARY_API_SECRET in Backend/.env.\n");
    }
    process.exit(1);
  }

  // Step 2: Connect to MongoDB
  console.log(">>> Connecting to MongoDB Atlas...");
  await connectDB();
  const collection = mongoose.connection.collection("Products");

  // Step 3: Fetch all products
  const products = await collection.find({}).sort({ createdAt: -1 }).toArray();
  const total = products.length;
  console.log(`>>> Found ${total} documents in 'Products' collection.\n`);

  let successCount = 0;
  let skippedCount = 0;
  const failedDocs = [];

  // Step 4: Iterate and upload Base64 images to Cloudinary
  for (let i = 0; i < total; i++) {
    const p = products[i];
    const indexStr = `[${String(i + 1).padStart(2, " ")}/${total}]`;
    const docId = p._id.toString();
    const productName = p.name || "Unnamed Product";
    const uniqueTag = sanitizeId(p.uniqueId || p.code || docId);

    // Check image field
    if (!p.image || typeof p.image !== "string" || p.image.trim() === "") {
      console.log(`${indexStr} [SKIP] "${productName}" - No image string found.`);
      skippedCount++;
      continue;
    }

    // If already migrated to Cloudinary / HTTP URL
    if (p.image.startsWith("http://") || p.image.startsWith("https://")) {
      console.log(`${indexStr} [SKIP] "${productName}" - Already a remote URL (${p.image.slice(0, 50)}...).`);
      skippedCount++;
      continue;
    }

    // Verify it is base64
    const isBase64 = p.image.startsWith("data:image/") || p.image.length > 500;
    if (!isBase64) {
      console.log(`${indexStr} [SKIP] "${productName}" - Image is neither URL nor Base64.`);
      skippedCount++;
      continue;
    }

    // Upload to Cloudinary
    try {
      const publicId = `product_${uniqueTag}`;
      const payloadSizeKb = Math.round(p.image.length / 1024);
      process.stdout.write(`${indexStr} [UPLOADING] "${productName}" (~${payloadSizeKb} KB)... `);

      const uploadResult = await cloudinary.uploader.upload(p.image, {
        folder: "vastra_products",
        public_id: publicId,
        overwrite: true,
        resource_type: "image"
      });

      const secureUrl = uploadResult.secure_url;

      // Update document in MongoDB
      await collection.updateOne(
        { _id: p._id },
        {
          $set: {
            image: secureUrl,
            cloudinaryPublicId: uploadResult.public_id,
            imageMigratedAt: new Date()
          }
        }
      );

      console.log(`DONE!`);
      console.log(`          -> Cloudinary URL: ${secureUrl}`);
      successCount++;
    } catch (uploadErr) {
      console.log(`FAILED!`);
      console.error(`          -> Error: ${uploadErr.message}`);
      failedDocs.push({ id: docId, name: productName, error: uploadErr.message });
    }
  }

  // Step 5: Final Migration Report
  console.log("\n==================================================");
  console.log("            MIGRATION SUMMARY REPORT              ");
  console.log("==================================================");
  console.log(` Total Documents Checked : ${total}`);
  console.log(` Successfully Migrated   : ${successCount}`);
  console.log(` Skipped (Already URLs)  : ${skippedCount}`);
  console.log(` Failed Uploads          : ${failedDocs.length}`);
  console.log("==================================================\n");

  if (failedDocs.length > 0) {
    console.error("The following documents failed during migration:");
    failedDocs.forEach((f) => {
      console.error(` - Product: "${f.name}" (ID: ${f.id}) | Reason: ${f.error}`);
    });
  } else {
    console.log("All eligible documents have been successfully migrated to Cloudinary!");
  }

  await mongoose.disconnect();
  console.log("Database connection closed. Migration finished.");
  process.exit(failedDocs.length > 0 ? 1 : 0);
}

runMigration().catch((err) => {
  console.error("Fatal Migration Error:", err);
  process.exit(1);
});
