// frontend/src/pages/AboutUsPage/sections/AutomotiveLegacySection.jsx
import React from 'react';
import styles from './AutomotiveLegacySection.module.css';
import { Link } from 'react-router-dom'; // Optional: if you want a CTA

const AutomotiveLegacySection = () => {
  return (
    <section className={styles.legacySection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Optional: You could place an iconic image here, e.g., floated left/right or as a background accent */}
          {/* <img src="/images/retro-theme/legacy-accent.jpg" alt="Classic Car Detail" className={styles.accentImage} /> */}
          
          <h2 className={styles.sectionTitle}>
            An Enduring <span className={styles.highlight}>Automotive Legacy</span>
          </h2>
          <p className={styles.introParagraph}>
            At RetroRides, we are more than just purveyors of classic cars; we are custodians of history, 
            champions of craftsmanship, and passionate advocates for the enduring allure of automotive artistry.
          </p>
          <div className={styles.textBlock}>
            <p>
              Each vehicle that passes through our hands carries with it a unique story, a testament to an era of
              unparalleled design and engineering prowess. We believe these machines are not mere objects, but
              rolling sculptures, embodying the spirit of innovation and the dreams of their creators.
            </p>
            <p>
              Our commitment extends beyond acquisition and sales. We are dedicated to meticulous preservation, 
              authentic restoration, and the sharing of knowledge that keeps these legacies alive. We work closely 
              with a network of master artisans, historians, and enthusiasts to ensure every detail honors the 
              original vision.
            </p>
            <p>
              Joining the RetroRides family means becoming part of a tradition that values heritage, celebrates
              excellence, and looks to the future by preserving the finest moments of the automotive past.
            </p>
          </div>
          {/* Optional Call to Action */}
          <Link to="/cars" className={styles.ctaButton}>
            Explore Our Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AutomotiveLegacySection;
