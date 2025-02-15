import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bell, Coins } from 'lucide-react';
import { usePoints } from '../context/PointsContext';
import NameModal from './NameModal';
import Banner from './Banner';

const Layout = () => {
  const [name, setName] = useState<string>('');
  const [showModal, setShowModal] = useState(true);
  const { points } = usePoints();
  const location = useLocation();

  const handleNameSubmit = (submittedName: string) => {
    setName(submittedName);
    setShowModal(false);
    localStorage.setItem('userName', submittedName);
  };

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setName(savedName);
      setShowModal(false);
    }
  }, []);

  const isHomePage = location.pathname === '/';
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <NameModal isOpen={showModal} onSubmit={handleNameSubmit} />
      
      {/* Header Section - Only show on non-chat pages */}
      {!isChatPage && (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-purple-800">
                  Welcome, {name || 'Guest'}
                </h1>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Coins className="text-yellow-500 w-6 h-6" />
                  <span className="font-medium text-gray-700">{points} points</span>
                </div>
                <button className="relative">
                  <Bell className="w-6 h-6 text-gray-600 hover:text-purple-600 transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    2
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Show Banner only on home page */}
      {isHomePage && <Banner />}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;