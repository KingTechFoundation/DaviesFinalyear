const express = require('express');
const router = express.Router();
const { getSoilAnalyses, createSoilAnalysis, getSoilAnalysis } = require('../controllers/soilController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getSoilAnalyses).post(protect, createSoilAnalysis);
router.route('/:id').get(protect, getSoilAnalysis);

module.exports = router;
