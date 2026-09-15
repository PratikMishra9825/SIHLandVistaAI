import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  landId: { type: mongoose.Schema.Types.ObjectId, ref: 'LandParcel', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportType: {
    type: String,
    enum: ['FULL_ACTION_PLAN', 'SOIL_HEALTH_SUMMARY', 'GOVERNMENT_INVESTOR_BRIEF'],
    default: 'FULL_ACTION_PLAN'
  },
  recommendations: mongoose.Schema.Types.Mixed,
  masterScore: Number,
  generatedAt: { type: Date, default: Date.now },
  fileUrl: String
});

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
