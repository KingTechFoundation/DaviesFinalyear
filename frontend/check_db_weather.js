const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const WeatherData = require('./backend/models/WeatherData');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const checkWeather = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const count = await WeatherData.countDocuments();
    console.log('Total weather records:', count);
    
    const records = await WeatherData.find();
    console.log('Records:', JSON.stringify(records, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkWeather();
