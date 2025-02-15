import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Settings, Send, Smile, X, Bot as Lotus, Wind, Pencil, Sparkles } from 'lucide-react';
import MoodSelector from '../components/MoodSelector';
import { usePoints } from '../context/PointsContext';
import BreathingExercise from '../components/BreathingExercise';
import RelaxationExercise from '../components/RelaxationExercise';
import ChatSidebar from '../components/ChatSidebar';

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

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 'initial-message',
    content: "Hi! How are you feeling today? Select your mood above to help me understand better.",
    sender: 'ai',
    timestamp: new Date()
  }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeExercise, setActiveExercise] = useState<'breathing' | 'relaxation' | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addPoints } = usePoints();

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

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

  // Close sidebar when clicking outside
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
      <ChatSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="bg-white/80 backdrop-blur-md shadow-sm border-b">
            <div className="p-4 flex items-center justify-between max-w-6xl mx-auto w-full">
              <button
                id="menu-button"
                onClick={toggleSidebar}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                  isSidebarOpen ? 'bg-purple-50 text-purple-600' : 'text-gray-600'
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">
                  {selectedModel.toUpperCase()}
                </span>
              </div>

              {selectedMood && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Smile className="w-4 h-4" />
                  <span>Feeling {selectedMood}</span>
                </div>
              )}
            </div>
            {!selectedMood && (
              <div className="px-4 pb-4 max-w-6xl mx-auto w-full">
                <MoodSelector onMoodSelect={handleMoodSelect} />
              </div>
            )}
          </div>
        </div>

        {/* Messages with padding for header and input box */}
        <div className="flex-1 overflow-y-auto pt-[76px] pb-[160px] p-4 space-y-4">
          <div className="max-w-6xl mx-auto w-full space-y-4">
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
        </div>

        {/* Fixed Quick Actions and Input */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white/80 backdrop-blur-sm z-50">
          <div className="max-w-6xl mx-auto w-full">
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
                  <span className="font-medium whitespace-nowrap">{action.label}</span>
                </motion.button>
              ))}
            </div>

            <div className="p-4">
              <form onSubmit={handleSubmit} className="flex space-x-4">
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

      {/* Exercises Modal */}
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
    </div>
  );
};

export default Chat;