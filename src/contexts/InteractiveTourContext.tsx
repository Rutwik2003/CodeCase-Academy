import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { logger, LogCategory } from '../utils/logger';

interface InteractiveTourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'scroll' | 'none' | 'choice';
  waitForElement?: boolean;
  highlightStyle?: 'pulse' | 'glow' | 'bounce';
  nextTrigger?: 'auto' | 'click' | 'manual';
  delay?: number;
  scrollTo?: boolean;
  showChoiceButtons?: boolean;
}

interface InteractiveTourContextType {
  isActive: boolean;
  currentStep: number;
  currentTourStep: InteractiveTourStep | null;
  startTour: (tourType?: 'onboarding' | 'onboardingGuest' | 'advanced' | 'profile', forceRestart?: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  highlightElement: (selector: string, scrollTo?: boolean) => void;
  removeHighlight: () => void;
  tourProgress: {
    totalSteps: number;
    completedSteps: number;
    percentage: number;
  };
}

const InteractiveTourContext = createContext<InteractiveTourContextType | null>(null);

export const useInteractiveTour = () => {
  const context = useContext(InteractiveTourContext);
  if (!context) {
    throw new Error('useInteractiveTour must be used within InteractiveTourProvider');
  }
  return context;
};

// Define different tour types
const TOUR_STEPS = {
  onboarding: [
    {
      id: 'welcome',
      title: 'Welcome to CodeCase Detective Academy! 🕵️',
      description: 'Let\'s take a quick tour to show you exactly how to use the platform. Use the Next button to continue.',
      target: 'header',
      position: 'center' as const,
      action: 'none' as const,
      nextTrigger: 'manual' as const,
      delay: 100
    },
    {
      id: 'hints-points',
      title: 'Your Detective Stats 📊',
      description: 'These show your available hints and investigation points. These are your resources for solving cases!',
      target: '#detective-stats-panel',
      position: 'bottom' as const,
      action: 'none' as const,
      highlightStyle: 'glow' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    },
    {
      id: 'profile-button',
      title: 'Your Detective Profile 👤',
      description: 'Click here to view your complete detective profile, achievements, and progress tracking.',
      target: '#detective-profile-button',
      position: 'bottom' as const,
      action: 'none' as const,
      highlightStyle: 'glow' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    },
    {
      id: 'first-case',
      title: 'Start Your First Case! 🔍',
      description: 'This is your first detective case. Scroll down to see it, then start solving mysteries by fixing broken code!',
      target: '[data-case-id="case-vanishing-blogger"]',
      position: 'top' as const,
      action: 'none' as const,
      highlightStyle: 'bounce' as const,
      nextTrigger: 'manual' as const,
      delay: 500,
      waitForElement: true,
      scrollTo: true
    },
    {
      id: 'help-button',
      title: 'Need Help Anytime? 🆘',
      description: 'This help button is always available. Click it whenever you need guidance or want to replay this tour!',
      target: 'button[title*="Interactive Guide"]',
      position: 'bottom' as const,
      action: 'none' as const,
      highlightStyle: 'pulse' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    }
  ],
  onboardingGuest: [
    {
      id: 'welcome-guest',
      title: 'Welcome to CodeCase Detective Academy! 🕵️',
      description: 'You\'re exploring as a guest. Let me show you around and how to get started!',
      target: 'header',
      position: 'center' as const,
      action: 'none' as const,
      nextTrigger: 'manual' as const,
      delay: 100
    },
    {
      id: 'auth-button',
      title: 'Sign In to Start Your Journey! 🔐',
      description: 'Click here to sign in or create your detective account. You\'ll need an account to save progress and solve cases!',
      target: '#auth-signin-button',
      position: 'bottom' as const,
      action: 'none' as const,
      highlightStyle: 'glow' as const,
      nextTrigger: 'manual' as const,
      delay: 500
    },
    {
      id: 'preview-cases',
      title: 'Preview Available Cases 🔍',
      description: 'Scroll down to see the detective cases available. Sign in to unlock and start solving them!',
      target: '[data-case-id="case-vanishing-blogger"]',
      position: 'top' as const,
      action: 'none' as const,
      highlightStyle: 'pulse' as const,
      nextTrigger: 'manual' as const,
      delay: 500,
      scrollTo: true
    },
    {
      id: 'training-academy',
      title: 'Learn the Basics �',
      description: 'Access the Training Academy to learn HTML/CSS fundamentals before diving into cases!',
      target: '#training-academy-button',
      position: 'top' as const,
      action: 'none' as const,
      highlightStyle: 'glow' as const,
      nextTrigger: 'manual' as const,
      delay: 300,
      scrollTo: true
    }
  ],
  advanced: [
    {
      id: 'unlock-system',
      title: 'Case Unlocking System 🔓',
      description: 'Complete cases to earn points and unlock new mysteries. Each case has different requirements and rewards.',
      target: '.unlock-info, [class*="unlock"], [title*="unlock"]',
      position: 'top' as const,
      action: 'none' as const,
      nextTrigger: 'manual' as const,
      delay: 300,
      scrollTo: true
    },
    {
      id: 'referral-system',
      title: 'Referral Rewards 🎁',
      description: 'Invite friends to earn bonus points and hints. Share your detective journey!',
      target: 'button[title*="referral"], [class*="referral"]',
      position: 'bottom' as const,
      action: 'none' as const,
      highlightStyle: 'glow' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    },
    {
      id: 'daily-login',
      title: 'Daily Login Streak 🎯',
      description: 'Login daily to build your streak and earn bonus rewards. Consistency is key!',
      target: 'button[title*="Daily Login"]',
      position: 'bottom' as const,
      action: 'none' as const,
      highlightStyle: 'pulse' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    },
    {
      id: 'achievements',
      title: 'Track Your Progress 🏆',
      description: 'Check your profile to see achievements, completed cases, and detective rank progression.',
      target: '#detective-profile-button',
      position: 'bottom' as const,
      action: 'none' as const,
      highlightStyle: 'glow' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    }
  ],
  profile: [
    {
      id: 'profile-welcome',
      title: 'Welcome to Your Detective Profile! 🕵️‍♀️',
      description: 'This is your personal command center where you can track your progress, manage settings, and view achievements. Let\'s explore all the features!',
      target: 'header',
      position: 'center' as const,
      action: 'none' as const,
      nextTrigger: 'manual' as const,
      delay: 100
    },
    {
      id: 'profile-stats-overview',
      title: 'Your Detective Dashboard 📊',
      description: 'Here you can see your detective stats - Cases Solved, Hints Available, and Total Points earned. These numbers track your progress as a detective!',
      target: '#profile-cases-solved',
      position: 'top' as const,
      action: 'none' as const,
      highlightStyle: 'glow' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    },
    {
      id: 'profile-hints-points',
      title: 'Your Detective Resources 💡⭐',
      description: 'Keep track of your hints and points! Hints help you solve difficult cases, and points show your total experience earned from investigations.',
      target: '#profile-hints-available',
      position: 'top' as const,
      action: 'none' as const,
      highlightStyle: 'pulse' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    },
    {
      id: 'profile-total-points',
      title: 'Experience Points System 🌟',
      description: 'Your total points reflect your detective expertise! Earn more by solving cases, finding evidence, and completing challenges.',
      target: '#profile-total-points',
      position: 'top' as const,
      action: 'none' as const,
      highlightStyle: 'glow' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    },
    {
      id: 'profile-achievements-access',
      title: 'View Your Achievements 🏆',
      description: 'Click here to see all your unlocked badges and awards! Track your detective milestones and show off your investigation skills.',
      target: '#profile-achievements-tab',
      position: 'top' as const,
      action: 'none' as const,
      highlightStyle: 'glow' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    },
    {
      id: 'profile-security-settings',
      title: 'Account Security & Settings ⚙️',
      description: 'Manage your account settings, update passwords, change your email, and customize your detective profile preferences from here.',
      target: '#profile-security-settings',
      position: 'left' as const,
      action: 'none' as const,
      nextTrigger: 'manual' as const,
      delay: 300
    },
    {
      id: 'profile-navigation-choice',
      title: 'Ready to Start Investigating? 🔍',
      description: 'You\'ve learned about your profile! Now you can head to the home page to start solving cases, or stay here to explore more profile features.',
      target: 'header',
      position: 'center' as const,
      action: 'choice' as const,
      nextTrigger: 'manual' as const,
      delay: 300,
      showChoiceButtons: true
    }
  ]
};

interface InteractiveTourProviderProps {
  children: ReactNode;
}

export const InteractiveTourProvider: React.FC<InteractiveTourProviderProps> = ({ children }) => {
  const { userData, currentUser } = useAuth();
  const deviceInfo = useDeviceDetection();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTour, setCurrentTour] = useState<InteractiveTourStep[]>([]);
  const [currentTourType, setCurrentTourType] = useState<'onboarding' | 'onboardingGuest' | 'advanced' | 'profile' | null>(null);

  const currentTourStep = currentTour[currentStep] || null;

  // Skip tours on mobile devices as they're not effective
  const shouldSkipTours = deviceInfo.isMobile;

  // Auto-start onboarding for new users (but not on mobile or auth pages)
  useEffect(() => {
    if (shouldSkipTours) {
      return; // Skip auto-starting tours on mobile
    }

    // Don't auto-start tour on auth pages (signin/signup)
    const currentPath = window.location.pathname;
    if (currentPath === '/signin' || currentPath === '/signup') {
      return;
    }

    const hasSeenGuestTour = localStorage.getItem('interactive_tour_guest_completed');
    
    if (currentUser && userData) {
      // Logged-in user logic
      const isNewUser = !userData.completedCases?.length;
      const hasSeenTour = localStorage.getItem(`interactive_tour_completed_${currentUser.uid}`);
      
      // Don't auto-start tour for authenticated users - let OnboardingModal handle it
      // This prevents duplicate onboarding experiences
      if (isNewUser && !hasSeenTour && !isActive) {
        // Skip auto-starting the interactive tour if user is new
        // The OnboardingModal will handle the onboarding experience instead
        logger.info(LogCategory.TOUR, 'Skipping auto-start tour for new user - OnboardingModal will handle it');
        return;
      }
    } else if (!currentUser && !hasSeenGuestTour && !isActive) {
      // Guest user logic - show guest onboarding after a delay (only on homepage)
      if (currentPath === '/') {
        setTimeout(() => {
          startTour('onboardingGuest');
        }, 2000); // Longer delay for guests to see the interface first
      }
    }
  }, [currentUser, userData, isActive, shouldSkipTours]);

  const startTour = (tourType: 'onboarding' | 'onboardingGuest' | 'advanced' | 'profile' = 'onboarding', forceRestart: boolean = false) => {
    // Skip tours on mobile devices
    if (shouldSkipTours && !forceRestart) {
      logger.info(LogCategory.TOUR, 'Skipping interactive tour on mobile device');
      return;
    }

    // Check if this specific tour type has been completed before (unless forced restart)
    if (!forceRestart) {
      let completionKey = '';
      if (tourType === 'profile') {
        completionKey = currentUser ? 
          `interactive_tour_profile_completed_${currentUser.uid}` : 
          'interactive_tour_profile_completed_guest';
      } else if (tourType === 'onboardingGuest') {
        completionKey = 'interactive_tour_guest_completed';
      } else if (tourType === 'onboarding') {
        completionKey = currentUser ? 
          `interactive_tour_completed_${currentUser.uid}` : 
          'interactive_tour_completed_guest';
      } else if (tourType === 'advanced') {
        completionKey = currentUser ? 
          `interactive_tour_advanced_completed_${currentUser.uid}` : 
          'interactive_tour_advanced_completed_guest';
      }

      // Check if this tour has been completed before
      if (completionKey && localStorage.getItem(completionKey)) {
        logger.info(LogCategory.TOUR, `${tourType} tour already completed, skipping...`);
        return;
      }
    }

    const steps = TOUR_STEPS[tourType];
    
    // Enhanced logging to show replay status
    const isReplay = !forceRestart ? false : localStorage.getItem(
      tourType === 'profile' ? 
        (currentUser ? `interactive_tour_profile_completed_${currentUser.uid}` : 'interactive_tour_profile_completed_guest') :
      tourType === 'onboardingGuest' ? 'interactive_tour_guest_completed' :
      tourType === 'onboarding' ? 
        (currentUser ? `interactive_tour_completed_${currentUser.uid}` : 'interactive_tour_completed_guest') :
      tourType === 'advanced' ? 
        (currentUser ? `interactive_tour_advanced_completed_${currentUser.uid}` : 'interactive_tour_advanced_completed_guest') : ''
    );
    
    logger.info(LogCategory.TOUR, isReplay ? 
      `🔄 Replaying ${tourType} tour (${steps.length} steps)` : 
      `🎯 Starting ${tourType} tour (${steps.length} steps)`
    );
    
    setCurrentTour(steps);
    setCurrentTourType(tourType);
    setCurrentStep(0);
    setIsActive(true);
    removeHighlight();
  };

  const nextStep = () => {
    if (currentStep < currentTour.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    removeHighlight();
    
    // Mark the specific tour type as completed when skipped
    let completionKey = '';
    if (currentTourType === 'profile') {
      completionKey = currentUser ? 
        `interactive_tour_profile_completed_${currentUser.uid}` : 
        'interactive_tour_profile_completed_guest';
    } else if (currentTourType === 'onboardingGuest') {
      completionKey = 'interactive_tour_guest_completed';
    } else if (currentTourType === 'onboarding') {
      completionKey = currentUser ? 
        `interactive_tour_completed_${currentUser.uid}` : 
        'interactive_tour_completed_guest';
    } else if (currentTourType === 'advanced') {
      completionKey = currentUser ? 
        `interactive_tour_advanced_completed_${currentUser.uid}` : 
        'interactive_tour_advanced_completed_guest';
    }

    if (completionKey) {
      localStorage.setItem(completionKey, 'true');
      logger.info(LogCategory.TOUR, `${currentTourType} tour skipped and marked as completed`);
    }
    
    setCurrentTourType(null);
  };

  const completeTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    removeHighlight();
    
    // Mark the specific tour type as completed
    let completionKey = '';
    if (currentTourType === 'profile') {
      completionKey = currentUser ? 
        `interactive_tour_profile_completed_${currentUser.uid}` : 
        'interactive_tour_profile_completed_guest';
    } else if (currentTourType === 'onboardingGuest') {
      completionKey = 'interactive_tour_guest_completed';
    } else if (currentTourType === 'onboarding') {
      completionKey = currentUser ? 
        `interactive_tour_completed_${currentUser.uid}` : 
        'interactive_tour_completed_guest';
    } else if (currentTourType === 'advanced') {
      completionKey = currentUser ? 
        `interactive_tour_advanced_completed_${currentUser.uid}` : 
        'interactive_tour_advanced_completed_guest';
    }

    if (completionKey) {
      localStorage.setItem(completionKey, 'true');
      logger.info(LogCategory.TOUR, `${currentTourType} tour completed and saved`);
    }
    
    setCurrentTourType(null);
  };

  const highlightElement = (selector: string, scrollTo: boolean = false) => {
    removeHighlight(); // Clear previous highlights
    
    // Add highlight class to target element
    setTimeout(() => {
      const elements = document.querySelectorAll(selector);
      const element = elements[0];
      
      if (element) {
        element.classList.add('interactive-tour-highlight');
        
        // Add specific highlight style if specified
        if (currentTourStep?.highlightStyle) {
          element.classList.add(currentTourStep.highlightStyle);
        }
        
        // Scroll to element if needed
        if (scrollTo) {
          setTimeout(() => {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }, 200);
        }
      }
    }, 100);
  };

  const removeHighlight = () => {
    // Remove highlight from all elements
    const highlighted = document.querySelectorAll('.interactive-tour-highlight');
    highlighted.forEach(el => {
      el.classList.remove('interactive-tour-highlight');
    });
  };

  // Auto-highlight current step target
  useEffect(() => {
    if (isActive && currentTourStep?.target) {
      const delay = currentTourStep.delay || 0;
      setTimeout(() => {
        highlightElement(currentTourStep.target, currentTourStep.scrollTo || false);
      }, delay);
    }
  }, [isActive, currentStep, currentTourStep]);

  const tourProgress = {
    totalSteps: currentTour.length,
    completedSteps: currentStep,
    percentage: currentTour.length > 0 ? (currentStep / currentTour.length) * 100 : 0
  };

  const value: InteractiveTourContextType = {
    isActive,
    currentStep,
    currentTourStep,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    highlightElement,
    removeHighlight,
    tourProgress
  };

  return (
    <InteractiveTourContext.Provider value={value}>
      {children}
      
      {/* Global tour styles */}
      <style>{`
        .interactive-tour-highlight {
          position: relative;
          z-index: 1000 !important;
          animation: tour-pulse 2s infinite;
          border-radius: 8px;
          box-shadow: 0 0 0 4px #3b82f6 !important, 0 0 0 8px rgba(59, 130, 246, 0.4) !important;
          background: rgba(59, 130, 246, 0.1) !important;
        }
        
        .interactive-tour-highlight.bounce {
          animation: tour-bounce 1.5s infinite;
        }
        
        .interactive-tour-highlight.glow {
          animation: tour-glow 2s infinite;
          box-shadow: 0 0 30px #3b82f6 !important, 0 0 60px rgba(59, 130, 246, 0.6) !important;
          background: rgba(59, 130, 246, 0.15) !important;
        }
        
        @keyframes tour-pulse {
          0%, 100% { 
            box-shadow: 0 0 0 4px #3b82f6, 0 0 0 8px rgba(59, 130, 246, 0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 0 6px #3b82f6, 0 0 0 12px rgba(59, 130, 246, 0.6);
            transform: scale(1.02);
          }
        }
        
        @keyframes tour-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        
        @keyframes tour-glow {
          0%, 100% { 
            box-shadow: 0 0 30px #3b82f6, 0 0 60px rgba(59, 130, 246, 0.4);
            background: rgba(59, 130, 246, 0.1);
          }
          50% { 
            box-shadow: 0 0 40px #3b82f6, 0 0 80px rgba(59, 130, 246, 0.8);
            background: rgba(59, 130, 246, 0.2);
          }
        }
        
        .interactive-tour-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 999;
          pointer-events: none;
        }
      `}</style>
    </InteractiveTourContext.Provider>
  );
};
