// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import cityApi from "../api/cityApi";
import { getCategoryName, getSubCategoryName } from "../utils/adminDashboard";
import "../styles/AdminDashboard.css";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: "⌂" },
  { key: "categories", label: "Categories", icon: "□" },
  { key: "orders", label: "Orders", icon: "🛒" },
  { key: "cities", label: "Cities", icon: "▥" },
  { key: "addresses", label: "Addresses", icon: "⌖" },
  { key: "reports", label: "Reports", icon: "⌁" },
  { key: "settings", label: "Settings", icon: "⚙" },
];

const buildCategoryRows = (categories) => {
  const rows = [];

  categories.forEach((category) => {
    rows.push({
      id: category.id,
      name: getCategoryName(category),
      parent: "—",
      sortOrder: category.updatedCategoryID || category.createdUserID || 1,
      level: 0,
    });

    (category.subCategories || []).forEach((subCategory, index) => {
      rows.push({
        id: subCategory.id,
        name: getSubCategoryName(subCategory),
        parent: getCategoryName(category),
        sortOrder: index + 1,
        level: 1,
      });
    });
  });

  return rows;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("categories");
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [cities, setCities] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");

    const settle = async (request, fallback = []) => {
      try {
        const response = await request();
        return Array.isArray(response.data) ? response.data : fallback;
      } catch (err) {
        console.error(err);
        return fallback;
      }
    };

    try {
      const [ordersData, categoriesData, addressesData, citiesData] = await Promise.all([
        settle(() => apiClient.get("/api/orders")),
        settle(() => apiClient.get("/api/categories/with-subcategories")),
        settle(() => apiClient.get("/api/addresses")),
        cityApi.getCities(),
      ]);

      setOrders(ordersData);
      setCategories(categoriesData);
      setAddresses(addressesData);
      setCities(citiesData);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const categoryRows = useMemo(() => buildCategoryRows(categories), [categories]);

  const filteredCategoryRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return categoryRows;
    }

    return categoryRows.filter((row) =>
      `${row.name} ${row.parent}`.toLowerCase().includes(normalizedSearch)
    );
  }, [categoryRows, searchTerm]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleCategoryAdd = async () => {
    const token = localStorage.getItem("token");

    if (!token || !user?.id) {
      window.alert("Please login before managing categories");
      navigate("/login");
      return;
    }

    if (!newCategory.trim()) {
      window.alert("Please enter category name");
      return;
    }

    try {
      const payload = {
        category: newCategory.trim(),
        createdUserID: user?.id,
        updatedCategoryID: user?.id,
      };

      const response = await apiClient.post("/api/categories", payload);
      setCategories((current) => [...current, response.data]);
      setNewCategory("");
    } catch (err) {
      window.alert(err.message || "Failed to add category");
    }
  };

  const renderSummaryCards = () => (
    <section className="admin-summary">
      <article className="summary-card summary-green">
        <span className="summary-icon">▤</span>
        <div>
          <small>Total Categories</small>
          <strong>{categoryRows.length}</strong>
          <p>Active categories</p>
          <button type="button" onClick={() => setActiveTab("categories")}>
            Manage Categories →
          </button>
        </div>
      </article>

      <article className="summary-card summary-blue">
        <span className="summary-icon">🛒</span>
        <div>
          <small>Total Orders</small>
          <strong>{orders.length}</strong>
          <p>Total orders received</p>
          <button type="button" onClick={() => setActiveTab("orders")}>
            Manage Orders →
          </button>
        </div>
      </article>

      <article className="summary-card summary-purple">
        <span className="summary-icon">▥</span>
        <div>
          <small>Total Cities</small>
          <strong>{cities.length}</strong>
          <p>Cities available</p>
          <button type="button" onClick={() => setActiveTab("cities")}>
            Manage Cities →
          </button>
        </div>
      </article>
    </section>
  );

  const renderCategoryTree = () => (
    <section className="admin-card tree-card">
      <div className="card-header">
        <h2>Category Hierarchy</h2>
        <button className="admin-primary" type="button" onClick={handleCategoryAdd}>
          + Add Root Category
        </button>
      </div>

      <div className="quick-add">
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
        />
      </div>

      <div className="category-tree">
        {categories.length === 0 ? (
          <p className="empty-copy">No categories found.</p>
        ) : (
          categories.map((category) => (
            <div className="tree-group" key={category.id}>
              <div className="tree-row tree-root">
                <span>⌄</span>
                <span className="folder-icon">□</span>
                <strong>{getCategoryName(category)}</strong>
                <button type="button">⋮</button>
              </div>

              {(category.subCategories || []).map((subCategory) => (
                <div className="tree-row tree-child" key={subCategory.id}>
                  <span className="tree-line" />
                  <span className="folder-icon">□</span>
                  <span>{subCategory.subCategory}</span>
                  <button type="button">⋮</button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <p className="drag-note">Drag and drop to reorder categories</p>
    </section>
  );

  const renderCategories = () => (
    <>
      <div className="category-workspace">
        {renderCategoryTree()}

        <section className="admin-card table-card">
          <div className="table-title-row">
            <h2>All Categories</h2>
            <button className="admin-primary" type="button" onClick={handleCategoryAdd}>
              + Add Category
            </button>
          </div>

          <div className="table-tools">
            <label className="search-box">
              <input
                type="search"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <span>⌕</span>
            </label>
            <button className="filter-btn" type="button">▽ Filters</button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Parent Category</th>
                  <th>Status</th>
                  <th>Sort Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategoryRows.length === 0 ? (
                  <tr>
                    <td colSpan="6">No categories found</td>
                  </tr>
                ) : (
                  filteredCategoryRows.slice(0, 10).map((row, index) => (
                    <tr key={`${row.id}-${row.name}-${row.parent}`}>
                      <td>{index + 1}</td>
                      <td>
                        <span className={`name-cell level-${row.level}`}>
                          <span className="folder-icon">□</span>
                          {row.name}
                        </span>
                      </td>
                      <td>{row.parent}</td>
                      <td><span className="active-pill">Active</span></td>
                      <td>{row.sortOrder}</td>
                      <td>
                        <div className="action-buttons">
                          <button type="button" aria-label="View">⊙</button>
                          <button type="button" aria-label="Edit">✎</button>
                          <button type="button" aria-label="Delete">⌫</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>Showing 1 to {Math.min(10, filteredCategoryRows.length)} of {filteredCategoryRows.length} categories</span>
            <div className="pagination">
              <button type="button">←</button>
              <button className="active-page" type="button">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <span>...</span>
              <button type="button">5</button>
              <button type="button">→</button>
            </div>
          </div>
        </section>
      </div>

      {renderSummaryCards()}
    </>
  );

  const renderOrders = () => (
    <section className="admin-card table-card">
      <h2>Orders</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Pickup Date</th>
              <th>Receiver</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="5">No Orders Found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td><span className="active-pill">{order.status ? "Completed" : "Scheduled"}</span></td>
                  <td>{order.pickupDate || "-"}</td>
                  <td>{order.address?.receiverFirstName || "-"}</td>
                  <td>{order.address?.city || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderCities = () => (
    <section className="admin-card table-card">
      <h2>Cities</h2>
      <div className="city-grid">
        {cities.length === 0 ? (
          <p>No Cities Found</p>
        ) : (
          cities.map((cityItem) => (
            <article className="city-card-admin" key={cityItem.id || cityItem.name}>
              <strong>{cityItem.name || "Unnamed city"}</strong>
              <span>{addresses.filter((address) => address.city === cityItem.name).length} addresses</span>
            </article>
          ))
        )}
      </div>
    </section>
  );

  const renderAddresses = () => (
    <section className="admin-card table-card">
      <h2>Addresses</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Receiver</th>
              <th>Phone</th>
              <th>City</th>
              <th>Zip</th>
            </tr>
          </thead>
          <tbody>
            {addresses.length === 0 ? (
              <tr><td colSpan="4">No Addresses Found</td></tr>
            ) : (
              addresses.map((address) => (
                <tr key={address.id}>
                  <td>{address.receiverFirstName || "-"}</td>
                  <td>{address.receiverPhone || "-"}</td>
                  <td>{address.city || "-"}</td>
                  <td>{address.zip || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderMainContent = () => {
    if (loading) {
      return <section className="admin-card loading-card">Loading admin data...</section>;
    }

    if (error) {
      return <section className="admin-card error-card">{error}</section>;
    }

    if (activeTab === "categories" || activeTab === "dashboard") {
      return renderCategories();
    }
    if (activeTab === "orders") {
      return renderOrders();
    }
    if (activeTab === "cities") {
      return renderCities();
    }
    if (activeTab === "addresses") {
      return renderAddresses();
    }

    return (
      <section className="admin-card empty-panel">
        <h2>{menuItems.find((item) => item.key === activeTab)?.label}</h2>
        <p>This section is ready for backend data.</p>
      </section>
    );
  };

  return (
    <div className="shop-admin-layout">
      <aside className="shop-sidebar">
        <div className="shop-brand">
          <span className="brand-bag">▣</span>
          <strong>ShopAdmin</strong>
        </div>

        <nav>
          <span className="nav-label">Management</span>
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={activeTab === item.key ? "active" : ""}
              type="button"
              onClick={() => setActiveTab(item.key)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="shop-main">
        <header className="shop-topbar">
          <div className="topbar-left">
            <button className="menu-button" type="button">☰</button>
            <h1>{menuItems.find((item) => item.key === activeTab)?.label || "Dashboard"}</h1>
          </div>

          <div className="topbar-right">
            <button className="notification-button" type="button">
              ♢
              <span>5</span>
            </button>
            <div className="admin-avatar">A</div>
            <button className="admin-user" type="button" onClick={handleLogout}>
              Admin⌄
            </button>
          </div>
        </header>

        <main className="shop-content">
          {renderMainContent()}
        </main>
      </section>
    </div>
  );
};

export default AdminDashboard;
