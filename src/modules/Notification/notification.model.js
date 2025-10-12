const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema({
  targetUser: {type: mongoose.Types.ObjectId, ref:'User', required: false},
  postId: {type: mongoose.Types.ObjectId, ref:'Post', required: false},
  message: { type: String, required: false },
  isRead: { type: Boolean, default: false },
  forAdmin: { type: Boolean, default: false },
}, { timestamps: true });



module.exports = mongoose.model('Notification', notificationSchema);
