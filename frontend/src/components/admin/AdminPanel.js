import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ManageCategories from './ManageCategories';
import ManageSubcategories from './ManageSubcategories';
import ManageOrders from './ManageOrders';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="admin-panel">
      <nav>
        <Link to="/admin/categories">Categories</Link>
        <Link to="/admin/subcategories">Subcategories</Link>
        <Link to="/admin/orders">Orders</Link>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
      </nav>
      <div className="content">
        <Routes>
          <Route path="categories" element={<ManageCategories />} />
          <Route path="subcategories" element={<ManageSubcategories />} />
          <Route path="orders" element={<ManageOrders />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;