const Staff = require('../models/Staff');

const getStaffProfile = async (req, res, next) => {
    try {
        if (!req.user || (req.user.role !== 'doctor' && req.user.role !== 'nurse' && req.user.role !== 'pharmacist')) {
            return next();
        }

        const staff = await Staff.findOne({ userId: req.user._id });
        if (staff) {
            req.staff = staff;
        }
        next();
    } catch (error) {
        console.error('Staff middleware error:', error);
        res.status(500).json({ message: 'Error fetching staff profile' });
    }
};

module.exports = { getStaffProfile };
