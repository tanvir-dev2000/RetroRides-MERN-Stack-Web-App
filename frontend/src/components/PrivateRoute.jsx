// frontend/src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isAuthenticated, loadingAuth } = useContext(AuthContext);
  const location = useLocation();

  if (loadingAuth) {
    // While authentication status is being determined, show a loading indicator.
    // This prevents premature redirects before 'user' and 'isAuthenticated' are settled.
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Verifying authentication...</div>;
  }

  if (!isAuthenticated || !user) { // Check for user object as well
    // Not authenticated, or user object somehow null despite isAuthenticated being true (shouldn't happen but good check)
    console.log("PrivateRoute: Not authenticated or user is null, redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated and user object exists
  return children ? children : <Outlet />;
};

export default PrivateRoute;
