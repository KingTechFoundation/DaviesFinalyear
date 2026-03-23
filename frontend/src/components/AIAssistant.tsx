import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Navigation } from './Navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Bot, Send, User, Sparkles, Clock, Mic, Share2, Download, Copy } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import type { Screen } from '../App';

// Initialize Gemini
const API_KEY = (import.meta as any).env.VITE_GOOGLE_AI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const getSystemInstruction = (language: string) => `
You are an AI assistant for AgriGuide, a comprehensive farming management system.
YOUR ROLE:
- Help farmers with crop recommendations, pest control advice, soil management, and irrigation planning.
- Provide real-time farming advice based on agricultural best practices.
- Guide users through the features of the AgriGuide app (MyFarm, Weather, Pest Detection, etc.).
- Be helpful, professional, and approachable.

IMPORTANT: Please respond in ${language === 'fr' ? 'French' : language === 'rw' ? 'Kinyarwanda' : 'English'}.
`;

interface AIAssistantProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  role: string;
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function AIAssistant({ onNavigate, onLogout, role }: AIAssistantProps) {
  const { t, lang } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: t.aiAssistant.greeting,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    t.aiAssistant.capability1Title,
    t.aiAssistant.capability2Title,
    t.aiAssistant.capability3Title,
    t.aiAssistant.capability4Title,
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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: getSystemInstruction(lang),
      });

      const chat = model.startChat({
        history: messages.slice(1).map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      });

      const result = await chat.sendMessage(currentInput);
      const response = await result.response;
      const text = response.text();
      
      const aiResponse: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: text,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now() + 2,
        role: 'assistant',
        content: t.aiAssistant.error,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="assistant" onNavigate={onNavigate} onLogout={onLogout} role={role} />
      
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-6xl">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-green-900 mb-2">{t.aiAssistant.title}</h1>
          <p className="text-neutral-600 text-sm sm:text-base">{t.aiAssistant.subtitle}</p>
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
                    <span>{t.aiAssistant.online}</span>
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
                          ? 'bg-white border text-gray-800'
                          : 'bg-green-600 text-white shadow-lg shadow-green-600/10'
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
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white border rounded-2xl px-4 py-3 flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
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
                    <span className="hidden sm:inline">{t.aiAssistant.saveChat}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleVoiceInput}
                    className={`flex-1 text-xs sm:text-sm ${isListening ? 'bg-red-50 border-red-300' : ''}`}
                  >
                    <Mic className={`w-3 h-3 sm:w-4 sm:h-4 sm:mr-2 ${isListening ? 'text-red-600 animate-pulse' : ''}`} />
                    <span className="hidden sm:inline">{isListening ? t.aiAssistant.listening : t.aiAssistant.voiceInput}</span>
                    <span className="sm:hidden">{isListening ? 'Stop' : 'Voice'}</span>
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t.aiAssistant.placeholder}
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
                  {t.aiAssistant.suggestedQuestions}
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
                <CardTitle className="text-base sm:text-lg">{t.aiAssistant.capabilitiesTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-neutral-900 text-sm sm:text-base">{t.aiAssistant.capability1Title}</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">{t.aiAssistant.capability1Desc}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-neutral-900 text-sm sm:text-base">{t.aiAssistant.capability2Title}</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">{t.aiAssistant.capability2Desc}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-neutral-900 text-sm sm:text-base">{t.aiAssistant.capability3Title}</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">{t.aiAssistant.capability3Desc}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-neutral-900 text-sm sm:text-base">{t.aiAssistant.capability4Title}</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">{t.aiAssistant.capability4Desc}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-neutral-900 text-sm sm:text-base">{t.aiAssistant.capability5Title}</div>
                    <div className="text-neutral-600 text-xs sm:text-sm">{t.aiAssistant.capability5Desc}</div>
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