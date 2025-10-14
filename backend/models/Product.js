import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  embedding: { type: [Number], required: true }
});

const Product = mongoose.model("Product", productSchema);
export default Product;