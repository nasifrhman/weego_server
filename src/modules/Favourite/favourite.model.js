 const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
}, { timestamps: true });

module.exports = mongoose.model('Favourite', favouriteSchema);