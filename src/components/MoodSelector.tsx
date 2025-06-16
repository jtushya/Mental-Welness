import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, Heart, Star } from 'lucide-react';

interface Mood {
  icon: React.FC<any>;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  selectedBg: string;
}

const moods: Mood[] = [
  {
    icon: Heart,
    label: 'Loved',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    selectedBg: 'bg-pink-500',
  },
  {
    icon: Smile,
    label: 'Happy',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    selectedBg: 'bg-green-500',
  },
  {
    icon: Meh,
    label: 'Okay',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    selectedBg: 'bg-yellow-500',
  },
  {
    icon: Frown,
    label: 'Sad',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    selectedBg: 'bg-blue-500',
  },
  {
    icon: Star,
    label: 'Excited',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    selectedBg: 'bg-purple-500',
  },
];

interface MoodSelectorProps {
  onMoodSelect?: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
    const newMoodEntry = {
      mood,
      timestamp: new Date().toISOString(),
    };
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    const updatedHistory = [...moodHistory, newMoodEntry];
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-2 md:p-3">
      <div className="grid grid-cols-5 gap-1 md:gap-1.5">
        {moods.map(({ icon: Icon, label, color, bgColor, borderColor, selectedBg }) => {
          const isSelected = selectedMood === label;
          return (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(label)}
              className={`
                rounded-lg border transition-all duration-200
                flex flex-col items-center justify-center gap-1 py-2 md:py-2
                ${isSelected ? `${selectedBg} border-white` : `${bgColor} ${borderColor}`}
              `}
            >
              <Icon className={`w-6 h-6 md:w-8 md:h-8 ${isSelected ? 'text-white' : color}`} />
              <span className={`text-[9px] md:text-[10px] font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;