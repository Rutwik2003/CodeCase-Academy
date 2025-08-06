import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  ArrowLeft, 
  RefreshCw,
  AlertTriangle,
  Eye,
  Search,
  FileText,
  Shield,
  Lock
} from 'lucide-react';
import { db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface MaintenanceConfig {
  enabled: boolean;
  title: string;
  message: string;
  estimatedDuration: string;
  enabledAt?: string;
}

const MaintenancePage: React.FC = () => {
  const [config, setConfig] = useState<MaintenanceConfig>({
    enabled: true,
    title: 'System Under Maintenance',
    message: 'We are currently performing scheduled maintenance to improve your experience. Please check back soon.',
    estimatedDuration: '30 minutes'
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Listen for real-time updates to maintenance config
    const unsubscribe = onSnapshot(
      doc(db, 'system', 'maintenance'),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as MaintenanceConfig;
          setConfig(data);
          
          // If maintenance is disabled, redirect to home
          if (!data.enabled) {
            window.location.href = '/';
          }
        }
      },
      (error) => {
        console.error('Error listening to maintenance config:', error);
      }
    );

    // Update current time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(timeInterval);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const getMaintenanceDuration = () => {
    if (!config.enabledAt) return null;
    
    const startTime = new Date(config.enabledAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60);
    
    if (diff < 60) {
      return `${diff} minutes ago`;
    } else {
      const hours = Math.floor(diff / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Detective atmosphere background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-amber-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-amber-400 rotate-45"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-amber-400"></div>
        <div className="absolute top-40 right-40 w-8 h-8 bg-amber-400 rounded-full"></div>
      </div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Main Case File Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl p-8 border-4 border-amber-600/50 shadow-2xl relative"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000" fill-opacity="0.1"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20v20h40V20H20z"/%3E%3C/g%3E%3C/svg%3E")',
          }}
        >
          {/* Case File Header */}
          <div className="border-b-2 border-amber-400 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-red-800"
                >
                  <Lock className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-mono">CASE FILE: SYSTEM-MAINT-001</h1>
                  <p className="text-amber-400 font-semibold">STATUS: UNDER INVESTIGATION</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">RESTRICTED ACCESS</div>
                <p className="text-xs text-slate-400 mt-1">Detective Academy Archives</p>
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-700/70 rounded-lg p-4 border-l-4 border-amber-600">
              <h3 className="font-bold text-white mb-2 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-amber-400" />
                INVESTIGATION SUBJECT
              </h3>
              <p className="text-slate-300 font-mono text-sm">{config.title}</p>
            </div>
            
            <div className="bg-slate-700/70 rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="font-bold text-white mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                ESTIMATED DURATION
              </h3>
              <p className="text-slate-300 font-mono text-sm">{config.estimatedDuration}</p>
            </div>
          </div>

          {/* Evidence Report */}
          <div className="bg-slate-900/80 text-white rounded-lg p-6 mb-6 border border-slate-600">
            <h3 className="font-bold mb-3 flex items-center text-amber-400">
              <FileText className="w-5 h-5 mr-2" />
              DETECTIVE REPORT
            </h3>
            <div className="bg-slate-800/70 rounded p-4 border-l-4 border-amber-400">
              <p className="text-slate-300 leading-relaxed font-mono text-sm">
                {config.message}
              </p>
              <div className="mt-4 text-xs text-slate-400">
                Filed by: System Administrator • Case opened: {config.enabledAt ? getMaintenanceDuration() : 'Recently'}
              </div>
            </div>
          </div>

          {/* Investigation Timeline */}
          <div className="bg-slate-700/50 rounded-lg p-4 border border-amber-600/30 mb-6">
            <h3 className="font-bold text-white mb-3 flex items-center">
              <Search className="w-5 h-5 mr-2 text-amber-400" />
              INVESTIGATION STATUS
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-slate-300 font-semibold">Active Investigation</span>
              </div>
              <div className="text-slate-400 text-sm">
                Current time: {currentTime.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={handleRefresh}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-bold shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              <span>RE-INVESTIGATE</span>
            </motion.button>
            
            <motion.button
              onClick={handleGoBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-bold shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>RETURN TO LOBBY</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Badge/Seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <div className="bg-slate-800 text-amber-400 rounded-full px-6 py-3 inline-flex items-center space-x-2 border-2 border-amber-400">
            <Shield className="w-5 h-5" />
            <span className="font-bold font-mono text-sm">CODECASE DETECTIVE ACADEMY</span>
          </div>
          <p className="text-amber-300 text-xs mt-2 font-mono">
            "Every mystery has a solution, every case has an end"
          </p>
        </motion.div>

        {/* Auto-refresh notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-center"
        >
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-lg p-3 border border-slate-600">
            <div className="flex items-center justify-center space-x-2 text-slate-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-mono">
                This case file will auto-update when investigation concludes
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenancePage;
