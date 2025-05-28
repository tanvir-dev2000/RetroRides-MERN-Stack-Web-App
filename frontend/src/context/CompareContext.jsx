import React, { createContext, useContext, useState } from 'react';

// Create the context
const CompareContext = createContext();

// Custom hook for easy access
export const useCompare = () => useContext(CompareContext);

// Provider component
export const CompareProvider = ({ children }) => {
  // Only allow up to 2 cars in the compare list
  const [compareIds, setCompareIds] = useState([]);

  // Add a car to compare (max 2, no duplicates)
  const addToCompare = (carId) => {
    setCompareIds((prev) => {
      if (prev.includes(carId)) return prev;
      if (prev.length === 2) return [prev[1], carId]; // keep only the two most recent
      return [...prev, carId];
    });
  };

  // Remove a car from compare
  const removeFromCompare = (carId) => {
    setCompareIds((prev) => prev.filter(id => id !== carId));
  };

  // Clear all compared cars
  const clearCompare = () => setCompareIds([]);

  return (
    <CompareContext.Provider value={{
      compareIds,
      addToCompare,
      removeFromCompare,
      clearCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
};
