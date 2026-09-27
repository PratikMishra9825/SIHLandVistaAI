import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

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

async function startServer() {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 LandVista AI Backend Server with Real-Time Sockets running on port ${PORT}`);
    console.log(`📡 Health check available at http://localhost:${PORT}/api/health`);
  });
}

startServer();
