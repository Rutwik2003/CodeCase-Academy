import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';

/**
 * Hook to handle location-aware onboarding behavior
 * Should be used in components that are inside the Router context
 */
export const useLocationAwareOnboarding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const { hasCompletedOnboarding, isNewUser, triggerOnboarding } = useOnboarding();

  // Determine current page type
  const currentPage = (() => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'homepage';
    if (path === '/profile') return 'profile';
    if (path === '/signin' || path === '/signup') return 'auth';
    return 'other';
  })();

  // Handle new user redirects and onboarding
  useEffect(() => {
    if (!currentUser || !userData || !isNewUser) return;

    // If user is new and on auth page, redirect to homepage
    if (currentPage === 'auth') {
      navigate('/', { replace: true });
      return;
    }

    // If user is new and hasn't completed onboarding, show it
    if (!hasCompletedOnboarding && (currentPage === 'homepage' || currentPage === 'profile')) {
      // Small delay to let the UI settle
      const timer = setTimeout(() => {
        triggerOnboarding();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser, userData, isNewUser, hasCompletedOnboarding, currentPage, navigate, triggerOnboarding]);

  return {
    currentPage,
    isHomepage: currentPage === 'homepage',
    isProfile: currentPage === 'profile',
    isAuth: currentPage === 'auth',
    shouldShowOnboarding: isNewUser && !hasCompletedOnboarding && (currentPage === 'homepage' || currentPage === 'profile')
  };
};
