// frontend/src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

import RootLayout from './components/layout/RootLayout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import ManageCarsPage from './components/admin/ManageCarsPage.jsx';
import EditCarPage from './components/admin/EditCarPage.jsx';
import CarListPage from './pages/CarListPage/CarListPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AuthContext from './context/AuthContext.jsx';
import CarDetailPage from './pages/CarDetailPage/CarDetailPage.jsx';
import CarComparePage from './pages/CarComparePage/CarComparePage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import AboutUsPage from './pages/AboutUsPage/AboutUsPage.jsx';
import ContactPage from './pages/ContactPage/ContactPage.jsx';
import CartPage from './pages/CartPage/CartPage';
import ManageUsers from './components/admin/ManageUsers.jsx';
import TransactionHistory from './components/admin/TransactionHistory.jsx';
import ChatBot from './components/ChatBot';
import './App.css';

const NotFoundPage = () => (
  <div style={{ textAlign: 'center', padding: '50px', color: '#333' }}>
    <h2>404 - Page Not Found</h2>
    <p>Sorry, the page you are looking for does not exist.</p>
    <Link to="/" style={{ color: '#d90429', textDecoration: 'underline' }}>Go to Homepage</Link>
  </div>
);

function App() {
  const { loadingAuth, user } = useContext(AuthContext);

  if (loadingAuth) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', fontSize: '1.5rem'
      }}>
        Verifying Session...
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public routes with RootLayout */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cars" element={<CarListPage />} />
          <Route path="/cars/:carId" element={<CarDetailPage />} />
          <Route path="/compare" element={<CarComparePage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={user ? <Navigate to={user.role && user.role.toLowerCase() === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginForm />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to={user.role && user.role.toLowerCase() === 'admin' ? '/admin' : '/dashboard'} replace /> : <RegisterForm />}
          />

          {/* User Dashboard Route */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        </Route>

        {/* Admin Routes, outside RootLayout */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="manage-cars" element={<ManageCarsPage />} />
          <Route path="edit-car/:carId" element={<EditCarPage />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="transactions" element={<TransactionHistory />} />
        </Route>

        {/* Not Found (always last, top-level) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* ChatBot is always visible, floating on every page */}
      <ChatBot />
    </>
  );
}

export default App;
