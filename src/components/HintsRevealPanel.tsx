import React, { useEffect, useState } from 'react';
import { Lightbulb, CheckCircle, Lock, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { showAlert } from './CustomAlert';

interface Mission {
  id: string;
  brokenHtml: string;
  brokenCss: string;
  successConditions: string[];
  clueRevealed: string;
  hintsSteps?: HintStep[];
}

interface HintStep {
  id: string;
  condition: string;
  hint: string;
  points: number;
}

interface HintsRevealPanelProps {
  currentMission: Mission;
  htmlCode: string;
  cssCode: string;
  revealedHints: string[];
  onHintRevealed: (hintId: string, hint: string) => void;
}

export const HintsRevealPanel: React.FC<HintsRevealPanelProps> = ({
  currentMission,
  htmlCode,
  cssCode,
  revealedHints,
  onHintRevealed
}) => {
  const { userData, updateUserData } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingHintId, setPendingHintId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Check which hint conditions are met automatically
  useEffect(() => {
    const checkConditions = () => {
      currentMission.hintsSteps?.forEach(step => {
        const isMet = checkHintCondition(step.condition, htmlCode, cssCode);
        if (isMet && !revealedHints.includes(step.id)) {
          // Automatically reveal hints when conditions are met (no cost)
          onHintRevealed(step.id, step.hint);
          
          // Award points for completing the task
          if (userData) {
            updateUserData({
              hints: userData.hints + step.points,
              totalPoints: userData.totalPoints + step.points
            });
          }
        }
      });
    };

    checkConditions();
  }, [htmlCode, cssCode, currentMission, revealedHints, onHintRevealed, userData, updateUserData]);

  const checkHintCondition = (condition: string, html: string, css: string): boolean => {
    const htmlLower = html.toLowerCase();
    const cssLower = css.toLowerCase();
    
    switch (condition) {
      // Mission 1 conditions
      case 'Remove <center> tags':
        return !htmlLower.includes('<center>') && !htmlLower.includes('</center>');
      case 'Remove <font> tags':
        return !htmlLower.includes('<font') && !htmlLower.includes('</font>');
      case 'Remove <center> and <font> tags':
        return !htmlLower.includes('<center>') && !htmlLower.includes('</center>') && 
               !htmlLower.includes('<font') && !htmlLower.includes('</font>');
      case 'Remove hidden attribute':
        return !htmlLower.includes('hidden>') && !htmlLower.includes('hidden ');
      case 'Add semantic header tag':
        return htmlLower.includes('<header>');
      case 'Add semantic main tag':
        return htmlLower.includes('<main>');
      case 'Add semantic section tag':
        return htmlLower.includes('<section>');
      case 'Add semantic HTML5 elements':
        return htmlLower.includes('<header>') || htmlLower.includes('<main>') || htmlLower.includes('<section>');
      
      // Mission 2 conditions
      case 'Locate the hidden Instagram evidence':
        return htmlLower.includes('id="insta-clue"') || htmlLower.includes('instagram-evidence');
      case 'Change display: none to display: block':
        return cssLower.includes('display: block') || cssLower.includes('display:block');
      case 'Add styling to the revealed evidence':
        return cssLower.includes('.instagram-evidence') || cssLower.includes('#insta-clue');
      
      // Mission 3 conditions  
      case 'Locate the hidden address information':
        return htmlLower.includes('id="address-clue"') || htmlLower.includes('warehouse 17');
      case 'Change visibility: hidden to visibility: visible':
        return cssLower.includes('visibility: visible') || cssLower.includes('visibility:visible');
      case 'Replace deprecated <font> tags':
        return !htmlLower.includes('<font') && !htmlLower.includes('</font>');
      
      // Legacy conditions for backward compatibility
      case 'Change display none to block':
        return cssLower.includes('display: block') || cssLower.includes('display:block');
      case 'Change visibility hidden to visible':
        return cssLower.includes('visibility: visible') || cssLower.includes('visibility:visible');
      case 'Add flexbox layout':
        return cssLower.includes('display: flex') || cssLower.includes('flexbox');
      case 'Add CSS grid':
        return cssLower.includes('display: grid') || cssLower.includes('grid-template');
      case 'Remove inline styles':
        return !htmlLower.includes('style=');
      default:
        return false;
    }
  };

  const handleHintRequest = (hintId: string) => {
    setPendingHintId(hintId);
    setShowConfirmation(true);
  };

  const confirmHintPurchase = () => {
    if (!pendingHintId || !userData) return;

    const hintCost = 3; // Cost 3 hint points to get a hint
    if (userData.hints < hintCost) {
      showAlert("Not enough hint points! Solve more code to earn hints.", {
        title: "💡 Insufficient Hint Points",
        type: "warning"
      });
      setShowConfirmation(false);
      setPendingHintId(null);
      return;
    }

    const hintStep = currentMission.hintsSteps?.find(step => step.id === pendingHintId);
    if (hintStep) {
      // Deduct hint points
      updateUserData({
        hints: userData.hints - hintCost,
        totalPoints: userData.totalPoints // Don't change total points for buying hints
      });

      // Reveal the hint
      onHintRevealed(pendingHintId, hintStep.hint);
    }

    setShowConfirmation(false);
    setPendingHintId(null);
  };

  const cancelHintPurchase = () => {
    setShowConfirmation(false);
    setPendingHintId(null);
  };

  const getHintIcon = (hintId: string, isCompleted: boolean) => {
    if (revealedHints.includes(hintId)) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Lock className="w-5 h-5 text-gray-400" />;
  };

  const getHintStatus = (hintId: string, isCompleted: boolean) => {
    if (revealedHints.includes(hintId)) return 'revealed';
    if (isCompleted) return 'completed';
    return 'locked';
  };

  const getNextLockedHint = () => {
    return currentMission.hintsSteps?.find(step => {
      const isCompleted = checkHintCondition(step.condition, htmlCode, cssCode);
      return !isCompleted && !revealedHints.includes(step.id);
    });
  };

  const nextLockedHint = getNextLockedHint();

  if (!currentMission.hintsSteps || currentMission.hintsSteps.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Hint Button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg z-50 flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Lightbulb className="w-6 h-6" />
        {userData && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {userData.hints}
          </span>
        )}
      </motion.button>

      {/* Hints Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-20 right-6 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-40"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Detective Hints
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {revealedHints.length}/{currentMission.hintsSteps.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Available Hints: {userData?.hints || 0} | Cost: 3 hints each
              </div>
            </div>

            {/* Hints List */}
            <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
              {currentMission.hintsSteps.map((step, index) => {
                const isCompleted = checkHintCondition(step.condition, htmlCode, cssCode);
                const status = getHintStatus(step.id, isCompleted);
                const isRevealed = status === 'revealed' || status === 'completed';

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isRevealed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getHintIcon(step.id, isCompleted)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Clue {index + 1}
                          </span>
                          {isCompleted && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                              +{step.points} hints
                            </span>
                          )}
                        </div>
                        
                        <p className={`text-sm mb-2 ${
                          isRevealed 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {isRevealed ? step.hint : 'Complete the task or use hint points to reveal...'}
                        </p>
                        
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          Task: {step.condition}
                        </div>

                        {/* Buy Hint Button */}
                        {!isRevealed && !isCompleted && (
                          <button
                            onClick={() => handleHintRequest(step.id)}
                            disabled={!userData || userData.hints < 3}
                            className="mt-2 px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-colors"
                          >
                            Use 3 Hints
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer with next hint suggestion */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg border-t border-gray-200 dark:border-gray-600">
              {nextLockedHint ? (
                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  💡 Next task: {nextLockedHint.condition}
                </div>
              ) : (
                <div className="text-xs text-green-600 dark:text-green-400 text-center">
                  🎉 All tasks completed! Great detective work!
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Use Hint Points?
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This will cost you <strong>3 hint points</strong> to reveal this clue. 
                You currently have <strong>{userData?.hints || 0} hints</strong>.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={confirmHintPurchase}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded transition-colors"
                >
                  Use Hints
                </button>
                <button
                  onClick={cancelHintPurchase}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
