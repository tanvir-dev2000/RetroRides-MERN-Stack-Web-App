import React, { useEffect, useState } from 'react';
import styles from './CarComparePage.module.css';
import { useCompare } from '../../context/CompareContext';

const featureRows = [
  { label: 'Manufacturer', get: car => car.make || '-' },
  { label: 'Model', get: car => car.model || '-' },
  { label: 'Year', get: car => car.year || '-' },
  { label: 'Price', get: car => car.price ? `$${Number(car.price).toLocaleString()}` : '-' },
  { label: 'Mileage', get: car => car.mileage ? `${car.mileage} mi` : '-' },
  { label: 'Engine', get: car =>
      car.engine?.arrangement
        ? car.engine.cylinders
          ? `${car.engine.arrangement} (${car.engine.cylinders} cylinders)`
          : car.engine.arrangement
        : '-'
  },
];

const CarCard = ({
  car,
  onRemove,
  searchTerm,
  setSearchTerm,
  searchResults,
  searching,
  onSelectCar,
  slotLabel,
}) => (
  <div className={styles.compareCard}>
    {/* Search bar at the top */}
    <div className={styles.compareCardSearchArea}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={`Search for ${slotLabel.toLowerCase()}...`}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {searching && <div className={styles.searchLoading}>Searching...</div>}
      {searchResults.length > 0 && (
        <ul className={styles.searchResults}>
          {searchResults.map(resultCar => (
            <li
              key={resultCar._id}
              className={styles.searchResultItem}
              onClick={() => onSelectCar(resultCar._id)}
            >
              {resultCar.year} {resultCar.make} {resultCar.model}
            </li>
          ))}
        </ul>
      )}
    </div>
    {/* Image */}
    <div className={styles.compareCardImageBox}>
      {car && car.images && car.images.length > 0 ? (
        <img
          src={car.images[0].url}
          alt={car.make + ' ' + car.model}
          className={styles.compareImage}
        />
      ) : (
        <div className={styles.noCompareImage}></div>
      )}
    </div>
    {/* Title */}
    <div className={styles.compareCardTitle}>
      {car
        ? `${car.year} ${car.make} ${car.model}`
        : <span style={{ color: '#bbb' }}>{slotLabel}</span>}
    </div>
    {/* Details */}
    <div className={styles.compareCardDetails}>
      {featureRows.map(({ label, get }) => (
        <div key={label} className={styles.detailRow}>
          <span className={styles.detailLabel}>{label}</span>
          <span className={styles.detailValue}>{car ? get(car) : '-'}</span>
        </div>
      ))}
    </div>
    {/* Remove button at the bottom */}
    {car && (
      <button
        onClick={onRemove}
        className={styles.removeBtnBottom}
        title="Remove from comparison"
        style={{ marginTop: '1.3rem' }}
      >
        Remove
      </button>
    )}
  </div>
);

const CarComparePage = () => {
  const { compareIds, addToCompare, removeFromCompare, clearCompare } = useCompare();

  // For each slot, manage car data, search term, results, searching state
  const [carData, setCarData] = useState([null, null]);
  const [searchTerms, setSearchTerms] = useState(['', '']);
  const [searchResults, setSearchResults] = useState([[], []]);
  const [searching, setSearching] = useState([false, false]);

  // Fetch car data for each slot
  useEffect(() => {
    Promise.all(
      [0, 1].map(i =>
        compareIds[i]
          ? fetch(`/api/cars/${compareIds[i]}`).then(r => r.json())
          : Promise.resolve(null)
      )
    ).then(setCarData);
  }, [compareIds]);

  // Search effect for each slot
  useEffect(() => {
    [0, 1].forEach(i => {
      if (searchTerms[i].length > 1) {
        setSearching(s => {
          const copy = [...s];
          copy[i] = true;
          return copy;
        });
        fetch(`/api/cars?search=${encodeURIComponent(searchTerms[i])}`)
          .then(r => r.json())
          .then(data => {
            setSearchResults(results => {
              const copy = [...results];
              copy[i] = (data.cars || []).filter(car => !compareIds.includes(car._id));
              return copy;
            });
          })
          .finally(() => {
            setSearching(s => {
              const copy = [...s];
              copy[i] = false;
              return copy;
            });
          });
      } else {
        setSearchResults(results => {
          const copy = [...results];
          copy[i] = [];
          return copy;
        });
      }
    });
  }, [searchTerms, compareIds]);

  const handleSelectCar = (slot, carId) => {
    // Replace or add car in slot
    let newIds = [...compareIds];
    newIds[slot] = carId;
    // Remove duplicates
    newIds = newIds.filter((id, idx) => id && newIds.indexOf(id) === idx);
    clearCompare();
    newIds.forEach(id => addToCompare(id));
    setSearchTerms(['', '']);
    setSearchResults([[], []]);
  };

  const handleRemoveCar = slot => {
    if (compareIds[slot]) removeFromCompare(compareIds[slot]);
  };

  return (
    <div className={styles.comparePage}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Compare Classic Beauties</h1>
        <p className={styles.heroSubtitle}>
          Select two vehicles from our curated collection to see how they stack up side-by-side.
        </p>
      </div>
      {/* Cards */}
      <div className={styles.compareCardsRow}>
        {[0, 1].map(i => (
          <CarCard
            key={i}
            car={carData[i]}
            slotLabel={i === 0 ? "Car 1" : "Car 2"}
            onRemove={() => handleRemoveCar(i)}
            searchTerm={searchTerms[i]}
            setSearchTerm={term => setSearchTerms(terms => { const copy = [...terms]; copy[i] = term; return copy; })}
            searchResults={searchResults[i]}
            searching={searching[i]}
            onSelectCar={carId => handleSelectCar(i, carId)}
          />
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button onClick={clearCompare} className={styles.clearBtn}>
          Clear Comparison
        </button>
      </div>
    </div>
  );
};

export default CarComparePage;
