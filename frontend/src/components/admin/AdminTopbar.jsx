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

    <div className="topbar-right">
      <label className="admin-date-filter">
        <span aria-hidden="true" />
        <select aria-label="Dashboard date range">
          <option>12 May 2025 - 18 May 2025</option>
          <option>This month</option>
          <option>Last 30 days</option>
        </select>
      </label>
      <label className="admin-search">
        <input type="search" placeholder="Search requests, customers, executives..." />
        <span aria-hidden="true" />
      </label>
      <button className="notification-button" type="button">
        <span aria-hidden="true" />
        <span>5</span>
      </button>
      <div className="admin-profile-menu">
        <button
          className="admin-profile-trigger"
          type="button"
          onClick={onToggleProfile}
          aria-expanded={showProfile}
          aria-haspopup="menu"
        >
          <span className="admin-avatar">{adminInitial}</span>
          <span className="admin-user">
            <strong>{adminName}</strong>
            <small>{user?.email || "admin@scrapbuddy.com"}</small>
          </span>
          <span>⌄</span>
        </button>

        {showProfile ? (
          <div className="admin-profile-dropdown" role="menu">
            <div className="profile-dropdown-header">
              <span className="admin-avatar profile-large">{adminInitial}</span>
              <div>
                <strong>{adminName}</strong>
                <p>{user?.email || "No email added"}</p>
              </div>
            </div>
            <dl className="profile-details">
              <div>
                <button className="-profile-button" type="button" onClick={onOpenProfile}>
                  Profile
                </button>
              </div>
              <div>
                <dt>Username</dt>
                <dd>{user?.username || "-"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{user?.phone || "-"}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{user?.role || "Admin"}</dd>
              </div>
            </dl>
            <button className="profile-logout" type="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </div>
  </header>
);

export default AdminTopbar;
