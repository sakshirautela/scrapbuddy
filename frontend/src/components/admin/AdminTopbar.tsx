// @ts-nocheck
import React from "react";
import { menuItems } from "../../utils/adminDashboard";

const AdminTopbar = ({
  activeTab,
  adminInitial,
  adminName,
  showProfile,
  user,
  onToggleProfile,
  onToggleMenu,
  onOpenProfile,
  onLogout,
}) => (
  <header className="shop-topbar">
    <div className="topbar-left">
      <button className="menu-button" type="button" onClick={onToggleMenu} aria-label="Open menu">
        ☰
      </button>
      <div>
        <h1>{menuItems.find((item) => item.key === activeTab)?.label || "Dashboard"}</h1>
        <p>Monitor pickups, manage operations, grow greener.</p>
      </div>
    </div>

    
  </header>
);

export default AdminTopbar;
