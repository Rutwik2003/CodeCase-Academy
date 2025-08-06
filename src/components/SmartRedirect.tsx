import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';

interface SmartRedirectProps {
  fallbackPath?: string;
}

// Component that handles smart redirects for authenticated users
// New users go to homepage for onboarding, existing users go to profile
export function SmartRedirect({ fallbackPath = '/profile' }: SmartRedirectProps) {
  const location = useLocation();
  
  // Only redirect if we're not already where we need to be
  if (location.pathname === '/' || location.pathname === '/home') {
    return null; // Already on homepage
  }
  
  try {
    const { currentUser } = useAuth();
    const { hasCompletedOnboarding } = useOnboarding();

    // Only redirect if user is authenticated
    if (!currentUser) {
      return null;
    }

    // If user is new (hasn't completed onboarding), send them to homepage for the tour
    if (!hasCompletedOnboarding) {
      return <Navigate to="/" replace />;
    }

    // For existing users, redirect to their intended destination or profile
    return <Navigate to={fallbackPath} replace />;
  } catch (error) {
    console.error('SmartRedirect error:', error);
    // Fallback to default redirect if there's an error
    return <Navigate to={fallbackPath} replace />;
  }
}
