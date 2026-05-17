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
  //   return (
  //     <Routes>
  //       Public Routes
  //       <Route path="/login" element={user ? <Navigate to="/DefaultDashboard" /> : <Login />} />
  //       <Route path="/register" element={user ? <Navigate to="/login" /> : <Register />} />
  //       <Route path="/forgot-password" element={user ? <Navigate to="/reset-password" /> : <ForgotPassword />} />
  //       <Route path="/reset-password" element={user ? <Navigate to="/login" /> : <ResetPassword />} />
  //       {/* Protected Routes */}
  //       <Route path="/dashboard" element={
  //         // <PrivateRoute>
  //           <Dashboard />
  //         // </PrivateRoute>
  //       } />
  // <Route path="/DefaultDashboard" element={
  //         // <PrivateRoute>
  //           <DefaultDashboard />
  //         // </PrivateRoute>
  //       } />
  //       <Route path="/AdminDashboard" element={
  //         // <PrivateRoute>
  //           <AdminDashboard />
  //         // </PrivateRoute>
  //       } />
  //       <Route path="/orders" element={
  //         <PrivateRoute>
  //           <OrdersPage />
  //         </PrivateRoute>
  //       } />

  //       <Route path="/categories" element={
  //         <PrivateRoute>
  //           <CategoriesPage />
  //         </PrivateRoute>
  //       } />

  //       <Route path="/users" element={
  //         <RoleProtectedRoute allowedRoles={[RoleNameEnum.ADMIN, RoleNameEnum.SUPER_ADMIN]}>
  //           <UsersPage />
  //         </RoleProtectedRoute>
  //       } />

  //       <Route path="/notifications" element={
  //         <PrivateRoute>
  //           <NotificationsPage />
  //         </PrivateRoute>
  //       } />

  //       <Route path="/admin" element={
  //         <RoleProtectedRoute allowedRoles={[RoleNameEnum.ADMIN, RoleNameEnum.SUPER_ADMIN]}>
  //           <AdminPage />
  //         </RoleProtectedRoute>
  //       } />

  //       <Route path="/superadmin" element={
  //         <RoleProtectedRoute allowedRoles={[RoleNameEnum.SUPER_ADMIN]}>
  //           <SuperAdminPage />
  //         </RoleProtectedRoute>
  //       } />

  //       {/* Default redirect */}
  //       <Route path="/" element={<Navigate to="/dashboard" />} />
  //       <Route path="*" element={<Navigate to="/dashboard" />} />

  //     </Routes>
  //   );
  return
  (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/DefaultDashboard" />} />
        <Route path="/login" element={user ?( user.RoleNameEnum=='User' ? <Navigate to="/DefaultDashboard" /> : (user.RoleNameEnum=='Admin' ? <Navigate to="/AdminDashboard" /> : <SuperAdminDashboard/>)) : <Login />} />
    </Routes>
  );
}

export default AppRoutes;