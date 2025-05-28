// frontend/src/pages/NewSite/WhyChooseUsSection.jsx
import React from 'react';
import styles from './WhyChooseUsSection.module.css';

const reasonsData = [
  {
    icon: 'fas fa-medal',
    title: 'Unrivaled Expertise',
    description: 'Decades of experience in sourcing, restoring, and valuing classic automobiles. Our knowledge is your assurance.',
  },
  {
    icon: 'fas fa-microscope',
    title: 'Meticulous Curation',
    description: 'Every vehicle in our collection undergoes rigorous inspection and provenance verification for unparalleled quality.',
  },
  {
    icon: 'fas fa-handshake',
    title: 'Transparent & Trustworthy',
    description: 'We believe in building lasting relationships through honest dealings and complete transparency in every transaction.',
  },
  {
    icon: 'fas fa-globe',
    title: 'Global Network, Personal Touch',
    description: 'Access to a worldwide network of collectors and enthusiasts, combined with personalized client service.',
  },
  {
    icon: 'fas fa-shield-alt',
    title: 'Legacy Preservation',
    description: 'More than sales, we are dedicated to preserving automotive heritage for future generations to cherish.',
  },
  {
    icon: 'fas fa-star',
    title: 'Passion-Driven Service',
    description: 'Our team shares your passion for classic cars, ensuring an enthusiastic and knowledgeable experience.',
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className={styles.whyChooseUsSection}>
      <div className={styles.container}>
        {/* The .textSide will now take full width as .imageSide is removed */}
        <div className={styles.textSideFull}> 
          <h2 className={styles.sectionTitle}>
            The RetroRides <span className={styles.highlight}>Difference</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Discover why discerning collectors and enthusiasts worldwide choose RetroRides for their classic automotive journey.
          </p>
          <div className={styles.reasonsGrid}>
            {reasonsData.map((reason, index) => (
              <div key={index} className={styles.reasonItem}>
                <div className={styles.reasonIconWrapper}>
                  <i className={`${reason.icon} ${styles.reasonIcon}`}></i>
                </div>
                <div className={styles.reasonText}>
                  <h4 className={styles.reasonTitle}>{reason.title}</h4>
                  <p className={styles.reasonDescription}>{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* REMOVED: <div className={styles.imageSide}> ... </div> */}
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
