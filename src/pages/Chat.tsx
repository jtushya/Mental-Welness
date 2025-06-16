import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Send, Smile, X, Bot as Lotus, Wind, Book, Sparkles, History, Plus, MessageSquare, Brain, Heart, Users } from 'lucide-react';
import { format } from 'date-fns';
import MoodSelector from '../components/MoodSelector';
import { usePoints } from '../context/PointsContext';
import BreathingExercise from '../components/BreathingExercise';
import RelaxationExercise from '../components/RelaxationExercise';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import JournalEntry from '../components/JournalEntry';
import BackgroundAnimation from '../components/BackgroundAnimation';
import { getChatResponse, detectCrisis, CRISIS_RESPONSE } from '../lib/gemini';
import { auth } from '../lib/firebase';
import { saveChatMessage, getChatSessions, createNewSession, getChatSession } from '../lib/chat';
import type { Message, ChatSession } from '../types';

const CHAT_TOPICS = [
  { id: 'general', label: 'Just Chat', icon: MessageSquare, description: 'Talk freely about anything on your mind' },
  { id: 'anxiety', label: 'Anxiety', icon: Brain, description: 'Discuss anxiety and stress-related concerns' },
  { id: 'relationships', label: 'Relationships', icon: Users, description: 'Talk about relationship challenges' },
  { id: 'diagnosis', label: 'Symptom Check', icon: Heart, description: 'Discuss symptoms and get information' }
];

const MOOD_COLORS = {
  'Loved': 'text-pink-500',
  'Happy': 'text-green-500',
  'Okay': 'text-yellow-500',
  'Sad': 'text-blue-500',
  'Excited': 'text-purple-500'
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [activeExercise, setActiveExercise] = useState<'breathing' | 'relaxation' | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-pro');
  const [showHistory, setShowHistory] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [showJournal, setShowJournal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addPoints } = usePoints();

  const quickActions = [
    {
      icon: <Lotus className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Relaxation",
      shortLabel: "Relax",
      gradient: "from-indigo-500 to-purple-500",
      hoverGradient: "from-indigo-600 to-purple-600",
      action: () => {
        setShowMoodSelector(false);
        setActiveExercise('relaxation');
        addPoints(15);
      }
    },
    {
      icon: <Wind className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Breathing",
      shortLabel: "Breathe",
      gradient: "from-cyan-500 to-blue-500",
      hoverGradient: "from-cyan-600 to-blue-600",
      action: () => {
        setShowMoodSelector(false);
        setActiveExercise('breathing');
        addPoints(10);
      }
    },
    {
      icon: <Book className="w-4 h-4 md:w-5 md:h-5" />,
      label: "Journal",
      shortLabel: "Write",
      gradient: "from-amber-500 to-orange-500",
      hoverGradient: "from-amber-600 to-orange-600",
      action: () => {
        setShowMoodSelector(false);
        setShowJournal(true);
      }
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      if (user) {
        setUserName(user.displayName || '');
        if (!currentSessionId) {
          createNewSession(user.uid)
            .then(sessionId => setCurrentSessionId(sessionId))
            .catch(console.error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !selectedTopic) {
      setMessages([{
        id: 'initial-message',
        content: `Hi${userName ? ` ${userName}` : ''}! How can I help you today? You can choose a specific topic to discuss, or we can just chat about whatever's on your mind.`,
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [isAuthenticated, userName]);

  const getCurrentTopicLabel = () => {
    if (!selectedTopic) return 'General Chat';
    const topic = CHAT_TOPICS.find(t => t.id === selectedTopic);
    return topic ? `${topic.label} Chat` : 'General Chat';
  };

  const loadChatSessions = async () => {
    if (!auth.currentUser) return;
    
    setIsLoadingHistory(true);
    try {
      const sessions = await getChatSessions(auth.currentUser.uid);
      setChatSessions(sessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (showHistory && isAuthenticated) {
      loadChatSessions();
    }
  }, [showHistory, isAuthenticated]);

  const startNewChat = async () => {
    if (!auth.currentUser) return;
    
    try {
      const sessionId = await createNewSession(auth.currentUser.uid);
      setCurrentSessionId(sessionId);
      setMessages([{
        id: 'initial-message',
        content: `Hi${userName ? ` ${userName}` : ''}! How can I help you today?`,
        sender: 'ai',
        timestamp: new Date()
      }]);
      setShowHistory(false);
      setSelectedTopic(null);
      setShowMoodSelector(true);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const loadChatSession = async (sessionId: string) => {
    try {
      const session = await getChatSession(sessionId);
      if (session) {
        setCurrentSessionId(sessionId);
        setMessages(session.messages);
        setShowHistory(false);
        setShowMoodSelector(false);
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
    }
  };

  const handleTopicSelect = async (topicId: string) => {
    setSelectedTopic(topicId);
    setShowMoodSelector(false);
    const topic = CHAT_TOPICS.find(t => t.id === topicId);
    
    let initialMessage = '';
    switch (topicId) {
      case 'general':
        initialMessage = `I'm here to listen and chat with you${userName ? `, ${userName}` : ''}. How are you feeling today?`;
        break;
      case 'anxiety':
        initialMessage = `Let's talk about what's causing you anxiety${userName ? `, ${userName}` : ''}. Can you tell me more about what you're experiencing?`;
        break;
      case 'relationships':
        initialMessage = `I'm here to discuss any relationship concerns you have${userName ? `, ${userName}` : ''}. What's on your mind?`;
        break;
      case 'diagnosis':
        initialMessage = `I can help you understand your symptoms${userName ? `, ${userName}` : ''}. Please describe what you're experiencing, but remember I can't provide medical diagnosis - only information and guidance.`;
        break;
    }

    setMessages([{
      id: `topic-${topicId}`,
      content: initialMessage,
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  const sendMessage = async (content: string = inputMessage) => {
    if (!content.trim() || !auth.currentUser || !isAuthenticated) return;

    setShowMoodSelector(false);

    if (!currentSessionId) {
      try {
        const sessionId = await createNewSession(auth.currentUser.uid);
        setCurrentSessionId(sessionId);
      } catch (error) {
        console.error('Error creating new session:', error);
        return;
      }
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      if (currentSessionId) {
        await saveChatMessage(currentSessionId, userMessage);
      }

      if (detectCrisis(content)) {
        const crisisMessage: Message = {
          id: `crisis-${Date.now()}`,
          content: CRISIS_RESPONSE,
          sender: 'ai',
          timestamp: new Date(),
          isCrisis: true
        };
        setMessages(prev => [...prev, crisisMessage]);
        if (currentSessionId) {
          await saveChatMessage(currentSessionId, crisisMessage);
        }
        setIsTyping(false);
        return;
      }

      const response = await getChatResponse(content, selectedMood, selectedTopic, userName);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      if (currentSessionId) {
        await saveChatMessage(currentSessionId, aiMessage);
      }
      addPoints(5);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      if (currentSessionId) {
        await saveChatMessage(currentSessionId, errorMessage);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodSelector(false);
    if (isAuthenticated) {
      sendMessage(`I'm feeling ${mood.toLowerCase()} today.`);
    }
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

  const handleJournalSave = async (entry: string) => {
    setShowJournal(false);
    const journalMessage: Message = {
      id: `journal-${Date.now()}`,
      content: `I wrote in my journal today: ${entry}`,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, journalMessage]);
    
    if (currentSessionId) {
      await saveChatMessage(currentSessionId, journalMessage);
    }
    
    setIsTyping(true);
    
    try {
      const response = await getChatResponse(
        `I just wrote this in my journal: ${entry}. Can you provide some supportive feedback and insights about my entry?`,
        selectedMood,
        selectedTopic,
        userName
      );
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      if (currentSessionId) {
        await saveChatMessage(currentSessionId, aiMessage);
      }
      
      addPoints(20);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="relative min-h-screen flex">
      <BackgroundAnimation />
      <ChatSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-[60]">
          <div className="bg-white/80 backdrop-blur-md shadow-sm border-b">
            <div className="p-3 md:p-4 flex items-center justify-between max-w-7xl mx-auto w-full">
              <button
                onClick={() => setSidebarOpen(prev => !prev)}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                  isSidebarOpen ? 'bg-purple-50 text-purple-600' : 'text-gray-600'
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="flex items-center space-x-2 bg-purple-50 px-2 md:px-3 py-1.5 rounded-lg">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                  <span className="text-xs md:text-sm font-medium text-purple-700">
                    {getCurrentTopicLabel()}
                  </span>
                </div>
                {selectedMood && (
                  <div className="hidden sm:flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Smile className={`w-4 h-4 ${MOOD_COLORS[selectedMood as keyof typeof MOOD_COLORS]}`} />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedMood}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-2 rounded-lg transition-colors ${
                    showHistory ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <History className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-[60px] md:pt-[70px] pb-[200px] md:pb-[220px] p-3 md:p-4">
          <div className="max-w-7xl mx-auto w-full space-y-4">
            {!selectedTopic && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                {CHAT_TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <motion.button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic.id)}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-2 md:space-x-3 mb-2">
                        <div className="p-1.5 md:p-2 bg-purple-50 rounded-lg">
                          <Icon className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                        </div>
                        <span className="font-medium text-gray-800 text-sm md:text-base">{topic.label}</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">{topic.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <ChatMessage
                  content={message.content}
                  sender={message.sender}
                  isCrisis={message.isCrisis}
                  isError={message.isError}
                />
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

        <div className="fixed bottom-0 left-0 right-0 border-t bg-white/80 backdrop-blur-sm" style={{ zIndex: 30 }}>
          <div className="max-w-7xl mx-auto w-full">
            {showMoodSelector && (
              <div className="px-3 md:px-4 pt-3 md:pt-4">
                <MoodSelector onMoodSelect={handleMoodSelect} />
              </div>
            )}

            <div className="p-2 md:p-3 flex space-x-2 md:space-x-3 overflow-x-auto">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.action}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-lg text-white shadow-md transition-all duration-200 bg-gradient-to-r ${action.gradient} hover:bg-gradient-to-r hover:${action.hoverGradient} flex-shrink-0`}
                >
                  <div className="p-0.5 md:p-1 bg-white/20 rounded-full">
                    {action.icon}
                  </div>
                  <span className="font-medium whitespace-nowrap text-sm md:text-base">
                    <span className="hidden sm:inline">{action.label}</span>
                    <span className="sm:hidden">{action.shortLabel}</span>
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="p-3 md:p-4">
              <form onSubmit={handleSubmit} className="flex space-x-2 md:space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 md:px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                />
                <button
                  type="submit"
                  disabled={!isAuthenticated}
                  className="px-4 md:px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors flex items-center space-x-1 md:space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline text-sm md:text-base">Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-80 bg-white shadow-lg z-[70] overflow-y-auto"
          >
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Chat History</h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={startNewChat}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>
            </div>
            
            <div className="p-4 space-y-2">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
                </div>
              ) : chatSessions.length > 0 ? (
                chatSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => loadChatSession(session.id)}
                    className={`w-full p-3 rounded-lg hover:bg-purple-50 transition-colors text-left flex items-start space-x-3 ${
                      session.id === currentSessionId ? 'bg-purple-50' : ''
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {session.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(session.updatedAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No chat history available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeExercise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80] p-4"
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

      <AnimatePresence>
        {showJournal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[80] p-4"
          >
            <JournalEntry
              onClose={() => setShowJournal(false)}
              onSave={handleJournalSave}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;