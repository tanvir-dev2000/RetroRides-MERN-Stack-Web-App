// backend/src/routes/carRoutes.js
const express = require('express');
const router = express.Router();
const {
  createCar,
  getCars, // This will now use the enhanced version for public listings
  getCarById,
  updateCar,
  deleteCar,
  getAllCarsForAdmin,
  getCarFilterOptions // Import new controller
} = require('../controllers/carController');

// Corrected imports for middleware based on your file structure
const auth = require('../middleware/auth.js'); // Assuming 'protect' is the default export or main function
const { protectAdmin } = require('../middleware/adminAuth.js'); // Assuming 'protectAdmin' is exported

// POST /api/cars - Create a new car (Admin only)
router.post('/', auth, protectAdmin, createCar);

// GET /api/cars - Get all cars with filtering/sorting (Public)
router.get('/', getCars); // This now uses the enhanced getCars

// GET /api/cars/filter-options - Get dynamic options for filters
router.get('/filter-options', getCarFilterOptions);

// GET /api/cars/admin/all - Get all cars for admin panel (Admin only)
router.get('/admin/all', auth, protectAdmin, getAllCarsForAdmin);

// GET /api/cars/:id - Get a single car by ID (Public)
router.get('/:id', getCarById);

// PUT /api/cars/:id - Update a car (Admin only)
router.put('/:id', auth, protectAdmin, updateCar);

// DELETE /api/cars/:id - Delete a car (Admin only)
router.delete('/:id', auth, protectAdmin, deleteCar);

module.exports = router;
