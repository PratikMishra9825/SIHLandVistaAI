import mongoose from 'mongoose';

const GovernmentSchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: [String],
  benefits: { type: String, required: true },
  requiredDocuments: [String],
  applicableStates: [String],
  applicableLandUses: [String],
  officialSource: { type: String },
  sourceType: {
    type: String,
    enum: ['official', 'demo', 'estimated'],
    default: 'official'
  },
  lastVerified: { type: Date, default: Date.now }
});

export default mongoose.models.GovernmentScheme || mongoose.model('GovernmentScheme', GovernmentSchemeSchema);
