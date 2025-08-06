import React from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '../contexts/AudioContext';

interface AudioWaveformProps {
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ className = '' }) => {
  const { isPlaying, isMuted, toggleMute } = useAudio();

  // Animated bars for the waveform
  const bars = Array.from({ length: 5 }, (_, i) => i);
  return (
    <motion.div 
      className={`flex items-center space-x-2 cursor-pointer ${className}`}
      onClick={toggleMute}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={`${isMuted ? 'Unmute' : 'Mute'} audio - Click anywhere to toggle`}
    >
      {/* Waveform Visualization */}
      <div className="flex items-center space-x-1 pointer-events-none">
        {bars.map((_, index) => (
          <motion.div
            key={index}
            className={`w-1 bg-gradient-to-t rounded-full transition-colors duration-300 ${
              isPlaying && !isMuted
                ? 'from-amber-400 to-amber-300 shadow-sm shadow-amber-400/30'
                : 'from-slate-600 to-slate-500'
            }`}
            animate={{
              height: isPlaying && !isMuted
                ? [8, 16, 12, 20, 14, 10, 18, 8]
                : [8, 8, 8, 8, 8, 8, 8, 8],
            }}
            transition={{
              duration: 0.8,
              repeat: isPlaying && !isMuted ? Infinity : 0,
              delay: index * 0.1,
              ease: "easeInOut",
            }}
            style={{
              height: 8,
            }}
          />
        ))}
      </div>


    </motion.div>
  );
};
