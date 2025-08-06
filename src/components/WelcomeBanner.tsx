import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Code, Trophy, ArrowRight, X } from 'lucide-react';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useAuth } from '../contexts/AuthContext';

export const WelcomeBanner: React.FC = () => {
  const { shouldShowOnboarding, markOnboardingComplete } = useOnboarding();
  const { userData, currentUser } = useAuth();

  // Only show if user is logged in and hasn't completed onboarding
  const showBanner = currentUser && shouldShowOnboarding && !userData?.completedCases?.length;

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative bg-gradient-to-r from-blue-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 mb-8 mx-4 sm:mx-6 lg:mx-8"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-xl blur-xl"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Welcome to CodeCase Detective Academy! 🕵️
              </h3>
            </div>
            <button
              onClick={markOnboardingComplete}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
              title="Dismiss welcome message"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Code className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold text-white">How It Works</h4>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                Solve detective mysteries by fixing broken HTML & CSS code. Each fix reveals story clues!
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h4 className="font-semibold text-white">Earn Rewards</h4>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                Complete missions to earn points, hints, and achievements. Unlock new cases as you progress!
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Star className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold text-white">Track Progress</h4>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                Monitor your detective career in the top navigation. Click your username to view your profile!
              </p>
            </motion.div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-sm text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>You currently have <strong>{userData?.hints || 0} hints</strong> and <strong>{userData?.totalPoints || 0} points</strong></span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const tutorialCase = document.querySelector('[data-case-id="case-vanishing-blogger"]');
                if (tutorialCase) {
                  tutorialCase.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
            >
              <Play className="w-4 h-4" />
              <span>Start Your First Case</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
