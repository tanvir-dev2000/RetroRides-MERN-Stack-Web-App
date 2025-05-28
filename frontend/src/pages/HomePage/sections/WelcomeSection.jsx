import React from 'react';
import styles from './WelcomeSection.module.css';

// Sample data for services - you can replace this with dynamic data later
const servicesData = [
  {
    icon: 'fas fa-search-dollar', // Font Awesome icon class
    title: 'Expert Sourcing',
    description: 'We meticulously source rare and pristine classic cars from around the globe.',
  },
  {
    icon: 'fas fa-certificate',
    title: 'Certified Authenticity',
    description: 'Each vehicle comes with a certificate of authenticity and detailed history.',
  },
  {
    icon: 'fas fa-tools',
    title: 'Master Restoration',
    description: 'Our in-house experts provide museum-quality restoration services.',
  },
  {
    icon: 'fas fa-shield-alt',
    title: 'Secure Consignment',
    description: 'Trust us to manage the sale of your classic car with discretion and expertise.',
  },
  {
    icon: 'fas fa-globe-americas',
    title: 'Global Shipping',
    description: 'We offer secure and insured worldwide shipping for your prized possession.',
  },
  {
    icon: 'fas fa-comments-dollar',
    title: 'Investment Advice',
    description: 'Guidance on classic car investment and portfolio management.',
  },
];

const WelcomeSection = () => {
  return (
    <section className={styles.welcomeSection}>
      <div className={styles.container}>
        <div className={styles.welcomeText}>
          <h2 className={styles.sectionTitle}>
            Welcome to <span className={styles.highlight}>RetroRides</span>
          </h2>
          <p className={styles.introParagraph}>
            Where automotive passion meets timeless elegance. We are more than just a dealership; 
            we are custodians of history, dedicated to preserving and celebrating the art of the classic automobile.
          </p>
          <p className={styles.intriguingSentence}>
            Discover a curated collection of the world's most iconic vehicles, each with a unique story waiting to be continued by you.
          </p>
        </div>

        <div className={styles.servicesOverview}>
          <h3 className={styles.subSectionTitle}>Our Core <span className={styles.highlight}>Services</span></h3>
          <div className={styles.servicesGrid}>
            {servicesData.map((service, index) => (
              <div key={index} className={styles.serviceBox}>
                <div className={styles.serviceIconContainer}>
                  <i className={`${service.icon} ${styles.serviceIcon}`}></i>
                </div>
                <h4 className={styles.serviceTitle}>{service.title}</h4>
                <p className={styles.serviceDescription}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
