const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');
const { seedClinicalData } = require('../backend/src/utils/seeder');

// Vercel serverless function entry point
module.exports = async (req, res) => {
    // Ensure DB connection
    await connectDB();

    // Optional: Auto-seed on first run if needed (caution with serverless)
    // await seedClinicalData(); 

    // Handle the request using the Express app
    return app(req, res);
};
