import { useEffect, useRef } from "react";
import { Menu, ShoppingCart, Store } from "lucide-react";

const baseLinks = [
  { key: "home", label: "Home" },
  { key: "listing", label: "Shop" },
  { key: "orders", label: "Orders" },
];

const roleLinks = [
  { key: "vendor", label: "Vendor" },
  { key: "admin", label: "Admin" },
];

export default function Navbar({ active, onNavigate, cartCount, currentUser, onLogout }) {
  const navbarRef = useRef(null);
  const collapseRef = useRef(null);

  const closeMobileMenu = () => {
    if (window.innerWidth >= 992) return;

    const collapseEl = collapseRef.current;
    if (!collapseEl || !window.bootstrap?.Collapse) return;

    const collapse = window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
    collapse.hide();
  };

  const handleNavigate = (target, payload) => {
    onNavigate(target, payload);
    closeMobileMenu();
  };

  const handleLogout = () => {
    onLogout();
    closeMobileMenu();
  };

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (window.innerWidth >= 992) return;

      const navEl = navbarRef.current;
      const collapseEl = collapseRef.current;
      if (!navEl || !collapseEl || !collapseEl.classList.contains("show")) return;

      if (navEl.contains(event.target)) return;

      if (!window.bootstrap?.Collapse) return;
      const collapse = window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
      collapse.hide();
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
    };
  }, []);

  const visibleLinks = [
    ...baseLinks,
    ...(currentUser?.role === "vendor"
      ? roleLinks.filter((link) => link.key === "vendor")
      : currentUser?.role === "admin"
        ? roleLinks.filter((link) => link.key === "admin")
        : []),
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top premium-navbar" ref={navbarRef}>
      <div className="container">
        <button className="navbar-brand bg-transparent border-0 d-flex align-items-center gap-2 fw-bold" onClick={() => handleNavigate("home")}>
          <Store size={20} /> Glory Mart
        </button>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <Menu size={18} />
        </button>

        <div className="collapse navbar-collapse" id="mainNav" ref={collapseRef}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {visibleLinks.map((link) => (
              <li className="nav-item" key={link.key}>
                <button
                  className={`nav-link nav-link-animated btn btn-link ${active === link.key ? "is-active" : ""}`}
                  onClick={() => handleNavigate(link.key)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-4 nav-actions">
            <button className="btn btn-sm neon-outline-btn d-flex align-items-center" onClick={() => handleNavigate("cart")}>
              <ShoppingCart size={15} className="me-1" />
              <span>{cartCount} Cart</span>
            </button>
            <button
              className="btn btn-sm neon-btn d-flex align-items-center"
              onClick={() => handleNavigate("checkout")}
            >
              Place Order
            </button>
            {currentUser ? (
              <>
                <button className="btn btn-sm neon-btn" onClick={handleLogout}>Logout</button>
                <button
                  type="button"
                  className="btn btn-sm neon-outline-btn"
                  onClick={() => handleNavigate("login", { email: currentUser.email })}
                >
                  Switch
                </button>
                <span className="small text-light">Hello, {currentUser.name}</span>
              </>
            ) : (
              <>
                <button className="btn btn-sm neon-outline-btn" onClick={() => handleNavigate("login")}>Login</button>
                <button className="btn btn-sm neon-btn" onClick={() => handleNavigate("register")}>Register</button>
                
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
