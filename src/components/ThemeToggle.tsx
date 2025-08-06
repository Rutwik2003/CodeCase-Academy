import React from 'react';
import { Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        {/* Dark theme indicator */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-lg bg-gray-800 shadow-md transition-all duration-300 flex items-center justify-center"
          aria-label="Dark theme active"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <motion.div
              initial={{ rotate: -20, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="flex items-center justify-center"
            >
              <Moon className="w-5 h-5 text-blue-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
