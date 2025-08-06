import React, { useEffect } from 'react';
import { ArrowLeft, Award, Target, CheckCircle, Clock, Star } from 'lucide-react';

interface ProgressPageProps {
  onBack: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onBack }) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Mock progress data - in a real app, this would come from state/API
  const progressData = {
    totalCases: 5,
    completedCases: 0,
    totalPoints: 0,
    achievements: [],
    currentStreak: 0,
    timeSpent: 0
  };

  const achievements = [
    { id: 1, name: 'First Case', icon: '🔍', description: 'Complete your first case', unlocked: false },
    { id: 2, name: 'HTML Hero', icon: '🦸', description: 'Master HTML semantic elements', unlocked: false },
    { id: 3, name: 'CSS Champion', icon: '🎨', description: 'Create beautiful CSS layouts', unlocked: false },
    { id: 4, name: 'Detective Expert', icon: '🕵️', description: 'Solve 5 cases perfectly', unlocked: false },
    { id: 5, name: 'Code Buster', icon: '💻', description: 'Complete all available cases', unlocked: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Progress Dashboard</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track your detective journey</p>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              🎯 Your coding adventure awaits
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cases Solved</h3>
                <p className="text-2xl font-bold text-blue-500">{progressData.completedCases}/{progressData.totalCases}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progressData.completedCases / progressData.totalCases) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Star className="w-8 h-8 text-amber-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Points Earned</h3>
                <p className="text-2xl font-bold text-amber-500">{progressData.totalPoints}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Keep solving to earn more!</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievements</h3>
                <p className="text-2xl font-bold text-green-500">{progressData.achievements.length}/{achievements.length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Unlock badges by completing cases</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Time Spent</h3>
                <p className="text-2xl font-bold text-purple-500">{progressData.timeSpent}h</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Learning takes time!</p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🏆 Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  achievement.unlocked
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      achievement.unlocked 
                        ? 'text-green-800 dark:text-green-200' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm ${
                      achievement.unlocked 
                        ? 'text-green-600 dark:text-green-300' 
                        : 'text-gray-500 dark:text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🚀 Ready to Start Your Journey?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't solved any cases yet! Jump into your first detective case and start earning points, 
            unlocking achievements, and mastering HTML & CSS.
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
          >
            Explore Cases
          </button>
        </div>
      </div>
    </div>
  );
};
