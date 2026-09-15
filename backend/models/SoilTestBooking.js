import mongoose from 'mongoose';

const SoilTestBookingSchema = new mongoose.Schema({
  landId: { type: String, default: 'parcel-user' },
  parcelName: { type: String, default: 'Registered Land Parcel' },
  userId: { type: String, default: 'user-default' },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  userEmail: { type: String },
  serviceType: {
    type: String,
    enum: [
      'Comprehensive Soil Lab & Land Inspection',
      'Agronomy & Irrigation Feasibility Study',
      'Solar Feasibility & Grid Substation Inspection'
    ],
    default: 'Comprehensive Soil Lab & Land Inspection'
  },
  locationCoordinates: {
    type: [Number], // [lng, lat]
    required: true
  },
  locationAddress: { type: String, default: 'Confirmed Cadastre Location' },
  scheduledDate: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  status: {
    type: String,
    enum: [
      'REQUESTED',
      'CONFIRMED',
      'EXPERT_ASSIGNED',
      'ON_THE_WAY',
      'VISIT_COMPLETED',
      'REPORT_READY',
      'CANCELLED'
    ],
    default: 'CONFIRMED'
  },
  assignedExpert: {
    id: { type: String, default: 'exp-01' },
    name: { type: String, default: 'Dr. Ramesh Patil' },
    qualification: { type: String, default: 'M.Sc. (Agri) Soil Science & Agronomy' },
    phone: { type: String, default: '+91 98220 44102' },
    rating: { type: Number, default: 4.9 },
    avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' }
  },
  priceRupees: { type: Number, default: 1499 },
  paymentStatus: { type: String, enum: ['PAID', 'PENDING', 'DEMO_VERIFIED'], default: 'DEMO_VERIFIED' },
  paymentMethod: { type: String, default: 'UPI / Demo Test Gateway' },
  userNotes: { type: String },
  inspectionReport: {
    reportId: String,
    submittedAt: Date,
    labCertificateNo: String,
    ph: Number,
    nitrogenKgHa: Number,
    phosphorusKgHa: Number,
    potassiumKgHa: Number,
    organicCarbonPercent: Number,
    electricalConductivity: Number,
    waterTableDepthMeters: Number,
    waterQuality: String,
    agronomistSummary: String,
    recommendedCrops: [String],
    confidenceScore: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.SoilTestBooking || mongoose.model('SoilTestBooking', SoilTestBookingSchema);
