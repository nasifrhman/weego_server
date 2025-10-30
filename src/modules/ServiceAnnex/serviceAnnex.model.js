const mongoose = require("mongoose");

const ServiceAnnexSchema = new mongoose.Schema({
    reason : { type: String, required: true },
    category : { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    providor : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contractor : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description : { type: String, required: true },
    cost : { type: Number, default: 0  },
    willDoneNow : { type: Boolean, default: false },
    reschedule : { type: Date , required: false },
    status : { type: String, enum: ['pending','completed', 'cancelled'], default: 'pending' },
    paymentStatus : { type: String, enum: ['pending', 'unpaid', 'paid'], default: 'pending' },
},
{ timestamps: true })

module.exports = mongoose.model("ServiceAnnex", ServiceAnnexSchema);