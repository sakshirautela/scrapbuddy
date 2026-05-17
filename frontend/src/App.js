import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login/Login';
import Signup from './components/auth/Register/Register'; 
import UserDetails from './pages/UserDetails';
import DefaultDashboard from './pages/DefaultDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DefaultDashboard   />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user" element={<UserDetails />} />
          <Route path="/superadmin" element={<SuperAdminDashboard />} /> {/* Reusing AdminDashboard for SuperAdmin for now */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
