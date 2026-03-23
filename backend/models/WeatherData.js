const mongoose = require('mongoose');

const forecastDaySchema = new mongoose.Schema({
  day: String,
  icon: String,
  temp: { high: Number, low: Number },
  rain: Number,
  condition: String,
}, { _id: false });

const alertSchema = new mongoose.Schema({
  title: String,
  message: String,
  severity: { type: String, enum: ['warning', 'info'], default: 'info' },
  icon: String,
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  activity: String,
  status: String,
  reason: String,
}, { _id: false });

const weatherDataSchema = new mongoose.Schema({
  location: { type: String, required: true },
  current: {
    temp: Number,
    condition: String,
    humidity: Number,
    wind: Number,
    rainfall: Number,
    uvIndex: Number,
  },
  forecast: [forecastDaySchema],
  alerts: [alertSchema],
  recommendations: [recommendationSchema],
  monthlyData: [{
    month: String,
    rainfall: Number,
    avgTemp: Number,
  }],
  climateZone: {
    region: String,
    altitude: String,
    annualRainfall: String,
    growingSeason: String,
  },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('WeatherData', weatherDataSchema);
