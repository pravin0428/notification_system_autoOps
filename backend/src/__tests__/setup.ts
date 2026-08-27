import mongoose from 'mongoose';

let isConnected = false;

export const connectTestDB = async (): Promise<void> => {
  if (isConnected) return;
  await mongoose.connect('mongodb://localhost:27017/notification-system-test');
  isConnected = true;
};

export const disconnectTestDB = async (): Promise<void> => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
};

export const clearTestDB = async (): Promise<void> => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
