const mongoose = require('mongoose');   
const Schema = mongoose.Schema;

const serviceManagementSchema = new Schema({
    contructor: { type: Schema.Types.ObjectId, ref: 'User' },
    provider: { type: Schema.Types.ObjectId, ref: 'User' },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    price: { type: Number, default: 0 },
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    cancelationReason: { type: String, required: false },
    description : { type: String, required: false },
    image : { type: String, required: false },
    date : { type: Date, default: Date.now },
    serviceAddress: { type: String, required: false },
    instructions : { type: String, required: false },
    // contact1 : { type: String, required: false },
    // contact2 : { type: String, required: false },
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },

});

module.exports = mongoose.model('ServiceManagement', serviceManagementSchema); 