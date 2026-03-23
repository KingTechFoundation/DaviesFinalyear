const mongoose = require('mongoose');

const knowledgeArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['guide', 'video'], required: true },
  crops: [String],
  // for guides
  content: { type: String },          // markdown / long text body
  duration: { type: String },
  downloads: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  offline: { type: Boolean, default: false },
  // for videos
  videoUrl: { type: String },         // YouTube embed URL or direct MP4
  thumbnailUrl: { type: String },
  language: { type: String, default: 'English' },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeArticle', knowledgeArticleSchema);
