import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface GlobalAudioSettings {
  homepage: number;
  training: number;
  case: number;
  profile: number;
  globalMute: boolean;
  lastUpdated: string;
  updatedBy: string;
}

export const GlobalAudioManager: React.FC = () => {
  const [settings, setSettings] = useState<GlobalAudioSettings>({
    homepage: 5,
    training: 15,
    case: 15,
    profile: 5,
    globalMute: false,
    lastUpdated: '',
    updatedBy: ''
  });
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for real-time updates from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'globalSettings', 'audioConfig'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as GlobalAudioSettings;
          setSettings(data);
          setLocalSettings(data);
          setIsLoading(false);
        } else {
          // Initialize with defaults if no settings exist
          initializeDefaultSettings();
        }
      },
      (error) => {
        console.error('Error listening to audio settings:', error);
        setError('Failed to load settings from server');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const initializeDefaultSettings = async () => {
    const defaultSettings: GlobalAudioSettings = {
      homepage: 5,
      training: 15,
      case: 15,
      profile: 5,
      globalMute: false,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'System'
    };

    try {
      await setDoc(doc(db, 'globalSettings', 'audioConfig'), defaultSettings);
      setSettings(defaultSettings);
      setLocalSettings(defaultSettings);
    } catch (error) {
      console.error('Failed to initialize settings:', error);
      setError('Failed to initialize settings');
    }
    setIsLoading(false);
  };

  const handleVolumeChange = (track: keyof Omit<GlobalAudioSettings, 'globalMute' | 'lastUpdated' | 'updatedBy'>, value: number) => {
    const newLocalSettings = { ...localSettings, [track]: value };
    setLocalSettings(newLocalSettings);
    setHasChanges(true);
  };

  const handleGlobalMuteToggle = () => {
    const newLocalSettings = { ...localSettings, globalMute: !localSettings.globalMute };
    setLocalSettings(newLocalSettings);
    setHasChanges(true);
  };

  const saveGlobalSettings = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const settingsToSave: GlobalAudioSettings = {
        ...localSettings,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'Admin' // You can get actual admin user here
      };

      await setDoc(doc(db, 'globalSettings', 'audioConfig'), settingsToSave);
      
      // Also dispatch event for immediate local effect
      const decimalSettings = {
        homepage: localSettings.homepage / 100,
        training: localSettings.training / 100,
        case: localSettings.case / 100,
        profile: localSettings.profile / 100,
        globalMute: localSettings.globalMute
      };
      
      window.dispatchEvent(new CustomEvent('globalAudioSettingsChanged', { 
        detail: decimalSettings 
      }));
      
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save global settings:', error);
      setError('Failed to save settings to server');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setLocalSettings({
      ...localSettings,
      homepage: 5,
      training: 15,
      case: 15,
      profile: 5,
      globalMute: false
    });
    setHasChanges(true);
  };

  const testAudio = (track: keyof Omit<GlobalAudioSettings, 'globalMute' | 'lastUpdated' | 'updatedBy'>) => {
    const audioFiles = {
      homepage: 'codecase_homepage_audio.mp3',
      training: 'codecase_trainingpage_audio.mp3',
      case: 'detective-case_audio.mp3',
      profile: 'codecase_homepage_audio.mp3',
    };

    try {
      const audio = new Audio(`/assets/${audioFiles[track]}`);
      audio.volume = localSettings[track] / 100;
      audio.play().catch(() => {
        console.log('Audio play failed - user interaction may be required');
      });
      
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
      description: 'Background music for all users on the main page',
      color: '#3b82f6'
    },
    training: { 
      label: 'Training Audio', 
      description: 'Audio for all users in learning sections',
      color: '#10b981'
    },
    case: { 
      label: 'Case Audio', 
      description: 'Audio for all users during case investigations',
      color: '#ef4444'
    },
    profile: { 
      label: 'Profile Audio', 
      description: 'Audio for all users on profile pages',
      color: '#8b5cf6'
    },
  };

  if (isLoading) {
    return (
      <div style={{ 
        background: 'rgba(15, 23, 42, 0.4)', 
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        padding: '48px', 
        borderRadius: '12px',
        textAlign: 'center',
        color: '#94a3b8'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid rgba(59, 130, 246, 0.3)',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <p>Loading global audio settings...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          🌍 Global Audio Management
          <span style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'normal'
          }}>
            LIVE
          </span>
        </h2>
        
        <p style={{ 
          color: '#94a3b8',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          Control audio settings for ALL users across the entire website. Changes apply immediately to all visitors.
        </p>

        {/* Last Updated Info */}
        {settings.lastUpdated && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <p style={{ color: '#60a5fa', fontSize: '13px', margin: 0 }}>
              📅 Last updated: {new Date(settings.lastUpdated).toLocaleString()} by {settings.updatedBy}
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#fca5a5'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#34d399'
        }}>
          ✅ Global settings updated! All users will now hear audio at these levels.
        </div>
      )}

      {/* Global Mute Control */}
      <div style={{ 
        marginBottom: '24px', 
        padding: '16px', 
        background: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(148, 163, 184, 0.2)', 
        borderRadius: '8px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
              🔇 Global Mute Control
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Instantly mute/unmute audio for ALL users across the entire website
            </p>
          </div>
          <button 
            onClick={handleGlobalMuteToggle}
            style={{
              background: localSettings.globalMute 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                : 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            {localSettings.globalMute ? '🔇 Unmute All' : '🔊 Mute All'}
          </button>
        </div>
      </div>

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
              onClick={() => testAudio(key as keyof Omit<GlobalAudioSettings, 'globalMute' | 'lastUpdated' | 'updatedBy'>)}
              style={{
                background: `linear-gradient(135deg, ${info.color}, ${info.color}dd)`,
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              ▶ Test (3s)
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#64748b', fontSize: '12px', width: '30px' }}>0%</span>
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={localSettings[key as keyof Omit<GlobalAudioSettings, 'globalMute' | 'lastUpdated' | 'updatedBy'>]}
              onChange={(e) => handleVolumeChange(key as keyof Omit<GlobalAudioSettings, 'globalMute' | 'lastUpdated' | 'updatedBy'>, parseInt(e.target.value))}
              style={{ 
                flex: 1,
                height: '6px',
                background: 'rgba(51, 65, 85, 0.8)',
                borderRadius: '3px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
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
              {localSettings[key as keyof Omit<GlobalAudioSettings, 'globalMute' | 'lastUpdated' | 'updatedBy'>]}%
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
            fontWeight: '500'
          }}
        >
          🔄 Reset to Defaults
        </button>
        
        <button 
          onClick={saveGlobalSettings}
          disabled={!hasChanges || isSaving}
          style={{
            background: hasChanges 
              ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
              : 'rgba(156, 163, 175, 0.4)',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: hasChanges ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '600',
            opacity: hasChanges ? 1 : 0.5,
            boxShadow: hasChanges ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
          }}
        >
          {isSaving ? '🌍 Updating All Users...' : hasChanges ? '🌍 Apply to All Users' : '✅ All Synced'}
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
            ⚠️ You have unsaved changes. Click "Apply to All Users" to update audio settings globally.
          </p>
        </div>
      )}

      {/* Info */}
      <div style={{ 
        marginTop: '20px',
        padding: '16px',
        background: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(239, 68, 68, 0.3)'
      }}>
        <h4 style={{ color: '#fca5a5', margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
          🚨 Global Control Panel:
        </h4>
        <ul style={{ color: '#fca5a5', fontSize: '12px', margin: 0, paddingLeft: '16px', lineHeight: '1.5' }}>
          <li>Settings are saved to Firebase and sync across ALL devices</li>
          <li>Changes apply IMMEDIATELY to all website visitors</li>
          <li>Global mute can instantly silence the entire website</li>
          <li>Real-time updates - other admins will see your changes instantly</li>
        </ul>
      </div>
    </div>
  );
};
