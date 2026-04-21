import { useEffect, useMemo, useState } from "react";
import AnimatedBackground from "./components/effects/AnimatedBackground";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loader from "./components/ui/Loader";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VendorDashboardPage from "./pages/VendorDashboardPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import { initialOrders, products, vendors } from "./data/seedData";
import "./styles.css";
import { API_BASE } from "./config/api";

function makeProductsMap(list) {
  return Object.fromEntries(list.map((item) => [item.id, item]));
}

function isNetworkFetchError(error) {
  const message = String(error?.message || "").toLowerCase();
  return message.includes("failed to fetch") || message.includes("networkerror");
}

async function apiFetch(path, options) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = API_BASE;

  try {
    return await fetch(`${baseUrl}${normalizedPath}`, options);
  } catch (error) {
    throw error;
  }

  throw lastError || new Error("Failed to fetch");
}

async function readJsonResponse(response) {
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const validationErrors = data?.errors && typeof data.errors === "object"
      ? Object.values(data.errors).flat().filter(Boolean).join(" ")
      : "";
    const message = validationErrors || data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}

function themeByView(view) {
  if (view === "home") return "home";
  if (view === "listing") return "listing";
  if (view === "detail") return "detail";
  if (view === "cart") return "cart";
  if (view === "checkout") return "checkout";
  if (view === "orders") return "orders";
  if (view === "login" || view === "register") return "auth";
  if (view === "vendor") return "vendor";
  if (view === "admin") return "admin";
  return "home";
}

export default function App() {
  const [view, setView] = useState(() => {
    try {
      const saved = localStorage.getItem("appView");
      return saved && ["home", "listing", "detail", "cart", "checkout", "orders", "login", "register", "vendor", "admin"].includes(saved) ? saved : "home";
    } catch {
      return "home";
    }
  });

  const [selectedProductId, setSelectedProductId] = useState(() => {
    try {
      const saved = localStorage.getItem("selectedProductId");
      return saved ? JSON.parse(saved) : products[0].id;
    } catch {
      return products[0].id;
    }
  });

  const [listingPreset, setListingPreset] = useState(() => {
    try {
      const saved = localStorage.getItem("listingPreset");
      return saved ? JSON.parse(saved) : { category: "all", query: "" };
    } catch {
      return { category: "all", query: "" };
    }
  });

  const [listingNotice, setListingNotice] = useState("");
  const [loginPrefillEmail, setLoginPrefillEmail] = useState("");
  const [catalog, setCatalog] = useState(() => {
    try {
      const cached = localStorage.getItem("catalogCache");
      const parsed = cached ? JSON.parse(cached) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : products;
    } catch {
      return products;
    }
  });
  const [vendorList, setVendorList] = useState(() => {
    try {
      const cached = localStorage.getItem("vendorCache");
      const parsed = cached ? JSON.parse(cached) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : vendors;
    } catch {
      return vendors;
    }
  });
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(initialOrders);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const cached = localStorage.getItem("authUser");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [homeSearch, setHomeSearch] = useState("");
  const [listingLoading, setListingLoading] = useState(false);

  const productsById = useMemo(() => makeProductsMap(catalog), [catalog]);
  const availableCategories = useMemo(
    () => Array.from(new Set(catalog.map((product) => product.category))).sort((a, b) => a.localeCompare(b)),
    [catalog],
  );
  const featuredProducts = useMemo(() => catalog.filter((product) => product.featured).slice(0, 8), [catalog]);
  const selectedProduct = productsById[selectedProductId];
  const selectedVendor = vendorList.find((item) => item.id === selectedProduct?.vendorId);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      try {
        const [apiProductsResponse, apiVendorsResponse] = await Promise.all([
          apiFetch("/products", { headers: { Accept: "application/json" } }),
          apiFetch("/vendors", { headers: { Accept: "application/json" } }),
        ]);
        const [apiProducts, apiVendors] = await Promise.all([
          readJsonResponse(apiProductsResponse),
          readJsonResponse(apiVendorsResponse),
        ]);

        if (ignore) return;

        if (Array.isArray(apiProducts) && apiProducts.length) {
          setCatalog(apiProducts);
          try {
            localStorage.setItem("catalogCache", JSON.stringify(apiProducts));
          } catch (error) {
            console.warn("Failed to cache catalog:", error);
          }
        }

        if (Array.isArray(apiVendors) && apiVendors.length) {
          setVendorList(apiVendors);
          try {
            localStorage.setItem("vendorCache", JSON.stringify(apiVendors));
          } catch (error) {
            console.warn("Failed to cache vendors:", error);
          }
        }
      } catch (error) {
        console.warn("Backend catalog unavailable, using local seed data.", error);
      }
    }

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!catalog.length) return;
    if (!productsById[selectedProductId]) {
      setSelectedProductId(catalog[0].id);
    }
  }, [catalog, productsById, selectedProductId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return undefined;

    let ignore = false;

    async function restoreSession() {
      try {
        const authHeaders = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };
        const [userResponse, ordersResponse] = await Promise.all([
          apiFetch("/user", { headers: authHeaders }),
          apiFetch("/orders", { headers: authHeaders }),
        ]);

        const [user, apiOrders] = await Promise.all([
          readJsonResponse(userResponse),
          readJsonResponse(ordersResponse),
        ]);

        try {
          localStorage.setItem("authUser", JSON.stringify(user));
        } catch (error) {
          console.warn("Failed to cache auth user:", error);
        }

        if (!ignore) {
          setCurrentUser(user);
        }

        if (!ignore && Array.isArray(apiOrders)) {
          setOrders(apiOrders);
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("authUser");
        if (!ignore) {
          setCurrentUser(null);
        }
      }
    }

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (view === "listing") {
      setListingLoading(true);
      const timer = window.setTimeout(() => setListingLoading(false), 120);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [view]);

  useEffect(() => {
    try {
      localStorage.setItem("appView", view);
    } catch (error) {
      console.warn("Failed to save view to localStorage:", error);
    }
  }, [view]);

  useEffect(() => {
    try {
      localStorage.setItem("selectedProductId", JSON.stringify(selectedProductId));
    } catch (error) {
      console.warn("Failed to save selectedProductId to localStorage:", error);
    }
  }, [selectedProductId]);

  useEffect(() => {
    try {
      localStorage.setItem("listingPreset", JSON.stringify(listingPreset));
    } catch (error) {
      console.warn("Failed to save listingPreset to localStorage:", error);
    }
  }, [listingPreset]);

  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll(".reveal-item"));
    if (!revealTargets.length) return undefined;

    revealTargets.forEach((node) => node.classList.remove("visible"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    revealTargets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [view, listingLoading]);

  const navigate = (next, payload = {}) => {
    if (next === "checkout" && cartCount === 0) {
      setListingPreset({ category: "all", query: "" });
      setListingNotice("You have nothing added in the cart. Please pick one product to proceed and place your order.");
      setView("listing");
      return;
    }

    if (next === "listing") {
      setListingPreset({
        category: payload.category || "all",
        query: payload.query || homeSearch,
      });
      setListingNotice(payload.notice || "");
    }

    if (next === "login") {
      setLoginPrefillEmail(payload.email || "");
    }

    if (next === "detail" && payload.id) {
      setSelectedProductId(payload.id);
    }

    setView(next);
  };

  const handleAddToCart = (productId, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, qty: item.qty + qty } : item,
        );
      }
      return [...prev, { productId, qty }];
    });
  };

  const handleQty = (productId, qty) => {
    setCart((prev) => prev.map((item) => (item.productId === productId ? { ...item, qty: Math.max(1, qty) } : item)));
  };

  const handleRemove = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handlePlaceOrder = async (form) => {
    const token = localStorage.getItem("token");

    if (token && currentUser) {
      try {
        const response = await apiFetch("/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              productId: item.productId,
              qty: item.qty,
            })),
            shipping: form,
          }),
        });
        const order = await readJsonResponse(response);

        setOrders((prev) => [order, ...prev.filter((item) => item.id !== order.id)]);
        setCart([]);
        setView("orders");
        return;
      } catch (error) {
        console.warn("Backend order placement failed, falling back to local order handling.", error);
      }
    }

    const total = cart.reduce((sum, item) => sum + (productsById[item.productId]?.price || 0) * item.qty, 0);
    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerId: currentUser?.id || "guest",
      status: "Pending",
      createdAt: new Date().toISOString(),
      items: cart.map((item) => ({
        productId: item.productId,
        qty: item.qty,
        price: productsById[item.productId]?.price || 0,
      })),
      shipping: form,
      total,
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setView("orders");
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await apiFetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await readJsonResponse(response);

      localStorage.setItem("token", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setCurrentUser(data.user);

      try {
        const ordersResponse = await apiFetch("/orders", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        });
        const apiOrders = await readJsonResponse(ordersResponse);
        if (Array.isArray(apiOrders)) {
          setOrders(apiOrders);
        }
      } catch (error) {
        console.warn("Unable to load orders after login.", error);
      }

      return { ok: true };
    } catch (error) {
      const message =
        error.message === "Failed to fetch"
          ? "Cannot reach backend API. Ensure Laravel is running on port 8000 and frontend dev server has been restarted."
          : error.message;
      return { ok: false, message };
    }
  };

  const handleRegister = async (payload) => {
    try {
      const response = await apiFetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      await readJsonResponse(response);
      return { ok: true };
    } catch (error) {
      const message =
        error.message === "Failed to fetch"
          ? "Cannot reach backend API. Ensure Laravel is running on port 8000 and frontend dev server has been restarted."
          : error.message;
      return { ok: false, message };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await apiFetch("/logout", {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.warn("Logout request failed.", error);
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    setCurrentUser(null);
    setOrders(initialOrders);
    setView("home");
  };

  return (
    <div className={`app-shell page-${themeByView(view)}`}>
      <AnimatedBackground page={themeByView(view)} />
      <Navbar active={view} onNavigate={navigate} cartCount={cartCount} currentUser={currentUser} onLogout={logout} />

      <main className="content-shell">
        {view === "home" ? (
          <HomePage
            categories={availableCategories}
            products={catalog}
            featured={featuredProducts}
            vendors={vendorList}
            searchText={homeSearch}
            setSearchText={setHomeSearch}
            onNavigate={navigate}
            onAdd={handleAddToCart}
          />
        ) : null}

        {view === "listing" ? (
          listingLoading ? (
            <Loader />
          ) : (
            <ProductListingPage
              products={catalog}
              categories={availableCategories}
              vendors={vendorList}
              initialCategory={listingPreset.category}
              initialQuery={listingPreset.query}
              noticeMessage={listingNotice}
              onNavigate={navigate}
              onAdd={handleAddToCart}
            />
          )
        ) : null}

        {view === "detail" ? (
          <ProductDetailPage
            product={selectedProduct}
            vendor={selectedVendor}
            onAdd={handleAddToCart}
            onNavigate={navigate}
          />
        ) : null}

        {view === "cart" ? (
          <CartPage
            items={cart}
            productsById={productsById}
            onQty={handleQty}
            onRemove={handleRemove}
            onNavigate={navigate}
          />
        ) : null}

        {view === "checkout" ? (
          <CheckoutPage
            items={cart}
            productsById={productsById}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={navigate}
          />
        ) : null}

        {view === "orders" ? (
          <OrderHistoryPage
            orders={orders}
            productsById={productsById}
            currentUser={currentUser}
          />
        ) : null}

        {view === "login" ? <LoginPage onLogin={handleLogin} onNavigate={navigate} prefillEmail={loginPrefillEmail} /> : null}
        {view === "register" ? <RegisterPage onRegister={handleRegister} onNavigate={navigate} /> : null}
        {view === "vendor" ? <VendorDashboardPage currentUser={currentUser} products={catalog} orders={orders} /> : null}
        {view === "admin" ? <AdminPanelPage currentUser={currentUser} /> : null}
      </main>

      <Footer />
    </div>
  );
}
