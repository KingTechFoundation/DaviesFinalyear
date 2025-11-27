import { useState } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Bot, Send, User, Sparkles, Clock, Mic, Share2, Download, Copy } from 'lucide-react';
import type { Screen } from '../App';

interface AIAssistantProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function AIAssistant({ onNavigate, onLogout }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AgriGuide AI assistant. I can help you with crop recommendations, pest control advice, soil management, irrigation planning, and more. How can I assist you today?',
      timestamp: '10:00 AM',
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const suggestedQuestions = [
    'What crop should I plant next season?',
    'How do I improve my soil pH?',
    'When should I irrigate my maize?',
    'Signs of aphid infestation?',
  ];

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulating voice input
    if (!isListening) {
      setTimeout(() => {
        setInput('How can I prevent pests in my bean crop?');
        setIsListening(false);
      }, 2000);
    }
  };

  const handleSaveConversation = () => {
    const conversationText = messages.map(m => `${m.role === 'user' ? 'You' : 'AgriGuide AI'}: ${m.content}`).join('\n\n');
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agriguide-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const handleShareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'AgriGuide AI Advice',
        text: content,
      });
    } else {
      navigator.clipboard.writeText(content);
      alert('Advice copied to clipboard!');
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (query: string): string => {
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
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="assistant" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-green-900 mb-2">AI Virtual Assistant</h1>
          <p className="text-neutral-600 text-sm sm:text-base">Get real-time farming advice powered by artificial intelligence</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Chat Area */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>AgriGuide AI</CardTitle>
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-[400px] sm:h-[500px] overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'assistant'
                        ? 'bg-gradient-to-br from-green-400 to-green-600'
                        : 'bg-neutral-200'
                    }`}>
                      {message.role === 'assistant' ? (
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      ) : (
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" />
                      )}
                    </div>
                    <div className={`flex-1 min-w-0 ${message.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                      <div className={`inline-block px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl max-w-[85%] sm:max-w-[80%] ${
                        message.role === 'assistant'
                          ? 'bg-white border'
                          : 'bg-green-600 text-white'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</div>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-500 mt-1 px-1 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{message.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="border-t p-3 sm:p-4">
                <div className="flex gap-2 mb-2 sm:mb-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSaveConversation}
                    className="flex-1 text-xs sm:text-sm"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Save Chat</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleVoiceInput}
                    className={`flex-1 text-xs sm:text-sm ${isListening ? 'bg-red-50 border-red-300' : ''}`}
                  >
                    <Mic className={`w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 ${isListening ? 'text-red-600 animate-pulse' : ''}`} />
                    <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Voice Input'}</span>
                    <span className="sm:hidden">{isListening ? 'Stop' : 'Voice'}</span>
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700 px-3 sm:px-4">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Suggested Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Suggested Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="w-full text-left p-2 sm:p-3 rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors"
                  >
                    <div className="text-neutral-900 text-sm sm:text-base">{question}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">What I Can Help With</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-neutral-900 text-sm sm:text-base">Crop Selection</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">Best crops for your soil and climate</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-neutral-900 text-sm sm:text-base">Soil Management</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">Improve soil health and fertility</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-neutral-900 text-sm sm:text-base">Pest Control</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">Identify and treat infestations</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-neutral-900 text-sm sm:text-base">Irrigation Planning</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">Optimize water usage</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-neutral-900 text-sm sm:text-base">Weather Advice</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">Plan based on forecasts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}