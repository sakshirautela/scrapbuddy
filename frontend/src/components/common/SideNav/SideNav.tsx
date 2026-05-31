// @ts-nocheck
import React from "react";
import "./SideNav.css";

const SideNav = ({
  className = "",
  items = [],
  activeKey,
  onSelect,
  onClose,
  onToggle,
  brandIcon,
  brandTitle,
  brandSubtitle,
  toggleIcon = "×",
  toggleLabel = "Toggle sidebar",
  ariaLabel = "Sidebar navigation",
}) => {
  return (
    <aside className={`app-side-nav ${className}`.trim()} aria-label={ariaLabel}>
      <div className="app-side-nav-header">
        {brandTitle ? (
          <div className="app-side-nav-brand">
            {brandIcon ? <span aria-hidden="true">{brandIcon}</span> : null}
            <div className="app-side-nav-brand-text">
              <strong>{brandTitle}</strong>
              {brandSubtitle ? <small>{brandSubtitle}</small> : null}
            </div>
          </div>
        ) : null}

        {onToggle ? (
          <button className="sidebar-close" type="button" onClick={onToggle} aria-label={toggleLabel}>
            {toggleIcon}
          </button>
        ) : null}
      </div>

      <nav className="app-side-nav-list">
        {items.map((item) => (
          <button
            key={item.key}
            className={`app-side-nav-item${activeKey === item.key ? " active" : ""}`}
            type="button"
            onClick={() => {
              onSelect(item);
              onClose?.();
            }}
          >
            <span
              className={item.iconClass || "app-side-nav-icon"}
              aria-hidden="true"
            >
              {item.iconClass ? null : item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SideNav;
