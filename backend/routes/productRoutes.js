import express from "express";
import multer from "multer";
import axios from "axios";
import Product from "../models/Product.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// --- Cosine similarity ---
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// --- Get embedding from local Python microservice ---
async function getEmbedding(base64) {
  try {
    const res = await axios.post("http://127.0.0.1:5000/get-embedding", {
      image: base64,
    });
    return res.data.embedding;
  } catch (err) {
    console.error("❌ Local embedding error:", err.message);
    throw new Error("Failed to generate embedding via local Python service");
  }
}

// --- Upload image & find similar products ---
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const fs = await import("fs");
    const buffer = fs.readFileSync(req.file.path);
    const base64 = buffer.toString("base64");

    const queryEmbedding = await getEmbedding(base64);

    const products = await Product.find({});
    const scored = products.map((p) => ({
      ...p._doc,
      score: cosine(queryEmbedding, p.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);
    res.json(scored.slice(0, 12));
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- Search by image URL ---
router.post("/by-url", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64 = Buffer.from(img.data).toString("base64");

    const queryEmbedding = await getEmbedding(base64);

    const products = await Product.find({});
    const scored = products.map((p) => ({
      ...p._doc,
      score: cosine(queryEmbedding, p.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);
    res.json(scored.slice(0, 12));
  } catch (err) {
    console.error("❌ URL search error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;