import React, { useState } from 'react';
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
  Wrench
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { AdminPermission } from '../utils/adminAuth';
import { logger, LogCategory } from '../../utils/logger';

interface CMSLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const CMSLayout: React.FC<CMSLayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { logout } = useAuth();
  const { adminUser, hasPermission } = useAdmin();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 z-50 flex flex-col"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">CodeCase</h2>
                  <p className="text-white/60 text-sm">Admin Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Admin Info */}
          <div className="flex-shrink-0 p-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {adminUser?.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {adminUser?.email}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/60 text-xs capitalize">
                    {adminUser?.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Footer - Back to Site and Logout */}
          <div className="flex-shrink-0 p-4 border-t border-white/20 space-y-2">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Main Site</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-white/70 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white capitalize">
                  {currentPage === 'dashboard' ? 'Admin Dashboard' : currentPage.replace('_', ' ')}
                </h1>
                <p className="text-white/60 text-sm">
                  CodeCase Detective Academy - Content Management System
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm font-medium">System Online</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">Firebase Connected</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
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
    </div>
  );
};

export default CMSLayout;
