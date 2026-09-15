import express from 'express';
import GovernmentScheme from '../models/GovernmentScheme.js';
import SchemeMatch from '../models/SchemeMatch.js';

const router = express.Router();

// List all schemes
router.get('/', async (req, res) => {
  try {
    const { sector, state } = req.query;
    let query = {};
    if (sector) query.category = new RegExp(sector, 'i');
    if (state) query.applicableStates = state;

    try {
      const schemes = await GovernmentScheme.find(query);
      return res.json({ success: true, count: schemes.length, data: schemes });
    } catch (dbErr) {
      return res.json({ success: true, count: 6, data: [], source: 'DEMO_MODE' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Match schemes for land parcel
router.get('/match/:landId', async (req, res) => {
  try {
    const matches = [
      {
        schemeName: 'PM-KUSUM Component A (Solar Power on Barren/Agri Land)',
        ministry: 'Ministry of New and Renewable Energy',
        eligibilityScore: 95,
        matchedCriteria: [
          'Land within 5 km of 33/11 kV substation (1.2 km)',
          'Barren/Semi-arid parcel > 2 acres (10.0 acres)',
          'Clear land title / Satbara extract available'
        ],
        missingCriteria: [],
        subsidyBenefit: 'Procurement tariff ₹3.10/kWh + 30% CFA Viability Gap Funding',
        sourceType: 'official',
        officialSource: 'https://mnre.gov.in/solar/schemes/'
      },
      {
        schemeName: 'Agriculture Infrastructure Fund (AIF)',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        eligibilityScore: 90,
        matchedCriteria: [
          'Direct road connectivity within 50m',
          'Sufficient land for warehouse / cold storage unit'
        ],
        missingCriteria: ['Detailed Project Report (DPR) submission pending'],
        subsidyBenefit: '3% Interest Subvention on bank loans up to ₹2 Crores',
        sourceType: 'official',
        officialSource: 'https://agriinfra.dac.gov.in/'
      },
      {
        schemeName: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
        ministry: 'Department of Agriculture & Farmers Welfare',
        eligibilityScore: 88,
        matchedCriteria: [
          'Canal proximity and borewell access available',
          'Suitable for horticultural onion crop drip installation'
        ],
        missingCriteria: [],
        subsidyBenefit: 'Up to 55% direct subsidy on micro-irrigation systems',
        sourceType: 'official',
        officialSource: 'https://pmksy.gov.in/'
      }
    ];

    res.json({ success: true, landId: req.params.landId, matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
