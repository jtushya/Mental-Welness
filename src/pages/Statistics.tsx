import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Activity, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface MoodEntry {
  mood: string;
  timestamp: string;
}

interface PointsEntry {
  points: number;
  timestamp: string;
}

const MOOD_COLORS = {
  'Loved': '#ec4899',
  'Happy': '#22c55e',
  'Okay': '#eab308',
  'Sad': '#3b82f6',
  'Excited': '#a855f7'
};

const Statistics = () => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsEntry[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  useEffect(() => {
    // Load mood history from localStorage
    const storedMoodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setMoodHistory(storedMoodHistory);

    // Generate mock points history for demonstration
    const mockPointsHistory = Array.from({ length: 30 }, (_, i) => ({
      points: Math.floor(Math.random() * 50) + 100 + (i * 5), // Increasing trend
      timestamp: subDays(new Date(), 29 - i).toISOString()
    }));
    setPointsHistory(mockPointsHistory);
  }, []);

  const filterDataByTimeRange = (data: any[], days: number) => {
    const cutoffDate = subDays(new Date(), days);
    return data.filter(entry => new Date(entry.timestamp) >= cutoffDate);
  };

  const aggregateMoodData = () => {
    const moodCounts: { [key: string]: number } = {};
    const filteredMoods = filterDataByTimeRange(
      moodHistory,
      timeRange === 'week' ? 7 : 30
    );

    filteredMoods.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count
    }));
  };

  const formatPointsData = () => {
    const filteredPoints = filterDataByTimeRange(
      pointsHistory,
      timeRange === 'week' ? 7 : 30
    );

    return filteredPoints.map(entry => ({
      points: entry.points,
      date: format(new Date(entry.timestamp), 'MMM d')
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === 'week'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Last Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeRange === 'month'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Last Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Points Over Time */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Points Progress</h3>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatPointsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Mood Distribution</h3>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={aggregateMoodData()}
                  dataKey="count"
                  nameKey="mood"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ mood, percent }) => 
                    `${mood} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {aggregateMoodData().map((entry, index) => (
                    <Cell
                      key={index}
                      fill={MOOD_COLORS[entry.mood as keyof typeof MOOD_COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <h4 className="font-medium text-gray-700">Tracking Days</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {moodHistory.length} days
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="w-5 h-5 text-green-500" />
            <h4 className="font-medium text-gray-700">Most Common Mood</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {aggregateMoodData().sort((a, b) => b.count - a.count)[0]?.mood || 'N/A'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h4 className="font-medium text-gray-700">Points Earned</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {pointsHistory[pointsHistory.length - 1]?.points || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h4 className="font-medium text-gray-700">Last Updated</h4>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {moodHistory.length > 0
              ? format(new Date(moodHistory[moodHistory.length - 1].timestamp), 'MMM d')
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;