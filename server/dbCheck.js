import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

console.log('Initiating database connection check...');
console.log(`Target URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/vendorbridge'}`);

const checkConnection = async () => {
  try {
    await connectDB();
    console.log('SUCCESS: Database connection established successfully!');
    
    // Clean up connection
    await mongoose.connection.close();
    console.log('Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('FAILURE: Database connection check failed.');
    console.error(error.message);
    process.exit(1);
  }
};

checkConnection();
