const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getFarmerDashboard,
  getAgronomistDashboard,
  getPolicymakerDashboard,
  getYieldData, 
  getRegionalData, 
  getAdoptionData, 
  getImpactData 
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// Public or general stats
router.get('/dashboard', getDashboardStats);

// Role-specific personalized dashboards
router.get('/farmer-dashboard', protect, getFarmerDashboard);
router.get('/agronomist-dashboard', protect, getAgronomistDashboard);
router.get('/policymaker-dashboard', protect, getPolicymakerDashboard);

// Specific analytics data
router.get('/yield', getYieldData);
router.get('/regional', getRegionalData);
router.get('/adoption', getAdoptionData);
router.get('/impact', getImpactData);

module.exports = router;
