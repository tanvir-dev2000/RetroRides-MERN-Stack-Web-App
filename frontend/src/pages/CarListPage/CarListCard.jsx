// frontend/src/pages/CarListPage/CarListCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CarListCard.module.css';

const truncate = (str, n) => (str && str.length > n ? str.slice(0, n - 1) + '…' : str);

const CarListCard = ({ car }) => (
  <Link to={`/cars/${car._id}`} className={styles.carCardLink}>
    <div className={styles.carCardHorizontal}>
      <div className={styles.carCardImageWrapper}>
        {car.images && car.images.length > 0 ? (
          <img src={car.images[0].url} alt={`${car.make} ${car.model}`} className={styles.carCardImage} />
        ) : (
          <div className={styles.noImageAvailable}>No Image</div>
        )}
        {car.featured && <span className={styles.featuredBadge}>Featured</span>}
      </div>
      <div className={styles.carCardMainInfo}>
        <div className={styles.carCardTitle}>{car.year} {car.make} {car.model}</div>
        <div className={styles.carCardDescription}>{truncate(car.description, 120)}</div>
      </div>
      <div className={styles.carCardPriceArea}>
        <div className={styles.carCardPrice}>
          {car.price ? `$${Number(car.price).toLocaleString()}` : 'Price on Request'}
        </div>
      </div>
    </div>
  </Link>
);

export default CarListCard;
