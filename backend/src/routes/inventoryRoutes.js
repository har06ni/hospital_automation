const express = require('express');
const router = express.Router();
const { searchInventory, updateStock } = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

router.get('/search', authorize('pharmacist', 'doctor', 'nurse', 'patient'), searchInventory);
router.patch('/:id/stock', authorize('pharmacist'), updateStock);

module.exports = router;
