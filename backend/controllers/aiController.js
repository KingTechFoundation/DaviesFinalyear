const { getAgriculturalAdvice, getChatResponse, predictPestRisks } = require('../services/aiService');

// @desc    Get tailored agricultural advice
// @route   POST /api/ai/advise
const getAdvice = async (req, res) => {
  try {
    const { soilType, cropType, area } = req.body;
    const location = req.user.farmLocation || 'Musanze District, Rwanda';
    
    const advice = await getAgriculturalAdvice({ soilType, cropType, location, area });
    res.json({ advice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Chat with virtual farming assistant
// @route   POST /api/ai/chat
const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userContext = {
      name: req.user.name,
      location: req.user.farmLocation,
      crop: 'maize' // Default or fetch from user's active crops
    };

    const response = await getChatResponse(history || [], message, userContext);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Predict pest and disease risks
// @route   POST /api/ai/predict-pest
const predictPest = async (req, res) => {
  try {
    const { cropData, environmentalData } = req.body;
    const prediction = await predictPestRisks(cropData, environmentalData);
    res.json({ prediction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdvice,
  chatWithAI,
  predictPest
};
