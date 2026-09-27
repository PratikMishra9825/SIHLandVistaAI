import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';

import authRoutes from './routes/auth.js';
import landsRoutes from './routes/lands.js';
import analysisRoutes from './routes/analysis.js';
import soilRoutes from './routes/soil.js';
import schemesRoutes from './routes/schemes.js';
import agricultureRoutes from './routes/agriculture.js';
import futureRoutes from './routes/future.js';
import expertsRoutes from './routes/experts.js';
import simulationsRoutes from './routes/simulations.js';
import reportsRoutes from './routes/reports.js';
import aiRoutes from './routes/ai.js';
import paymentsRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Ensure DB is connected for incoming API requests in serverless environments
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[DB Middleware] connectDB error:', err.message);
  }
  next();
});

// API Health & Status Check
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'online',
    platform: 'LANDVISTA AI - Smart Land Decision Engine',
    version: '1.0.0-SIH',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    realtimeSockets: 'ACTIVE',
    aiProvider: process.env.GEMINI_API_KEY ? 'GEMINI_AI_ACTIVE' : 'LOCAL_EXPLAINABLE_DEMO_AI',
    geospatialEngine: 'MONGODB_2DSPHERE_READY',
    primaryDemoRegion: 'Solapur, Maharashtra (10-Acre Hero Parcel)'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lands', landsRoutes);
app.use('/api', analysisRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api', agricultureRoutes);
app.use('/api/future', futureRoutes);
app.use('/api/experts', expertsRoutes);
app.use('/api/simulations', simulationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);

export default app;
