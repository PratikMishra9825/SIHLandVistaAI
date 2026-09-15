import express from 'express';
import FutureDevelopment from '../models/FutureDevelopment.js';

const router = express.Router();

router.get('/:landId', async (req, res) => {
  try {
    const futureDevelopments = [
      {
        developmentType: 'Power Infrastructure',
        title: 'Solapur-Pune Green Energy Transmission Line Expansion',
        distanceKm: 2.8,
        direction: 'North-West',
        expectedImpact: 'Direct high-voltage grid feed-in point with 40% reduced transmission loss.',
        sourceType: 'verified',
        confidence: 'High',
        status: 'Approved / Under Construction'
      },
      {
        developmentType: 'Highway',
        title: 'Surat-Chennai Expressway Node',
        distanceKm: 4.2,
        direction: 'South',
        expectedImpact: 'Rapid freight connectivity to Mumbai and Hyderabad transit hubs.',
        sourceType: 'demo',
        confidence: 'High',
        status: 'Proposed Corridor'
      },
      {
        developmentType: 'Logistics Park',
        title: 'Solapur Agro-Logistics Cluster Phase 2',
        distanceKm: 6.5,
        direction: 'East',
        expectedImpact: 'Higher demand for cold storage and onion sorting hubs.',
        sourceType: 'AI_forecast',
        confidence: 'Medium',
        status: 'AI Forecasted Growth Zone'
      }
    ];

    res.json({
      success: true,
      landId: req.params.landId,
      currentPotential: 78,
      futurePotential: 91,
      developments: futureDevelopments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
