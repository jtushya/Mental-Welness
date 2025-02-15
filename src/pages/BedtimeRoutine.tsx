import React, { useState } from 'react';
import { Moon, ArrowLeft, Moon as MoonIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityCard from '../components/ActivityCard';

const BedtimeRoutine = () => {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const steps = [
    {
      title: "Dim the lights",
      instruction: "Lower the lights in your room to signal to your body it's time to rest"
    },
    {
      title: "Deep breaths",
      instruction: "Take 5 deep, calming breaths"
    },
    {
      title: "Progressive relaxation",
      instruction: "Relax each part of your body, starting from your toes"
    },
    {
      title: "Mental clearing",
      instruction: "Let go of today's thoughts and prepare for restful sleep"
    }
  ];

  const handleStart = () => {
    setIsActive(true);
    setStep(1);
    
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= totalSteps) {
          clearInterval(interval);
          setTimeout(() => setIsActive(false), 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 60000 / totalSteps);
  };

  return (
    <div>
      <Link to="/" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6">
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>

      {!isActive && (
        <ActivityCard
          title="Bedtime Routine"
          description="Develop a calming bedtime routine to improve your sleep quality. This guided session will help you wind down and prepare your mind and body for restful sleep."
          icon={<Moon className="w-8 h-8" />}
          points={40}
          gradient="from-indigo-400 to-purple-500"
          duration={4}
          path="/bedtime-routine"
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
            className="fixed inset-0 bg-gradient-to-b from-indigo-50 to-purple-50 flex items-center justify-center z-50"
          >
            <div className="text-center max-w-md mx-auto px-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                  transition: { duration: 8, repeat: Infinity }
                }}
                className="w-24 h-24 mx-auto mb-8"
              >
                <MoonIcon className="w-full h-full text-indigo-500" />
              </motion.div>

              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                  {steps[step - 1].title}
                </h3>
                <p className="text-lg text-indigo-600">
                  {steps[step - 1].instruction}
                </p>
              </motion.div>

              <div className="flex justify-center space-x-2 mb-8">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i + 1 === step ? 'bg-indigo-500' : 'bg-indigo-200'
                    }`}
                    animate={i + 1 === step ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ))}
              </div>

              <button
                onClick={() => setIsActive(false)}
                className="px-6 py-2 bg-white rounded-lg shadow-md text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
              >
                End Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isActive && (
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sleep Hygiene Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Do's:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" />
                  <span className="text-gray-600">Maintain a consistent sleep schedule</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" />
                  <span className="text-gray-600">Keep your bedroom cool and dark</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2" />
                  <span className="text-gray-600">Practice relaxation techniques</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Don'ts:</h4>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                  <span className="text-gray-600">Use electronic devices before bed</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                  <span className="text-gray-600">Consume caffeine late in the day</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                  <span className="text-gray-600">Exercise right before bedtime</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedtimeRoutine;