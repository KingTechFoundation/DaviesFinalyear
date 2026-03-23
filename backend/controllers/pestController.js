const { PestScan, CommonPest } = require('../models/PestScan');

// @desc    Get pest scan history
// @route   GET /api/pests/scans
const getScans = async (req, res) => {
  try {
    const scans = await PestScan.find({ userId: req.user._id }).sort({ scanDate: -1 });
    res.json(scans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a pest scan
// @route   POST /api/pests/scans
const createScan = async (req, res) => {
  try {
    const scan = await PestScan.create({ ...req.body, userId: req.user._id });
    res.status(201).json(scan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get common pests for a region
// @route   GET /api/pests/common
const getCommonPests = async (req, res) => {
  try {
    const region = req.query.region || '';
    const query = region ? { region: { $regex: region, $options: 'i' } } : {};
    const pests = await CommonPest.find(query);
    res.json(pests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getScans, createScan, getCommonPests };
