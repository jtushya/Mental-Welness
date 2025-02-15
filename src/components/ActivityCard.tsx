import React from 'react';
import { Coins } from 'lucide-react';

interface ActivityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  gradient: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  description,
  icon,
  points,
  gradient,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
      
      <div className="relative p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="mb-2 text-xl font-semibold text-gray-800 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="mb-4 text-gray-600 group-hover:text-white/90 transition-colors">
          {description}
        </p>
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-yellow-500 group-hover:text-yellow-300 transition-colors" />
          <span className="font-medium text-gray-700 group-hover:text-white transition-colors">
            {points} points
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;