import { useMemo, useState } from "react";
import { ChevronDown, LogOut, Store } from "lucide-react";

export default function SiteNav({ currentUser, go, onLogout, accountItems = [] }) {
  const [accountOpen, setAccountOpen] = useState(false);

  const firstName = useMemo(() => currentUser?.name?.split(" ")[0] || "Guest", [currentUser]);
  const avatarUrl = currentUser?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.email || "glory-mart")}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark glass-nav sticky-top">
      <div className="container py-2 position-relative">
        <button className="navbar-brand fw-bold d-flex align-items-center gap-2 border-0 bg-transparent p-0 brand-mark" onClick={() => go({ name: "home" })}>
          <Store size={20} />
          <span>Glory Mart</span>
        </button>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#gloryNav" aria-controls="gloryNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="gloryNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => go({ name: "home" })}>Products</button></li>
            {currentUser?.role === "customer" ? <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => go({ name: "orders" })}>My Orders</button></li> : null}
            {currentUser?.role === "vendor" ? <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => go({ name: "vendor" })}>Vendor Dashboard</button></li> : null}
            {currentUser?.role === "admin" ? <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => go({ name: "admin" })}>Admin Panel</button></li> : null}
          </ul>

          <div className="d-flex align-items-center gap-2 ms-auto position-relative">
            {currentUser ? (
              <>
                <button
                  type="button"
                  className="btn btn-sm btn-light-subtle text-white account-trigger"
                  onClick={() => setAccountOpen((value) => !value)}
                >
                  <span className="me-2">Hello, {firstName}</span>
                  <span className="fw-semibold">Account and Lists</span>
                  <ChevronDown size={14} className="ms-2" />
                </button>
                {accountOpen ? (
                  <div className="dropdown-card dropdown-end mt-2 p-3">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img src={avatarUrl} alt={currentUser.name} className="rounded-circle border border-white" width="48" height="48" />
                      <div>
                        <div className="fw-semibold text-white">{currentUser.name}</div>
                        <div className="small text-white-50">{currentUser.email}</div>
                        <div className="small text-white-50 text-capitalize">{currentUser.role}</div>
                      </div>
                    </div>
                    <div className="small text-white-50 mb-2">Your listings</div>
                    <div className="d-grid gap-1 mb-3">
                      {accountItems.length ? accountItems.map((item) => <div key={item} className="account-list-item">{item}</div>) : <div className="account-list-item">No listings available</div>}
                    </div>
                    <button className="btn btn-sm btn-warning w-100 d-inline-flex justify-content-center align-items-center gap-2" onClick={onLogout}>
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <button className="btn btn-sm btn-outline-light" onClick={() => go({ name: "login" })}>Login</button>
                <button className="btn btn-sm btn-success" onClick={() => go({ name: "register" })}>Register</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
