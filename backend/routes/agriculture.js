import express from 'express';
import CropRecommendation from '../models/CropRecommendation.js';

const router = express.Router();

router.get('/crops/:landId', async (req, res) => {
  try {
    const crops = [
      {
        crop: 'Red Onion (Garwa / Late Kharif)',
        season: 'Rabi',
        sowingPeriod: 'Oct - Nov',
        growingPeriod: '120 days',
        harvestPeriod: 'Mar - Apr',
        waterRequirement: '350 mm (Low-Moderate)',
        soilSuitability: 'Medium Black / Loam',
        expectedYield: '110 Quintals / Acre',
        estimatedRevenue: '₹1,65,000 / Acre',
        risk: 'Medium'
      },
      {
        crop: 'Bhagwa Pomegranate (Orchard)',
        season: 'Perennial',
        sowingPeriod: 'Jun - Aug',
        growingPeriod: '12 months',
        harvestPeriod: 'Dec - Feb',
        waterRequirement: '600 mm (Drip Optimized)',
        soilSuitability: 'Semi-Arid Loam',
        expectedYield: '60 Quintals / Acre',
        estimatedRevenue: '₹3,20,000 / Acre',
        risk: 'Medium'
      },
      {
        crop: 'Soybean (JS 335)',
        season: 'Kharif',
        sowingPeriod: 'Jun - Jul',
        growingPeriod: '95 days',
        harvestPeriod: 'Sep - Oct',
        waterRequirement: '450 mm',
        soilSuitability: 'Medium Black',
        expectedYield: '10 Quintals / Acre',
        estimatedRevenue: '₹48,000 / Acre',
        risk: 'Low'
      }
    ];

    res.json({ success: true, landId: req.params.landId, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
