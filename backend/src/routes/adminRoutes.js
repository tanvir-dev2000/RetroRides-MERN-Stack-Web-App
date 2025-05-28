const express = require('express');
const router = express.Router();
const {
  getDashboardOverviewStats,
  getAllUsers,
  getAllTransactions,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { protectAdmin } = require('../middleware/adminAuth');

router.use(auth, protectAdmin);

router.get('/dashboard-stats', getDashboardOverviewStats);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUserById);

router.get('/transactions', getAllTransactions);

module.exports = router;
