import mongoose from 'mongoose';

let databaseReady = false;

export default async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI is required');
    }

    console.warn('MONGODB_URI is not set. Using in-memory request storage for local preview.');
    return false;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production'
  });

  databaseReady = true;
  console.log('MongoDB connected');
  return true;
}

export function isDatabaseReady() {
  return databaseReady || mongoose.connection.readyState === 1;
}
