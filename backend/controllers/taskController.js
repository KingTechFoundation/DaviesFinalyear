const { FarmingTask, SeasonalTimeline } = require('../models/FarmingTask');

// @desc    Get all tasks for a user (optionally filter by status)
// @route   GET /api/tasks?status=pending
const getTasks = async (req, res) => {
  try {
    const query = { userId: req.user._id };
    if (req.query.status) query.status = req.query.status;
    const tasks = await FarmingTask.find(query).sort({ date: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const task = await FarmingTask.create({ ...req.body, userId: req.user._id });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await FarmingTask.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await FarmingTask.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seasonal timeline for a user
// @route   GET /api/tasks/timeline
const getTimeline = async (req, res) => {
  try {
    const timeline = await SeasonalTimeline.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upsert a seasonal timeline phase
// @route   POST /api/tasks/timeline
const upsertTimeline = async (req, res) => {
  try {
    const { phase, status, dates, activities, season } = req.body;
    const timeline = await SeasonalTimeline.findOneAndUpdate(
      { userId: req.user._id, phase },
      { phase, status, dates, activities, season, userId: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(timeline);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTimeline, upsertTimeline };
