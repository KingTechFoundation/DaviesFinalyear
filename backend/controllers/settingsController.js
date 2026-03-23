const User = require('../models/User');

// @desc    Get user settings
// @route   GET /api/settings
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('language units notifications farmLocation');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user settings
// @route   PUT /api/settings
const updateSettings = async (req, res) => {
  try {
    const { language, units, notifications, farmLocation } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (language) user.language = language;
    if (units) user.units = units;
    if (notifications) user.notifications = { ...user.notifications, ...notifications };
    if (farmLocation) user.farmLocation = farmLocation;

    const updatedUser = await user.save();
    res.json({
      language: updatedUser.language,
      units: updatedUser.units,
      notifications: updatedUser.notifications,
      farmLocation: updatedUser.farmLocation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
