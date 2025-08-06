import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, RotateCcw, Save, Music, Sliders } from 'lucide-react';

interface AudioSettings {
  homepage: number;
  training: number;
  case: number;
  profile: number;
  globalMute: boolean;
}

export const AudioManagement: React.FC = () => {
  const [settings, setSettings] = useState<AudioSettings>({
    homepage: 0.05,
    training: 0.15,
    case: 0.15,
    profile: 0.05,
    globalMute: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isMuted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('audioManagementSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Failed to load audio settings:', error);
      }
    }
  }, []);

  const handleVolumeChange = (track: keyof Omit<AudioSettings, 'globalMute'>, newVolume: number) => {
    const updatedSettings = {
      ...settings,
      [track]: newVolume / 100, // Convert percentage to decimal
    };
    setSettings(updatedSettings);
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('audioManagementSettings', JSON.stringify(settings));
    setHasChanges(false);
    
    // Trigger a custom event to notify AudioContext about the change
    window.dispatchEvent(new CustomEvent('audioSettingsChanged', { detail: settings }));
  };

  const resetToDefaults = () => {
    const defaultSettings: AudioSettings = {
      homepage: 0.05,
      training: 0.15,
      case: 0.15,
      profile: 0.05,
      globalMute: false,
    };
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const testTrack = (track: keyof Omit<AudioSettings, 'globalMute'>) => {
    // Create and play audio for testing
    const audio = new Audio(`/assets/${getAudioFile(track)}`);
    audio.volume = settings[track];
    audio.play().catch(console.error);
    
    // Stop after 3 seconds
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 3000);
  };

  const getAudioFile = (track: string) => {
    switch (track) {
      case 'homepage': return 'codecase_homepage_audio.mp3';
      case 'training': return 'codecase_trainingpage_audio.mp3';
      case 'case': return 'detective-case_audio.mp3';
      case 'profile': return 'codecase_homepage_audio.mp3';
      default: return 'codecase_homepage_audio.mp3';
    }
  };

  const trackLabels = {
    homepage: 'Homepage Audio',
    training: 'Training Page Audio',
    case: 'Case Investigation Audio',
    profile: 'Profile Page Audio',
  };

  const trackDescriptions = {
    homepage: 'Background music for the main homepage',
    training: 'Ambient audio for the learning/training section',
    case: 'Intense music for case solving and investigations',
    profile: 'Calm audio for user profile and settings pages',
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Music className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Audio Management</h2>
            <p className="text-sm text-gray-600">Configure volume levels for different sections</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
          
          {hasChanges && (
            <button
              onClick={saveSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          )}
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 mb-6 border border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-gray-500" />
              ) : (
                <Volume2 className="h-5 w-5 text-amber-600" />
              )}
              <span className="font-medium text-gray-900">
                Audio Management System Active
              </span>
            </div>
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-mono">
              Standalone Mode
            </span>
          </div>
        </div>
      </div>

      {/* Volume Controls */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Sliders className="h-5 w-5" />
          <span>Volume Settings</span>
        </h3>

        {Object.entries(trackLabels).map(([track, label]) => {
          const typedTrack = track as keyof Omit<AudioSettings, 'globalMute'>;
          const volumePercent = Math.round(settings[typedTrack] * 100);

          return (
            <div key={track} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900">{label}</h4>
                </div>
                
                <button
                  onClick={() => testTrack(typedTrack)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                >
                  <Play className="h-3 w-3" />
                  <span>Test (3s)</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{trackDescriptions[typedTrack]}</p>
              
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={volumePercent}
                    onChange={(e) => handleVolumeChange(typedTrack, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${volumePercent * 2}%, #e5e7eb ${volumePercent * 2}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>
                
                <div className="text-right min-w-[60px]">
                  <span className="text-lg font-mono font-bold text-gray-900">{volumePercent}%</span>
                  <div className="text-xs text-gray-500">Volume</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 mt-0.5">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Audio Management Tips</h4>
            <ul className="text-sm text-blue-800 mt-1 space-y-1">
              <li>• Keep volume levels low (5-15%) for better user experience</li>
              <li>• Test each track to ensure proper audio levels</li>
              <li>• Changes are applied immediately when testing</li>
              <li>• Save settings to persist changes across sessions</li>
              <li>• This is a standalone audio management system</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
