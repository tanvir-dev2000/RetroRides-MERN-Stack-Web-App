// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js'); // Your existing auth middleware
const { registerUser, loginUser, getUserProfile, logoutUser } = require('../controllers/authController.js');

// @desc Register a new user
// @route POST /api/auth/register
router.post('/register', registerUser);

// @desc Authenticate user and get token
// @route POST /api/auth/login
router.post('/login', loginUser);

// @desc Get user profile information (was /user, changed to /profile)
// @route GET /api/auth/profile 
router.get('/profile', auth, getUserProfile); // CHANGED ROUTE PATH

// @desc logout user
// @route POST /api/auth/logout 
router.post('/logout', logoutUser); // Changed from /login to /logout for clarity, ensure controller matches

module.exports = router;
