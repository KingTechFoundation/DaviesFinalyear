const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  size: { type: Number, required: true },
  unit: { type: String, enum: ['hectares', 'acres'], default: 'hectares' },
  coordinates: { type: String },
  soilType: { type: String, enum: ['Clay Loam', 'Sandy Loam', 'Silt Loam', 'Clay', 'Sandy'], default: 'Clay Loam' },
  plots: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);
