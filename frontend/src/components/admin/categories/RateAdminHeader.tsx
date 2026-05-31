// @ts-nocheck
import React from "react";

const RateAdminHeader = ({ selectedState }) => (
  <header className="rate-admin-header">
    <div>
      <h2>Categories</h2>
      <p>Manage categories and their rate items</p>
    </div>

    <div className="rate-summary-grid">
      <article className="summary-card summary-amber">
        <span>₹</span>
        <strong>200</strong>
        <small>Min. Pickup Value</small>
      </article>
    </div>
  </header>
);

export default RateAdminHeader;
