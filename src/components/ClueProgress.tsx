import React from 'react';
import { CheckCircle, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DetectiveMissionValidation } from '../utils/detectiveMissionValidator';

interface ClueProgressProps {
  validation: DetectiveMissionValidation;
  missionTitle: string;
  clueRevealed: string;
  isCompleted: boolean;
}

export const ClueProgress: React.FC<ClueProgressProps> = ({ 
  validation, 
  missionTitle, 
  clueRevealed,
  isCompleted 
}) => {
  const getProgressMessage = () => {
    const completed = validation.completedConditions.length;
    const total = validation.completedConditions.length + validation.remainingConditions.length;
    
    if (completed === 0) {
      return "🔍 Let's start investigating! Look for the 'hidden' word in the HTML...";
    } else if (completed === 1) {
      return `🕵️ Great job! ${completed}/${total} tasks done - you're doing awesome!`;
    } else if (completed < total) {
      return `🔥 Almost there! ${completed}/${total} tasks completed`;
    } else {
      return "🎉 Perfect! You found the clue!";
    }
  };

  const getProgressColor = () => {
    const percentage = (validation.completedConditions.length / 
      (validation.completedConditions.length + validation.remainingConditions.length)) * 100;
    
    if (percentage === 0) return 'bg-gray-400';
    if (percentage < 50) return 'bg-yellow-500';
    if (percentage < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4 mb-4 border border-blue-200 dark:border-blue-700">
      {/* Mission Title */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-blue-900 dark:text-blue-100 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          {missionTitle}
        </h4>
        <div className="text-sm font-mono bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">
          {validation.score}/100
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 mb-1">
          <span>{getProgressMessage()}</span>
          <span>{validation.completedConditions.length}/{validation.completedConditions.length + validation.remainingConditions.length}</span>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${(validation.completedConditions.length / 
                (validation.completedConditions.length + validation.remainingConditions.length)) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-2 rounded-full ${getProgressColor()}`}
          />
        </div>
      </div>

      {/* Conditions List */}
      <div className="space-y-2">
        {validation.completedConditions.map((condition, index) => (
          <motion.div
            key={`completed-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-2 text-green-700 dark:text-green-300"
          >
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium">✅ {condition}</span>
          </motion.div>
        ))}
        
        {validation.remainingConditions.map((condition, index) => (
          <motion.div
            key={`remaining-${index}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.7 }}
            className="flex items-start space-x-2 text-gray-600 dark:text-gray-400"
          >
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-sm">⏳ {condition}</span>
          </motion.div>
        ))}
      </div>

      {/* Clue Revelation */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 20px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)']
            }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              boxShadow: { duration: 1.5, repeat: 2 }
            }}
            className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 border-2 border-green-300 dark:border-green-600 rounded-lg relative overflow-hidden"
          >
            {/* Celebration particles effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: [0, (i % 2 ? 50 : -50) * (i + 1)],
                    y: [0, -30 * (i + 1), -60 * (i + 1)]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                />
              ))}
            </div>
            
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.5, times: [0, 0.6, 1] }}
              className="flex items-center text-green-800 dark:text-green-200 mb-2"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-bold">🎉 CLUE UNLOCKED!</span>
            </motion.div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border-l-4 border-green-500">
              <p className="text-green-900 dark:text-green-100 font-semibold italic">
                "{clueRevealed}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
