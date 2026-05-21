import React from "react";

const StatCard = ({ stat }) => (
  <article className={`admin-stat-card ${stat.tone || "green"}`}>
    <span className={`admin-stat-icon ${stat.icon || "leaf"}`} aria-hidden="true" />
    <div>
      <p>{stat.label}</p>
      <strong>{stat.value}</strong>
      <small>{stat.trend}</small>
    </div>
  </article>
);

export default StatCard;
