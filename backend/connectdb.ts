import 'dotenv/config';
import mongoose from 'mongoose';

let isConnected = false; // track connection status

export default async function connectDB() {
  if (isConnected) {
    
    return;
  }

  if (!process.env.MONGO_URI!) {
    throw new Error('MONGO URI missing from env!');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    isConnected = true;
    console.log(' MongoDB connected');
  } catch (err) {
    console.error(' Error connecting to MongoDB:', err);
    throw err;
  }
}