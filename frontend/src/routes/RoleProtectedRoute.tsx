// @ts-nocheck
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader/Loader';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  // If allowedRoles is specified, check if user's role is allowed
  if (allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase() || '';
    const isAllowed = allowedRoles.some(role => 
      userRole === role.toLowerCase()
    );

    if (!isAllowed) {
      // Redirect to dashboard based on user role
      if (userRole === 'admin') {
        return <Navigate to="/admin" />;
      } else if (userRole === 'superadmin' || userRole === 'super_admin') {
        return <Navigate to="/superadmin" />;
      } else {
        return <Navigate to="/user" />;
      }
    }
  }

  return children;
};

export default RoleProtectedRoute;
