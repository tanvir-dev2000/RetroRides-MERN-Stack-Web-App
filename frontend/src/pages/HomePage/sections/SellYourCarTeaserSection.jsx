import React from 'react';
import styles from './SellYourCarTeaserSection.module.css';
import { Link } from 'react-router-dom'; // For the call to action button

const benefitsData = [
  {
    icon: 'fas fa-hand-holding-usd',
    title: 'Maximize Your Return',
    description: 'Our global network and expert valuation ensure you achieve the best possible price for your classic.',
  },
  {
    icon: 'fas fa-shield-check', // Using Font Awesome 6 Pro, or use 'fas fa-shield-alt' for FA5
    title: 'Hassle-Free Process',
    description: 'From professional photography to handling inquiries and paperwork, we manage the entire sales process.',
  },
  {
    icon: 'fas fa-users-cog',
    title: 'Reach True Enthusiasts',
    description: 'Connect with a dedicated audience of serious collectors and passionate buyers actively seeking unique vehicles.',
  },
  {
    icon: 'fas fa-lock',
    title: 'Confidential & Secure',
    description: 'We prioritize your privacy and ensure all transactions are handled with the utmost discretion and security.',
  },
];

const SellYourCarTeaserSection = () => {
  return (
    <section className={styles.sellCarSection}>
      <div className={styles.backgroundOverlay}></div> {/* For darkening the background image */}
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.textBlock}>
            <h2 className={styles.sectionTitle}>
              Entrust Your <span className={styles.highlight}>Legacy</span> With Us
            </h2>
            <p className={styles.sectionSubtitle}>
              Considering selling your classic automobile? RetroRides offers a premier consignment service, 
              connecting your cherished vehicle with discerning collectors worldwide.
            </p>
            <Link 
              to="/sell-your-car" // USER ACTION: Ensure this route exists or update it
              className={styles.ctaButton}
            >
              Learn About Consignment
            </Link>
          </div>

          <div className={styles.benefitsBlock}>
            {benefitsData.map((benefit, index) => (
              <div key={index} className={styles.benefitItem}>
                <div className={styles.benefitIconWrapper}>
                  <i className={`${benefit.icon} ${styles.benefitIcon}`}></i>
                </div>
                <div className={styles.benefitText}>
                  <h4 className={styles.benefitTitle}>{benefit.title}</h4>
                  <p className={styles.benefitDescription}>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellYourCarTeaserSection;
