const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  farmLocation: { type: String, default: 'Musanze District, Northern Province' },
  language: { type: String, enum: ['english', 'kinyarwanda', 'french'], default: 'english' },
  units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
  notifications: {
    weather: { type: Boolean, default: true },
    pest: { type: Boolean, default: true },
    tasks: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
  },
  role: { 
    type: String, 
    enum: ['farmer', 'agronomist', 'policymaker'], 
    default: 'farmer' 
  },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
