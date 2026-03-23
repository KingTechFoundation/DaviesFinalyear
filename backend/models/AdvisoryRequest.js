const mongoose = require('mongoose');

const advisoryRequestSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  agronomistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Pest Control', 'Soil Health', 'Irrigation', 'General Advice', 'Market Help'],
    default: 'General Advice'
  },
  status: { 
    type: String, 
    enum: ['pending', 'responded', 'closed'], 
    default: 'pending' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  location: { type: String }, // District/Sector for regional filtering
  response: {
    message: String,
    respondedAt: Date,
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeArticle' }]
  }
}, { timestamps: true });

module.exports = mongoose.model('AdvisoryRequest', advisoryRequestSchema);
