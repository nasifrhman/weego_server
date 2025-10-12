const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    planName: { type: String,enum: ['Sport Pro','Elite'] ,required: true },
    nutritionTracker: { type: Boolean, default: false},
    runningTracker: { type: Boolean, default: false},
    price: { type: Number, required: true },
    stripePriceId: { type: String, required: true }
}, { timestamps: true });


module.exports = mongoose.model('Subscription', subscriptionSchema);