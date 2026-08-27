import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export const connectDatabase = async (uri?: string): Promise<void> => {
  if (isConnected) return;

  const mongoUri = uri || env.mongodbUri;

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`Connected to MongoDB: ${mongoUri}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('Disconnected from MongoDB');
};
