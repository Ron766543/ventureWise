const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const BusinessIdea = require('../models/BusinessIdea');
const Roadmap = require('../models/Roadmap');
const { Mentor, Resource } = require('../models/index');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/venturewise';

const sampleIdeas = [
  {
    title: 'Home Tuition Services',
    description: 'Provide personalized tutoring for school students in your neighbourhood. Teach subjects you are confident in, set your own schedule, and earn from home.',
    category: 'education',
    targetAudience: 'School students and parents',
    requiredSkills: ['Teaching', 'Communication', 'Patience'],
    requiredCapital: { min: 0, max: 5000, currency: 'INR' },
    difficulty: 'low',
    timeToProfit: '1–2 months',
    marketDemand: 'very-high',
    tags: ['education', 'tutoring', 'home-based', 'low-investment'],
    suitableFor: ['women', 'youth', 'rural'],
    icon: '📚',
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Tiffin / Meal Delivery Service',
    description: 'Prepare and deliver home-cooked meals to office workers, students, and bachelors. Low startup cost, high demand in urban and semi-urban areas.',
    category: 'food-beverage',
    targetAudience: 'Office workers, students, bachelors',
    requiredSkills: ['Cooking', 'Time management', 'Hygiene'],
    requiredCapital: { min: 5000, max: 30000, currency: 'INR' },
    difficulty: 'low',
    timeToProfit: '1–3 months',
    marketDemand: 'very-high',
    tags: ['food', 'tiffin', 'home-based', 'women-friendly'],
    suitableFor: ['women', 'rural'],
    icon: '🍱',
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Handcraft & Jute Products',
    description: 'Create and sell eco-friendly jute bags, baskets, and home decor items. Sell through local markets, exhibitions, and online platforms like Etsy or Meesho.',
    category: 'crafts-handmade',
    requiredSkills: ['Crafting', 'Creativity', 'Basic sewing'],
    requiredCapital: { min: 3000, max: 20000, currency: 'INR' },
    difficulty: 'low',
    timeToProfit: '2–4 months',
    marketDemand: 'medium',
    tags: ['crafts', 'eco-friendly', 'handmade', 'export-potential'],
    suitableFor: ['women', 'rural', 'youth'],
    icon: '🎨',
    isApproved: true,
    isFeatured: false
  },
  {
    title: 'Mobile Phone Repair Shop',
    description: 'Offer smartphone and feature phone repair services in your locality. With a short course and basic tools, you can start from a small shop or even from home.',
    category: 'services',
    requiredSkills: ['Technical aptitude', 'Electronics basics', 'Customer service'],
    requiredCapital: { min: 15000, max: 60000, currency: 'INR' },
    difficulty: 'medium',
    timeToProfit: '2–4 months',
    marketDemand: 'high',
    tags: ['repair', 'mobile', 'technical', 'youth-friendly'],
    suitableFor: ['youth'],
    icon: '📱',
    isApproved: true,
    isFeatured: false
  },
  {
    title: 'Organic Vegetable Farming',
    description: 'Grow and sell organic vegetables using small land plots. Supply to local markets, restaurants, and directly to consumers. Eligible for government organic farming subsidies.',
    category: 'agriculture',
    requiredSkills: ['Farming knowledge', 'Physical stamina', 'Basic record keeping'],
    requiredCapital: { min: 10000, max: 50000, currency: 'INR' },
    difficulty: 'medium',
    timeToProfit: '3–6 months',
    marketDemand: 'high',
    tags: ['agriculture', 'organic', 'rural', 'sustainable'],
    suitableFor: ['rural', 'women'],
    icon: '🌱',
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Digital Marketing Freelancing',
    description: 'Help local businesses with social media management, SEO, and online advertising. Start with free tools and build a portfolio of small clients.',
    category: 'technology',
    requiredSkills: ['Social media', 'Content writing', 'Analytics basics'],
    requiredCapital: { min: 0, max: 10000, currency: 'INR' },
    difficulty: 'medium',
    timeToProfit: '1–3 months',
    marketDemand: 'very-high',
    tags: ['digital', 'marketing', 'freelance', 'remote'],
    suitableFor: ['youth'],
    icon: '💻',
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Beauty Salon / Parlour',
    description: 'Provide beauty and grooming services from home or a small rented space. Offer haircuts, facials, threading, and bridal makeup services.',
    category: 'beauty-wellness',
    requiredSkills: ['Beauty skills', 'Customer service', 'Hygiene'],
    requiredCapital: { min: 20000, max: 80000, currency: 'INR' },
    difficulty: 'low',
    timeToProfit: '2–4 months',
    marketDemand: 'high',
    tags: ['beauty', 'salon', 'women-friendly', 'local-service'],
    suitableFor: ['women', 'youth'],
    icon: '💅',
    isApproved: true,
    isFeatured: false
  },
  {
    title: 'Poultry / Egg Farming',
    description: 'Raise chickens for eggs and meat in your backyard or small farm. Start small with 50–100 birds and scale gradually with growing demand.',
    category: 'agriculture',
    requiredSkills: ['Animal care', 'Basic veterinary knowledge', 'Business basics'],
    requiredCapital: { min: 20000, max: 100000, currency: 'INR' },
    difficulty: 'medium',
    timeToProfit: '3–6 months',
    marketDemand: 'high',
    tags: ['poultry', 'farming', 'rural', 'animal-husbandry'],
    suitableFor: ['rural'],
    icon: '🐓',
    isApproved: true,
    isFeatured: false
  }
];

const sampleResources = [
  {
    title: 'How to Register a Sole Proprietorship in India',
    description: 'Step-by-step guide to legally registering your small business in India.',
    type: 'article',
    category: 'legal',
    url: 'https://www.mca.gov.in',
    tags: ['legal', 'registration', 'india'],
    difficulty: 'beginner',
    language: 'English',
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Marketing on a Shoestring Budget',
    description: 'Learn how to market your business effectively with little to no money using WhatsApp, Facebook, and local networks.',
    type: 'video',
    category: 'marketing',
    url: 'https://youtube.com',
    tags: ['marketing', 'low-budget', 'social-media'],
    duration: '18 min',
    difficulty: 'beginner',
    language: 'Hindi',
    isApproved: true,
    isFeatured: false
  },
  {
    title: 'Business Plan Template for Beginners',
    description: 'A simple, fillable business plan template designed for first-time entrepreneurs.',
    type: 'template',
    category: 'planning',
    tags: ['business-plan', 'template', 'beginner'],
    difficulty: 'beginner',
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'GST Registration Checklist',
    description: 'Complete checklist of documents and steps required for GST registration.',
    type: 'checklist',
    category: 'legal',
    tags: ['gst', 'legal', 'checklist'],
    difficulty: 'beginner',
    isApproved: true,
    isFeatured: false
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      BusinessIdea.deleteMany({}),
      Roadmap.deleteMany({}),
      Mentor.deleteMany({}),
      Resource.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'VentureWise Admin',
      email: 'admin@venturewise.in',
      password: 'Admin@123',
      role: 'admin',
      isActive: true,
      assessmentCompleted: true
    });

    // Create sample mentor user
    const mentorUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya.mentor@venturewise.in',
      password: 'Mentor@123',
      role: 'mentor',
      bio: 'Serial entrepreneur with 12 years of experience in rural business development and women empowerment.',
      location: 'Jaipur, Rajasthan',
      isActive: true,
      assessmentCompleted: true
    });

    // Create sample regular user
    await User.create({
      name: 'Sunita Devi',
      email: 'sunita@example.com',
      password: 'User@123',
      role: 'user',
      location: 'Patna, Bihar',
      isActive: true,
      skills: [{ name: 'Cooking', level: 'advanced' }, { name: 'Sewing', level: 'intermediate' }],
      interests: ['food-beverage', 'crafts-handmade'],
      assessmentCompleted: true
    });

    // Create mentor profile
    await Mentor.create({
      user: mentorUser._id,
      headline: 'Rural Business Development Expert | 12+ Years Experience',
      expertise: ['Food Business', 'Rural Entrepreneurship', 'Women Empowerment', 'Microfinance'],
      industries: ['food-beverage', 'agriculture', 'crafts-handmade'],
      yearsOfExperience: 12,
      languages: ['Hindi', 'English', 'Rajasthani'],
      availability: { hoursPerWeek: 5, preferredTimes: ['Morning', 'Evening'] },
      isVerified: true,
      isActive: true,
      rating: 4.8,
      totalReviews: 47,
      totalMentees: 120
    });

    // Create business ideas
    const ideaRefs = await BusinessIdea.insertMany(
      sampleIdeas.map(idea => ({ ...idea, createdBy: admin._id }))
    );

    // Create a sample roadmap for the first idea (Tiffin Service)
    const tiffinIdea = ideaRefs.find(i => i.title === 'Tiffin / Meal Delivery Service');
    if (tiffinIdea) {
      const roadmap = await Roadmap.create({
        businessIdeaId: tiffinIdea._id,
        title: 'Tiffin Service Launch Roadmap',
        overview: 'A 12-week roadmap to launch your home-based tiffin service successfully.',
        validation: {
          steps: [
            { order: 1, title: 'Survey your neighbourhood', description: 'Talk to 20 potential customers about their meal preferences and willingness to pay.', estimatedDays: 3 },
            { order: 2, title: 'Test with 5 trial customers', description: 'Offer free or discounted tiffins for a week to collect genuine feedback.', estimatedDays: 7 },
            { order: 3, title: 'Refine your menu', description: 'Based on feedback, finalise a 5-day rotating menu.', estimatedDays: 2 }
          ]
        },
        skillsAndTools: {
          requiredSkills: [
            { name: 'Cooking', importance: 'must-have' },
            { name: 'Time management', importance: 'must-have' },
            { name: 'Basic bookkeeping', importance: 'nice-to-have' }
          ],
          recommendedTools: [
            { name: 'WhatsApp Business', purpose: 'Customer communication & orders', cost: 'Free' },
            { name: 'Google Sheets', purpose: 'Track orders and expenses', cost: 'Free' }
          ]
        },
        legalSteps: [
          { order: 1, title: 'FSSAI Food License', description: 'Apply for a basic FSSAI registration for home-based food business.', documents: ['Aadhaar Card', 'Address Proof', 'Passport Photo'], estimatedCost: '₹100', timeframe: '7–15 days', authority: 'FSSAI (fssai.gov.in)' }
        ],
        costEstimation: {
          startup: [
            { item: 'Cooking vessels & equipment', minCost: 3000, maxCost: 8000, currency: 'INR' },
            { item: 'Packaging (tiffin boxes)', minCost: 2000, maxCost: 5000, currency: 'INR' },
            { item: 'FSSAI registration', minCost: 100, maxCost: 100, currency: 'INR' },
            { item: 'Initial ingredients (1 month)', minCost: 5000, maxCost: 10000, currency: 'INR' }
          ],
          monthly: [
            { item: 'Ingredients', minCost: 8000, maxCost: 15000, currency: 'INR' },
            { item: 'Packaging', minCost: 500, maxCost: 1500, currency: 'INR' },
            { item: 'Gas / fuel', minCost: 500, maxCost: 1000, currency: 'INR' }
          ],
          totalStartupMin: 10100,
          totalStartupMax: 23100
        },
        marketingBasics: {
          targetCustomers: 'Office workers, students, and bachelors aged 18–45 within 3 km radius',
          channels: [
            { name: 'WhatsApp Groups', description: 'Share daily menu in local WhatsApp groups', cost: 'Free', effectiveness: 'high' },
            { name: 'Word of Mouth', description: 'Give referral discounts to existing customers', cost: 'Free', effectiveness: 'high' },
            { name: 'Local Flyers', description: 'Distribute pamphlets at offices and hostels', cost: '₹500–1000', effectiveness: 'medium' }
          ],
          pricingStrategy: 'Charge ₹50–80 per tiffin depending on the number of items. Offer a monthly subscription discount.',
          usp: 'Home-cooked, hygienic, affordable meals — delivered fresh daily.'
        },
        milestones: [
          { order: 1, title: 'Customer validation complete', description: 'Talk to 20 potential customers', targetWeek: 1 },
          { order: 2, title: 'Trial run complete', description: '5 trial customers served and feedback collected', targetWeek: 2 },
          { order: 3, title: 'FSSAI registration applied', description: 'Legal paperwork submitted', targetWeek: 3 },
          { order: 4, title: 'First 10 paying customers', description: 'Soft launch with real subscribers', targetWeek: 6 },
          { order: 5, title: 'Break-even reached', description: 'Monthly revenue covers all costs', targetWeek: 10 },
          { order: 6, title: 'Scale to 25+ customers', description: 'Expand delivery radius or hire helper', targetWeek: 12 }
        ],
        createdBy: admin._id
      });

      await BusinessIdea.findByIdAndUpdate(tiffinIdea._id, { roadmap: roadmap._id });
    }

    // Add resources
    await Resource.insertMany(sampleResources.map(r => ({ ...r, uploadedBy: admin._id })));

    console.log('\n✅ Database seeded successfully!');
    console.log('   Admin:  admin@venturewise.in / Admin@123');
    console.log('   Mentor: priya.mentor@venturewise.in / Mentor@123');
    console.log('   User:   sunita@example.com / User@123\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
