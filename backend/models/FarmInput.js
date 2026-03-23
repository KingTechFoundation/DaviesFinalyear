const mongoose = require('mongoose');

const farmInputSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  date: { type: Date, required: true },
  crop: { type: String, required: true },
  input: { type: String, required: true },
  quantity: { type: String },
  purpose: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('FarmInput', farmInputSchema);
