const mongoose = require('mongoose');

const BusinessIdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'agriculture', 'food-beverage', 'retail', 'crafts-handmade',
      'technology', 'education', 'healthcare', 'beauty-wellness',
      'fashion', 'services', 'manufacturing', 'tourism', 'finance', 'other'
    ]
  },
  targetAudience: { type: String },
  requiredSkills: [{ type: String }],
  requiredCapital: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100000 },
    currency: { type: String, default: 'INR' }
  },
  difficulty: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  timeToProfit: { type: String }, // e.g. "3-6 months"
  marketDemand: {
    type: String,
    enum: ['low', 'medium', 'high', 'very-high'],
    default: 'medium'
  },
  tags: [{ type: String }],
  suitableFor: [{ type: String }], // e.g. ['women', 'youth', 'rural']
  icon: { type: String, default: '💡' },
  coverImage: { type: String, default: '' },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  roadmap: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' },
  viewCount: { type: Number, default: 0 },
  saveCount: { type: Number, default: 0 }
}, { timestamps: true });

// Text index for search
BusinessIdeaSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('BusinessIdea', BusinessIdeaSchema);
