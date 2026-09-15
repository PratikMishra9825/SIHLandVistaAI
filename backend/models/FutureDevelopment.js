import mongoose from 'mongoose';

const FutureDevelopmentSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'LandParcel', required: true },
  developmentType: { type: String, required: true }, // e.g. Highway, Metro, Industrial Corridor
  title: { type: String, required: true },
  distanceKm: { type: Number, required: true },
  direction: { type: String, default: 'North-East' },
  expectedImpact: { type: String, required: true },
  sourceType: {
    type: String,
    enum: ['verified', 'demo', 'AI_forecast'],
    default: 'demo'
  },
  confidence: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
  status: { type: String, default: 'Proposed' }
});

export default mongoose.models.FutureDevelopment || mongoose.model('FutureDevelopment', FutureDevelopmentSchema);
