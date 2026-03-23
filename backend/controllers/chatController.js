const ChatMessage = require('../models/ChatMessage');

// @desc    Get chat history for a user
// @route   GET /api/chat
const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user._id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message (and get AI response)
// @route   POST /api/chat
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;

    // Save user message
    const userMessage = await ChatMessage.create({
      userId: req.user._id,
      role: 'user',
      content,
    });

    // Generate AI response based on keywords
    const aiContent = getAIResponse(content);
    const aiMessage = await ChatMessage.create({
      userId: req.user._id,
      role: 'assistant',
      content: aiContent,
    });

    res.status(201).json({ userMessage, aiMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat
const clearChat = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user._id });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// AI response logic (same keyword matching as frontend)
function getAIResponse(query) {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('crop') || lowerQuery.includes('plant')) {
    return 'Based on your soil analysis showing pH 6.5 and high nitrogen levels in Musanze District, I recommend:\n\n1. **Maize** - Excellent choice for your soil type\n2. **Beans** - Great nitrogen-fixing crop for rotation\n3. **Irish Potatoes** - Well-suited to your highland climate\n\nWould you like detailed planting schedules for any of these?';
  }

  if (lowerQuery.includes('soil') || lowerQuery.includes('ph')) {
    return 'To improve soil pH, I recommend:\n\n• Add agricultural lime (2-3 kg per 10m²) to raise pH\n• Incorporate organic matter like compost\n• Test pH again after 2-3 weeks\n• Maintain with regular organic amendments\n\nYour current pH of 6.2 is slightly acidic - ideal for most crops but can be optimized.';
  }

  if (lowerQuery.includes('irrigation') || lowerQuery.includes('water')) {
    return 'For your maize crop, irrigation schedule:\n\n• **Growth Stage**: Water every 3-4 days\n• **Flowering**: Critical - water every 2 days\n• **Grain Filling**: Every 3 days\n\nWith rain expected in 2 days, you can skip the next irrigation. I\'ll send you a reminder based on weather updates.';
  }

  if (lowerQuery.includes('pest') || lowerQuery.includes('aphid') || lowerQuery.includes('insect')) {
    return 'Aphid infestation signs:\n\n• Curled or yellowing leaves\n• Sticky honeydew on leaves\n• Presence of ants (farming aphids)\n• Stunted plant growth\n\n**Treatment**:\n1. Spray with neem oil solution\n2. Introduce ladybugs (natural predators)\n3. Remove heavily infested plants\n\nWould you like me to schedule a pest detection scan?';
  }

  return 'I understand your question. Based on your farm profile in Musanze District with 2 hectares of mixed crops, I can provide detailed guidance. Could you please provide more specific details about:\n\n• Which crop you\'re referring to\n• Current growth stage\n• Any specific symptoms or concerns\n\nThis will help me give you the most accurate recommendation.';
}

module.exports = { getChatHistory, sendMessage, clearChat };
