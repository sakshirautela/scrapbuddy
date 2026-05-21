import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./NavBar.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Schedule Pickup", to: "/schedule-pickup" },
  { label: "Price List", to: "/price-list" },
  { label: "Track Order", to: "/track-order" },
  { label: "About", to: "/#reviews" },
  { label: "Contact", to: "/#contact" },
];

const NavBar = ({ activePage = "", showUserChip = false, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Dashboard";
  const userInitial = displayName.charAt(0).toUpperCase();

  const isActive = (item) => {
    if (activePage) {
      return item.label.toLowerCase() === activePage.toLowerCase();
    }

    return item.to !== "/" && location.pathname === item.to;
  };

  return (
    <header className={`app-navbar ${className}`.trim()}>
      <Link className="app-navbar-brand" to="/">
        <span>♻</span>
        JunkBox
      </Link>

      <nav className="app-navbar-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link
            className={isActive(item) ? "active" : ""}
            key={item.label}
            to={item.to}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="app-navbar-actions">

        {showUserChip && user ? (
          <button
            className="app-navbar-user"
            type="button"
            onClick={() => navigate("/user")}
          >
            <span>{userInitial}</span>
            <strong>{displayName}</strong>
          </button>
        ) : (
          <button
            className="app-navbar-login"
            type="button"
            onClick={() => navigate(user ? "/user" : "/login")}
          >
            {user ? user.firstName: "Login / Sign Up"}
          </button>
        )}
      </div>
    </header>
  );
};

export default NavBar;
