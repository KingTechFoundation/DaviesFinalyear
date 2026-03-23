const express = require('express');
const router = express.Router();
const { getScans, createScan, getCommonPests } = require('../controllers/pestController');
const { protect } = require('../middleware/auth');

router.route('/scans').get(protect, getScans).post(protect, createScan);
router.get('/common', getCommonPests);

module.exports = router;
