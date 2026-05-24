const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  businessIdeaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessIdea',
    required: true
  },
  title: { type: String, required: true },
  overview: { type: String },

  validation: {
    steps: [{
      order: Number,
      title: String,
      description: String,
      tips: [String],
      estimatedDays: Number
    }],
    marketResearchGuide: String
  },

  skillsAndTools: {
    requiredSkills: [{
      name: String,
      importance: { type: String, enum: ['must-have', 'nice-to-have'] },
      learningResources: [String]
    }],
    recommendedTools: [{
      name: String,
      purpose: String,
      cost: String,
      link: String
    }]
  },

  legalSteps: [{
    order: Number,
    title: String,
    description: String,
    documents: [String],
    estimatedCost: String,
    timeframe: String,
    authority: String
  }],

  costEstimation: {
    startup: [{
      item: String,
      minCost: Number,
      maxCost: Number,
      currency: { type: String, default: 'INR' },
      isOptional: Boolean
    }],
    monthly: [{
      item: String,
      minCost: Number,
      maxCost: Number,
      currency: { type: String, default: 'INR' }
    }],
    totalStartupMin: Number,
    totalStartupMax: Number
  },

  marketingBasics: {
    targetCustomers: String,
    channels: [{
      name: String,
      description: String,
      cost: String,
      effectiveness: { type: String, enum: ['low', 'medium', 'high'] }
    }],
    pricingStrategy: String,
    usp: String
  },

  milestones: [{
    order: Number,
    title: String,
    description: String,
    targetWeek: Number
  }],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', RoadmapSchema);
