import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bug, 
  Settings, 
  RotateCcw, 
  Play, 
  Square, 
  AlertCircle,
  CheckCircle,
  Info,
  Trash2
} from 'lucide-react';
import { showAlert } from '../../components/CustomAlert';

const DebugMode: React.FC = () => {
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState({
    user: null as string | null,
    guestCompleted: false,
    userCompleted: false,
    profileCompleted: false,
    advancedCompleted: false
  });

  // Load debug state and onboarding status
  useEffect(() => {
    const debugState = localStorage.getItem('cms_debug_mode_enabled');
    setDebugEnabled(debugState === 'true');
    loadOnboardingStatus();
  }, []);

  const loadOnboardingStatus = () => {
    const guestCompleted = localStorage.getItem('interactive_tour_guest_completed');
    const userCompleted = localStorage.getItem('interactive_tour_completed_user');
    const profileCompleted = localStorage.getItem('interactive_tour_profile_completed_guest');
    const advancedCompleted = localStorage.getItem('interactive_tour_advanced_completed_guest');

    setOnboardingStatus({
      user: 'guest', // Could be enhanced to detect actual user
      guestCompleted: !!guestCompleted,
      userCompleted: !!userCompleted,
      profileCompleted: !!profileCompleted,
      advancedCompleted: !!advancedCompleted
    });
  };

  const toggleDebugMode = () => {
    const newState = !debugEnabled;
    setDebugEnabled(newState);
    localStorage.setItem('cms_debug_mode_enabled', newState.toString());
    
    if (newState) {
      showAlert('Debug Mode Enabled! Go back to the homepage to see debug tools.', {
        title: '✅ Debug Mode Active',
        type: 'success'
      });
    } else {
      showAlert('Debug Mode Disabled! Debug tools will be hidden on the homepage.', {
        title: '❌ Debug Mode Inactive',
        type: 'info'
      });
    }
  };

  const resetOnboardingData = (type: string) => {
    switch (type) {
      case 'guest':
        localStorage.removeItem('interactive_tour_guest_completed');
        break;
      case 'user':
        localStorage.removeItem('interactive_tour_completed_user');
        break;
      case 'profile':
        localStorage.removeItem('interactive_tour_profile_completed_guest');
        break;
      case 'advanced':
        localStorage.removeItem('interactive_tour_advanced_completed_guest');
        break;
      case 'all':
        localStorage.removeItem('interactive_tour_guest_completed');
        localStorage.removeItem('interactive_tour_completed_user');
        localStorage.removeItem('interactive_tour_profile_completed_guest');
        localStorage.removeItem('interactive_tour_advanced_completed_guest');
        break;
    }
    loadOnboardingStatus();
  };

  const triggerOnboarding = (type: string) => {
    showAlert(`To test ${type} onboarding: Go to homepage and click the help button or use the debug panel.`, {
      title: '🎯 Testing Instructions',
      type: 'info'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
          <Bug className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Debug Mode</h1>
          <p className="text-white/60">Developer tools for testing and debugging features</p>
        </div>
      </div>

      {/* Debug Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Debug Mode Control</h2>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            debugEnabled 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {debugEnabled ? 'ENABLED' : 'DISABLED'}
          </div>
        </div>
        
        <p className="text-white/70 mb-6">
          Enable debug mode to show development tools on the homepage for testing onboarding flows and interactive tours.
        </p>
        
        <button
          onClick={toggleDebugMode}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all border ${
            debugEnabled
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30'
              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {debugEnabled ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{debugEnabled ? 'Disable Debug Mode' : 'Enable Debug Mode'}</span>
        </button>
      </motion.div>

      {/* Onboarding Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Info className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Interactive Tour Status</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { key: 'guestCompleted', label: 'Guest Tour', type: 'guest' },
            { key: 'userCompleted', label: 'User Tour', type: 'user' },
            { key: 'profileCompleted', label: 'Profile Tour', type: 'profile' },
            { key: 'advancedCompleted', label: 'Advanced Tour', type: 'advanced' }
          ].map(({ key, label, type }) => (
            <div key={key} className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">{label}</span>
                <div className="flex items-center space-x-2">
                  {onboardingStatus[key as keyof typeof onboardingStatus] ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${
                    onboardingStatus[key as keyof typeof onboardingStatus] ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {onboardingStatus[key as keyof typeof onboardingStatus] ? 'Completed' : 'Not Started'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => triggerOnboarding(type)}
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-3 py-2 rounded text-xs font-medium transition-all"
                >
                  Test Tour
                </button>
                <button
                  onClick={() => resetOnboardingData(type)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-2 rounded text-xs font-medium transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => resetOnboardingData('all')}
            className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg font-medium transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Tours</span>
          </button>
          <button
            onClick={loadOnboardingStatus}
            className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg font-medium transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refresh Status</span>
          </button>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-amber-400">How to Use Debug Mode</h3>
        </div>
        <div className="space-y-3 text-white/80">
          <p><strong>1.</strong> Enable Debug Mode using the toggle above</p>
          <p><strong>2.</strong> Go back to the homepage (you'll see debug panels)</p>
          <p><strong>3.</strong> Use the debug tools to test onboarding flows</p>
          <p><strong>4.</strong> Reset tour completion status to retest flows</p>
          <p><strong>5.</strong> Disable Debug Mode when done to hide tools from users</p>
        </div>
      </motion.div>
    </div>
  );
};

export default DebugMode;
