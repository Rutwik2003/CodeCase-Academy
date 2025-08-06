import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  partial: boolean;
}

interface ProgressBarProps {
  steps: ProgressStep[];
  currentScore: number;
  maxScore: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentScore, maxScore }) => {
  const progressPercentage = (currentScore / maxScore) * 100;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Progress</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {Math.round(progressPercentage)}%
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Complete</p>
            <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
            {currentScore}/{maxScore} points
          </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="lg:col-span-1 flex items-center">
          <div className="w-full">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Detective Progress
            </p>
          </div>
        </div>
        
        {/* Objectives */}
        <div className="lg:col-span-1">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Objectives</h4>
          <div className="space-y-3 max-h-32 overflow-y-auto">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : step.partial ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    step.completed 
                      ? 'text-green-600 dark:text-green-400' 
                      : step.partial
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};