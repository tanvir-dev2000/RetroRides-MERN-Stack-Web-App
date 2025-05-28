// frontend/src/components/layout/RootLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import SubFooter from './SubFooter.jsx'; // Import the SubFooter
import styles from './RootLayout.module.css';

const RootLayout = () => {
  const navbarHeight = '0px'; // CORRECTED: Set to your actual Navbar height

  return (
    <div className={styles.rootLayoutContainer}>
      <Navbar />
      <main 
        className={styles.mainContent} 
        style={{ paddingTop: navbarHeight }}
      >
        <Outlet /> {/* Page content will render here */}
      </main>
      <SubFooter /> {/* Add the SubFooter here */}
    </div>
  );
};

export default RootLayout;
