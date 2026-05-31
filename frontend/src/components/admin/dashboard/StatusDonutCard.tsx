// @ts-nocheck
import React from "react";

const colors = ["#f59e0b", "#2f80ed", "#8b5cf6", "#2faf48", "#ef4444"];

const StatusDonutCard = ({ items = [] }) => {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  let offset = 25;

  const segments = items.map((item, index) => {
    const value = (item.value / total) * 100;
    const segment = {
      ...item,
      color: colors[index % colors.length],
      dash: `${value} ${100 - value}`,
      offset,
    };
    offset -= value;
    return segment;
  });

  return (
    <section className="admin-dashboard-card donut-card">
      <div className="admin-card-title compact">
        <h2>Pickup Status <span>(Order Pipeline)</span></h2>
      </div>
      <div className="donut-layout">
        <div className="donut-wrap" aria-label="Pickup status chart">
          <svg viewBox="0 0 42 42">
            <circle className="donut-track" cx="21" cy="21" r="15.9" />
            {segments.map((segment) => (
              <circle
                key={segment.label}
                className="donut-segment"
                cx="21"
                cy="21"
                r="15.9"
                stroke={segment.color}
                strokeDasharray={segment.dash}
                strokeDashoffset={segment.offset}
              />
            ))}
          </svg>
          <div>
            <strong>{total}</strong>
            <span>Total</span>
          </div>
        </div>
        <ul className="donut-legend">
          {segments.map((segment) => (
            <li key={segment.label}>
              <span style={{ backgroundColor: segment.color }} />
              <p>{segment.label}</p>
              <strong>{segment.value} ({Math.round((segment.value / total) * 100)}%)</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default StatusDonutCard;
