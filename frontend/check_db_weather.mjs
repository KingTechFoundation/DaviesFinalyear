import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const weatherDataSchema = new mongoose.Schema({
  location: String,
  updatedAt: Date
}, { strict: false });

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);

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
