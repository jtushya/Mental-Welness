import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Coins, Phone, Users, BookOpen, UserCircle, LogOut } from 'lucide-react';
import { usePoints } from '../context/PointsContext';
import { useNotifications } from '../components/NotificationsContext';
import NameModal from './NameModal';
import Banner from './Banner';
import NotificationsPanel from './NotificationsPanel';
import { auth, googleProvider } from '../lib/firebase';
import { getRedirectResult } from 'firebase/auth';
import { AnimatePresence } from 'framer-motion';

const Layout = () => {
  const [name, setName] = useState<string>('');
  const [showModal, setShowModal] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { points } = usePoints();
  const { notifications, markAsRead, clearAll, unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNameSubmit = (submittedName: string) => {
    setName(submittedName);
    setShowModal(false);
    localStorage.setItem('userName', submittedName);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCallSupport = () => {
    window.location.href = 'tel:+911234567890';
  };

  const handleMPower = () => {
    window.open('https://mpowerminds.com/', '_blank');
  };

  const handleStudentsAnonymous = () => {
    window.open('#', '_blank');
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    // Handle navigation or other actions based on notification type
    const notification = notifications.find(n => n.id === id);
    if (notification?.link) {
      navigate(notification.link);
    }
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user?.displayName) {
          handleNameSubmit(result.user.displayName);
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
      }
    };

    handleRedirectResult();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.displayName) {
        setName(user.displayName);
        setShowModal(false);
        localStorage.setItem('userName', user.displayName);
      } else {
        setShowModal(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const isHomePage = location.pathname === '/';
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <NameModal isOpen={showModal} onSubmit={handleNameSubmit} />
      
      {!isChatPage && (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-purple-800">
                  Welcome, {name || 'Guest'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* Support Buttons */}
                <button
                  onClick={handleCallSupport}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <Phone className="w-4 h-4" />
                  <span>Speak to Us</span>
                </button>

                <button
                  onClick={handleMPower}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  MPower
                </button>

                <button
                  onClick={handleStudentsAnonymous}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <Users className="w-4 h-4" />
                  <span>Students Anonymous</span>
                </button>

                {/* Points */}
                <div className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
                  <Coins className="text-yellow-500 w-5 h-5" />
                  <span className="font-medium text-gray-700">{points}</span>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="relative"
                  >
                    <UserCircle className="w-6 h-6 text-gray-600 hover:text-purple-600 transition-colors" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={() => navigate('/statistics')}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-purple-50 w-full text-left"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>View Statistics</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Bell className="w-6 h-6 text-gray-600 hover:text-purple-600 transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <NotificationsPanel
                        notifications={notifications}
                        onClose={() => setShowNotifications(false)}
                        onMarkAsRead={handleNotificationClick}
                        onClearAll={clearAll}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {isHomePage && <Banner />}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;