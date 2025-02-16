import React from 'react';
import { Brain, Wind, Moon, Music, Headphones, BookOpen, Video, Newspaper } from 'lucide-react';
import ActivityCard from '../components/ActivityCard';
import QuoteSlider from '../components/QuoteSlider';
import MoodSelector from '../components/MoodSelector';
import TherapistCard from '../components/TherapistCard';

const ContentCard = ({ title, description, icon: Icon, gradient }: any) => (
  <div className={`p-6 rounded-xl bg-gradient-to-r ${gradient} text-white`}>
    <Icon className="w-8 h-8 mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-white/90 text-sm">{description}</p>
  </div>
);

const Home = () => {
  const contentCategories = [
    {
      title: "Mindful Music",
      description: "Curated playlists for meditation and relaxation",
      icon: Music,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      title: "Wellness Podcasts",
      description: "Expert discussions on mental health and well-being",
      icon: Headphones,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Self-Help Books",
      description: "Recommended readings for personal growth",
      icon: BookOpen,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Guided Videos",
      description: "Visual guides for meditation and exercises",
      icon: Video,
      gradient: "from-teal-500 to-green-500"
    },
    {
      title: "Articles & Research",
      description: "Latest insights in mental wellness",
      icon: Newspaper,
      gradient: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <div className="space-y-8">
      <QuoteSlider />
      
      <div className="flex justify-center">
        <div className="w-full lg:w-2/3">
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

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Mindfulness Content Library</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentCategories.map((category, index) => (
            <ContentCard key={index} {...category} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;