import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Settings, Send, Smile, X, Bot as Lotus, Wind, Pencil, Sparkles } from 'lucide-react';
import MoodSelector from '../components/MoodSelector';
import { usePoints } from '../context/PointsContext';
import BreathingExercise from '../components/BreathingExercise';
import RelaxationExercise from '../components/RelaxationExercise';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: () => void;
  gradient: string;
  hoverGradient: string;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
}

const aiModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    provider: 'OpenAI'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    provider: 'OpenAI'
  },
  {
    id: 'claude-2',
    name: 'Claude 2',
    description: 'Advanced reasoning and analysis',
    provider: 'Anthropic'
  },
  {
    id: 'palm-2',
    name: 'PaLM 2',
    description: 'Efficient for general tasks',
    provider: 'Google'
  }
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'initial-message',
    content: "Hi! How are you feeling today? Select your mood above to help me understand better.",
    sender: 'ai',
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeExercise, setActiveExercise] = useState<'breathing' | 'relaxation' | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addPoints } = usePoints();

  const quickActions: QuickAction[] = [
    {
      icon: <Lotus className="w-5 h-5" />,
      label: "Start Relaxation",
      gradient: "from-indigo-500 to-purple-500",
      hoverGradient: "from-indigo-600 to-purple-600",
      action: () => {
        setActiveExercise('relaxation');
      }
    },
    {
      icon: <Wind className="w-5 h-5" />,
      label: "Breathing Exercise",
      gradient: "from-cyan-500 to-blue-500",
      hoverGradient: "from-cyan-600 to-blue-600",
      action: () => {
        setActiveExercise('breathing');
      }
    },
    {
      icon: <Pencil className="w-5 h-5" />,
      label: "Journal Entry",
      gradient: "from-amber-500 to-orange-500",
      hoverGradient: "from-amber-600 to-orange-600",
      action: () => {
        sendMessage("I'd like to write in my journal.");
      }
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string = inputMessage) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: "I understand how you're feeling. Let's work through this together. Would you like to try a breathing exercise or talk about what's on your mind?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      addPoints(5);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    const moodMessage: Message = {
      id: `mood-${Date.now()}`,
      content: `I see you're feeling ${mood.toLowerCase()}. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, moodMessage]);
  };

  const handleExerciseComplete = () => {
    setActiveExercise(null);
    addPoints(activeExercise === 'breathing' ? 10 : 15);
    const completionMessage: Message = {
      id: `exercise-complete-${Date.now()}`,
      content: `Great job completing the ${activeExercise} exercise! How do you feel now?`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, completionMessage]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (sidebar && !sidebar.contains(event.target as Node) && 
          menuButton && !menuButton.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen flex">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23purple" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")',
          }}
        />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            id="sidebar"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 w-72 bg-white/80 backdrop-blur-md shadow-lg z-20"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">AI Model</h3>
                  <div className="space-y-2">
                    {aiModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`w-full p-3 text-left rounded-lg transition-colors ${
                          selectedModel === model.id
                            ? 'bg-purple-50 border border-purple-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800">{model.name}</span>
                          <span className="text-xs text-gray-500">{model.provider}</span>
                        </div>
                        <p className="text-sm text-gray-600">{model.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Recent Chats</h3>
                  <div className="space-y-2">
                    {['Yesterday', 'Morning Session', 'Last Week'].map((chat) => (
                      <button
                        key={chat}
                        className="w-full p-2 text-left hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        {chat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Settings</h3>
                  <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-full p-2 text-left hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span>Preferences</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-screen max-w-7xl mx-auto w-full">
        <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-lg">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-700">
                    {aiModels.find(m => m.id === selectedModel)?.name}
                  </span>
                </div>
              </div>
              
              {selectedMood && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Smile className="w-4 h-4" />
                  <span>Feeling {selectedMood}</span>
                </div>
              )}
              
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {!selectedMood && (
              <div className="px-4 pb-4">
                <MoodSelector onMoodSelect={handleMoodSelect} />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-[88px]">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-lg p-4">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    transition: { duration: 1, repeat: Infinity },
                  }}
                >
                  Typing...
                </motion.div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
          {activeExercise && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              {activeExercise === 'breathing' ? (
                <BreathingExercise
                  onComplete={handleExerciseComplete}
                  onClose={() => setActiveExercise(null)}
                />
              ) : (
                <RelaxationExercise
                  onComplete={handleExerciseComplete}
                  onClose={() => setActiveExercise(null)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t">
          <div className="p-3 flex space-x-3 overflow-x-auto">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                onClick={action.action}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white shadow-md transition-all duration-200 bg-gradient-to-r ${action.gradient} hover:${action.hoverGradient}`}
              >
                <div className="p-1 bg-white/20 rounded-full">
                  {action.icon}
                </div>
                <span className="font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;