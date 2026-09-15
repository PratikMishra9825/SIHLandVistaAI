import mongoose from 'mongoose';

const SimulationSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'LandParcel', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scenario: {
    type: String,
    enum: ['balanced', 'profit', 'sustainability', 'social', 'lowRisk', 'future'],
    default: 'balanced'
  },
  priorityWeights: {
    profitability: Number,
    sustainability: Number,
    waterEfficiency: Number,
    socialImpact: Number,
    lowInvestment: Number,
    longTermGrowth: Number,
    lowRisk: Number
  },
  results: {
    topRecommendation: String,
    score: Number,
    comparisonTable: mongoose.Schema.Types.Mixed
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Simulation || mongoose.model('Simulation', SimulationSchema);
