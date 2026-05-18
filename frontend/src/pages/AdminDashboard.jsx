import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [newCategory, setNewCategory] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchAll();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchAll = async () => {
    try {
      const [o, c, ci, a] = await Promise.all([
        apiClient.get("/api/orders"),
        apiClient.get("/api/categories"),
        apiClient.get("/api/cities"),
        apiClient.get("/api/addresses"),
      ]);

      setOrders(o.data || []);
      setCategories(c.data || []);
      setCities(ci.data || []);
      setAddresses(a.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleCategoryAdd = async () => {
    if (!newCategory.trim()) {
      alert("Please enter category name");
      return;
    }

    try {
      const payload = {
        category: newCategory.trim(),
        createdUserID: user?.id,
      };

      console.log("Sending Payload:", payload);

      const res = await apiClient.post("/api/categories", payload);

      setCategories([...categories, res.data]);

      setNewCategory("");

      alert("Category Added Successfully");
    } catch (err) {
      console.error("Category Add Error:", err);
      alert("Failed to add category");
    }
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">♻ SCRAP ADMIN</h2>

        <button onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>

        <button onClick={() => setActiveTab("orders")}>
          Orders
        </button>

        <button onClick={() => setActiveTab("categories")}>
          Categories
        </button>

        <button onClick={() => setActiveTab("cities")}>
          Cities
        </button>

        <button onClick={() => setActiveTab("addresses")}>
          Addresses
        </button>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="cards">
            <div className="card">
              <h3>Total Orders</h3>
              <p>{orders.length}</p>
            </div>

            <div className="card">
              <h3>Total Categories</h3>
              <p>{categories.length}</p>
            </div>

            <div className="card">
              <h3>Total Cities</h3>
              <p>{cities.length}</p>
            </div>

            <div className="card">
              <h3>Total Addresses</h3>
              <p>{addresses.length}</p>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="table-box">
            <h2>Orders</h2>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="4">No Orders Found</td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customerName}</td>
                      <td>{o.city}</td>
                      <td>
                        <span
                          className={`status ${o.status?.toLowerCase()}`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CATEGORIES */}
        {activeTab === "categories" && (
          <div className="grid">
            <h2>Categories</h2>

            {categories.length === 0 ? (
              <p>No Categories Found</p>
            ) : (
              categories.map((c) => (
                <div key={c.id} className="card-item">
                  <h3>{c.category || c.name}</h3>

                  <p>{c.description}</p>
                </div>
              ))
            )}

            {/* ADD CATEGORY */}
            <div className="card-item add-new">
              <h3>+ Add New Category</h3>

              <input
                type="text"
                placeholder="Enter Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <button onClick={handleCategoryAdd}>
                Add Category
              </button>
            </div>
          </div>
        )}

        {/* CITIES */}
        {activeTab === "cities" && (
          <div className="grid">
            <h2>Cities</h2>

            {cities.length === 0 ? (
              <p>No Cities Found</p>
            ) : (
              cities.map((city) => (
                <div key={city.id} className="card-item">
                  <h3>{city.name}</h3>

                  <p>{city.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="table-box">
            <h2>Addresses</h2>

            <table>
              <thead>
                <tr>
                  <th>Street</th>
                  <th>City</th>
                  <th>Zip Code</th>
                </tr>
              </thead>

              <tbody>
                {addresses.length === 0 ? (
                  <tr>
                    <td colSpan="3">No Addresses Found</td>
                  </tr>
                ) : (
                  addresses.map((a) => (
                    <tr key={a.id}>
                      <td>{a.street}</td>
                      <td>{a.city}</td>
                      <td>{a.zipCode}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;