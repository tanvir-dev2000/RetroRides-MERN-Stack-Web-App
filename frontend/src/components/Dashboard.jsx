import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const tabs = [
    { label: 'Profile Details', key: 'profile', icon: 'fa-id-card' },
    { label: 'Order History', key: 'orders', icon: 'fa-history' }
  ];
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch profile info
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await fetch('/api/auth/profile', { credentials: 'include' });
        const data = await res.json();
        setProfile(data.user || data);
      } catch (err) {
        setProfile(null);
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, []);

  // Fetch order history
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch('/api/transactions/my', { credentials: 'include' });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setOrders([]);
      }
      setLoadingOrders(false);
    };
    fetchOrders();
  }, []);

  // Handler to update profile fields (phone/address)
  const handleProfileUpdate = async (updatedFields) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user || data);
        alert('Profile updated successfully!');
      } else {
        alert(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      alert('Error updating profile.');
    }
  };

  return (
    <div className={styles.dashboardGrid}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>My Account</div>
        <nav>
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`${styles.sidebarBtn} ${activeTab === tab.key ? styles.activeSidebarBtn : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={`fas ${tab.icon} ${styles.sidebarIcon}`}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {activeTab === 'profile' && (
          <ProfileDetails
            user={profile}
            loading={loadingProfile}
            onUpdate={handleProfileUpdate}
          />
        )}
        {activeTab === 'orders' && (
          <OrderHistory orders={orders} loading={loadingOrders} />
        )}
      </main>
    </div>
  );
};

const ProfileDetails = ({ user, loading, onUpdate }) => {
  const [editFields, setEditFields] = useState({
    phoneNumber: '',
    address: ''
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setEditFields({
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(editFields);
    setEditing(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <i className="fas fa-id-card"></i> Personal Information
      </div>
      {loading ? (
        <div>Loading profile...</div>
      ) : !user ? (
        <div>Could not load profile.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.cardSection}>
            <div className={styles.cardSection}>
              <label>First Name</label>
              <input value={user.firstName || ''} readOnly />
            </div>
            <div className={styles.cardSection}>
              <label>Last Name</label>
              <input value={user.lastName || ''} readOnly />
            </div>
          </div>
          <div className={styles.cardSection}>
            <label>Email Address</label>
            <input value={user.email || ''} readOnly />
          </div>
          <div className={styles.cardSection}>
            <label>Phone Number</label>
            <input
              name="phoneNumber"
              value={editFields.phoneNumber}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>
          <div className={styles.cardSection}>
            <label>Address</label>
            <input
              name="address"
              value={editFields.address}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>
          <div className={styles.cardSection}>
            <label>Member Since</label>
            <input
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                  : ''
              }
              readOnly
            />
          </div>
          <div className={styles.cardSection}>
            {!editing ? (
              <button type="button" onClick={() => setEditing(true)} className={styles.editBtn}>
                Edit
              </button>
            ) : (
              <>
                <button type="submit" className={styles.saveBtn}>Save</button>
                <button type="button" onClick={() => { setEditing(false); setEditFields({ phoneNumber: user.phoneNumber || '', address: user.address || '' }); }} className={styles.cancelBtn}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

const OrderHistory = ({ orders, loading }) => (
  <div className={styles.card}>
    <div className={styles.cardTitle}>
      <i className="fas fa-history"></i> Order History
    </div>
    {loading ? (
      <div>Loading orders...</div>
    ) : orders.length === 0 ? (
      <div>No orders found.</div>
    ) : (
      <table className={styles.ordersTable}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Cars</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.transactionId}</td>
              <td>{new Date(order.transactionDate).toLocaleDateString()}</td>
              <td>
                {order.cars.map(item =>
                  <div key={item.car._id}>
                    {item.car.year} {item.car.make} {item.car.model}
                  </div>
                )}
              </td>
              <td>${Number(order.totalAmount).toLocaleString()}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default Dashboard;
