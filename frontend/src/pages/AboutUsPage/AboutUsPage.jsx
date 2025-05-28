// frontend/src/pages/AboutUsPage/AboutUsPage.jsx
import React from 'react';
import pageStyles from './AboutUsPage.module.css'; 
import AboutHeroSection from './sections/AboutHeroSection.jsx';
import TimelineSection from './sections/TimelineSection.jsx';
import GuidingPrinciplesSection from './sections/GuidingPrinciplesSection.jsx';
import DeveloperTeamSection from './sections/DeveloperTeamSection.jsx';
import AutomotiveLegacySection from './sections/AutomotiveLegacySection.jsx'; 

const AboutUsPage = () => {
  return (
    <div className={pageStyles.aboutPageContainer}>
      <AboutHeroSection />
      <TimelineSection />
      <GuidingPrinciplesSection />
      <DeveloperTeamSection />
      <AutomotiveLegacySection />
    </div>
  );
};

export default AboutUsPage;
