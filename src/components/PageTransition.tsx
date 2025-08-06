import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1]
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Slide transition for major page changes
export const SlideTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0.0, 0.2, 1]
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Scale transition for cards and components
export const ScaleTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0.0, 0.2, 1]
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Staggered children animation
export const StaggerContainer: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
