const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'mentor', 'admin'],
    default: 'user'
  },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, maxlength: 500, default: '' },

  // Skill & Interest Profiling
  skills: [{
    name: { type: String },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
  }],
  interests: [{ type: String }],
  experience: { type: String, default: '' },
  education: { type: String, default: '' },
  availableCapital: { type: Number, default: 0 },

  // Saved/Bookmarked ideas
  savedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessIdea' }],

  // Account status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

  // Assessment completed flag
  assessmentCompleted: { type: Boolean, default: false },

  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
