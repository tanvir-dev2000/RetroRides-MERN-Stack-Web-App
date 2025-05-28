// frontend/src/components/ui/ProfileIcon.jsx
import React from 'react';
import styles from './ProfileIcon.module.css';

const ProfileIcon = ({ user }) => {
  let initials = 'U'; 
  if (user) {
    if (user.role === 'admin') {
      initials = 'A';
    } else if (user.firstName && user.lastName) {
      initials = user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();
    } else if (user.firstName) { // Fallback if only firstName
      initials = user.firstName.charAt(0).toUpperCase();
    } else if (user.name) { // Fallback for single 'name' field (less likely now)
        const nameParts = user.name.split(' ');
        initials = nameParts[0].charAt(0).toUpperCase();
        if (nameParts.length > 1) {
            initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
        }
    }
  }

  const getBackgroundColor = (char) => {
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#f1c40f', '#34495e'];
    if (!char) return colors[0];
    const charCode = char.charCodeAt(0);
    return colors[charCode % colors.length];
  };
  
  const bgColor = getBackgroundColor(initials[0]);
  const displayName = user?.role === 'admin' ? 'Admin Profile' : `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User Profile';

  return (
    <div className={styles.profileIcon} style={{ backgroundColor: bgColor }} title={displayName}>
      {initials}
    </div>
  );
};

export default ProfileIcon;
