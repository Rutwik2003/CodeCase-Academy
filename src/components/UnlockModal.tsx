import React, { useState } from 'react';
import { X, Star, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { logger, LogCategory } from '../utils/logger';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseTitle: string;
  caseId: string;
  unlockCost: number;
  difficulty: string;
  duration: string;
  description: string;
  userPoints: number;
  onUnlock: (caseId: string, cost: number) => Promise<boolean>;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  isOpen,
  onClose,
  caseTitle,
  caseId,
  unlockCost,
  difficulty,
  duration,
  description,
  userPoints,
  onUnlock
}) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const canAfford = userPoints >= unlockCost;

  const handleUnlock = async () => {
    if (!canAfford || isUnlocking) return;
    
    setIsUnlocking(true);
    try {
      const success = await onUnlock(caseId, unlockCost);
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsUnlocking(false);
          onClose();
        }, 2000);
      } else {
        setIsUnlocking(false);
      }
    } catch (error) {
      // logger.error('Unlock error:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      setIsUnlocking(false);
    }
  };

  const handleClose = () => {
    if (!isUnlocking) {
      setShowSuccess(false);
      onClose();
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-orange-100 text-orange-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Unlock Case</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Spend points to access</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isUnlocking}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Case Unlocked!
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {caseTitle} is now available to play
              </p>
            </div>
          ) : (
            <>
              {/* Case Info */}
              <div className="mb-6">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {caseTitle}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {description}
                </p>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                    {difficulty}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {duration}
                  </span>
                </div>
              </div>

              {/* Cost Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unlock Cost:
                  </span>
                  <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-bold">
                    <Star className="w-4 h-4" />
                    <span>{unlockCost} points</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Balance:
                  </span>
                  <div className={`flex items-center space-x-1 font-bold ${
                    canAfford ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <Star className="w-4 h-4" />
                    <span>{userPoints} points</span>
                  </div>
                </div>

                {!canAfford && (
                  <div className="flex items-center space-x-2 mt-3 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <p className="text-xs text-red-600">
                      You need {unlockCost - userPoints} more points to unlock this case
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  disabled={isUnlocking}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnlock}
                  disabled={!canAfford || isUnlocking}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    canAfford && !isUnlocking
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isUnlocking ? (
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
      </div>
    </div>
  );
};
