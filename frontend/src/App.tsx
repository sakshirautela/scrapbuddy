// @ts-nocheck
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login/Login';
import Signup from './components/auth/Register/Register'; 
import ForgotPassword from './components/auth/ForgotPassword/ForgetPassword';
import ResetPassword from './components/auth/ResetPassword/ResetPassword';
import UserDetails from './pages/UserDetails';
import DefaultDashboard from './pages/DefaultDashboard';
import SchedulePickup from './pages/SchedulePickup';
import PriceList from './pages/PriceList';
import TrackOrder from './pages/TrackOrder';
import AdminDashboard from './pages/admin/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import PrivateRoute from './routes/PrivateRoute';
import RoleProtectedRoute from './routes/RoleProtectedRoute';
import GuestRoute from './routes/GuestRoute';
import AlertProvider from './components/common/Alert/AlertProvider';
import NavBar from './components/common/NavBar/NavBar';
import './App.css';

function App() {
  return (
    <AlertProvider>
      <Router>
        <div className="App">
          <NavBar />
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
            <Route path="/forget-password" element={
                <ForgotPassword />
            } />
            <Route path="/reset-password" element={
                <ResetPassword />
            } />

            {/* Protected Routes */}
            <Route path="/" element={
                <DefaultDashboard />
            } />

            <Route path="/schedule-pickup" element={
                <SchedulePickup />
            } />

            <Route path="/price-list" element={
                <PriceList />
            } />

            <Route path="/track-order" element={
                <TrackOrder />
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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AlertProvider>
  );
}

export default App;
