// assessments.js — saves user skill/interest profile
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { skills, interests, experience, education, availableCapital } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skills, interests, experience, education, availableCapital, assessmentCompleted: true },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Assessment saved', data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('skills interests experience education availableCapital assessmentCompleted');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
