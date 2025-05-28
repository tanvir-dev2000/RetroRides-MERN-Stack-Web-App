// frontend/src/components/admin/TransactionHistory.jsx

import React, { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/transactions', { credentials: 'include' })
      .then(res => res.json())
      .then(data => { setTransactions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.listSection}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>Transaction History</h2>
      </div>
      <div className={styles.tableResponsive}>
        <table className={styles.carTable}>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Cars</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}>Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={6}>No transactions found.</td></tr>
            ) : transactions.map(tx => (
              <tr key={tx._id}>
                <td>{tx.transactionId}</td>
                <td>{tx.user ? `${tx.user.firstName} ${tx.user.lastName}` : '-'}</td>
                <td>{tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString() : '-'}</td>
                <td>
                  {tx.cars.map(item =>
                    <div key={item.car?._id}>
                      {item.car ? `${item.car.year} ${item.car.make} ${item.car.model}` : ''}
                    </div>
                  )}
                </td>
                <td>${Number(tx.totalAmount).toLocaleString()}</td>
                <td>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TransactionHistory;
