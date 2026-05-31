// @ts-nocheck
import React from "react";
import SideNav from "../common/SideNav/SideNav";
import { menuItems } from "../../utils/adminDashboard";

const AdminSidebar = ({ activeTab, isOpen = false, onClose, onSelectTab }) => {
  const adminItems = menuItems.map((item) => ({
    ...item,
    iconClass: `admin-nav-icon ${item.icon}`,
  }));

  return (
    <SideNav
      ariaLabel="Admin navigation"
      className={`shop-sidebar admin-overview-sidebar${isOpen ? " open" : ""}`}
      items={adminItems}
      activeKey={activeTab}
      onSelect={(item) => onSelectTab(item.key)}
      onClose={onClose}
    />
  );
};

export default AdminSidebar;
