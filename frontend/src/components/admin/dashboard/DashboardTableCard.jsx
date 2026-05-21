import React from "react";

const DashboardTableCard = ({ title, columns, rows, actionLabel = "View All", className = "" }) => (
  <section className={`admin-dashboard-card table-card ${className}`}>
    <div className="admin-card-title compact">
      <h2>{title}</h2>
      <button type="button">{actionLabel}</button>
    </div>
    <div className="admin-mini-table">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={`${row.id}-${column.key}`}>
                  {column.badge ? (
                    <span className={`status-pill ${String(row[column.key]).toLowerCase().replace(/\s+/g, "-")}`}>
                      {row[column.key]}
                    </span>
                  ) : (
                    row[column.key]
                  )}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length}>No records yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default DashboardTableCard;
