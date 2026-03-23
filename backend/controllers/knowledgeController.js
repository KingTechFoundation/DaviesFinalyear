const KnowledgeArticle = require('../models/KnowledgeArticle');
const GovernmentScheme = require('../models/GovernmentScheme');

// GET /api/knowledge/guides
const getGuides = async (req, res) => {
  try {
    const guides = await KnowledgeArticle.find({ type: 'guide' }).sort({ rating: -1 });
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/knowledge/videos
const getVideos = async (req, res) => {
  try {
    const videos = await KnowledgeArticle.find({ type: 'video' }).sort({ views: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/knowledge/schemes
const getSchemes = async (req, res) => {
  try {
    const schemes = await GovernmentScheme.find({ active: { $ne: false } }).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/knowledge/search?q=query
const searchKnowledge = async (req, res) => {
  try {
    const query = req.query.q || '';
    const regex = { $regex: query, $options: 'i' };
    const articles = await KnowledgeArticle.find({
      $or: [{ title: regex }, { description: regex }, { crops: regex }],
    });
    const schemes = await GovernmentScheme.find({
      $or: [{ title: regex }, { description: regex }],
    });
    res.json({ articles, schemes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/knowledge/:id/view  – increment view count
const incrementViews = async (req, res) => {
  try {
    const article = await KnowledgeArticle.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ views: article.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGuides, getVideos, getSchemes, searchKnowledge, incrementViews };
