const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: [{type : String, required : false}],
    serviceName: { type: String, required: true },
    description: { type: String, required: false },
    priceMin: { type: Number, required: false, default: 0 },
    priceMax: { type: Number, required: false, default: 0 },
    haveTools: { type: Boolean, required: false },
    needTools: [{ type: String, required: false }],
    sell : {type: Number, default: 0},
    offer : {type: Number, default: 0},
    rating : {type: Number, default: 0},
    isDraft: { type: Boolean, default: true },
    estimatedTimeMin: { type: Number, required: false },
    estimatedTimeMax: { type: Number, required: false }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Service', serviceSchema); 