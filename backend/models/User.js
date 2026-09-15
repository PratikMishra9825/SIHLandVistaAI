import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['landowner', 'farmer', 'developer', 'government', 'soilExpert', 'consultant', 'admin'],
    default: 'landowner'
  },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: true },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  subscriptionExpiresAt: {
    type: Date,
    default: null
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
