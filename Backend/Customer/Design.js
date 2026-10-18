const express = require("express");
const mongoose = require("mongoose");
const https = require("https");
const http = require("http");
const router = express.Router();

const designSchema = new mongoose.Schema(
  {
    customerId: { type: String, default: "" },
    customerEmail: { type: String, default: "" },
    manufacturerId: { type: String, default: "" },
    title: { type: String, required: true },
    fabric: { type: String, default: "" },
    baseColor: { type: String, default: "" },
    customBaseHex: { type: String, default: "" },
    borderStyle: { type: String, default: "" },
    borderWidth: { type: String, default: "" },
    zari: { type: String, default: "" },
    palluDesign: { type: String, default: "" },
    palluColor: { type: String, default: "" },
    customPalluHex: { type: String, default: "" },
    motifs: { type: [String], default: [] },
    customMotifText: { type: String, default: "" },
    bodyPattern: { type: String, default: "" },
    patternDensity: { type: String, default: "" },
    occasion: { type: String, default: "" },
    designStyle: { type: String, default: "" },
    additionalInstructions: { type: String, default: "" },
    compiledPrompt: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: "ManufacturerDesigns", timestamps: true, strict: false }
);

const DesignModel =
  mongoose.models.ManufacturerDesign ||
  mongoose.model("ManufacturerDesign", designSchema, "ManufacturerDesigns");

// Helper: Make HTTP request
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
        reject(new Error(`Timeout after ${timeoutMs}ms`));
      });

      req.on("error", (err) => reject(err));
      if (postData) req.write(postData);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
};

// 1. Generate AI Saree Image (Pure Textile Product, No Humans)
router.post("/generate-image", async (req, res) => {
  try {
    const design = req.body;
    const apiKey = (process.env.Image_Gen_API || "").trim();

    const parts = [];
    if (design.fabric) parts.push(`${design.fabric} textile`);
    if (design.baseColor) parts.push(`main body color in ${design.baseColor}`);
    if (design.borderStyle && design.borderStyle !== "No Border") {
      parts.push(`${design.borderWidth || ""} ${design.borderStyle} along border edge`);
    }
    if (design.zari && design.zari !== "No Zari") {
      parts.push(`shimmering ${design.zari} zari metallic thread brocade work`);
    }
    if (design.palluDesign) parts.push(`ornate ${design.palluDesign} pallu motif`);
    if (Array.isArray(design.motifs) && design.motifs.length > 0) {
      parts.push(`intricate ${design.motifs.join(", ")} butta motifs on body`);
    }
    if (design.additionalInstructions) {
      parts.push(`details: ${design.additionalInstructions}`);
    }

    const dynamicPrompt = `Commercial product catalog photography of an authentic handcrafted Indian saree fabric only, flat-lay folded presentation on neutral background displaying pallu, border, and body fabric, ${parts.join(", ")}, 8k resolution, crisp woven texture, pure fabric product only, no human, no woman, no person, no model, no mannequin, no face, studio lighting.`;

    let imageUrl = null;
    if (apiKey) {
      try {
        const postData = JSON.stringify({ prompt: dynamicPrompt, width: 1024, height: 768 });
        const bflRes = await makeHttpRequest(
          "https://api.bfl.ml/v1/flux-pro-1.1",
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-key": apiKey, "Content-Length": Buffer.byteLength(postData) }
          },
          postData,
          3500
        );
        if (bflRes.statusCode >= 200 && bflRes.statusCode < 300) {
          const bflData = JSON.parse(bflRes.body);
          if (bflData.id) {
            for (let i = 0; i < 3; i++) {
              await new Promise((r) => setTimeout(r, 1500));
              const pollRes = await makeHttpRequest(`https://api.bfl.ml/v1/get_result?id=${bflData.id}`, { headers: { "x-key": apiKey } }, null, 3000);
              if (pollRes.statusCode === 200) {
                const pData = JSON.parse(pollRes.body);
                if (pData.status === "Ready" && pData.result?.sample) {
                  imageUrl = pData.result.sample;
                  break;
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn("BFL generation fallback:", err.message);
      }
    }

    if (!imageUrl) {
      const seed = Math.floor(Math.random() * 999999);
      imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(dynamicPrompt)}?width=1024&height=768&model=flux&seed=${seed}&nologo=true&enhance=true`;
    }

    if (design.designId) {
      let filter = mongoose.Types.ObjectId.isValid(design.designId)
        ? { _id: new mongoose.Types.ObjectId(design.designId) }
        : { $or: [{ _id: design.designId }, { id: design.designId }] };
      await DesignModel.updateOne(filter, { $set: { imageUrl, updatedAt: new Date() } });
    }

    return res.json({
      status: "success",
      message: "AI Saree photo generated successfully",
      data: { imageUrl, prompt: dynamicPrompt }
    });
  } catch (error) {
    console.error("Customer Image Gen Error:", error);
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 2. GET customer designs
router.get("/", async (req, res) => {
  try {
    const customerEmail = (req.query.customerEmail || req.query.customerId || req.query.manufacturerId || "").trim();

    let query = {};
    if (customerEmail && customerEmail !== "all") {
      query = {
        $or: [
          { customerEmail: { $regex: new RegExp(`^${customerEmail}$`, "i") } },
          { customerId: { $regex: new RegExp(`^${customerEmail}$`, "i") } },
          { manufacturerId: { $regex: new RegExp(`^${customerEmail}$`, "i") } }
        ]
      };
    }

    const designs = await DesignModel.find(query).sort({ createdAt: -1 }).lean();
    return res.json({ status: "success", count: designs.length, data: designs });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 3. GET single design
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : { $or: [{ _id: id }, { id: id }] };

    const design = await DesignModel.findOne(filter).lean();
    if (!design) {
      return res.status(404).json({ status: "error", message: "Design not found" });
    }

    return res.json({ status: "success", data: design });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 4. POST save customer design
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    const customerEmail = (payload.customerEmail || payload.customerId || "").trim().toLowerCase();

    let imageUrl = payload.imageUrl || "";
    if (!imageUrl) {
      const seed = Math.floor(Math.random() * 999999);
      const prompt = `Commercial product catalog photography of handcrafted ${payload.fabric || "Pure Silk"} saree in ${payload.baseColor || "Maroon"} color with ${payload.zari || "Gold"} zari border and ${payload.palluDesign || "Peacock"} pallu, folded textile display, pure fabric product only, no human.`;
      imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=768&model=flux&seed=${seed}&nologo=true&enhance=true`;
    }

    const newDesign = new DesignModel({
      ...payload,
      customerEmail,
      customerId: customerEmail,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const saved = await newDesign.save();
    return res.status(201).json({ status: "success", message: "Custom design saved successfully", data: saved });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

// 5. DELETE customer design
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: new mongoose.Types.ObjectId(id) }
      : { $or: [{ _id: id }, { id: id }] };

    const result = await DesignModel.deleteOne(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ status: "error", message: "Design not found" });
    }

    return res.json({ status: "success", message: "Design deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
