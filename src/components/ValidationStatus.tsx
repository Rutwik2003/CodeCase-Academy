import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { DetectiveMissionValidation } from '../utils/detectiveMissionValidator';

interface ValidationStatusProps {
  validation: DetectiveMissionValidation;
  isVisible: boolean;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({ validation, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          Validation Status
        </h4>
        <div className="text-sm font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
          {validation.score}/{validation.maxScore}
        </div>
      </div>

      <div className="space-y-2">
        {validation.feedback.map((feedback, index) => {
          const isCompleted = feedback.startsWith('✅');
          const Icon = isCompleted ? CheckCircle : XCircle;
          const colorClass = isCompleted 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400';

          return (
            <div key={index} className={`flex items-start space-x-2 ${colorClass}`}>
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feedback.substring(2)}</span>
            </div>
          );
        })}
      </div>

      {validation.isCompleted && (
        <div className="mt-3 p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-600 rounded-lg">
          <div className="flex items-center text-green-800 dark:text-green-200">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="font-semibold">Mission Complete! Clue unlocked!</span>
          </div>
        </div>
      )}
    </div>
  );
};
