const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const frequentProviderSchema = new Schema({
    contractor: { type: Schema.Types.ObjectId, ref: 'User' },
    provider: { type: Schema.Types.ObjectId, ref: 'User' },
    count: { type: Number, default: 1 },
});

module.exports = mongoose.model('FrequentProvider', frequentProviderSchema);