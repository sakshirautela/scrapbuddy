import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/auth/Login/Login';
import Register from '../components/auth/Register/Register';
import ProfileDashboard from '../pages/UserDetails';
import DefaultDashboard from '../pages/DefaultDashboard';
import ResetPassword from '../components/auth/ResetPassword/ResetPassword';
function AppRoutes() {
  const { user } = useAuth();
  const role = (user?.role || user?.RoleNameEnum || '').toLowerCase();
  const signedInRedirect =
    role === 'admin'
      ? <Navigate to="/admin" replace />
      : role === 'superadmin' || role === 'super_admin'
        ? <Navigate to="/superadmin" replace />
        : <Navigate to="/" replace />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<DefaultDashboard />} />
      <Route path="/profile" element={<ProfileDashboard />} />
      <Route path="/login" element={user ? signedInRedirect : <Login />} />
      <Route path="/register" element={user ? signedInRedirect : <Register />} />
      <Route path='/reset-password' element={<ResetPassword />} />
    </Routes>
  );
}

export default AppRoutes;
