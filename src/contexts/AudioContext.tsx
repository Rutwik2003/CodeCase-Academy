import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export type AudioTrack = 'homepage' | 'training' | 'case' | 'profile';

interface AudioSettings {
  homepage: number;
  training: number;
  case: number;
  profile: number;
  globalMute?: boolean;
}

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement> | null;
  isPlaying: boolean;
  isMuted: boolean;
  isUserInteracted: boolean;
  currentTrack: AudioTrack;
  volume: number;
  setIsPlaying: (playing: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setIsUserInteracted: (interacted: boolean) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  switchTrack: (track: AudioTrack) => void;
  initializeAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

const getLocalAudioSettings = () => {
  try {
    const saved = localStorage.getItem('codecase_audio_settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load local audio settings:', error);
  }
  return null;
};

const getDefaultSettings = (): AudioSettings => ({
  homepage: 0.05,
  training: 0.15,
  case: 0.15,
  profile: 0.05,
  globalMute: false
});

const AUDIO_TRACKS = {
  homepage: { src: '/assets/codecase_homepage_audio.mp3', volume: 0.05 },
  training: { src: '/assets/codecase_trainingpage_audio.mp3', volume: 0.15 }, // 15% for training page
  case: { src: '/assets/detective-case_audio.mp3', volume: 0.15 },
  profile: { src: '/assets/codecase_homepage_audio.mp3', volume: 0.05 }, // Same as homepage
} as const;

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>('homepage');
  const [volume, setVolume] = useState(0.05); // Default to 5%
  const [globalSettings, setGlobalSettings] = useState<AudioSettings>(getDefaultSettings());
  const location = useLocation();

  // Check if current route is CMS/Admin - disable audio completely
  const isCMSRoute = location.pathname.startsWith('/cms') || location.pathname.startsWith('/admin');

  // Listen for global settings from Firebase (only if not in CMS)
  useEffect(() => {
    if (isCMSRoute) return; // Skip Firebase listener for CMS routes

    const unsubscribe = onSnapshot(
      doc(db, 'globalSettings', 'audioConfig'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const settings: AudioSettings = {
            homepage: (data.homepage || 5) / 100, // Convert percentage to decimal
            training: (data.training || 15) / 100,
            case: (data.case || 15) / 100,
            profile: (data.profile || 5) / 100,
            globalMute: data.globalMute || false
          };
          setGlobalSettings(settings);
          
          // Apply global mute immediately
          if (settings.globalMute && audioRef.current) {
            audioRef.current.muted = true;
            setIsMuted(true);
          }
          
          // Update current track volume if audio is loaded
          if (audioRef.current && settings[currentTrack] !== undefined) {
            const newVolume = settings[currentTrack];
            audioRef.current.volume = newVolume;
            setVolume(newVolume);
          }
          
          // Dispatch global settings change event
          window.dispatchEvent(new CustomEvent('globalAudioSettingsChanged', {
            detail: settings
          }));
        }
      },
      (error) => {
        console.error('Error listening to global audio settings:', error);
        // Fallback to local settings if Firebase fails
        const localSettings = getLocalAudioSettings();
        if (localSettings) {
          setGlobalSettings(localSettings);
        }
      }
    );

    return () => unsubscribe();
  }, [currentTrack, isCMSRoute]);

  // Determine which audio track to play based on current path
  const getTrackFromPath = (pathname: string): AudioTrack => {
    if (pathname.includes('/training') || pathname.includes('/learn')) {
      return 'training';
    } else if (pathname.includes('/case') || pathname.includes('/tutorialcase') || pathname.includes('/vanishingblogger')) {
      return 'case';
    } else if (pathname.includes('/profile')) {
      return 'profile';
    } else {
      return 'homepage';
    }
  };

  // Switch audio track based on route (disabled for CMS)
  useEffect(() => {
    if (isCMSRoute) {
      // Stop any playing audio when entering CMS
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    const newTrack = getTrackFromPath(location.pathname);
    if (newTrack !== currentTrack) {
      switchTrack(newTrack);
    }
  }, [location.pathname, currentTrack, isCMSRoute]);

  useEffect(() => {
    if (isCMSRoute || !audioRef.current) return; // Skip audio setup for CMS routes

    audioRef.current.loop = true;
    // Use global settings first, then fall back to local settings or defaults
    const localSettings = getLocalAudioSettings();
    const volumeToUse = globalSettings[currentTrack] || localSettings[currentTrack] || AUDIO_TRACKS[currentTrack].volume;
    audioRef.current.volume = volumeToUse;
    setVolume(volumeToUse);
  }, [currentTrack, globalSettings, isCMSRoute]);

  // Listen for audio settings changes from CMS
  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent) => {
      const newSettings = event.detail;
      if (audioRef.current && newSettings[currentTrack] !== undefined) {
        const newVolume = newSettings[currentTrack];
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
      }
    };

    window.addEventListener('audioSettingsChanged', handleSettingsChange as EventListener);
    return () => {
      window.removeEventListener('audioSettingsChanged', handleSettingsChange as EventListener);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (isCMSRoute) return; // Skip user interaction detection for CMS routes

    const handleUserInteraction = () => {
      if (!isUserInteracted) {
        setIsUserInteracted(true);
        // Auto-play when user first interacts with the page
        if (audioRef.current && !isMuted) {
          audioRef.current.play().catch(console.error);
          setIsPlaying(true);
        }
      }
    };

    // Listen for various user interaction events
    const events = ['click', 'keydown', 'touchstart', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [isUserInteracted, isMuted, isCMSRoute]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        // Unmute
        audioRef.current.muted = false;
        setIsMuted(false);
        if (isUserInteracted) {
          audioRef.current.play().catch(console.error);
          setIsPlaying(true);
        }
      } else {
        // Mute
        audioRef.current.muted = true;
        audioRef.current.pause();
        setIsMuted(true);
        setIsPlaying(false);
      }
    }
  };

  const switchTrack = (track: AudioTrack) => {
    if (audioRef.current && track !== currentTrack) {
      // Use global settings first, then local settings or defaults
      const localSettings = getLocalAudioSettings();
      const trackConfig = AUDIO_TRACKS[track];
      const volumeToUse = globalSettings[track] || localSettings[track] || trackConfig.volume;
      const wasPlaying = isPlaying && !isMuted && !globalSettings.globalMute;
      
      // Pause current audio
      audioRef.current.pause();
      
      // Switch source and update volume
      audioRef.current.src = trackConfig.src;
      audioRef.current.volume = volumeToUse;
      setVolume(volumeToUse);
      
      setCurrentTrack(track);
      
      // Resume playing if it was playing before and user has interacted
      if (wasPlaying && isUserInteracted) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  // Custom setVolume function that also updates the audio element
  const updateVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const initializeAudio = () => {
    if (audioRef.current && isUserInteracted && !isMuted) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const value: AudioContextType = {
    audioRef,
    isPlaying,
    isMuted: isMuted || (globalSettings.globalMute || false),
    isUserInteracted,
    currentTrack,
    volume,
    setIsPlaying,
    setIsMuted,
    setIsUserInteracted,
    setVolume: updateVolume,
    toggleMute,
    switchTrack,
    initializeAudio,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
      {/* Global audio element - disabled for CMS routes */}
      {!isCMSRoute && (
        <audio
          ref={audioRef}
          src={AUDIO_TRACKS[currentTrack].src}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="auto"
          style={{ display: 'none' }}
        />
      )}
    </AudioContext.Provider>
  );
};
