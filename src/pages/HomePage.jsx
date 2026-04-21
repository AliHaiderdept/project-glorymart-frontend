import ProductCard from "../components/ui/ProductCard";
import { offers } from "../data/seedData";

export default function HomePage({ categories, products, featured, vendors, searchText, setSearchText, onNavigate, onAdd }) {
  const vendorNameById = Object.fromEntries(vendors.map((v) => [v.id, v.name]));
  const categoryCardData = categories.map((category) => {
    const relatedProducts = products.filter((item) => item.category === category);
    return {
      category,
      count: relatedProducts.length,
      previewNames: relatedProducts.slice(0, 2).map((item) => item.name),
    };
  });

  return (
    <div className="container py-4 py-md-5">
      <section className="hero-wrap mb-4 mb-md-5 reveal-item">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <p className="text-uppercase small fw-semibold text-info">Premium marketplace experience</p>
            <h1 className="display-6 fw-bold heading-primary mb-3">Discover products from trusted e-commerce store</h1>
            <p className="text-secondary mb-4 soft-copy">Find curated essentials, smart devices, fashion, and more with elegant shopping flow.</p>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn neon-btn" onClick={() => onNavigate("listing")}>Start Shopping</button>
              <button className="btn neon-outline-btn" onClick={() => onNavigate("register")}>Join as Vendor</button>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card glass-card p-3 offer-banner reveal-item">
              <h5 className="fw-bold mt-4">Search in all vendors</h5>
              <input
                className="form-control mb-2"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search products, categories, vendors"
              />
              <button className="btn neon-btn" onClick={() => onNavigate("listing")}>Search Products</button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-4 mb-md-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold heading-primary mb-0">Categories</h3>
        </div>
        <div className="row g-3">
          {categoryCardData.map((item) => (
            <div className="col-12 col-md-6 col-lg-4 col-xl-3 reveal-item" key={item.category}>
              <button
                className="w-100 card glass-card category-chip border-0 p-3 text-start"
                onClick={() => onNavigate("listing", { category: item.category })}
              >
                <span className="fw-semibold d-block">{item.category}</span>
                <span className="small text-secondary d-block mb-2">{item.count} items available</span>
                
                <span className="small text-info mt-2 d-inline-block">View all {item.category}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-4 mb-md-5">
        <h3 className="fw-bold heading-primary mb-3">Customer Offers</h3>
        <div className="row g-3">
          {offers.map((offer) => (
            <div className="col-md-4 reveal-item" key={offer.title}>
              <div className="card glass-card border-0 p-3 h-100">
                <h6 className="fw-bold mb-2">{offer.title}</h6>
                <p className="small text-secondary mb-0">{offer.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold heading-primary mb-0">Featured Products</h3>
          <button className="btn neon-outline-btn btn-sm" onClick={() => onNavigate("listing")}>View All</button>
        </div>
        <div className="row g-4">
          {featured.map((product) => (
            <div className="col-sm-6 col-lg-4 col-xl-3" key={product.id}>
              <ProductCard
                product={product}
                vendorName={vendorNameById[product.vendorId] || "Vendor"}
                onView={(id) => onNavigate("detail", { id })}
                onAdd={onAdd}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
