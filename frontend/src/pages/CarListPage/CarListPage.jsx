import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './CarListPage.module.css';
import CarFilters from './CarFilters';
import CarSortDropdown from './CarSortDropdown';
import CarListCard from './CarListCard';

const CarListPage = () => {
  const [allCars, setAllCars] = useState([]);
  const [displayedCars, setDisplayedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('custom');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch cars
  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/cars');
      if (Array.isArray(response.data.cars)) {
        setAllCars(response.data.cars);
        setDisplayedCars(response.data.cars);
      } else {
        setAllCars([]);
        setDisplayedCars([]);
        console.error("API did not return a cars array:", response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cars. Please try again later.');
      setAllCars([]);
      setDisplayedCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  // Filtering logic (includes searchTerm)
  useEffect(() => {
    let filtered = [...allCars];
    if (filters.make && filters.make.length) filtered = filtered.filter(car => filters.make.includes(car.make));
    if (filters.bodyStyle && filters.bodyStyle.length) filtered = filtered.filter(car => filters.bodyStyle.includes(car.bodyStyle));
    if (filters.fuelType && filters.fuelType.length) filtered = filtered.filter(car => filters.fuelType.includes(car.engine?.fuelType));
    if (filters.status && filters.status.length) filtered = filtered.filter(car => filters.status.includes(car.status));
    if (filters.featured) filtered = filtered.filter(car => car.featured);
    if (filters.priceRange) filtered = filtered.filter(car => Number(car.price) >= filters.priceRange[0] && Number(car.price) <= filters.priceRange[1]);
    if (filters.yearRange) filtered = filtered.filter(car => Number(car.year) >= filters.yearRange[0] && Number(car.year) <= filters.yearRange[1]);
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(car =>
        (car.make && car.make.toLowerCase().includes(term)) ||
        (car.model && car.model.toLowerCase().includes(term)) ||
        (car.year && car.year.toString().includes(term))
      );
    }
    setDisplayedCars(filtered);
  }, [filters, allCars, searchTerm]);

  // Sorting logic
  useEffect(() => {
    let sorted = [...displayedCars];
    switch (sortOption) {
      case 'make-asc':
        sorted.sort((a, b) => (a.make || '').localeCompare(b.make || ''));
        break;
      case 'make-desc':
        sorted.sort((a, b) => (b.make || '').localeCompare(a.make || ''));
        break;
      case 'year-desc':
        sorted.sort((a, b) => Number(b.year) - Number(a.year));
        break;
      case 'year-asc':
        sorted.sort((a, b) => Number(a.year) - Number(b.year));
        break;
      case 'price-asc':
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'alphabetical-asc':
        sorted.sort((a, b) => (`${a.make} ${a.model}`).localeCompare(`${b.make} ${b.model}`));
        break;
      case 'alphabetical-desc':
        sorted.sort((a, b) => (`${b.make} ${b.model}`).localeCompare(`${a.make} ${a.model}`));
        break;
      default:
        // Customized: no sort
        break;
    }
    setDisplayedCars(sorted);
    // eslint-disable-next-line
  }, [sortOption]);

  const handleResetFilters = () => setFilters({});

  return (
    <div className={styles.carListPageContainer}>
      <section className={styles.pageHeaderSection}>
        <div className={styles.pageHeaderContainer}>
          <h1 className={styles.pageTitle}>Explore <span className={styles.highlight}>Classics</span></h1>
          <p className={styles.pageSubtitle}>
            Find your dream vintage automobile. Use the filters to narrow down your search.
          </p>
        </div>
      </section>
      <main className={styles.mainContentSection}>
        <div className={styles.container}>
          <div className={styles.mainGrid}>
            <CarFilters cars={allCars} filters={filters} setFilters={setFilters} onReset={handleResetFilters} />
            <section className={styles.listingsArea}>
              <div className={styles.topControlsRow}>
                <input
                  type="text"
                  className={styles.searchBarInput}
                  placeholder="Search by make, model, or year..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ height: '44px' }} // Ensures height matches dropdown
                />
                <CarSortDropdown sortOption={sortOption} setSortOption={setSortOption} />
              </div>
              {loading ? (
                <div className={styles.loadingMessage}>Loading cars...</div>
              ) : error ? (
                <div className={styles.errorMessage}>{error}</div>
              ) : displayedCars.length === 0 ? (
                <div className={styles.emptyMessage}>No cars found. Try adjusting your filters.</div>
              ) : (
                <div className={styles.carListCardGrid}>
                  {displayedCars.map(car => (
                    <CarListCard car={car} key={car._id} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CarListPage;
