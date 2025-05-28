// frontend/src/pages/HomePage/HomePage.jsx
import React from "react";
// Corrected import paths:
import HeroSection from "./sections/HeroSection.jsx";
import WelcomeSection from "./sections/WelcomeSection.jsx";
import FeaturedCarsSection from "./sections/FeaturedCarsSection.jsx";
import WhyChooseUsSection from "./sections/WhyChooseUsSection.jsx";
import ReviewsSection from "./sections/ReviewsSection.jsx";
import SellYourCarTeaserSection from "./sections/SellYourCarTeaserSection.jsx";

// Import the page-specific CSS module
import pageStyles from './HomePage.module.css'; 

const HomePage = () => {
  return (
    <div className={pageStyles.homePageWrapper}> 
      <HeroSection />
      <WelcomeSection />
      <FeaturedCarsSection />
      <WhyChooseUsSection />
      <ReviewsSection />
      <SellYourCarTeaserSection />
    </div>
  );
};

export default HomePage;
