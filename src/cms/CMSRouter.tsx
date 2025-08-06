import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AdminProvider, useAdmin } from './hooks/useAdmin';
import SimpleCMSLayout from './components/SimpleCMSLayout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CaseManagement from './pages/CaseManagementFixed';
import Analytics from './pages/Analytics';
import DebugMode from './pages/DebugMode';
import AdminUserManagement from './pages/AdminUserManagement';
import LoggingManagement from './pages/LoggingManagement';
import FeedbackManagement from './pages/FeedbackManagement';
import MaintenanceMode from './pages/MaintenanceMode';
import { GlobalAudioManager } from './components/GlobalAudioManager';
import { Shield, AlertTriangle, Loader2, ArrowLeft, Clock, Eye } from 'lucide-react';

// Access Denied Component
const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  
  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    {/* Detective atmosphere background elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-20 w-32 h-32 border-2 border-red-400 rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-red-400 rotate-45"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 border border-red-400"></div>
      <div className="absolute top-40 right-40 w-8 h-8 bg-red-400 rounded-full"></div>
      <div className="absolute bottom-40 left-40 w-12 h-12 border border-red-400 rotate-12"></div>
      <div className="absolute top-60 left-1/3 w-6 h-6 bg-red-400/50 rounded-full"></div>
    </div>

    <div className="text-center max-w-2xl relative z-10">
      {/* Case File Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-red-900/90 to-red-800/90 backdrop-blur-xl rounded-xl p-8 border-4 border-red-600 shadow-2xl relative"
      >
        {/* Case File Header */}
        <div className="border-b-2 border-red-400 pb-4 mb-6">
          <div className="flex items-center justify-center space-x-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-red-800"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white font-mono"
              >
                CASE FILE: ACCESS-DENIED-001
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-red-300 font-semibold"
              >
                STATUS: UNAUTHORIZED ACCESS ATTEMPT
              </motion.p>
            </div>
          </div>
        </div>

        {/* Classification Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-red-600/20 border border-red-400/50 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center justify-center space-x-2 text-red-300">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-bold text-lg">CLASSIFIED - DETECTIVE ACCESS ONLY</span>
          </div>
        </motion.div>

        {/* Investigation Report */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/70 rounded-lg p-6 mb-6 border border-red-400/30"
        >
          <h3 className="font-bold mb-3 flex items-center justify-center text-red-400">
            <Eye className="w-5 h-5 mr-2" />
            SECURITY INVESTIGATION REPORT
          </h3>
          <div className="bg-slate-800/50 rounded p-4 border-l-4 border-red-400">
            <p className="text-slate-300 leading-relaxed font-mono text-sm mb-4">
              UNAUTHORIZED ACCESS DETECTED: The individual attempting to access this restricted area does not possess the required detective credentials.
            </p>
            <p className="text-slate-300 leading-relaxed font-mono text-sm mb-4">
              SECURITY CLEARANCE: Only certified detectives and academy administrators are authorized to access the evidence management system.
            </p>
            <div className="mt-4 text-xs text-slate-400">
              Filed by: Security System • Classification Level: RESTRICTED
            </div>
          </div>
        </motion.div>

        {/* Evidence Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-2 text-red-400 justify-center">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">DETECTIVE CREDENTIALS REQUIRED</span>
          </div>
          <p className="text-red-300/80 text-sm mt-2 text-center">
            Contact the Chief Detective if you believe you should have access to this case management system.
          </p>
        </motion.div>

        {/* Investigation Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-700/50 rounded-lg p-4 border border-red-600/30 mb-6"
        >
          <h3 className="font-bold text-white mb-3 flex items-center justify-center">
            <Clock className="w-5 h-5 mr-2 text-red-400" />
            ACCESS ATTEMPT LOG
          </h3>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-slate-300 font-semibold text-sm">Incident Recorded</span>
            </div>
            <div className="text-slate-400 text-sm">
              Time: {new Date().toLocaleString()}
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg transition-all duration-200 font-bold shadow-lg flex items-center space-x-2 mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>RETURN TO ACADEMY LOBBY</span>
        </motion.button>
      </motion.div>

      {/* Academy Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-center"
      >
        <div className="bg-slate-800 text-red-400 rounded-full px-6 py-3 inline-flex items-center space-x-2 border-2 border-red-400">
          <Shield className="w-5 h-5" />
          <span className="font-bold font-mono text-sm">CODECASE DETECTIVE ACADEMY</span>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-red-300 text-xs mt-2 font-mono"
        >
          "Security is our priority, justice is our mission"
        </motion.p>
      </motion.div>

      {/* Additional Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-4 text-center"
      >
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-lg p-3 border border-slate-600">
          <div className="flex items-center justify-center space-x-2 text-slate-300">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-mono">
              This security incident has been logged and reported to academy administration
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
  );
};

// Loading Component
const CMSLoading: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
    {/* Detective atmosphere background elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-20 w-32 h-32 border-2 border-blue-400 rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-400 rotate-45"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 border border-blue-400"></div>
      <div className="absolute top-40 right-40 w-8 h-8 bg-blue-400 rounded-full"></div>
    </div>

    <div className="text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-400"
      >
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-white mb-2 font-mono"
      >
        ACCESSING DETECTIVE ARCHIVES...
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/60 font-mono"
      >
        Verifying detective credentials and academy privileges...
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <div className="bg-slate-800 text-blue-400 rounded-full px-6 py-2 inline-flex items-center space-x-2 border border-blue-400/30">
          <Shield className="w-4 h-4" />
          <span className="font-bold font-mono text-sm">CODECASE DETECTIVE ACADEMY</span>
        </div>
      </motion.div>
    </div>
  </div>
);

// CMS Content Component
const CMSContent: React.FC = () => {
  const { isAdmin, isLoading } = useAdmin();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return <CMSLoading />;
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'users':
        return <UserManagement />;
      case 'cases':
        return <CaseManagement />;
      case 'analytics':
        return <Analytics />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'achievements':
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Achievement Management</h2>
            <p className="text-white/60">Achievement management coming soon...</p>
          </div>
        );
      case 'content':
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Content Manager</h2>
            <p className="text-white/60">Content management tools coming soon...</p>
          </div>
        );
      case 'activity':
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Activity Logs</h2>
            <p className="text-white/60">Activity monitoring coming soon...</p>
          </div>
        );
      case 'audio':
        console.log('Rendering audio management page');
        return <GlobalAudioManager />;
      case 'system':
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">System Settings</h2>
            <p className="text-white/60">System configuration coming soon...</p>
          </div>
        );
      case 'debug':
        return <DebugMode />;
      case 'logging':
        return <LoggingManagement />;
      case 'admin-users':
        return <AdminUserManagement />;
      case 'maintenance':
        return <MaintenanceMode />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <SimpleCMSLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </SimpleCMSLayout>
  );
};

// Main CMS Router Component
const CMSRouter: React.FC = () => {
  return (
    <AdminProvider>
      <CMSContent />
    </AdminProvider>
  );
};

export default CMSRouter;
