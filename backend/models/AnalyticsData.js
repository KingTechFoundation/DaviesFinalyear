const mongoose = require('mongoose');

const analyticsDataSchema = new mongoose.Schema({
  type: { type: String, enum: ['yield', 'adoption', 'regional', 'kpi', 'impact'], required: true },
  period: { type: String },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AnalyticsData', analyticsDataSchema);
