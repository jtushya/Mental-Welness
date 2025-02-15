import React from 'react';
import { Brain, Wind, Moon } from 'lucide-react';
import ActivityCard from '../components/ActivityCard';
import QuoteSlider from '../components/QuoteSlider';
import MoodSelector from '../components/MoodSelector';
import TherapistCard from '../components/TherapistCard';

const Home = () => {
  return (
    <div className="space-y-6">
      <QuoteSlider />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MoodSelector />
        </div>
      </div>

      <TherapistCard />

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Recommended for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActivityCard
            title="Focus Session"
            description="Improve concentration with guided meditation"
            icon={<Brain className="w-8 h-8" />}
            points={50}
            gradient="from-blue-400 to-purple-500"
            duration={5}
            path="/focus-session"
          />
          <ActivityCard
            title="Breathing Exercise"
            description="Calm your mind with deep breathing"
            icon={<Wind className="w-8 h-8" />}
            points={30}
            gradient="from-green-400 to-teal-500"
            duration={3}
            path="/breathing-exercise"
          />
          <ActivityCard
            title="Bedtime Routine"
            description="Prepare for restful sleep"
            icon={<Moon className="w-8 h-8" />}
            points={40}
            gradient="from-indigo-400 to-purple-500"
            duration={4}
            path="/bedtime-routine"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;