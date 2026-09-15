import express from 'express';
import Simulation from '../models/Simulation.js';

const router = express.Router();

// Save simulation scenario
router.post('/', async (req, res) => {
  try {
    const simData = req.body;
    try {
      const simulation = await Simulation.create(simData);
      return res.status(201).json({ success: true, data: simulation });
    } catch (dbErr) {
      return res.status(201).json({
        success: true,
        data: { ...simData, _id: 'sim-' + Date.now() },
        mode: 'DEMO_MODE'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get simulation history for a parcel
router.get('/:landId', async (req, res) => {
  try {
    const sims = await Simulation.find({ landId: req.params.landId }).sort({ createdAt: -1 });
    res.json({ success: true, data: sims });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
