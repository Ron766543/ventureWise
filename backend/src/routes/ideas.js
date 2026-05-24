const express = require('express');
const router = express.Router();
const BusinessIdea = require('../models/BusinessIdea');
const User = require('../models/User');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// @route   GET /api/ideas
// @desc    Get all approved ideas with filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, difficulty, capital, search, suitableFor, page = 1, limit = 12 } = req.query;

    const query = { isApproved: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (suitableFor) query.suitableFor = { $in: suitableFor.split(',') };
    if (capital) {
      query['requiredCapital.min'] = { $lte: parseInt(capital) };
    }
    if (search) {
      query.$text = { $search: search };
    }

    const total = await BusinessIdea.countDocuments(query);
    const ideas = await BusinessIdea.find(query)
      .populate('roadmap', '_id title')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: ideas.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: ideas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/ideas/recommended
// @desc    Get personalized idea recommendations based on user profile
// @access  Private
router.get('/recommended', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const query = { isApproved: true };

    // Match ideas by user skills and interests
    if (user.skills && user.skills.length > 0) {
      const skillNames = user.skills.map(s => s.name);
      query.requiredSkills = { $in: skillNames };
    }

    // Capital-based filtering
    if (user.availableCapital) {
      query['requiredCapital.min'] = { $lte: user.availableCapital };
    }

    let ideas = await BusinessIdea.find(query)
      .populate('roadmap', '_id title')
      .sort({ isFeatured: -1, saveCount: -1 })
      .limit(8);

    // If not enough, add featured ideas
    if (ideas.length < 4) {
      const featured = await BusinessIdea.find({ isApproved: true, isFeatured: true })
        .populate('roadmap', '_id title')
        .limit(8);
      const existing = new Set(ideas.map(i => i._id.toString()));
      ideas = [...ideas, ...featured.filter(f => !existing.has(f._id.toString()))].slice(0, 8);
    }

    res.json({ success: true, data: ideas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/ideas/:id
// @desc    Get single idea
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const idea = await BusinessIdea.findById(req.params.id).populate('roadmap');
    if (!idea || !idea.isApproved) {
      return res.status(404).json({ success: false, message: 'Business idea not found' });
    }

    // Increment view count
    idea.viewCount += 1;
    await idea.save({ validateBeforeSave: false });

    res.json({ success: true, data: idea });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/ideas/:id/save
// @desc    Save/unsave an idea
// @access  Private
router.post('/:id/save', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const idea = await BusinessIdea.findById(req.params.id);
    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });

    const savedIndex = user.savedIdeas.indexOf(req.params.id);
    let action;

    if (savedIndex === -1) {
      user.savedIdeas.push(req.params.id);
      idea.saveCount += 1;
      action = 'saved';
    } else {
      user.savedIdeas.splice(savedIndex, 1);
      idea.saveCount = Math.max(0, idea.saveCount - 1);
      action = 'unsaved';
    }

    await user.save({ validateBeforeSave: false });
    await idea.save({ validateBeforeSave: false });

    res.json({ success: true, action, savedIdeas: user.savedIdeas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/ideas  (Admin only)
// @route   PUT /api/ideas/:id  (Admin only)
// @route   DELETE /api/ideas/:id  (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const idea = await BusinessIdea.create(req.body);
    res.status(201).json({ success: true, data: idea });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const idea = await BusinessIdea.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });
    res.json({ success: true, data: idea });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await BusinessIdea.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Idea deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
