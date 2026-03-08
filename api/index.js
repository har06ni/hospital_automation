const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

// Vercel serverless function entry point
module.exports = async (req, res) => {
    try {
        // Ensure DB connection
        await connectDB();

        // Let Express handle the rest
        return app(req, res);
    } catch (err) {
        console.error('Vercel Entry Point Error:', err);
        res.status(500).json({ error: 'Serverless Function Error', details: err.message });
    }
};
