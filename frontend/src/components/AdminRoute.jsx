// frontend/src/components/AdminRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loadingAuth } = useContext(AuthContext);
  const location = useLocation();

  if (loadingAuth) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Verifying admin access...</div>;
  }

  if (!isAuthenticated || !user) {
    console.log("AdminRoute: Not authenticated or user is null, redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // CORRECTED: Case-insensitive role check
  if (user.role && user.role.toLowerCase() !== 'admin') {
    console.log("AdminRoute: User is not Admin, redirecting to user dashboard. User role:", user.role);
    return <Navigate to="/dashboard" replace />; 
  }
  
  // If user is authenticated and role is 'admin' (case-insensitive)
  if (user.role && user.role.toLowerCase() === 'admin') {
     return children ? children : <Outlet />;
  }

  // Fallback if role is somehow missing or not 'admin' after auth checks
  // This should ideally not be reached if the above conditions are met.
  console.log("AdminRoute: Fallback - user role not 'admin' or missing. Role:", user.role);
  return <Navigate to="/dashboard" replace />; // Or to an "unauthorized" page
};

export default AdminRoute;
