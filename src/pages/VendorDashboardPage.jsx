import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, Boxes, ClipboardList, Layers3 } from "lucide-react";

function MiniBars({ values, tone = "cyan" }) {
  const max = Math.max(...values, 1);

  return (
    <div className="vendor-mini-bars" aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={`${tone}-${index}`}
          className={`vendor-mini-bar ${tone}`}
          style={{ height: `${Math.max((value / max) * 100, 14)}%` }}
        />
      ))}
    </div>
  );
}

export default function VendorDashboardPage({ currentUser, products, orders }) {
  const [activeTab, setActiveTab] = useState("overview");
  const overviewRef = useRef(null);
  const productsRef = useRef(null);
  const ordersRef = useRef(null);

  useEffect(() => {
    const targetMap = {
      overview: overviewRef,
      products: productsRef,
      orders: ordersRef,
    };
    targetMap[activeTab]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeTab]);

  const myProducts = useMemo(() => {
    if (!currentUser?.vendorId) return products;
    return products.filter((item) => item.vendorId === currentUser.vendorId);
  }, [currentUser?.vendorId, products]);

  const myProductIds = useMemo(() => new Set(myProducts.map((item) => item.id)), [myProducts]);
  const relatedOrders = useMemo(
    () => orders.filter((order) => order.items?.some((item) => myProductIds.has(item.productId))),
    [myProductIds, orders],
  );

  if (!currentUser || currentUser.role !== "vendor") {
    return (
      <div className="container py-5">
        <div className="card glass-card border-0 p-4 text-center">
          <p className="mb-0 text-secondary">Vendor access only.</p>
        </div>
      </div>
    );
  }
  const pendingOrders = relatedOrders.filter((order) => order.status === "Pending").length;
  const heldRevenue = relatedOrders
    .filter((order) => ["Shipped", "Delivered", "Completed"].includes(order.status))
    .reduce((sum, order) => sum + order.total, 0);
  const pendingRevenue = relatedOrders
    .filter((order) => order.status === "Pending")
    .reduce((sum, order) => sum + order.total, 0);
  const totalRevenue = heldRevenue + pendingRevenue;
  const heldPercent = totalRevenue > 0 ? (heldRevenue / totalRevenue) * 100 : 0;
  const pendingPercent = 100 - heldPercent;

  const chartRadius = 56;
  const chartCircumference = 2 * Math.PI * chartRadius;
  const heldDash = (heldPercent / 100) * chartCircumference;
  const pendingDash = Math.max(chartCircumference - heldDash, 0);

  const productsTrend = [48, 54, 58, 61, 66, 72];
  const pendingTrend = [36, 31, 28, 24, 20, 17];
  const revenueTrend = [24, 34, 42, 53, 61, 74];

  return (
    <div className="container-fluid py-4 px-3 px-md-4 vendor-theme-shell">
      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="card glass-card border-0 p-3 reveal-item">
            <h5 className="fw-bold heading-primary mb-3">Vendor Menu</h5>
            <div className="d-grid gap-2">
              <button
                type="button"
                className={`btn text-start ${activeTab === "overview" ? "neon-btn" : "neon-outline-btn"}`}
                onClick={() => setActiveTab("overview")}
              >
                <BarChart3 size={14} className="me-2" /> Overview
              </button>
              <button
                type="button"
                className={`btn text-start ${activeTab === "products" ? "neon-btn" : "neon-outline-btn"}`}
                onClick={() => setActiveTab("products")}
              >
                <Layers3 size={14} className="me-2" /> Products
              </button>
              <button
                type="button"
                className={`btn text-start ${activeTab === "orders" ? "neon-btn" : "neon-outline-btn"}`}
                onClick={() => setActiveTab("orders")}
              >
                <ClipboardList size={14} className="me-2" /> Orders
              </button>
            </div>
          </div>
        </aside>

        <section className="col-lg-9">
          <div ref={overviewRef} className="reveal-item">
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <div className="card glass-card border-0 p-3 h-100 vendor-metric-card">
                  <div className="vendor-metric-copy">
                    <p className="small text-secondary mb-1">Products</p>
                    <h4 className="fw-bold mb-0">{myProducts.length}</h4>
                  </div>
                  <MiniBars values={productsTrend} tone="cyan" />
                </div>
              </div>
              <div className="col-md-4">
                <div className="card glass-card border-0 p-3 h-100 vendor-metric-card">
                  <div className="vendor-metric-copy">
                    <p className="small text-secondary mb-1">Pending Orders</p>
                    <h4 className="fw-bold mb-0">{pendingOrders}</h4>
                  </div>
                  <MiniBars values={pendingTrend} tone="purple" />
                </div>
              </div>
              <div className="col-md-4">
                <div className="card glass-card border-0 p-3 h-100 vendor-metric-card">
                  <div className="vendor-metric-copy">
                    <p className="small text-secondary mb-1">Monthly Revenue</p>
                    <h4 className="fw-bold mb-0">${heldRevenue.toFixed(2)}</h4>
                  </div>
                  <MiniBars values={revenueTrend} tone="pink" />
                </div>
              </div>
            </div>

            <div className="card glass-card border-0 p-3 mb-4 vendor-revenue-card">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 className="fw-bold mb-0 heading-primary">Revenue Hold Overview</h5>
                <span className="small text-secondary">Total tracked: ${totalRevenue.toFixed(2)}</span>
              </div>

              <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                <div className="vendor-donut-wrap" role="img" aria-label="Revenue hold donut chart">
                  <svg viewBox="0 0 140 140" className="vendor-donut-chart">
                    <circle cx="70" cy="70" r={chartRadius} className="vendor-donut-track" />
                    <circle
                      cx="70"
                      cy="70"
                      r={chartRadius}
                      className="vendor-donut-segment held"
                      strokeDasharray={`${heldDash} ${chartCircumference - heldDash}`}
                    />
                    <circle
                      cx="70"
                      cy="70"
                      r={chartRadius}
                      className="vendor-donut-segment pending"
                      strokeDasharray={`${pendingDash} ${chartCircumference - pendingDash}`}
                      strokeDashoffset={-heldDash}
                    />
                  </svg>
                  <div className="vendor-donut-center">
                    <strong>{heldPercent.toFixed(0)}%</strong>
                    <span>Held</span>
                  </div>
                </div>

                <div className="d-grid gap-2 w-100">
                  <div className="vendor-revenue-legend-item">
                    <span className="vendor-dot held" />
                    <span>Held Revenue</span>
                    <strong>${heldRevenue.toFixed(2)}</strong>
                  </div>
                  <div className="vendor-revenue-legend-item">
                    <span className="vendor-dot pending" />
                    <span>Pending Revenue</span>
                    <strong>${pendingRevenue.toFixed(2)}</strong>
                  </div>
                  <div className="vendor-revenue-legend-item">
                    <span className="vendor-dot pending" />
                    <span>Pending Share</span>
                    <strong>{pendingPercent.toFixed(0)}%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div ref={productsRef} className="card glass-card border-0 p-3 reveal-item mb-4">
            <h5 className="fw-bold mb-3"><Boxes size={16} className="me-2" /> Product Table</h5>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {myProducts.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div ref={ordersRef} className="card glass-card border-0 p-3 reveal-item">
            <h5 className="fw-bold mb-3"><ClipboardList size={16} className="me-2" /> Orders</h5>
            <div className="d-grid gap-2">
              {relatedOrders.slice(0, 5).map((order) => (
                <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-2" key={order.id}>
                  <span>{order.id}</span>
                  <span className="badge text-bg-info">{order.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
