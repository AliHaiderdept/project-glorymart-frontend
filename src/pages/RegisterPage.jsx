import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function RegisterPage({ onRegister, onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card glass-card border-0 p-4 auth-card reveal-item">
            <h3 className="fw-bold heading-primary mb-3">Register</h3>
            {error ? <div className="alert alert-danger py-2">{error}</div> : null}
            <form
              className="row g-3"
              onSubmit={async (event) => {
                event.preventDefault();
                setError("");
                setIsSubmitting(true);
                const result = await onRegister(form);
                setIsSubmitting(false);
                if (!result.ok) {
                  setError(result.message || "Registration failed.");
                  return;
                }
                onNavigate("login", { email: form.email });
              }}
            >
              <div className="col-12">
                <input className="form-control" placeholder="Full name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required disabled={isSubmitting} />
              </div>
              <div className="col-12">
                <input type="email" className="form-control" placeholder="Email address" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} required disabled={isSubmitting} />
              </div>
              <div className="col-12">
                <input type="password" className="form-control" placeholder="Create password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} required disabled={isSubmitting} />
              </div>
              <div className="col-12">
                <select className="form-select" value={form.role} onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))} disabled={isSubmitting}>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
              <div className="col-12 d-grid">
                <button className="btn neon-btn d-inline-flex align-items-center justify-content-center gap-2" disabled={isSubmitting}>
                  {isSubmitting ? <LoaderCircle size={18} className="spin-slow" /> : null}
                  <span>{isSubmitting ? "Creating..." : "Create Account"}</span>
                </button>
              </div>
              <div className="col-12 d-grid">
                <button
                  type="button"
                  className="btn neon-outline-btn"
                  onClick={() => onNavigate("login", { email: form.email })}
                >
                  Switch Account
                </button>
              </div>
            </form>
            <button className="btn btn-link text-info mt-3 p-0" onClick={() => onNavigate("login", { email: form.email })}>Already have an account?</button>
          </div>
        </div>
      </div>
    </div>
  );
}
