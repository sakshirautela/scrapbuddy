// @ts-nocheck
import React from "react";


export const EcoImpactCard = ({ data }) => (
  <section className="admin-dashboard-card summary-card">
    <div className="admin-card-title compact">
      <h2>Eco Impact <span>(This Week)</span></h2>
    </div>
    <div className="impact-grid">
      <article>
        <strong>{data.waste}</strong>
        <span>Tonnes Waste Recycled</span>
      </article>
      <article>
        <strong>{data.co2}</strong>
        <span>Tonnes CO2 Saved</span>
      </article>
      <article>
        <strong>{data.trees}</strong>
        <span>Trees Equivalent</span>
      </article>
    </div>
  </section>
);

export const ServiceAreaCard = ({ area }) => (
  <section className="admin-dashboard-card service-area-card">
    <div className="admin-card-title compact">
      <h2>Service Area</h2>
      <button type="button">View Map</button>
    </div>
    <div className="map-preview" aria-label={`Service map centered on ${area}`}>
      <span className="map-pin" />
      <strong>{area}</strong>
    </div>
  </section>
);
