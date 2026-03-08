const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB`);
    } catch (error) {
        if (process.env.NODE_ENV === 'production') {
            console.error("MongoDB Connection Error in Production:", error);
            throw error;
        }
        console.warn(`Local MongoDB not found. Starting In-Memory Clinical Database...`);
        console.warn(`Local MongoDB not found. Starting In-Memory Clinical Database...`);
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);

        const os = require('os');
        const getIP = () => {
            const nets = os.networkInterfaces();
            for (const name of Object.keys(nets)) {
                for (const net of nets[name]) {
                    if (net.family === 'IPv4' && !net.internal) return net.address;
                }
            }
            return 'localhost';
        };
        const IP = getIP();

        console.log(`In-Memory Database Ready (Demo Mode)`);
        console.log(`--------------------------------------------------`);
        console.log(`🚀 VIEW DATA DIRECTLY IN BROWSER:`);
        console.log(`=> Local: http://localhost:5000/admin/db`);
        console.log(`=> Remote: http://${IP}:5000/admin/db`);
        console.log(`--------------------------------------------------`);
        console.log(`🔑 FOR MONGODB COMPASS:`);
        console.log(`=> Connect to: ${uri}`);
        console.log(`--------------------------------------------------`);
    }
};

module.exports = connectDB;
