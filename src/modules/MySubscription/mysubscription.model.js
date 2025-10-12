const mongoose = require("mongoose");

const mySubscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    planName: {type: String},
    expiryDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('MySubscription', mySubscriptionSchema);
