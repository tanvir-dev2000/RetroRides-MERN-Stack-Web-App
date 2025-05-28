// frontend/src/components/RegisterForm.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import styles from './LoginForm.module.css'; // Uses the same CSS module for consistent style
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use AuthContext login for auto-login

  const { firstName, lastName, email, password, phoneNumber, address } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!firstName || !lastName || !email || !password) {
      setError('First Name, Last Name, Email, and Password are required.');
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500'}/api/auth/register`,
        { firstName, lastName, email, password, phoneNumber, address }
      );
      
      // Handle different response scenarios from backend
      if (response.data && response.data.message && response.data.message.includes("User registered successfully") && response.data.user && response.data.token) {
        // Scenario 1: Registration successful, user and token returned for auto-login
        setSuccessMessage('Registration successful! Logging you in...');
        login(response.data.user, response.data.token);
        setTimeout(() => navigate('/', { replace: true }), 1500);
      } else if (response.data && response.data.message && response.data.message.includes("User registered successfully")) {
        // Scenario 2: Registration successful, but no auto-login (e.g., email verification needed)
        setSuccessMessage('Registration successful! Please check your email to verify or proceed to login.');
         setTimeout(() => navigate('/login'), 2500);
        
      } else {
        setError(response.data.message || 'Registration completed, but encountered an issue.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginFormBox}> {/* Uses same form box style */}
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Create Account</h2>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {successMessage && <div className={styles.successMessageRegister}>{successMessage}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrapper}>
              <input type="text" id="register-firstName" name="firstName" value={firstName} onChange={handleChange} className={styles.input} placeholder=" " required />
              <label htmlFor="register-firstName" className={styles.label}>First Name</label>
            </div>
            <div className={styles.inputWrapper}>
              <input type="text" id="register-lastName" name="lastName" value={lastName} onChange={handleChange} className={styles.input} placeholder=" " required />
              <label htmlFor="register-lastName" className={styles.label}>Last Name</label>
            </div>
            <div className={styles.inputWrapper}>
              <input type="email" id="register-email" name="email" value={email} onChange={handleChange} className={styles.input} placeholder=" " required />
              <label htmlFor="register-email" className={styles.label}>Email Address</label>
            </div>
            <div className={styles.inputWrapper}>
              <input type="password" id="register-password" name="password" value={password} onChange={handleChange} className={styles.input} placeholder=" " required />
              <label htmlFor="register-password" className={styles.label}>Password</label>
            </div>
            <div className={styles.inputWrapper}>
              <input type="tel" id="register-phoneNumber" name="phoneNumber" value={phoneNumber} onChange={handleChange} className={styles.input} placeholder=" " />
              <label htmlFor="register-phoneNumber" className={styles.label}>Phone Number (Optional)</label>
            </div>
            <div className={styles.inputWrapper}>
              <input type="text" id="register-address" name="address" value={address} onChange={handleChange} className={styles.input} placeholder=" " />
              <label htmlFor="register-address" className={styles.label}>Address (Optional)</label>
            </div>
            <div className={styles.buttonContainer}>
              <button type="submit" className={`${styles.button} ${styles.primary}`}>
                Register
              </button>
            </div>
          </form>
          <p className={styles.toggleFormText}> {/* Moved to direct page link, not a prop */}
            Already have an account?{' '}
            <Link to="/login" className={styles.toggleLink}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
