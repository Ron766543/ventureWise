// users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/saved-ideas', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedIdeas');
    res.json({ success: true, data: user.savedIdeas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
