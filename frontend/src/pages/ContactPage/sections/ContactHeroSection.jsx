// frontend/src/pages/ContactPage/sections/ContactHeroSection.jsx
import React from 'react';
import styles from './ContactHeroSection.module.css';

const ContactHeroSection = () => {
  return (
    <section className={styles.contactHeroSection}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.mainHeadline}>We're Here to Assist You</h1>
        <p className={styles.subHeadline}>
          Whether you have a question about a specific vehicle, our services, or just want to talk cars, 
          we'd love to hear from you.
        </p>
      </div>
    </section>
  );
};

export default ContactHeroSection;
