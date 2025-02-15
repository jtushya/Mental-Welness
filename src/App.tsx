import React, { useState, useEffect } from 'react';
import { Bell, Moon, Wind, Brain, Coins } from 'lucide-react';
import NameModal from './components/NameModal';
import Banner from './components/Banner';
import ActivityCard from './components/ActivityCard';
import QuoteSlider from './components/QuoteSlider';
import MoodSelector from './components/MoodSelector';
import TherapistCard from './components/TherapistCard';

function App() {
  const [name, setName] = useState<string>('');
  const [showModal, setShowModal] = useState(true);
  const [points, setPoints] = useState(100);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <NameModal isOpen={showModal} onSubmit={handleNameSubmit} />
      
      {/* Header Section */}
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

      {/* Banner */}
      <Banner />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Quote Slider */}
          <QuoteSlider />

          {/* Mood Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MoodSelector />
            </div>
          </div>

          {/* AI Therapist Card */}
          <TherapistCard />

          {/* Recommended Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ActivityCard
                title="Focus Session"
                description="Improve concentration with guided meditation"
                icon={<Brain className="w-8 h-8" />}
                points={50}
                gradient="from-blue-400 to-purple-500"
              />
              <ActivityCard
                title="Breathing Exercise"
                description="Calm your mind with deep breathing"
                icon={<Wind className="w-8 h-8" />}
                points={30}
                gradient="from-green-400 to-teal-500"
              />
              <ActivityCard
                title="Bedtime Routine"
                description="Prepare for restful sleep"
                icon={<Moon className="w-8 h-8" />}
                points={40}
                gradient="from-indigo-400 to-purple-500"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;