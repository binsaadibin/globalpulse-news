import mongoose from 'mongoose';
import { initializeDefaultUsers } from '../modules/users/users.controller.js';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://golbalnews:zulfiqar4455@globalnews.yhhmhpy.mongodb.net/globalpulse';
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Initialize default users after successful connection
    await initializeDefaultUsers();
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📤 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error);
    console.log('⚠️ Server cannot start without database connection');
    process.exit(1);
  }
};