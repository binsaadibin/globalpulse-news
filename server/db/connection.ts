import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://golbalnews:zulfiqar4455@globalnews.yhhmhpy.mongodb.net/');
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.log('⚠️ MongoDB not running - using mock authentication');
    // Don't exit process - allow server to run without DB
  }
};