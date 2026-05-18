import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import orderApi from "../api/orderApi";
import "../styles/ProfileDashboard.css";

const sidebarItems = [
  { key: "profile", label: "User Profile", icon: "♙" },
  { key: "orders", label: "Orders", icon: "🛒" },
];

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = useMemo(() => {
    return (
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      user?.username ||
      "User"
    );
  }, [user]);

  const userInitial = displayName.charAt(0).toUpperCase();
  const recentOrders = orders.slice(0, 5);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;

      setLoadingOrders(true);
      setOrderError("");

      try {
        const response = await orderApi.getOrdersByUser(user.id);

        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setOrderError(error.message || "Failed to load orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [user?.id]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const renderOrdersTable = () => (
    <section className="profile-panel recent-orders-panel">
      <div className="profile-panel-header">
        <h2>{activeTab === "profile" ? "Recent Orders" : "My Orders"}</h2>

        {activeTab === "profile" ? (
          <button type="button" onClick={() => setActiveTab("orders")}>
            View All Orders
          </button>
        ) : null}
      </div>

      {loadingOrders ? <p className="profile-muted">Loading orders...</p> : null}
      {orderError ? <p className="profile-error">{orderError}</p> : null}

      {!loadingOrders && !orderError ? (
        <div className="profile-table-wrap">
          <table className="profile-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Category ID</th>
                <th>SubCategory ID</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {(activeTab === "profile" ? recentOrders : orders).length === 0 ? (
                <tr>
                  <td colSpan="6">No orders found</td>
                </tr>
              ) : (
                (activeTab === "profile" ? recentOrders : orders).map(
                  (order) => (
                    <tr key={order.id}>
                      <td>#ORD{String(order.id).padStart(4, "0")}</td>

                      <td>
                        {formatDateTime(
                          order.pickupDate || order.createdDateTime
                        )}
                      </td>

                      <td>{order.categoryID || "-"}</td>
                      <td>{order.subCategoryID || "-"}</td>

                      <td>
                        <span
                          className={
                            order.status ? "pill delivered" : "pill processing"
                          }
                        >
                          {order.status ? "Completed" : "Processing"}
                        </span>
                      </td>

                      <td>
                        <button className="view-btn" type="button">
                          View
                        </button>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="profile-table-footer">
        <span>
          Showing {(activeTab === "profile" ? recentOrders : orders).length} of{" "}
          {orders.length} orders
        </span>
      </div>
    </section>
  );

  const renderProfile = () => (
    <div className="profile-grid">
      <aside className="profile-card">
        <div className="profile-photo">
          <span>{userInitial}</span>
          <button type="button" aria-label="Change photo">
            ⌘
          </button>
        </div>

        <h2>{displayName}</h2>
        <span className="role-badge">{user?.role || "Customer"}</span>

        <p>{user?.email || "-"}</p>
        <p>{user?.phone || "-"}</p>

        <div className="profile-meta">
          <div>
            <span>▣</span>
            <strong>User ID</strong>
            <em>#USR{String(user?.id || 1024).padStart(4, "0")}</em>
          </div>

          <div>
            <span>♙</span>
            <strong>Role</strong>
            <em>{user?.role || "Customer"}</em>
          </div>

          <div>
            <span>◷</span>
            <strong>Status</strong>
            <em className="active-status">Active</em>
          </div>

          <div>
            <span>▣</span>
            <strong>Joined On</strong>
            <em>{formatDateTime(user?.createdDate)}</em>
          </div>
        </div>

        <button className="change-password" type="button">
          ▣ Change Password
        </button>

        <button className="delete-account" type="button">
          ⌫ Delete Account
        </button>

        <small>
          Once you delete your account, all your data will be permanently
          removed.
        </small>
      </aside>

      <section className="profile-main-column">
        <section className="profile-panel">
          <div className="profile-panel-header">
            <h2>Profile Information</h2>
            <button type="button">✎ Edit Profile</button>
          </div>

          <div className="profile-form-grid">
            <label>
              <span>Full Name</span>
              <input value={displayName} readOnly />
            </label>

            <label>
              <span>Username</span>
              <input value={user?.username || "-"} readOnly />
            </label>

            <label>
              <span>Email Address</span>
              <input value={user?.email || "-"} readOnly />
            </label>

            <label>
              <span>Phone Number</span>
              <input value={user?.phone || "-"} readOnly />
            </label>

            <label>
              <span>Role</span>
              <input value={user?.role || "Customer"} readOnly />
            </label>

            <label>
              <span>Timezone</span>
              <input value="Asia/Kolkata" readOnly />
            </label>
          </div>
        </section>

        {renderOrdersTable()}
      </section>
    </div>
  );

  return (
    <div className="user-profile-layout">
      <aside className="profile-sidebar">
        <div className="profile-brand">
          <span>▣</span>
          <strong>ScrapBuddy</strong>
        </div>

        <nav>
          {sidebarItems.map((item) => (
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

        <button className="sidebar-logout" type="button" onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </aside>

      <section className="profile-main">
        <header className="profile-topbar">
          <div>
            <button type="button" className="hamburger">
              ☰
            </button>
            <h1>{activeTab === "profile" ? "User Profile" : "My Orders"}</h1>
          </div>

          <div className="profile-top-actions">
            <span className="mini-avatar">{userInitial}</span>
            <strong>{displayName}</strong>
          </div>
        </header>

        <main className="profile-content">
          {activeTab === "profile" ? renderProfile() : null}
          {activeTab === "orders" ? renderOrdersTable() : null}
        </main>
      </section>
    </div>
  );
};

export default ProfileDashboard;
