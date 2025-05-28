import React, { useEffect } from 'react';
import styles from './CarFilters.module.css';

const ALL_STATUSES = ['Available', 'Sold', 'Pending Sale', 'Coming Soon', 'Consignment', 'Reserved', 'Draft'];
const ALL_TRANSMISSIONS = ['Automatic', 'Manual', 'Semi-Automatic', 'CVT'];
const ALL_FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Petrol', 'Other'];

const CarFilters = ({ cars, filters, setFilters, onReset }) => {
  const makes = [...new Set(cars.map(car => (car.make || '').toString()).filter(Boolean))].sort();
  const bodyStyles = [...new Set(cars.map(car => (car.bodyStyle || '').toString()))]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort()
    .filter(Boolean);

  const allPrices = cars.map(car => Number(car.price)).filter(Boolean);
  const allYears = cars.map(car => Number(car.year)).filter(Boolean);
  const minPrice = Math.min(...allPrices, 0);
  const maxPrice = Math.max(...allPrices, 9999999);
  const minYear = Math.min(...allYears, 1900);
  const maxYear = Math.max(...allYears, new Date().getFullYear());

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange || [minPrice, maxPrice],
      yearRange: prev.yearRange || [minYear, maxYear],
    }));
    // eslint-disable-next-line
  }, [minPrice, maxPrice, minYear, maxYear]);

  const handleCheckbox = (field, value) => {
    setFilters(prev => {
      const prevArr = prev[field] || [];
      return {
        ...prev,
        [field]: prevArr.includes(value)
          ? prevArr.filter(v => v !== value)
          : [...prevArr, value]
      };
    });
  };

  const handleSlider = (field, range) => {
    setFilters(prev => ({ ...prev, [field]: range }));
  };

  const handleFeatured = () => {
    setFilters(prev => ({ ...prev, featured: !prev.featured }));
  };

  const countFor = (field, value) => {
    if (field === 'fuelType') {
      return cars.filter(car => car.engine && car.engine.fuelType === value).length;
    }
    return cars.filter(car => car[field] === value).length;
  };

  return (
    <aside className={styles.filtersPanel}>
      <div className={styles.filtersHeader}>
        <h2>Filters</h2>
        <button className={styles.resetFiltersButton} onClick={onReset}>Reset</button>
      </div>
      {/* Make */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Make</div>
        {makes.map(make => (
          <label key={make} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.make?.includes(make)}
              onChange={() => handleCheckbox('make', make)}
            />
            <span className={styles.filterOptionText}>{make}</span>
            <span className={styles.filterCount}>{countFor('make', make)}</span>
          </label>
        ))}
      </div>
      <hr className={styles.filterDivider} />
      {/* Body Style */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Body Style</div>
        {(bodyStyles.length > 0 ? bodyStyles : ['']).map(style => (
          <label key={style || 'none'} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.bodyStyle?.includes(style)}
              onChange={() => handleCheckbox('bodyStyle', style)}
            />
            <span className={styles.filterOptionText}>{style || <em>None</em>}</span>
            <span className={styles.filterCount}>{countFor('bodyStyle', style)}</span>
          </label>
        ))}
      </div>
      <hr className={styles.filterDivider} />
      {/* Fuel Type */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Fuel Type</div>
        {ALL_FUEL_TYPES.map(fuel => (
          <label key={fuel} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.fuelType?.includes(fuel)}
              onChange={() => handleCheckbox('fuelType', fuel)}
            />
            <span className={styles.filterOptionText}>{fuel}</span>
            <span className={styles.filterCount}>{countFor('fuelType', fuel)}</span>
          </label>
        ))}
      </div>
      <hr className={styles.filterDivider} />
      {/* Status */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Status</div>
        {ALL_STATUSES.map(status => (
          <label key={status} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.status?.includes(status)}
              onChange={() => handleCheckbox('status', status)}
            />
            <span className={styles.filterOptionText}>{status}</span>
            <span className={styles.filterCount}>{countFor('status', status)}</span>
          </label>
        ))}
      </div>
      <hr className={styles.filterDivider} />
      {/* Featured */}
      <div className={styles.filterGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={!!filters.featured}
            onChange={handleFeatured}
          />
          <span className={styles.filterOptionText}>Featured Only</span>
          <span className={styles.filterCount}></span>
        </label>
      </div>
      <hr className={styles.filterDivider} />
      {/* Price Slider */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Price Range</div>
        <div className={styles.sliderGroup}>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={filters.priceRange ? filters.priceRange[0] : minPrice}
            onChange={e => handleSlider('priceRange', [Number(e.target.value), filters.priceRange ? filters.priceRange[1] : maxPrice])}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={filters.priceRange ? filters.priceRange[1] : maxPrice}
            onChange={e => handleSlider('priceRange', [filters.priceRange ? filters.priceRange[0] : minPrice, Number(e.target.value)])}
          />
          <div className={styles.sliderLabels}>
            <span>${filters.priceRange ? filters.priceRange[0] : minPrice}</span>
            <span>${filters.priceRange ? filters.priceRange[1] : maxPrice}</span>
          </div>
        </div>
      </div>
      <hr className={styles.filterDivider} />
      {/* Year Slider */}
      <div className={styles.filterGroup}>
        <div className={styles.filterLabel}>Year Range</div>
        <div className={styles.sliderGroup}>
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={filters.yearRange ? filters.yearRange[0] : minYear}
            onChange={e => handleSlider('yearRange', [Number(e.target.value), filters.yearRange ? filters.yearRange[1] : maxYear])}
          />
          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={filters.yearRange ? filters.yearRange[1] : maxYear}
            onChange={e => handleSlider('yearRange', [filters.yearRange ? filters.yearRange[0] : minYear, Number(e.target.value)])}
          />
          <div className={styles.sliderLabels}>
            <span>{filters.yearRange ? filters.yearRange[0] : minYear}</span>
            <span>{filters.yearRange ? filters.yearRange[1] : maxYear}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CarFilters;
