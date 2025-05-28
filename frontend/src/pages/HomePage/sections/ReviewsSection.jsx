// frontend/src/pages/NewSite/ReviewsSection.jsx
import React from 'react';
import styles from './ReviewsSection.module.css';
// Swiper imports if you were to use them

const reviewsData = [ // Using 3 items for better static grid balancing
  {
    id: 1, name: 'Alex Thompson', stars: 5,
    reviewText: "Absolutely stellar experience! RetroRides found me my dream '67 Shelby. Seamless, professional, and handled with genuine passion.",
    carMentioned: 'Shelby GT500 \'67',
  },
  {
    id: 2, name: 'Samantha Reed', stars: 4.5,
    reviewText: "The team's knowledge is incredible. Guided me to a perfect Porsche 356. Transparent and trustworthy.",
    carMentioned: 'Porsche 356 Speedster',
  },
  {
    id: 3, name: 'Marcus Chen', stars: 5,
    reviewText: "Sold my classic Jaguar through RetroRides. Achieved a fantastic price and handled everything with utmost care. True professionals.",
    carMentioned: 'Jaguar E-Type',
  },
  // Removed Isabelle for now to make the grid even, or Swiper will handle layout
];

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className={styles.starRating}>
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
      {halfStar && <i className="fas fa-star-half-alt"></i>}
      {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
    </div>
  );
};

const ReviewsSection = () => {
  return (
    <section className={styles.reviewsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          Words From Our <span className={styles.highlight}>Esteemed Clients</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Hear what fellow enthusiasts and collectors have to say about their RetroRides experience.
        </p>
        <div className={styles.reviewsSliderStatic}>
          {reviewsData.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              {/* REMOVED: reviewerAvatar img tag */}
              <div className={styles.reviewContent}>
                <p className={styles.reviewText}>"{review.reviewText}"</p>
              </div>
              <div className={styles.reviewerInfo}>
                <h4 className={styles.reviewerName}>{review.name}</h4>
                {review.carMentioned && <p className={styles.carMentioned}>Acquired: {review.carMentioned}</p>}
                <StarRating rating={review.stars} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
