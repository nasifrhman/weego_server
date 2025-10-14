 const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
}, { timestamps: true });

module.exports = mongoose.model('Favourite', favouriteSchema);