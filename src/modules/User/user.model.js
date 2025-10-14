const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  displayName: { type: String, required: false },
  userName: { type: String, required: false, trim: true },
  email: { type: String, required: false, trim: true },
  phoneNumber: { type: String, required: false, trim: true },
  dob: { type: Date, required: false },
  gender: { type: String, required: false },
  bio: { type: String, required: false },
  contact1: { type: String, required: false },
  contact2: { type: String, required: false },
  image: { type: String, required: false, default: '/uploads/users/user.jpg' },
  verificationImage: { type: String, required: false, default: '/uploads/users/user.jpg' }, //verificationImage
  role: { type: String, enum: ['contractor', 'provider', 'admin'], default: 'contractor' },
  currentRole: { type: String, enum: ['contractor', 'provider'], default: 'contractor' },
  isBan: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  rating: { type: Boolean, default: false },
  review: { type: Boolean, default: false }, 
  responseTime: { type: String, default: false },
  language: [{ type: String, default: false }], 
  availability: [{ type: String, default: false }],
  coverageArea: [{ type: String, default: false }],
  orderCompleted: { type: Number, default: 0 },
  searchAppearence: { type: Number, default: 0 },
  profileViews: { type: Number, default: 0 },
  orderCanceled: { type: Number, default: 0 },
  totalEarning: { type: Number, default: 0 },
  password: { type: String, required: false, select: 0, set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)), },
},
  {
    timestamps: true
  }
);


 
module.exports = mongoose.model('User', userSchema);