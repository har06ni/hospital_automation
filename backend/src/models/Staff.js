const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    age: { type: Number, required: true },
    contact: {
        email: String,
        phone: String
    },
    role: { type: String, enum: ['doctor', 'nurse'], required: true },
    department: { type: String, required: true },
    specialization: String, // Specifically for Doctors
    assignedWards: [String], // Wards a doctor is responsible for
    assignedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
    ward: String,           // Specifically for Nurses
    shift: {
        type: String,
        enum: ['Morning Shift: 6:00 AM – 2:00 PM', 'Evening Shift: 2:00 PM – 10:00 PM', 'Night Shift: 10:00 PM – 6:00 AM'],
        required: function () { return this.role === 'nurse'; }
    },
    availability: { type: Boolean, default: true },
    experience: Number,     // In years
    location: String,       // E.g., "Floor 2, Cabin 204"
    imageUrl: String,       // Placeholder URL for doctor images
    joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
