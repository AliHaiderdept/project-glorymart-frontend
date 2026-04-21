import { useState } from "react";

export default function CheckoutPage({ items, productsById, onPlaceOrder, onNavigate }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    payment: "COD",
  });

  const total = items.reduce((sum, item) => sum + (productsById[item.productId]?.price || 0) * item.qty, 0);

  if (!items.length) {
    return (
      <div className="container py-5">
        <div className="card glass-card border-0 p-4 text-center">
          <p className="mb-3 text-secondary">Cart is empty. Add items before checkout.</p>
          <button className="btn neon-btn" onClick={() => onNavigate("listing")}>Go to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <h3 className="fw-bold heading-primary mb-3 reveal-item">Checkout</h3>
      <div className="row g-4">
        <div className="col-lg-7">
          <form
            className="card glass-card border-0 p-3 reveal-item"
            onSubmit={(event) => {
              event.preventDefault();
              onPlaceOrder(form);
            }}
          >
            <h5 className="fw-bold mb-3">Address & Payment</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <input className="form-control" placeholder="Full name" value={form.fullName} onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))} required />
              </div>
              <div className="col-md-6">
                <input className="form-control" placeholder="Phone number" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} required />
              </div>
              <div className="col-12">
                <input type="email" className="form-control" placeholder="Email address" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required />
              </div>
              <div className="col-12">
                <input className="form-control" placeholder="Street address" value={form.address} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} required />
              </div>
              <div className="col-md-6">
                <input className="form-control" placeholder="City" value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} required />
              </div>
              <div className="col-md-6">
                <select className="form-select" value={form.payment} onChange={(event) => setForm((prev) => ({ ...prev, payment: event.target.value }))}>
                  <option value="COD">Cash on Delivery</option>
                  <option value="DUMMY"> Card Payment</option>
                </select>
              </div>
            </div>

            <button className="btn neon-btn mt-3 w-100">Place Order</button>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="card glass-card border-0 p-3 reveal-item">
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <div className="d-grid gap-2 mb-3">
              {items.map((item) => {
                const product = productsById[item.productId];
                if (!product) return null;
                return (
                  <div className="d-flex justify-content-between small" key={item.productId}>
                    <span>{product.name} x {item.qty}</span>
                    <span>${(product.price * item.qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <strong>Total</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
