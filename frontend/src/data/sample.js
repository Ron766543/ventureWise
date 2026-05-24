export const SAMPLE_IDEAS = [
  {
    _id: '1', title: 'Home Tuition Services',
    description: 'Provide personalised tutoring for school students in your neighbourhood. Teach subjects you are confident in, set your own schedule, and earn from home.',
    category: 'education', difficulty: 'low', marketDemand: 'very-high', timeToProfit: '1–2 months',
    requiredCapital: { min: 0, max: 5000, currency: 'INR' },
    requiredSkills: ['Teaching', 'Communication', 'Patience'],
    suitableFor: ['women', 'youth', 'rural'], icon: '📚',
    isFeatured: true, viewCount: 1240, saveCount: 89,
    roadmap: { _id: 'r1', title: 'Tuition Business Roadmap' }
  },
  {
    _id: '2', title: 'Tiffin / Meal Delivery',
    description: 'Prepare and deliver home-cooked meals to office workers and students. Low startup cost with very high demand in urban and semi-urban areas.',
    category: 'food-beverage', difficulty: 'low', marketDemand: 'very-high', timeToProfit: '1–3 months',
    requiredCapital: { min: 5000, max: 30000, currency: 'INR' },
    requiredSkills: ['Cooking', 'Time management', 'Hygiene'],
    suitableFor: ['women', 'rural'], icon: '🍱',
    isFeatured: true, viewCount: 2100, saveCount: 145,
    roadmap: { _id: 'r2', title: 'Tiffin Service Launch Roadmap' }
  },
  {
    _id: '3', title: 'Digital Marketing Freelancing',
    description: 'Help local businesses grow online through social media management, SEO, and advertising campaigns. Start with free tools and build a client portfolio.',
    category: 'technology', difficulty: 'medium', marketDemand: 'very-high', timeToProfit: '1–3 months',
    requiredCapital: { min: 0, max: 10000, currency: 'INR' },
    requiredSkills: ['Social media', 'Content writing', 'Analytics basics'],
    suitableFor: ['youth'], icon: '💻',
    isFeatured: true, viewCount: 1890, saveCount: 112
  },
  {
    _id: '4', title: 'Handcraft & Jute Products',
    description: 'Create and sell eco-friendly jute bags and home decor through local markets and online platforms like Etsy, Meesho, or Amazon.',
    category: 'crafts-handmade', difficulty: 'low', marketDemand: 'medium', timeToProfit: '2–4 months',
    requiredCapital: { min: 3000, max: 20000, currency: 'INR' },
    requiredSkills: ['Crafting', 'Creativity', 'Basic sewing'],
    suitableFor: ['women', 'rural'], icon: '🎨',
    isFeatured: false, viewCount: 780, saveCount: 56
  },
  {
    _id: '5', title: 'Organic Vegetable Farming',
    description: 'Grow and sell organic vegetables using small land plots. Supply to local markets, restaurants, and directly to consumers.',
    category: 'agriculture', difficulty: 'medium', marketDemand: 'high', timeToProfit: '3–6 months',
    requiredCapital: { min: 10000, max: 50000, currency: 'INR' },
    requiredSkills: ['Farming knowledge', 'Physical stamina', 'Record keeping'],
    suitableFor: ['rural', 'women'], icon: '🌱',
    isFeatured: true, viewCount: 1340, saveCount: 78
  },
  {
    _id: '6', title: 'Mobile Phone Repair Shop',
    description: 'Offer smartphone and feature phone repair services locally. A short training course and basic tools are all you need to get started.',
    category: 'services', difficulty: 'medium', marketDemand: 'high', timeToProfit: '2–4 months',
    requiredCapital: { min: 15000, max: 60000, currency: 'INR' },
    requiredSkills: ['Technical aptitude', 'Electronics basics', 'Customer service'],
    suitableFor: ['youth'], icon: '📱',
    isFeatured: false, viewCount: 960, saveCount: 67
  },
  {
    _id: '7', title: 'Beauty Salon / Home Parlour',
    description: 'Provide beauty and grooming services from home or a small rented space. Offer haircuts, facials, threading, and bridal makeup.',
    category: 'beauty-wellness', difficulty: 'low', marketDemand: 'high', timeToProfit: '2–4 months',
    requiredCapital: { min: 20000, max: 80000, currency: 'INR' },
    requiredSkills: ['Beauty skills', 'Customer service', 'Hygiene'],
    suitableFor: ['women', 'youth'], icon: '💅',
    isFeatured: false, viewCount: 1100, saveCount: 90
  },
  {
    _id: '8', title: 'Poultry / Egg Farming',
    description: 'Raise chickens for eggs and meat in your backyard or small farm. Start small with 50–100 birds and scale gradually.',
    category: 'agriculture', difficulty: 'medium', marketDemand: 'high', timeToProfit: '3–6 months',
    requiredCapital: { min: 20000, max: 100000, currency: 'INR' },
    requiredSkills: ['Animal care', 'Basic veterinary knowledge'],
    suitableFor: ['rural'], icon: '🐓',
    isFeatured: false, viewCount: 620, saveCount: 45
  }
];

export const SAMPLE_MENTORS = [
  {
    _id: 'm1',
    user: { name:'Priya Sharma', avatar:'', location:'Jaipur, Rajasthan', bio:'Serial entrepreneur with 12 years in rural business development and women empowerment initiatives.' },
    headline: 'Rural Business Expert | Women Empowerment Advocate',
    expertise: ['Food Business','Rural Entrepreneurship','Microfinance','Marketing'],
    industries: ['food-beverage','agriculture'],
    yearsOfExperience: 12, languages: ['Hindi','English'],
    rating: 4.8, totalReviews: 47, totalMentees: 120, isVerified: true
  },
  {
    _id: 'm2',
    user: { name:'Rajan Kumar', avatar:'', location:'Pune, Maharashtra', bio:'Tech entrepreneur helping youth start digital businesses from scratch with zero budget.' },
    headline: 'Digital Entrepreneur | Startup Coach',
    expertise: ['Digital Marketing','E-Commerce','App Development','Social Media'],
    industries: ['technology'],
    yearsOfExperience: 8, languages: ['Hindi','English','Marathi'],
    rating: 4.6, totalReviews: 31, totalMentees: 85, isVerified: true
  },
  {
    _id: 'm3',
    user: { name:'Meena Iyer', avatar:'', location:'Chennai, Tamil Nadu', bio:'Fashion designer turned entrepreneur. Helped 200+ artisans take their crafts online.' },
    headline: 'Fashion & Crafts Entrepreneur | E-Commerce Expert',
    expertise: ['Fashion Design','E-Commerce','Crafts','Online Selling'],
    industries: ['fashion','crafts-handmade'],
    yearsOfExperience: 9, languages: ['Tamil','English','Hindi'],
    rating: 4.9, totalReviews: 62, totalMentees: 210, isVerified: true
  }
];

export const SAMPLE_RESOURCES = [
  { _id:'r1', title:'How to Register a Small Business in India', description:'Complete step-by-step guide to legally registering your small business using Udyam portal.',    type:'article',   category:'legal',    difficulty:'beginner', tags:['legal','registration','india'],  isApproved:true, isFeatured:true },
  { _id:'r2', title:'Marketing on a Shoestring Budget',         description:'Learn to market your business effectively using WhatsApp, Facebook, and local networks.',       type:'video',     category:'marketing',difficulty:'beginner', tags:['marketing','low-budget'],        duration:'18 min', isApproved:true },
  { _id:'r3', title:'Business Plan Template for Beginners',     description:'A simple, fillable business plan template designed for first-time entrepreneurs.',               type:'template',  category:'planning', difficulty:'beginner', tags:['business-plan','template'],      isApproved:true, isFeatured:true },
  { _id:'r4', title:'GST Registration Checklist',              description:'Complete checklist of all documents and steps needed for GST registration in India.',            type:'checklist', category:'legal',    difficulty:'beginner', tags:['gst','legal','checklist'],       isApproved:true },
  { _id:'r5', title:'Pricing Your Product or Service',          description:'How to calculate costs, set competitive prices, and maximise your profit margins.',              type:'guide',     category:'finance',  difficulty:'beginner', tags:['pricing','finance','margin'],    duration:'25 min', isApproved:true },
  { _id:'r6', title:'WhatsApp Business Setup Guide',           description:'Step-by-step guide to setting up WhatsApp Business for customer orders and communication.',     type:'guide',     category:'marketing',difficulty:'beginner', tags:['whatsapp','marketing','digital'],isApproved:true },
];

export const CATEGORIES = [
  { value:'agriculture',    label:'Agriculture',     icon:'🌱' },
  { value:'food-beverage',  label:'Food & Beverage', icon:'🍱' },
  { value:'retail',         label:'Retail',          icon:'🏪' },
  { value:'crafts-handmade',label:'Crafts & Handmade',icon:'🎨'},
  { value:'technology',     label:'Technology',      icon:'💻' },
  { value:'education',      label:'Education',       icon:'📚' },
  { value:'healthcare',     label:'Healthcare',      icon:'🏥' },
  { value:'beauty-wellness',label:'Beauty & Wellness',icon:'💅'},
  { value:'fashion',        label:'Fashion',         icon:'👗' },
  { value:'services',       label:'Services',        icon:'🔧' },
  { value:'manufacturing',  label:'Manufacturing',   icon:'🏭' },
  { value:'tourism',        label:'Tourism',         icon:'🏨' },
];

export const SKILLS_LIST = [
  'Cooking','Baking','Sewing','Crafting','Teaching','Communication',
  'Sales','Accounting','Computer Skills','Social Media','Photography',
  'Farming','Animal Care','Plumbing','Electrical Work','Carpentry',
  'Driving','Customer Service','Management','Design','Writing',
  'Technical Repair','Healthcare','Beauty & Makeup','Music','Dance',
];

export const DIFFICULTY_COLORS = {
  low:    'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100   text-amber-700',
  high:   'bg-red-100     text-red-700',
};

export const DEMAND_COLORS = {
  low:       'bg-slate-100  text-slate-600',
  medium:    'bg-blue-100   text-blue-700',
  high:      'bg-orange-100 text-orange-700',
  'very-high':'bg-emerald-100 text-emerald-700',
};

export const RESOURCE_TYPE_ICONS = {
  video:'🎬', article:'📄', checklist:'✅', template:'📋', guide:'📖', tool:'🔧'
};
