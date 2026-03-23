const express = require('express');
const router = express.Router();
const { getWeather, getForecast, getAlerts } = require('../controllers/weatherController');

router.get('/', getWeather);
router.get('/forecast', getForecast);
router.get('/alerts', getAlerts);

module.exports = router;
