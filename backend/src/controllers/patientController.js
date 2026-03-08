const Patient = require('../models/Patient');

// Helper to check if current time is within a nurse's shift
const isWithinShift = (shift) => {
    const hour = new Date().getHours();
    if (shift.includes('Morning')) return hour >= 6 && hour < 14;
    if (shift.includes('Evening')) return hour >= 14 && hour < 22;
    if (shift.includes('Night')) return hour >= 22 || hour < 6;
    return false;
};

// @desc    Get all patients (Strictly filtered by role/assignments)
// @route   GET /api/patients
// @access  Private (Doctor, Nurse, Admin)
const getPatients = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === 'admin') {
            // Admin sees everything
            const { ward } = req.query;
            if (ward) filter.ward = ward;
        } else if (req.user.role === 'doctor') {
            // Doctor sees ONLY assigned patients
            if (!req.staff || !req.staff.assignedPatients) {
                return res.json([]);
            }
            filter = { _id: { $in: req.staff.assignedPatients } };
        } else if (req.user.role === 'nurse') {
            // Nurse sees ONLY ward patients
            if (!req.staff || !req.staff.ward) {
                return res.json([]);
            }
            // A nurse might be assigned a comma-separated list of wards or a single ward
            const wards = req.staff.ward.split(',').map(w => w.trim());
            filter = { ward: { $in: wards } };
        }

        const patients = await Patient.find(filter).sort({ status: 1 });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single patient by ID (With Access Control)
// @route   GET /api/patients/:id
// @access  Private (Doctor, Nurse, Admin, Patient)
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        // Access Control Logic
        if (req.user.role === 'patient') {
            if (req.user.profileRef && req.user.profileRef.toString() !== patient._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this record' });
            }
        } else if (req.user.role === 'doctor') {
            if (!req.staff?.assignedPatients?.includes(patient._id)) {
                return res.status(403).json({ message: 'Not authorized: Patient not assigned to you' });
            }
        } else if (req.user.role === 'nurse') {
            const wards = req.staff?.ward?.split(',').map(w => w.trim()) || [];
            if (!wards.includes(patient.ward)) {
                return res.status(403).json({ message: 'Not authorized: Patient outside your assigned ward' });
            }
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new patient (Admission)
// @route   POST /api/patients
// @access  Private (Admin, Nurse)
const createPatient = async (req, res) => {
    try {
        // Only Admin or Nurse assigned to that ward can create/admit
        if (req.user.role === 'nurse') {
            const wards = req.staff?.ward?.split(',').map(w => w.trim()) || [];
            if (!wards.includes(req.body.ward)) {
                return res.status(403).json({ message: 'Not authorized to admit to this ward' });
            }
        }

        const patient = new Patient(req.body);
        const createdPatient = await patient.save();
        res.status(201).json(createdPatient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const { predictClinicalRisk } = require('../services/mlService');

// @desc    Update patient vitals & status (With SHIFT check)
// @route   PATCH /api/patients/:id/vitals
// @access  Private (Nurse, Doctor)
const updateVitals = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        // 1. Shift check for Nurses
        if (req.user.role === 'nurse') {
            if (!isWithinShift(req.staff.shift)) {
                return res.status(403).json({
                    message: `Restricted: Vitals update only allowed during your ${req.staff.shift}`
                });
            }
            // Ward check
            const wards = req.staff.ward.split(',').map(w => w.trim());
            if (!wards.includes(patient.ward)) {
                return res.status(403).json({ message: 'Not authorized: Patient outside your assigned ward' });
            }
        }

        // 2. Doctor access check
        if (req.user.role === 'doctor') {
            if (!req.staff.assignedPatients.includes(patient._id)) {
                return res.status(403).json({ message: 'Not authorized: Patient not assigned to you' });
            }
        }

        const newVitals = req.body;
        patient.vitals = { ...patient.vitals, ...newVitals };
        patient.history.unshift({ ...patient.vitals, timestamp: new Date() });

        if (patient.history.length > 50) patient.history.pop();

        // ML Risk Assessment
        const mlResult = await predictClinicalRisk(newVitals, patient.history);

        // Rule-based status resolution (augmented by ML)
        let newStatus = 'Stable';
        if (mlResult.riskScore > 0.8 || newVitals.spo2 < 92) {
            newStatus = 'Critical';
        } else if (mlResult.riskScore > 0.5 || newVitals.spo2 < 95) {
            newStatus = 'Warning';
        }

        if (newStatus !== patient.status) {
            patient.status = newStatus;
            patient.timeline.push({
                type: 'Acuity Change',
                detail: `Status changed to ${newStatus} based on vitals review.`,
                user: req.user.username
            });

            const io = req.app.get('io');
            if (io) {
                io.emit('emergency_alert', {
                    patientId: patient._id,
                    name: patient.name,
                    status: newStatus,
                    vitals: newVitals
                });
            }
        }

        const updatedPatient = await patient.save();
        res.json({ patient: updatedPatient, statusUpdate: newStatus });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getPatients, getPatientById, createPatient, updateVitals };
