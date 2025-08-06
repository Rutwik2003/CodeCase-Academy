import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Code, 
  Trophy, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  X,
  Target,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFirstCase: () => void;
  isNewUser?: boolean;
}

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  highlight?: string;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartFirstCase,
  isNewUser = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const { currentUser } = useAuth();

  // Force close modal if we're on auth pages
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === '/signin' || currentPath === '/signup') {
      onClose();
    }
  }, [onClose]);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to CodeCase Detective Academy! 🕵️",
      subtitle: "Where Coding Meets Mystery",
      description: "You're about to embark on an exciting journey where you'll solve mysterious cases by fixing broken code. Each solved challenge reveals clues and advances the story!",
      icon: <Search className="w-16 h-16 text-blue-400" />,
      highlight: "Learn HTML, CSS & JavaScript through engaging detective stories"
    },
    {
      id: 2,
      title: "How It Works 🎮",
      subtitle: "Interactive Learning Experience",
      description: "Each case presents you with broken HTML/CSS code. Your mission is to identify and fix the issues to reveal story clues. The better you fix the code, the more hints you earn!",
      icon: <Code className="w-16 h-16 text-green-400" />,
      highlight: "Real code editor with instant preview and validation"
    },
    {
      id: 3,
      title: "Earn Points & Unlock Cases 🏆",
      subtitle: "Gamified Progress System",
      description: "Complete missions to earn points, hints, and achievements. Use your points to unlock new detective cases and advance through increasingly challenging mysteries.",
      icon: <Trophy className="w-16 h-16 text-yellow-400" />,
      highlight: "Points system: Fix code → Earn points → Unlock content"
    },
    {
      id: 4,
      title: "Your Detective Toolkit 🛠️",
      subtitle: "Everything You Need",
      description: "Monitor your progress in the top navigation. Click your username to view your profile, achievements, and referral stats. The hint counter shows your available assistance.",
      icon: <Target className="w-16 h-16 text-purple-400" />,
      highlight: "Track hints, points, completed cases, and achievements"
    },
    {
      id: 5,
      title: "Ready to Start? 🚀",
      subtitle: "Your First Case Awaits",
      description: "Let's begin with the Tutorial Case - a perfect introduction to our system. You'll learn the basics while helping solve your first mystery!",
      icon: <Play className="w-16 h-16 text-red-400" />,
      action: {
        label: "Start Tutorial Case",
        onClick: onStartFirstCase
      },
      highlight: "Perfect for beginners - guided experience with hints"
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    setIsCompleting(true);
    setTimeout(() => {
      // Mark both the OnboardingModal and InteractiveTour as completed
      // to prevent duplicate onboarding experiences
      if (currentUser?.uid) {
        localStorage.setItem(`interactive_tour_completed_${currentUser.uid}`, 'true');
      } else {
        localStorage.setItem('interactive_tour_completed_guest', 'true');
      }
      
      onClose();
      setIsCompleting(false);
      setCurrentStep(0);
    }, 500);
  };

  const currentStepData = onboardingSteps[currentStep];

  // Auto-close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">CodeCase Detective Academy</h2>
                    <p className="text-sm text-blue-100">
                      {isNewUser ? "Welcome, Detective!" : "Quick Tour"} • Step {currentStep + 1} of {onboardingSteps.length}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-white h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-6"
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="flex justify-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                      {currentStepData.icon}
                    </div>
                  </motion.div>

                  {/* Title & Subtitle */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentStepData.title}
                    </h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                      {currentStepData.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-lg mx-auto">
                    {currentStepData.description}
                  </p>

                  {/* Highlight Box */}
                  {currentStepData.highlight && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
                    >
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {currentStepData.highlight}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                {/* Previous Button */}
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Step Indicators */}
                <div className="flex space-x-2">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-blue-600'
                          : index < currentStep
                          ? 'bg-blue-300'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Next/Action Button */}
                {currentStepData.action ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={currentStepData.action.onClick}
                    disabled={isCompleting}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all font-medium shadow-lg"
                  >
                    <Play className="w-4 h-4" />
                    <span>{currentStepData.action.label}</span>
                  </motion.button>
                ) : currentStep === onboardingSteps.length - 1 ? (
                  <button
                    onClick={completeOnboarding}
                    disabled={isCompleting}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 transition-all font-medium"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{isCompleting ? 'Completing...' : 'Get Started!'}</span>
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
