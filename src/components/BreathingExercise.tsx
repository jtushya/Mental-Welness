import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X } from 'lucide-react';

interface BreathingExerciseProps {
  onComplete: () => void;
  onClose: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete, onClose }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const totalCycles = 4;

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          setPhase((currentPhase) => {
            if (currentPhase === 'inhale') return 'hold';
            if (currentPhase === 'hold') return 'exhale';
            setCycles((prev) => {
              if (prev + 1 >= totalCycles) {
                clearInterval(timer);
                setTimeout(onComplete, 1000);
              }
              return prev + 1;
            });
            return 'inhale';
          });
          return phase === 'inhale' ? 7 : phase === 'hold' ? 8 : 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, onComplete]);

  const getInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
    }
  };

  const circleVariants = {
    inhale: {
      scale: 2,
      transition: { duration: 4, ease: 'easeInOut' }
    },
    hold: {
      scale: 2,
      transition: { duration: 7, ease: 'linear' }
    },
    exhale: {
      scale: 1,
      transition: { duration: 8, ease: 'easeInOut' }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex items-center space-x-4 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <Wind className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">4-7-8 Breathing</h3>
        </div>

        <div className="relative w-48 h-48 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <motion.div
            variants={circleVariants}
            animate={phase}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {count}
              </div>
              <div className="text-lg text-blue-600 font-medium">
                {getInstructions()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>Cycle {cycles + 1} of {totalCycles}</div>
          <div className="flex space-x-2">
            {Array.from({ length: totalCycles }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= cycles ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;