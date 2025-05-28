// frontend/src/components/layout/SubFooter.jsx
import React from 'react';
import styles from './SubFooter.module.css';
import { Link } from 'react-router-dom';

const SubFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.subFooter}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Retro<span className={styles.highlight}>Rides</span></h4>
            <p className={styles.aboutText}>
              Preserving automotive history, one classic at a time. Your premier destination for timeless vehicles and expert services.
            </p>
            <div className={styles.socialIcons}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Quick <span className={styles.highlight}>Links</span></h4>
            <ul className={styles.linkList}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/cars">Inventory</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/sell-your-car">Sell Your Car</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Get In <span className={styles.highlight}>Touch</span></h4>
            <ul className={styles.contactList}>
              <li><i className="fas fa-map-marker-alt"></i> 123 Classic Drive, Auto City, USA</li>
              <li><i className="fas fa-phone-alt"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-envelope"></i> contact@retrorides.com</li>
              <li><i className="fas fa-clock"></i> Mon - Fri: 9am - 6pm</li>
            </ul>
          </div>

           <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>Newsletter</h4>
            <p className={styles.newsletterText}>Stay updated with our latest arrivals and exclusive offers.</p>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className={styles.newsletterInput} />
              <button type="submit" className={styles.newsletterButton}>Subscribe</button>
            </form>
          </div>
        </div>
        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} RetroRides. All Rights Reserved.</p>
          <div className={styles.legalLinks}>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SubFooter;
