// @ts-nocheck
import React from "react";
import "./SideNav.css";

const SideNav = ({
  className = "",
  items = [],
  activeKey,
  onSelect,
  onClose,
  footerAction,
  ariaLabel = "Sidebar navigation",
}) => {
  return (
    <aside className={`app-side-nav ${className}`.trim()} aria-label={ariaLabel}>
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

      {footerAction ? (
        <button className="app-side-nav-footer" type="button" onClick={footerAction.onClick}>
          <span aria-hidden="true">{footerAction.icon}</span>
          {footerAction.label}
        </button>
      ) : null}
    </aside>
  );
};

export default SideNav;
