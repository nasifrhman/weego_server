const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    serviceName: { type: String, required: true },
    description: { type: String, required: false },
    priceMin: { type: Number, required: false, default: 0 },
    priceMax: { type: Number, required: false, default: 0 },
    haveTools: { type: Boolean, required: false },
    needTools: [{ type: String, required: false }],
    isDraft: { type: Boolean, default: true },
    estimatedTimeMin: { type: String, required: false },
    estimatedTimeMax: { type: String, required: false },//?
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Service', serviceSchema); 