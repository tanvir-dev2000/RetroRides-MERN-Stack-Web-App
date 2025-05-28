// backend/middleware/adminAuth.js
const asyncHandler = require('express-async-handler'); 

const protectAdmin = asyncHandler(async (req, res, next) => {

  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403); // Forbidden
    throw new Error('Not authorized as an admin. Access denied.');
  }
});

module.exports = { protectAdmin };
