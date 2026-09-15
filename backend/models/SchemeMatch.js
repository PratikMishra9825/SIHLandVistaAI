import mongoose from 'mongoose';

const SchemeMatchSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'LandParcel', required: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'GovernmentScheme', required: true },
  eligibilityScore: { type: Number, required: true },
  matchedCriteria: [String],
  missingCriteria: [String],
  generatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.SchemeMatch || mongoose.model('SchemeMatch', SchemeMatchSchema);
