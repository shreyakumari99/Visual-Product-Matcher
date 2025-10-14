from transformers import pipeline
from PIL import Image
from io import BytesIO
import base64
from flask import Flask, request, jsonify

app = Flask(__name__)

print("🔄 Loading inclusionAI/MingTok-Vision model (please wait)...")
pipe = pipeline("image-feature-extraction", model="inclusionAI/MingTok-Vision")
print("✅ Model loaded successfully!")

@app.route("/get-embedding", methods=["POST"])
def get_embedding():
    try:
        data = request.get_json()
        base64_image = data["image"]
        image = Image.open(BytesIO(base64.b64decode(base64_image)))

        result = pipe(image)
        embedding = result[0]

        return jsonify({"embedding": embedding})
    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)