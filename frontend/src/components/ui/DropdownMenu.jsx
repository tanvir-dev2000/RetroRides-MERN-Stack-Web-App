// frontend/src/components/ui/DropdownMenu.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DropdownMenu.module.css';
import AuthContext from '../../context/AuthContext.jsx';

const DropdownMenu = ({ closeDropdown }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    closeDropdown();
    navigate('/login'); 
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeDropdown();
  };
  
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';
  let displayName = 'User';
  if (user) {
      if (user.role === 'admin') displayName = 'Admin';
      else if (user.firstName) displayName = `${user.firstName} ${user.lastName || ''}`.trim();
      else if (user.name) displayName = user.name; // Fallback
  }

  return (
    <div className={styles.dropdownMenu}>
      <div className={styles.dropdownHeader}>
        {displayName}
      </div>
      <ul className={styles.dropdownList}>
        <li><button onClick={() => handleNavigation(dashboardPath)} className={styles.dropdownItem}>Dashboard</button></li>
        <li><button onClick={() => handleNavigation('/cart')} className={styles.dropdownItem}>Cart</button></li>
        <li><button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutButton}`}>Logout</button></li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
