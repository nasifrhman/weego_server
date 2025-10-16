const mongoose = require("mongoose");

const localizedStringSchema = new mongoose.Schema({
  en: { type: String, required: false },
  es: { type: String, required: false }
}, { _id: false });

const notificationSchema = new mongoose.Schema({
  link: { type: String, required: false },
  targetUser: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
  target: {
    type: String,
    enum: ['user-business', 'business-admin', 'user', 'business', 'admin']
  },
  title: { type: localizedStringSchema, required: false },
  message: { type: localizedStringSchema, required: true },
  postalCode: { type: String, required: false },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });



module.exports = mongoose.model('Notification', notificationSchema);
