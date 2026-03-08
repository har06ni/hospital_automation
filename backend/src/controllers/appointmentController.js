const Appointment = require('../models/Appointment');
const Staff = require('../models/Staff');

/**
 * @desc    Get all doctors for appointment booking
 * @route   GET /api/appointments/doctors
 * @access  Private (Patient)
 */
exports.getDoctorsForBooking = async (req, res) => {
    try {
        const doctors = await Staff.find({ role: 'doctor', availability: true })
            .select('name specialization experience department ward gender location imageUrl');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
};

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments/book
 * @access  Private (Patient)
 */
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, timeSlot, phoneNumber, email, patientName } = req.body;

        if (!doctorId || !date || !timeSlot) {
            return res.status(400).json({ message: 'Doctor, Date, and Time Slot are required' });
        }

        // Check if slot already booked
        const existing = await Appointment.findOne({ doctorId, date, timeSlot, status: { $ne: 'Cancelled' } });
        if (existing) {
            return res.status(400).json({ message: 'This time slot is already booked. Please choose another one.' });
        }

        const doctor = await Staff.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const appointment = new Appointment({
            patientId: req.user._id,
            doctorId,
            doctorName: doctor.name,
            specialty: doctor.specialization,
            patientName: patientName || req.user.username,
            date,
            timeSlot,
            phoneNumber,
            email,
            status: 'Pending'
        });

        const savedAppointment = await appointment.save();
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: savedAppointment
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Concurrency Error: This slot was just booked by someone else.' });
        }
        res.status(500).json({ message: 'Error booking appointment', error: error.message });
    }
};

/**
 * @desc    Get appointments for the logged-in patient
 * @route   GET /api/appointments/my
 * @access  Private (Patient)
 */
exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user._id })
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your appointments', error: error.message });
    }
};
