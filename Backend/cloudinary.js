const cloudinary = require("cloudinary").v2;

// Configure Cloudinary using environment variables from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads an image (Base64 data URI, buffer, or local path) to Cloudinary.
 * If the input is already an HTTP/HTTPS URL, returns it untouched.
 *
 * @param {string} imageStr - Base64 Data URL, image string, or URL
 * @param {string} folder - Target Cloudinary folder (default: "vastra_products")
 * @param {string} [publicId] - Optional public ID
 * @returns {Promise<string>} - Cloudinary secure HTTPS URL
 */
const uploadToCloudinary = async (imageStr, folder = "vastra_products", publicId = null) => {
  if (!imageStr || typeof imageStr !== "string") {
    return "";
  }

  const trimmed = imageStr.trim();
  if (!trimmed) {
    return "";
  }

  // If already a remote CDN / HTTPS URL, do not re-upload
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  try {
    const uploadOptions = {
      folder,
      resource_type: "image",
      overwrite: true
    };

    if (publicId) {
      uploadOptions.public_id = String(publicId).replace(/[^a-zA-Z0-9_-]/g, "_");
    }

    const result = await cloudinary.uploader.upload(trimmed, uploadOptions);
    return result.secure_url;
  } catch (error) {
    console.error(`Cloudinary Upload Error in folder "${folder}":`, error.message);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary
};
