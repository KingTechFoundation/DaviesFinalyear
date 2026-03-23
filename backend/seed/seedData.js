const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Models
const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilAnalysis = require('../models/SoilAnalysis');
const WeatherData = require('../models/WeatherData');
const { PestScan, CommonPest } = require('../models/PestScan');
const { FarmingTask, SeasonalTimeline } = require('../models/FarmingTask');
const FarmInput = require('../models/FarmInput');
const KnowledgeArticle = require('../models/KnowledgeArticle');
const MarketPrice = require('../models/MarketPrice');
const GovernmentScheme = require('../models/GovernmentScheme');
const ChatMessage = require('../models/ChatMessage');
const AnalyticsData = require('../models/AnalyticsData');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');

    await User.deleteMany({});
    await Farm.deleteMany({});
    await Crop.deleteMany({});
    await SoilAnalysis.deleteMany({});
    await WeatherData.deleteMany({});
    await PestScan.deleteMany({});
    await CommonPest.deleteMany({});
    await FarmingTask.deleteMany({});
    await SeasonalTimeline.deleteMany({});
    await FarmInput.deleteMany({});
    await KnowledgeArticle.deleteMany({});
    await MarketPrice.deleteMany({});
    await GovernmentScheme.deleteMany({});
    await ChatMessage.deleteMany({});
    await AnalyticsData.deleteMany({});

    console.log('👤 Creating default user...');
    const user = await User.create({
      name: 'Muhabwe Davies',
      email: 'davies@agriguide.rw',
      phone: '+250 788 123 456',
      password: 'password123',
      farmLocation: 'Musanze District, Northern Province',
      language: 'english',
      units: 'metric',
      notifications: { weather: true, pest: true, tasks: true, sms: false, push: true, email: true },
    });

    console.log('🏡 Creating farms...');
    const farm1 = await Farm.create({
      userId: user._id,
      name: 'Main Farm',
      location: 'Musanze District, Northern Province',
      size: 2.0,
      unit: 'hectares',
      coordinates: '-1.5008, 29.6346',
      soilType: 'Clay Loam',
      plots: 3,
    });
    const farm2 = await Farm.create({
      userId: user._id,
      name: 'Valley Plot',
      location: 'Musanze District, Northern Province',
      size: 0.5,
      unit: 'hectares',
      coordinates: '-1.5012, 29.6350',
      soilType: 'Sandy Loam',
      plots: 1,
    });

    console.log('🌱 Creating crops...');
    await Crop.create([
      {
        userId: user._id, farmId: farm1._id,
        crop: 'Maize', variety: 'Hybrid ZM521', plot: 'Main Farm - Plot A',
        area: 1.2, plantingDate: new Date('2025-10-20'), expectedHarvest: new Date('2026-01-10'),
        growthStage: 'Vegetative', health: 'Excellent', progress: 65,
      },
      {
        userId: user._id, farmId: farm1._id,
        crop: 'Common Beans', variety: 'RWR 2245', plot: 'Main Farm - Plot B',
        area: 0.5, plantingDate: new Date('2025-11-03'), expectedHarvest: new Date('2026-01-25'),
        growthStage: 'Germination', health: 'Good', progress: 25,
      },
      {
        userId: user._id, farmId: farm2._id,
        crop: 'Irish Potatoes', variety: 'Kinigi', plot: 'Valley Plot',
        area: 0.3, plantingDate: new Date('2025-10-25'), expectedHarvest: new Date('2026-01-20'),
        growthStage: 'Tuber Formation', health: 'Excellent', progress: 55,
      },
    ]);

    console.log('🧪 Creating soil analysis...');
    await SoilAnalysis.create({
      userId: user._id, farmId: farm1._id,
      overallHealth: 87, overallStatus: 'Excellent', soilType: 'Clay Loam',
      location: 'Musanze, Northern Province',
      analysisDate: new Date('2025-11-05'),
      metrics: [
        { label: 'pH Level', value: 6.5, optimal: '6.0-7.0', status: 'good', progress: 75 },
        { label: 'Nitrogen (N)', value: 45, optimal: '40-60 mg/kg', status: 'good', progress: 70 },
        { label: 'Phosphorus (P)', value: 28, optimal: '25-50 mg/kg', status: 'good', progress: 56 },
        { label: 'Potassium (K)', value: 180, optimal: '150-250 mg/kg', status: 'good', progress: 65 },
        { label: 'Organic Matter', value: 3.2, optimal: '3-5%', status: 'good', progress: 64 },
        { label: 'Moisture', value: 22, optimal: '20-30%', status: 'good', progress: 73 },
      ],
      recommendedCrops: [
        { name: 'Maize (Corn)', suitability: 95, yield: '4.5-6 tons/hectare', season: 'Season A & B' },
        { name: 'Common Beans', suitability: 90, yield: '1.2-1.8 tons/hectare', season: 'Season A & B' },
        { name: 'Irish Potatoes', suitability: 88, yield: '15-25 tons/hectare', season: 'Season A' },
        { name: 'Wheat', suitability: 85, yield: '2.5-3.5 tons/hectare', season: 'Season B' },
      ],
      recommendations: [
        { title: 'Maintain Current pH', description: 'Your soil pH is optimal. Continue current management practices.', priority: 'low' },
        { title: 'Boost Phosphorus', description: 'Consider adding rock phosphate or compost to increase P levels.', priority: 'medium' },
        { title: 'Organic Matter Enhancement', description: 'Add 2-3 tons of compost per hectare to improve soil structure.', priority: 'high' },
      ],
    });

    console.log('🌤️ Creating weather data...');
    await WeatherData.create({
      location: 'Musanze District',
      current: { temp: 24, condition: 'Partly Cloudy', humidity: 65, wind: 12, rainfall: 0, uvIndex: 6 },
      forecast: [
        { day: 'Today', icon: 'Cloud', temp: { high: 26, low: 18 }, rain: 20, condition: 'Partly Cloudy' },
        { day: 'Tomorrow', icon: 'CloudRain', temp: { high: 23, low: 17 }, rain: 80, condition: 'Rain Expected' },
        { day: 'Wednesday', icon: 'CloudRain', temp: { high: 22, low: 16 }, rain: 70, condition: 'Light Rain' },
        { day: 'Thursday', icon: 'Cloud', temp: { high: 24, low: 17 }, rain: 30, condition: 'Cloudy' },
        { day: 'Friday', icon: 'Sun', temp: { high: 27, low: 19 }, rain: 10, condition: 'Sunny' },
        { day: 'Saturday', icon: 'Sun', temp: { high: 28, low: 20 }, rain: 5, condition: 'Clear' },
        { day: 'Sunday', icon: 'Cloud', temp: { high: 25, low: 18 }, rain: 25, condition: 'Partly Cloudy' },
      ],
      alerts: [
        { title: 'Heavy Rainfall Alert', message: 'Expected rainfall of 35mm in the next 48 hours. Delay irrigation and ensure proper drainage.', severity: 'warning', icon: 'CloudRain' },
        { title: 'Optimal Planting Window', message: 'Weather conditions favorable for bean planting from Friday. Soil moisture will be ideal.', severity: 'info', icon: 'Sun' },
      ],
      recommendations: [
        { activity: 'Irrigation', status: 'Skip Next 2 Days', reason: 'Rain expected - 35mm forecast' },
        { activity: 'Fertilizer Application', status: 'Postpone', reason: 'Heavy rain will wash away nutrients' },
        { activity: 'Pest Spraying', status: 'Wait Until Friday', reason: 'Sunny weather needed for effectiveness' },
        { activity: 'Harvesting', status: 'Safe to Proceed', reason: 'No rain today, proceed as planned' },
      ],
      monthlyData: [
        { month: 'Nov 1-10', rainfall: 45, avgTemp: 23 },
        { month: 'Nov 11-20', rainfall: 38, avgTemp: 24 },
        { month: 'Nov 21-30', rainfall: 52, avgTemp: 23 },
      ],
      climateZone: { region: 'Highland Tropical', altitude: '1,850m', annualRainfall: '1,200-1,500mm', growingSeason: 'Year-round' },
    });

    console.log('🐛 Creating pest data...');
    await PestScan.create([
      { userId: user._id, cropName: 'Maize', result: 'No pests detected', status: 'healthy', scanDate: new Date('2025-11-08') },
      { userId: user._id, cropName: 'Beans', detectedPest: 'Aphids (Aphidoidea)', severity: 'Low', confidence: 78, affectedArea: '5-8%', risk: 'low', result: 'Aphids - Low severity', status: 'warning', scanDate: new Date('2025-11-05') },
      { userId: user._id, cropName: 'Potatoes', result: 'No pests detected', status: 'healthy', scanDate: new Date('2025-11-01') },
    ]);

    await CommonPest.create([
      { name: 'Aphids', risk: 'Medium', season: 'Rainy Season', crops: 'Beans, Maize', region: 'Musanze' },
      { name: 'Fall Armyworm', risk: 'High', season: 'Year-round', crops: 'Maize, Wheat', region: 'Musanze' },
      { name: 'Bean Weevil', risk: 'Low', season: 'Storage', crops: 'Beans', region: 'Musanze' },
      { name: 'Potato Beetle', risk: 'Medium', season: 'Dry Season', crops: 'Potatoes', region: 'Musanze' },
    ]);

    console.log('📋 Creating farming tasks...');
    await FarmingTask.create([
      { userId: user._id, farmId: farm1._id, title: 'Apply NPK Fertilizer', crop: 'Maize', date: new Date('2025-11-12'), priority: 'high', status: 'pending', description: 'Apply 50kg/hectare NPK (17-17-17) fertilizer', daysUntil: 2 },
      { userId: user._id, farmId: farm1._id, title: 'Irrigation Check', crop: 'Beans', date: new Date('2025-11-15'), priority: 'medium', status: 'pending', description: 'Check and adjust drip irrigation system', daysUntil: 5 },
      { userId: user._id, title: 'Pest Monitoring', crop: 'All Crops', date: new Date('2025-11-13'), priority: 'medium', status: 'pending', description: 'Weekly pest inspection and treatment if needed', daysUntil: 3 },
      { userId: user._id, farmId: farm2._id, title: 'Weeding', crop: 'Potatoes', date: new Date('2025-11-17'), priority: 'high', status: 'pending', description: 'Manual weeding around potato plants', daysUntil: 7 },
      { userId: user._id, title: 'Soil Testing', crop: 'Maize Field', status: 'completed', result: 'pH optimal, nitrogen high', completedDate: new Date('2025-11-05') },
      { userId: user._id, title: 'Planting', crop: 'Beans', status: 'completed', result: 'Successfully planted 0.5 hectares', completedDate: new Date('2025-11-03') },
      { userId: user._id, title: 'Pest Treatment', crop: 'Maize', status: 'completed', result: 'Aphids treated with neem oil', completedDate: new Date('2025-11-08') },
    ]);

    await SeasonalTimeline.create([
      { userId: user._id, phase: 'Land Preparation', status: 'completed', dates: 'Oct 1-15', activities: ['Plowing', 'Harrowing', 'Organic matter addition'] },
      { userId: user._id, phase: 'Planting', status: 'completed', dates: 'Oct 16-31', activities: ['Seed selection', 'Planting', 'Initial watering'] },
      { userId: user._id, phase: 'Growth Stage', status: 'current', dates: 'Nov 1-30', activities: ['Fertilization', 'Irrigation', 'Pest control', 'Weeding'] },
      { userId: user._id, phase: 'Flowering', status: 'upcoming', dates: 'Dec 1-15', activities: ['Increased irrigation', 'Disease monitoring', 'Pollination support'] },
      { userId: user._id, phase: 'Maturation', status: 'upcoming', dates: 'Dec 16-31', activities: ['Reduce irrigation', 'Pre-harvest prep', 'Quality checks'] },
      { userId: user._id, phase: 'Harvesting', status: 'upcoming', dates: 'Jan 1-15', activities: ['Harvesting', 'Post-harvest handling', 'Storage'] },
    ]);

    console.log('🧴 Creating farm inputs...');
    await FarmInput.create([
      { userId: user._id, farmId: farm1._id, date: new Date('2025-11-08'), crop: 'Maize', input: 'Neem Oil (Organic Pesticide)', quantity: '500ml', purpose: 'Aphid treatment' },
      { userId: user._id, farmId: farm1._id, date: new Date('2025-11-05'), crop: 'Maize', input: 'NPK 17-17-17', quantity: '25kg', purpose: 'Top dressing' },
      { userId: user._id, farmId: farm1._id, date: new Date('2025-11-03'), crop: 'Beans', input: 'DAP Fertilizer', quantity: '10kg', purpose: 'Basal application' },
      { userId: user._id, farmId: farm2._id, date: new Date('2025-10-25'), crop: 'Potatoes', input: 'Compost', quantity: '200kg', purpose: 'Soil amendment' },
    ]);

    console.log('📚 Creating knowledge base...');
    await KnowledgeArticle.create([
      { title: 'Complete Guide to Maize Cultivation', description: "Best practices for growing maize in Rwanda's climate zones", type: 'guide', crops: ['Maize'], duration: '15 min read', downloads: 2340, rating: 4.8, offline: true },
      { title: 'Bean Farming for Maximum Yield', description: 'Comprehensive guide covering planting to harvest', type: 'guide', crops: ['Beans'], duration: '12 min read', downloads: 1890, rating: 4.7, offline: true },
      { title: 'Irish Potato Production Manual', description: 'Highland potato farming techniques and disease management', type: 'guide', crops: ['Potatoes'], duration: '18 min read', downloads: 1567, rating: 4.9, offline: false },
      { title: 'Organic Farming Methods', description: 'Natural pest control and soil enrichment strategies', type: 'guide', crops: ['All Crops'], duration: '20 min read', downloads: 3201, rating: 4.6, offline: false },
      { title: 'How to Perform Soil Testing', description: 'Step-by-step guide to testing your soil pH and nutrients', type: 'video', duration: '8:45', language: 'Kinyarwanda', views: 12450, thumbnailUrl: 'https://images.unsplash.com/photo-1643474004250-05d73e1473e0?w=1080' },
      { title: 'Drip Irrigation Installation', description: 'Setting up an efficient drip irrigation system', type: 'video', duration: '12:30', language: 'English', views: 8930, thumbnailUrl: 'https://images.unsplash.com/photo-1651390216709-1efea22814ad?w=1080' },
      { title: 'Identifying Pest Damage', description: 'Visual guide to common pest symptoms and treatments', type: 'video', duration: '10:15', language: 'French', views: 6720, thumbnailUrl: 'https://images.unsplash.com/photo-1643474004250-05d73e1473e0?w=1080' },
      { title: 'Composting Techniques', description: 'Making high-quality organic compost for your farm', type: 'video', duration: '15:20', language: 'Kinyarwanda', views: 15230, thumbnailUrl: 'https://images.unsplash.com/photo-1651390216709-1efea22814ad?w=1080' },
    ]);

    console.log('💰 Creating market prices...');
    await MarketPrice.create([
      { crop: 'Maize', currentPrice: 350, change: '+5%', trend: 'up', unit: 'RWF/kg' },
      { crop: 'Beans', currentPrice: 800, change: '-2%', trend: 'down', unit: 'RWF/kg' },
      { crop: 'Irish Potatoes', currentPrice: 280, change: '+8%', trend: 'up', unit: 'RWF/kg' },
      { crop: 'Wheat', currentPrice: 420, change: '+3%', trend: 'up', unit: 'RWF/kg' },
      { crop: 'Rice', currentPrice: 950, change: '0%', trend: 'neutral', unit: 'RWF/kg' },
    ]);

    console.log('🏛️ Creating government schemes...');
    await GovernmentScheme.create([
      { title: 'Crop Intensification Program (CIP)', description: 'Government support for increased agricultural productivity', eligibility: 'All registered farmers', benefits: 'Subsidized fertilizers, seeds, and extension services', deadline: 'Rolling applications', type: 'Subsidy' },
      { title: 'Rural Feeder Roads Development', description: 'Infrastructure improvement for market access', eligibility: 'Farmer cooperatives', benefits: 'Improved road access to farms and markets', deadline: 'December 31, 2025', type: 'Infrastructure' },
      { title: 'Agricultural Insurance Scheme', description: 'Protect your crops against climate risks', eligibility: 'Farmers with >0.5 hectares', benefits: 'Compensation for weather-related losses', deadline: 'Before planting season', type: 'Insurance' },
      { title: 'Mechanization Support Program', description: 'Access to modern farming equipment', eligibility: 'Cooperatives and large-scale farmers', benefits: 'Subsidized tractors and equipment rental', deadline: 'March 15, 2026', type: 'Equipment' },
    ]);

    console.log('📊 Creating analytics data...');
    await AnalyticsData.create([
      {
        type: 'kpi',
        period: 'Last 6 Months',
        data: {
          kpis: [
            { title: 'Total Farmers', value: '53,159', change: '+12.5%', trend: 'up' },
            { title: 'Avg Yield Increase', value: '35%', change: '+8% from last year', trend: 'up' },
            { title: 'Active Regions', value: '30', change: 'All districts covered', trend: 'neutral' },
            { title: 'Economic Impact', value: 'RWF 2.4B', change: '+18% this quarter', trend: 'up' },
          ],
          topPerformers: [
            { name: 'Jean-Claude Mugabo', district: 'Musanze', yield: '+45%', crops: 'Maize, Potatoes' },
            { name: 'Marie Uwera', district: 'Huye', yield: '+42%', crops: 'Beans, Wheat' },
            { name: 'Emmanuel Habimana', district: 'Nyagatare', yield: '+40%', crops: 'Maize, Beans' },
            { name: 'Chantal Mukeshimana', district: 'Rubavu', yield: '+38%', crops: 'Potatoes, Wheat' },
            { name: 'Patrick Nkusi', district: 'Rwamagana', yield: '+37%', crops: 'Maize, Beans' },
          ],
          cropDistribution: [
            { name: 'Maize', value: 40, color: '#16a34a' },
            { name: 'Beans', value: 25, color: '#2563eb' },
            { name: 'Potatoes', value: 20, color: '#f59e0b' },
            { name: 'Wheat', value: 15, color: '#8b5cf6' },
          ],
        },
      },
      {
        type: 'yield',
        period: 'Last 6 Months',
        data: [
          { month: 'Jun', maize: 4.2, beans: 1.5, potatoes: 18 },
          { month: 'Jul', maize: 4.5, beans: 1.6, potatoes: 20 },
          { month: 'Aug', maize: 5.1, beans: 1.7, potatoes: 22 },
          { month: 'Sep', maize: 5.3, beans: 1.8, potatoes: 23 },
          { month: 'Oct', maize: 5.8, beans: 1.9, potatoes: 24 },
          { month: 'Nov', maize: 6.0, beans: 2.0, potatoes: 25 },
        ],
      },
      {
        type: 'adoption',
        period: 'Last 6 Months',
        data: [
          { month: 'Jan', users: 1200 },
          { month: 'Feb', users: 1850 },
          { month: 'Mar', users: 2400 },
          { month: 'Apr', users: 3200 },
          { month: 'May', users: 4100 },
          { month: 'Jun', users: 5300 },
        ],
      },
      {
        type: 'regional',
        period: 'Current',
        data: [
          { region: 'Northern Province', farmers: 15234, yield: '+28%' },
          { region: 'Southern Province', farmers: 12456, yield: '+24%' },
          { region: 'Eastern Province', farmers: 11890, yield: '+21%' },
          { region: 'Western Province', farmers: 10123, yield: '+26%' },
          { region: 'Kigali City', farmers: 3456, yield: '+18%' },
        ],
      },
      {
        type: 'impact',
        period: 'Current',
        data: {
          economic: {
            totalRevenueIncrease: 'RWF 2.4B',
            costSavings: 'RWF 680M',
            avgIncomePerFarmer: '+RWF 45,200',
          },
          environmental: {
            waterSaved: '1.2M liters',
            pesticideReduction: '-28%',
            soilHealthImprovement: '+32%',
          },
          foodSecurity: {
            additionalProduction: '45,000 tons',
            householdsFed: '125,000+',
            malnutritionReduction: '-15%',
          },
        },
      },
    ]);

    console.log('💬 Creating initial chat message...');
    await ChatMessage.create({
      userId: user._id,
      role: 'assistant',
      content: "Hello! I'm your AgriGuide AI assistant. I can help you with crop recommendations, pest control advice, soil management, irrigation planning, and more. How can I assist you today?",
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('📧 Default user: davies@agriguide.rw');
    console.log('🔑 Default password: password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
