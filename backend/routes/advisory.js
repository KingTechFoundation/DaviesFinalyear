const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  respondToRequest,
  deleteRequest
} = require('../controllers/advisoryController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getRequests)
  .post(protect, createRequest);

router.route('/:id')
  .delete(protect, deleteRequest);

router.route('/:id/respond')
  .put(protect, respondToRequest);

module.exports = router;
