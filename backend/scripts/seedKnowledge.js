/**
 * Seed script – run once:
 *   cd backend && node scripts/seedKnowledge.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// .env lives in backend/ — resolve relative to this file's parent directory
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');

const KnowledgeArticle = require('../models/KnowledgeArticle');
const GovernmentScheme = require('../models/GovernmentScheme');
const MarketPrice      = require('../models/MarketPrice');

const GUIDES = [
  {
    type: 'guide',
    title: 'Complete Guide to Maize Cultivation',
    description: "Best practices for growing maize in Rwanda's climate zones.",
    crops: ['Maize'],
    duration: '15 min read',
    rating: 4.8,
    downloads: 2340,
    offline: true,
    content: `## Introduction\nMaize (*Zea mays*) is one of Rwanda's most important food crops...\n\n## Land Preparation\n- Plough to 25–30 cm depth\n- Apply 5 t/ha organic compost\n\n## Planting\n- Row spacing: 75 cm × 25 cm\n- Plant 2–3 seeds/hole, thin to 1 after emergence\n\n## Fertilisation\n- Basal: 50 kg/ha DAP at planting\n- Top-dress: 100 kg/ha Urea at knee height\n\n## Irrigation\nEnsure 500–800 mm rainfall equivalent across the season. Supplement with furrow irrigation during dry spells.\n\n## Harvest\nHarvest when grain moisture is 20–25%. Dry to 13% before storage.`,
  },
  {
    type: 'guide',
    title: 'Bean Farming for Maximum Yield',
    description: 'Comprehensive guide covering planting to harvest of common beans.',
    crops: ['Beans'],
    duration: '12 min read',
    rating: 4.7,
    downloads: 1890,
    offline: true,
    content: `## Introduction\nCommon beans (*Phaseolus vulgaris*) are a key protein source in Rwanda.\n\n## Variety Selection\nChoose climbing varieties (e.g., RWR 2245) for highlands and bush varieties for lowlands.\n\n## Planting\n- Spacing: 40 cm × 10 cm for bush beans\n- Inoculate seed with *Rhizobium* for nitrogen fixation\n\n## Pest Management\nMonitor for bean flies, aphids, and angular leaf spot. Apply appropriate bio-pesticides early.\n\n## Harvest\nHarvest pods when 80% have turned yellow-brown.`,
  },
  {
    type: 'guide',
    title: 'Irish Potato Production Manual',
    description: 'Highland potato farming techniques and disease management.',
    crops: ['Potatoes'],
    duration: '18 min read',
    rating: 4.9,
    downloads: 1567,
    content: `## Introduction\nThe potato (*Solanum tuberosum*) thrives in Rwanda's cool highlands.\n\n## Seed Selection\nUse certified disease-free seed tubers. Common varieties: Kinigi, Kirundo, Dutch Robjin.\n\n## Planting\n- Depth: 10–15 cm\n- Spacing: 75 cm × 30 cm\n\n## Disease Control\nLate blight (*Phytophthora infestans*) is the biggest threat. Apply fungicides preventively every 7–10 days during rainy season.\n\n## Harvest\nHarvest when vines die back naturally. Allow skin to set for 2 weeks before marketing.`,
  },
  {
    type: 'guide',
    title: 'Organic Farming Methods',
    description: 'Natural pest control and soil enrichment strategies for all crops.',
    crops: ['All Crops'],
    duration: '20 min read',
    rating: 4.6,
    downloads: 3201,
    content: `## Principles\nOrganic farming avoids synthetic inputs and focuses on ecosystem health.\n\n## Compost Making\n1. Layer green and brown materials in 1:3 ratio\n2. Keep moist, turn every 2 weeks\n3. Ready in 6–8 weeks (dark, earthy smell)\n\n## Pest Management\n- Neem oil spray (5 ml/L) for aphids and mites\n- Intercropping with marigolds deters nematodes\n\n## Soil Enrichment\n- Green manures: Tithonia, Mucuna cover crops\n- Apply 10 t/ha farmyard manure`,
  },
];

const VIDEOS = [
  {
    type: 'video',
    title: 'How to Perform Soil Testing',
    description: 'Step-by-step guide to testing your soil pH and nutrients.',
    crops: ['All Crops'],
    duration: '8:45',
    language: 'Kinyarwanda',
    views: 12450,
    // Public domain / CC farming video
    videoUrl: 'https://www.youtube.com/embed/kV3vJrRl_tU',
    thumbnailUrl: 'https://img.youtube.com/vi/kV3vJrRl_tU/hqdefault.jpg',
  },
  {
    type: 'video',
    title: 'Drip Irrigation Installation',
    description: 'Setting up an efficient drip irrigation system for smallholder farms.',
    crops: ['All Crops'],
    duration: '12:30',
    language: 'English',
    views: 8930,
    videoUrl: 'https://www.youtube.com/embed/WLmgmFobXAg',
    thumbnailUrl: 'https://img.youtube.com/vi/WLmgmFobXAg/hqdefault.jpg',
  },
  {
    type: 'video',
    title: 'Identifying Pest Damage on Crops',
    description: 'Visual guide to common pest symptoms and treatments.',
    crops: ['Maize', 'Beans'],
    duration: '10:15',
    language: 'French',
    views: 6720,
    videoUrl: 'https://www.youtube.com/embed/E0sFh2KCEqQ',
    thumbnailUrl: 'https://img.youtube.com/vi/E0sFh2KCEqQ/hqdefault.jpg',
  },
  {
    type: 'video',
    title: 'Composting Techniques for Farmers',
    description: 'Making high-quality organic compost for your farm.',
    crops: ['All Crops'],
    duration: '15:20',
    language: 'Kinyarwanda',
    views: 15230,
    videoUrl: 'https://www.youtube.com/embed/uglEi0U_QzY',
    thumbnailUrl: 'https://img.youtube.com/vi/uglEi0U_QzY/hqdefault.jpg',
  },
];

const SCHEMES = [
  {
    title: 'Crop Intensification Program (CIP)',
    description: 'Government support for increased agricultural productivity.',
    eligibility: 'All registered farmers',
    benefits: 'Subsidized fertilizers, seeds, and extension services',
    deadline: 'Rolling applications',
    type: 'Subsidy',
    schemeUrl: 'https://www.minagri.gov.rw/',
  },
  {
    title: 'Rural Feeder Roads Development',
    description: 'Infrastructure improvement for better market access.',
    eligibility: 'Farmer cooperatives',
    benefits: 'Improved road access to farms and markets',
    deadline: 'December 31, 2025',
    type: 'Infrastructure',
    schemeUrl: 'https://www.minagri.gov.rw/',
  },
  {
    title: 'Agricultural Insurance Scheme',
    description: 'Protect your crops against climate-related risks.',
    eligibility: 'Farmers with >0.5 hectares',
    benefits: 'Compensation for weather-related losses',
    deadline: 'Before planting season',
    type: 'Insurance',
    schemeUrl: 'https://www.minagri.gov.rw/',
  },
  {
    title: 'Mechanization Support Program',
    description: 'Access to modern farming equipment at subsidized rates.',
    eligibility: 'Cooperatives and large-scale farmers',
    benefits: 'Subsidized tractors and equipment rental',
    deadline: 'March 15, 2026',
    type: 'Equipment',
    schemeUrl: 'https://www.minagri.gov.rw/',
  },
];

const MARKET_PRICES = [
  { crop: 'Maize',         currentPrice: 350, change: '+5%', trend: 'up',      unit: 'RWF/kg' },
  { crop: 'Beans',         currentPrice: 800, change: '-2%', trend: 'down',    unit: 'RWF/kg' },
  { crop: 'Irish Potatoes',currentPrice: 280, change: '+8%', trend: 'up',      unit: 'RWF/kg' },
  { crop: 'Wheat',         currentPrice: 420, change: '+3%', trend: 'up',      unit: 'RWF/kg' },
  { crop: 'Rice',          currentPrice: 950, change: '0%',  trend: 'neutral', unit: 'RWF/kg' },
  { crop: 'Sweet Potato',  currentPrice: 190, change: '+2%', trend: 'up',      unit: 'RWF/kg' },
];

async function seed() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    await KnowledgeArticle.deleteMany({});
    await GovernmentScheme.deleteMany({});
    await MarketPrice.deleteMany({});

    await KnowledgeArticle.insertMany([...GUIDES, ...VIDEOS]);
    await GovernmentScheme.insertMany(SCHEMES);
    await MarketPrice.insertMany(MARKET_PRICES);

    console.log(`✅ Seeded ${GUIDES.length} guides, ${VIDEOS.length} videos, ${SCHEMES.length} schemes, ${MARKET_PRICES.length} market prices`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed().catch(err => { console.error(err); process.exit(1); });
