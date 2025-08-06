import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface OnboardingContextType {
  hasCompletedOnboarding: boolean;
  shouldShowOnboarding: boolean;
  showOnboardingModal: boolean;
  markOnboardingComplete: () => void;
  triggerOnboarding: () => void;
  closeOnboarding: () => void;
  isNewUser: boolean;
  isMobile: boolean;
  shouldSkipOnboarding: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { userData, currentUser } = useAuth();
  const deviceInfo = useDeviceDetection();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Skip onboarding on mobile devices as it's not effective
  const shouldSkipOnboarding = deviceInfo.isMobile;

  // Close onboarding modal when on auth pages
  useEffect(() => {
    const handleLocationChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/signin' || currentPath === '/signup') {
        setShowOnboardingModal(false);
      }
    };

    // Initial check
    handleLocationChange();

    // Listen for URL changes
    window.addEventListener('popstate', handleLocationChange);
    
    // Custom event for programmatic navigation
    window.addEventListener('locationchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('locationchange', handleLocationChange);
    };
  }, []);

  // Check if user has completed onboarding
  useEffect(() => {
    if (userData) {
      // Check if user has any completed cases or has been around for a while
      const hasCompletedCases = userData.completedCases && userData.completedCases.length > 0;
      const hasPoints = userData.totalPoints > 0;
      const hasPlayedBefore = hasCompletedCases || hasPoints;
      
      setHasCompletedOnboarding(hasPlayedBefore);
      
      // Check if this is a newly registered user (created within last 5 minutes)
      // BUT only if this is their first login session
      if (userData.createdAt) {
        const now = new Date();
        const createdAt = userData.createdAt.toDate();
        const timeDiff = now.getTime() - createdAt.getTime();
        const fiveMinutes = 5 * 60 * 1000;
        
        // Only consider as new user if:
        // 1. Account was created within last 5 minutes
        // 2. User hasn't played before (no completed cases or points)
        // 3. This is not a returning session (check localStorage)
        const hasSeenApp = localStorage.getItem(`user_has_logged_in_${userData.uid}`);
        const isFirstTimeUser = timeDiff < fiveMinutes && !hasPlayedBefore && !hasSeenApp;
        
        setIsNewUser(isFirstTimeUser);
        
        // Mark that this user has now logged in
        if (userData.uid) {
          localStorage.setItem(`user_has_logged_in_${userData.uid}`, 'true');
        }
      }
    }
  }, [userData]);

  // Auto-show onboarding for new users (but not on mobile)
  // DISABLED: Let location-aware components handle when to show onboarding
  // This prevents onboarding from appearing on auth/signin pages
  /*
  useEffect(() => {
    if (currentUser && userData && isNewUser && !hasCompletedOnboarding && !shouldSkipOnboarding) {
      // Small delay to let the UI settle
      const timer = setTimeout(() => {
        setShowOnboardingModal(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser, userData, isNewUser, hasCompletedOnboarding, shouldSkipOnboarding]);
  */

  const shouldShowOnboarding = !hasCompletedOnboarding && Boolean(currentUser) && !shouldSkipOnboarding;

  const markOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setShowOnboardingModal(false);
    
    // Store in localStorage to remember for future sessions
    if (currentUser) {
      localStorage.setItem(`onboarding_completed_${currentUser.uid}`, 'true');
    }
  };

  const triggerOnboarding = () => {
    setShowOnboardingModal(true);
  };

  const closeOnboarding = () => {
    setShowOnboardingModal(false);
  };

  // Check localStorage for returning users
  useEffect(() => {
    if (currentUser) {
      const completed = localStorage.getItem(`onboarding_completed_${currentUser.uid}`);
      if (completed === 'true') {
        setHasCompletedOnboarding(true);
      }
    }
  }, [currentUser]);

  const value: OnboardingContextType = {
    hasCompletedOnboarding,
    shouldShowOnboarding,
    showOnboardingModal,
    markOnboardingComplete,
    triggerOnboarding,
    closeOnboarding,
    isNewUser,
    isMobile: deviceInfo.isMobile,
    shouldSkipOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
