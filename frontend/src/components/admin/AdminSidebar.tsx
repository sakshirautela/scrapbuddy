// @ts-nocheck
import React from "react";
import SideNav from "../common/SideNav/SideNav";
import { menuItems } from "../../utils/adminDashboard";

const AdminSidebar = ({
  activeTab,
  isCollapsed = false,
  isMobileOpen = false,
  onCloseMobile,
  onSelectTab,
  onToggleSidebar,
}) => {
  const adminItems = menuItems.map((item) => ({
    ...item,
    iconClass: `admin-nav-icon ${item.icon}`,
  }));

  return (
    <SideNav
      ariaLabel="Admin navigation"
      brandIcon="♻"
      brandTitle="Scrapify"
      brandSubtitle="Admin Panel"
      className={`shop-sidebar admin-overview-sidebar${isMobileOpen ? " open" : ""}`}
      items={adminItems}
      activeKey={activeTab}
      onSelect={(item) => onSelectTab(item.key)}
      onClose={onCloseMobile}
      onToggle={onToggleSidebar}
      toggleLabel={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      toggleIcon="☰"
    />
  );
};

export default AdminSidebar;
