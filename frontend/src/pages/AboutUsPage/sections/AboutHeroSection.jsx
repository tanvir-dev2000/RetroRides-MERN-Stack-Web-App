// frontend/src/pages/AboutUsPage/sections/AboutHeroSection.jsx
import React from 'react';
import styles from './AboutHeroSection.module.css';

const AboutHeroSection = () => {
  return (
    <section className={styles.aboutHeroSection}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.mainHeadline}>Driven by Passion, Defined by Legacy</h1>
        <p className={styles.subHeadline}>
          Discover the story behind RetroRides, where a love for automotive history 
          meets a commitment to excellence and community.
        </p>
      </div>
    </section>
  );
};

export default AboutHeroSection;
