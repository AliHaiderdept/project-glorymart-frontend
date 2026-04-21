import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function LoginPage({ onLogin, onNavigate, prefillEmail = "" }) {
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEmail(prefillEmail || "");
  }, [prefillEmail]);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card glass-card border-0 p-4 auth-card reveal-item">
            <h3 className="fw-bold heading-primary mb-3">Login</h3>
            {error ? <div className="alert alert-danger py-2">{error}</div> : null}
            <form
              className="d-grid gap-3"
              onSubmit={async (event) => {
                event.preventDefault();
                setError("");
                setIsSubmitting(true);
                const result = await onLogin(email, password);
                setIsSubmitting(false);
                if (!result.ok) {
                  setError(result.message || "Login failed.");
                  return;
                }
                onNavigate("home");
              }}
            >
              <input className="form-control" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={isSubmitting} />
              <input type="password" className="form-control" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={isSubmitting} />
              <button className="btn neon-btn d-inline-flex align-items-center justify-content-center gap-2" disabled={isSubmitting}>
                {isSubmitting ? <LoaderCircle size={18} className="spin-slow" /> : null}
                <span>{isSubmitting ? "Logging in..." : "Login"}</span>
              </button>
            </form>
            <button className="btn btn-link text-info mt-3 p-0" onClick={() => onNavigate("register")}>Create account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
