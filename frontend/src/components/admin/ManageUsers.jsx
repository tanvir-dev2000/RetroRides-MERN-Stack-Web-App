import React, { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});

  useEffect(() => {
    fetch('/api/admin/users', { credentials: 'include' })
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditFields({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      address: user.address || ''
    });
  };

  const handleEditChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleSave = async (userId) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(editFields)
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(users.map(u => u._id === userId ? updated : u));
      setEditingId(null);
    } else {
      alert('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (res.ok) {
      setUsers(users.filter(u => u._id !== userId));
    } else {
      alert('Failed to delete user');
    }
  };

  return (
    <div className={styles.listSection}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>All Users</h2>
      </div>
      <div className={styles.tableResponsive}>
        <table className={styles.carTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Member Since</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6}>No users found.</td></tr>
            ) : users.map(u => (
              <tr key={u._id}>
                <td>
                  {editingId === u._id ? (
                    <>
                      <input
                        name="firstName"
                        value={editFields.firstName}
                        onChange={handleEditChange}
                        className={styles.inlineInput}
                      />
                      <input
                        name="lastName"
                        value={editFields.lastName}
                        onChange={handleEditChange}
                        className={styles.inlineInput}
                      />
                    </>
                  ) : `${u.firstName} ${u.lastName}`}
                </td>
                <td>
                  {editingId === u._id ? (
                    <input
                      name="email"
                      value={editFields.email}
                      onChange={handleEditChange}
                      className={styles.inlineInput}
                    />
                  ) : u.email}
                </td>
                <td>
                  {editingId === u._id ? (
                    <input
                      name="phoneNumber"
                      value={editFields.phoneNumber}
                      onChange={handleEditChange}
                      className={styles.inlineInput}
                    />
                  ) : u.phoneNumber || '-'}
                </td>
                <td>
                  {editingId === u._id ? (
                    <input
                      name="address"
                      value={editFields.address}
                      onChange={handleEditChange}
                      className={styles.inlineInput}
                    />
                  ) : u.address || '-'}
                </td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                <td>
                  {editingId === u._id ? (
                    <>
                      <button onClick={() => handleSave(u._id)} className={styles.saveBtn}>Save</button>
                      <button onClick={() => setEditingId(null)} className={styles.cancelBtn}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(u)} className={styles.editBtn}>Edit</button>
                      <button onClick={() => handleDelete(u._id)} className={styles.deleteBtn}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
