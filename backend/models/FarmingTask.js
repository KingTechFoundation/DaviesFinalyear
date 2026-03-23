const mongoose = require('mongoose');

const farmingTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  title: { type: String, required: true },
  crop: { type: String },
  date: { type: Date },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  description: { type: String },
  result: { type: String },
  completedDate: { type: Date },
  daysUntil: { type: Number },
}, { timestamps: true });

// Seasonal timeline
const seasonalTimelineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phase: { type: String, required: true },
  status: { type: String, enum: ['completed', 'current', 'upcoming'], default: 'upcoming' },
  dates: { type: String },
  activities: [String],
  season: { type: String, default: 'Season A 2025/2026' },
}, { timestamps: true });

const FarmingTask = mongoose.model('FarmingTask', farmingTaskSchema);
const SeasonalTimeline = mongoose.model('SeasonalTimeline', seasonalTimelineSchema);

module.exports = { FarmingTask, SeasonalTimeline };
