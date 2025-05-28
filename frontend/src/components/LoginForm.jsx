// frontend/src/components/LoginForm.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import styles from './LoginForm.module.css';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500'}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data && response.data.user && response.data.token) {
        const loggedInUser = response.data.user;
        console.log("[LoginForm] Logged in user data from API:", loggedInUser); // For debugging
        
        // Call the login function from AuthContext to update global state
        login(loggedInUser, response.data.token); 
        console.log("[LoginForm] AuthContext login function called.");

        // CRITICAL: Redirect based on role AFTER AuthContext is updated
        if (loggedInUser.role && loggedInUser.role.toLowerCase() === 'admin') {
          console.log("[LoginForm] User is Admin. Redirecting to /admin");
          navigate('/admin', { replace: true });
        } else {
          console.log("[LoginForm] User is not Admin. Redirecting to /dashboard");
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError(response.data.message || 'Login failed: Invalid response from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error("[LoginForm] Login API error:", err);
    }
  };

  return (
    // Your existing JSX for the login form
    <div className={styles.pageWrapper}>
      <div className={styles.loginFormBox}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Login</h2>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                id="login-email"
                name="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="login-email" className={styles.label}>Email Address</label>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                id="login-password"
                name="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
              />
              <label htmlFor="login-password" className={styles.label}>Password</label>
            </div>
            <div className={styles.forgotPasswordWrapper}>
              <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
            </div>
            <div className={styles.buttonContainer}>
              <button type="submit" className={`${styles.button} ${styles.primary}`}>
                Login
              </button>
            </div>
          </form>
          <p className={styles.toggleFormText}>
            Don't have an account?{' '}
            <Link to="/register" className={styles.toggleLink}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
