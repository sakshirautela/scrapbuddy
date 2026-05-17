import '../styles/AdminDashboard.css';

import React, { useState } from "react";

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState("products");
const[user, setUser] = useState(null);
  const [products, setProducts] = useState([
    { id: 1, subId: "A101", name: "Laptop", price: 55000 },
    { id: 2, subId: "B202", name: "Phone", price: 25000 },
  ]);

  const [orders] = useState([
    {
      orderId: 1001,
      customer: "Rahul",
      total: 78000,
      status: "Delivered",
    },
    {
      orderId: 1002,
      customer: "Priya",
      total: 25000,
      status: "Pending",
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin",
      email: "admin@example.com",
      role: "Admin",
    },
    {
      id: 2,
      name: "User",
      email: "user@example.com",
      role: "Customer",
    },
  ]);

  const [form, setForm] = useState({
    id: "",
    subId: "",
    name: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addOrUpdateProduct = () => {
    if (!form.id || !form.subId || !form.name || !form.price) {
      alert("Please fill all fields");
      return;
    }

    if (editingId !== null) {
      setProducts(
        products.map((product) =>
          product.id === editingId
            ? {
                id: Number(form.id),
                subId: form.subId,
                name: form.name,
                price: Number(form.price),
              }
            : product
        )
      );

      setEditingId(null);
    } else {
      setProducts([
        ...products,
        {
          id: Number(form.id),
          subId: form.subId,
          name: form.name,
          price: Number(form.price),
        },
      ]);
    }

    setForm({
      id: "",
      subId: "",
      name: "",
      price: "",
    });
  };

  const editProduct = (product) => {
    setEditingId(product.id);

    setForm({
      id: product.id,
      subId: product.subId,
      name: product.name,
      price: product.price,
    });
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const createUser = () => {
    const name = prompt("Enter user name");
    const email = prompt("Enter email");
    const role = prompt("Enter role");

    if (!name || !email || !role) return;

    setUsers([
      ...users,
      {
        id: users.length + 1,
        name,
        email,
        role,
      },
    ]);
  };

  return (
    <div className="admin-dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>

        <ul className="menu">
          <li
            className={activeModule === "products" ? "active" : ""}
            onClick={() => setActiveModule("products")}
          >
            Products
          </li>

          <li
            className={activeModule === "orders" ? "active" : ""}
            onClick={() => setActiveModule("orders")}
          >
            Orders
          </li>

          <li
            className={activeModule === "users" ? "active" : ""}
            onClick={() => setActiveModule("users")}
          >
            Users
          </li>

          <li className="submenu-title">Submodules</li>

          <li
            className={activeModule === "analytics" ? "active" : ""}
            onClick={() => setActiveModule("analytics")}
          >
            Analytics
          </li>

          <li
            className={activeModule === "reports" ? "active" : ""}
            onClick={() => setActiveModule("reports")}
          >
            Reports
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">

        {/* Header */}
        <div className="topbar">
          <h1>Admin Dashboard</h1>
        </div>

        {/* PRODUCTS */}
        {activeModule === "products" && (
          <div className="card">
            <h2>Product Management</h2>

            <div className="form-grid">
              <input
                type="number"
                name="id"
                placeholder="Product ID"
                value={form.id}
                onChange={handleChange}
              />

              <input
                type="text"
                name="subId"
                placeholder="Sub ID"
                value={form.subId}
                onChange={handleChange}
              />

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
              />

              <button onClick={addOrUpdateProduct}>
                {editingId ? "Update Product" : "Add Product"}
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sub ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.subId}</td>
                    <td>{product.name}</td>
                    <td>₹{product.price}</td>

                    <td>
                      <button onClick={() => editProduct(product)}>
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ORDERS */}
        {activeModule === "orders" && (
          <div className="card">
            <h2>Orders</h2>

            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.customer}</td>
                    <td>₹{order.total}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS */}
        {activeModule === "users" && (
          <div className="card">
            <div className="user-header">
              <h2>Users</h2>

              <button onClick={createUser}>Create User</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ANALYTICS */}
        {activeModule === "analytics" && (
          <div className="card">
            <h2>Analytics Module</h2>
            <p>Analytics data and charts will appear here.</p>
          </div>
        )}

        {/* REPORTS */}
        {activeModule === "reports" && (
          <div className="card">
            <h2>Reports Module</h2>
            <p>Reports and exports will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
}