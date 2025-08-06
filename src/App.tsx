import { useEffect, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useMaintenanceMode } from './hooks/useMaintenanceMode';
import { AppRouter } from './components/AppRouter';
import { ToastManager } from './components/Toast';
import { AlertContainer } from './components/CustomAlert';
import MobileWarning from './components/MobileWarning';
import MaintenancePage from './components/MaintenancePage';
import { SEO, seoConfigs } from './components/SEO';
import { GoogleAnalytics } from './utils/analytics';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UnlockSystemProvider } from './contexts/UnlockSystemContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { InteractiveTourProvider } from './contexts/InteractiveTourContext';
import DetectiveLoader from './components/DetectiveLoader';
import { initializePerformanceMonitoring } from './utils/performanceMonitor';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

function AppContent() {
  const { resolvedTheme } = useTheme();
  const { userData, completeCase } = useAuth();
  const { isMaintenanceMode, loading: maintenanceLoading } = useMaintenanceMode();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hints system state - get from user data or default to 0
  const availableHints = userData?.hints || 0;

  // Toast management functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    // Apply theme class and detective atmosphere
    document.documentElement.className = resolvedTheme;
    document.body.className = 'detective-atmosphere';
  }, [resolvedTheme]);

  const handleCaseComplete = async (caseId: string, score: number, timeSpent: number, _hintsUsed: number) => {
    // Update points using the auth context function
    if (completeCase) {
      const result = await completeCase(caseId, score, timeSpent);
      
      // Provide different feedback based on whether points were awarded
      if (result.isRepeat) {
        addToast(`Case already solved! No additional points awarded - try other cases to earn more points.`, 'info');
      } else {
        let message = `Case ${caseId} completed! Earned ${result.pointsAwarded} points.`;
        
        // Add hint bonus message for tutorial completion
        if (caseId === 'case-tutorial') {
          message += ` 🎁 Bonus: +2 hint points for completing your first tutorial!`;
        }
        
        addToast(message, 'success');
      }
    } else {
      addToast(`Case ${caseId} completed! Earned ${score} points.`, 'success');
    }
  };

  // Skip React loader - HTML loader handles everything
  useEffect(() => {
    // Remove HTML loader first, then show DetectiveLoader briefly before showing main app
    const htmlLoader = document.getElementById('initial-loader');
    if (htmlLoader) {
      // Fade out HTML loader after 2 seconds
      setTimeout(() => {
        htmlLoader.style.opacity = '0';
        setTimeout(() => {
          htmlLoader.remove();
        }, 500);
      }, 2000);
    }

    initializePerformanceMonitoring();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Show DetectiveLoader after HTML loader
  if (isLoading || maintenanceLoading) {
    return <DetectiveLoader onLoadingComplete={handleLoadingComplete} />;
  }

  // Check if maintenance mode is enabled (but allow CMS access)
  const currentPath = window.location.pathname;
  const isCMSPath = currentPath.startsWith('/admin');
  
  if (isMaintenanceMode && !isCMSPath) {
    return <MaintenancePage />;
  }

  return (
    <>
      <SEO {...seoConfigs.home} />
      <GoogleAnalytics />
      <AppRouter 
        availableHints={availableHints}
        addToast={addToast}
        onCaseComplete={handleCaseComplete}
      />
      <ToastManager toasts={toasts} removeToast={removeToast} />
      <AlertContainer />
      <MobileWarning />
    </>
  );
}

// Main App component with AuthProvider wrapper
function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <UnlockSystemProvider>
          <InteractiveTourProvider>
            <AppContent />
          </InteractiveTourProvider>
        </UnlockSystemProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}

export default App;