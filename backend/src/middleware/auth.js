// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Ensure this path is correct
const asyncHandler = require('express-async-handler');

const auth = asyncHandler(async (req, res, next) => {
  let token;
  // console.log('Auth Middleware: Cookies received:', req.cookies); // For debugging

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    console.log('Auth Middleware: No token found.');
    res.status(401);
    throw new Error('No token, authorization denied');
  }

  try { // TRY block for JWT verification and user fetching
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Auth Middleware: Token decoded:', decoded); // For debugging

    // Fetch user and attach to req, excluding password
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log('Auth Middleware: User not found for decoded ID:', decoded.id);
      res.status(401);
      throw new Error('User not found, authorization denied');
    }
    
    // console.log('Auth Middleware: User authenticated:', req.user.email); // For debugging
    next(); // Proceed to the next middleware or route handler if user is found
  } catch (err) { // CATCH block for errors during try
    console.error('Auth Middleware: Token verification or user fetch error:', err.message);
    res.status(401); // Unauthorized
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      throw new Error('Token is not valid or has expired');
    }
    // For other errors (like DB connection issues during findById), this will be caught by asyncHandler
    throw new Error('Not authorized, token processing failed');
  }
});

module.exports = auth;
