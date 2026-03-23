const Farm = require('../models/Farm');

// @desc    Get all farms for a user
// @route   GET /api/farms
const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user._id });
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create farm
// @route   POST /api/farms
const createFarm = async (req, res) => {
  try {
    const farm = await Farm.create({ ...req.body, userId: req.user._id });
    res.status(201).json(farm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.json(farm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    res.json({ message: 'Farm removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFarms, createFarm, updateFarm, deleteFarm };
