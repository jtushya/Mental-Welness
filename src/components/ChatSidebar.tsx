import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  MessageSquare, 
  Smile, 
  BookOpen, 
  ChevronDown,
  Sparkles,
  History,
  Phone,
  Brain
} from 'lucide-react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const aiModels = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    icon: Brain
  },
  {
    id: 'claude-2',
    name: 'Claude 2',
    description: 'Advanced reasoning and analysis',
    icon: Sparkles
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Balanced performance and efficiency',
    icon: Brain
  }
];

const recentChats = [
  { id: 1, title: 'Anxiety Management', timestamp: '2 hours ago' },
  { id: 2, title: 'Sleep Improvement', timestamp: 'Yesterday' },
  { id: 3, title: 'Stress Relief', timestamp: '3 days ago' },
];

const resources = [
  { 
    title: 'Crisis Helpline',
    description: '24/7 support when you need it most',
    icon: Phone
  },
  {
    title: 'Meditation Guide',
    description: 'Learn the basics of mindfulness',
    icon: Brain
  },
  {
    title: 'Mood Journal',
    description: 'Track your emotional well-being',
    icon: BookOpen
  }
];

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onModelChange
}) => {
  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed inset-y-0 left-0 w-80 bg-white shadow-lg z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">MindfulAI Chat</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* AI Model Selector */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium text-gray-500 mb-3">AI Model</h3>
          <div className="space-y-2">
            {aiModels.map((model) => {
              const Icon = model.icon;
              return (
                <button
                  key={model.id}
                  onClick={() => onModelChange(model.id)}
                  className={`w-full p-3 rounded-lg transition-all ${
                    selectedModel === model.id
                      ? 'bg-purple-50 border border-purple-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${
                      selectedModel === model.id ? 'text-purple-500' : 'text-gray-500'
                    }`} />
                    <div className="text-left">
                      <div className="font-medium text-gray-800">{model.name}</div>
                      <div className="text-xs text-gray-500">{model.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat History */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
            <History className="w-4 h-4 mr-2" />
            Chat History
          </h3>
          <div className="space-y-2">
            {recentChats.map((chat) => (
              <button
                key={chat.id}
                className="w-full p-3 rounded-lg hover:bg-purple-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-800">{chat.title}</div>
                      <div className="text-xs text-gray-500">{chat.timestamp}</div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mood Selector */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
            <Smile className="w-4 h-4 mr-2" />
            Current Mood
          </h3>
          <button className="w-full p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors flex items-center justify-between">
            <span className="text-purple-700 font-medium">Change Mood</span>
            <ChevronDown className="w-4 h-4 text-purple-500" />
          </button>
        </div>

        {/* Resources */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Resources
          </h3>
          <div className="space-y-2">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <button
                  key={index}
                  className="w-full p-3 rounded-lg hover:bg-purple-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-gray-800">{resource.title}</div>
                      <div className="text-xs text-gray-500">{resource.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-purple-50">
        <div className="text-xs text-gray-500 text-center">
          Need immediate help? Call 988 for 24/7 support
        </div>
      </div>
    </motion.div>
  );
};

export default ChatSidebar;