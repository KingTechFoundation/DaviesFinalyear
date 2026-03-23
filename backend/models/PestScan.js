const mongoose = require('mongoose');

const pestScanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  cropName: { type: String },
  imageUrl: { type: String },
  detectedPest: { type: String },
  severity: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], default: 'Low' },
  confidence: { type: Number },
  affectedArea: { type: String },
  risk: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  status: { type: String, enum: ['healthy', 'warning', 'critical'], default: 'healthy' },
  result: { type: String },
  treatments: [{
    title: String,
    steps: [String],
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  }],
  scanDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Common pests collection
const commonPestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  risk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  season: { type: String },
  crops: { type: String },
  region: { type: String },
}, { timestamps: true });

const PestScan = mongoose.model('PestScan', pestScanSchema);
const CommonPest = mongoose.model('CommonPest', commonPestSchema);

module.exports = { PestScan, CommonPest };
