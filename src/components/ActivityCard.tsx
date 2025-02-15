import React, { useState } from 'react';
import { Coins, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePoints } from '../context/PointsContext';

interface ActivityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  gradient: string;
  duration?: number;
  path: string;
  compact?: boolean;
  onStart?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  description,
  icon,
  points,
  gradient,
  duration = 5,
  path,
  compact = true,
  onStart,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addPoints } = usePoints();

  const handleStart = () => {
    if (isCompleted) return;
    
    if (onStart) {
      onStart();
      return;
    }
    
    setIsActive(true);
    const intervalTime = (duration * 60 * 1000) / 100;
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsActive(false);
        setIsCompleted(true);
        addPoints(points);
      }
    }, intervalTime);
  };

  if (!compact) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${gradient}`} />
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient}`}>
                {React.cloneElement(icon as React.ReactElement, { className: 'w-8 h-8 text-white' })}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-600">{points} points</span>
                </div>
              </div>
            </div>
            {isCompleted && <CheckCircle2 className="w-8 h-8 text-green-500" />}
          </div>

          <p className="text-gray-600 text-lg mb-8">{description}</p>

          {!isCompleted && (
            <button
              onClick={handleStart}
              disabled={isActive}
              className={`w-full py-3 rounded-lg font-medium text-center transition-colors
                ${isActive 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r ' + gradient + ' text-white hover:opacity-90'
                }`}
            >
              {isActive ? `Progress: ${progress}%` : 'Start Activity'}
            </button>
          )}
          
          {isActive && (
            <div className="mt-6 bg-gray-100 rounded-full h-2">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
      
      <div className="relative p-6">
        <div className="mb-4 flex justify-between items-start">
          <div>{icon}</div>
          {isCompleted && (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          )}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="mb-4 text-gray-600 group-hover:text-white/90 transition-colors">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-yellow-500 group-hover:text-yellow-300 transition-colors" />
            <span className="font-medium text-gray-700 group-hover:text-white transition-colors">
              {points} points
            </span>
          </div>
          
          {onStart ? (
            <button
              onClick={onStart}
              className="flex items-center space-x-1 text-purple-600 group-hover:text-white font-medium"
            >
              <span>Start</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              to={path}
              className="flex items-center space-x-1 text-purple-600 group-hover:text-white font-medium"
            >
              <span>Start</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityCard;