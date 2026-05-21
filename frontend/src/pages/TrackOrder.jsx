import React, { useMemo, useState } from "react";
import NavBar from "../components/common/NavBar/NavBar";
import orderApi from "../api/orderApi";
import "../styles/TrackOrder.css";

const fallbackOrder = {
  id: "SB123456789",
  status: "Assigned",
  pickupDate: "2026-05-20T10:30:00",
  startRange: "10:00:00",
  endRange: "12:00:00",
  estimateWeight: 25,
  amount: 430,
  categoryID: "Paper",
  subCategoryID: "Newspaper, Plastic, Metal, Cardboard",
  address: {
    apartment: "123, 5th Cross, Koramangala 5th Block",
    city: "Bengaluru",
    state: "Karnataka",
    zip: "560095",
    country: "India",
  },
};

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

const TrackOrder = () => {
  const [trackingValue, setTrackingValue] = useState("");
  const [order, setOrder] = useState(fallbackOrder);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestedOn = formatDateTime(order.createdDateTime || order.pickupDate);
  const etaText = useMemo(() => {
    const pickupDate = order.pickupDate ? new Date(order.pickupDate) : null;
    if (!pickupDate || Number.isNaN(pickupDate.getTime())) {
      return "ETA will update soon";
    }

    pickupDate.setMinutes(pickupDate.getMinutes() + 45);
    return `ETA: ${formatDateTime(pickupDate)}`;
  }, [order.pickupDate]);

  const handleTrack = async (event) => {
    event.preventDefault();
    const value = trackingValue.trim();

    if (!value) {
      setError("Enter order ID or mobile number");
      return;
    }

    if (!/^\d+$/.test(value.replace(/^SB/i, ""))) {
      setError("Use numeric order ID, for example SB123456 or 123456");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const orderId = value.replace(/^SB/i, "");
      const response = await orderApi.getOrderById(orderId);
      setOrder(response.data);
    } catch (err) {
      setError(err.message || "Could not find this order");
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
          <p>Enter your Order ID or Mobile Number to see the status of your pickup.</p>
          <form className="track-search-form" onSubmit={handleTrack}>
            <input
              value={trackingValue}
              onChange={(event) => setTrackingValue(event.target.value)}
              placeholder="Enter Order ID or Mobile Number"
            />
            <button type="submit">{loading ? "Tracking..." : "Track Order  →"}</button>
          </form>
          {error ? <span className="track-example">{error}</span> : <span className="track-example">Example: SB123456 or 9876543210</span>}
        </div>
      </section>

      <section className="track-shell">
        <section className="track-status-card">
          <div className="track-status-head">
            <h2>Order Status <span>Order ID: SB{order.id}</span></h2>
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
              <span className="executive-avatar">RK</span>
              <div>
                <h3>Rohit Kumar ✓</h3>
                <p>Pickup Executive</p>
                <p>☎ +91 98765 43210</p>
              </div>
              <span className="executive-rating">4.8 ★</span>
            </div>
            <div className="track-mini-stats">
              <div>
                <span>ETA</span>
                <strong>12 mins</strong>
              </div>
              <div>
                <span>Distance</span>
                <strong>2.4 km away</strong>
              </div>
            </div>
            <div className="vehicle-card">
              <div>
                <h3>Vehicle Details</h3>
                <strong>KA 03 AB 1234</strong>
                <small>Bajaj Maxima 3 Wheeler</small>
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
                <p><b>Scrap Items</b><br />Category {order.categoryID || "-"}, Item {order.subCategoryID || "-"}</p>
              </div>
              <div>
                <span>₹</span>
                <p><b>Estimated Payout</b><br /><b>Rs {order.amount || Math.round((Number(order.estimateWeight) || 0) * 18) || "-"}</b></p>
              </div>
            </div>
            <div className="help-box">
              <span>☏</span>
              <p><b>Need Help?</b><br />Chat with us or call our support team.</p>
            </div>
          </article>
        </section>
      </section>

      <footer className="track-footer">
        <div>
          <strong>♻ JunkBox</strong>
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
          <a href="mailto:hello@junkbox.in">hello@junkbox.in</a>
        </div>
      </footer>
      <div className="track-copybar">
        <span>© 2026 JunkBox. All rights reserved.</span>
        <span>Proudly made in India 🇮🇳</span>
        <span>A small step towards a better tomorrow ♻</span>
      </div>
    </main>
  );
};

export default TrackOrder;
