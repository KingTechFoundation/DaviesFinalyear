const mongoose = require('mongoose');

const soilMetricSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  optimal: { type: String },
  status: { type: String, enum: ['good', 'warning', 'critical'], default: 'good' },
  progress: { type: Number, default: 0 },
}, { _id: false });

const recommendedCropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  suitability: { type: Number },
  yield: { type: String },
  season: { type: String },
}, { _id: false });

const soilAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  overallHealth: { type: Number, default: 0 },
  overallStatus: { type: String, default: 'Good' },
  soilType: { type: String },
  location: { type: String },
  analysisDate: { type: Date, default: Date.now },
  metrics: [soilMetricSchema],
  recommendedCrops: [recommendedCropSchema],
  recommendations: [{
    title: String,
    description: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  }],
}, { timestamps: true });

module.exports = mongoose.model('SoilAnalysis', soilAnalysisSchema);
