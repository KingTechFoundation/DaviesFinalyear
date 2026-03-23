const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkWeather = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Try to find any weather related collection
    const weatherColl = db.collection('weatherdatas');
    const count = await weatherColl.countDocuments();
    console.log('Total weather records info:', count);
    
    const records = await weatherColl.find().toArray();
    console.log('Records found:', JSON.stringify(records, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkWeather();
