const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('YOUR_USERNAME')) {
    console.warn('MongoDB URI is not configured. Starting API without database features.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.warn('Starting API without database features.');
  }
};

module.exports = connectDB;
