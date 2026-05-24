// ─── mentors.js ─────────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const { Mentor, QASession } = require('../models/index');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// GET /api/mentors — list verified mentors
router.get('/', async (req, res) => {
  try {
    const { expertise, page = 1, limit = 12 } = req.query;
    const query = { isVerified: true, isActive: true };
    if (expertise) query.expertise = { $in: expertise.split(',') };

    const total = await Mentor.countDocuments(query);
    const mentors = await Mentor.find(query)
      .populate('user', 'name avatar bio location')
      .sort({ rating: -1, totalMentees: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, count: mentors.length, total, data: mentors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/mentors/:id — single mentor
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', 'name avatar bio location email')
      .populate('uploadedResources', 'title type description');
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });
    res.json({ success: true, data: mentor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/mentors/register — mentor registers profile
router.post('/register', protect, async (req, res) => {
  try {
    const existing = await Mentor.findOne({ user: req.user.id });
    if (existing) return res.status(400).json({ success: false, message: 'Mentor profile already exists' });

    const mentor = await Mentor.create({ ...req.body, user: req.user.id });
    await User.findByIdAndUpdate(req.user.id, { role: 'mentor' });
    res.status(201).json({ success: true, data: mentor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/mentors/:id/question — submit a question to a mentor
router.post('/:id/question', protect, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor not found' });

    const session = await QASession.create({
      mentor: mentor.user,
      mentee: req.user.id,
      question: req.body.question,
      category: req.body.category || 'general',
      isPublic: req.body.isPublic || false
    });
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/mentors/qa/mine — get my Q&A sessions (mentor)
router.get('/qa/mine', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const sessions = await QASession.find({ mentor: req.user.id })
      .populate('mentee', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/mentors/qa/:sessionId/answer — mentor answers
router.put('/qa/:sessionId/answer', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const session = await QASession.findOneAndUpdate(
      { _id: req.params.sessionId, mentor: req.user.id },
      { answer: req.body.answer, status: 'answered' },
      { new: true }
    );
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
