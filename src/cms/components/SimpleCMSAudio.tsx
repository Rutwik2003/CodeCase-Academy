import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Save, RotateCcw } from 'lucide-react';

interface AudioSettings {
  homepage: number;
  training: number;
  case: number;
  profile: number;
  globalMute: boolean;
}

export const SimpleCMSAudio: React.FC = () => {
  const [settings, setSettings] = useState<AudioSettings>({
    homepage: 0.05,
    training: 0.15,
    case: 0.15,
    profile: 0.05,
    globalMute: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('codecase_audio_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      }
    } catch (error) {
      console.error('Failed to load audio settings:', error);
    }
  }, []);

  const handleVolumeChange = (track: keyof Omit<AudioSettings, 'globalMute'>, value: number) => {
    const newSettings = { ...settings, [track]: value };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const handleMuteToggle = () => {
    const newSettings = { ...settings, globalMute: !settings.globalMute };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('codecase_audio_settings', JSON.stringify(settings));
      // Dispatch event to notify audio system
      window.dispatchEvent(new CustomEvent('audioSettingsChanged', { detail: settings }));
      setHasChanges(false);
      alert('Audio settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      homepage: 0.05,
      training: 0.15,
      case: 0.15,
      profile: 0.05,
      globalMute: false,
    };
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const testAudio = (track: keyof Omit<AudioSettings, 'globalMute'>) => {
    const audioFiles = {
      homepage: 'codecase_homepage_audio.mp3',
      training: 'codecase_trainingpage_audio.mp3',
      case: 'detective-case_audio.mp3',
      profile: 'codecase_homepage_audio.mp3',
    };

    try {
      const audio = new Audio(`/assets/${audioFiles[track]}`);
      audio.volume = settings[track];
      audio.play();
      
      // Stop after 3 seconds
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 3000);
    } catch (error) {
      console.error('Failed to play test audio:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Audio Management</h2>
        <p className="text-gray-600">Configure volume levels for different sections of the application</p>
      </div>

      {/* Global Mute */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {settings.globalMute ? (
              <VolumeX className="h-6 w-6 text-red-500" />
            ) : (
              <Volume2 className="h-6 w-6 text-green-500" />
            )}
            <span className="font-medium text-gray-900">Global Audio</span>
          </div>
          <button
            onClick={handleMuteToggle}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              settings.globalMute
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {settings.globalMute ? 'Unmute All' : 'Mute All'}
          </button>
        </div>
      </div>

      {/* Volume Controls */}
      <div className="space-y-6 mb-6">
        {[
          { key: 'homepage' as const, label: 'Homepage Audio', description: 'Background music for the main page' },
          { key: 'training' as const, label: 'Training Audio', description: 'Audio for learning sections' },
          { key: 'case' as const, label: 'Case Audio', description: 'Audio during case investigations' },
          { key: 'profile' as const, label: 'Profile Audio', description: 'Audio for profile pages' },
        ].map(({ key, label, description }) => (
          <div key={key} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{label}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <button
                onClick={() => testAudio(key)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Test (3s)</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 w-8">0%</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={settings[key]}
                onChange={(e) => handleVolumeChange(key, parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500 w-12">100%</span>
              <span className="text-sm font-medium text-gray-900 w-12">
                {Math.round(settings[key] * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={resetToDefaults}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset to Defaults</span>
        </button>

        <button
          onClick={saveSettings}
          disabled={!hasChanges}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
            hasChanges
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {hasChanges && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            You have unsaved changes. Click "Save Settings" to apply them.
          </p>
        </div>
      )}
    </div>
  );
};
