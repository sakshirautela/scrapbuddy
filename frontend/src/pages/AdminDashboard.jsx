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

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [o, c, ci, a] = await Promise.all([
        apiClient.get("/api/orders"),
        apiClient.get("/api/categories"),
        apiClient.get("/api/cities"),
        apiClient.get("/api/addresses"),
      ]);

      setOrders(o.data);
      setCategories(c.data);
      setCities(ci.data);
      setAddresses(a.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">♻ SCRAP ADMIN</h2>

        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("orders")}>Orders</button>
        <button onClick={() => setActiveTab("categories")}>Categories</button>
        <button onClick={() => setActiveTab("cities")}>Cities</button>
        <button onClick={() => setActiveTab("addresses")}>Addresses</button>

        <button className="logout" onClick={() => navigate("/")}>
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
              <h3>Categories</h3>
              <p>{categories.length}</p>
            </div>

            <div className="card">
              <h3>Cities</h3>
              <p>{cities.length}</p>
            </div>

            <div className="card">
              <h3>Addresses</h3>
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
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customerName}</td>
                    <td>{o.city}</td>
                    <td>
                      <span className={`status ${o.status?.toLowerCase()}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CATEGORIES */}
        {activeTab === "categories" && (
          <div className="grid">
            <h2>Categories</h2>

            {categories.map((c) => (
              <div key={c.id} className="card-item">
                <h3>{c.name}</h3>
                <p>{c.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* CITIES */}
        {activeTab === "cities" && (
          <div className="grid">
            <h2>Cities</h2>

            {cities.map((city) => (
              <div key={city.id} className="card-item">
                <h3>{city.name}</h3>
                <p>{city.description}</p>
              </div>
            ))}
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
                  <th>Zip</th>
                </tr>
              </thead>

              <tbody>
                {addresses.map((a) => (
                  <tr key={a.id}>
                    <td>{a.street}</td>
                    <td>{a.city}</td>
                    <td>{a.zipCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;