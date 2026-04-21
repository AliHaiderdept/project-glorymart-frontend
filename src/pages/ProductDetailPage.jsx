import { createFallbackImage, normalizeImageUrl } from "../utils/imageFallback";

export default function ProductDetailPage({ product, vendor, onAdd, onNavigate }) {
  if (!product) {
    return (
      <div className="container py-5">
        <div className="card glass-card border-0 p-4 text-center">
          <p className="mb-0 text-secondary">Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <button className="btn neon-outline-btn btn-sm mb-3" onClick={() => onNavigate("listing")}>Back to listing</button>
      <div className="row g-4 align-items-stretch">
        <div className="col-lg-6 reveal-item">
          <div className="card glass-card border-0 p-2 h-100 product-spotlight">
            <img
              src={normalizeImageUrl(product.image, product.name)}
              alt={product.name}
              className="img-fluid rounded-4 detail-image"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = createFallbackImage(product.name);
              }}
            />
          </div>
        </div>
        <div className="col-lg-6 reveal-item">
          <div className="card glass-card border-0 p-4 h-100">
            <h2 className="fw-bold heading-primary mb-2">{product.name}</h2>
            <p className="text-secondary mb-3 product-desc">{product.description}</p>

            <div className="mb-2"><strong>Price:</strong> ${product.price.toFixed(2)}</div>
            <div className="mb-2"><strong>Vendor:</strong> {vendor?.name || "Vendor"}</div>
            <div className="mb-2"><strong>Category:</strong> {product.category}</div>
            <div className="mb-3"><strong>Stock:</strong> <span className={product.stock > 0 ? "text-success" : "text-danger"}>{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</span></div>

            <button className="btn neon-btn w-100" onClick={() => onAdd(product.id, 1)} disabled={product.stock <= 0}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
