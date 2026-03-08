const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log(`Connected to MongoDB Atlas`);
        } else {
            throw new Error("MONGODB_URI not found");
        }
    } catch (error) {
        console.warn(`Database connection failed or MONGODB_URI missing. Attempting In-Memory Fallback for Review...`);

        try {
            // Need to require locally as these are only for demo/fallback
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);

            // Auto-seed for every new serverless instance in demo mode
            const { seedClinicalData } = require('../utils/seeder');
            await seedClinicalData();

            console.log(`In-Memory Database Ready (Emergency Review Mode)`);
        } catch (innerError) {
            console.error("Emergency Fallback Failed:", innerError);
            // On Vercel, mongodb-memory-server might fail to download binary.
            // If it does, we explain why it's missing.
            throw new Error("Database Error: MONGODB_URI is missing and In-Memory fallback failed.");
        }
    }
};

module.exports = connectDB;
