import React, { useState } from 'react';
import '../styles/Navbar.css';

export function SidebarDashboard() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <h2 className="sidebar-logo">Admin Panel</h2>
        <div className="menu-item">
          <button onClick={() => toggleMenu('dashboard')}>
            Dashboard
          </button>
          {openMenu === 'dashboard' && (
            <div className="submenu">
              <a href="#overview">Overview</a>
              <a href="#analytics">Analytics</a>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button onClick={() => toggleMenu('products')}>
            Products
          </button>

          {openMenu === 'products' && (
            <div className="submenu">
              <a href="#add-product">Add Product</a>
              <a href="#manage-product">Manage Products</a>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button onClick={() => toggleMenu('orders')}>
            Orders
          </button>

          {openMenu === 'orders' && (
            <div className="submenu">
              <a href="#all-orders">All Orders</a>
              <a href="#pending-orders">Pending Orders</a>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button onClick={() => toggleMenu('users')}>
            Users
          </button>

          {openMenu === 'users' && (
            <div className="submenu">
              <a href="#create-user">Create User</a>
              <a href="#delete-user">Delete User</a>
            </div>
          )}
        </div>
      </div>

      <div className="main-content">
        <div className="dashboard-grid">
          <div className="dashboard-card">Total Products</div>
          <div className="dashboard-card">Total Orders</div>
          <div className="dashboard-card">Total Users</div>
          <div className="dashboard-card">Revenue</div>
        </div>
      </div>
    </div>
  );
}

export default SidebarDashboard;