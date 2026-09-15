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

import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

app.set('io', io);

// Socket.IO Room Management
io.on('connection', (socket) => {
  console.log(`🔌 Socket client connected: ${socket.id}`);

  socket.on('join_user', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`👤 User joined room: user_${userId}`);
    }
  });

  socket.on('join_expert', (expertId) => {
    if (expertId) {
      socket.join(`expert_${expertId}`);
      console.log(`👨‍🔬 Expert joined room: expert_${expertId}`);
    }
  });

  socket.on('join_booking', (bookingId) => {
    if (bookingId) {
      socket.join(`booking_${bookingId}`);
      console.log(`📋 Joined booking room: booking_${bookingId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket client disconnected: ${socket.id}`);
  });
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

async function startServer() {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 LandVista AI Backend Server with Real-Time Sockets running on port ${PORT}`);
    console.log(`📡 Health check available at http://localhost:${PORT}/api/health`);
  });
}

startServer();
