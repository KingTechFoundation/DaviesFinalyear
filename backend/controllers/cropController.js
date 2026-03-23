const Crop = require('../models/Crop');

// @desc    Get all crops for a user
// @route   GET /api/crops
const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user._id }).populate('farmId', 'name');
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create crop
// @route   POST /api/crops
const createCrop = async (req, res) => {
  try {
    const crop = await Crop.create({ ...req.body, userId: req.user._id });
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json({ message: 'Crop removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCrops, createCrop, updateCrop, deleteCrop };
