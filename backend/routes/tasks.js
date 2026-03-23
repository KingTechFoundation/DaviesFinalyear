const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, getTimeline, upsertTimeline } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/timeline').get(protect, getTimeline).post(protect, upsertTimeline);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
