const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generates agricultural advice based on soil, crop, and location.
 */
const getAgriculturalAdvice = async ({ soilType, cropType, location, area }) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `You are an expert Agricultural Advisor for farmers in Rwanda. 
  Provide a detailed agricultural advisory report for a farmer with the following data:
  - Location: ${location}
  - Farm Area: ${area}
  - Soil Type: ${soilType}
  - Current/Planned Crop: ${cropType}

  The report should include:
  1. Soil health assessment and fertilizer recommendations (mention specific brands available in Rwanda).
  2. Optimal planting/harvesting schedule based on typical ${location} climate.
  3. Potential pest risks for ${cropType} and prevention methods.
  4. Expected yield estimates and best practices for maximizing productivity.
  
  Keep the tone encouraging and professional. Use metric units (kg, hectares).
  Format the response in Markdown.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error('Failed to generate AI advice');
  }
};

/**
 * Virtual Farming Assistant chat handler.
 */
const getChatResponse = async (history, message, userContext) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: `You are the AgriGuide AI Virtual Assistant. Help the farmer with their queries. 
        User Context: Name: ${userContext.name}, Location: ${userContext.location}, Main Crop: ${userContext.crop}.
        Be concise, helpful, and culturally relevant to Rwandan agriculture.` }],
      },
      ...history
    ],
  });

  try {
    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    throw new Error('Failed to get AI chat response');
  }
};

/**
 * Predicts pest risks based on environmental data or descriptions.
 */
const predictPestRisks = async (cropData, environmentalData) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Based on the following farming data, predict potential pest and disease outbreaks:
  - Crop: ${cropData.name} (${cropData.stage} stage)
  - Temperature: ${environmentalData.temp}°C
  - Humidity: ${environmentalData.humidity}%
  - Recent Weather: ${environmentalData.recentWeather}
  
  Provide:
  1. High-probability pests/diseases.
  2. Early warning signs to look for.
  3. Immediate organic and chemical control measures.
  4. Impact level (Low/Medium/High).`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini Prediction Error:', error);
    throw new Error('Failed to predict pest risks');
  }
};

/**
 * Generates weather-based farming recommendations.
 */
const getWeatherRecommendations = async (currentWeather, forecast) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `As an Agricultural AI Advisor in Rwanda, analyze the following weather data and provide 4-5 specific farming action recommendations and any urgent alerts.
  
  Current Weather:
  - Temp: ${currentWeather.temp}°C
  - Condition: ${currentWeather.condition}
  - Humidity: ${currentWeather.humidity}%
  - Wind: ${currentWeather.wind} km/h
  - Rainfall: ${currentWeather.rainfall} mm
  
  7-Day Forecast:
  ${JSON.stringify(forecast)}
  
  Provide the output in valid JSON format with the following structure:
  {
    "alerts": [
      { "title": "string", "message": "string", "severity": "warning" | "info", "icon": "CloudRain" | "Sun" | "AlertTriangle" }
    ],
    "recommendations": [
      { "activity": "string", "status": "string", "reason": "string" }
    ]
  }
  
  Keep activities relevant to common crops in Musanze like Maize, Beans, or Irish Potatoes. 
  Status should be short (e.g., "Postpone", "Safe to Proceed", "Urgent").
  Return ONLY the JSON object.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean JSON if Gemini adds markdown blocks
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Gemini Weather Recommendations Error:', error);
    return {
      alerts: [],
      recommendations: [
        { activity: 'Irrigation', status: 'Monitor', reason: 'AI recommendations currently unavailable.' }
      ]
    };
  }
};

module.exports = {
  getAgriculturalAdvice,
  getChatResponse,
  predictPestRisks,
  getWeatherRecommendations
};
