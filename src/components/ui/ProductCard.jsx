import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { createFallbackImage, normalizeImageUrl } from "../../utils/imageFallback";

export default function ProductCard({ product, vendorName, onView, onAdd }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  };

  return (
    <article className="card glass-card product-card h-100 border-0 reveal-item">
      <div className="position-relative overflow-hidden rounded-top-4">
        <img
          src={normalizeImageUrl(product.image, product.name)}
          alt={product.name}
          className="card-img-top"
          style={{ height: "210px", objectFit: "cover" }}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = createFallbackImage(product.name);
          }}
        />
        <span className="badge text-bg-dark position-absolute top-0 start-0 m-2">{product.category}</span>
      </div>
      <div className="card-body d-flex flex-column">
        <h6 className="fw-bold mb-1 product-title">{product.name}</h6>
        <p className="small text-info-emphasis mb-2">by {vendorName}</p>
        <p className="small text-secondary flex-grow-1 product-desc">{product.description}</p>

        <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
          <strong>${product.price.toFixed(2)}</strong>
          <span className={`small fw-medium ${product.stock > 0 ? "text-success" : "text-danger"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-light btn-sm flex-fill neon-outline-btn" onClick={() => onView(product.id)}>
            View
          </button>
          <button className={`btn btn-sm flex-fill neon-btn ${added ? "is-added" : ""}`} onClick={handleAdd}>
            <ShoppingCart size={15} className="me-1" />
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
