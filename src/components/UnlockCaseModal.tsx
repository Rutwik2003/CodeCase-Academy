import React, { useState, useEffect } from 'react';
import { X, Star, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUnlockSystem } from '../contexts/UnlockSystemContext';
import { useAuth } from '../contexts/AuthContext';
import { logger, LogCategory } from '../utils/logger';

interface UnlockCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseTitle: string;
  caseId: string;
  unlockCost: number;
  difficulty: string;
  duration: string;
  description: string;
}

export const UnlockCaseModal: React.FC<UnlockCaseModalProps> = ({
  isOpen,
  onClose,
  caseTitle,
  caseId,
  unlockCost,
  difficulty,
  duration,
  description
}) => {
  const { unlockCase, canAfford, isLoading } = useUnlockSystem();
  const { userData } = useAuth();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  const currentPoints = userData?.totalPoints || 0;
  const canAffordCase = canAfford(unlockCost);

  // Debug logging
  useEffect(() => {
    if (isOpen) {
      // logger.info('Unlock modal opened for:', { // COMMENTED FOR PRODUCTION
      //   caseTitle,
      //   caseId,
      //   unlockCost,
      //   currentPoints,
      //   canAffordCase,
      //   difficulty,
      //   duration,
      //   description
      // }, LogCategory.COMPONENT);
    }
  }, [isOpen, caseTitle, caseId, unlockCost, currentPoints, canAffordCase, difficulty, duration, description]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsUnlocking(false);
      setUnlockSuccess(false);
    } else {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    // Cleanup function to restore body scroll
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isUnlocking) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isUnlocking, onClose]);

  const handleUnlock = async () => {
    if (!canAffordCase || isUnlocking) return;

    setIsUnlocking(true);
    try {
      const success = await unlockCase(caseId, unlockCost);
      
      if (success) {
        setUnlockSuccess(true);
        // Wait for success animation, then close and refresh
        setTimeout(() => {
          onClose();
          // Force a small delay to ensure UI updates
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }, 1500);
      } else {
        setIsUnlocking(false);
        // You could add an error state here if needed
        // logger.error('Failed to unlock case', LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      }
    } catch (error) {
      // logger.error('Error unlocking case:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      setIsUnlocking(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isUnlocking) {
      onClose();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-700 dark:text-green-400';
      case 'Intermediate': return 'text-orange-700 dark:text-orange-400';
      case 'Advanced': return 'text-red-700 dark:text-red-400';
      default: return 'text-gray-700 dark:text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 dark:bg-green-900/30';
      case 'Intermediate': return 'bg-orange-100 dark:bg-orange-900/30';
      case 'Advanced': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Unlock Case</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use points to access</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isUnlocking}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                  !isUnlocking ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'cursor-not-allowed'
                }`}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {unlockSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Case Unlocked!
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {caseTitle} is now available to play
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Case Info */}
                  <div className="mb-6">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {caseTitle}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                      {description || 'An exciting coding challenge awaits you!'}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)} ${getDifficultyBg(difficulty)}`}
                      >
                        {difficulty || 'Beginner'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {duration || '15 min'}
                      </span>
                    </div>
                  </div>

                  {/* Cost and Balance */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Unlock Cost:
                      </span>
                      <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-bold">
                        <Star className="w-4 h-4" />
                        <span>{unlockCost.toLocaleString()} points</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Your Balance:
                      </span>
                      <div className={`flex items-center space-x-1 font-bold ${
                        canAffordCase 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        <Star className="w-4 h-4" />
                        <span>{currentPoints.toLocaleString()} points</span>
                      </div>
                    </div>

                    {!canAffordCase && (
                      <div className="flex items-center space-x-2 mt-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <p className="text-xs text-red-600 dark:text-red-400">
                          You need {(unlockCost - currentPoints).toLocaleString()} more points to unlock this case
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={onClose}
                      disabled={isUnlocking}
                      className={`flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors font-medium disabled:opacity-50 ${
                        !isUnlocking ? 'hover:bg-gray-200 dark:hover:bg-gray-600' : 'cursor-not-allowed'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUnlock}
                      disabled={!canAffordCase || isUnlocking || isLoading}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        canAffordCase && !isUnlocking && !isLoading
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isUnlocking || isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Unlocking...</span>
                        </div>
                      ) : (
                        'Unlock Case'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
