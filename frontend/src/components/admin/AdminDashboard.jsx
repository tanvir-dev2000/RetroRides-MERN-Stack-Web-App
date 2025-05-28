// frontend/src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext'; // Corrected path from your uploaded file
import styles from './AdminDashboard.module.css';
import ManageUsers from './ManageUsers';
import TransactionHistory from './TransactionHistory';
// Removed Link import if not used for quick actions yet

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  // --- States for Dashboard Stats ---
  const [stats, setStats] = useState({
    totalCars: 0, registeredUsers: 0, completedSales: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');

  // Fetch overview statistics from backend
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoadingStats(true);
      setStatsError('');
      try {
        const config = { withCredentials: true };
        const { data } = await axios.get('http://localhost:5500/api/admin/dashboard-stats', config);
        setStats({
          totalCars: data.totalCars || 0,
          registeredUsers: data.totalUsers || 0,
          completedSales: data.completedSales || 0,
        });
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || "Failed to fetch overview stats";
        console.error("Failed to fetch overview stats:", errorMsg);
        setStatsError(`Could not load dashboard stats: ${errorMsg}`);
        setStats({ totalCars: 'N/A', registeredUsers: 'N/A', completedSales: 'N/A' });
      } finally {
        setLoadingStats(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const overviewStatsConfig = [
    { icon: '🚗', key: 'totalCars', label: 'Total Cars in Inventory', color: '#DC3545' },
    { icon: '👥', key: 'registeredUsers', label: 'Registered Users', color: '#007BFF' },
    { icon: '🛒', key: 'completedSales', label: 'Completed Sales (Simulated)', color: '#28A745' },
  ];

  return (
    <div className={styles.adminDashboardContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
        <div className={styles.welcomeMessage}>Welcome, {user ? user.firstName : 'Admin'}!</div>
      </div>

      {statsError && <p className={`${styles.message} ${styles.errorMessage}`}>{statsError}</p>}
      <div className={styles.statsOverviewContainer}>
        {overviewStatsConfig.map(statItem => (
          <div key={statItem.key} className={styles.statCard}>
            <div className={styles.statIcon} style={{backgroundColor: statItem.color + '20', color: statItem.color}}>{statItem.icon}</div>
            <div className={styles.statValue}>
              {loadingStats ? '...' : stats[statItem.key] === 'N/A' ? 'N/A' : stats[statItem.key]}
            </div>
            <div className={styles.statLabel}>{statItem.label}</div>
          </div>
        ))}
      </div>
      {/* 
        Future enhancements for AdminDashboard:
        - Quick links to other admin sections
        - Recent activity feed
        - Charts or graphs for key metrics
      */}
    </div>
  );
};

export default AdminDashboard;
