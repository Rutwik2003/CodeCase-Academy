import React, { useState, useEffect } from 'react';
import { Search, Badge, Terminal, BookOpen, Menu, X, Home, User, LogOut, Star, Users, ChevronDown, Shield, HelpCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useInteractiveTour } from '../contexts/InteractiveTourContext';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyLoginModal } from './DailyLoginModal';
import { EnhancedReferralModal } from './EnhancedReferralModal';
import { AudioWaveform } from './AudioWaveform';
import { isAdminEmail } from '../cms/utils/adminAuth';
import { logger, LogCategory } from '../utils/logger';
import { formatPoints } from '../utils/formatters';

interface HeaderProps {
  onLearnClick?: () => void;
  onHomeClick?: () => void;
  onAuthClick?: () => void;
  onProfileClick?: () => void;
  availableHints?: number; // Add hints prop
}

export const Header: React.FC<HeaderProps> = ({ 
  onLearnClick, 
  onHomeClick,
  onAuthClick,
  onProfileClick,
  availableHints = 0 // Default to 0 hints
}) => {
  const { currentUser, userData, logout } = useAuth();
  const { startTour } = useInteractiveTour();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDailyLoginModalOpen, setIsDailyLoginModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Listen for custom events from ProfilePage to open modals
  useEffect(() => {
    const handleOpenDailyLogin = () => setIsDailyLoginModalOpen(true);
    const handleOpenReferral = () => setIsReferralModalOpen(true);

    window.addEventListener('openDailyLoginModal', handleOpenDailyLogin);
    window.addEventListener('openReferralModal', handleOpenReferral);

    return () => {
      window.removeEventListener('openDailyLoginModal', handleOpenDailyLogin);
      window.removeEventListener('openReferralModal', handleOpenReferral);
    };
  }, []);

  // Determine user's experience level and appropriate help message
  const getUserHelpStatus = () => {
    try {
      if (!currentUser) {
        // Guest user
        const hasSeenGuestTour = localStorage.getItem('interactive_tour_guest_completed');
        return hasSeenGuestTour 
          ? { type: 'guest-seen', message: 'Replay Quick Tour', completed: true }
          : { type: 'guest-new', message: 'Take a Quick Tour', completed: false };
      }
      
      if (!userData) return { type: 'new', message: 'Take a Quick Tour', completed: false };
      
      const completedCases = userData.completedCases?.length || 0;
      const hasSeenTour = localStorage.getItem(`interactive_tour_completed_${currentUser.uid}`);
      const hasSeenAdvancedTour = localStorage.getItem(`interactive_tour_advanced_completed_${currentUser.uid}`);
      
      if (completedCases === 0 && !hasSeenTour) {
        return { type: 'new', message: 'Start Interactive Tour', completed: false };
      } else if (completedCases > 0 && completedCases < 3) {
        return { 
          type: 'beginner', 
          message: hasSeenTour ? 'Replay Tour or Get Help' : 'Need Help? Tour Available',
          completed: !!hasSeenTour
        };
      } else if (completedCases >= 3) {
        return { 
          type: 'experienced', 
          message: hasSeenAdvancedTour ? 'Replay Advanced Tour' : 'Try Advanced Tour',
          completed: !!hasSeenAdvancedTour
        };
      } else {
        return { 
          type: 'intermediate', 
          message: hasSeenTour ? 'Replay Tour or Get Help' : 'Tour Available',
          completed: !!hasSeenTour
        };
      }
    } catch (error) {
      logger.error('Error in getUserHelpStatus:', error, LogCategory.SYSTEM);
      return { type: 'new', message: 'Take a Quick Tour', completed: false };
    }
  };
  
  const helpStatus = getUserHelpStatus();
  
  // Ensure completed property exists for safety
  const safeHelpStatus = {
    ...helpStatus,
    completed: helpStatus.completed || false
  };
  
  const handleHelpClick = () => {
    if (!currentUser) {
      // Guest user - force restart to allow replay
      startTour('onboardingGuest', true);
    } else if (safeHelpStatus.type === 'experienced') {
      // Show advanced tour for experienced users - force restart to allow replay
      startTour('advanced', true);
    } else {
      // Show basic onboarding tour - force restart to allow replay
      startTour('onboarding', true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleMobileNavClick = (action?: () => void) => {
    if (action) action();
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Detective Command Bar Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 backdrop-blur-xl border-b border-slate-700/50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-blue-500/5"></div>
      
      <div className="relative z-10 max-w-full mx-auto px-3 sm:px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between w-full gap-2">
          {/* CodeCase Icon + Title - Left Side */}
          <div className="flex items-center space-x-2 flex-shrink-0 min-w-0">
            <motion.div 
              className="flex items-center cursor-pointer group" 
              onClick={handleLogoClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <motion.div
                  className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-2 md:p-3"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Search className="w-6 h-6 md:w-8 md:h-8 text-amber-400 drop-shadow-lg" />
                </motion.div>
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
                <Terminal className="w-4 h-4 md:w-5 md:h-5 text-blue-400 absolute -bottom-1 -right-1 drop-shadow-lg" />
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col cursor-pointer group hidden md:flex" 
              onClick={handleLogoClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h1 className="text-lg xl:text-2xl font-bold text-slate-100 group-hover:text-amber-100 transition-colors">
                Code<span className="text-amber-400">Case</span>
              </h1>
              <p className="text-xs xl:text-sm text-slate-400 font-mono uppercase tracking-wider">Detective Academy</p>
            </motion.div>

            {/* Audio Waveform - Homepage Background Music */}
            <div className="ml-4 hidden lg:flex">
              <AudioWaveform className="detective-audio-control" />
            </div>
          </div>
          
          {/* Center Navigation Menu - Hide on medium screens to save space */}
          <nav className="hidden xl:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center space-x-3">
              <motion.button 
                onClick={onHomeClick}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 text-slate-300 hover:text-amber-300 transition-colors font-medium px-6 py-3 rounded-lg hover:bg-slate-800/30 border border-transparent hover:border-amber-400/20 whitespace-nowrap"
              >
                <Home className="w-4 h-4 flex-shrink-0" />
                <span>Command Center</span>
              </motion.button>
              <motion.button 
                onClick={() => scrollToSection('cases')}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 text-slate-300 hover:text-amber-300 transition-colors font-medium px-6 py-3 rounded-lg hover:bg-slate-800/30 border border-transparent hover:border-amber-400/20 whitespace-nowrap"
              >
                <Terminal className="w-4 h-4" />
                <span>Active Cases</span>
              </motion.button>
              <motion.button 
                onClick={onLearnClick}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 text-slate-300 hover:text-amber-300 transition-colors font-medium px-6 py-3 rounded-lg hover:bg-slate-800/30 border border-transparent hover:border-amber-400/20 whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4" />
                <span>Training</span>
              </motion.button>
              
              {/* Admin Access - Only show for authorized admins (Desktop only) */}
              {currentUser && isAdminEmail(currentUser.email || '') && (
                <motion.button 
                  onClick={() => window.open('/admin', '_blank')}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex items-center justify-center space-x-2 text-slate-300 hover:text-red-300 transition-colors font-medium px-6 py-3 rounded-lg hover:bg-red-800/20 border border-transparent hover:border-red-400/20 whitespace-nowrap"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </motion.button>
              )}
            </div>
          </nav>
          
          {/* Right Side - Compact responsive layout */}
          <div className="hidden md:flex items-center space-x-1 flex-shrink-0 min-w-0 justify-end">
            {/* Detective Status Panel - Only show if user is logged in */}
            {currentUser && (
              <div className="flex items-center space-x-1 detective-stats-panel" id="detective-stats-panel">
                {/* Investigation Points */}
                <motion.div 
                  className="flex items-center justify-center space-x-1 bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg w-[60px] xl:w-[80px] h-[36px] xl:h-[40px] detective-stats"
                  whileHover={{ scale: 1.05, y: -1 }}
                  title="Investigation Points - Earn by completing cases"
                >
                  <Star className="w-3 h-3 xl:w-4 xl:h-4 text-amber-400" />
                  <span className="text-xs xl:text-sm font-mono text-slate-300">
                    {formatPoints(userData?.totalPoints || 0)}
                  </span>
                </motion.div>

                {/* Available Hints */}
                <motion.div 
                  className="flex items-center justify-center space-x-1 bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-lg w-[50px] xl:w-[60px] h-[36px] xl:h-[40px] detective-stats"
                  whileHover={{ scale: 1.05, y: -1 }}
                  title="Available Hints - Use wisely during investigations"
                >
                  <Badge className="w-3 h-3 xl:w-4 xl:h-4 text-blue-400" />
                  <span className="text-xs xl:text-sm font-mono text-slate-300">
                    {userData?.hints || '0'}
                  </span>
                </motion.div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 pl-1 xl:pl-2 border-l border-slate-600/30">
              {/* Dynamic Help Tour Button - Show for all users */}
              <motion.button
                onClick={handleHelpClick}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center backdrop-blur-sm border transition-all rounded-lg w-[40px] xl:w-[55px] h-[36px] xl:h-[40px] ${
                  safeHelpStatus.type === 'experienced' 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 hover:border-green-400/50' 
                    : safeHelpStatus.type === 'new' || safeHelpStatus.type === 'guest-new'
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 hover:border-blue-400/50 animate-pulse'
                    : safeHelpStatus.type === 'guest-seen'
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 hover:border-purple-400/50'
                    : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30 hover:border-yellow-400/50'
                }`}
                title={`${safeHelpStatus.message} - Interactive Guide`}
              >
                {safeHelpStatus.completed ? (
                  <div className="relative">
                    <HelpCircle className={`w-3 h-3 xl:w-4 xl:h-4 ${
                      safeHelpStatus.type === 'experienced' ? 'text-green-400'
                      : safeHelpStatus.type === 'guest-seen' ? 'text-purple-400' 
                      : 'text-yellow-400'
                    }`} />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-slate-800" />
                  </div>
                ) : safeHelpStatus.type === 'experienced' ? (
                  <CheckCircle className="w-3 h-3 xl:w-4 xl:h-4 text-green-400" />
                ) : (
                  <HelpCircle className={`w-3 h-3 xl:w-4 xl:h-4 ${
                    safeHelpStatus.type === 'new' || safeHelpStatus.type === 'guest-new' ? 'text-blue-400' 
                    : safeHelpStatus.type === 'guest-seen' ? 'text-purple-400'
                    : 'text-yellow-400'
                  }`} />
                )}
              </motion.button>
              
              {/* Daily Login Streak Button */}
              {currentUser && (
                <motion.button
                  onClick={() => setIsDailyLoginModalOpen(true)}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 hover:border-orange-400/50 transition-all rounded-lg w-[55px] xl:w-[65px] h-[36px] xl:h-[40px]"
                  title="Daily Login Streak"
                >
                  <span className="text-sm xl:text-base">🎯</span>
                  <span className="text-xs xl:text-sm font-mono text-orange-300">
                    {userData?.loginStreak || '0'}
                  </span>
                </motion.button>
              )}

              {/* Referral Code Button */}
              {currentUser && (
                <motion.button
                  onClick={() => setIsReferralModalOpen(true)}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/50 transition-all rounded-lg w-[40px] xl:w-[55px] h-[36px] xl:h-[40px]"
                  title="Use Referral Code"
                >
                  <Users className="w-3 h-3 xl:w-4 xl:h-4 text-purple-400" />
                </motion.button>
              )}
            </div>

            {/* User Profile - Compact */}
            <div className="flex items-center border-l border-slate-600/30 pl-1 xl:pl-2">
              {currentUser ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 150)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="profile-button flex items-center space-x-1 hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-amber-400/30 backdrop-blur-sm rounded-lg w-[100px] xl:w-[130px] h-[36px] xl:h-[40px] px-2"
                    title="View Detective Profile and Achievements"
                    id="detective-profile-button"
                  >
                    <div className="w-6 h-6 xl:w-7 xl:h-7 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center border border-amber-400/30 flex-shrink-0">
                      <User className="w-3 h-3 xl:w-4 xl:h-4 text-amber-400" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <span className="text-xs xl:text-sm font-medium text-slate-100 block truncate">
                        {(userData?.displayName || currentUser.displayName || 'test').split(' ')[0]}
                      </span>
                    </div>
                    <ChevronDown className={`w-3 h-3 xl:w-4 xl:h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                
                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="py-2">
                        <motion.button
                          onClick={() => {
                            onProfileClick?.();
                            setIsProfileDropdownOpen(false);
                          }}
                          whileHover={{ backgroundColor: 'rgba(148, 163, 184, 0.1)' }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-slate-300 hover:text-amber-300 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>View Profile</span>
                        </motion.button>
                        
                        <div className="h-px bg-slate-600/30 mx-2"></div>
                        
                        <motion.button
                          onClick={() => {
                            logout();
                            setIsProfileDropdownOpen(false);
                          }}
                          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={onAuthClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="auth-button flex items-center justify-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all w-[80px] xl:w-[120px] h-[36px] xl:h-[40px]"
                  id="auth-signin-button"
                  title="Sign In or Register"
                >
                  <User className="w-3 h-3 xl:w-4 xl:h-4" />
                  <span className="text-xs xl:text-sm">Sign In</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              whileTap={{ scale: 0.95 }}
              className="theme-text-primary focus:outline-none p-2 theme-hover-bg rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu with animations */}
        <motion.div
          initial={false}
          animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-2 space-y-2 theme-border-t mt-4">
            {onHomeClick && (
              <button 
                onClick={() => handleMobileNavClick(onHomeClick)}
                className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
            )}
            <button 
              onClick={() => handleMobileNavClick(onHomeClick)}
              className="block w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
            >
              Cases
            </button>
            <button 
              onClick={() => handleMobileNavClick(onLearnClick)}
              className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
            >
              <BookOpen className="w-4 h-4" />
              <span>Learn</span>
            </button>

            {/* Mobile Audio Controls */}
            <div className="flex items-center justify-between w-full py-3 px-2">
              <span className="theme-text-secondary text-sm">Background Music</span>
              <AudioWaveform className="detective-audio-control-mobile" />
            </div>
            
            {/* Mobile Dynamic Help Tour Button */}
            {currentUser && (
              <button 
                onClick={() => {
                  handleMobileNavClick();
                  handleHelpClick();
                }}
                className={`flex items-center space-x-2 w-full text-left transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover ${
                  safeHelpStatus.type === 'experienced' 
                    ? 'text-green-400 hover:text-green-300' 
                    : safeHelpStatus.type === 'new'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-yellow-400 hover:text-yellow-300'
                }`}
              >
                {safeHelpStatus.type === 'experienced' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <HelpCircle className="w-4 h-4" />
                )}
                <span>{safeHelpStatus.message}</span>
              </button>
            )}
            
            {/* Mobile Profile Button */}
            {currentUser && (
              <button 
                onClick={() => handleMobileNavClick(onProfileClick)}
                className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            )}
            
            {/* Mobile Auth Button */}
            {!currentUser && (
              <button 
                onClick={() => handleMobileNavClick(onAuthClick)}
                className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
            
            {/* Mobile Daily Login Button */}
            {currentUser && (
              <button 
                onClick={() => {
                  setIsDailyLoginModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
              >
                <span className="text-lg">🎯</span>
                <span>Daily Login ({userData?.loginStreak || 0} days)</span>
              </button>
            )}
            
            {/* Mobile Referral Button */}
            {currentUser && (
              <button 
                onClick={() => {
                  setIsReferralModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left theme-text-secondary hover:theme-accent-text transition-colors py-3 px-2 rounded-lg hover:theme-bg-hover"
              >
                <Users className="w-4 h-4" />
                <span>Use Referral Code</span>
              </button>
            )}
            
            {/* Mobile Status Display - Only show if user is logged in */}
            {currentUser && (
              <div className="flex items-center justify-center pt-2 theme-border-t">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-slate-300">{formatPoints(userData?.totalPoints || 0)} Points</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-slate-300">{userData?.hints || 0} Hints</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile Logout Button - At Bottom */}
            {currentUser && (
              <div className="pt-4 mt-4 border-t border-slate-600/30">
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left text-red-400 hover:text-red-300 transition-colors py-3 px-2 rounded-lg hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Modals */}
      <DailyLoginModal 
        isOpen={isDailyLoginModalOpen}
        onClose={() => setIsDailyLoginModalOpen(false)}
      />
      
      <EnhancedReferralModal 
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </header>
  );
};