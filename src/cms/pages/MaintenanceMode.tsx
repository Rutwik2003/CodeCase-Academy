import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Power, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Settings,
  Eye,
  FileText,
  Lock
} from 'lucide-react';
import { db } from '../../config/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { logger, LogCategory } from '../../utils/logger';

interface MaintenanceConfig {
  enabled: boolean;
  title: string;
  message: string;
  estimatedDuration: string;
  enabledAt?: string;
  enabledBy?: string;
}

const MaintenanceMode: React.FC = () => {
  const [config, setConfig] = useState<MaintenanceConfig>({
    enabled: false,
    title: 'Case Files Under Investigation',
    message: 'Our detective team is currently investigating system improvements to enhance your academy experience. Please check back soon while we solve this case.',
    estimatedDuration: '30 minutes'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    // Listen for real-time updates to maintenance config
    const unsubscribe = onSnapshot(
      doc(db, 'system', 'maintenance'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as MaintenanceConfig;
          setConfig(data);
          setLastUpdated(new Date().toLocaleString());
        }
        setLoading(false);
      },
      (error) => {
        logger.error(LogCategory.CMS, 'Error listening to maintenance config:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleToggleMaintenance = async () => {
    setSaving(true);
    try {
      const newConfig = {
        ...config,
        enabled: !config.enabled,
        enabledAt: !config.enabled ? new Date().toISOString() : config.enabledAt,
        enabledBy: !config.enabled ? 'Admin User' : config.enabledBy
      };

      await setDoc(doc(db, 'system', 'maintenance'), newConfig);
      
      logger.info(LogCategory.CMS, `Maintenance mode ${newConfig.enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      logger.error(LogCategory.CMS, 'Error updating maintenance mode:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleConfigUpdate = async (updates: Partial<MaintenanceConfig>) => {
    setSaving(true);
    try {
      const newConfig = { ...config, ...updates };
      await setDoc(doc(db, 'system', 'maintenance'), newConfig);
      setConfig(newConfig);
    } catch (error) {
      logger.error(LogCategory.CMS, 'Error updating maintenance config:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-3 text-white">Loading maintenance settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              config.enabled ? 'bg-red-500/20' : 'bg-green-500/20'
            }`}>
              <Lock className={`w-6 h-6 ${config.enabled ? 'text-red-400' : 'text-green-400'}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Case Investigation Control</h1>
              <p className="text-white/60">Manage academy-wide investigation status and detective messaging</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              config.enabled ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {config.enabled ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Investigation Active</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Academy Online</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Toggle */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Quick Investigation Toggle</h2>
            <p className="text-white/60">Enable or disable case investigation mode instantly</p>
          </div>
          
          <motion.button
            onClick={handleToggleMaintenance}
            disabled={saving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              config.enabled
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Power className="w-5 h-5" />
            <span>
              {saving 
                ? 'Updating...' 
                : config.enabled 
                  ? 'Close Investigation' 
                  : 'Start Investigation'
              }
            </span>
          </motion.button>
        </div>
      </div>

      {/* Status Information */}
      {config.enabled && (
        <div className="bg-red-500/10 backdrop-blur-xl rounded-xl p-6 border border-red-500/20">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">Case Investigation Active</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span className="text-red-300">
                    Enabled: {config.enabledAt ? new Date(config.enabledAt).toLocaleString() : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-red-400" />
                  <span className="text-red-300">
                    By: {config.enabledBy || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-red-400" />
                  <span className="text-red-300">
                    Investigation: {config.estimatedDuration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Investigation Case Configuration</h2>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-white font-medium mb-2">Case File Title</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter investigation case title..."
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-white font-medium mb-2">Detective Report Message</label>
            <textarea
              value={config.message}
              onChange={(e) => setConfig({ ...config, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter the detective message users will see during investigation..."
            />
          </div>

          {/* Estimated Duration */}
          <div>
            <label className="block text-white font-medium mb-2">Estimated Investigation Time</label>
            <input
              type="text"
              value={config.estimatedDuration}
              onChange={(e) => setConfig({ ...config, estimatedDuration: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 30 minutes, 2 hours, etc."
            />
          </div>

          {/* Save Configuration */}
          <motion.button
            onClick={() => handleConfigUpdate({})}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving Configuration...' : 'Save Configuration'}
          </motion.button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Investigation Case Preview</h2>
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg p-8 text-center relative">
          {/* Mini detective background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-8 h-8 border border-amber-400 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border border-amber-400 rotate-45"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-800">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-lg p-6 text-white border border-amber-600/50">
              <h1 className="text-xl font-bold mb-2 font-mono">CASE FILE: SYSTEM-MAINT-001</h1>
              <p className="text-amber-400 font-semibold mb-4">STATUS: UNDER INVESTIGATION</p>
              <div className="bg-slate-900/80 text-white rounded p-4 border border-slate-600">
                <h3 className="font-bold text-amber-400 mb-2 flex items-center justify-center">
                  <FileText className="w-4 h-4 mr-2" />
                  DETECTIVE REPORT
                </h3>
                <p className="text-slate-300 text-sm font-mono">{config.message}</p>
              </div>
              <div className="mt-4 flex justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">Duration: {config.estimatedDuration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lastUpdated && (
        <div className="text-center text-white/50 text-sm">
          Last updated: {lastUpdated}
        </div>
      )}
    </div>
  );
};

export default MaintenanceMode;
