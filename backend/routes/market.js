const express = require('express');
const router = express.Router();
const { getMarketPrices, updateMarketPrice } = require('../controllers/marketController');

router.get('/', getMarketPrices);
router.put('/:id', updateMarketPrice);

module.exports = router;
