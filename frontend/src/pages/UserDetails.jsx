import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import orderApi from "../api/orderApi";
import NavBar from "../components/common/NavBar/NavBar";
import "../styles/ProfileDashboard.css";
const baseSidebarItems = [
  { key: "profile", label: "Overview", icon: "⌂" },
  { key: "orders", label: "My Pickups", icon: "▣" },
  { key: "addresses", label: "Saved Addresses", icon: "⌖" },
  { key: "earnings", label: "Earnings", icon: "□" },
  { key: "settings", label: "Profile Settings", icon: "⚙" },
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
  const getOrderId = (order) => order?.id ?? order?.orderId ?? order?.orderID;
  const userRole = user?.role?.toLowerCase() || "";
  const isAdminUser = ["admin", "superadmin", "super_admin"].includes(userRole);
  const sidebarItems = isAdminUser ? [...baseSidebarItems, ...adminSidebarItem] : baseSidebarItems;
  const completedOrders = orders.filter((order) => String(order.status || "").toLowerCase() === "delivered");
  const totalPickups = orders.length;
  const totalEarnings = orders.reduce((total, order) => total + (Number(order.amount) || 0), 0);
  const totalWeight = orders.reduce((total, order) => total + (Number(order.estimateWeight) || 0), 0);
  const co2Saved = totalWeight * 2.4;
  // const rewardPoints = totalPickups * 40 + completedOrders.length * 60;
  // const walletBalance = totalEarnings;
  const treesEquivalent = Math.max(0, Math.round(co2Saved / 18));
  const dashboardStats = [
    { title: "Total Pickups", value: totalPickups, sub: "All time pickups", icon: "▣", action: "View all pickups" , onClick: () => setActiveTab("orders") },
    { title: "Total Earnings", value: `Rs ${totalEarnings.toLocaleString("en-IN")}`, sub: "All time earnings", icon: "₹", action: "View earnings" ,onClick: () => setActiveTab("earnings") },
    { title: "CO₂ Saved", value: `${co2Saved.toFixed(1)} kg`, sub: "CO₂ emissions reduced", icon: "♧", action: "See my impact" },
    // { title: "Reward Points", value: rewardPoints, sub: "Available points", icon: "□", action: "View rewards" },
  ];

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
const renderEarnings = () => (
  <section className="profile-panel earnings-panel placeholder-panel">
    <h2>Earnings</h2>
    <p>Your total earnings from completed pickups: <strong>Rs {totalEarnings.toLocaleString("en-IN")}</strong></p>
    <p>This section is ready for your next update.</p>
  </section>
);
const renderAddresses = () => (
  <section className="profile-panel addresses-panel placeholder-panel">
    <h2>Saved Addresses</h2>
    <p>You have no saved addresses yet.</p>
    <p>This section is ready for your next update.</p>
  </section>
);
  const renderOrdersTable = () => (
    <section className="profile-panel recent-orders-panel dashboard-pickups-card">
      <div className="profile-panel-header">
        <h2>{activeTab === "profile" ? "Recent Pickups" : "My Pickups"}</h2>

        {activeTab === "profile" ? (
          <button type="button" onClick={() => setActiveTab("orders")}>
            View All Pickups →
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
                <th>Pickup ID</th>
                <th>Date & Time</th>
                <th>Items</th>
                <th>Weight</th>
                <th>Amount Earned</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {(activeTab === "profile" ? recentOrders : orders).length === 0 ? (
                <tr>
                  <td colSpan="7">No pickups found</td>
                </tr>
              ) : (
                (activeTab === "profile" ? recentOrders : orders).map(
                  (order, index) => {
                    const orderId = getOrderId(order);

                    return (
                    <tr key={orderId || `profile-order-${index}`}>
                      <td>#ORD{String(orderId || "-").padStart(4, "0")}</td>

                      <td>
                        {formatDateTime(
                          order.pickupDate || order.createdDateTime
                        )}
                      </td>

                      <td>Category {order.categoryID || "-"}, Item {order.subCategoryID || "-"}</td>
                      <td>{formatValue(order.estimateWeight)} kg</td>
                      <td>Rs {formatValue(order.amount)}</td>

                      <td>
                        <span
                          className={
                            order.status?.toLowerCase() === "cancelled"
                              ? "pill cancelled"
                              : order.status?.toLowerCase() === "delivered"
                                ? "pill delivered"
                                : "pill processing"
                          }
                        >
                          {order.status || "Scheduled"}
                        </span>
                      </td>
                    </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="profile-table-footer">
        <span>
          Showing {(activeTab === "profile" ? recentOrders : orders).length} of{" "}
          {orders.length} pickups
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
              <span>Estimated Weight</span>
              <strong>{formatValue(selectedOrder.estimateWeight)} kg</strong>
            </article>
            <article>
              <span>Final Amount</span>
              <strong>Rs {formatValue(selectedOrder.amount)}</strong>
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

  const renderOverview = () => (
    <>
      <header className="dashboard-welcome">
        <h1>My Dashboard <span>♧</span></h1>
        <p>Welcome back, {displayName}. Here is what is happening with your scrap journey.</p>
      </header>

      <section className="dashboard-stat-grid">
        {dashboardStats.map((stat) => (
          <article className="dashboard-stat-card" key={stat.title}>
            <span>{stat.icon}</span>
            <div>
              <h3>{stat.title}</h3>
              <strong>{stat.value}</strong>
              <p>{stat.sub}</p>
              <button type="button" onClick={stat.onClick}>{stat.action} →</button>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-main-grid">
        {renderOrdersTable()}
      </section>

      <section className="dashboard-lower-grid">
        <article className="invite-card profile-panel">
          <div>
            <h2>Invite Friends</h2>
            {/* <p>Invite your friends to JunkBox and earn reward points when they complete their first pickup.</p>
            <div className="referral-box">
              <span>Your Referral Code</span>
              <strong>{(user?.username || "JUNKBOX").toUpperCase().slice(0, 8)}100</strong>
              <button type="button">Copy</button>
            </div> */}
          </div>
          <div className="invite-art">♻</div>
        </article>

        <article className="eco-card profile-panel">
          <h2>Your Eco Impact <span>♧</span></h2>
          <p>You are making a real difference.</p>
          <div className="eco-metrics">
            <span><strong>{co2Saved.toFixed(1)} kg</strong> CO₂ saved</span>
            <span><strong>{totalWeight.toFixed(1)} kg</strong> waste recycled</span>
            <span><strong>{treesEquivalent}</strong> trees equivalent</span>
            <span><strong>{totalPickups}</strong> pickups completed</span>
          </div>
        </article>
      </section>
    </>
  );

  return (
    <div className="user-profile-layout scrap-dashboard">
      <NavBar showUserChip />

      <aside className="profile-sidebar customer-sidebar">
        <div className="profile-brand">
          <span>{userInitial}</span>
          <div>
            <strong>{displayName}</strong>
            <small>{user?.phone || user?.email || "JunkBox customer"}</small>
          </div>
        </div>

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

        <div className="sidebar-help">
          <span>☏</span>
          <strong>Need Help?</strong>
          <p>Our support team is here to help you.</p>
          <button type="button">Contact Support</button>
        </div>
      </aside>

      <section className="profile-main">
        <main className="profile-content">
          {activeTab === "profile" ? renderOverview() : null}
          {activeTab === "orders" ? renderOrdersTable() : null}
          {activeTab === "earnings" ? renderEarnings() : null}
          {activeTab === "addresses" ? renderAddresses() : null}
          {!["profile", "orders", "earnings", "addresses"].includes(activeTab) ? (
            <section className="profile-panel placeholder-panel">
              <h2>{sidebarItems.find((item) => item.key === activeTab)?.label}</h2>
              <p>This section is ready for your next update.</p>
            </section>
          ) : null}
        </main>
      </section>

      <footer className="dashboard-footer">
        <div>
          <strong>♻ JunkBox</strong>
          <p>India's trusted platform to sell scrap online. Clean India, green India.</p>
        </div>
        <div>
          <h3>Company</h3>
          <Link to="/">About Us</Link>
          <Link to="/">Privacy Policy</Link>
        </div>
        <div>
          <h3>Services</h3>
          <Link to="/schedule-pickup">Schedule Pickup</Link>
          <Link to="/price-list">Price List</Link>
        </div>
        <div>
          <h3>Contact Us</h3>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <a href="mailto:hello@junkbox.in">hello@junkbox.in</a>
        </div>
      </footer>

      {renderOrderDetailsModal()}
    </div>
  );
};

export default ProfileDashboard;
