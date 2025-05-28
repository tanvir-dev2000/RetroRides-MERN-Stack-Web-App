// frontend/src/pages/CarListPage/CarSortDropdown.jsx

import React from 'react';
import styles from './CarSortDropdown.module.css';

const CarSortDropdown = ({ sortOption, setSortOption }) => (
  <select
    className={styles.sortDropdown}
    value={sortOption}
    onChange={e => setSortOption(e.target.value)}
  >
    <option value="custom">Customized</option>
    <option value="make-asc">By Brand (A-Z)</option>
    <option value="make-desc">By Brand (Z-A)</option>
    <option value="year-desc">Newest First</option>
    <option value="year-asc">Oldest First</option>
    <option value="price-asc">Price: Low to High</option>
    <option value="price-desc">Price: High to Low</option>
    <option value="alphabetical-asc">Alphabetical: A-Z</option>
    <option value="alphabetical-desc">Alphabetical: Z-A</option>
  </select>
);

export default CarSortDropdown;
