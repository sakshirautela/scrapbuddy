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
  </aside>
);

export default AdminSidebar;
