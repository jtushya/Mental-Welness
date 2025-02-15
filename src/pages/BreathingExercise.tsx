import React, { useState, useEffect } from 'react';
import { Wind, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityCard from '../components/ActivityCard';

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') return 'hold';
            if (currentPhase === 'hold') return 'exhale';
            setCycles((prev) => prev + 1);
            return 'inhale';
          });
          return phase === 'inhale' ? 7 : phase === 'hold' ? 8 : 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(4);
    setCycles(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(4);
  };

  const getInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
    }
  };

  const circleVariants = {
    inhale: {
      scale: 2.5,
      transition: { duration: 4, ease: 'easeInOut' }
    },
    hold: {
      scale: 2.5,
      transition: { duration: 7, ease: 'linear' }
    },
    exhale: {
      scale: 1,
      transition: { duration: 8, ease: 'easeInOut' }
    }
  };

  return (
    <div>
      <Link to="/" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      {!isActive && (
        <ActivityCard
          title="Breathing Exercise"
          description="Practice deep breathing techniques to reduce stress and anxiety. This exercise will guide you through a calming breathing pattern that helps activate your body's relaxation response."
          icon={<Wind className="w-8 h-8" />}
          points={30}
          gradient="from-green-400 to-teal-500"
          duration={3}
          path="/breathing-exercise"
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
            className="fixed inset-0 bg-gradient-to-b from-green-50 to-teal-50 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <motion.div
                variants={circleVariants}
                animate={phase}
                className="relative w-64 h-64 mx-auto mb-8"
              >
                <div className="absolute inset-0 rounded-full border-4 border-green-200" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-teal-500 opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-800 mb-2">
                      {count}
                    </div>
                    <div className="text-lg text-green-600 font-medium">
                      {getInstructions()}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="text-green-800 mb-4">
                Cycles completed: {cycles}
              </div>

              <button
                onClick={handleStop}
                className="px-6 py-2 bg-white rounded-lg shadow-md text-green-600 font-medium hover:bg-green-50 transition-colors"
              >
                End Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isActive && (
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">4-7-8 Breathing Technique</h3>
          <div className="space-y-4">
            <p className="text-gray-600">Follow these steps:</p>
            <ol className="space-y-3">
              <li className="flex items-start space-x-3">
                <span className="font-medium text-green-600">1.</span>
                <span className="text-gray-600">Inhale quietly through your nose for 4 seconds</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-medium text-green-600">2.</span>
                <span className="text-gray-600">Hold your breath for 7 seconds</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-medium text-green-600">3.</span>
                <span className="text-gray-600">Exhale completely through your mouth for 8 seconds</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="font-medium text-green-600">4.</span>
                <span className="text-gray-600">Repeat the cycle 3-4 times</span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingExercise;