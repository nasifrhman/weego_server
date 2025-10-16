const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privacySchema = new Schema({
    readReceipts: { type: Boolean, default: true },
    ads: { type: Boolean, default: true },
    showName: { type: Boolean, default: true },
    showService: { type: Boolean, default: true },
    isActivePushNotification: { type: Boolean, default: true },
    availabilityOnHoliday: { type: Boolean, default: false },
    currency: { type: String, default: 'USD' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});


module.exports = mongoose.model('Privacy', privacySchema);