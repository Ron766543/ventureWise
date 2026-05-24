// progress.js
const express = require('express');
const router = express.Router();
const { Progress } = require('../models/index');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('businessIdea', 'title category icon')
      .populate('roadmap', 'title milestones');
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const existing = await Progress.findOne({ user: req.user.id, businessIdea: req.body.businessIdea });
    if (existing) return res.status(400).json({ success: false, message: 'Progress entry already exists for this idea' });
    const progress = await Progress.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: progress });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const progress = await Progress.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body, { new: true, runValidators: true }
    );
    if (!progress) return res.status(404).json({ success: false, message: 'Progress not found' });
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
