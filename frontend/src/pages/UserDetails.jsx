import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import orderApi from "../api/orderApi";
import "../styles/ProfileDashboard.css";
import { Link } from "react-router-dom";
const baseSidebarItems = [
  { key: "profile", label: "User Profile", icon: "♙" },
  { key: "orders", label: "Orders", icon: "🛒" },
];

const adminSidebarItem = [
  { key: "admin", label: "Admin Dashboard", icon: "⚙️" },
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

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
};

const formatTimeRange = (order) => {
  if (!order?.startRange && !order?.endRange) {
    return "-";
  }

  return `${order.startRange || "-"} - ${order.endRange || "-"}`;
};

const getAddressSummary = (address = {}) =>
  [
    [address.receiverFirstName, address.receiverLastName].filter(Boolean).join(" "),
    address.receiverPhone,
    address.receiverEmail,
    address.apartment,
    address.city,
    address.state,
    address.zip,
    address.country,
    address.countryCode,
  ]
    .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
    .join(", ") || "-";

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

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
  const userRole = user?.role?.toLowerCase() || "";
  const isAdminUser = ["admin", "superadmin", "super_admin"].includes(userRole);
  const sidebarItems = isAdminUser ? [...baseSidebarItems, ...adminSidebarItem] : baseSidebarItems;

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
                            order.status?.toLowerCase() === "cancelled" ? "pill cancelled" : "pill processing"
                          }
                        >
                          {order.status || "Processing"}
                        </span>
                      </td>

                      <td>
                        <button className="view-btn" type="button" onClick={() => setSelectedOrder(order)}>
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

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) {
      return null;
    }

    const address = selectedOrder.address || {};

    return (
      <div className="order-detail-overlay" role="presentation" onClick={() => setSelectedOrder(null)}>
        <section
          className="order-detail-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-detail-title"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="order-detail-header">
            <div>
              <span className="order-detail-eyebrow">Order Details</span>
              <h2 id="order-detail-title">#ORD{String(selectedOrder.id).padStart(4, "0")}</h2>
              <p>{selectedOrder.status || "Processing"}</p>
            </div>
            <button type="button" aria-label="Close order details" onClick={() => setSelectedOrder(null)}>
              ×
            </button>
          </header>

          <div className="order-detail-grid">
            <article>
              <span>Pickup Date</span>
              <strong>{formatDateTime(selectedOrder.pickupDate)}</strong>
            </article>
            <article>
              <span>Pickup Time</span>
              <strong>{formatTimeRange(selectedOrder)}</strong>
            </article>
            <article>
              <span>Category ID</span>
              <strong>{formatValue(selectedOrder.categoryID)}</strong>
            </article>
            <article>
              <span>Subcategory ID</span>
              <strong>{formatValue(selectedOrder.subCategoryID)}</strong>
            </article>
            <article>
              <span>Assigned Admin</span>
              <strong>{selectedOrder.pickscheduleById ? `Admin ${selectedOrder.pickscheduleById}` : "Not assigned"}</strong>
            </article>
            <article>
              <span>Created By</span>
              <strong>{selectedOrder.createdByUserID === 0 ? "Guest" : formatValue(selectedOrder.createdByUserID)}</strong>
            </article>
            <article>
              <span>Created At</span>
              <strong>{formatDateTime(selectedOrder.createdDateTime)}</strong>
            </article>
            <article>
              <span>Updated At</span>
              <strong>{formatDateTime(selectedOrder.updatedDateTime)}</strong>
            </article>
          </div>

          <section className="order-address-card">
            <h3>Pickup Address</h3>
            <p>{getAddressSummary(address)}</p>
            <dl>
              <div>
                <dt>Receiver</dt>
                <dd>{formatValue([address.receiverFirstName, address.receiverLastName].filter(Boolean).join(" "))}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{formatValue(address.receiverPhone)}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{formatValue(address.receiverEmail)}</dd>
              </div>
              <div>
                <dt>Apartment</dt>
                <dd>{formatValue(address.apartment)}</dd>
              </div>
              <div>
                <dt>City</dt>
                <dd>{formatValue(address.city)}</dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>{formatValue(address.state)}</dd>
              </div>
              <div>
                <dt>Zip</dt>
                <dd>{formatValue(address.zip)}</dd>
              </div>
              <div>
                <dt>Country</dt>
                <dd>{formatValue(address.country)}</dd>
              </div>
            </dl>
          </section>
        </section>
      </div>
    );
  };

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

        <button className="change-password" type="button" onClick={() => navigate("/forget-password")}>
          ▣ Change Password
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
<Link to="/">ScrapBuddy</Link>        </div>

        <nav>
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={activeTab === item.key ? "active" : ""}
              type="button"
              onClick={() => {
                if (item.key === "admin") {
                  navigate("/admin");
                  return;
                }

                setActiveTab(item.key);
              }}
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

      {renderOrderDetailsModal()}
    </div>
  );
};

export default ProfileDashboard;
