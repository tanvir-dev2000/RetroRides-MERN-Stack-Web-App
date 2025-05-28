const express = require('express');
const router = express.Router();
const { createTransaction, getUserTransactions } = require('../controllers/transactionController');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

router.post('/', createTransaction);
router.get('/my', getUserTransactions);

module.exports = router;
