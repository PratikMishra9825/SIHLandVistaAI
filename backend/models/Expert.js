import mongoose from 'mongoose';

const ExpertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  address: String,
  district: String,
  state: String,
  rating: { type: Number, default: 4.9 },
  reviewsCount: { type: Number, default: 50 },
  experienceYears: { type: Number, default: 10 },
  services: [String],
  visitingPriceRupees: { type: Number, default: 1200 },
  availability: { type: String, default: 'Tomorrow 10:00 AM' },
  avatarUrl: String,
  phone: String,
  verificationStatus: {
    type: String,
    enum: ['verified', 'pending', 'unverified'],
    default: 'verified'
  }
});

ExpertSchema.index({ location: '2dsphere' });

export default mongoose.models.Expert || mongoose.model('Expert', ExpertSchema);
