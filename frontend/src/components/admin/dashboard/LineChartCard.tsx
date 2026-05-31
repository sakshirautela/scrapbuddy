// @ts-nocheck
import React from "react";

const LineChartCard = ({ series = [] }) => {
  const max = Math.max(...series.map((item) => item.value), 1);
  const points = series.map((item, index) => {
    const x = series.length === 1 ? 50 : (index / (series.length - 1)) * 100;
    const y = 100 - (item.value / max) * 82 - 8;
    return { ...item, x, y };
  });

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${path} L 100 100 L 0 100 Z`;

  return (
    <section className="admin-dashboard-card chart-card">
      <div className="admin-card-title">
        <h2>Pickup Requests Overview</h2>
        <select aria-label="Chart range">
          <option>Daily</option>
          {/* <option>Weekly</option> */}
        </select>
      </div>
      <div className="line-chart" aria-label="Pickup requests chart">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img">
          <path className="line-chart-area" d={areaPath} />
          <path className="line-chart-path" d={path} />
          {points.map((point) => (
            <circle key={point.label} cx={point.x} cy={point.y} r="1.6" />
          ))}
        </svg>
        <div className="line-chart-labels">
          {points.map((point) => (
            <span key={point.label}>
              <strong>{point.value}</strong>
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LineChartCard;
