import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the URI from environment variables.
 * Mongoose manages a connection pool internally — you call this once
 * at app startup and Mongoose reuses the connection for all operations.
 */
export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}
