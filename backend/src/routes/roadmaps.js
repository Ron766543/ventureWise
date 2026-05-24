// roadmaps.js
const express = require('express');
const router = express.Router();
const Roadmap = require('../models/Roadmap');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id).populate('businessIdeaId', 'title category icon');
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
    res.json({ success: true, data: roadmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const roadmap = await Roadmap.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, data: roadmap });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: roadmap });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
