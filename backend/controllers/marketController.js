const MarketPrice = require('../models/MarketPrice');

// @desc    Get all market prices
// @route   GET /api/market
const getMarketPrices = async (req, res) => {
  try {
    const prices = await MarketPrice.find({}).sort({ updatedAt: -1 });
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update market price
// @route   PUT /api/market/:id
const updateMarketPrice = async (req, res) => {
  try {
    const price = await MarketPrice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!price) return res.status(404).json({ message: 'Price not found' });
    res.json(price);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMarketPrices, updateMarketPrice };
