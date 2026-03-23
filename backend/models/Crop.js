const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  crop: { type: String, required: true },
  variety: { type: String },
  plot: { type: String },
  area: { type: Number },
  plantingDate: { type: Date },
  expectedHarvest: { type: Date },
  growthStage: { type: String, enum: ['Germination', 'Vegetative', 'Flowering', 'Tuber Formation', 'Maturation', 'Harvesting'], default: 'Germination' },
  health: { type: String, enum: ['Excellent', 'Good', 'Fair', 'Poor'], default: 'Good' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
