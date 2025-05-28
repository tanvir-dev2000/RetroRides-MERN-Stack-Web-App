// frontend/src/pages/ContactPage/sections/ContactFormInfoSection.jsx
import React, { useState } from 'react';
import styles from './ContactFormInfoSection.module.css';
import { Link } from 'react-router-dom'; // For "Sell Your Car" link

const ContactFormInfoSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Sending...');
    // Replace with your actual form submission logic (e.g., API call)
    try {
      // Example: const response = await axios.post('/api/contact', formData);
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      setStatusMessage('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); // Clear form
    } catch (error) {
      console.error("Form submission error:", error);
      setStatusMessage('Failed to send message. Please try again or use direct contact methods.');
    }
  };

  const infoTilesData = [
    {
      icon: 'fas fa-phone-alt',
      title: 'Direct Contact',
      lines: ['Main Office: +1 (555) 123-4567', 'Sales Inquiries: +1 (555) 987-6543'],
      email: 'contact@retrorides.com'
    },
    {
      icon: 'fas fa-clock',
      title: 'Business Hours',
      lines: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed'],
    },
    {
      icon: 'fas fa-share-alt',
      title: 'Connect Socially',
      isSocial: true, // Special flag for social icons
      links: [
        { platform: 'facebook', url: 'https://facebook.com/retrorides', icon: 'fab fa-facebook-f' },
        { platform: 'instagram', url: 'https://instagram.com/retrorides', icon: 'fab fa-instagram' },
        { platform: 'twitter', url: 'https://twitter.com/retrorides', icon: 'fab fa-twitter' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/retrorides', icon: 'fab fa-linkedin-in' },
      ]
    },
    {
      icon: 'fas fa-car',
      title: 'Interested in Selling?',
      description: "Have a classic you'd like to consign or sell? We're always looking for quality vehicles.",
      ctaLink: '/sell-your-car', // Placeholder link
      ctaText: 'Learn More Here'
    },
  ];

  return (
    <section className={styles.contactFormInfoSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Contact Form */}
          <div className={styles.formColumn}>
            <h3 className={styles.columnTitle}>Send Us a <span className={styles.highlight}>Message</span></h3>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Your Message</label>
                <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required></textarea>
              </div>
              <button type="submit" className={styles.submitButton}>Send Message</button>
              {statusMessage && <p className={`${styles.statusMessage} ${statusMessage.includes('Failed') ? styles.error : styles.success}`}>{statusMessage}</p>}
            </form>
          </div>

          {/* Right Column: Info Tiles */}
          <div className={styles.infoColumn}>
            {infoTilesData.map((tile, index) => (
              <div key={index} className={styles.infoTile}>
                <div className={styles.tileIconWrapper}>
                  <i className={tile.icon}></i>
                </div>
                <h4 className={styles.tileTitle}>{tile.title}</h4>
                {tile.lines && tile.lines.map((line, i) => <p key={i} className={styles.tileText}>{line}</p>)}
                {tile.email && <a href={`mailto:${tile.email}`} className={styles.tileEmailLink}>{tile.email}</a>}
                
                {tile.isSocial && tile.links && (
                  <div className={styles.socialMediaLinks}>
                    {tile.links.map(link => (
                      <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                        <i className={link.icon}></i>
                      </a>
                    ))}
                  </div>
                )}
                
                {tile.description && <p className={styles.tileDescription}>{tile.description}</p>}
                {tile.ctaLink && tile.ctaText && (
                  <Link to={tile.ctaLink} className={styles.tileCtaLink}>{tile.ctaText}</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormInfoSection;
