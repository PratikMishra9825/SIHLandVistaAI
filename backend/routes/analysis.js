import express from 'express';
import Recommendation from '../models/Recommendation.js';
import LandParcel from '../models/LandParcel.js';
import { runMultiCriteriaAnalysis } from '../services/recommendationEngine.js';

const router = express.Router();

// Analyze land parcel dynamically and generate AI recommendations
router.post('/analyze/:landId', async (req, res) => {
  try {
    const { landId } = req.params;
    const { priorities, parcelData } = req.body;

    let targetParcel = parcelData;

    if (!targetParcel && landId && landId !== 'null' && landId !== 'undefined') {
      try {
        targetParcel = await LandParcel.findById(landId);
      } catch (e) {
        // Not found in DB, fallback to request body
      }
    }

    // If still not available, use basic default parcel envelope
    if (!targetParcel) {
      targetParcel = {
        id: landId,
        areaAcres: 10.0,
        lat: 17.6599,
        lng: 75.9064,
        soil: { healthScore: 72, pH: 7.1, soilType: 'Medium Black' },
        water: { nearestWaterBodyKm: 1.5, rainfallAnnual: 580, availability: 'Medium' },
        infrastructure: { slopeDegrees: 2.5, solarRadiationKWh: 5.6, gridDistanceKm: 1.2, roadDistanceMeters: 400 }
      };
    }

    const analysisResult = runMultiCriteriaAnalysis(targetParcel, priorities);

    try {
      if (landId && landId.match(/^[0-9a-fA-F]{24}$/)) {
        await Recommendation.create({
          landId,
          parcelId: targetParcel.id || targetParcel._id,
          analysisId: analysisResult.analysisId,
          topRecommendation: analysisResult.topRecommendation,
          recommendations: analysisResult.recommendations,
          userPriorityWeights: priorities || {},
          overallScore: analysisResult.topRecommendation?.score || 88,
          confidenceScore: analysisResult.confidenceScore,
          confidence: `${analysisResult.confidenceLevel} (${analysisResult.confidenceScore}%)`,
          confidenceLevel: analysisResult.confidenceLevel,
          surroundingPatterns: analysisResult.surroundingPatterns,
          bufferBreakdown: analysisResult.bufferBreakdown,
          proximityMatrix: analysisResult.proximityMatrix,
          saturationMetrics: analysisResult.saturationMetrics,
          decisionFactors: analysisResult.decisionFactors,
          whyTopRanked: analysisResult.whyTopRanked,
          whyAlternativesRankedLower: analysisResult.whyAlternativesRankedLower,
          whatChangedRecommendation: analysisResult.whatChangedRecommendation,
          nextSteps: analysisResult.nextSteps,
          ragEvidence: analysisResult.ragEvidence,
          dataSources: ['ISRO Bhuvan LULC', 'SRTM 30m DEM', 'MSEDCL Grid Substation', 'National Water Resources', 'MNRE / PMKSY / NLP RAG'],
          aiMode: 'SURROUNDING_AWARE_RAG_MCDA'
        });
      }
    } catch (dbErr) {
      // Continue even if DB write fails
    }

    return res.json({ success: true, data: analysisResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Direct dynamic analysis endpoint without required DB landId
router.post('/analyze', async (req, res) => {
  try {
    const { parcel, priorities } = req.body;
    if (!parcel) {
      return res.status(400).json({ success: false, message: 'Parcel data required' });
    }
    const analysisResult = runMultiCriteriaAnalysis(parcel, priorities);
    return res.json({ success: true, data: analysisResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get existing recommendations
router.get('/recommendations/:landId', async (req, res) => {
  try {
    const rec = await Recommendation.findOne({ landId: req.params.landId }).sort({ generatedAt: -1 });
    res.json({ success: true, data: rec });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
