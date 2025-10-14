import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const HF_API_KEY = process.env.HF_API_KEY;

const test = async () => {
  try {
    console.log("🔍 Testing Hugging Face API...");
    console.log("Using key:", HF_API_KEY ? "✅ Loaded from .env" : "❌ Not found!");

    // Small transparent PNG base64 (tiny placeholder, safe to use)
    const base64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAmEBZ+UebxAAAAAASUVORK5CYII=";

    const res = await axios.post(
      // ✅ working public model endpoint
      "https://api-inference.huggingface.co/models/laion/CLIP-ViT-B-32-laion2B-s34B-b79K",
      { inputs: `data:image/png;base64,${base64}` },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    console.log("✅ Success! Response snippet:", JSON.stringify(res.data).slice(0, 200));
  } catch (err) {
    console.error("❌ Error:", err.response?.status, err.response?.data || err.message);
  }
};

test();
