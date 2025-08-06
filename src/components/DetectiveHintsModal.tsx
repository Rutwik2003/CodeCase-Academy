import React from 'react';
import { X, Lightbulb } from 'lucide-react';

interface DetectiveHintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hints: string[];
  currentHintIndex: number;
  onNextHint: () => void;
  caseTitle: string;
}

export const DetectiveHintsModal: React.FC<DetectiveHintsModalProps> = ({
  isOpen,
  onClose,
  hints,
  currentHintIndex,
  onNextHint,
  caseTitle
}) => {
  if (!isOpen) return null;

  const hasHints = hints && hints.length > 0;
  const hasMoreHints = currentHintIndex < hints.length;
  const currentHint = hasHints && currentHintIndex > 0 ? hints[currentHintIndex - 1] : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-amber-500/30 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-300">🕵️ Detective Evidence</h2>
              <p className="text-sm text-slate-400">{caseTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {!hasHints ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400">No detective clues available for this case.</p>
            </div>
          ) : currentHintIndex === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-amber-400" />
              </div>
              <p className="text-amber-300 font-medium mb-2">Ready to investigate?</p>
              <p className="text-slate-400 mb-6">Click "Get First Clue" to start gathering evidence!</p>
              <button
                onClick={onNextHint}
                className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-700 hover:to-amber-600 transition-all transform hover:scale-105"
              >
                🔍 Get First Clue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Hint Display */}
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                    CLUE #{currentHintIndex}
                  </span>
                  <span className="text-amber-300 text-sm font-medium">
                    Evidence {currentHintIndex}/{hints.length}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {currentHint}
                </p>
              </div>

              {/* All Previous Hints */}
              {currentHintIndex > 1 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">📋 Previous Evidence:</h3>
                  {hints.slice(0, currentHintIndex - 1).map((hint, index) => (
                    <div key={index} className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-slate-600 text-slate-300 text-xs font-bold px-2 py-1 rounded">
                          CLUE #{index + 1}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {hint}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <div className="text-center pt-4">
                {hasMoreHints ? (
                  <button
                    onClick={onNextHint}
                    className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-700 hover:to-amber-600 transition-all transform hover:scale-105"
                  >
                    🔍 Get Next Clue ({hints.length - currentHintIndex} remaining)
                  </button>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-300 font-medium">🎯 All Evidence Collected!</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Use your detective skills to solve the case with the evidence you've gathered.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
