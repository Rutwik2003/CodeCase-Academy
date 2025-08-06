import React, { useState, useEffect } from 'react';

interface AudioSettings {
  homepage: number;
  training: number;
  case: number;
  profile: number;
}

export const BulletproofAudio: React.FC = () => {
  const [settings, setSettings] = useState<AudioSettings>({
    homepage: 5,
    training: 15,
    case: 15,
    profile: 5,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('codecase_audio_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({
          homepage: Math.round((parsed.homepage || 0.05) * 100),
          training: Math.round((parsed.training || 0.15) * 100),
          case: Math.round((parsed.case || 0.15) * 100),
          profile: Math.round((parsed.profile || 0.05) * 100),
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  const handleVolumeChange = (track: keyof AudioSettings, value: number) => {
    setSettings(prev => ({ ...prev, [track]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Convert percentages back to decimal for storage
      const settingsToSave = {
        homepage: settings.homepage / 100,
        training: settings.training / 100,
        case: settings.case / 100,
        profile: settings.profile / 100,
        globalMute: false
      };
      
      localStorage.setItem('codecase_audio_settings', JSON.stringify(settingsToSave));
      
      // Dispatch event to notify the main audio system
      window.dispatchEvent(new CustomEvent('audioSettingsChanged', { 
        detail: settingsToSave 
      }));
      
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      homepage: 5,
      training: 15,
      case: 15,
      profile: 5,
    });
    setHasChanges(true);
  };

  const testAudio = (track: keyof AudioSettings) => {
    const audioFiles = {
      homepage: 'codecase_homepage_audio.mp3',
      training: 'codecase_trainingpage_audio.mp3',
      case: 'detective-case_audio.mp3',
      profile: 'codecase_homepage_audio.mp3',
    };

    try {
      const audio = new Audio(`/assets/${audioFiles[track]}`);
      audio.volume = settings[track] / 100;
      audio.play().catch(() => {
        console.log('Audio play failed - user interaction may be required');
      });
      
      // Stop after 3 seconds
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 3000);
    } catch (error) {
      console.error('Failed to play test audio:', error);
    }
  };

  const trackInfo = {
    homepage: { 
      label: 'Homepage Audio', 
      description: 'Background music for the main page',
      color: '#3b82f6'
    },
    training: { 
      label: 'Training Audio', 
      description: 'Audio for learning sections',
      color: '#10b981'
    },
    case: { 
      label: 'Case Audio', 
      description: 'Audio during case investigations',
      color: '#ef4444'
    },
    profile: { 
      label: 'Profile Audio', 
      description: 'Audio for profile pages',
      color: '#8b5cf6'
    },
  };
  return (
    <div style={{ 
      background: 'rgba(15, 23, 42, 0.4)', // Dark glassmorphism background
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      padding: '24px', 
      borderRadius: '12px', 
      margin: '0',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        marginBottom: '8px',
        color: '#f1f5f9' // Light text for dark theme
      }}>
        Audio Management
      </h2>
      
      <p style={{ 
        color: '#94a3b8', // Muted light text
        marginBottom: '24px',
        fontSize: '14px'
      }}>
        Configure audio settings for different sections. Changes are saved automatically to your browser.
      </p>

      {/* Success Message */}
      {showSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#34d399',
          fontSize: '14px'
        }}>
          ✅ Settings saved successfully!
        </div>
      )}

      {/* Audio Controls */}
      {Object.entries(trackInfo).map(([key, info]) => (
        <div key={key} style={{ 
          marginBottom: '20px', 
          padding: '16px', 
          background: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(148, 163, 184, 0.2)', 
          borderRadius: '8px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h3 style={{ 
                fontWeight: '600', 
                marginBottom: '4px', 
                color: '#f1f5f9',
                fontSize: '16px'
              }}>
                {info.label}
              </h3>
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '13px',
                margin: 0
              }}>
                {info.description}
              </p>
            </div>
            <button 
              onClick={() => testAudio(key as keyof AudioSettings)}
              style={{
                background: `linear-gradient(135deg, ${info.color}, ${info.color}dd)`,
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
              }}
            >
              ▶ Test (3s)
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#64748b', fontSize: '12px', width: '30px' }}>0%</span>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={settings[key as keyof AudioSettings]}
                onChange={(e) => handleVolumeChange(key as keyof AudioSettings, parseInt(e.target.value))}
                style={{ 
                  width: '100%',
                  height: '6px',
                  background: 'rgba(51, 65, 85, 0.8)',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              />
              <style>
                {`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: ${info.color};
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: ${info.color};
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                  }
                `}
              </style>
            </div>
            <span style={{ color: '#64748b', fontSize: '12px', width: '40px' }}>50%</span>
            <div style={{
              background: `linear-gradient(135deg, ${info.color}, ${info.color}dd)`,
              color: 'white',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 'bold',
              minWidth: '45px',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
            }}>
              {settings[key as keyof AudioSettings]}%
            </div>
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div style={{ 
        borderTop: '1px solid rgba(148, 163, 184, 0.2)', 
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button 
          onClick={resetToDefaults}
          style={{
            background: 'rgba(71, 85, 105, 0.6)',
            backdropFilter: 'blur(8px)',
            color: '#e2e8f0',
            padding: '12px 20px',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(71, 85, 105, 0.8)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(71, 85, 105, 0.6)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🔄 Reset to Defaults
        </button>
        
        <button 
          onClick={saveSettings}
          disabled={!hasChanges || isSaving}
          style={{
            background: hasChanges 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : 'rgba(156, 163, 175, 0.4)',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: hasChanges ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '600',
            opacity: hasChanges ? 1 : 0.5,
            boxShadow: hasChanges ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            if (hasChanges) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (hasChanges) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }
          }}
        >
          {isSaving ? '💾 Saving...' : hasChanges ? '💾 Save Settings' : '✅ All Saved'}
        </button>
      </div>

      {/* Changes Warning */}
      {hasChanges && (
        <div style={{ 
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(245, 158, 11, 0.2)',
          borderRadius: '8px',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <p style={{ 
            color: '#fbbf24',
            fontSize: '13px',
            margin: 0
          }}>
            ⚠️ You have unsaved changes. Click "Save Settings" to apply them to the audio system.
          </p>
        </div>
      )}

      {/* Info */}
      <div style={{ 
        marginTop: '20px',
        padding: '16px',
        background: 'rgba(14, 165, 233, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(14, 165, 233, 0.3)'
      }}>
        <h4 style={{ color: '#38bdf8', margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
          💡 How it works:
        </h4>
        <ul style={{ color: '#7dd3fc', fontSize: '12px', margin: 0, paddingLeft: '16px', lineHeight: '1.5' }}>
          <li>Volume settings are saved to your browser's local storage</li>
          <li>Use "Test" buttons to preview audio at the selected volume</li>
          <li>Changes take effect immediately when you save</li>
          <li>Audio will automatically play at these levels when you navigate</li>
        </ul>
      </div>
    </div>
  );
};
