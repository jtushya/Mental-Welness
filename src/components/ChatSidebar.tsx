import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Brain,
  ChevronDown,
  Sparkles,
  Phone,
  BookOpen,
  Settings,
  HelpCircle,
  Shield,
  ChevronRight,
  Bell,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const aiModels = [
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Balanced performance and efficiency',
    icon: Sparkles
  },
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
    icon: Brain
  }
];

const resources = [
  { 
    title: 'Crisis Support',
    description: '24/7 support when you need it most',
    icon: Phone,
    action: () => window.open('tel:988', '_blank')
  },
  {
    title: 'Wellness Library',
    description: 'Articles and guides for mental health',
    icon: BookOpen,
    action: () => window.open('https://www.nimh.nih.gov/health', '_blank')
  },
  {
    title: 'Privacy & Security',
    description: 'How we protect your data',
    icon: Shield,
    action: () => window.open('#', '_blank')
  }
];

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onModelChange
}) => {
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [showPreferences, setShowPreferences] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'New Feature Available',
      message: 'Try our new breathing exercises',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'Daily Reminder',
      message: 'Time for your mindfulness practice',
      time: '5 hours ago',
      read: false
    }
  ];

  const [readNotifications, setReadNotifications] = useState<number[]>([]);

  const handleNotificationClick = (id: number) => {
    if (!readNotifications.includes(id)) {
      setReadNotifications(prev => [...prev, id]);
    }
  };

  const unreadCount = notifications.filter(n => !readNotifications.includes(n.id)).length;

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', JSON.stringify(newValue));
    document.documentElement.classList.toggle('dark', newValue);
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('soundEnabled', JSON.stringify(newValue));
  };

  const handleHelpClick = () => {
    window.open('https://support.mindfulai.com', '_blank');
  };

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
          <h2 className="text-xl font-semibold text-gray-800">Settings & Resources</h2>
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
        {/* Notifications Section */}
        <div className="p-4 border-b">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-purple-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Notifications</div>
                <div className="text-xs text-gray-500">
                  {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
              showNotifications ? 'rotate-90' : ''
            }`} />
          </button>
          
          {showNotifications && (
            <div className="mt-2 space-y-2">
              {notifications.map(notification => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    readNotifications.includes(notification.id)
                      ? 'bg-gray-50'
                      : 'bg-purple-50'
                  }`}
                >
                  <div className="font-medium text-gray-800">{notification.title}</div>
                  <div className="text-sm text-gray-600">{notification.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="p-4 border-b">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Resources</h3>
          <div className="space-y-2">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <button
                  key={index}
                  onClick={resource.action}
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

        {/* Settings */}
        <div className="p-4 border-b">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-purple-500" />
              <div className="text-left">
                <div className="font-medium text-gray-800">Preferences</div>
                <div className="text-xs text-gray-500">Customize your experience</div>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
              showPreferences ? 'rotate-90' : ''
            }`} />
          </button>

          {showPreferences && (
            <div className="mt-2 space-y-2">
              <button
                onClick={toggleDarkMode}
                className="w-full p-3 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-purple-500" />
                  ) : (
                    <Sun className="w-5 h-5 text-purple-500" />
                  )}
                  <span className="font-medium text-gray-800">
                    {darkMode ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-purple-500' : 'bg-gray-200'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform mt-1 ${
                    darkMode ? 'translate-x-5 ml-1' : 'translate-x-1'
                  }`} />
                </div>
              </button>

              <button
                onClick={toggleSound}
                className="w-full p-3 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-purple-500" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-purple-500" />
                  )}
                  <span className="font-medium text-gray-800">
                    {soundEnabled ? 'Sound On' : 'Sound Off'}
                  </span>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors ${
                  soundEnabled ? 'bg-purple-500' : 'bg-gray-200'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform mt-1 ${
                    soundEnabled ? 'translate-x-5 ml-1' : 'translate-x-1'
                  }`} />
                </div>
              </button>
            </div>
          )}
        </div>

        {/* AI Model Selection (at the bottom) */}
        <div className="p-4 mt-auto">
          <h3 className="text-sm font-medium text-gray-500 mb-3">AI Model</h3>
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="w-full p-3 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <div className="text-left">
                  <div className="font-medium text-gray-800">
                    {aiModels.find(model => model.id === selectedModel)?.name || 'Select Model'}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                showModelDropdown ? 'rotate-180' : ''
              }`} />
            </button>

            {showModelDropdown && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                {aiModels.map(model => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full p-3 flex items-center space-x-3 hover:bg-purple-50 transition-colors ${
                      selectedModel === model.id ? 'bg-purple-50' : ''
                    }`}
                  >
                    <model.icon className="w-5 h-5 text-purple-500" />
                    <div className="text-left">
                      <div className="font-medium text-gray-800">{model.name}</div>
                      <div className="text-xs text-gray-500">{model.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="p-4 border-t bg-purple-50">
        <button 
          onClick={handleHelpClick}
          className="w-full flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-700"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Get Help</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ChatSidebar;