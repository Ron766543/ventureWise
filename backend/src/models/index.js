const mongoose = require('mongoose');

// ─── Mentor Schema ──────────────────────────────────────────────────────────
const MentorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  headline: { type: String, maxlength: 200 },
  expertise: [{ type: String }],
  industries: [{ type: String }],
  yearsOfExperience: { type: Number, default: 0 },
  languages: [{ type: String }],
  availability: {
    hoursPerWeek: Number,
    preferredTimes: [String],
    timezone: String
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    website: String
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  verificationDocuments: [{ name: String, url: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalMentees: { type: Number, default: 0 },
  uploadedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }]
}, { timestamps: true });

// ─── Resource Schema ────────────────────────────────────────────────────────
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['video', 'article', 'checklist', 'template', 'guide', 'tool'],
    required: true
  },
  category: { type: String },
  url: { type: String },
  fileUrl: { type: String },
  thumbnail: { type: String, default: '' },
  tags: [{ type: String }],
  duration: { type: String },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  language: { type: String, default: 'English' },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessIdea' }],
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 }
}, { timestamps: true });

// ─── Progress Schema ────────────────────────────────────────────────────────
const ProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessIdea: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessIdea' },
  roadmap: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' },
  status: {
    type: String,
    enum: ['exploring', 'planning', 'in-progress', 'launched', 'paused'],
    default: 'exploring'
  },
  completedMilestones: [{ type: Number }],
  completedLegalSteps: [{ type: Number }],
  notes: { type: String, maxlength: 2000 },
  startDate: { type: Date, default: Date.now },
  targetLaunchDate: { type: Date },
  resourcesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  percentComplete: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });

// ─── Q&A Session Schema ─────────────────────────────────────────────────────
const QASessionSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true, maxlength: 2000 },
  answer: { type: String, maxlength: 5000 },
  status: { type: String, enum: ['pending', 'answered', 'closed'], default: 'pending' },
  category: { type: String },
  isPublic: { type: Boolean, default: false },
  upvotes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
  Mentor: mongoose.model('Mentor', MentorSchema),
  Resource: mongoose.model('Resource', ResourceSchema),
  Progress: mongoose.model('Progress', ProgressSchema),
  QASession: mongoose.model('QASession', QASessionSchema)
};
