import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SuperAdminDashboard from '../pages/SuperAdminDashboard';
import Login from '../components/auth/Login/Login';
import Register from '../components/auth/Register/Register';
import ProfileDashboard from '../pages/UserDetails';
import ResetPassword from '../components/auth/ResetPassword/ResetPassword';
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/DefaultDashboard" />} />
      <Route path="/profile" element={<ProfileDashboard />} />
      <Route path="/login" element={user ? ( user.RoleNameEnum === 'User' ? <Navigate to="/DefaultDashboard" /> : (user.RoleNameEnum === 'Admin' ? <Navigate to="/AdminDashboard" /> : <SuperAdminDashboard/>)) : <Login />} />
      <Route path="/register" element={user ? ( user.RoleNameEnum === 'User' ? <Navigate to="/DefaultDashboard" /> : (user.RoleNameEnum === 'Admin' ? <Navigate to="/AdminDashboard" /> : <SuperAdminDashboard/>)) : <Register />} />
      <Route path='/reset-password' element={<ResetPassword />} />
    </Routes>
  );
}

export default AppRoutes;
