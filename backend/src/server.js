const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

// Connect to Database
const { seedClinicalData } = require('./utils/seeder');

const startServer = async () => {
    await connectDB();
    await seedClinicalData();

    const server = http.createServer(app);

    // Socket.io for Real-time Emergency Alerts
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected to clinical websocket');
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    // Attach io to app to use in controllers
    app.set('io', io);

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

    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`📡 Access remotely at: http://${IP}:${PORT}`);
    });
};

startServer();
