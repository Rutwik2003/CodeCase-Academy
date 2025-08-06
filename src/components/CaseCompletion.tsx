import React from 'react';
import { CheckCircle, Star, ArrowRight, RotateCcw, Home } from 'lucide-react';

interface CaseCompletionProps {
  isVisible: boolean;
  score: number;
  maxScore: number;
  feedback: string[];
  onNextCase: () => void;
  onRetry: () => void;
  onHome: () => void;
  hasNextCase: boolean;
}

export const CaseCompletion: React.FC<CaseCompletionProps> = ({
  isVisible,
  score,
  maxScore,
  feedback,
  onNextCase,
  onRetry,
  onHome,
  hasNextCase
}) => {
  if (!isVisible) return null;

  const percentage = Math.round((score / maxScore) * 100);
  const isPerfect = score === maxScore;
  const isGood = percentage >= 80;
  const isPass = percentage >= 60;

  const getGrade = () => {
    if (isPerfect) return { grade: 'A+', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' };
    if (isGood) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' };
    if (isPass) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900' };
    return { grade: 'C', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900' };
  };

  const gradeInfo = getGrade();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="theme-card rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className={`w-20 h-20 ${gradeInfo.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {isPerfect ? (
              <Star className="w-10 h-10 text-yellow-500" />
            ) : (
              <CheckCircle className="w-10 h-10 text-green-500" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold theme-text-primary mb-2">
            {isPerfect ? 'Perfect Detective Work!' : isGood ? 'Great Job!' : isPass ? 'Case Solved!' : 'Keep Investigating!'}
          </h2>
          
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className={`px-4 py-2 ${gradeInfo.bg} rounded-lg`}>
              <span className={`text-2xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</span>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold theme-text-primary">{percentage}%</div>
              <div className="text-sm theme-text-muted">{score}/{maxScore} points</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold theme-text-primary mb-3">Detective's Report:</h3>
          <div className="space-y-2">
            {feedback.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm theme-text-muted">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {hasNextCase && isPass && (
            <button
              onClick={onNextCase}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Next Case</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          
          {!isPass && (
            <button
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
          
          <button
            onClick={onHome}
            className="w-full theme-btn-secondary theme-text-secondary py-3 rounded-lg font-semibold hover:theme-btn-secondary-hover transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Cases</span>
          </button>
        </div>
      </div>
    </div>
  );
};