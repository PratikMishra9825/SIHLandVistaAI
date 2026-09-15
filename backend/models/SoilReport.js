import mongoose from 'mongoose';

const SoilReportSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'LandParcel', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pH: { type: Number, required: true },
  nitrogen: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  phosphorus: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  potassium: { type: String, enum: ['Low', 'Medium', 'High'], default: 'High' },
  moisture: { type: Number },
  organicCarbon: { type: Number },
  electricalConductivity: { type: Number },
  soilType: { type: String },
  source: { type: String, default: 'Soil Health Card' },
  documentUrl: { type: String },
  verificationStatus: {
    type: String,
    enum: ['uploaded', 'OCR_PROCESSED', 'expert_verified'],
    default: 'uploaded'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SoilReport || mongoose.model('SoilReport', SoilReportSchema);
