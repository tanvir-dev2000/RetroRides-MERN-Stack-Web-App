// frontend/src/pages/NewSite/FeaturedCarsSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './FeaturedCarsSection.module.css';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedCarsSection = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MAX_SLIDES_DESKTOP = 3;
  const MAX_SLIDES_TABLET = 2;

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/cars');
        if (Array.isArray(response.data.cars)) {
          setFeaturedCars(response.data.cars.slice(0, 8));
        } else {
          console.error("API did not return an array for cars:", response.data);
          setFeaturedCars([]);
          setError('Unexpected data format received from server.');
        }
      } catch (err) {
        console.error("Error fetching featured cars:", err);
        setError(err.response?.data?.message || err.message || 'Failed to load featured cars.');
        setFeaturedCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  if (loading) {
    return (
      <section className={styles.featuredCarsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Featured <span className={styles.highlight}>Classics</span>
          </h2>
          <div className={styles.loadingState}>Loading featured cars...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.featuredCarsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Featured <span className={styles.highlight}>Classics</span>
          </h2>
          <div className={styles.errorState}>Error: {error}</div>
        </div>
      </section>
    );
  }

  if (featuredCars.length === 0) { 
    return (
      <section className={styles.featuredCarsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Featured <span className={styles.highlight}>Classics</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            No featured classics available at the moment. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  const mobileSlidesPerView = 1;

  return (
    <section className={styles.featuredCarsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          Featured <span className={styles.highlight}>Classics</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Handpicked marvels from automotive history, ready to ignite your passion.
        </p>
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={mobileSlidesPerView}
          centeredSlides={true}
          
          loop={featuredCars.length >= MAX_SLIDES_DESKTOP}
          navigation={{
            nextEl: `.${styles.swiperButtonNext}`,
            prevEl: `.${styles.swiperButtonPrev}`,
          }}
          pagination={{
            el: `.${styles.swiperPagination}`, 
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            768: {
              slidesPerView: Math.min(featuredCars.length, MAX_SLIDES_TABLET),
              centeredSlides: true, // always center slides
              loop: featuredCars.length >= MAX_SLIDES_TABLET,
            },
            1024: {
              slidesPerView: Math.min(featuredCars.length, MAX_SLIDES_DESKTOP),
              centeredSlides: true, // always center slides
              loop: featuredCars.length >= MAX_SLIDES_DESKTOP,
            },
          }}
          className={styles.carsSlider}
        >
          {featuredCars.map((car) => (
            <SwiperSlide key={car._id} className={styles.swiperSlideCard}>
              <div className={styles.carCard}>
                <div className={styles.cardImageContainer}>
                  <img
                    src={car.images && car.images.length > 0 ? car.images[0].url : '/images/placeholder-car.png'}
                    alt={`${car.make} ${car.model} (${car.year})`}
                    className={styles.carImage}
                  />
                  <div className={styles.imageOverlay}>
                    <Link to={`/cars/${car._id}`} className={styles.detailsButton}>View Details</Link>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.carName}>{`${car.make} ${car.model}`}</h3>
                  <p className={styles.carYear}>{car.year}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={styles.swiperControls}>
          <div className={`${styles.swiperButtonPrev} ${styles.swiperNavButton}`}><i className="fas fa-chevron-left"></i></div>
          <div className={`${styles.swiperPagination} ${styles.swiperDots}`}></div> 
          <div className={`${styles.swiperButtonNext} ${styles.swiperNavButton}`}><i className="fas fa-chevron-right"></i></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCarsSection;
