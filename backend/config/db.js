import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️ [MongoDB]: MONGODB_URI is empty in environment');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    return false;
  }
}

export function getDBStatus() {
  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    state: mongoose.connection.readyState === 1 ? 'LIVE_MONGODB_ATLAS' : 'OFFLINE',
    host: isConnected ? mongoose.connection.host : null
  };
}
