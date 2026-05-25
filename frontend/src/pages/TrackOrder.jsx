import React, { useMemo, useState } from "react";
import NavBar from "../components/common/NavBar/NavBar";
import orderApi from "../api/orderApi";
import { formatOrderCategoryPairs } from "../utils/orderCategories";
import "../styles/TrackOrder.css";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusSteps = [
  { label: "Pickup Requested", icon: "▣", statuses: ["created", "scheduled"] },
  { label: "Confirmed", icon: "✓", statuses: ["accepted", "assigned", "rescheduled", "delivery otp sent"] },
  { label: "Executive On the Way", icon: "♙", statuses: ["assigned", "rescheduled", "delivery otp sent"] },
  { label: "Scrap Weighed", icon: "⚖", statuses: ["delivery otp sent"] },
  { label: "Payment Completed", icon: "▰", statuses: ["delivered"] },
];

const getStepState = (order, index) => {
  const status = String(order?.status || "created").toLowerCase();

  if (status === "delivered") {
    return "complete";
  }

  const currentIndex = statusSteps.findIndex((step) => step.statuses.includes(status));
  const safeIndex = currentIndex < 0 ? 0 : currentIndex;

  if (index < safeIndex) return "complete";
  if (index === safeIndex) return "current";
  return "pending";
};

const getAddress = (order) =>
  [
    order?.address?.apartment,
    order?.address?.city,
    order?.address?.state,
    order?.address?.zip,
    order?.address?.country,
  ]
    .filter(Boolean)
    .join(", ") || "-";

const formatOrderItems = (order) => {
  return formatOrderCategoryPairs(order?.categorySubcategoryPairs, [], {
    separator: " | ",
    categorySeparator: ", Item ",
  });
};

const formatOrderId = (value) => {
  if (!value) return "-";
  return `#ORD${String(value).padStart(4, "0")}`;
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestedOn = formatDateTime(order?.createdDateTime || order?.pickupDate);
  const etaText = useMemo(() => {
    const pickupDate = order?.pickupDate ? new Date(order.pickupDate) : null;
    if (!pickupDate || Number.isNaN(pickupDate.getTime())) {
      return "ETA will update soon";
    }

    pickupDate.setMinutes(pickupDate.getMinutes() + 45);
    return `ETA: ${formatDateTime(pickupDate)}`;
  }, [order?.pickupDate]);

  const handleTrack = async (event) => {
    event.preventDefault();
    const cleanOrderId = orderId.trim().replace(/^#?ORD/i, "").replace(/^SB/i, "");
    const cleanPhone = phone.trim();

    if (!cleanOrderId || !cleanPhone) {
      setError("Enter both order ID and phone number");
      return;
    }

    if (!/^\d+$/.test(cleanOrderId)) {
      setError("Use numeric order ID, for example ORD0012 or 12");
      return;
    }

    if (cleanPhone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await orderApi.trackOrder(cleanOrderId, cleanPhone);
      setOrder(response.data);
    } catch (err) {
      setOrder(null);
      setError(err.message || "No order found for this order ID and phone number");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="track-page">
      <NavBar activePage="Track Order" />

      <section className="track-hero">
        <h1>Track <span>Pickup</span></h1>
        <p>Track your scrap pickup in real-time and stay updated.</p>
      </section>

      <section className="track-search-card">
        <span>▣</span>
        <div>
          <h2>Track Your Pickup</h2>
          <p>Enter your Order ID and pickup phone number to see the status of your pickup.</p>
          <form className="track-search-form" onSubmit={handleTrack}>
            <input
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="Order ID, for example ORD0012"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Tracking..." : "Track Order  →"}
            </button>
          </form>
          {error ? <span className="track-example error">{error}</span> : <span className="track-example">Example: ORD0012 and 9876543210</span>}
        </div>
      </section>

      {order ? (
        <section className="track-shell">
        <section className="track-status-card">
          <div className="track-status-head">
            <h2>Order Status <span>Order ID: {formatOrderId(order.id)}</span></h2>
            <p>Requested on: {requestedOn}</p>
          </div>
          <div className="track-timeline">
            {statusSteps.map((step, index) => {
              const state = getStepState(order, index);
              return (
                <article className={`track-step ${state}`} key={step.label}>
                  <span className="track-step-icon">{step.icon}</span>
                  <strong>{step.label}</strong>
                  <small>{state === "pending" ? "Pending" : index === 2 ? etaText : requestedOn}</small>
                </article>
              );
            })}
          </div>
        </section>

        <section className="track-grid">
          <article className="track-info-card">
            <h2>Executive Details</h2>
            <div className="executive-profile">
              <span className="executive-avatar">JB</span>
              <div>
                <h3>{order.pickscheduleById ? `Executive #${order.pickscheduleById}` : "Not assigned yet"}</h3>
                <p>Pickup Executive</p>
                <p>{order.pickscheduleById ? "Assigned to your pickup" : "We will assign an executive soon"}</p>
              </div>
              <span className="executive-rating">{order.status || "-"}</span>
            </div>
            <div className="track-mini-stats">
              <div>
                <span>Pickup Date</span>
                <strong>{formatDateTime(order.pickupDate)}</strong>
              </div>
              <div>
                <span>Time Slot</span>
                <strong>{order.startRange || "-"} - {order.endRange || "-"}</strong>
              </div>
            </div>
            <div className="vehicle-card">
              <div>
                <h3>Pickup Contact</h3>
                <strong>{order.address?.receiverFirstName || order.createdByName || "Customer"}</strong>
                <small>{order.address?.receiverPhone || "Phone verified for tracking"}</small>
              </div>
              <span>🛺</span>
            </div>
          </article>

          <article className="track-info-card">
            <h2>Live Tracking</h2>
            <div className="map-card">
              <div className="map-route" />
              <span className="map-pin">⌖</span>
              <span className="map-truck">♙</span>
              <div className="map-alert">
                <strong>Executive is on the way to your location</strong>
                <p>Our executive is nearby and will reach you shortly.</p>
              </div>
            </div>
          </article>

          <article className="track-info-card">
            <h2>Pickup Summary</h2>
            <div className="summary-list">
              <div>
                <span>⌖</span>
                <p><b>Pickup Address</b><br />{getAddress(order)}</p>
              </div>
              <div>
                <span>□</span>
                <p><b>Scheduled Slot</b><br />{formatDateTime(order.pickupDate)} · {order.startRange || "-"} - {order.endRange || "-"}</p>
              </div>
              <div>
                <span>♻</span>
                <p><b>Scrap Items</b><br />{formatOrderItems(order)}</p>
              </div>
              <div>
                <span>₹</span>
                <p><b>{order.amount ? "Final Payout" : "Estimated Weight"}</b><br /><b>{order.amount ? `Rs ${order.amount}` : `${order.estimateWeight || "-"} kg`}</b></p>
              </div>
            </div>
            <div className="help-box">
              <span>☏</span>
              <p><b>Need Help?</b><br />Chat with us or call our support team.</p>
            </div>
          </article>
        </section>
      </section>
      ) : (
        <section className="track-empty-state">
          <h2>Enter your pickup details to track the order</h2>
          <p>Order details are shown only after the order ID and pickup phone number match.</p>
        </section>
      )}

      <footer className="track-footer">
        <div>
          <strong>♻ Scrapify</strong>
          <p>India's trusted platform to sell scrap online. Clean India, green India.</p>
        </div>
        <div>
          <h3>Company</h3>
          <a href="/">About Us</a>
          <a href="/">Careers</a>
          <a href="/">Privacy Policy</a>
        </div>
        <div>
          <h3>Services</h3>
          <a href="/schedule-pickup">Schedule Pickup</a>
          <a href="/price-list">Price List</a>
          <a href="/track-order">Track Order</a>
        </div>
        <div>
          <h3>Help</h3>
          <a href="/">FAQ</a>
          <a href="/">How It Works</a>
          <a href="/">Blog</a>
        </div>
        <div>
          <h3>Contact Us</h3>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <a href="mailto:hello@scrapify.in">hello@scrapify.in</a>
        </div>
      </footer>
      <div className="track-copybar">
        <span>© 2026 Scrapify. All rights reserved.</span>
        <span>Proudly made in India 🇮🇳</span>
        <span>A small step towards a better tomorrow ♻</span>
      </div>
    </main>
  );
};

export default TrackOrder;
