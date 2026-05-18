import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader/Loader';

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (user) {
    const userRole = user.role?.toLowerCase() || '';
    if (userRole === 'admin') {
      return <Navigate to="/admin" />;
    } else if (userRole === 'superadmin' || userRole === 'super_admin') {
      return <Navigate to="/superadmin" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default GuestRoute;