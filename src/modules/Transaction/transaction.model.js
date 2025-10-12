const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: false },
  // transactionId: { type: String, required: false },
  // paymentIntentId: { type: String, required: false },
  paymentMethod: { type: String, required: false },
  amount: { type: Number, required: false },  // Amount in cents (e.g., 1999 means $19.99)
  paymentStatus: { 
    type: String, 
    enum: ['succeeded', 'failed', 'pending', 'trialing'],  // trialing added for handling trials
    required: false 
  },
  invoiceId: { type: String, required: false },
  paymentDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Transaction', transactionSchema);