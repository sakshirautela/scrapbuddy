// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
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
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Dashboard";
  const userInitial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (item) => {
    if (activePage) {
      return item.label.toLowerCase() === activePage.toLowerCase();
    }

    if (item.to === "/") {
      return location.pathname === "/";
    }

    return location.pathname === item.to;
  };

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className={`app-navbar ${className}`.trim()}>
      <Link className="app-navbar-brand" to="/">
        <span>♻</span>
        Scrapify
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

        {user ? (
          <div className="app-navbar-profile" ref={profileMenuRef}>
            <button
              className="app-navbar-user"
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
            >
              <span>{userInitial}</span>
              <strong>{displayName}</strong>
              <em aria-hidden="true">⌄</em>
            </button>

            {profileOpen ? (
              <div className="app-navbar-profile-menu" role="menu">
                <button type="button" role="menuitem" onClick={() => navigate("/user")}>
                  Profile
                </button>
                <button type="button" role="menuitem" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <button
            className="app-navbar-login"
            type="button"
            onClick={() => navigate("/login")}
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </header>
  );
};

export default NavBar;
