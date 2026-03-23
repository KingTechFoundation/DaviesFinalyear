const express = require('express');
const router = express.Router();
const { getAdvice, chatWithAI, predictPest } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/advise', protect, getAdvice);
router.post('/chat', protect, chatWithAI);
router.post('/predict-pest', protect, predictPest);

module.exports = router;
