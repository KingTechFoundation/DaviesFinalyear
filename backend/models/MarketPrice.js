const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  change: { type: String },
  trend: { type: String, enum: ['up', 'down', 'neutral'], default: 'neutral' },
  unit: { type: String, default: 'RWF/kg' },
  market: { type: String, default: 'Kigali Wholesale Market' },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
