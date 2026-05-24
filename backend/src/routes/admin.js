// admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const BusinessIdea = require('../models/BusinessIdea');
const { Mentor, Resource, Progress } = require('../models/index');
const { protect, authorize } = require('../middleware/auth');

const adminOnly = [protect, authorize('admin')];

// GET /api/admin/stats — platform overview
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const [users, mentors, ideas, resources, progressEntries] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Mentor.countDocuments(),
      BusinessIdea.countDocuments({ isApproved: true }),
      Resource.countDocuments({ isApproved: true }),
      Progress.countDocuments()
    ]);
    const pendingResources = await Resource.countDocuments({ isApproved: false });
    const pendingMentors = await Mentor.countDocuments({ isVerified: false });

    res.json({ success: true, data: { users, mentors, ideas, resources, progressEntries, pendingResources, pendingMentors } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({ success: true, total, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/users/:id/toggle
router.put('/users/:id/toggle', ...adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/mentors/:id/verify
router.put('/mentors/:id/verify', ...adminOnly, async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
    res.json({ success: true, data: mentor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/pending-content
router.get('/pending-content', ...adminOnly, async (req, res) => {
  try {
    const [pendingResources, pendingMentors] = await Promise.all([
      Resource.find({ isApproved: false }).populate('uploadedBy', 'name email'),
      Mentor.find({ isVerified: false }).populate('user', 'name email')
    ]);
    res.json({ success: true, data: { pendingResources, pendingMentors } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
