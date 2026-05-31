// @ts-nocheck
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader/Loader';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen label="Checking your session..." />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
