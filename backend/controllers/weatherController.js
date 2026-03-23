const WeatherData = require('../models/WeatherData');
const { getWeatherRecommendations } = require('../services/aiService');

// Helper to map Open-Meteo weather codes to conditions and icons
const mapWeatherCode = (code) => {
  if (code === 0) return { condition: 'Clear Sky', icon: 'Sun' };
  if ([1, 2, 3].includes(code)) return { condition: 'Partly Cloudy', icon: 'Cloud' };
  if ([45, 48].includes(code)) return { condition: 'Foggy', icon: 'Cloud' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { condition: 'Rain', icon: 'CloudRain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snow', icon: 'Cloud' };
  if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', icon: 'AlertTriangle' };
  return { condition: 'Cloudy', icon: 'Cloud' };
};

// Refresh weather data from Open-Meteo and Gemini
const refreshWeatherData = async (locationName = 'Musanze District') => {
  // Musanze Coordinates
  const lat = -1.5008;
  const lon = 29.6346;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.current) throw new Error('Failed to fetch from Open-Meteo');

  const currentStatus = mapWeatherCode(data.current.weather_code);
  
  const forecast = data.daily.time.map((date, i) => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const fStatus = mapWeatherCode(data.daily.weather_code[i]);
    return {
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayName,
      icon: fStatus.icon,
      temp: { high: Math.round(data.daily.temperature_2m_max[i]), low: Math.round(data.daily.temperature_2m_min[i]) },
      rain: data.daily.precipitation_probability_max[i],
      condition: fStatus.condition,
    };
  });

  const currentWeather = {
    temp: Math.round(data.current.temperature_2m),
    condition: currentStatus.condition,
    humidity: data.current.relative_humidity_2m,
    wind: Math.round(data.current.wind_speed_10m),
    rainfall: data.current.precipitation,
    uvIndex: 5, // Open-Meteo provides this in a separate call, using 5 as a safe default for Musanze
  };

  // Get AI recommendations
  const aiInsights = await getWeatherRecommendations(currentWeather, forecast);

  // Hardcoded monthly data for visualization if real historical data is missing
  const monthlyData = [
    { month: 'Nov 1-10', rainfall: 45, avgTemp: 23 },
    { month: 'Nov 11-20', rainfall: 38, avgTemp: 24 },
    { month: 'Nov 21-30', rainfall: 52, avgTemp: 23 },
  ];

  const climateZone = {
    region: 'Highland Tropical',
    altitude: '1,850m',
    annualRainfall: '1,200-1,500mm',
    growingSeason: 'Year-round',
  };

  // Upsert into DB
  const updatedWeather = await WeatherData.findOneAndUpdate(
    { location: locationName },
    {
      current: currentWeather,
      forecast,
      alerts: aiInsights.alerts,
      recommendations: aiInsights.recommendations,
      monthlyData,
      climateZone,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return updatedWeather;
};

// @desc    Get weather data for a location
// @route   GET /api/weather
const getWeather = async (req, res) => {
  try {
    const location = req.query.location || 'Musanze District';
    
    // Check if we have recent data (less than 1 hour old)
    let weather = await WeatherData.findOne({ location: { $regex: location, $options: 'i' } })
      .sort({ updatedAt: -1 });

    const isStale = !weather || (new Date() - new Date(weather.updatedAt)) > 3600000;

    if (isStale) {
      console.log('🔄 Weather data is stale. Refreshing...');
      weather = await refreshWeatherData(location);
    }

    res.json(weather);
  } catch (error) {
    console.error('Weather Controller Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get weather forecast
// @route   GET /api/weather/forecast
const getForecast = async (req, res) => {
  try {
    const location = req.query.location || 'Musanze District';
    const weather = await WeatherData.findOne({ location: { $regex: location, $options: 'i' } })
      .select('forecast')
      .sort({ updatedAt: -1 });
    if (!weather) return res.status(404).json({ message: 'Forecast not found' });
    res.json(weather.forecast);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get weather alerts
// @route   GET /api/weather/alerts
const getAlerts = async (req, res) => {
  try {
    const location = req.query.location || 'Musanze District';
    const weather = await WeatherData.findOne({ location: { $regex: location, $options: 'i' } })
      .select('alerts recommendations')
      .sort({ updatedAt: -1 });
    if (!weather) return res.status(404).json({ message: 'Alerts not found' });
    res.json({ alerts: weather.alerts, recommendations: weather.recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWeather, getForecast, getAlerts };
