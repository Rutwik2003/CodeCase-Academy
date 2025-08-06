import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Calendar, Trophy, Edit3, Save, X, Star, Lightbulb, Settings, Camera, Shield, Award, Target, Lock, Unlock, Eye, EyeOff, FileText, Code, CheckCircle, Clock, Zap, Crown, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { logger, LogCategory } from '../utils/logger';
import { showConfirm } from './CustomAlert';

interface ProfilePageProps {
  onBack: () => void;
  onNavigateToEvidence?: () => void;
}

interface Evidence {
  id: string;
  caseId: string;
  title: string;
  description: string;
  type: 'code' | 'document' | 'image' | 'clue';
  content: string;
  discoveredAt: Date;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onNavigateToEvidence }) => {
  const { currentUser, userData, updateUserData, unlockAchievement, resetAllUserAchievements } = useAuth();
  
  // Profile editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: userData?.displayName || currentUser?.displayName || '',
  });

  // Security/Settings states
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Evidence/Achievement states
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'evidence' | 'stats'>('overview');
  const [evidenceData, setEvidenceData] = useState<Evidence[]>([]);

  // Auto-unlock achievements based on current user data
  const checkAndUnlockAchievements = async () => {
    if (!userData || !unlockAchievement) return;

    const achievementChecks = [
      // Case completion achievements
      { id: 'first-detective', condition: (userData?.completedCases?.length || 0) > 0 },
      { id: 'tutorial-master', condition: userData?.completedCases?.includes('case-vanishing-blogger') || false },
      { id: 'vanishing-blogger-solved', condition: userData?.completedCases?.includes('case-vanishing-blogger') || false },
      { id: 'social-media-investigator', condition: userData?.completedCases?.includes('case-social-media-stalker') || false },
      { id: 'corporate-sleuth', condition: userData?.completedCases?.includes('case-corporate-sabotage') || false },
      { id: 'dating-app-detective', condition: userData?.completedCases?.includes('case-dating-app-disaster') || false },
      { id: 'e-commerce-expert', condition: userData?.completedCases?.includes('case-ecommerce-fraud') || false },
      { id: 'gaming-guru', condition: userData?.completedCases?.includes('case-gaming-platform-hack') || false },
      
      // Milestone achievements  
      { id: 'detective-expert', condition: (userData?.completedCases?.length || 0) >= 3 },
      { id: 'case-closer', condition: (userData?.completedCases?.length || 0) >= 5 },
      { id: 'master-detective', condition: (userData?.completedCases?.length || 0) >= 6 },
      
      // Level and points achievements
      { id: 'code-buster-pro', condition: (userData?.level || 0) >= 5 },
      { id: 'elite-investigator', condition: (userData?.level || 0) >= 10 },
      { id: 'point-collector', condition: (userData?.totalPoints || 0) >= 5000 },
      { id: 'veteran-detective', condition: (userData?.totalPoints || 0) >= 10000 },
      
      // Skill achievements
      { id: 'hint-master', condition: (userData?.hints || 0) >= 10 },
      { id: 'evidence-collector', condition: (userData?.evidence?.length || evidenceData.length) >= 10 },
      { id: 'speed-demon', condition: (userData?.statistics?.averageCaseTime || Infinity) < 600 },
      { id: 'no-hints-hero', condition: (userData?.statistics?.hintsUsed || 0) === 0 && (userData?.completedCases?.length || 0) > 0 },
      { id: 'streak-master', condition: (userData?.statistics?.currentStreak || 0) >= 3 }
    ];

    for (const check of achievementChecks) {
      if (check.condition && !userData.achievements?.includes(check.id)) {
        try {
          await unlockAchievement(check.id);
          toast.success(`🎉 Achievement Unlocked: ${achievements.find(a => a.id === check.id)?.name}!`);
        } catch (error) {
          // logger.error('Error unlocking achievement:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
        }
      }
    }
  };

  // Check achievements when userData changes
  useEffect(() => {
    checkAndUnlockAchievements();
  }, [userData?.completedCases, userData?.level, userData?.totalPoints, userData?.hints, evidenceData.length, userData?.achievements]);

  // Load evidence data from completed cases
  useEffect(() => {
    if (userData?.completedCases && userData?.evidence) {
      // Use actual evidence from user data
      setEvidenceData(userData.evidence);
    } else if (userData?.completedCases) {
      // Create dynamic evidence based on completed cases
      const caseEvidenceMap: Record<string, { title: string; evidenceItems: Omit<Evidence, 'id' | 'caseId' | 'discoveredAt'>[] }> = {
        'case-vanishing-blogger': {
          title: 'The Vanishing Blogger',
          evidenceItems: [
            {
              title: 'Corrupted Blog HTML',
              description: 'Found broken HTML tags that were hiding Sam\'s last message',
              type: 'code',
              content: '<h2> tags were preventing proper display of the blog content',
              importance: 'high'
            },
            {
              title: 'Hidden CSS Clue',
              description: 'Discovered a secret message hidden in the CSS code',
              type: 'clue',
              content: 'Sam left breadcrumbs about checking backup files on old server',
              importance: 'critical'
            },
            {
              title: 'Blog Backup Files',
              description: 'Located Sam\'s backup files with crucial timeline information',
              type: 'document',
              content: 'Backup files show unusual activity pattern before disappearance',
              importance: 'medium'
            }
          ]
        },
        'case-social-media-stalker': {
          title: 'Social Media Stalker',
          evidenceItems: [
            {
              title: 'Malicious Script Code',
              description: 'Found hidden JavaScript code used for tracking users',
              type: 'code',
              content: 'Tracking script embedded in profile pages',
              importance: 'critical'
            },
            {
              title: 'User Data Logs',
              description: 'Discovered logs of unauthorized data collection',
              type: 'document',
              content: 'Log files show systematic harvesting of personal information',
              importance: 'high'
            },
            {
              title: 'Stalker\'s Profile Template',
              description: 'Template used to create fake profiles for stalking',
              type: 'code',
              content: 'CSS styling to mimic legitimate user profiles',
              importance: 'medium'
            }
          ]
        },
        'case-corporate-sabotage': {
          title: 'Corporate Sabotage',
          evidenceItems: [
            {
              title: 'Sabotaged Website Code',
              description: 'Identified malicious code injected into company website',
              type: 'code',
              content: 'Hidden CSS rules causing layout failures during presentation',
              importance: 'critical'
            },
            {
              title: 'Employee Access Logs',
              description: 'Security logs showing unauthorized access patterns',
              type: 'document',
              content: 'Logs reveal inside job with specific timing patterns',
              importance: 'high'
            },
            {
              title: 'Competitor Analysis',
              description: 'Evidence linking sabotage to competitor company',
              type: 'clue',
              content: 'Code signatures match previous attacks on industry rivals',
              importance: 'high'
            }
          ]
        },
        'case-dating-app-disaster': {
          title: 'Dating App Disaster',
          evidenceItems: [
            {
              title: 'Profile Manipulation Code',
              description: 'Code used to alter user profiles and create fake matches',
              type: 'code',
              content: 'JavaScript functions for profile data manipulation',
              importance: 'critical'
            },
            {
              title: 'Fake Profile Database',
              description: 'Database of artificially created dating profiles',
              type: 'document',
              content: 'Thousands of fake profiles with stolen photos and information',
              importance: 'high'
            },
            {
              title: 'Payment Fraud Evidence',
              description: 'Evidence of premium subscription fraud scheme',
              type: 'clue',
              content: 'Automatic billing triggered by fake premium feature interactions',
              importance: 'critical'
            }
          ]
        },
        'case-ecommerce-fraud': {
          title: 'E-Commerce Fraud',
          evidenceItems: [
            {
              title: 'Price Manipulation Script',
              description: 'Hidden code altering product prices at checkout',
              type: 'code',
              content: 'JavaScript code modifying DOM elements during payment process',
              importance: 'critical'
            },
            {
              title: 'Customer Complaint Records',
              description: 'Pattern of customer complaints about pricing discrepancies',
              type: 'document',
              content: 'Systematic overcharging affecting hundreds of customers',
              importance: 'high'
            },
            {
              title: 'Payment Gateway Logs',
              description: 'Server logs showing unauthorized price modifications',
              type: 'document',
              content: 'Transaction logs prove systematic price inflation',
              importance: 'high'
            }
          ]
        },
        'case-gaming-platform-hack': {
          title: 'Gaming Platform Hack',
          evidenceItems: [
            {
              title: 'Exploit Code',
              description: 'Code used to exploit gaming platform vulnerabilities',
              type: 'code',
              content: 'CSS and JavaScript exploits for unauthorized access',
              importance: 'critical'
            },
            {
              title: 'Stolen Account Data',
              description: 'Database of compromised user accounts and credentials',
              type: 'document',
              content: 'Personal information and payment details of affected users',
              importance: 'critical'
            },
            {
              title: 'Hacker Communication Logs',
              description: 'Chat logs between hackers planning the attack',
              type: 'clue',
              content: 'Messages reveal organized effort and future targets',
              importance: 'high'
            }
          ]
        }
      };

      const mockEvidence: Evidence[] = [];
      
      userData.completedCases.forEach((caseId) => {
        const caseInfo = caseEvidenceMap[caseId];
        if (caseInfo) {
          caseInfo.evidenceItems.forEach((item, itemIndex) => {
            mockEvidence.push({
              id: `evidence-${caseId}-${itemIndex}`,
              caseId,
              title: item.title,
              description: item.description,
              type: item.type,
              content: item.content,
              discoveredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
              importance: item.importance
            });
          });
        }
      });
      
      setEvidenceData(mockEvidence);
    }
  }, [userData?.completedCases, userData?.evidence]);

  const handleSave = async () => {
    try {
      await updateUserData({ displayName: editData.displayName });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      // logger.error('Error updating profile:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (!currentUser) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordData.newPassword);
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowSecurityModal(false);
      toast.success('Password updated successfully!');
    } catch (error: any) {
      // logger.error('Error updating password:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else {
        toast.error('Failed to update password');
      }
    }
  };

  const handleEmailChange = async () => {
    if (!currentUser) return;

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        emailData.password
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updateEmail(currentUser, emailData.newEmail);
      
      setEmailData({ newEmail: '', password: '' });
      toast.success('Email updated successfully!');
    } catch (error: any) {
      // logger.error('Error updating email:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      if (error.code === 'auth/wrong-password') {
        toast.error('Password is incorrect');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already in use');
      } else {
        toast.error('Failed to update email');
      }
    }
  };

  const handleResetAllAchievements = async () => {
    const confirmed = await showConfirm(
      'This will reset ALL achievements for ALL registered users. This action cannot be undone. Are you sure?',
      {
        title: '⚠️ ADMIN ACTION',
        type: 'error',
        confirmText: 'Reset All',
        cancelText: 'Cancel'
      }
    );
    
    if (!confirmed) return;

    try {
      toast.loading('Resetting achievements for all users...', { id: 'reset-achievements' });
      
      const result = await resetAllUserAchievements();
      
      if (result?.success) {
        toast.success(
          `Successfully reset achievements for ${result.updatedUsers} users!`, 
          { id: 'reset-achievements' }
        );
      } else {
        toast.error('Failed to reset achievements', { id: 'reset-achievements' });
      }
    } catch (error) {
      // logger.error('Error resetting achievements:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      toast.error('Error resetting achievements. Check console for details.', { id: 'reset-achievements' });
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const achievements = [
    // Beginner Achievements
    { 
      id: 'first-detective', 
      name: 'First Detective', 
      icon: '🕵️', 
      description: 'Started your first case', 
      unlocked: (userData?.completedCases?.length || 0) > 0,
      rarity: 'common',
      points: 50,
      category: 'Getting Started'
    },
    { 
      id: 'tutorial-master', 
      name: 'Tutorial Master', 
      icon: '🎓', 
      description: 'Completed the tutorial case', 
      unlocked: userData?.completedCases?.includes('case-vanishing-blogger') || false,
      rarity: 'common',
      points: 100,
      category: 'Getting Started'
    },
    { 
      id: 'code-fixer', 
      name: 'Code Fixer', 
      icon: '🔧', 
      description: 'Fixed your first broken code', 
      unlocked: (userData?.hints || 0) > 5,
      rarity: 'common',
      points: 100,
      category: 'Skills'
    },

    // Case-Specific Achievements
    { 
      id: 'vanishing-blogger-solved', 
      name: 'Vanishing Blogger Detective', 
      icon: '📰', 
      description: 'Solved the Vanishing Blogger case', 
      unlocked: userData?.completedCases?.includes('case-vanishing-blogger') || false,
      rarity: 'common',
      points: 200,
      category: 'Cases'
    },
    { 
      id: 'social-media-investigator', 
      name: 'Social Media Investigator', 
      icon: '📱', 
      description: 'Solved the Social Media Stalker case', 
      unlocked: userData?.completedCases?.includes('case-social-media-stalker') || false,
      rarity: 'uncommon',
      points: 300,
      category: 'Cases'
    },
    { 
      id: 'corporate-sleuth', 
      name: 'Corporate Sleuth', 
      icon: '🏢', 
      description: 'Solved the Corporate Sabotage case', 
      unlocked: userData?.completedCases?.includes('case-corporate-sabotage') || false,
      rarity: 'uncommon',
      points: 400,
      category: 'Cases'
    },
    { 
      id: 'dating-app-detective', 
      name: 'Dating App Detective', 
      icon: '💕', 
      description: 'Solved the Dating App Disaster case', 
      unlocked: userData?.completedCases?.includes('case-dating-app-disaster') || false,
      rarity: 'rare',
      points: 500,
      category: 'Cases'
    },
    { 
      id: 'e-commerce-expert', 
      name: 'E-Commerce Expert', 
      icon: '🛒', 
      description: 'Solved the E-Commerce Fraud case', 
      unlocked: userData?.completedCases?.includes('case-ecommerce-fraud') || false,
      rarity: 'rare',
      points: 600,
      category: 'Cases'
    },
    { 
      id: 'gaming-guru', 
      name: 'Gaming Guru', 
      icon: '🎮', 
      description: 'Solved the Gaming Platform Hack case', 
      unlocked: userData?.completedCases?.includes('case-gaming-platform-hack') || false,
      rarity: 'epic',
      points: 750,
      category: 'Cases'
    },

    // Milestone Achievements
    { 
      id: 'hint-master', 
      name: 'Hint Master', 
      icon: '💡', 
      description: 'Earned 10 hints', 
      unlocked: (userData?.hints || 0) >= 10,
      rarity: 'uncommon',
      points: 200,
      category: 'Milestones'
    },
    { 
      id: 'detective-expert', 
      name: 'Detective Expert', 
      icon: '🏆', 
      description: 'Completed 3 cases', 
      unlocked: (userData?.completedCases?.length || 0) >= 3,
      rarity: 'rare',
      points: 500,
      category: 'Milestones'
    },
    { 
      id: 'case-closer', 
      name: 'Case Closer', 
      icon: '📁', 
      description: 'Completed 5 cases', 
      unlocked: (userData?.completedCases?.length || 0) >= 5,
      rarity: 'rare',
      points: 1000,
      category: 'Milestones'
    },
    { 
      id: 'master-detective', 
      name: 'Master Detective', 
      icon: '👑', 
      description: 'Solved all available cases', 
      unlocked: (userData?.completedCases?.length || 0) >= 6,
      rarity: 'legendary',
      points: 2000,
      category: 'Milestones'
    },

    // Skill-Based Achievements
    { 
      id: 'evidence-collector', 
      name: 'Evidence Collector', 
      icon: '📋', 
      description: 'Collected 10 pieces of evidence', 
      unlocked: (userData?.evidence?.length || evidenceData.length) >= 10,
      rarity: 'rare',
      points: 750,
      category: 'Skills'
    },
    { 
      id: 'speed-demon', 
      name: 'Speed Demon', 
      icon: '⚡', 
      description: 'Completed a case in under 10 minutes', 
      unlocked: (userData?.statistics?.averageCaseTime || Infinity) < 600,
      rarity: 'epic',
      points: 1500,
      category: 'Skills'
    },
    { 
      id: 'no-hints-hero', 
      name: 'No Hints Hero', 
      icon: '🚫', 
      description: 'Completed a case without using hints', 
      unlocked: (userData?.statistics?.hintsUsed || 0) === 0 && (userData?.completedCases?.length || 0) > 0,
      rarity: 'epic',
      points: 1200,
      category: 'Skills'
    },
    { 
      id: 'streak-master', 
      name: 'Streak Master', 
      icon: '🔥', 
      description: 'Completed 3 cases in a row', 
      unlocked: (userData?.statistics?.currentStreak || 0) >= 3,
      rarity: 'rare',
      points: 800,
      category: 'Skills'
    },

    // Level-Based Achievements
    { 
      id: 'code-buster-pro', 
      name: 'CodeCase Pro',
      icon: '⭐', 
      description: 'Reached level 5', 
      unlocked: (userData?.level || 0) >= 5,
      rarity: 'epic',
      points: 1000,
      category: 'Progression'
    },
    { 
      id: 'elite-investigator', 
      name: 'Elite Investigator', 
      icon: '�', 
      description: 'Reached level 10', 
      unlocked: (userData?.level || 0) >= 10,
      rarity: 'legendary',
      points: 2500,
      category: 'Progression'
    },
    { 
      id: 'point-collector', 
      name: 'Point Collector', 
      icon: '🎯', 
      description: 'Earned 5000 total points', 
      unlocked: (userData?.totalPoints || 0) >= 5000,
      rarity: 'rare',
      points: 500,
      category: 'Progression'
    },
    { 
      id: 'veteran-detective', 
      name: 'Veteran Detective', 
      icon: '🎖️', 
      description: 'Earned 10000 total points', 
      unlocked: (userData?.totalPoints || 0) >= 10000,
      rarity: 'epic',
      points: 1000,
      category: 'Progression'
    },

    // Special Achievements
    { 
      id: 'perfect-score', 
      name: 'Perfect Score', 
      icon: '💯', 
      description: 'Completed a case with maximum points', 
      unlocked: (userData?.completedCases?.length || 0) > 0, // This would need more specific tracking
      rarity: 'legendary',
      points: 3000,
      category: 'Special'
    },
    { 
      id: 'night-owl', 
      name: 'Night Owl Detective', 
      icon: '🦉', 
      description: 'Completed a case after midnight', 
      unlocked: false, // Would need time tracking
      rarity: 'uncommon',
      points: 250,
      category: 'Special'
    },
    { 
      id: 'early-bird', 
      name: 'Early Bird Detective', 
      icon: '🌅', 
      description: 'Completed a case before 6 AM', 
      unlocked: false, // Would need time tracking
      rarity: 'uncommon',
      points: 250,
      category: 'Special'
    }
  ];

  const getCaseTitle = (caseId: string): string => {
    const caseTitles: Record<string, string> = {
      'case-vanishing-blogger': 'The Vanishing Blogger',
      'case-social-media-stalker': 'Social Media Stalker',
      'case-corporate-sabotage': 'Corporate Sabotage',
      'case-dating-app-disaster': 'Dating App Disaster',
      'case-ecommerce-fraud': 'E-Commerce Fraud',
      'case-gaming-platform-hack': 'Gaming Platform Hack'
    };
    return caseTitles[caseId] || caseId;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-slate-600 bg-slate-700/30 text-slate-300';
      case 'uncommon': return 'border-green-500/50 bg-green-500/10 text-green-300';
      case 'rare': return 'border-blue-500/50 bg-blue-500/10 text-blue-300';
      case 'epic': return 'border-purple-500/50 bg-purple-500/10 text-purple-300';
      case 'legendary': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300';
      default: return 'border-slate-600 bg-slate-700/30 text-slate-300';
    }
  };

  const getEvidenceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'code': return <Code className="w-4 h-4 text-amber-500" />;
      case 'document': return <FileText className="w-4 h-4 text-amber-500" />;
      case 'clue': return <Star className="w-4 h-4 text-amber-500" />;
      default: return <FileText className="w-4 h-4 text-amber-500" />;
    }
  };

  const getImportanceColor = (importance: Evidence['importance']) => {
    switch (importance) {
      case 'low': return 'bg-slate-600/50 text-slate-300';
      case 'medium': return 'bg-blue-500/20 text-blue-300';
      case 'high': return 'bg-orange-500/20 text-orange-300';
      case 'critical': return 'bg-red-500/20 text-red-300';
      default: return 'bg-slate-600/50 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-amber-500/20 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-amber-500" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-amber-500">Detective Profile</h1>
                  <p className="text-sm text-slate-300">Manage your detective career</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowProfilePictureModal(true)}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-amber-500 rounded-lg transition-colors"
                title="Change Profile Picture"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSecurityModal(true)}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-amber-500 rounded-lg transition-colors"
                title="Security Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetAllAchievements}
                className="p-2 bg-red-700 hover:bg-red-600 text-red-400 rounded-lg transition-colors border border-red-600/50"
                title="ADMIN: Reset All User Achievements"
              >
                <Trophy className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4 bg-slate-700/50 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'evidence', label: 'Evidence', icon: FileText },
              { id: 'stats', label: 'Statistics', icon: Target }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  selectedTab === tab.id
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                    <span className="text-3xl font-bold text-white">
                      {(userData?.displayName || currentUser?.displayName || 'U').charAt(0).toUpperCase()}
                    </span>
                    <button
                      onClick={() => setShowProfilePictureModal(true)}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Camera className="w-4 h-4 text-amber-500" />
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editData.displayName}
                        onChange={(e) => setEditData({ displayName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400"
                        placeholder="Display Name"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        {userData?.displayName || currentUser?.displayName || 'Detective'}
                      </h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-amber-500 hover:text-amber-400 text-sm flex items-center space-x-1 mx-auto"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Mail className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">{currentUser?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">Joined {formatDate(userData?.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">Level {userData?.level || 1}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Shield className="w-5 h-5 text-amber-500" />
                    <span className="text-sm">Rank: {(userData?.level || 0) >= 5 ? 'Expert Detective' : 'Detective'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 text-sm font-bold">🕵️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Cases Solved</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">{userData?.completedCases?.length || 0}</p>
                  <p className="text-sm text-slate-400 mt-1">Detective missions completed</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-amber-400 text-sm font-bold">💡</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Hints Available</h3>
                  </div>
                  <p className="text-3xl font-bold text-amber-400">{userData?.hints || 0}</p>
                  <p className="text-sm text-slate-400 mt-1">Ready for use</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 text-sm font-bold">⭐</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Total Points</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-400">{userData?.totalPoints || 0}</p>
                  <p className="text-sm text-slate-400 mt-1">Experience earned</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedTab('evidence')}
                    className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                  >
                    <FileText className="w-6 h-6 text-amber-500" />
                    <div className="text-left">
                      <h3 className="font-semibold text-white">View Evidence</h3>
                      <p className="text-sm text-slate-400">{evidenceData.length} pieces collected</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedTab('achievements')}
                    className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                  >
                    <Trophy className="w-6 h-6 text-amber-500" />
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Achievements</h3>
                      <p className="text-sm text-slate-400">{achievements.filter(a => a.unlocked).length} unlocked</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setShowSecurityModal(true)}
                    className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                  >
                    <Shield className="w-6 h-6 text-amber-500" />
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Security Settings</h3>
                      <p className="text-sm text-slate-400">Password & Email</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={onNavigateToEvidence}
                    className="flex items-center space-x-3 p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                  >
                    <BookOpen className="w-6 h-6 text-amber-500" />
                    <div className="text-left">
                      <h3 className="font-semibold text-white">Case Files</h3>
                      <p className="text-sm text-slate-400">Browse all cases</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'achievements' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Detective Achievements</h2>
              <p className="text-slate-400">Unlock badges by completing cases and mastering skills</p>
              <div className="flex justify-center items-center gap-4 mt-4">
                <div className="text-amber-400">
                  <span className="font-bold text-2xl">{achievements.filter(a => a.unlocked).length}</span>
                  <span className="text-sm ml-1">/ {achievements.length}</span>
                </div>
                <div className="text-slate-400">unlocked</div>
              </div>
            </div>
            
            {/* Achievement Categories */}
            {['Getting Started', 'Cases', 'Milestones', 'Skills', 'Progression', 'Special'].map(category => {
              const categoryAchievements = achievements.filter(a => a.category === category);
              if (categoryAchievements.length === 0) return null;
              
              return (
                <div key={category} className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent flex-1"></div>
                    <h3 className="text-xl font-bold text-amber-400 px-4">{category}</h3>
                    <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent flex-1"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 bg-slate-800/50 backdrop-blur-sm transform hover:scale-105 ${
                          achievement.unlocked
                            ? `border-green-500/50 shadow-lg shadow-green-500/10`
                            : 'border-slate-700/50 hover:border-slate-600/50'
                        }`}
                      >
                        <div className="text-center mb-4">
                          <div className={`text-6xl mb-3 transition-all duration-300 ${
                            achievement.unlocked ? 'grayscale-0 scale-110' : 'grayscale opacity-50'
                          }`}>
                            {achievement.icon}
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
                            getRarityColor(achievement.rarity)
                          }`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <h4 className={`font-bold text-lg mb-2 ${
                            achievement.unlocked ? 'text-white' : 'text-slate-400'
                          }`}>
                            {achievement.name}
                          </h4>
                          <p className={`text-sm mb-3 ${
                            achievement.unlocked ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-center space-x-2">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span className="text-amber-500 font-semibold">{achievement.points} pts</span>
                          </div>
                          {achievement.unlocked && (
                            <div className="mt-3 flex items-center justify-center space-x-1 text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Unlocked</span>
                            </div>
                          )}
                          {!achievement.unlocked && (
                            <div className="mt-3 flex items-center justify-center space-x-1 text-slate-500">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm font-medium">Locked</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedTab === 'evidence' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Evidence Collection</h2>
              <p className="text-slate-400">Review all evidence discovered during your investigations</p>
              <div className="flex justify-center items-center gap-6 mt-4">
                <div className="text-center">
                  <div className="text-amber-400 font-bold text-2xl">{evidenceData.length}</div>
                  <div className="text-slate-400 text-sm">Evidence Pieces</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold text-2xl">{userData?.completedCases?.length || 0}</div>
                  <div className="text-slate-400 text-sm">Cases Solved</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold text-2xl">
                    {evidenceData.filter(e => e.importance === 'critical').length}
                  </div>
                  <div className="text-slate-400 text-sm">Critical Evidence</div>
                </div>
              </div>
            </div>
            
            {evidenceData.length > 0 ? (
              <div>
                {/* Group evidence by case */}
                {Array.from(new Set(evidenceData.map(e => e.caseId))).map(caseId => {
                  const caseEvidence = evidenceData.filter(e => e.caseId === caseId);
                  return (
                    <div key={caseId} className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent flex-1"></div>
                        <h3 className="text-xl font-bold text-blue-400 px-4">{getCaseTitle(caseId)}</h3>
                        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent flex-1"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {caseEvidence.map((evidence) => (
                          <div
                            key={evidence.id}
                            className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-amber-500/50 transition-all duration-300 transform hover:scale-105"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                                  {getEvidenceIcon(evidence.type)}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white">{evidence.title}</h4>
                                  <p className="text-xs text-slate-400 capitalize">{evidence.type} Evidence</p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getImportanceColor(evidence.importance)}`}>
                                {evidence.importance}
                              </span>
                            </div>
                            
                            <p className="text-sm text-slate-300 mb-4 leading-relaxed">{evidence.description}</p>
                            
                            <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                              <p className="text-xs text-slate-400 font-mono leading-relaxed">{evidence.content}</p>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>Discovered: {formatDate(evidence.discoveredAt)}</span>
                              <span className="bg-slate-700/50 px-2 py-1 rounded capitalize">{evidence.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Evidence Yet</h3>
                <p className="text-slate-400 mb-6">Start solving cases to collect evidence and build your detective portfolio</p>
                <button
                  onClick={onBack}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Start Your First Case
                </button>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'stats' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Detective Statistics</h2>
              <p className="text-slate-400">Detailed breakdown of your detective career</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Success Rate</h3>
                <p className="text-3xl font-bold text-blue-400">
                  {userData?.completedCases?.length ? '100%' : '0%'}
                </p>
                <p className="text-sm text-slate-400">Case completion</p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 text-center">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Avg. Case Time</h3>
                <p className="text-3xl font-bold text-amber-400">45m</p>
                <p className="text-sm text-slate-400">Per case</p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Current Streak</h3>
                <p className="text-3xl font-bold text-green-400">{userData?.completedCases?.length || 0}</p>
                <p className="text-sm text-slate-400">Cases in a row</p>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Rank</h3>
                <p className="text-2xl font-bold text-purple-400">
                  {(userData?.level || 0) >= 10 ? 'Master' : (userData?.level || 0) >= 5 ? 'Expert' : 'Novice'}
                </p>
                <p className="text-sm text-slate-400">Detective level</p>
              </div>
            </div>
            
            {/* Detailed Progress */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Level Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Current Level</span>
                  <span className="text-amber-500 font-semibold">{userData?.level || 1}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((userData?.totalPoints || 0) % 1000) / 10}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{(userData?.totalPoints || 0) % 1000} XP</span>
                  <span>1000 XP</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Settings Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Security Settings</h2>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Change Password */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Current Password"
                      className="w-full px-3 py-2 pr-10 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="New Password"
                      className="w-full px-3 py-2 pr-10 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Confirm New Password"
                      className="w-full px-3 py-2 pr-10 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </div>
              
              {/* Change Email */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Change Email</h3>
                <div className="space-y-3">
                  <input
                    type="email"
                    value={emailData.newEmail}
                    onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                    placeholder="New Email"
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400"
                  />
                  <input
                    type="password"
                    value={emailData.password}
                    onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                    placeholder="Current Password"
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400"
                  />
                  <button
                    onClick={handleEmailChange}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Update Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Modal */}
      {showProfilePictureModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Profile Picture</h2>
              <button
                onClick={() => setShowProfilePictureModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl font-bold text-white">
                  {(userData?.displayName || currentUser?.displayName || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              
              <p className="text-slate-400 mb-6">
                Profile picture upload will be available soon! For now, we're using your initials as your avatar.
              </p>
              
              <button
                onClick={() => setShowProfilePictureModal(false)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
