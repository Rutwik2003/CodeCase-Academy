import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInteractiveTour } from '../contexts/InteractiveTourContext';
import toast from 'react-hot-toast';
import { logger, LogCategory } from '../utils/logger';

const InteractiveTourTooltip: React.FC = () => {
  const { 
    isActive, 
    currentTourStep, 
    nextStep, 
    prevStep, 
    skipTour, 
    completeTour,
    currentStep,
    tourProgress 
  } = useInteractiveTour();
  
  const navigate = useNavigate();
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [targetElement, setTargetElement] = useState<Element | null>(null);

  // Position tooltip relative to highlighted element
  useEffect(() => {
    if (!isActive || !currentTourStep?.target) return;

    const updatePosition = () => {
      const elements = document.querySelectorAll(currentTourStep.target);
      const element = elements[0];
      
      if (!element) {
        logger.warn(LogCategory.TOUR, `Tour: Target element not found: ${currentTourStep.target}`);
        // Set a fallback position in the center if element not found
        setTooltipPosition({ 
          x: window.innerWidth / 2 - 200, 
          y: window.innerHeight / 2 - 100 
        });
        return;
      }
      
      if (element) {
        setTargetElement(element);
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltipRef.current?.getBoundingClientRect();
        
        let x = 0;
        let y = 0;
        
        // Add custom offset for header buttons to shift tooltip to the right
        const isAuthButton = currentTourStep.target === '#auth-signin-button';
        const isProfileButton = currentTourStep.target === '#detective-profile-button';
        const customOffsetX = (isAuthButton || isProfileButton) ? 60 : 0; // Increase to 60px to properly align with the button
        
        switch (currentTourStep.position) {
          case 'top':
            x = rect.left + rect.width / 2 - (tooltipRect?.width || 0) / 2 + customOffsetX;
            y = rect.top - (tooltipRect?.height || 0) - 20;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2 - (tooltipRect?.width || 0) / 2 + customOffsetX;
            y = rect.bottom + 20;
            break;
          case 'left':
            x = rect.left - (tooltipRect?.width || 0) - 20 + customOffsetX;
            y = rect.top + rect.height / 2 - (tooltipRect?.height || 0) / 2;
            break;
          case 'right':
            x = rect.right + 20 + customOffsetX;
            y = rect.top + rect.height / 2 - (tooltipRect?.height || 0) / 2;
            break;
            y = rect.top + rect.height / 2 - (tooltipRect?.height || 0) / 2;
            break;
          case 'center':
            x = window.innerWidth / 2 - (tooltipRect?.width || 0) / 2;
            y = window.innerHeight / 2 - (tooltipRect?.height || 0) / 2;
            break;
        }
        
        // Keep tooltip within viewport with better bounds checking
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const tooltipWidth = tooltipRect?.width || 300; // Default width if not available
        const tooltipHeight = tooltipRect?.height || 200; // Default height if not available
        
        // Ensure tooltip stays within viewport bounds
        x = Math.max(20, Math.min(x, viewportWidth - tooltipWidth - 20));
        y = Math.max(20, Math.min(y, viewportHeight - tooltipHeight - 20));
        
        // If positioning would put tooltip completely off-screen, reset to safe position
        if (x < 0 || x > viewportWidth || y < 0 || y > viewportHeight) {
          x = viewportWidth / 2 - tooltipWidth / 2;
          y = viewportHeight / 2 - tooltipHeight / 2;
        }
        
        setTooltipPosition({ x, y });
      }
    };

    // Initial positioning with longer delay to ensure DOM is ready
    setTimeout(updatePosition, 200);
    // Also try again after a bit more time in case of timing issues
    setTimeout(updatePosition, 500);
    
    // Update on scroll/resize
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isActive, currentTourStep]);

  // Handle click on highlighted element - DISABLED for manual navigation
  useEffect(() => {
    // Removed automatic click handling - all steps now use manual navigation
  }, [targetElement, currentTourStep, nextStep]);

  if (!isActive || !currentTourStep) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourProgress.totalSteps - 1;
  
  // Check if current step is targeting auth or profile buttons (for arrow positioning)
  const isAuthButton = currentTourStep.target === '#auth-signin-button';
  const isProfileButton = currentTourStep.target === '#detective-profile-button';

  return (
    <>
      {/* Dark overlay */}
      <div className="interactive-tour-overlay" />
      
      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed z-[1001] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm"
          style={{ 
            left: tooltipPosition.x, 
            top: tooltipPosition.y,
            transform: currentTourStep.position === 'center' ? 'translate(-50%, -50%)' : 'none'
          }}
        >
          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${tourProgress.percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Content */}
          <div className="p-4">
            {/* Step counter */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-500 dark:text-blue-400">
                Step {currentStep + 1} of {tourProgress.totalSteps}
              </span>
              <button
                onClick={skipTour}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Skip Tour
              </button>
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {currentTourStep.title}
            </h3>
            
            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {currentTourStep.description}
            </p>
            
            {/* Navigation */}
            {currentTourStep.showChoiceButtons ? (
              // Special choice buttons for the last profile step
              <div className="flex flex-col space-y-3">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      completeTour();
                      // Show a nice toast notification
                      toast.success('🎉 Profile tour completed! Redirecting to home page...', {
                        duration: 3000,
                        position: 'top-center',
                      });
                      // Redirect to home page after a short delay
                      setTimeout(() => {
                        navigate('/');
                      }, 1000);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    🏠 Head to Home Page
                  </button>
                  <button
                    onClick={() => {
                      completeTour();
                      toast.success('✅ Profile tour completed! Enjoy exploring your detective profile.', {
                        duration: 3000,
                        position: 'top-center',
                      });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Stay Here
                  </button>
                </div>
                <button
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200"
                >
                  ← Previous
                </button>
              </div>
            ) : (
              // Regular navigation buttons
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={isFirstStep}
                  className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200"
                >
                  ← Previous
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    {isLastStep ? 'Finish Tour' : 'Next →'}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Pointer arrow */}
          {currentTourStep.position !== 'center' && (
            <div 
              className={`absolute w-3 h-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform rotate-45 ${
                currentTourStep.position === 'top' ? `bottom-[-6px] ${(isAuthButton || isProfileButton) ? 'left-[calc(50%+60px)]' : 'left-1/2'} translate-x-[-50%] border-t-0 border-l-0` :
                currentTourStep.position === 'bottom' ? `top-[-6px] ${(isAuthButton || isProfileButton) ? 'left-[calc(50%+60px)]' : 'left-1/2'} translate-x-[-50%] border-b-0 border-r-0` :
                currentTourStep.position === 'left' ? 'right-[-6px] top-1/2 translate-y-[-50%] border-l-0 border-b-0' :
                'left-[-6px] top-1/2 translate-y-[-50%] border-r-0 border-t-0'
              }`}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default InteractiveTourTooltip;
