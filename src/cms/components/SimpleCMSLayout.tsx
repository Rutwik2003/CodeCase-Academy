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
  Bug,
  MessageSquare,
  ArrowLeft,
  Wrench,
  Volume2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SimpleCMSLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const SimpleCMSLayout: React.FC<SimpleCMSLayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-500' },
    { id: 'users', label: 'User Management', icon: Users, color: 'text-green-500' },
    { id: 'cases', label: 'Case Management', icon: BookOpen, color: 'text-purple-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-orange-500' },
    { id: 'feedback', label: 'Feedback Management', icon: MessageSquare, color: 'text-emerald-500' },
    { id: 'achievements', label: 'Achievements', icon: Award, color: 'text-yellow-500' },
    { id: 'content', label: 'Content Manager', icon: FileText, color: 'text-indigo-500' },
    { id: 'audio', label: 'Audio Management', icon: Volume2, color: 'text-purple-500' },
    { id: 'activity', label: 'Activity Logs', icon: Activity, color: 'text-teal-500' },
    { id: 'system', label: 'System Settings', icon: Settings, color: 'text-gray-500' },
    { id: 'debug', label: 'Debug Mode', icon: Bug, color: 'text-red-500' },
    { id: 'logging', label: 'System Logging', icon: Database, color: 'text-cyan-500' },
    { id: 'admin-users', label: 'Admin Users', icon: Shield, color: 'text-pink-500' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'text-amber-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Glassmorphism overlay */}
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
                  {(userData?.displayName || currentUser?.displayName || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-100 font-medium text-xs md:text-sm truncate">
                  {userData?.displayName || currentUser?.displayName || 'Admin User'}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Super Admin
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-2 md:p-4">
            <div className="space-y-1 md:space-y-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onPageChange(item.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-left transition-all duration-200
                      ${isActive 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                      }
                    `}
                  >
                    <IconComponent className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-amber-400' : item.color}`} />
                    <span className="font-medium text-xs md:text-sm">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="flex-shrink-0 p-3 md:p-4 border-t border-slate-700/50 space-y-2">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors text-xs md:text-sm"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span>Back to Main Site</span>
            </button>
            <button
              onClick={() => console.log('Logout clicked')}
              className="w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-xs md:text-sm"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-72 md:ml-64' : 'ml-0'}`}>
        {/* Top Header */}
        <header className="bg-slate-900/20 backdrop-blur-xl border-b border-slate-700/50 px-4 md:px-6 py-3 md:py-4 relative z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-slate-400 hover:text-slate-200 p-1 md:p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-100 capitalize">
                  {currentPage.replace('-', ' ')}
                </h1>
                <p className="text-slate-400 text-xs md:text-sm">CodeCase Detective Academy - Content Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-2 bg-green-500/20 text-green-400 rounded-lg text-xs md:text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="hidden md:inline">System Online</span>
              </div>
              <div className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 md:py-2 bg-blue-500/20 text-blue-400 rounded-lg text-xs md:text-sm">
                <Database className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">Firebase Connected</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SimpleCMSLayout;
