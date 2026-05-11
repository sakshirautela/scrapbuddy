import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import CreateOrder from './CreateOrder';
import ViewOrders from './ViewOrders';
import './UserPanel.css';

const UserPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="user-panel">
      <nav>
        <Link to="/user/create-order">Create Order</Link>
        <Link to="/user/view-orders">View Orders</Link>
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>
      </nav>
      <div className="content">
        <Routes>
          <Route path="create-order" element={<CreateOrder />} />
          <Route path="view-orders" element={<ViewOrders />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserPanel;