// frontend/src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import AuthContext from '../../context/AuthContext.jsx';
import ProfileIcon from '../ui/ProfileIcon.jsx';
import DropdownMenu from '../ui/DropdownMenu.jsx';

const Navbar = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profileButtonRef.current && !profileButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navLogo}>
          <span className={styles.navLinkText}>RetroRides</span>
        </Link>
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLinks} ${styles.active}` : styles.navLinks} end>
              <span className={styles.navLinkText}>HOME</span>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/cars" className={({ isActive }) => isActive ? `${styles.navLinks} ${styles.active}` : styles.navLinks}>
              <span className={styles.navLinkText}>CARS</span>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/compare" className={({ isActive }) => isActive ? `${styles.navLinks} ${styles.active}` : styles.navLinks}>
              <span className={styles.navLinkText}>COMPARE</span>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/about" className={({ isActive }) => isActive ? `${styles.navLinks} ${styles.active}` : styles.navLinks}>
              <span className={styles.navLinkText}>ABOUT US</span>
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/contact" className={({ isActive }) => isActive ? `${styles.navLinks} ${styles.active}` : styles.navLinks}>
              <span className={styles.navLinkText}>CONTACT</span>
            </NavLink>
          </li>
        </ul>
        <div className={styles.navActionItems}>
          <Link to="/cart" className={styles.navCartLink} aria-label="Cart">
            <i className="fas fa-shopping-cart" style={{ fontSize: '1.25rem' }}></i>
          </Link>
          {isAuthenticated && user ? (
            <div className={styles.profileDropdownContainer} ref={dropdownRef}>
              <button onClick={toggleDropdown} className={styles.profileButton} ref={profileButtonRef}>
                <ProfileIcon user={user} />
              </button>
              {isDropdownOpen && <DropdownMenu closeDropdown={() => setIsDropdownOpen(false)} />}
            </div>
          ) : (
            <Link to="/login" className={styles.navButton}>
              LOGIN / REGISTER
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
