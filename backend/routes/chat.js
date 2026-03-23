const express = require('express');
const router = express.Router();
const { getChatHistory, sendMessage, clearChat } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getChatHistory).post(protect, sendMessage).delete(protect, clearChat);

module.exports = router;
