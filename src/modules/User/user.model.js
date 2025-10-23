const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  fullName: { type: String, required: false },
  userName: { type: String, required: false, trim: true, unique: true },
  email: { type: String, required: false, trim: true },
  phoneNumber: { type: String, default: '' },
  dob: { type: Date, required: false },
  gender: { type: String, default: '' },
  bio: { type: String, default: '' },
  contact1: { type: String, default: '' },
  contact2: { type: String, default: '' },
  image: { type: String, required: false, default: '/uploads/users/user.jpg' },
  // verificationImage: { type: String, required: false },
  role: [{ type: String, enum: ['contractor', 'provider', 'admin'], default: 'contractor' }],
  currentRole: { type: String, enum: ['contractor', 'provider', 'admin'], default: 'contractor' },
  isAdmin: { type: Boolean, default: false },
  isBan: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  review: { type: Number, default: 0 },
  responseTime: { type: String, default: false },
  language: { type: String },
  currency: { type: String, default: 'USD' },
  availability: [{ type: String, default: false }],
  coverageArea: [{ type: String, default: false }],
  orderCompleted: { type: Number, default: 0 },
  searchAppearence: { type: Number, default: 0 },
  profileViews: { type: Number, default: 0 },
  orderCanceled: { type: Number, default: 0 },
  totalEarning: { type: Number, default: 0 },
  password: { type: String, required: false },
},
  {
    timestamps: true
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);