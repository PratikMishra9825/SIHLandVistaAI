import mongoose from 'mongoose';

const CropRecommendationSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'LandParcel', required: true },
  crop: { type: String, required: true },
  season: { type: String, enum: ['Kharif', 'Rabi', 'Zaid', 'Perennial'], required: true },
  sowingPeriod: { type: String, required: true },
  growingPeriod: { type: String, required: true },
  harvestPeriod: { type: String, required: true },
  waterRequirement: { type: String, required: true },
  soilSuitability: { type: String, required: true },
  expectedYield: { type: String, required: true },
  estimatedRevenue: { type: String, required: true },
  risk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' }
});

export default mongoose.models.CropRecommendation || mongoose.model('CropRecommendation', CropRecommendationSchema);
