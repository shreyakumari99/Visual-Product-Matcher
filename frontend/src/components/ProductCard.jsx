export default function ProductCard({ product }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
      <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-3">
        <h2 className="font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-400">{product.category}</p>
        <p className="text-sm">Similarity: {(product.score * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}
