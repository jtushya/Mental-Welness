import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot as Lotus, X } from 'lucide-react';

interface RelaxationExerciseProps {
  onComplete: () => void;
  onClose: () => void;
}

const RelaxationExercise: React.FC<RelaxationExerciseProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    "Find a comfortable position",
    "Close your eyes gently",
    "Take deep, calming breaths",
    "Release any tension",
    "Focus on the present moment",
    "Let your thoughts float away"
  ];

  useEffect(() => {
    const stepDuration = 5000; // 5 seconds per step
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentStep((prevStep) => {
            if (prevStep >= steps.length - 1) {
              clearInterval(interval);
              setTimeout(onComplete, 1000);
              return prevStep;
            }
            return prevStep + 1;
          });
          return 0;
        }
        return prev + (100 / (stepDuration / 1000));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [steps.length, onComplete]);

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
          <div className="p-2 rounded-lg bg-purple-100">
            <Lotus className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Guided Relaxation</h3>
        </div>

        <div className="relative w-48 h-48 mx-auto mb-6">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                key={currentStep}
                className="text-lg font-medium text-purple-600 max-w-[200px]"
              >
                {steps[currentStep]}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>Step {currentStep + 1} of {steps.length}</div>
            <div className="flex space-x-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= currentStep ? 'bg-purple-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelaxationExercise;