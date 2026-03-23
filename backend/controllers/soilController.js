const SoilAnalysis = require('../models/SoilAnalysis');

// @desc    Get soil analyses for a user
// @route   GET /api/soil
const getSoilAnalyses = async (req, res) => {
  try {
    const analyses = await SoilAnalysis.find({ userId: req.user._id }).populate('farmId', 'name');
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create soil analysis
// @route   POST /api/soil
const createSoilAnalysis = async (req, res) => {
  try {
    const analysis = await SoilAnalysis.create({ ...req.body, userId: req.user._id });
    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single soil analysis
// @route   GET /api/soil/:id
const getSoilAnalysis = async (req, res) => {
  try {
    const analysis = await SoilAnalysis.findOne({ _id: req.params.id, userId: req.user._id });
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSoilAnalyses, createSoilAnalysis, getSoilAnalysis };
