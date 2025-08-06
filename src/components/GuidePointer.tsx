import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

interface GuidePointerProps {
  isVisible: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  message: string;
  className?: string;
  showPlayIcon?: boolean;
  onClick?: () => void;
}

export const GuidePointer: React.FC<GuidePointerProps> = ({ 
  isVisible, 
  position, 
  message, 
  className = '',
  showPlayIcon = false,
  onClick 
}) => {
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default:
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
    }
  };

  const getArrowStyles = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-600';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-blue-600';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-blue-600';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-blue-600';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-blue-600';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={`absolute z-50 ${getPositionStyles()} ${className}`}
        >
          {/* Arrow */}
          <div className={`absolute w-0 h-0 ${getArrowStyles()}`} />
          
          {/* Tooltip Content */}
          <motion.div
            initial={{ y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
            animate={{ y: 0 }}
            className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg shadow-2xl max-w-xs ${
              onClick ? 'cursor-pointer hover:from-blue-700 hover:to-purple-700' : ''
            } border border-blue-400/20`}
            onClick={onClick}
          >
            <div className="flex items-center space-x-2">
              {showPlayIcon && (
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Play className="w-3 h-3 text-white" />
                </div>
              )}
              <p className="text-sm font-medium leading-relaxed">{message}</p>
              {onClick && (
                <ArrowRight className="w-4 h-4 text-white/80 flex-shrink-0 ml-1" />
              )}
            </div>
            
            {/* Pulse animation for emphasis */}
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-lg"
              animate={{ 
                opacity: [0, 0.3, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface GuideHighlightProps {
  isVisible: boolean;
  children: React.ReactNode;
  message?: string;
  pointerPosition?: 'top' | 'bottom' | 'left' | 'right';
  showPlayIcon?: boolean;
  onPointerClick?: () => void;
  pulseColor?: string;
}

export const GuideHighlight: React.FC<GuideHighlightProps> = ({ 
  isVisible, 
  children, 
  message,
  pointerPosition = 'bottom',
  showPlayIcon = false,
  onPointerClick,
  pulseColor = 'blue'
}) => {
  return (
    <div className="relative">
      {children}
      
      {/* Highlight Ring */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Animated ring */}
            <motion.div
              className={`absolute inset-0 rounded-lg border-2 border-${pulseColor}-400`}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Glow effect */}
            <motion.div
              className={`absolute inset-0 rounded-lg bg-${pulseColor}-400/20`}
              animate={{ 
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Pointer with message */}
      {message && (
        <GuidePointer
          isVisible={isVisible}
          position={pointerPosition}
          message={message}
          showPlayIcon={showPlayIcon}
          onClick={onPointerClick}
        />
      )}
    </div>
  );
};
