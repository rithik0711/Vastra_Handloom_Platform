const express = require("express");
const mongoose = require("mongoose");
const https = require("https");
const http = require("http");

const router = express.Router();

// Schema for 'ManufacturerDesigns' collection in MongoDB (Dynamic fields without static presets)
const designSchema = new mongoose.Schema(
  {
    manufacturerId: { type: String, required: true },
    title: { type: String, required: true },
    fabric: { type: String },
    baseColor: { type: String },
    customBaseHex: { type: String },
    borderStyle: { type: String },
    borderWidth: { type: String },
    zari: { type: String },
    palluDesign: { type: String },
    palluColor: { type: String },
    customPalluHex: { type: String },
    motifs: { type: [String], default: [] },
    customMotifText: { type: String },
    bodyPattern: { type: String },
    patternDensity: { type: String },
    occasion: { type: String },
    designStyle: { type: String },
    additionalInstructions: { type: String },
    compiledPrompt: { type: String },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    collection: "ManufacturerDesigns",
    timestamps: true,
    strict: false
  }
);

const DesignModel =
  mongoose.models.ManufacturerDesign ||
  mongoose.model("ManufacturerDesign", designSchema, "ManufacturerDesigns");

// Helper: Make HTTP/HTTPS request with timeout
const makeHttpRequest = (urlStr, options = {}, postData = null, timeoutMs = 4000) => {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(urlStr);
      const isHttps = url.protocol === "https:";
      const lib = isHttps ? https : http;

      const reqOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: options.method || "GET",
        headers: options.headers || {},
        timeout: timeoutMs
      };

      const req = lib.request(reqOptions, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({ statusCode: res.statusCode, headers: res.headers, body });
        });
      });

      req.on("timeout", () => {
        req.destroy();
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      });

      req.on("error", (err) => {
        reject(err);
      });

      if (postData) {
        req.write(postData);
      }
      req.end();
    } catch (err) {
      reject(err);
    }
  });
};

// Build prompt dynamically from user's custom design specifications - Saree textile product ONLY (no humans)
const buildPromptFromUserDetails = (design) => {
  if (design.compiledPrompt && design.compiledPrompt.trim()) {
    return `${design.compiledPrompt.trim()}, commercial product catalog photo of folded saree textile only, no human, no woman, no model, no mannequin, no face.`;
  }

  const parts = [];
  if (design.fabric) parts.push(`${design.fabric} textile`);
  if (design.baseColor) parts.push(`main body color in ${design.baseColor}`);
  if (design.borderStyle && design.borderStyle !== "No Border") {
    parts.push(`${design.borderWidth || ""} ${design.borderStyle} along the border edge`);
  }
  if (design.zari && design.zari !== "No Zari") {
    parts.push(`shimmering ${design.zari} zari metallic thread brocade work`);
  }
  if (design.palluDesign) {
    parts.push(`ornate ${design.palluDesign} pallu motif`);
  }
  if (design.palluColor && design.palluColor !== "Same as Body") {
    parts.push(`contrast ${design.palluColor} colored pallu section`);
  }
  if (Array.isArray(design.motifs) && design.motifs.length > 0) {
    parts.push(`intricate ${design.motifs.join(", ")} butta motifs on body`);
  }
  if (design.customMotifText) {
    parts.push(`custom motif details: ${design.customMotifText}`);
  }
  if (design.bodyPattern && design.bodyPattern !== "Plain") {
    parts.push(`all-over ${design.bodyPattern} pattern`);
  }
  if (design.additionalInstructions) {
    parts.push(`weave specifications: ${design.additionalInstructions}`);
  }

  return `Commercial product catalog photography of an authentic handcrafted Indian saree fabric only, flat-lay folded presentation on neutral background displaying pallu, border, and body fabric, ${parts.join(", ")}, 8k resolution, crisp woven texture, pure fabric product only, no human, no woman, no person, no model, no mannequin, no face, studio lighting.`;
};

// Call Image Gen API (Black Forest Labs FLUX) using the key in .env
const callImageGenAPI = async (prompt, apiKey) => {
  const postData = JSON.stringify({
    prompt: prompt,
    width: 1024,
    height: 768
  });

  try {
    const res = await makeHttpRequest(
      "https://api.bfl.ml/v1/flux-pro-1.1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-key": apiKey,
          "Content-Length": Buffer.byteLength(postData)
        }
      },
      postData,
      3500
    );

    if (res.statusCode >= 200 && res.statusCode < 300) {
      const data = JSON.parse(res.body);
      const taskId = data.id;
      if (taskId) {
        // Poll for result
        for (let i = 0; i < 4; i++) {
          await new Promise((r) => setTimeout(r, 1500));
          const pollRes = await makeHttpRequest(
            `https://api.bfl.ml/v1/get_result?id=${taskId}`,
            {
              method: "GET",
              headers: { "x-key": apiKey }
            },
            null,
            3000
          );

          if (pollRes.statusCode === 200) {
            const pollData = JSON.parse(pollRes.body);
            if (pollData.status === "Ready" && pollData.result && pollData.result.sample) {
              return pollData.result.sample;
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("BFL API request note:", err.message);
  }

  // Generate with FLUX engine based dynamically on user's exact prompt
  const encodedPrompt = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 999999);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=768&model=flux&seed=${seed}&nologo=true&enhance=true`;
};

// 1. Generate Image from User Design Details
router.post("/generate-image", async (req, res) => {
  try {
    const userDesign = req.body;
    const apiKey = (process.env.Image_Gen_API || "").trim();

    // Dynamically build the prompt from the user's specific details
    const dynamicPrompt = buildPromptFromUserDetails(userDesign);

    // Call the Image Generation API
    const imageUrl = await callImageGenAPI(dynamicPrompt, apiKey);

    // If designId is supplied, update the existing design in MongoDB
    if (userDesign.designId) {
      let filter;
      if (mongoose.Types.ObjectId.isValid(userDesign.designId)) {
        filter = { _id: new mongoose.Types.ObjectId(userDesign.designId) };
      } else {
        filter = { $or: [{ _id: userDesign.designId }, { id: userDesign.designId }] };
      }

      await DesignModel.updateOne(filter, {
        $set: {
          imageUrl: imageUrl,
          updatedAt: new Date()
        }
      });
    }

    return res.json({
      status: "success",
      message: "Image generated successfully from user design details",
      data: {
        imageUrl: imageUrl,
        prompt: dynamicPrompt
      }
    });
  } catch (error) {
    console.error("Generate Image Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 2. GET all saved designs for a manufacturer
router.get("/", async (req, res) => {
  try {
    const manufacturerId = (req.query.manufacturerId || "kathar_weaves").trim();

    const designs = await DesignModel.find({
      $or: [
        { manufacturerId: manufacturerId },
        { manufacturerId: { $regex: new RegExp(`^${manufacturerId}$`, "i") } }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      status: "success",
      count: designs.length,
      data: designs
    });
  } catch (error) {
    console.error("Get Designs Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 3. GET single design by ID (View all details of the design)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let filter;
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter = { _id: new mongoose.Types.ObjectId(id) };
    } else {
      filter = { $or: [{ _id: id }, { id: id }] };
    }

    const design = await DesignModel.findOne(filter).lean();
    if (!design) {
      return res.status(404).json({ status: "error", message: "Design not found" });
    }

    return res.json({
      status: "success",
      data: design
    });
  } catch (error) {
    console.error("Get Design Details Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 4. Save a new design specification (with user inputs & image)
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const manufacturerId = (payload.manufacturerId || "kathar_weaves").trim();

    // If imageUrl is not provided, generate it dynamically from the user's design details
    let imageUrl = payload.imageUrl || "";
    if (!imageUrl) {
      const apiKey = (process.env.Image_Gen_API || "").trim();
      const prompt = buildPromptFromUserDetails(payload);
      imageUrl = await callImageGenAPI(prompt, apiKey);
    }

    const newDesign = new DesignModel({
      ...payload,
      manufacturerId,
      imageUrl,
      createdAt: payload.createdAt || new Date(),
      updatedAt: new Date()
    });

    const saved = await newDesign.save();

    return res.status(201).json({
      status: "success",
      message: "Design specification saved successfully into database",
      data: saved
    });
  } catch (error) {
    console.error("Save Design Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 5. Update an existing design specification
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    let filter;
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter = { _id: new mongoose.Types.ObjectId(id) };
    } else {
      filter = { $or: [{ _id: id }, { id: id }] };
    }

    const updated = await DesignModel.findOneAndUpdate(
      filter,
      {
        $set: {
          ...payload,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ status: "error", message: "Design not found" });
    }

    return res.json({
      status: "success",
      message: "Design specification updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Update Design Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 6. Delete a saved design
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let filter;
    if (mongoose.Types.ObjectId.isValid(id)) {
      filter = { _id: new mongoose.Types.ObjectId(id) };
    } else {
      filter = { $or: [{ _id: id }, { id: id }] };
    }

    const result = await DesignModel.deleteOne(filter);

    if (result.deletedCount === 0) {
      return res.status(404).json({ status: "error", message: "Design not found" });
    }

    return res.json({
      status: "success",
      message: "Design deleted successfully"
    });
  } catch (error) {
    console.error("Delete Design Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
