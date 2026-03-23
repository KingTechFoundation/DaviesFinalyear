const express = require('express');
const router = express.Router();
const {
  getGuides, getVideos, getSchemes, searchKnowledge, incrementViews
} = require('../controllers/knowledgeController');

router.get('/guides',  getGuides);
router.get('/videos',  getVideos);
router.get('/schemes', getSchemes);
router.get('/search',  searchKnowledge);
router.post('/:id/view', incrementViews);

module.exports = router;
