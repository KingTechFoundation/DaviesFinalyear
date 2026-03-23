const express = require('express');
const router = express.Router();
const { getInputs, createInput } = require('../controllers/inputController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getInputs).post(protect, createInput);

module.exports = router;
