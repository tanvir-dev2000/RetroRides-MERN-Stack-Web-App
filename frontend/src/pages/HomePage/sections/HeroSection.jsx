import React from 'react';
import styles from './HeroSection.module.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <video
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline // Important for mobile compatibility
        // Poster image for while video loads or if it fails
        // poster="/images/hero-poster.jpg" // Optional: Create a poster image
      >
        {/* USER ACTION: Update this path to your actual video file in /public/videos/ */}
        <source src="https://cdn.pixabay.com/video/2019/06/13/24387-342401483_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.mainHeadline}>Discover Your Timeless Classic</h1>
        <p className={styles.subHeadline}>
          Experience the pinnacle of automotive history. Curated collection, unparalleled quality.
        </p>
        <div className={styles.buttonGroup}>
          {/* USER ACTION: Update these 'to' props to your actual inventory and selling routes */}
          <Link to="/inventory" className={`${styles.btn} ${styles.btnPrimary}`}>
            Explore Inventory
          </Link>
          <Link to="/sell-your-car" className={`${styles.btn} ${styles.btnSecondary}`}>
            Sell Your Car
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
