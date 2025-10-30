const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullAddress: { type: String, required: true },
    street: { type: String, required: true },
    exterior: { type: String, required: true },
    interior: { type: String, required: false },
    zipCode: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    instructions: { type: String, required: false },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Address', folderSchema);