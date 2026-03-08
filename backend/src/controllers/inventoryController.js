const Inventory = require('../models/Inventory');

// @desc    Get all inventory items (with optional query)
// @route   GET /api/inventory/search
// @access  Private (Pharmacist, Doctor, Nurse)
const searchInventory = async (req, res) => {
    try {
        const { query, emergency } = req.query;
        let filter = {};

        if (query) {
            filter = {
                $or: [
                    { brand: { $regex: query, $options: 'i' } },
                    { genericName: { $regex: query, $options: 'i' } }
                ]
            };
        }

        if (emergency === 'true') {
            filter.isEmergency = true;
        }

        const items = await Inventory.find(filter).sort({ brand: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update stock levels
// @route   PATCH /api/inventory/:id/stock
// @access  Private (Pharmacist)
const updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        const item = await Inventory.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Medicine not found' });

        item.stock = stock;
        item.status = stock === 0 ? 'Out of Stock' : (stock < 10 ? 'Low Stock' : 'Available');

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { searchInventory, updateStock };
