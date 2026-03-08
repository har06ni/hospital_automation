const express = require('express');
const router = express.Router();
const { getPatients, getPatientById, createPatient, updateVitals } = require('../controllers/patientController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { getStaffProfile } = require('../middlewares/staffMiddleware');

router.use(protect);
router.use(getStaffProfile);

router.get('/', authorize('doctor', 'nurse', 'admin'), getPatients);
router.get('/:id', getPatientById);
router.post('/', authorize('admin', 'nurse'), createPatient);
router.patch('/:id/vitals', authorize('nurse', 'doctor'), updateVitals);

module.exports = router;
