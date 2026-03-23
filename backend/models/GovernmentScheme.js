const mongoose = require('mongoose');

const governmentSchemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  eligibility: { type: String },
  benefits: { type: String },
  deadline: { type: String, default: 'Rolling applications' },
  type: { type: String, enum: ['Subsidy', 'Infrastructure', 'Insurance', 'Equipment', 'Training'], default: 'Subsidy' },
  schemeUrl: { type: String },        // link to official application page
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('GovernmentScheme', governmentSchemeSchema);
