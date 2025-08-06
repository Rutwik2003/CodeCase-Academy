import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Eye, 
  Shield, 
  Target,
  Brain,
  Code,
  Key,
  Fingerprint
} from 'lucide-react';
import { initializePreloader, resourcePreloader } from '../utils/resourcePreloader';
import { initializeCache, cacheManager } from '../utils/cacheManager';
import { logger, LogCategory } from '../utils/logger';

interface DetectiveLoaderProps {
  onLoadingComplete: () => void;
}

const DetectiveLoader: React.FC<DetectiveLoaderProps> = ({ onLoadingComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showMainLoader, setShowMainLoader] = useState(true);

  // Remove HTML loader immediately when React component mounts
  useEffect(() => {
    const htmlLoader = document.getElementById('initial-loader');
    if (htmlLoader) {
      htmlLoader.remove();
    }
  }, []);

  const loadingPhases = [
    { 
      text: "Initializing Detective Academy...", 
      icon: Shield, 
      duration: 400, // Reduced from 800ms
      color: "from-blue-500 to-cyan-400",
      action: () => initializeCache()
    },
    { 
      text: "Loading Case Files...", 
      icon: FileText, 
      duration: 900,
      color: "from-orange-500 to-yellow-400",
      action: () => initializePreloader()
    },
    { 
      text: "Scanning Evidence Database...", 
      icon: Search, 
      duration: 1000,
      color: "from-purple-500 to-pink-400",
      action: () => {
        // Background resource loading (silent)
        resourcePreloader.getLoadProgress();
      }
    },
    { 
      text: "Analyzing Code Patterns...", 
      icon: Code, 
      duration: 800,
      color: "from-emerald-500 to-teal-400",
      action: () => {
        // Cache session data
        cacheManager.setSession('session_start', Date.now());
      }
    },
    { 
      text: "Activating Neural Networks...", 
      icon: Brain, 
      duration: 700,
      color: "from-indigo-500 to-blue-400",
      action: () => {
        // Preload critical Monaco Editor resources (silent)
        if ('monaco' in window && process.env.NODE_ENV === 'development') {
          // logger.info('🧠 Monaco Editor ready', LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
        }
      }
    },
    { 
      text: "Securing Perimeter...", 
      icon: Key, 
      duration: 600,
      color: "from-red-500 to-orange-400",
      action: () => {
        // Initialize service worker if available (silent)
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js').catch(() => {
            // Silent - no logging
          });
        }
      }
    },
    { 
      text: "Academy Ready. Welcome Detective!", 
      icon: Target, 
      duration: 1000,
      color: "from-green-500 to-emerald-400",
      action: () => {
        // Silent completion
        if (process.env.NODE_ENV === 'development') {
          // logger.info('🕵️‍♂️ Detective Academy fully loaded and optimized!', LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
        }
      }
    }
  ];

  useEffect(() => {
    const currentPhaseData = loadingPhases[currentPhase];
    
    // Execute the action for current phase
    if (currentPhaseData?.action) {
      try {
        currentPhaseData.action();
      } catch (error) {
        // logger.warn(`Phase ${currentPhase} action failed:`, error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      }
    }

    const timer = setTimeout(() => {
      if (currentPhase < loadingPhases.length - 1) {
        setCurrentPhase(prev => prev + 1);
      } else {
        // Final phase completed
        setTimeout(() => {
          setShowMainLoader(false);
          setTimeout(onLoadingComplete, 500);
        }, 1000);
      }
    }, loadingPhases[currentPhase]?.duration || 1000);

    return () => clearTimeout(timer);
  }, [currentPhase, onLoadingComplete]);

  const currentPhaseData = loadingPhases[currentPhase];
  const IconComponent = currentPhaseData?.icon || Shield;

  return (
    <AnimatePresence>
      {showMainLoader && (
        <motion.div
          initial={{ opacity: 1 }} // Start visible immediately
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(30, 41, 59, 0.8) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(15, 23, 42, 0.9) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(51, 65, 85, 0.7) 0%, transparent 50%),
              linear-gradient(135deg, 
                rgba(15, 23, 42, 0.95) 0%, 
                rgba(30, 41, 59, 0.9) 25%,
                rgba(51, 65, 85, 0.85) 50%,
                rgba(30, 41, 59, 0.9) 75%,
                rgba(15, 23, 42, 0.95) 100%
              )
            `
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Scanning Lines */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
              animate={{ 
                y: [0, window.innerHeight],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Floating Evidence Icons */}
            {[Search, Eye, Fingerprint, Key, Code].map((Icon, index) => (
              <motion.div
                key={index}
                className="absolute text-slate-400/20"
                style={{
                  left: `${20 + index * 20}%`,
                  top: `${30 + (index % 2) * 40}%`
                }}
                animate={{
                  y: [-20, 20, -20],
                  rotate: [0, 360],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                <Icon size={40 + index * 10} />
              </motion.div>
            ))}

            {/* DNA Helix Pattern */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                  style={{
                    left: `${10 + (i * 4)}%`,
                    top: `${50 + Math.sin(i * 0.5) * 30}%`
                  }}
                  animate={{
                    scale: [0.5, 1.5, 0.5],
                    opacity: [0.2, 0.8, 0.2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main Loader Content */}
          <div className="relative z-10 text-center">
            {/* Logo/Badge Area */}
            <motion.div
              initial={{ scale: 1, rotate: 0 }} // Start immediately visible
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 10,
                duration: 0.5 // Faster animation
              }}
              className="mb-8"
            >
              <div className="relative w-32 h-32 mx-auto">
                {/* Outer Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-slate-600/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Middle Ring */}
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-blue-400/50"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Inner Badge */}
                <motion.div
                  className={`absolute inset-4 rounded-full bg-gradient-to-br ${currentPhaseData?.color || 'from-blue-500 to-cyan-400'} flex items-center justify-center shadow-2xl`}
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(59, 130, 246, 0.5)",
                      "0 0 40px rgba(59, 130, 246, 0.8)",
                      "0 0 20px rgba(59, 130, 246, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    key={currentPhase}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15 
                    }}
                  >
                    <IconComponent className="w-12 h-12 text-white" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 1, y: 0 }} // Start visible
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.3 }} // Faster, no delay
              className="text-4xl font-bold text-white mb-2"
            >
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                CodeCase
              </span>
              <br />
              <span className="text-2xl text-slate-300">Detective Academy</span>
            </motion.h1>

            {/* Current Phase Text */}
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-lg text-slate-300 mb-2">
                {currentPhaseData?.text}
              </p>
              
              {/* Mini progress dots */}
              <div className="flex justify-center space-x-2">
                {loadingPhases.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= currentPhase 
                        ? 'bg-blue-400' 
                        : 'bg-slate-600'
                    }`}
                    animate={{
                      scale: index === currentPhase ? [1, 1.5, 1] : 1,
                      opacity: index <= currentPhase ? 1 : 0.3
                    }}
                    transition={{ 
                      duration: 0.5,
                      repeat: index === currentPhase ? Infinity : 0,
                      repeatType: "loop"
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 1, y: 0 }} // Start visible
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.3 }} // Faster, no delay
              className="w-80 mx-auto"
            >
              <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-600/30">
                <motion.div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${currentPhaseData?.color || 'from-blue-500 to-cyan-400'} rounded-full`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentPhase + 1) * (100 / loadingPhases.length)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                
                {/* Glow effect */}
                <motion.div
                  className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent to-white/30 rounded-full"
                  animate={{ x: ["-2rem", "20rem"] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: 1
                  }}
                />
              </div>
              
              <div className="flex justify-between mt-2 text-sm text-slate-400">
                <span>Investigating...</span>
                <span>{Math.round((currentPhase + 1) * (100 / loadingPhases.length))}%</span>
              </div>
            </motion.div>

            {/* Bottom Quote */}
            <motion.p
              initial={{ opacity: 1 }} // Start visible
              animate={{ opacity: 1 }}
              transition={{ delay: 0, duration: 0.5 }} // Faster, no delay
              className="mt-8 text-slate-400 text-sm italic max-w-md mx-auto"
            >
              "Every great detective was once a beginner who never gave up on solving the mystery..."
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetectiveLoader;
