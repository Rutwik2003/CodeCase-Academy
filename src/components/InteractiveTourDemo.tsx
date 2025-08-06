import React, { useState, useEffect } from 'react';
import { useInteractiveTour } from '../contexts/InteractiveTourContext';
import { useAuth } from '../contexts/AuthContext';

const InteractiveTourDemo: React.FC = () => {
  const { isActive, startTour, skipTour, currentStep, tourProgress } = useInteractiveTour();
  const { currentUser, userData } = useAuth();
  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    const debugState = localStorage.getItem('cms_debug_mode_enabled');
    setDebugEnabled(debugState === 'true');
  }, []);

  // Don't render if debug mode is not enabled
  if (!debugEnabled) return null;
  if (!currentUser) return null;

  const getUserStatus = () => {
    const completedCases = userData?.completedCases?.length || 0;
    const hasSeenTour = localStorage.getItem(`interactive_tour_completed_${currentUser.uid}`);
    
    return {
      completedCases,
      hasSeenTour: !!hasSeenTour,
      isNewUser: completedCases === 0 && !hasSeenTour
    };
  };

  const status = getUserStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-800 border border-slate-600 rounded-lg p-4 max-w-sm">
      <h3 className="text-white font-bold mb-2">🚀 Interactive Tour System</h3>
      
      <div className="text-sm text-slate-300 space-y-2 mb-4">
        <div>Status: {status.isNewUser ? '🆕 New User' : status.hasSeenTour ? '✅ Tour Completed' : '🔄 In Progress'}</div>
        <div>Completed Cases: {status.completedCases}</div>
        <div>Tour Seen: {status.hasSeenTour ? 'Yes' : 'No'}</div>
        {isActive && (
          <div>Active Step: {currentStep + 1}/{tourProgress.totalSteps}</div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => startTour('onboarding')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
          disabled={isActive}
        >
          Start Onboarding Tour
        </button>
        
        <button
          onClick={() => startTour('onboardingGuest')}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm transition-colors"
          disabled={isActive}
        >
          Start Guest Tour
        </button>
        
        <button
          onClick={() => startTour('advanced')}
          className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors"
          disabled={isActive}
        >
          Start Advanced Tour
        </button>
        
        <button
          onClick={() => startTour('profile')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded text-sm transition-colors"
          disabled={isActive}
        >
          Start Profile Tour
        </button>

        {isActive && (
          <button
            onClick={skipTour}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
          >
            Skip Tour
          </button>
        )}

        <button
          onClick={() => {
            if (currentUser) {
              localStorage.removeItem(`interactive_tour_completed_${currentUser.uid}`);
            }
            localStorage.removeItem('interactive_tour_guest_completed');
            window.location.reload();
          }}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded text-sm transition-colors"
        >
          Reset All Tour Status
        </button>
      </div>
    </div>
  );
};

export default InteractiveTourDemo;
