import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const MobileWarning: React.FC = () => {
  const deviceInfo = useDeviceDetection();
  const [showWarning, setShowWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the warning in this session
    const hasBeenDismissed = sessionStorage.getItem('mobile-warning-dismissed');
    
    if (deviceInfo.isMobile && !hasBeenDismissed && !dismissed) {
      // Small delay to let the page load first
      setTimeout(() => {
        setShowWarning(true);
      }, 1500);
    }
  }, [deviceInfo.isMobile, dismissed]);

  const handleDismiss = () => {
    setShowWarning(false);
    setDismissed(true);
    sessionStorage.setItem('mobile-warning-dismissed', 'true');
  };

  const handleContinueAnyway = () => {
    handleDismiss();
  };

  if (!deviceInfo.isMobile || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xl"></div>
          
          {/* Warning Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-slate-800/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">
                    🔍 Detective HQ Notice
                  </h3>
                  <p className="text-amber-400 text-sm">Mobile Device Detected</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 mb-6">
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-slate-100">CodeBuster Detective Academy</strong> is optimized for desktop and laptop experiences with interactive code editing and complex case interfaces.
              </p>
              
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <h4 className="text-slate-100 font-medium mb-2 flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-green-400" />
                  <span>Recommended Devices:</span>
                </h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• Desktop computers (1024px+ screen)</li>
                  <li>• Laptops with full keyboards</li>
                  <li>• Tablets in landscape mode (limited)</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                <h4 className="text-amber-300 font-medium mb-2 flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile Limitations:</span>
                </h4>
                <ul className="text-amber-200 text-sm space-y-1">
                  <li>• Code editor may be difficult to use</li>
                  <li>• Interactive tutorials are limited</li>
                  <li>• Some features may not work properly</li>
                  <li>• Navigation is optimized for desktop</li>
                </ul>
              </div>
            </div>

            {/* Detective separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-6"></div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleContinueAnyway}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-600/80 to-amber-500/80 hover:from-amber-500/90 hover:to-amber-400/90 
                         text-slate-900 font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm
                         border border-amber-400/30 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Continue Investigation Anyway
              </button>
              
              <p className="text-slate-400 text-xs text-center">
                Best experienced on desktop for full detective capabilities
              </p>
            </div>

            {/* Detective badge watermark */}
            <div className="absolute top-4 right-4 opacity-10">
              <Monitor className="w-8 h-8 text-amber-400" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileWarning;
