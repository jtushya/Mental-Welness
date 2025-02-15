import React, { useState } from 'react';
import { Brain, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityCard from '../components/ActivityCard';

const FocusSession = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(300);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <Link to="/" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      {!isActive && (
        <ActivityCard
          title="Focus Session"
          description="Improve your concentration through a guided meditation session. This practice helps enhance mental clarity and productivity by training your mind to stay present and focused."
          icon={<Brain className="w-8 h-8" />}
          points={50}
          gradient="from-blue-400 to-purple-500"
          duration={5}
          path="/focus-session"
          compact={false}
          onStart={handleStart}
        />
      )}

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  transition: { duration: 4, repeat: Infinity }
                }}
                className="w-64 h-64 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center"
              >
                <div className="text-4xl font-bold text-white">
                  {formatTime(timeLeft)}
                </div>
              </motion.div>

              <motion.p
                animate={{
                  opacity: [0.5, 1, 0.5],
                  transition: { duration: 2, repeat: Infinity }
                }}
                className="text-xl text-purple-800 mb-8"
              >
                Focus on your breath
              </motion.p>

              <button
                onClick={() => setIsActive(false)}
                className="px-6 py-2 bg-white rounded-lg shadow-md text-purple-600 font-medium hover:bg-purple-50 transition-colors"
              >
                End Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isActive && (
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Tips for Better Focus</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
              <span className="text-gray-600">Find a quiet, comfortable space</span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
              <span className="text-gray-600">Sit in an upright, relaxed position</span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
              <span className="text-gray-600">Close your eyes or maintain a soft gaze</span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
              <span className="text-gray-600">Follow the guided instructions mindfully</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FocusSession;