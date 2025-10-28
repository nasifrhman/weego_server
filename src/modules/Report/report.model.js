const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reportSchema = new Schema({
    reporter: { type: Schema.Types.ObjectId, ref: 'User' },
    targetUser: { type: Schema.Types.ObjectId, ref: 'User' },
    option: { type: String, required: true },
    comment: { type: String, required: false },
    image: [{ type: String, required: false }],
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);