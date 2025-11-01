const mongoose = require('mongoose')

const discountSchema = new mongoose.Schema({
    title: {type: String, required: false},
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    service : { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true},
    discount: { type: Number, default: 0 },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'fixed' },
    discountLimit: { type: Number, required: false},
    userLimit: { type: Number , required: false},
    startDate: { type: Date, required: false},
    endDate: { type: Date, required: false},
},
{
    timestamps: true
})

module.exports = mongoose.model("Discount", discountSchema)