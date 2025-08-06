import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Shield, 
  Database,
  FileText,
  LogOut,
  Menu,
  X,
  Home,
  Activity,
  Award,
  TrendingUp,
  Bug,
  MessageSquare,
  ArrowLeft,
  Wrench,
  Volume2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { AdminPermission } from '../utils/adminAuth';
import { logger, LogCategory } from '../../utils/logger';
// import { CMSAudioWidget } from './CMSAudioWidget';

interface CMSLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const CMSLayout: React.FC<CMSLayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { logout, userData, currentUser } = useAuth();
  const { adminUser, hasPermission } = useAdmin();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      permission: null, // Always accessible
      color: 'text-blue-500'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      permission: AdminPermission.MANAGE_USERS,
      color: 'text-green-500'
    },
    {
      id: 'cases',
      label: 'Case Management',
      icon: BookOpen,
      permission: AdminPermission.MANAGE_CASES,
      color: 'text-purple-500'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      permission: AdminPermission.VIEW_ANALYTICS,
      color: 'text-orange-500'
    },
    {
      id: 'feedback',
      label: 'Feedback Management',
      icon: MessageSquare,
      permission: AdminPermission.VIEW_ANALYTICS,
      color: 'text-emerald-500'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      permission: AdminPermission.MANAGE_CASES,
      color: 'text-yellow-500'
    },
    {
      id: 'content',
      label: 'Content Manager',
      icon: FileText,
      permission: AdminPermission.MANAGE_CASES,
      color: 'text-indigo-500'
    },
    {
      id: 'audio',
      label: 'Audio Management',
      icon: Volume2,
      permission: AdminPermission.SYSTEM_SETTINGS,
      color: 'text-purple-500'
    },
    {
      id: 'activity',
      label: 'Activity Logs',
      icon: Activity,
      permission: AdminPermission.VIEW_ANALYTICS,
      color: 'text-cyan-500'
    },
    {
      id: 'system',
      label: 'System Settings',
      icon: Settings,
      permission: AdminPermission.SYSTEM_SETTINGS,
      color: 'text-red-500'
    },
    {
      id: 'debug',
      label: 'Debug Mode',
      icon: Bug,
      permission: AdminPermission.SYSTEM_SETTINGS,
      color: 'text-pink-500'
    },
    {
      id: 'logging',
      label: 'System Logging',
      icon: Database,
      permission: AdminPermission.SYSTEM_SETTINGS,
      color: 'text-teal-500'
    },
    {
      id: 'admin-users',
      label: 'Admin Management',
      icon: Shield,
      permission: AdminPermission.MANAGE_ADMINS,
      color: 'text-orange-500'
    },
    {
      id: 'maintenance',
      label: 'Investigation Control',
      icon: Wrench,
      permission: AdminPermission.SYSTEM_SETTINGS,
      color: 'text-red-500'
    }
  ];

  const visibleMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      logger.error(LogCategory.CMS, 'Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 cms-container">
      {/* Glassmorphism overlay matching main site */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-slate-900/40 via-slate-800/20 to-slate-900/40 pointer-events-none"></div>
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-72 md:w-64 bg-slate-900/40 backdrop-blur-xl border-r border-slate-700/50 z-50 flex flex-col"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 p-4 md:p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-slate-100 font-bold text-base md:text-lg">CodeCase</h2>
                  <p className="text-slate-400 text-xs md:text-sm">Admin Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Admin Info */}
          <div className="flex-shrink-0 p-3 md:p-4 border-b border-slate-700/50">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs md:text-sm">
                  {(userData?.displayName || currentUser?.displayName || adminUser?.email || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 font-medium text-xs md:text-sm truncate">
                  {userData?.displayName || currentUser?.displayName || adminUser?.email}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-400 text-xs capitalize">
                    {adminUser?.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2 overflow-y-auto custom-scrollbar">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-800/50 text-slate-100 shadow-lg border border-slate-700/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-amber-400' : item.color} flex-shrink-0`} />
                  <span className="font-medium text-xs md:text-sm truncate">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Footer - Back to Site and Logout */}
          <div className="flex-shrink-0 p-2 md:p-4 border-t border-slate-700/50 space-y-1 md:space-y-2">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 text-slate-400 hover:text-amber-400 hover:bg-slate-800/30 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="text-xs md:text-sm">Back to Main Site</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="text-xs md:text-sm">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64 lg:ml-72' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-slate-100 capitalize">
                  {currentPage === 'dashboard' ? 'Admin Dashboard' : currentPage.replace('_', ' ')}
                </h1>
                <p className="text-slate-400 text-xs md:text-sm hidden sm:block">
                  CodeCase Detective Academy - Content Management System
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-slate-200 text-sm font-medium">System Online</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
                <Database className="w-4 h-4 text-amber-400" />
                <span className="text-slate-200 text-sm font-medium">Firebase Connected</span>
              </div>
              {/* Mobile status indicators */}
              <div className="flex md:hidden items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 md:p-6">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Audio Widget for CMS */}
      {/* <CMSAudioWidget /> */}
    </div>
  );
};

export default CMSLayout;
