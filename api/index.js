const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

module.exports = async (req, res) => {
    // Handle simple ping without DB
    if (req.url === '/api/ping') {
        return res.json({ status: 'pong', time: new Date().toISOString() });
    }

    try {
        await connectDB();
        return app(req, res);
    } catch (err) {
        console.error('Vercel Entry Point Error:', err);
        res.status(500).json({
            error: 'Serverless Function Error',
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};
