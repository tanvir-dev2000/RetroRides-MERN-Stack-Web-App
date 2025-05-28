import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import AuthContext from '../../context/AuthContext';
import styles from './CarDetailPage.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const CarDetailPage = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { addToCompare } = useCompare();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);

  // Access authentication state from context
  const { isAuthenticated, loadingAuth } = useContext(AuthContext);

  useEffect(() => {
    // Fetch car data by ID
    const fetchCar = async () => {
      const res = await fetch(`/api/cars/${carId}`);
      const data = await res.json();
      setCar(data);
    };
    fetchCar();
  }, [carId]);

  if (!car) return <div className={styles.loading}>Loading...</div>;

  const handleCompare = () => {
    addToCompare(car._id);
    navigate('/compare');
  };

  const handleAddToCart = async () => {
    if (loadingAuth) return;
    if (!isAuthenticated) {
      alert('Please log in to add cars to your cart.');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ carId: car._id })
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/cart');
      } else {
        alert(data.error || 'Could not add to cart.');
      }
    } catch (err) {
      alert('Error adding to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className={styles.detailPage}>
      {/* Title */}
      <h1 className={styles.title}>
        {car.year} {car.make} {car.model}
        {car.location && ` in ${car.location}`}
      </h1>

      {/* Pictures Section */}
      <div className={styles.imageSection}>
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation
          thumbs={{ swiper: thumbsSwiper }}
          className={styles.mainSwiper}
        >
          {car.images && car.images.map((img, idx) => (
            <SwiperSlide key={img.url}>
              <img src={img.url} alt={`Car ${idx + 1}`} className={styles.mainImage} />
            </SwiperSlide>
          ))}
        </Swiper>
        {car.images && car.images.length > 1 && (
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            slidesPerView={Math.min(car.images.length, 5)}
            watchSlidesProgress
            className={styles.thumbsSwiper}
          >
            {car.images.map((img, idx) => (
              <SwiperSlide key={img.url}>
                <img src={img.url} alt={`Thumb ${idx + 1}`} className={styles.thumbImage} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Actions Row */}
      <div className={styles.actionsRow}>
        <button
          className={styles.actionBtn}
          onClick={handleAddToCart}
          disabled={addingToCart || loadingAuth}
        >
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
        <button className={styles.actionBtn} onClick={handleCompare}>Compare</button>
      </div>

      {/* Vehicle Details Section (above description) */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Vehicle Details</h2>
        <table className={styles.detailsTable}>
          <tbody>
            <tr>
              <th>Price:</th>
              <td>
                <span className={styles.price}>${Number(car.price).toLocaleString()}</span>
                {car.status === 'Available' && ' (OBO)'}
              </td>
            </tr>
            {car.location && (
              <tr>
                <th>Location:</th>
                <td>{car.location}</td>
              </tr>
            )}
            <tr>
              <th>Year:</th>
              <td>{car.year}</td>
            </tr>
            <tr>
              <th>Make:</th>
              <td>{car.make}</td>
            </tr>
            <tr>
              <th>Model:</th>
              <td>{car.model}</td>
            </tr>
            {car.exteriorColor && (
              <tr>
                <th>Exterior Color:</th>
                <td>{car.exteriorColor}</td>
              </tr>
            )}
            {car.interiorColor && (
              <tr>
                <th>Interior Color:</th>
                <td>{car.interiorColor}</td>
              </tr>
            )}
            {car.engine && car.engine.arrangement && (
              <tr>
                <th>Engine Arrangement:</th>
                <td>{car.engine.arrangement}{car.engine.cylinders}</td>
              </tr>
            )}
            {car.engine && car.engine.fuelType && (
              <tr>
                <th>Fuel Type:</th>
                <td>{car.engine.fuelType}</td>
              </tr>
            )}
            {car.engine && car.engine.horsepower && (
              <tr>
                <th>Horsepower:</th>
                <td>{car.engine.horsepower} HP</td>
              </tr>
            )}
            {car.engine && car.engine.torque && (
              <tr>
                <th>Torque:</th>
                <td>{car.engine.torque} Nm</td>
              </tr>
            )}
            {car.transmission && (
              <tr>
                <th>Transmission:</th>
                <td>{car.transmission}</td>
              </tr>
            )}
            {car.mileage && (
              <tr>
                <th>Odometer:</th>
                <td>{car.mileage} mi</td>
              </tr>
            )}
            {car.vin && (
              <tr>
                <th>VIN:</th>
                <td>{car.vin}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Vehicle Description Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Vehicle Description</h2>
        <div className={styles.descriptionText}>
          {car.description}
        </div>
      </section>
    </div>
  );
};

export default CarDetailPage;
