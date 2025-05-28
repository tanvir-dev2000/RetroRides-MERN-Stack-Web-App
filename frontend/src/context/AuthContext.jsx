// Example AuthProvider.jsx structure
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); // Start true to check initial auth status

  const verifyAuth = useCallback(async () => {
    setLoadingAuth(true);
    try {
      // Attempt to fetch user profile if a token cookie might exist
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500'}/api/auth/profile`, {
        withCredentials: true,
      });
      if (response.data && response.data._id) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.log('Not authenticated or error verifying auth:', error.response?.data?.message || error.message);
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth(); // Check auth status on initial load
  }, [verifyAuth]);

  const login = (userData, token) => { // Token isn't explicitly stored here but good practice to receive
    setUser(userData);
    setIsAuthenticated(true);
    setLoadingAuth(false); // Ensure loading is false after login
    console.log("AuthContext: User set after login:", userData);
  };

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500'}/api/auth/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error.response?.data?.message || error.message);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // No need to set loadingAuth here unless there's a post-logout loading state
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loadingAuth, login, logout, verifyAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
