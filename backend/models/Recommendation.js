import mongoose from 'mongoose';

const RecommendationItemSchema = new mongoose.Schema({
  useType: { type: String },
  type: { type: String }, // backwards compatibility
  title: { type: String, required: true },
  category: String,
  icon: String,
  score: { type: Number, required: true },
  suitabilityScore: Number,
  landSuitabilityScore: Number,
  surroundingSuitabilityScore: Number,
  opportunityScore: Number,
  infrastructureScore: Number,
  economicScore: { type: Number, default: 85 },
  sustainabilityScore: { type: Number, default: 90 },
  socialScore: { type: Number, default: 70 },
  ragEvidenceScore: Number,
  saturationPenalty: { type: Number, default: 0 },
  constraintPenalty: { type: Number, default: 0 },
  riskPenalty: { type: Number, default: 0 },
  constraintStatus: { type: String, default: 'ELIGIBLE' },
  appliedRules: [String],
  evidenceList: [mongoose.Schema.Types.Mixed],
  reasons: [String],
  benefits: [String],
  risks: [String],
  requirements: [String],
  economics: mongoose.Schema.Types.Mixed
});

const RecommendationSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'LandParcel' },
  parcelId: String,
  analysisId: String,
  generatedAt: { type: Date, default: Date.now },
  topRecommendation: RecommendationItemSchema,
  recommendations: [RecommendationItemSchema],
  userPriorityWeights: {
    profitability: Number,
    sustainability: Number,
    waterEfficiency: Number,
    socialImpact: Number,
    lowInvestment: Number,
    longTermGrowth: Number,
    lowRisk: Number
  },
  overallScore: { type: Number, required: true },
  confidenceScore: Number,
  confidence: { type: String, default: 'High (92%)' },
  confidenceLevel: { type: String, default: 'High' },
  surroundingPatterns: {
    dominantPattern: String,
    patternDescription: String,
    composition: mongoose.Schema.Types.Mixed
  },
  bufferBreakdown: mongoose.Schema.Types.Mixed,
  proximityMatrix: [mongoose.Schema.Types.Mixed],
  saturationMetrics: mongoose.Schema.Types.Mixed,
  decisionFactors: [mongoose.Schema.Types.Mixed],
  whyTopRanked: [String],
  whyAlternativesRankedLower: [mongoose.Schema.Types.Mixed],
  whatChangedRecommendation: [String],
  nextSteps: [String],
  ragEvidence: [mongoose.Schema.Types.Mixed],
  dataSources: [String],
  aiMode: { type: String, default: 'SURROUNDING_AWARE_RAG_MCDA' }
});

export default mongoose.models.Recommendation || mongoose.model('Recommendation', RecommendationSchema);
