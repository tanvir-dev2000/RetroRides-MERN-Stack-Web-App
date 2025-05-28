// backend/src/controllers/authController.js
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler'); // Add for consistency

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, address, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error('Please enter all required fields: First Name, Last Name, Email, and Password.');
  }

  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    address,
    role: role || 'Buyer', // Default role
  });

  if (user) {
    const token = generateToken(user._id);
    // Set cookie for immediate login after registration
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax', 
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    res.status(201).json({
      message: "User registered successfully. You are now logged in.", // Clear message
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
      },
      token: token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data during registration.');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter email and password.');
  }

  const user = await userModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    res.status(200).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
      },
      token: token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password.');
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  // req.user should be populated by your 'auth' middleware
  if (req.user) {
    const user = await userModel.findById(req.user._id).select('-password'); // Exclude password
    if (user) {
        res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          address: user.address,
          role: user.role,
        });
    } else {
         res.status(404);
         throw new Error('User not found in database (from token).');
    }
  } else {
    res.status(401); // Unauthorized if req.user isn't set
    throw new Error('Not authorized, no user data in request.');
  }
});

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
};
