const express = require('express');
const router = express.Router();
const { addStaff, getAllStaff } = require('../controllers/staffController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

// Only Admins can add or view the full staff directory
router.post('/', authorize('admin'), addStaff);
router.get('/', authorize('admin'), getAllStaff);

module.exports = router;
