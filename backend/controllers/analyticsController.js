const AnalyticsData = require('../models/AnalyticsData');
const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const { FarmingTask } = require('../models/FarmingTask');
const SoilAnalysis = require('../models/SoilAnalysis');
const { PestScan } = require('../models/PestScan');
const WeatherData = require('../models/WeatherData');

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const kpis = await AnalyticsData.findOne({ type: 'kpi' });
    res.json(kpis ? kpis.data : {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get farmer dashboard data
// @route   GET /api/analytics/farmer-dashboard
const getFarmerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const location = req.user.farmLocation || 'Musanze District';

    // 1. Fetch Farm Stats
    const farms = await Farm.find({ userId });
    const totalArea = farms.reduce((sum, farm) => sum + (farm.size || 0), 0);
    
    // 2. Fetch Crop Stats
    const crops = await Crop.find({ userId });
    const activeCrops = crops.length;

    // 3. Fetch Recent Activities (Soil tests, Pest scans)
    const recentSoil = await SoilAnalysis.find({ userId }).sort({ createdAt: -1 }).limit(2);
    const recentPests = await PestScan.find({ userId }).sort({ createdAt: -1 }).limit(2);

    const activities = [
      ...recentSoil.map(s => ({
        text: `Soil analysis completed - ${s.overallStatus} health`,
        time: s.createdAt,
        type: s.overallStatus.toLowerCase().includes('good') ? 'success' : 'warning',
        icon: 'Leaf'
      })),
      ...recentPests.map(p => ({
        text: `Pest scan for ${p.cropName || 'Crop'} - ${p.detectedPest || 'No pests'}`,
        time: p.createdAt,
        type: p.status === 'healthy' ? 'success' : 'warning',
        icon: 'Bug'
      }))
    ].sort((a, b) => b.time - a.time).slice(0, 5);

    // 4. Fetch Upcoming Tasks
    const tasks = await FarmingTask.find({ userId, status: { $ne: 'completed' } })
      .sort({ date: 1 })
      .limit(3);

    const upcomingTasks = tasks.map(t => ({
      title: t.title,
      sub: `${t.crop || 'Farm'} - Due ${new Date(t.date).toLocaleDateString()}`,
      color: t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-orange-500' : 'bg-emerald-500'
    }));

    // 5. Fetch Weather
    const weather = await WeatherData.findOne({ location: { $regex: location, $options: 'i' } })
      .sort({ updatedAt: -1 });

    res.json({
      farmStats: {
        totalArea,
        activeCrops,
        location
      },
      stats: [
        { title: 'Farms', value: farms.length.toString(), change: 'Registered properties', icon: 'Sprout', color: 'text-green-600', bgColor: 'bg-green-50' },
        { title: 'Soil Health', value: recentSoil[0]?.overallHealth ? `${recentSoil[0].overallHealth}%` : 'N/A', change: recentSoil[0] ? 'Latest update' : 'No tests yet', icon: 'CheckCircle2', color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { title: 'Active Crops', value: activeCrops.toString(), change: 'Current season', icon: 'Leaf', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { title: 'Pest Risk', value: recentPests[0]?.severity || 'Low', change: 'Based on last scan', icon: 'Bug', color: 'text-orange-600', bgColor: 'bg-orange-50' },
      ],
      activities,
      upcomingTasks,
      weather: weather ? {
        temp: weather.current.temp,
        humidity: weather.current.humidity,
        wind: weather.current.wind,
        condition: weather.current.condition
      } : null
    });
  } catch (error) {
    console.error('Farmer Dashboard Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get agronomist dashboard data
// @route   GET /api/analytics/agronomist-dashboard
const getAgronomistDashboard = async (req, res) => {
  try {
    // For now, aggregate data for their location
    const location = req.user.farmLocation || 'Musanze District';
    const district = location.split(',')[0];

    const [farmersCount, totalAdvisory, recentSoil, recentPests] = await Promise.all([
      User.countDocuments({ role: 'farmer', farmLocation: { $regex: district, $options: 'i' } }),
      AdvisoryRequest.countDocuments({ location: { $regex: district, $options: 'i' } }),
      SoilAnalysis.find({ location: { $regex: district, $options: 'i' } }).limit(20),
      PestScan.find({ location: { $regex: district, $options: 'i' } }).limit(20)
    ]);

    // Calculate regional soil health average
    const avgSoilHealth = recentSoil.length > 0 
      ? Math.round(recentSoil.reduce((acc, s) => acc + (s.overallHealth || 0), 0) / recentSoil.length)
      : 84;

    // Calculate pest risk (percentage of high/critical scans)
    const highRiskPests = recentPests.filter(p => p.severity === 'High' || p.severity === 'Critical').length;
    const pestRiskLevel = recentPests.length > 0 
      ? Math.round((highRiskPests / recentPests.length) * 100)
      : 42;
    
    res.json({
      stats: [
        { title: 'Farmers Managed', value: farmersCount.toString(), change: 'In your district', icon: 'Users', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { title: 'Advisory Requests', value: totalAdvisory.toString(), change: 'Customer inquiries', icon: 'MessageSquare', color: 'text-orange-600', bgColor: 'bg-orange-50' },
        { title: 'Regional Soil Health', value: `${avgSoilHealth}%`, change: 'Avg across farms', icon: 'Map', color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { title: 'Alerts Resolved', value: '18', change: 'This month', icon: 'Bell', color: 'text-purple-600', bgColor: 'bg-purple-50' },
      ],
      regionalHealth: {
        soilHealth: avgSoilHealth,
        pestRisk: pestRiskLevel
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get policymaker dashboard data
// @route   GET /api/analytics/policymaker-dashboard
const getPolicymakerDashboard = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalFarms = await Farm.countDocuments();
    const totalArea = await Farm.aggregate([{ $group: { _id: null, total: { $sum: "$size" } } }]);
    
    res.json({
      stats: [
        { title: 'National Farmers', value: totalFarmers.toLocaleString(), change: '+1.5% from 2024', icon: 'ShieldCheck', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { title: 'Registered Farms', value: totalFarms.toLocaleString(), change: 'Verified plots', icon: 'TrendingUp', color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { title: 'Digital Adoption', value: '62%', change: '+15% reach', icon: 'Globe', color: 'text-purple-600', bgColor: 'bg-purple-50' },
        { title: 'Agri-Land (ha)', value: (totalArea[0]?.total || 0).toLocaleString(), change: 'Total coverage', icon: 'BarChart3', color: 'text-orange-600', bgColor: 'bg-orange-50' },
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get yield data
// @route   GET /api/analytics/yield
const getYieldData = async (req, res) => {
  try {
    const yieldData = await AnalyticsData.findOne({ type: 'yield' });
    res.json(yieldData ? yieldData.data : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get regional data
// @route   GET /api/analytics/regional
const getRegionalData = async (req, res) => {
  try {
    const regionalData = await AnalyticsData.findOne({ type: 'regional' });
    res.json(regionalData ? regionalData.data : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get adoption data
// @route   GET /api/analytics/adoption
const getAdoptionData = async (req, res) => {
  try {
    const adoptionData = await AnalyticsData.findOne({ type: 'adoption' });
    res.json(adoptionData ? adoptionData.data : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get impact data
// @route   GET /api/analytics/impact
const getImpactData = async (req, res) => {
  try {
    const impactData = await AnalyticsData.findOne({ type: 'impact' });
    res.json(impactData ? impactData.data : {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getDashboardStats, 
  getFarmerDashboard,
  getAgronomistDashboard,
  getPolicymakerDashboard,
  getYieldData, 
  getRegionalData, 
  getAdoptionData, 
  getImpactData 
};
