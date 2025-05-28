import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from '../layout/Navbar';      
import Subfooter from '../layout/SubFooter';
import styles from './AdminLayout.module.css';

const AdminLayout = () => (
  <>
    <Navbar />
    <div className={styles.adminLayout}>
      <Sidebar />
      <main className={styles.adminMain}>
        <Outlet />
      </main>
    </div>
    <Subfooter />
  </>
);

export default AdminLayout;
