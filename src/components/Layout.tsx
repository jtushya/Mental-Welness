import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Coins, Phone, Users, BookOpen, UserCircle, LogOut, Menu, X } from 'lucide-react';
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu') && showUserMenu) {
        setShowUserMenu(false);
      }
      if (!target.closest('.notifications-menu') && showNotifications) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

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
                <h1 className="text-xl md:text-2xl font-semibold text-purple-800">
                  Welcome, <span className="font-bold">{name || 'Guest'}</span>
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4">
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

                <div className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
                  <Coins className="text-yellow-500 w-5 h-5" />
                  <span className="font-medium text-gray-700">{points}</span>
                </div>

                <div className="relative user-menu">
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

                <div className="relative notifications-menu">
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

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1 bg-white border border-gray-200 rounded-lg">
                  <Coins className="text-yellow-500 w-4 h-4" />
                  <span className="font-medium text-gray-700 text-sm">{points}</span>
                </div>
                
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {showMobileMenu ? (
                    <X className="w-6 h-6 text-gray-600" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {showMobileMenu && (
                <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        handleCallSupport();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Speak to Us</span>
                    </button>

                    <button
                      onClick={() => {
                        handleMPower();
                        setShowMobileMenu(false);
                      }}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-left"
                    >
                      MPower
                    </button>

                    <button
                      onClick={() => {
                        handleStudentsAnonymous();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Users className="w-4 h-4" />
                      <span>Students Anonymous</span>
                    </button>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          navigate('/statistics');
                          setShowMobileMenu(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Statistics</span>
                      </button>

                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Bell className="w-5 h-5 text-gray-600" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </header>
      )}

      {isHomePage && <Banner />}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>

      <footer className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-lg font-semibold">Made by Tushya Jain</p>
            </div>
            <div>
              <p className="text-sm">mail: <a href="mailto:techtushya@gmail.com" className="underline">techtushya@gmail.com</a></p>
            </div>
            <div>
              <p className="text-sm">github: <a href="https://github.com/jtushya" target="_blank" rel="noopener noreferrer" className="underline">github.com/jtushya</a></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;