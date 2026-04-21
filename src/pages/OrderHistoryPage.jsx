export default function OrderHistoryPage({ orders, productsById, currentUser }) {
  const visibleOrders = currentUser
    ? orders.filter((order) => currentUser.role !== "customer" || order.customerId === currentUser.id)
    : [];

  return (
    <div className="container py-4 py-md-5">
      <h3 className="fw-bold heading-primary mb-3 reveal-item">Order History</h3>
      {!visibleOrders.length ? (
        <div className="card glass-card border-0 p-4 text-center reveal-item">
          <p className="mb-0 text-secondary">No previous orders available.</p>
        </div>
      ) : (
        <div className="d-grid gap-3">
          {visibleOrders.map((order) => (
            <div className="card glass-card border-0 p-3 reveal-item" key={order.id}>
              <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                <span><strong>ID:</strong> {order.id}</span>
                <span><strong>Status:</strong> <span className="badge text-bg-info">{order.status}</span></span>
                <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="small text-secondary mb-2">Items</div>
              <ul className="mb-2 small ps-3">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.productId}`}>
                    {productsById[item.productId]?.name || item.productId} x {item.qty}
                  </li>
                ))}
              </ul>
              <div><strong>Total:</strong> ${order.total.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
