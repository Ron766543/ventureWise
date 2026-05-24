// resources.js
const express = require('express');
const router = express.Router();
const { Resource } = require('../models/index');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { type, category, difficulty, search, page = 1, limit = 12 } = req.query;
    const query = { isApproved: true };
    if (type) query.type = type;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $in: [search] } }
    ];

    const total = await Resource.countDocuments(query);
    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name avatar')
      .sort({ isFeatured: -1, viewCount: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, total, data: resources });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, uploadedBy: req.user.id });
    res.status(201).json({ success: true, data: resource });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ success: true, data: resource });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
