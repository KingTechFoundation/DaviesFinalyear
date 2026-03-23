const FarmInput = require('../models/FarmInput');

// @desc    Get all inputs for a user
// @route   GET /api/inputs
const getInputs = async (req, res) => {
  try {
    const inputs = await FarmInput.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(inputs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an input record
// @route   POST /api/inputs
const createInput = async (req, res) => {
  try {
    const input = await FarmInput.create({ ...req.body, userId: req.user._id });
    res.status(201).json(input);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInputs, createInput };
