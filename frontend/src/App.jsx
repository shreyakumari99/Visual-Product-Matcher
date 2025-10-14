import { useState } from "react";
import axios from "axios";
import UploadForm from "./components/UploadForm";
import ProductCard from "./components/ProductCard";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    const form = new FormData();
    form.append("image", file);
    setLoading(true);
    const res = await axios.post("http://localhost:4000/api/products/upload", form);
    setProducts(res.data);
    setLoading(false);
  };

  const handleUrl = async (url) => {
    setLoading(true);
    const res = await axios.post("http://localhost:4000/api/products/by-url", { imageUrl: url });
    setProducts(res.data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Visual Product Matcher</h1>
      <UploadForm onFileUpload={handleUpload} onUrlUpload={handleUrl} />
      {loading && <p className="text-center mt-4">Analyzing image...</p>}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mt-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
export default App;
