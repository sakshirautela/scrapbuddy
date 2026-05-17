import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import "../styles/SuperAdminDashboard.css";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [users, setUsers] = useState([]);

  // ================= USER MODAL =================
  const [openUserModal, setOpenUserModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  // ================= SAFE ARRAY =================
  const safeArray = (data) => (Array.isArray(data) ? data : []);

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      const [o, c, ci, a, u] = await Promise.all([
        apiClient.get("/api/orders"),
        apiClient.get("/api/categories"),
        apiClient.get("/api/cities"),
        apiClient.get("/api/addresses"),
        apiClient.get("/api/users"),
      ]);

      setOrders(safeArray(o.data));
      setCategories(safeArray(c.data));
      setCities(safeArray(ci.data));
      setAddresses(safeArray(a.data));
      setUsers(safeArray(u.data));
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= USER CRUD =================
  const createUser = async () => {
    setSubmitting(true);
    try {
      await apiClient.post("/api/users", currentUser);
      resetUserForm();
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const updateUser = async () => {
    setSubmitting(true);
    try {
      await apiClient.put(`/api/users/${currentUser.id}`, currentUser);
      resetUserForm();
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await apiClient.delete(`/api/users/${id}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const editUser = (user) => {
    setCurrentUser(user);
    setEditMode(true);
    setOpenUserModal(true);
  };

  const resetUserForm = () => {
    setCurrentUser({
      id: null,
      name: "",
      email: "",
      password: "",
      role: "USER",
    });
    setEditMode(false);
    setOpenUserModal(false);
  };

  // ================= UI =================
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">⚡ SUPER ADMIN</h2>

        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("orders")}>Orders</button>
        <button onClick={() => setActiveTab("categories")}>Categories</button>
        <button onClick={() => setActiveTab("cities")}>Cities</button>
        <button onClick={() => setActiveTab("addresses")}>Addresses</button>
        <button onClick={() => setActiveTab("users")}>Users</button>

        <button className="logout" onClick={() => navigate("/")}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="main">

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="cards">
            <div className="card"><h3>Orders</h3><p>{orders.length}</p></div>
            <div className="card"><h3>Users</h3><p>{users.length}</p></div>
            <div className="card"><h3>Categories</h3><p>{categories.length}</p></div>
            <div className="card"><h3>Cities</h3><p>{cities.length}</p></div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="table-box">
            <h2>Orders</h2>
            <table>
              <tbody>
                {safeArray(orders).map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customerName}</td>
                    <td>{o.city}</td>
                    <td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="table-box">

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Users</h2>

              <button onClick={() => setOpenUserModal(true)}>
                + Add User
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {safeArray(users).map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button onClick={() => editUser(u)}>Edit</button>
                      <button onClick={() => deleteUser(u.id)}>Delete</button>
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
            {safeArray(categories).map((c) => (
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
            {safeArray(cities).map((city) => (
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
              <tbody>
                {safeArray(addresses).map((a) => (
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

      {/* ================= USER MODAL ================= */}
      {openUserModal && (
        <div className="modal-bg">
          <div className="modal">

            <h2>{editMode ? "Edit User" : "Add User"}</h2>

            <input
              placeholder="Name"
              value={currentUser.name}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={currentUser.email}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, email: e.target.value })
              }
            />

            {!editMode && (
              <input
                type="password"
                placeholder="Password"
                value={currentUser.password}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, password: e.target.value })
                }
              />
            )}

            <select
              value={currentUser.role}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, role: e.target.value })
              }
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <div style={{ marginTop: "10px" }}>
              <button
                disabled={submitting}
                onClick={editMode ? updateUser : createUser}
              >
                {submitting ? "Processing..." : editMode ? "Update" : "Create"}
              </button>

              <button onClick={resetUserForm}>Cancel</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminDashboard;