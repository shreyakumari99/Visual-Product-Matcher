import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const MONGO = process.env.MONGO_URI;

const products = Array.from({ length: 50 }).map((_, i) => ({
  name: `Sample Product ${i + 1}`,
  category: i % 2 === 0 ? "apparel" : "home",
  image_url: `https://picsum.photos/seed/${i}/300`,
  embedding: Array.from({ length: 512 }, () => Math.random() - 0.5),
}));

mongoose
  .connect(MONGO)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Inserted 50 fake products");
    process.exit();
  })
  .catch((err) => console.error(err));
