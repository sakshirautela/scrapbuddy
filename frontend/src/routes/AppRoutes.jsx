import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import RoleProtectedRoute from './RoleProtectedRoute';
import RoleNameEnum from '../enums/RoleNameEnum';
import DefaultDashboard from '../pages/DefaultDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import SuperAdminDashboard from '../pages/SuperAdminDashboard';
import Login from '../components/auth/Login/Login';
import Register from '../components/auth/Register/Register';
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/DefaultDashboard" />} />
      <Route path="/login" element={user ? ( user.RoleNameEnum === 'User' ? <Navigate to="/DefaultDashboard" /> : (user.RoleNameEnum === 'Admin' ? <Navigate to="/AdminDashboard" /> : <SuperAdminDashboard/>)) : <Login />} />
    </Routes>
  );
}

export default AppRoutes;