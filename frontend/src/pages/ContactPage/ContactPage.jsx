// frontend/src/pages/ContactPage/ContactPage.jsx
import React from 'react';
import pageStyles from './ContactPage.module.css'; 

import ContactHeroSection from './sections/ContactHeroSection.jsx';
import ContactFormInfoSection from './sections/ContactFormInfoSection.jsx';
import MapSection from './sections/MapSection.jsx';

const ContactPage = () => {
  return (
    <div className={pageStyles.contactPageContainer}>
      <ContactHeroSection />
      <ContactFormInfoSection />
      <MapSection />
    </div>
  );
};

export default ContactPage;
