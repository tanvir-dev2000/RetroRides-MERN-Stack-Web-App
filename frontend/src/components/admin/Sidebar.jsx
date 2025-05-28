import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { FaTachometerAlt, FaCar, FaUsers, FaHistory } from 'react-icons/fa';

const Sidebar = () => {
  const menuItems = [
    { path: "", name: "Dashboard", icon: <FaTachometerAlt /> }, // index route
    { path: "manage-cars", name: "Manage Cars", icon: <FaCar /> },
    { path: "manage-users", name: "Manage Users", icon: <FaUsers /> },
    { path: "transactions", name: "Transaction History", icon: <FaHistory /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                end={item.path === ""}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.linkText}>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
