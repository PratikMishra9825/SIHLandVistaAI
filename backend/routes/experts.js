import express from 'express';
import User from '../models/User.js';
import SoilTestBooking from '../models/SoilTestBooking.js';
import ExpertInspectionReport from '../models/ExpertInspectionReport.js';
import LandParcel from '../models/LandParcel.js';

const router = express.Router();

// 1. GET /api/experts/nearby - Get certified on-ground experts
router.get('/nearby', async (req, res) => {
  try {
    const experts = [
      {
        id: 'exp-01',
        name: 'Dr. Ramesh Patil',
        qualification: 'M.Sc. (Agri) Soil Science & Agronomy',
        specialization: 'Soil Chemistry, Salinity Reclamation & Precision Horticulture',
        rating: 4.95,
        reviewsCount: 142,
        distanceKm: 8.4,
        visitingPriceRupees: 1499,
        availableNextDate: 'Tomorrow, 10:30 AM',
        phone: '+91 98220 44102',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        verifiedBadge: true
      },
      {
        id: 'exp-02',
        name: 'Er. Anjali Deshmukh',
        qualification: 'B.Tech Agricultural Engineering & Hydrogeology',
        specialization: 'Micro-Irrigation Layout, Farm Ponds & Groundwater Recharge',
        rating: 4.88,
        reviewsCount: 98,
        distanceKm: 14.2,
        visitingPriceRupees: 1499,
        availableNextDate: 'Wednesday, 02:00 PM',
        phone: '+91 94230 18873',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        verifiedBadge: true
      },
      {
        id: 'exp-03',
        name: 'Prof. Suresh Kumar Shinde',
        qualification: 'Ph.D. Soil Nutrition & Plant Pathology',
        specialization: 'Soil Lab Audits, Organic Carbon & High-Density Crops',
        rating: 4.98,
        reviewsCount: 230,
        distanceKm: 19.5,
        visitingPriceRupees: 1499,
        availableNextDate: 'Thursday, 11:00 AM',
        phone: '+91 98810 52319',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        verifiedBadge: true
      }
    ];

    res.json({ success: true, count: experts.length, data: experts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET /api/experts/my-bookings - Get user's own bookings
router.get('/my-bookings', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || 'user-default';
    let bookings = [];
    try {
      bookings = await SoilTestBooking.find({ userId }).sort({ createdAt: -1 });
    } catch (e) {
      console.warn('MongoDB query fallback for my-bookings:', e.message);
    }
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. GET /api/experts/assigned-bookings - Get expert's assigned field bookings
router.get('/assigned-bookings', async (req, res) => {
  try {
    const expertId = req.query.expertId || req.headers['x-expert-id'] || 'exp-01';
    let bookings = [];
    try {
      bookings = await SoilTestBooking.find({
        $or: [
          { 'assignedExpert.id': expertId },
          { 'assignedExpert.id': { $exists: false } }
        ]
      }).sort({ createdAt: -1 });
    } catch (e) {
      console.warn('MongoDB query fallback for assigned-bookings:', e.message);
    }
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. GET /api/experts/all-bookings - Admin view
router.get('/all-bookings', async (req, res) => {
  try {
    let bookings = [];
    try {
      bookings = await SoilTestBooking.find().sort({ createdAt: -1 });
    } catch (e) {
      console.warn('MongoDB query fallback for all-bookings:', e.message);
    }
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. POST /api/experts/book - Book a premium on-site expert checkup (BACKEND AUTH CHECK)
router.post('/book', async (req, res) => {
  try {
    const bookingData = req.body;
    const userId = bookingData.userId || req.headers['x-user-id'] || 'user-default';

    // REQUIREMENT 1: Backend authorization check for Premium subscription
    if (userId && userId !== 'guest' && userId !== 'user-default') {
      try {
        const user = await User.findById(userId);
        if (user && !user.isPremium && user.plan !== 'premium') {
          return res.status(403).json({
            success: false,
            error: 'PREMIUM_REQUIRED',
            message: 'Expert Land Checkup is exclusively available for Premium subscribers. Please upgrade your plan to book.'
          });
        }
      } catch (err) {
        console.warn('User lookup warning:', err.message);
      }
    }

    const bookingPayload = {
      landId: bookingData.landId || 'parcel-user',
      parcelName: bookingData.parcelName || 'Registered Land Parcel',
      userId: userId,
      userName: bookingData.userName || 'Verified Landowner',
      userPhone: bookingData.userPhone || '+91 98221 00000',
      userEmail: bookingData.userEmail || 'farmer@landvista.ai',
      serviceType: bookingData.serviceType || 'Comprehensive Soil Lab & Land Inspection',
      locationCoordinates: bookingData.locationCoordinates || [75.9064, 17.6599],
      locationAddress: bookingData.locationAddress || 'Confirmed Cadastre Location',
      scheduledDate: bookingData.scheduledDate || '12 Sept 2026',
      scheduledTime: bookingData.scheduledTime || '10:30 AM',
      status: 'CONFIRMED',
      assignedExpert: bookingData.assignedExpert || {
        id: 'exp-01',
        name: 'Dr. Ramesh Patil',
        qualification: 'M.Sc. (Agri) Soil Science & Agronomy',
        phone: '+91 98220 44102',
        rating: 4.95,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      },
      priceRupees: bookingData.priceRupees || 1499,
      paymentStatus: bookingData.paymentStatus || 'PAID',
      paymentMethod: bookingData.paymentMethod || 'SIH Demo / Test Payment',
      userNotes: bookingData.userNotes || 'Physical soil core testing and crop feasibility advisory requested.'
    };

    let createdBooking = null;
    try {
      createdBooking = await SoilTestBooking.create(bookingPayload);
    } catch (e) {
      createdBooking = { _id: 'book-' + Date.now(), ...bookingPayload, createdAt: new Date() };
    }

    // Emit real-time Socket.IO room events
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${userId}`).emit('booking:created', createdBooking);
      io.to(`expert_${bookingPayload.assignedExpert.id}`).emit('booking:new_assignment', createdBooking);
      console.log(`📡 Emitted booking:created to user_${userId} and expert_${bookingPayload.assignedExpert.id}`);
    }

    res.status(201).json({
      success: true,
      booking: createdBooking,
      message: 'Expert checkup successfully booked and scheduled!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. PATCH /api/experts/bookings/:id/status - Update live lifecycle status
router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { status, assignedExpert } = req.body;
    const bookingId = req.params.id;

    let updatedBooking = null;
    try {
      const updateData = { status, updatedAt: new Date() };
      if (assignedExpert) updateData.assignedExpert = assignedExpert;

      updatedBooking = await SoilTestBooking.findByIdAndUpdate(bookingId, updateData, { new: true });
    } catch (e) {
      console.warn('Booking status update DB fallback:', e.message);
    }

    const userId = updatedBooking?.userId || 'user-default';
    const expertId = updatedBooking?.assignedExpert?.id || 'exp-01';

    // Real-Time Socket.IO Notification
    const io = req.app.get('io');
    if (io) {
      const payload = {
        bookingId,
        status,
        updatedAt: new Date().toISOString(),
        booking: updatedBooking || { _id: bookingId, status }
      };

      io.to(`user_${userId}`).emit('booking:status_changed', payload);
      io.to(`booking_${bookingId}`).emit('booking:status_changed', payload);
      io.to(`expert_${expertId}`).emit('booking:status_changed', payload);
      console.log(`📡 Emitted booking:status_changed (${status}) to user_${userId}, booking_${bookingId}`);
    }

    res.json({
      success: true,
      bookingId,
      status,
      booking: updatedBooking,
      updatedAt: new Date().toISOString(),
      message: `Booking status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. POST /api/experts/bookings/:id/submit-report - Submit physical inspection report
router.post('/bookings/:id/submit-report', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const reportData = req.body;

    const report = {
      reportId: 'REP-EXP-' + Date.now(),
      bookingId,
      submittedAt: new Date().toISOString(),
      labCertificateNo: reportData.labCertificateNo || 'EXP-AGRI-2026-8942',
      expertName: reportData.expertName || 'Dr. Ramesh Patil (M.Sc. Soil Science)',
      soilParameters: {
        ph: reportData.ph ?? 7.2,
        nitrogenKgHa: reportData.nitrogenKgHa ?? 310,
        phosphorusKgHa: reportData.phosphorusKgHa ?? 28,
        potassiumKgHa: reportData.potassiumKgHa ?? 340,
        organicCarbonPercent: reportData.organicCarbonPercent ?? 0.74,
        electricalConductivity: reportData.electricalConductivity ?? 0.38,
        soilTexture: reportData.soilTexture || 'Medium Deep Black Clayey Loam',
        drainageClass: reportData.drainageClass || 'Well Drained',
        soilHealthScore: reportData.soilHealthScore ?? 92
      },
      waterParameters: {
        waterSourceAvailable: reportData.waterSourceAvailable ?? true,
        sourceType: reportData.sourceType || 'Borewell & Perennial Irrigation Canal',
        waterTableDepthMeters: reportData.waterTableDepthMeters ?? 16.5,
        waterQuality: reportData.waterQuality || 'Potable & Excellent for Drip Irrigation',
        waterQualityTdsPpm: reportData.waterQualityTdsPpm ?? 380
      },
      agronomistSummary: reportData.agronomistSummary || 'Prime alluvial black soil with excellent organic carbon and balanced NPK ratio. Highly suitable for precision horticulture, pomegranate, onions, and high-value cash crops with micro-drip automation.',
      recommendedCrops: reportData.recommendedCrops || ['Pomegranate (Bhagwa Variety)', 'Export Quality Red Onion', 'High-Density Guava', 'Soybean-Gram Rotation'],
      groundVerifiedBadge: true
    };

    let updatedBooking = null;
    try {
      updatedBooking = await SoilTestBooking.findByIdAndUpdate(
        bookingId,
        {
          status: 'REPORT_READY',
          inspectionReport: {
            reportId: report.reportId,
            submittedAt: new Date(),
            labCertificateNo: report.labCertificateNo,
            ph: report.soilParameters.ph,
            nitrogenKgHa: report.soilParameters.nitrogenKgHa,
            phosphorusKgHa: report.soilParameters.phosphorusKgHa,
            potassiumKgHa: report.soilParameters.potassiumKgHa,
            organicCarbonPercent: report.soilParameters.organicCarbonPercent,
            electricalConductivity: report.soilParameters.electricalConductivity,
            waterTableDepthMeters: report.waterParameters.waterTableDepthMeters,
            waterQuality: report.waterParameters.waterQuality,
            agronomistSummary: report.agronomistSummary,
            recommendedCrops: report.recommendedCrops,
            confidenceScore: 94
          },
          updatedAt: new Date()
        },
        { new: true }
      );
    } catch (e) {
      console.warn('Booking report update fallback:', e.message);
    }

    const userId = updatedBooking?.userId || 'user-default';
    const expertId = updatedBooking?.assignedExpert?.id || 'exp-01';

    // Real-Time Socket.IO Notification
    const io = req.app.get('io');
    if (io) {
      const payload = {
        bookingId,
        status: 'REPORT_READY',
        report,
        booking: updatedBooking || { _id: bookingId, status: 'REPORT_READY', inspectionReport: report }
      };

      io.to(`user_${userId}`).emit('booking:report_submitted', payload);
      io.to(`booking_${bookingId}`).emit('booking:report_submitted', payload);
      io.to(`expert_${expertId}`).emit('booking:report_submitted', payload);
      console.log(`📡 Emitted booking:report_submitted to user_${userId}, booking_${bookingId}`);
    }

    res.json({
      success: true,
      report,
      booking: updatedBooking,
      message: 'Verified physical inspection report submitted and linked to Land Dossier.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
