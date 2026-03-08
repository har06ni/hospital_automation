const Staff = require('../models/Staff');
const User = require('../models/User');

// @desc    Add new staff member (Admin Only)
// @route   POST /api/staff
// @access  Private (Admin)
const addStaff = async (req, res) => {
    const { username, password, name, gender, age, contact, role, department, specialization, ward, experience } = req.body;

    try {
        // 1. Create User account for Staff
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'Username already exists' });

        const user = await User.create({
            username,
            password,
            role
        });

        // 2. Create Staff profile
        const staff = await Staff.create({
            userId: user._id,
            name,
            gender,
            age,
            contact,
            role,
            department,
            specialization: role === 'doctor' ? specialization : undefined,
            ward: role === 'nurse' ? ward : undefined,
            experience
        });

        res.status(201).json(staff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private (Admin)
const getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find().populate('userId', 'username role');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addStaff, getAllStaff };
