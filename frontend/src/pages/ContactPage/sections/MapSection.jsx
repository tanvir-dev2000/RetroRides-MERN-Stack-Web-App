// frontend/src/pages/ContactPage/sections/MapSection.jsx
import React from 'react';
import styles from './MapSection.module.css';

const MapSection = () => {
  // Embedded Google Maps URL provided by user
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8684.633025183924!2d90.43248753683984!3d23.7673985601346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7892dcf0001%3A0x853ad729be4edc71!2sEast%20West%20University!5e0!3m2!1sen!2sbd!4v1747729661699!5m2!1sen!2sbd";

  return (
    <section className={styles.mapSection}>
      <div className={styles.mapWrapper}>
        <iframe
          src={mapEmbedUrl}
          width="100%" /* These are overridden by CSS but good practice */
          height="100%" /* These are overridden by CSS but good practice */
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Our Location on Google Maps"
        ></iframe>
      </div>
    </section>
  );
};

export default MapSection;
