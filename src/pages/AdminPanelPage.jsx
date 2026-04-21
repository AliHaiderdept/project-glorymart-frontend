import { useEffect, useState } from "react";
import { API_BASE } from "../config/api";

export default function AdminPanelPage({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState("");

  const hasAdminAccess = currentUser?.role === "admin";

  const loadUsers = async () => {
    if (!hasAdminAccess) return;

    const token = localStorage.getItem("token");

    try {
      setError("");
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load users.");
      }

      setUsers(Array.isArray(data?.data) ? data.data : []);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  const loadCategories = async () => {
    if (!hasAdminAccess) return;

    const token = localStorage.getItem("token");

    try {
      setError("");
      const response = await fetch(`${API_BASE}/admin/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load categories.");
      }

      setCategories(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    if (!hasAdminAccess) return;

    loadUsers();
    loadCategories();
  }, [hasAdminAccess]);

  const updateVendorStatus = async (vendorId, action) => {
    const token = localStorage.getItem("token");

    try {
      setError("");
      const response = await fetch(`${API_BASE}/admin/vendors/${vendorId}/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `Unable to ${action} vendor.`);
      }

      loadUsers();
    } catch (actionError) {
      setError(actionError.message);
    }
  };

  const saveCategory = async () => {
    const token = localStorage.getItem("token");
    const method = editingCategory ? "PUT" : "POST";
    const endpoint = editingCategory ? `${API_BASE}/admin/categories/${editingCategory.id}` : `${API_BASE}/admin/categories`;

    try {
      setError("");
      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName.trim() }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to save category.");
      }

      setCategoryName("");
      setEditingCategory(null);
      loadCategories();
    } catch (categoryError) {
      setError(categoryError.message);
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const deleteCategory = async (categoryId) => {
    const token = localStorage.getItem("token");

    try {
      setError("");
      const response = await fetch(`${API_BASE}/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to delete category.");
      }

      loadCategories();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  if (!hasAdminAccess) {
    return (
      <div className="container py-5">
        <div className="card glass-card border-0 p-4 text-center">
          <p className="mb-0 text-secondary">Admin access only.</p>
        </div>
      </div>
    );
  }

  const vendorUsers = users.filter((user) => user.role === "vendor");

  return (
    <div className="container py-4 py-md-5 admin-theme-shell">
      <h3 className="fw-bold heading-primary mb-3 reveal-item">Admin Panel</h3>
      {error ? <div className="alert alert-danger reveal-item">{error}</div> : null}

      <div className="row g-3">
        {vendorUsers.map((vendor) => (
          <div className="col-md-6 col-xl-4 reveal-item" key={vendor.id}>
            <div className="card glass-card border-0 p-3 h-100">
              <h6 className="fw-bold mb-1">{vendor.name}</h6>
              <p className="small text-secondary mb-1">{vendor.email}</p>
              <p className="small text-info mb-3">
                Status: {vendor.vendorApproved ? "Approved" : "Pending"}
              </p>

              <div className="d-flex gap-2 mt-auto">
                <button
                  onClick={() => updateVendorStatus(vendor.vendorId, "approve")}
                  className="btn btn-sm neon-btn flex-fill"
                  disabled={!vendor.vendorId}
                >
                  Approve
                </button>

                <button
                  onClick={() => updateVendorStatus(vendor.vendorId, "reject")}
                  className="btn btn-sm neon-outline-btn flex-fill"
                  disabled={!vendor.vendorId}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 mt-4 border-top reveal-item">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1">Product Categories</h5>
            <p className="text-secondary mb-0">Create and manage categories for the storefront.</p>
          </div>
          <div className="d-flex gap-2 w-100 w-md-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Category name"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
            />
            <button
              onClick={saveCategory}
              className="btn btn-sm neon-btn"
              disabled={!categoryName.trim()}
            >
              {editingCategory ? "Update" : "Create"}
            </button>
          </div>
        </div>

        <div className="row g-3">
          {categories.map((category) => (
            <div className="col-md-6 col-xl-4" key={category.id}>
              <div className="card glass-card border-0 p-3 h-100">
                <h6 className="fw-bold mb-1 text-capitalize">{category.name}</h6>
                <p className="small text-secondary mb-3">Slug: {category.slug}</p>
                <div className="d-flex gap-2 mt-auto">
                  <button
                    onClick={() => editCategory(category)}
                    className="btn btn-sm neon-btn flex-fill"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="btn btn-sm neon-outline-btn flex-fill"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
