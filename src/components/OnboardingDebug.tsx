import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';

export const OnboardingDebug: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const { 
    hasCompletedOnboarding, 
    shouldShowOnboarding, 
    showOnboardingModal, 
    triggerOnboarding,
    markOnboardingComplete,
    isNewUser 
  } = useOnboarding();

  const [debugEnabled, setDebugEnabled] = useState(false);

  useEffect(() => {
    const debugState = localStorage.getItem('cms_debug_mode_enabled');
    setDebugEnabled(debugState === 'true');
  }, []);

  // Don't render if debug mode is not enabled
  if (!debugEnabled) return null;
  if (!currentUser) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <h4 className="font-bold text-yellow-400 mb-2">🔍 Onboarding Debug</h4>
      <div className="space-y-1">
        <div>User: {currentUser.email}</div>
        <div>New User: {isNewUser ? '✅' : '❌'}</div>
        <div>Completed Cases: {userData?.completedCases?.length || 0}</div>
        <div>Has Completed Onboarding: {hasCompletedOnboarding ? '✅' : '❌'}</div>
        <div>Should Show Onboarding: {shouldShowOnboarding ? '✅' : '❌'}</div>
        <div>Modal Open: {showOnboardingModal ? '✅' : '❌'}</div>
      </div>
      
      <div className="mt-3 space-y-1">
        <button
          onClick={triggerOnboarding}
          className="block w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Trigger Onboarding
        </button>
        <button
          onClick={() => {
            // Clear localStorage and reset state
            Object.keys(localStorage).forEach(key => {
              if (key.includes('onboarding_completed')) {
                localStorage.removeItem(key);
              }
            });
            window.location.reload();
          }}
          className="block w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Reset & Reload
        </button>
        <button
          onClick={markOnboardingComplete}
          className="block w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          Mark Complete
        </button>
      </div>
    </div>
  );
};
