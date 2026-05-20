import React from "react";
import { menuItems } from "../../utils/adminDashboard";

const AdminTopbar = ({
  activeTab,
  adminInitial,
  adminName,
  showProfile,
  user,
  onToggleProfile,
  onOpenProfile,
  onLogout,
}) => (
  <header className="shop-topbar">
    <div className="topbar-left">
      <button className="menu-button" type="button">☰</button>
      <h1>{menuItems.find((item) => item.key === activeTab)?.label || "Dashboard"}</h1>
    </div>

    <div className="topbar-right">
      <button className="notification-button" type="button">
        ♧
        <span>5</span>
      </button>
      <button className="theme-toggle" type="button" aria-label="Toggle theme">◐</button>
      <div className="admin-profile-menu">
        <button
          className="admin-profile-trigger"
          type="button"
          onClick={onToggleProfile}
          aria-expanded={showProfile}
          aria-haspopup="menu"
        >
          <span className="admin-avatar">{adminInitial}</span>
          <span className="admin-user">{adminName}</span>
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
