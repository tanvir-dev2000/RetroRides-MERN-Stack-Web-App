const Transaction = require('../models/transactionModel');
const Car = require('../models/carModel');

exports.createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cars } = req.body; // [{ car: carId, priceAtPurchase }]
    const totalAmount = cars.reduce((sum, item) => sum + item.priceAtPurchase, 0);

    const transaction = new Transaction({
      user: userId,
      cars,
      totalAmount,
      // transactionId will be auto-generated
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId }).populate('cars.car');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
