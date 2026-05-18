import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login/Login';
import Signup from './components/auth/Register/Register'; 
import UserDetails from './pages/UserDetails';
import DefaultDashboard from './pages/DefaultDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import PrivateRoute from './routes/PrivateRoute';
import RoleProtectedRoute from './routes/RoleProtectedRoute';
import GuestRoute from './routes/GuestRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path="/signup" element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          } />

          {/* Protected Routes */}
          <Route path="/" element={
              <DefaultDashboard />
          } />
          
          <Route path="/user" element={
            <PrivateRoute>
              <UserDetails />
            </PrivateRoute>
          } />

          {/* Role Protected Routes */}
          <Route path="/admin" element={
            <RoleProtectedRoute allowedRoles={['admin', 'superadmin', 'super_admin']}>
              <AdminDashboard />
            </RoleProtectedRoute>
          } />
          
          <Route path="/superadmin" element={
            <RoleProtectedRoute allowedRoles={['superadmin', 'super_admin']}>
              <SuperAdminDashboard />
            </RoleProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
