const mongoose = require('mongoose');

// Helper function to generate a unique transaction ID
function generateTransactionId(userId) {
  // Example: TX-USERID-YYYYMMDDHHMMSS-RANDOM
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const dateStr = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('');
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `TX-${userId.toString().slice(-4)}-${dateStr}-${random}`;
}

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cars: [
    {
      car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
      },
      priceAtPurchase: {
        type: Number,
        required: true,
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: 'Mock Payment',
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Completed',
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  notes: String,
});

// Before saving, generate a unique transactionId if not present
TransactionSchema.pre('validate', async function(next) {
  if (!this.transactionId) {
    let unique = false;
    let tryCount = 0;
    while (!unique && tryCount < 5) {
      const id = generateTransactionId(this.user || '0000');
      const exists = await mongoose.models.Transaction.findOne({ transactionId: id });
      if (!exists) {
        this.transactionId = id;
        unique = true;
      }
      tryCount++;
    }
    if (!unique) {
      return next(new Error('Failed to generate unique transaction ID'));
    }
  }
  next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
