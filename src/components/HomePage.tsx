import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Hero } from './Hero';
import { CasesSection } from './CasesSection';
import { OnboardingModal } from './OnboardingModal';
import { WelcomeBanner } from './WelcomeBanner';
import { NavigationHelper } from './NavigationHelper';
import { OnboardingDebug } from './OnboardingDebug';
import InteractiveTourDemo from './InteractiveTourDemo';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useLocationAwareOnboarding } from '../hooks/useLocationAwareOnboarding';
import { showConfirm } from './CustomAlert';
// import DebugCaseCompletion from './DebugCaseCompletion'; // Keep for future debugging

export const HomePage: React.FC = () => {
  const { userData, currentUser, refreshUserData } = useAuth();
  const { showOnboardingModal, closeOnboarding, markOnboardingComplete, isNewUser, triggerOnboarding } = useOnboarding();
  const { shouldShowOnboarding } = useLocationAwareOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  const availableHints = userData?.hints || 0;
  
  // Trigger onboarding when location-aware hook determines it should show
  useEffect(() => {
    // Don't trigger onboarding if user came from auth page
    const cameFromAuthPage = sessionStorage.getItem('came_from_auth_page');
    if (cameFromAuthPage) {
      sessionStorage.removeItem('came_from_auth_page');
      return; // Skip onboarding trigger
    }

    if (shouldShowOnboarding && !showOnboardingModal) {
      // Small delay to let the UI settle after navigation
      const timer = setTimeout(() => {
        triggerOnboarding();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldShowOnboarding, showOnboardingModal, triggerOnboarding]);
  
  // Refresh user data when the component mounts or when navigating back to the homepage
  useEffect(() => {
    if (currentUser) {
      // logger.info('Refreshing user data on HomePage, completed cases:', userData?.completedCases, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      refreshUserData();
    }
  }, [currentUser, refreshUserData, location.key]);

  const handleCaseSelect = async (caseId: string) => {
    // Check if user is authenticated before starting investigation
    if (!currentUser) {
      const shouldLogin = await showConfirm(
        "You need to login or register to start an investigation. Would you like to go to the login page?",
        {
          title: "🔍 Investigation Access Required",
          type: "warning",
          confirmText: "Go to Login",
          cancelText: "Maybe Later"
        }
      );
      if (shouldLogin) {
        navigate('/signin');
      }
      return;
    }

    // Navigate to appropriate case route dynamically
    switch (caseId) {
      case 'case-vanishing-blogger':
        navigate('/tutorialcase');
        break;
      case 'visual-vanishing-blogger':
        navigate('/vanishingblogger');
        break;
      default:
        // For future cases, use dynamic routing
        navigate(`/case/${caseId}`);
        break;
    }
  };

  const handleStartFirstCase = () => {
    markOnboardingComplete();
    navigate('/tutorialcase');
  };

  const handleShowLearnPage = () => {
    navigate('/training');
  };

  const handleShowAuthPage = () => {
    navigate('/signin');
  };

  const handleShowProfilePage = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header 
        availableHints={availableHints}
        onHomeClick={handleHomeClick}
        onLearnClick={handleShowLearnPage} 
        onAuthClick={handleShowAuthPage}
        onProfileClick={handleShowProfilePage}
      />
      <Hero onLearnClick={handleShowLearnPage} />
      
      {/* Welcome Banner for new users */}
      <WelcomeBanner />
      
      <CasesSection onCaseSelect={handleCaseSelect} onLearnClick={handleShowLearnPage} />
      
      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={closeOnboarding}
        onStartFirstCase={handleStartFirstCase}
        isNewUser={isNewUser}
      />
      
      {/* Navigation Helper for new users */}
      <NavigationHelper />
      
      {/* Debug panels - only show when debug mode is enabled in CMS */}
      <OnboardingDebug />
      <InteractiveTourDemo />
      
      {/* <DebugCaseCompletion /> */}
    </div>
  );
};
