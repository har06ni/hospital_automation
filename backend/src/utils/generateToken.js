const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'hospital_automation_secret_2024',
        { expiresIn: '30d' }
    );
};

module.exports = generateToken;
