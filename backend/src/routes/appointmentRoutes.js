const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getDoctorsForBooking,
    bookAppointment,
    getPatientAppointments
} = require('../controllers/appointmentController');

// All routes are protected and for patients
router.use(protect);

router.get('/doctors', authorize('patient'), getDoctorsForBooking);
router.post('/book', authorize('patient'), bookAppointment);
router.get('/my', authorize('patient'), getPatientAppointments);

module.exports = router;
