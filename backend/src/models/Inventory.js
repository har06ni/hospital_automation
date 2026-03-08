const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    genericName: { type: String, required: true },
    brand: { type: String, required: true },
    dosage: String,
    form: String,
    stock: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Available', 'Low Stock', 'Out of Stock'],
        default: 'Available'
    },
    expiryDate: Date,
    price: Number,
    manufacturer: String,
    isEmergency: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
