// frontend/src/pages/AboutUsPage/sections/GuidingPrinciplesSection.jsx
import React from 'react';
import styles from './GuidingPrinciplesSection.module.css';

// Mock data for guiding principles - replace with your actual data
const principlesData = [
  {
    icon: 'fas fa-gem', // Example: Diamond for Quality/Excellence
    title: 'Uncompromising Quality',
    description: 'We meticulously source, restore, and maintain every vehicle to the highest standards of craftsmanship and authenticity.',
  },
  {
    icon: 'fas fa-handshake', // Example: Handshake for Integrity
    title: 'Integrity & Transparency',
    description: 'Honesty and clarity are the cornerstones of all our interactions, from valuations to sales and client relationships.',
  },
  {
    icon: 'fas fa-heart', // Example: Heart for Passion
    title: 'Driven by Passion',
    description: 'Our profound love for automotive history fuels our dedication to preserving these timeless machines.',
  },
  {
    icon: 'fas fa-users', // Example: Users for Community
    title: 'Fostering Community',
    description: 'We strive to connect enthusiasts, share knowledge, and celebrate the rich heritage of classic automobiles together.',
  },
  {
    icon: 'fas fa-shield-alt', // Example: Shield for Trust
    title: 'Lasting Trust',
    description: 'Building enduring relationships with our clients through reliable service and unwavering expertise.',
  },
  {
    icon: 'fas fa-recycle', // Example: Recycle/Leaf for Preservation/Legacy
    title: 'Preserving Legacy',
    description: 'Committing to the careful stewardship of automotive masterpieces for future generations to admire and enjoy.',
  },
];

const GuidingPrinciplesSection = () => {
  return (
    <section className={styles.principlesSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Guiding <span className={styles.highlight}>Principles</span></h2>
        <p className={styles.sectionSubtitle}>
          The values that steer our commitment to excellence in the world of classic cars.
        </p>
        <div className={styles.principlesGrid}>
          {principlesData.map((principle, index) => (
            <div key={index} className={styles.principleCard}>
              <div className={styles.principleIconWrapper}>
                <i className={`${principle.icon} ${styles.principleIcon}`}></i>
              </div>
              <h4 className={styles.principleTitle}>{principle.title}</h4>
              <p className={styles.principleDescription}>{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuidingPrinciplesSection;
