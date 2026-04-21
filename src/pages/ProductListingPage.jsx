import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ui/ProductCard";

export default function ProductListingPage({
  products,
  categories,
  vendors,
  initialCategory = "all",
  initialQuery = "",
  noticeMessage = "",
  onNavigate,
  onAdd,
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSelectedCategory(initialCategory || "all");
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(initialQuery || "");
  }, [initialQuery]);

  const vendorNameById = useMemo(
    () => Object.fromEntries(vendors.map((vendor) => [vendor.id, vendor.name])),
    [vendors],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const vendorName = vendorNameById[product.vendorId] || "";
      const haystack = [
        product.name,
        product.description,
        product.category,
        vendorName,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [products, searchQuery, selectedCategory, vendorNameById]);

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 reveal-item">
        <div>
          <p className="text-uppercase small fw-semibold text-info mb-1">
            Explore catalog
          </p>
          <h2 className="fw-bold heading-primary mb-0">Product Listing</h2>
        </div>
        <button
          className="btn neon-outline-btn btn-sm"
          onClick={() => onNavigate("home")}
        >
          Back Home
        </button>
      </div>

      {noticeMessage ? (
        <div className="alert alert-info reveal-item" role="status">
          {noticeMessage}
        </div>
      ) : null}

      <section className="card glass-card border-0 p-3 p-md-4 mb-4 reveal-item">
        <div className="row g-3 align-items-end">
          <div className="col-lg-7">
            <label className="form-label fw-semibold">Search products</label>
            <input
              className="form-control"
              placeholder="Search by name, category, description, or vendor"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="col-md-6 col-lg-3">
            <label className="form-label fw-semibold">Category</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 col-lg-2 d-grid">
            <button
              className="btn neon-btn"
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <div className="d-flex justify-content-between align-items-center mb-3 reveal-item">
        <h3 className="fw-bold heading-primary mb-0">Available Products</h3>
        <span className="small text-secondary">
          {filteredProducts.length} item{filteredProducts.length === 1 ? "" : "s"}
        </span>
      </div>

      {!filteredProducts.length ? (
        <div className="card glass-card border-0 p-4 text-center reveal-item">
          <p className="text-secondary mb-3">
            No products matched your current search.
          </p>
          <button
            className="btn neon-btn"
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => (
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
      )}
    </div>
  );
}
