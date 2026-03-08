const mongoose = require('mongoose');

const aiAuditSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    context: {
        age: Number,
        gender: String,
        diagnosisSummary: String,
        vitals: Object
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AIAudit', aiAuditSchema);
