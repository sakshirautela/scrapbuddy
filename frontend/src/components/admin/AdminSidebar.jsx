import React from "react";
import { Link } from "react-router-dom";
import { menuItems } from "../../utils/adminDashboard";

const AdminSidebar = ({ activeTab, onSelectTab }) => (
  <aside className="shop-sidebar">
    <div className="shop-brand">
      <span className="brand-bag">▣</span>
      <Link to="/">ScrapAdmin</Link>
    </div>

    <nav>
      <span className="nav-label">Management</span>
      {menuItems.map((item) => (
        <button
          key={item.key}
          className={activeTab === item.key ? "active" : ""}
          type="button"
          onClick={() => onSelectTab(item.key)}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>

    <div className="sidebar-help-card">
      <div className="help-illustration" aria-hidden="true">♻</div>
      <strong>Need help?</strong>
      <p>Contact support for any assistance you need.</p>
      <button type="button">Contact Support</button>
    </div>
  </aside>
);

export default AdminSidebar;
