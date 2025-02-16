import React from 'react';
import { Sparkles } from 'lucide-react';

const Banner = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <p className="text-sm font-medium">
              New: AI-powered mood tracking, breathing exercises, and mindfulness content library now available!
            </p>
          </div>
          <button className="text-sm underline hover:text-purple-200 transition-colors">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;