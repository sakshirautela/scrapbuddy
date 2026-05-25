import React from "react";
import { menuItems } from "../../utils/adminDashboard";
const handleNavigate = () => {
  window.location.href = "/";
};
const AdminSidebar = ({ activeTab, isOpen = false, onClose, onSelectTab }) => (
  <aside className={`shop-sidebar admin-overview-sidebar${isOpen ? " open" : ""}`} aria-label="Admin navigation">
    <div className="shop-brand">
      <div className="brand-mark" aria-hidden="true">♻</div>
      <div>
        <button className="brand-name" type="button" onClick={handleNavigate}>
          <strong>Scrapify</strong>
        </button>
      </div>
    </div>
    <nav>
      {menuItems.map((item) => (
        <button
          key={item.key}
          className={activeTab === item.key ? "active" : ""}
          type="button"
          onClick={() => {
            onSelectTab(item.key);
            onClose?.();
          }}
        >
          <span className={`admin-nav-icon ${item.icon}`} aria-hidden="true" />
          {item.label}
        </button>
      ))}
    </nav>

    <div className="sidebar-eco-note">
      <span aria-hidden="true">♻</span>
      <strong>Recycle Today</strong>
      <p>for a Better Tomorrow</p>
    </div>
  </aside>
);

export default AdminSidebar;
