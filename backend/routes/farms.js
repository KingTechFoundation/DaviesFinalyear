const express = require('express');
const router = express.Router();
const { getFarms, createFarm, updateFarm, deleteFarm } = require('../controllers/farmController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getFarms).post(protect, createFarm);
router.route('/:id').put(protect, updateFarm).delete(protect, deleteFarm);

module.exports = router;
