import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';

interface NavigationTip {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
}

const navigationTips: NavigationTip[] = [
  {
    id: 'hints',
    title: 'Your Detective Toolkit 🔍',
    description: 'These numbers show your available hints and investigation points. Use hints when you\'re stuck on a coding challenge!',
    target: '[title*="Investigation Points"], [title*="hints"]',
    position: 'bottom'
  },
  {
    id: 'profile',
    title: 'Your Detective Profile 👤',
    description: 'Click on your name to view your detective profile, achievements, and case completion stats.',
    target: '[class*="profile"], [class*="username"]',
    position: 'bottom'
  },
  {
    id: 'help',
    title: 'Need Help? 🆘',
    description: 'Click this help button anytime to replay this tutorial or get guidance on how to use the platform.',
    target: '[title*="Quick Tour"]',
    position: 'bottom'
  },
  {
    id: 'cases',
    title: 'Active Cases 📁',
    description: 'Scroll down to see all available detective cases. Start with the highlighted "Vanishing Blogger" case!',
    target: '#cases',
    position: 'top'
  }
];

export const NavigationHelper: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const { shouldShowOnboarding } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showHelper, setShowHelper] = useState(false);

  // Show helper for new users after onboarding modal is closed
  useEffect(() => {
    // Don't show NavigationHelper if user has completed OnboardingModal or has cases
    if (currentUser && shouldShowOnboarding && !userData?.completedCases?.length) {
      // Check if OnboardingModal onboarding has been completed
      const hasCompletedModalOnboarding = localStorage.getItem(`onboarding_completed_${currentUser.uid}`);
      
      // Only show NavigationHelper if OnboardingModal hasn't been completed
      if (!hasCompletedModalOnboarding) {
        // Delay showing the helper to let the UI settle
        const timer = setTimeout(() => {
          setShowHelper(true);
          setIsVisible(true);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentUser, shouldShowOnboarding, userData?.completedCases]);

  const nextTip = () => {
    if (currentTip < navigationTips.length - 1) {
      setCurrentTip(currentTip + 1);
    } else {
      // End of tips, hide helper
      setIsVisible(false);
      setTimeout(() => setShowHelper(false), 300);
    }
  };

  const prevTip = () => {
    if (currentTip > 0) {
      setCurrentTip(currentTip - 1);
    }
  };

  const dismissHelper = () => {
    setIsVisible(false);
    setTimeout(() => setShowHelper(false), 300);
  };

  const currentTipData = navigationTips[currentTip];

  if (!showHelper || !currentTipData) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={dismissHelper}
          />

          {/* Floating tip card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <h3 className="font-bold">Navigation Guide</h3>
                </div>
                <button
                  onClick={dismissHelper}
                  className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 text-sm text-blue-100">
                Tip {currentTip + 1} of {navigationTips.length}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                {currentTipData.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {currentTipData.description}
              </p>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevTip}
                  disabled={currentTip === 0}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-2">
                  {navigationTips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTip
                          ? 'bg-blue-600'
                          : index < currentTip
                          ? 'bg-blue-300'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTip}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <span>{currentTip === navigationTips.length - 1 ? 'Finish' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Highlight effect for target element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-30"
          >
            <style>{`
              .nav-tip-highlight {
                box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.3);
                border-radius: 8px;
                animation: pulse-highlight 2s infinite;
              }
              
              @keyframes pulse-highlight {
                0%, 100% { box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.3); }
                50% { box-shadow: 0 0 0 2px #3b82f6, 0 0 0 8px rgba(59, 130, 246, 0.5); }
              }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Hook to manually trigger the navigation helper
export const useNavigationHelper = () => {
  const [showHelper, setShowHelper] = useState(false);

  const triggerHelper = () => {
    setShowHelper(true);
  };

  return { showHelper, triggerHelper };
};
