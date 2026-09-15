import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

// Generate / Record full Land Action Plan report
router.post('/', async (req, res) => {
  try {
    const reportData = req.body;
    try {
      const report = await Report.create(reportData);
      return res.status(201).json({ success: true, data: report, message: 'Report generated successfully.' });
    } catch (dbErr) {
      return res.status(201).json({
        success: true,
        data: { ...reportData, _id: 'rep-' + Date.now(), generatedAt: new Date() },
        mode: 'DEMO_MODE',
        message: 'Report created in demo session mode.'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
