import mongoose from 'mongoose';

const ExpertInspectionReportSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  landId: { type: String, default: 'parcel-user' },
  expertId: { type: String, default: 'exp-01' },
  expertName: { type: String, default: 'Dr. Ramesh Patil' },
  expertTitle: { type: String, default: 'Certified Agricultural Soil Scientist' },
  labCertificateNo: { type: String, default: 'NABL-AGRI-2026-8942' },
  inspectionDate: { type: Date, default: Date.now },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true
  },
  soilParameters: {
    ph: { type: Number, required: true },
    nitrogenKgHa: { type: Number, required: true }, // e.g., 280
    phosphorusKgHa: { type: Number, required: true }, // e.g., 24
    potassiumKgHa: { type: Number, required: true }, // e.g., 320
    organicCarbonPercent: { type: Number, required: true }, // e.g., 0.68%
    electricalConductivityDsM: { type: Number, required: true }, // e.g., 0.42 dS/m
    soilTexture: { type: String, default: 'Medium Deep Black Clayey Alluvial' },
    drainageClass: { type: String, default: 'Well Drained' },
    salinityStatus: { type: String, default: 'Normal (Non-Saline)' },
    soilHealthRating: { type: Number, default: 86 } // 0 - 100
  },
  waterParameters: {
    waterSourceAvailable: { type: Boolean, default: true },
    sourceType: { type: String, default: 'Borewell & Perennial Irrigation Canal' },
    waterTableDepthMeters: { type: Number, default: 18.5 },
    waterQualityTdsPpm: { type: Number, default: 420 },
    irrigationFeasibility: { type: String, default: 'Optimal for Micro-Drip & Cash Crop Cultivation' }
  },
  groundPhotos: [
    {
      url: String,
      caption: String
    }
  ],
  agronomistObservations: { type: String, required: true },
  recommendedCrops: [String],
  fertilizerCorrectionPrescription: { type: String },
  dataConfidenceBonus: { type: Number, default: 25 },
  verifiedBadge: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ExpertInspectionReport || mongoose.model('ExpertInspectionReport', ExpertInspectionReportSchema);
