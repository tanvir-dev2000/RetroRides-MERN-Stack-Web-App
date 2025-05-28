const asyncHandler = require('express-async-handler');
const Car = require('../models/carModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');


// @desc    Get overview statistics for the admin dashboard
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardOverviewStats = asyncHandler(async (req, res) => {
  try {
    const totalCars = await Car.countDocuments({});
    const totalUsers = await User.countDocuments({}); 

    res.json({
      totalCars,
      totalUsers,
      completedSales: 0, 
    });
  } catch (error) {
    console.error("Error fetching dashboard overview stats:", error);
    res.status(500).json({ message: "Server error fetching dashboard stats" });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id, '-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});


const updateUserById = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phoneNumber, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { firstName, lastName, email, phoneNumber, address },
    { new: true, runValidators: true, select: '-password' }
  );
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});


const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted successfully' });
});


// --- ADD THIS: Get all transactions with user and car info ---
const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({})
    .populate('user', 'firstName lastName email phoneNumber address createdAt')
    .populate('cars.car', 'make model year');
  res.json(transactions);
});

module.exports = {
  getDashboardOverviewStats,
  getAllUsers,
  getAllTransactions,
  getUserById,
  updateUserById,
  deleteUserById,
};
