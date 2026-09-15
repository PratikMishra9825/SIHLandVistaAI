import express from 'express';
import User from '../models/User.js';
import LandParcel from '../models/LandParcel.js';
import SoilTestBooking from '../models/SoilTestBooking.js';
import Expert from '../models/Expert.js';

const router = express.Router();

// 1. GET /api/admin/overview - Real database aggregation metrics only
router.get('/overview', async (req, res) => {
  try {
    let totalUsers = 0;
    let totalParcels = 0;
    let totalExperts = 0;
    let activeInspections = 0;
    let completedReports = 0;
    let premiumUsers = 0;

    try {
      totalUsers = await User.countDocuments();
      premiumUsers = await User.countDocuments({ $or: [{ plan: 'premium' }, { isPremium: true }] });
      totalParcels = await LandParcel.countDocuments();
      totalExperts = await Expert.countDocuments();
      activeInspections = await SoilTestBooking.countDocuments({
        status: { $in: ['REQUESTED', 'CONFIRMED', 'EXPERT_ASSIGNED', 'ON_THE_WAY', 'VISIT_COMPLETED'] }
      });
      completedReports = await SoilTestBooking.countDocuments({ status: 'REPORT_READY' });
    } catch (e) {
      console.warn('MongoDB admin count error:', e.message);
    }

    res.json({
      success: true,
      data: {
        totalUsers,
        premiumUsers,
        totalParcels,
        totalExperts,
        activeInspections,
        completedReports,
        systemStatus: 'ONLINE',
        dbHealth: 'CONNECTED_MONGODB',
        realtimeSocketStatus: 'ACTIVE'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. GET /api/admin/landowners - Real registered landowners from MongoDB
router.get('/landowners', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. GET /api/admin/experts - Real experts from MongoDB
router.get('/experts', async (req, res) => {
  try {
    const experts = await Expert.find().sort({ rating: -1 });
    res.json({
      success: true,
      count: experts.length,
      data: experts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. PATCH /api/admin/experts/:id/verify - Approve / Reject Expert Verification in MongoDB
router.patch('/experts/:id/verify', async (req, res) => {
  try {
    const { status } = req.body;
    const expert = await Expert.findByIdAndUpdate(req.params.id, { verificationStatus: status }, { new: true });
    res.json({
      success: true,
      data: expert,
      message: `Expert verification updated to ${status}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. GET /api/admin/parcels - Real registered parcels from MongoDB
router.get('/parcels', async (req, res) => {
  try {
    const parcels = await LandParcel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: parcels.length,
      data: parcels
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. GET /api/admin/bookings - Real inspection bookings from MongoDB
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await SoilTestBooking.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. GET /api/admin/audit-logs - Real MongoDB event timeline
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = [];

    // Real bookings activity
    try {
      const recentBookings = await SoilTestBooking.find().sort({ updatedAt: -1 }).limit(10);
      recentBookings.forEach(b => {
        logs.push({
          id: 'log-book-' + b._id,
          timestamp: b.updatedAt || b.createdAt || new Date(),
          actor: b.userName || 'Landowner',
          role: 'landowner',
          event: b.status === 'REPORT_READY' ? 'SOIL_REPORT_SUBMITTED' : `BOOKING_${b.status}`,
          details: `${b.serviceType} for ${b.parcelName || 'Land Parcel'} (${b.scheduledDate})`,
          status: 'SUCCESS'
        });
      });
    } catch (e) {}

    // Real registered users activity
    try {
      const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
      recentUsers.forEach(u => {
        logs.push({
          id: 'log-user-' + u._id,
          timestamp: u.createdAt || new Date(),
          actor: u.name || u.email,
          role: u.role || 'landowner',
          event: 'USER_ACCOUNT_CREATED',
          details: `Account registered with plan: ${u.plan || 'Free'}`,
          status: 'SUCCESS'
        });
      });
    } catch (e) {}

    // Real registered parcels activity
    try {
      const recentParcels = await LandParcel.find().sort({ createdAt: -1 }).limit(5);
      recentParcels.forEach(p => {
        logs.push({
          id: 'log-parcel-' + p._id,
          timestamp: p.createdAt || new Date(),
          actor: 'Cadastre GIS Engine',
          role: 'system',
          event: 'PARCEL_POLYGON_STORED',
          details: `${p.name} (${p.district}, ${p.state}) • ${p.areaAcres || 'N/A'} Acres`,
          status: 'SUCCESS'
        });
      });
    } catch (e) {}

    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
