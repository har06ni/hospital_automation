const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
    heartRate: Number,
    bp: String,
    spo2: Number,
    temp: Number,
    bloodSugar: Number,
    rr: Number,
    painScale: Number,
    timestamp: { type: Date, default: Date.now }
});

const timelineSchema = new mongoose.Schema({
    type: String,
    time: { type: Date, default: Date.now },
    detail: String,
    user: String
});

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    gender: String,
    ipNumber: { type: String, unique: true },
    ward: String,
    bed: String,
    doa: Date,
    diagnosis: String,
    status: {
        type: String,
        enum: ['Stable', 'Warning', 'Critical'],
        default: 'Stable'
    },
    consentSigned: { type: Boolean, default: false },
    vitals: vitalsSchema,
    history: [vitalsSchema],
    treatment: [{
        name: String,
        dose: String,
        time: String,
        lastGiven: Date
    }],
    timeline: [timelineSchema],
    appointments: [{
        doctor: String,
        date: Date,
        type: String,
        status: String
    }],
    lastSignedBy: String
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
