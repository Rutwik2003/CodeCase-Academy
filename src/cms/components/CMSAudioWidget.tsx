import React, { useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudio } from '../../contexts/AudioContext';

export const CMSAudioWidget: React.FC = () => {
  const { isPlaying, isMuted, toggleMute, switchTrack, currentTrack, volume, isUserInteracted, initializeAudio } = useAudio();

  // Ensure CMS has background audio
  useEffect(() => {
    // Switch to homepage audio for CMS if not already playing
    if (currentTrack !== 'homepage') {
      switchTrack('homepage');
    }
  }, [currentTrack, switchTrack]);

  // Auto-initialize audio for CMS
  useEffect(() => {
    if (!isPlaying && isUserInteracted && !isMuted) {
      initializeAudio();
    }
  }, [isPlaying, isUserInteracted, isMuted, initializeAudio]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/90 backdrop-blur-lg border border-slate-600 rounded-lg p-3 shadow-lg"
      >
        <div className="flex items-center space-x-3">
          {/* Waveform indicator */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: 3 }, (_, i) => (
              <motion.div
                key={i}
                className={`w-1 rounded-full ${
                  isPlaying && !isMuted
                    ? 'bg-amber-400'
                    : 'bg-slate-500'
                }`}
                animate={{
                  height: isPlaying && !isMuted
                    ? [6, 12, 8, 14, 10]
                    : [6, 6, 6, 6, 6],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Volume control */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-lg transition-colors ${
              isMuted 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            }`}
            title={`${isMuted ? 'Unmute' : 'Mute'} background audio`}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          {/* Volume indicator */}
          <div className="text-xs text-slate-400 font-mono">
            {Math.round(volume * 100)}%
          </div>
        </div>

        {/* Audio status */}
        <div className="text-xs text-slate-500 text-center mt-1">
          CMS Audio
        </div>
      </motion.div>
    </div>
  );
};
