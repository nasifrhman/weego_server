const mongoose = require('mongoose');

const staticContentSchema = new mongoose.Schema({
  type: { type: String, enum: ['privacy-policy', 'terms-of-condition', 'refund-policy', 'about-us'], default: 'privacy-policy' },
  content: { type: {
    en: {type: String, required: false},
    es: {type: String, required: false}
  }, required: true },
});

module.exports = mongoose.model('StaticContent', staticContentSchema);