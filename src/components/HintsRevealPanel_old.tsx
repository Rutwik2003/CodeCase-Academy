import React, { useEffect, useState } from 'react';
import { Lightbulb, CheckCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

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
  const [_checkedConditions, setCheckedConditions] = useState<string[]>([]);

  // Check which hint conditions are met
  useEffect(() => {
    const checkConditions = () => {
      const metConditions: string[] = [];

      currentMission.hintsSteps?.forEach(step => {
        const isMet = checkHintCondition(step.condition, htmlCode, cssCode);
        if (isMet && !revealedHints.includes(step.id)) {
          metConditions.push(step.id);
          // Reveal the hint and award points
          onHintRevealed(step.id, step.hint);
          
          // Update user data with hint points
          if (userData) {
            updateUserData({
              hints: userData.hints + step.points,
              totalPoints: userData.totalPoints + step.points
            });
          }
        }
      });

      setCheckedConditions(prev => [...prev, ...metConditions]);
    };

    checkConditions();
  }, [htmlCode, cssCode, currentMission, revealedHints, onHintRevealed, userData, updateUserData]);

  const checkHintCondition = (condition: string, html: string, css: string): boolean => {
    switch (condition) {
      case 'Remove <center> tags':
        return !html.includes('<center>') && !html.includes('</center>');
      case 'Remove <font> tags':
        return !html.includes('<font') && !html.includes('</font>');
      case 'Add semantic header tag':
        return html.includes('<header>');
      case 'Add semantic main tag':
        return html.includes('<main>');
      case 'Add semantic section tag':
        return html.includes('<section>');
      case 'Change display none to block':
        return html.includes('display: block') || css.includes('display: block');
      case 'Change visibility hidden to visible':
        return html.includes('visibility: visible') || css.includes('visibility: visible');
      case 'Add flexbox layout':
        return css.includes('display: flex') || css.includes('flexbox');
      case 'Add CSS grid':
        return css.includes('display: grid') || css.includes('grid-template');
      case 'Remove inline styles':
        return !html.includes('style=');
      default:
        return false;
    }
  };

  const getHintIcon = (hintId: string) => {
    if (revealedHints.includes(hintId)) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Lock className="w-5 h-5 text-gray-400" />;
  };

  const getHintStatus = (hintId: string) => {
    return revealedHints.includes(hintId) ? 'revealed' : 'locked';
  };

  if (!currentMission.hintsSteps || currentMission.hintsSteps.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-40">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Hint Progress
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {revealedHints.length}/{currentMission.hintsSteps.length}
          </span>
        </div>
      </div>

      {/* Hints List */}
      <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
        <AnimatePresence>
          {currentMission.hintsSteps.map((step, index) => {
            const status = getHintStatus(step.id);
            const isRevealed = status === 'revealed';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border transition-all ${
                  isRevealed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getHintIcon(step.id)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Step {index + 1}
                      </span>
                      {isRevealed && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full">
                          +{step.points} hints
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-sm ${
                      isRevealed 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {isRevealed ? step.hint : 'Fix the code to reveal this hint...'}
                    </p>
                    
                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      Task: {step.condition}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg border-t border-gray-200 dark:border-gray-600">
        <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
          💡 Fix issues in your code to reveal detective hints and earn more hints!
        </div>
      </div>
    </div>
  );
};
