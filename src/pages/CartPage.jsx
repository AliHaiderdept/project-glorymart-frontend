export default function CartPage({ items, productsById, onQty, onRemove, onNavigate }) {
  const subtotal = items.reduce((sum, item) => sum + (productsById[item.productId]?.price || 0) * item.qty, 0);

  return (
    <div className="container py-4 py-md-5">
      <h3 className="fw-bold heading-primary mb-3 reveal-item">Cart</h3>
      {!items.length ? (
        <div className="card glass-card border-0 p-4 text-center reveal-item">
          <p className="text-secondary mb-3">Your cart is currently empty.</p>
          <button className="btn neon-btn" onClick={() => onNavigate("listing")}>Browse Products</button>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card glass-card border-0 p-3 reveal-item">
              <div className="d-grid gap-3">
                {items.map((item) => {
                  const product = productsById[item.productId];
                  if (!product) return null;
                  return (
                    <div className="d-flex gap-3 align-items-center cart-row" key={item.productId}>
                      <img src={product.image} alt={product.name} width="78" height="78" className="rounded-3" style={{ objectFit: "cover" }} />
                      <div className="flex-grow-1">
                        <div className="fw-semibold product-title">{product.name}</div>
                        <div className="small text-secondary">${product.price.toFixed(2)}</div>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        className="form-control form-control-sm"
                        style={{ width: "82px" }}
                        value={item.qty}
                        onChange={(event) => onQty(item.productId, Number(event.target.value || 1))}
                      />
                      <button className="btn btn-sm neon-outline-btn" onClick={() => onRemove(item.productId)}>Remove</button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card glass-card border-0 p-3 reveal-item">
              <h5 className="fw-bold mb-3">Total</h5>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-secondary">Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <button className="btn neon-btn w-100" onClick={() => onNavigate("checkout")}>Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
