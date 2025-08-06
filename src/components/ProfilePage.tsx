import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Calendar, Trophy, Edit3, Save, X, Star, Settings, Camera, Shield, Target, Eye, EyeOff, FileText, Code, CheckCircle, Clock, Zap, BookOpen, Lock, Users, Copy, Gift, Share2, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useInteractiveTour } from '../contexts/InteractiveTourContext';
import { updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { DailyLoginModal } from './DailyLoginModal';
import { EnhancedReferralModal } from './EnhancedReferralModal';

interface ProfilePageProps {
  onBack: () => void;
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

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { currentUser, userData, updateUserData, logout } = useAuth();
  const { startTour } = useInteractiveTour();
  
  // Check if profile tour has been completed
  const profileTourCompleted = currentUser ? 
    localStorage.getItem(`interactive_tour_profile_completed_${currentUser.uid}`) : 
    localStorage.getItem('interactive_tour_profile_completed_guest');
  
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
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'evidence' | 'stats' | 'referrals'>('overview');
  const [evidenceData, setEvidenceData] = useState<Evidence[]>([]);

  // Modal states for quick actions
  const [isDailyLoginModalOpen, setIsDailyLoginModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  // Referral system states
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalRewards: 0
  });

  // Detective Ranking System
  const detectiveRanks = [
    { 
      id: 1, 
      name: 'Rookie Detective', 
      minLevel: 1, 
      maxLevel: 2, 
      icon: '🔍', 
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      description: 'Just starting your detective journey'
    },
    { 
      id: 2, 
      name: 'Detective', 
      minLevel: 3, 
      maxLevel: 5, 
      icon: '🕵️', 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      description: 'Learning the ropes of investigation'
    },
    { 
      id: 3, 
      name: 'Senior Detective', 
      minLevel: 6, 
      maxLevel: 8, 
      icon: '🎖️', 
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      description: 'Experienced in solving complex cases'
    },
    { 
      id: 4, 
      name: 'Detective Inspector', 
      minLevel: 9, 
      maxLevel: 12, 
      icon: '🏅', 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      description: 'Leading investigations with expertise'
    },
    { 
      id: 5, 
      name: 'Chief Detective', 
      minLevel: 13, 
      maxLevel: 16, 
      icon: '👑', 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      description: 'Master of detective work'
    },
    { 
      id: 6, 
      name: 'Detective Captain', 
      minLevel: 17, 
      maxLevel: 20, 
      icon: '⭐', 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      description: 'Elite detective with unmatched skills'
    },
    { 
      id: 7, 
      name: 'Legendary Detective', 
      minLevel: 21, 
      maxLevel: 999, 
      icon: '🌟', 
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      description: 'The stuff of legends'
    }
  ];

  const getCurrentRank = () => {
    const level = userData?.level || 1;
    return detectiveRanks.find(rank => level >= rank.minLevel && level <= rank.maxLevel) || detectiveRanks[0];
  };

  const getNextRank = () => {
    const currentRank = getCurrentRank();
    const currentRankIndex = detectiveRanks.findIndex(rank => rank.id === currentRank.id);
    return currentRankIndex < detectiveRanks.length - 1 ? detectiveRanks[currentRankIndex + 1] : null;
  };

// Enhanced Evidence Generation System - Links to Real Cases
  useEffect(() => {
    if (userData?.completedCases) {
      const evidenceMap: { [key: string]: Evidence[] } = {
        'case-vanishing-blogger': [
          {
            id: 'evidence-tutorial-1',
            caseId: 'case-vanishing-blogger',
            title: 'Sam\'s Hidden Blog Message',
            description: 'Found Sam\'s warning about NovaCorp through HTML fixes',
            type: 'document',
            content: 'URGENT: NovaCorp is after me. Check my Instagram story before they delete everything!',
            discoveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            importance: 'critical'
          },
          {
            id: 'evidence-tutorial-2',
            caseId: 'case-vanishing-blogger',
            title: 'Instagram Evidence Screenshot',
            description: 'Recovered hidden Instagram story through CSS fixes',
            type: 'clue',
            content: 'Instagram Story: "The trains don\'t run anymore where we used to meet. Look for me where shadows watch but cameras don\'t."',
            discoveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            importance: 'high'
          },
          {
            id: 'evidence-tutorial-3',
            caseId: 'case-vanishing-blogger',
            title: 'Final Location Clue',
            description: 'Revealed Sam\'s exact location through visibility fixes',
            type: 'document',
            content: 'Final Post: "Warehouse 17, Dockside Street - Going live at midnight with the truth."',
            discoveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            importance: 'critical'
          }
        ],
        'visual-vanishing-blogger': [
          {
            id: 'evidence-visual-1',
            caseId: 'visual-vanishing-blogger',
            title: 'Rishi\'s Apartment Investigation',
            description: 'Evidence collected during visual investigation of Rishi\'s room',
            type: 'clue',
            content: 'Found suspicious elements in Rishi\'s personal devices and room layout',
            discoveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            importance: 'high'
          },
          {
            id: 'evidence-visual-2',
            caseId: 'visual-vanishing-blogger',
            title: 'Technical Blog Analysis',
            description: 'Analyzed Rishi\'s blog posts about Sherpa companies',
            type: 'document',
            content: 'Blog posts reveal investigation into corporate corruption before disappearance',
            discoveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            importance: 'medium'
          }
        ],
        'case-2': [
          {
            id: 'evidence-nav-1',
            caseId: 'case-2',
            title: 'Navigation Code Fix',
            description: 'Restored missing navigation using modern HTML5 semantics',
            type: 'code',
            content: 'Replaced div elements with proper <nav> tags and implemented flexbox layout',
            discoveredAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
            importance: 'medium'
          },
          {
            id: 'evidence-nav-2',
            caseId: 'case-2',
            title: 'Smart IDE Usage',
            description: 'Successfully used CodeCase\'s Smart IDE features',
            type: 'clue',
            content: 'Learned to use auto-complete, snippets, and code quality analyzer',
            discoveredAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
            importance: 'low'
          }
        ],
        'case-3': [
          {
            id: 'evidence-button-1',
            caseId: 'case-3',
            title: 'Interactive Button Solution',
            description: 'Fixed broken e-commerce buttons with proper hover effects',
            type: 'code',
            content: 'Implemented CSS transitions, hover states, and visual feedback for buttons',
            discoveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            importance: 'medium'
          }
        ],
        'case-4': [
          {
            id: 'evidence-flex-1',
            caseId: 'case-4',
            title: 'Flexbox Layout Recovery',
            description: 'Solved the flexbox fiasco and restored proper layout',
            type: 'code',
            content: 'Fixed flex container properties and alignment issues',
            discoveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            importance: 'high'
          }
        ],
        'case-5': [
          {
            id: 'evidence-css-1',
            caseId: 'case-5',
            title: 'CSS Catastrophe Solution',
            description: 'Resolved major CSS styling issues and conflicts',
            type: 'code',
            content: 'Fixed cascading issues, specificity problems, and layout breaks',
            discoveredAt: new Date(Date.now() - 30 * 60 * 1000),
            importance: 'high'
          }
        ],
        'case-6': [
          {
            id: 'evidence-portfolio-1',
            caseId: 'case-6',
            title: 'Portfolio Restoration',
            description: 'Completely restored broken portfolio website',
            type: 'document',
            content: 'Fixed HTML structure, CSS styling, and responsive design issues',
            discoveredAt: new Date(Date.now() - 15 * 60 * 1000),
            importance: 'critical'
          }
        ]
      };

      // Generate evidence for all completed cases
      const allEvidence: Evidence[] = userData.completedCases.flatMap(caseId => 
        evidenceMap[caseId] || [
          {
            id: `evidence-${caseId}-default`,
            caseId,
            title: `Evidence from ${getCaseTitle(caseId)}`,
            description: `Critical evidence discovered during ${getCaseTitle(caseId)} investigation`,
            type: ['code', 'document', 'clue'][Math.floor(Math.random() * 3)] as Evidence['type'],
            content: `Investigation findings for ${getCaseTitle(caseId)}`,
            discoveredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            importance: ['medium', 'high'][Math.floor(Math.random() * 2)] as Evidence['importance']
          }
        ]
      );

      setEvidenceData(allEvidence);
    }
  }, [userData?.completedCases]);

  // Helper function to get human-readable case titles
  const getCaseTitle = (caseId: string): string => {
    const caseTitles: { [key: string]: string } = {
      'case-vanishing-blogger': 'Tutorial Case',
      'visual-vanishing-blogger': 'Vanishing Blogger: Visual Investigation', 
      'case-2': 'The Missing Navigation Mystery',
      'case-3': 'The Broken Button Caper',
      'case-4': 'The Flexbox Fiasco',
      'case-5': 'The CSS Catastrophe',
      'case-6': 'The Portfolio Panic'
    };
    return caseTitles[caseId] || caseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      onBack(); // Navigate back to home page
    } catch (error) {
      // logger.error('Error logging out:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      toast.error('Failed to logout');
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

  const formatDate = (date: any) => {
    if (!date) return 'Unknown';
    
    try {
      let dateObj: Date;
      
      // Handle Firestore Timestamp
      if (date && typeof date.toDate === 'function') {
        dateObj = date.toDate();
      }
      // Handle string dates
      else if (typeof date === 'string') {
        dateObj = new Date(date);
      }
      // Handle Date objects
      else if (date instanceof Date) {
        dateObj = date;
      }
      // Handle timestamp numbers
      else if (typeof date === 'number') {
        dateObj = new Date(date);
      }
      else {
        return 'Unknown';
      }
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Unknown';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      // logger.error('Error formatting date:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      return 'Unknown';
    }
  };

  // Referral system functions
  const generateReferralCode = (uid: string): string => {
    // Generate a 6-character alphanumeric code based on user ID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const baseCode = uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    for (let i = 0; i < 6; i++) {
      if (i < baseCode.length) {
        result += baseCode[i];
      } else {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return result;
  };

  const copyReferralCode = () => {
    const code = userData?.referralCode || generateReferralCode(userData?.uid || '');
    navigator.clipboard.writeText(`${import.meta.env.VITE_APP_URL}/signup?ref=${code}`);
    toast.success('Referral link copied to clipboard!');
  };

  const shareReferralCode = () => {
    const code = userData?.referralCode || generateReferralCode(userData?.uid || '');
    const text = `Join me on CodeCase - the ultimate detective coding game! Use my referral code ${code} to get bonus points and hints when you sign up: ${import.meta.env.VITE_APP_URL}/signup?ref=${code}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join CodeCase!',
        text: text,
        url: `${import.meta.env.VITE_APP_URL}/signup?ref=${code}`
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Referral message copied to clipboard!');
    }
  };

  // Load referral data
  useEffect(() => {
    if (userData?.uid) {
      const code = userData?.referralCode || generateReferralCode(userData.uid);
      setReferralCode(code);
      
      // In a real implementation, you would fetch referral stats from Firebase
      setReferralStats({
        totalReferrals: userData?.referralStats?.totalReferrals || 0,
        successfulReferrals: userData?.referralStats?.successfulReferrals || 0,
        pendingReferrals: userData?.referralStats?.pendingReferrals || 0,
        totalRewards: userData?.referralStats?.totalRewards || 0
      });
    }
  }, [userData]);

  const achievements = [
    // Beginner Achievements
    { 
      id: 1, 
      name: 'First Steps', 
      icon: '👶', 
      description: 'Completed the tutorial case', 
      unlocked: userData?.completedCases?.includes('case-vanishing-blogger') || false,
      rarity: 'common',
      points: 2500,
      category: 'Progress'
    },
    { 
      id: 2, 
      name: 'Visual Detective', 
      icon: '�', 
      description: 'Completed the visual investigation case', 
      unlocked: userData?.completedCases?.includes('visual-vanishing-blogger') || false,
      rarity: 'common',
      points: 100,
      category: 'Progress'
    },
    { 
      id: 3, 
      name: 'Navigation Expert', 
      icon: '🧭', 
      description: 'Solved the missing navigation mystery', 
      unlocked: userData?.completedCases?.includes('case-2') || false,
      rarity: 'uncommon',
      points: 150,
      category: 'Skills'
    },
    { 
      id: 4, 
      name: 'Button Master', 
      icon: '🔘', 
      description: 'Fixed the broken button caper', 
      unlocked: userData?.completedCases?.includes('case-3') || false,
      rarity: 'uncommon',
      points: 150,
      category: 'Skills'
    },
    { 
      id: 5, 
      name: 'Layout Wizard', 
      icon: '📐', 
      description: 'Solved the flexbox fiasco', 
      unlocked: userData?.completedCases?.includes('case-4') || false,
      rarity: 'rare',
      points: 200,
      category: 'Skills'
    },
    { 
      id: 6, 
      name: 'Style Savior', 
      icon: '🎨', 
      description: 'Fixed the CSS catastrophe', 
      unlocked: userData?.completedCases?.includes('case-5') || false,
      rarity: 'rare',
      points: 200,
      category: 'Skills'
    },
    { 
      id: 7, 
      name: 'Portfolio Pro', 
      icon: '💼', 
      description: 'Restored the portfolio panic', 
      unlocked: userData?.completedCases?.includes('case-6') || false,
      rarity: 'epic',
      points: 250,
      category: 'Skills'
    },

    // Milestone Achievements
    { 
      id: 8, 
      name: 'Case Closer', 
      icon: '🏅', 
      description: 'Completed 3 cases', 
      unlocked: (userData?.completedCases?.length || 0) >= 3,
      rarity: 'rare',
      points: 300,
      category: 'Milestones'
    },
    { 
      id: 9, 
      name: 'Detective Expert', 
      icon: '🏆', 
      description: 'Completed 5 cases', 
      unlocked: (userData?.completedCases?.length || 0) >= 5,
      rarity: 'epic',
      points: 500,
      category: 'Milestones'
    },
    { 
      id: 10, 
      name: 'Master Detective', 
      icon: '👑', 
      description: 'Completed all available cases', 
      unlocked: (userData?.completedCases?.length || 0) >= 7,
      rarity: 'legendary',
      points: 1000,
      category: 'Milestones'
    },

    // Skill-Based Achievements
    { 
      id: 11, 
      name: 'Code Fixer', 
      icon: '🔧', 
      description: 'Earned your first hints', 
      unlocked: (userData?.hints || 0) >= 1,
      rarity: 'common',
      points: 75,
      category: 'Skills'
    },
    { 
      id: 12, 
      name: 'Hint Hunter', 
      icon: '💡', 
      description: 'Earned 10 hints', 
      unlocked: (userData?.hints || 0) >= 10,
      rarity: 'uncommon',
      points: 200,
      category: 'Skills'
    },
    { 
      id: 13, 
      name: 'Experience Seeker', 
      icon: '⭐', 
      description: 'Reached level 5', 
      unlocked: (userData?.level || 0) >= 5,
      rarity: 'rare',
      points: 400,
      category: 'Progress'
    },
    { 
      id: 14, 
      name: 'Level Champion', 
      icon: '�', 
      description: 'Reached level 10', 
      unlocked: (userData?.level || 0) >= 10,
      rarity: 'epic',
      points: 800,
      category: 'Progress'
    },

    // Point-Based Achievements
    { 
      id: 15, 
      name: 'Point Collector', 
      icon: '💰', 
      description: 'Earned 1000 total points', 
      unlocked: (userData?.totalPoints || 0) >= 1000,
      rarity: 'uncommon',
      points: 100,
      category: 'Points'
    },
    { 
      id: 16, 
      name: 'Score Master', 
      icon: '💎', 
      description: 'Earned 5000 total points', 
      unlocked: (userData?.totalPoints || 0) >= 5000,
      rarity: 'rare',
      points: 500,
      category: 'Points'
    },
    { 
      id: 17, 
      name: 'Elite Scorer', 
      icon: '💠', 
      description: 'Earned 10000 total points', 
      unlocked: (userData?.totalPoints || 0) >= 10000,
      rarity: 'epic',
      points: 1000,
      category: 'Points'
    },

    // Evidence & Investigation Achievements
    { 
      id: 18, 
      name: 'Evidence Finder', 
      icon: '📋', 
      description: 'Collected 5 pieces of evidence', 
      unlocked: evidenceData.length >= 5,
      rarity: 'common',
      points: 150,
      category: 'Investigation'
    },
    { 
      id: 19, 
      name: 'Evidence Collector', 
      icon: '�', 
      description: 'Collected 10 pieces of evidence', 
      unlocked: evidenceData.length >= 10,
      rarity: 'uncommon',
      points: 300,
      category: 'Investigation'
    },
    { 
      id: 20, 
      name: 'Evidence Master', 
      icon: '🗃️', 
      description: 'Collected 20 pieces of evidence', 
      unlocked: evidenceData.length >= 20,
      rarity: 'rare',
      points: 600,
      category: 'Investigation'
    },

    // Special & Hidden Achievements
    { 
      id: 21, 
      name: 'Speed Demon', 
      icon: '⚡', 
      description: 'Complete a case in under 10 minutes', 
      unlocked: false, // This would require timing tracking
      rarity: 'epic',
      points: 500,
      category: 'Special'
    },
    { 
      id: 22, 
      name: 'Perfectionist', 
      icon: '✨', 
      description: 'Complete a case without using hints', 
      unlocked: false, // This would require tracking hint usage per case
      rarity: 'legendary',
      points: 750,
      category: 'Special'
    },
    { 
      id: 23, 
      name: 'Veteran Detective', 
      icon: '🎖️', 
      description: 'Active for 7 days', 
      unlocked: userData?.createdAt ? 
        (Date.now() - userData.createdAt.toDate().getTime()) >= (7 * 24 * 60 * 60 * 1000) : false,
      rarity: 'rare',
      points: 300,
      category: 'Special'
    },

    // Referral Achievements
    { 
      id: 24, 
      name: 'First Referral', 
      icon: '🤝', 
      description: 'Successfully refer your first detective', 
      unlocked: (userData?.referralStats?.successfulReferrals || 0) >= 1,
      rarity: 'uncommon',
      points: 200,
      category: 'Special'
    },
    { 
      id: 25, 
      name: 'Team Builder', 
      icon: '👥', 
      description: 'Successfully refer 5 detectives', 
      unlocked: (userData?.referralStats?.successfulReferrals || 0) >= 5,
      rarity: 'rare',
      points: 500,
      category: 'Special'
    },
    { 
      id: 26, 
      name: 'Recruitment Expert', 
      icon: '🎯', 
      description: 'Successfully refer 10 detectives', 
      unlocked: (userData?.referralStats?.successfulReferrals || 0) >= 10,
      rarity: 'epic',
      points: 1000,
      category: 'Special'
    },
    { 
      id: 27, 
      name: 'Master Recruiter', 
      icon: '🏆', 
      description: 'Successfully refer 25 detectives', 
      unlocked: (userData?.referralStats?.successfulReferrals || 0) >= 25,
      rarity: 'legendary',
      points: 2500,
      category: 'Special'
    },
    { 
      id: 28, 
      name: 'CodeCase Legend', 
      icon: '🏆', 
      description: 'Unlock all other achievements', 
      unlocked: false, // Will be calculated below
      rarity: 'legendary', 
      points: 2000,
      category: 'Ultimate'
    }
  ];

  // Calculate if Legend achievement should be unlocked (all other achievements except itself)
  const otherAchievements = achievements.filter(a => a.id !== 28);
  const unlockedCount = otherAchievements.filter(a => a.unlocked).length;
  const legendAchievement = achievements.find(a => a.id === 28);
  if (legendAchievement) {
    legendAchievement.unlocked = unlockedCount >= otherAchievements.length - 3; // Allow some special achievements to be locked
  }

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
    <section className="min-h-screen relative overflow-hidden">
      {/* Detective Command Center Background - matching Hero component */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-slate-900/40 via-slate-800/20 to-slate-900/40"></div>
        
        {/* Detective atmosphere effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-amber-500/10 filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-80 h-80 rounded-full bg-blue-500/8 filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 rounded-full bg-emerald-500/6 filter blur-3xl animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10">
        <Toaster position="top-right" />
        
        {/* Header - Enhanced Detective Style */}
        <div className="bg-slate-950/90 backdrop-blur-xl border-b border-amber-500/20 sticky top-0 z-30 shadow-2xl shadow-slate-950/50">
          <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                <button
                  onClick={onBack}
                  className="p-2 sm:p-3 hover:bg-slate-800/50 rounded-xl transition-all duration-300 border border-slate-700/30 backdrop-blur-sm flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </button>
                <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-600/20 backdrop-blur-md border border-amber-400/30 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                      <User className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400 drop-shadow-lg" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-4 sm:h-4 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent drop-shadow-sm truncate">
                      Detective Profile
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 font-mono uppercase tracking-wider hidden sm:block">Command Center</p>
                  </div>
                </div>
              </div>
              
              {/* Mobile Action Buttons - 2x2 Grid */}
              <div className="flex sm:hidden flex-wrap gap-1 ml-2">
                <button
                  onClick={() => setShowProfilePictureModal(true)}
                  className="p-2 bg-slate-800/50 hover:bg-slate-700/50 text-amber-400 rounded-lg transition-all duration-300 border border-slate-700/30 backdrop-blur-sm shadow-lg hover:shadow-amber-400/10"
                  title="Change Profile Picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowSecurityModal(true)}
                  className="p-2 bg-slate-800/50 hover:bg-slate-700/50 text-amber-400 rounded-lg transition-all duration-300 border border-slate-700/30 backdrop-blur-sm shadow-lg hover:shadow-amber-400/10"
                  title="Security Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => startTour('profile', true)}
                  className="p-2 bg-slate-800/50 hover:bg-slate-700/50 text-blue-400 rounded-lg transition-all duration-300 border border-slate-700/30 backdrop-blur-sm shadow-lg hover:shadow-blue-400/10"
                  title={profileTourCompleted ? "Replay Profile Tour" : "Profile Tour"}
                >
                  {profileTourCompleted ? (
                    <div className="relative">
                      <HelpCircle className="w-4 h-4" />
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-slate-800" />
                    </div>
                  ) : (
                    <HelpCircle className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-red-600/50 hover:bg-red-500/60 text-red-100 rounded-lg transition-all duration-300 border border-red-500/30 backdrop-blur-sm shadow-lg hover:shadow-red-400/20"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Desktop Action Buttons - Horizontal */}
              <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
                <button
                  onClick={() => setShowProfilePictureModal(true)}
                  className="p-2 lg:p-3 bg-slate-800/50 hover:bg-slate-700/50 text-amber-400 rounded-xl transition-all duration-300 border border-slate-700/30 backdrop-blur-sm shadow-lg hover:shadow-amber-400/10"
                  title="Change Profile Picture"
                >
                  <Camera className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
                <button
                  onClick={() => setShowSecurityModal(true)}
                  className="p-2 lg:p-3 bg-slate-800/50 hover:bg-slate-700/50 text-amber-400 rounded-xl transition-all duration-300 border border-slate-700/30 backdrop-blur-sm shadow-lg hover:shadow-amber-400/10"
                  title="Security Settings"
                >
                  <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
                <button
                  onClick={() => startTour('profile', true)}
                  className="p-2 lg:p-3 bg-slate-800/50 hover:bg-slate-700/50 text-blue-400 rounded-xl transition-all duration-300 border border-slate-700/30 backdrop-blur-sm shadow-lg hover:shadow-blue-400/10"
                  title={profileTourCompleted ? "Replay Profile Tour - Review the features again" : "Profile Tour - Learn about this page"}
                >
                  {profileTourCompleted ? (
                    <div className="relative">
                      <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                    </div>
                  ) : (
                    <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 lg:p-3 bg-red-600/50 hover:bg-red-500/60 text-red-100 rounded-xl transition-all duration-300 border border-red-500/30 backdrop-blur-sm shadow-lg hover:shadow-red-400/20"
                  title="Logout from your detective account"
                >
                  <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>
            
            {/* Enhanced Tab Navigation - Mobile Responsive */}
            <div className="mt-6 bg-slate-800/30 backdrop-blur-md rounded-2xl p-2 border border-slate-700/30">
              {/* Desktop/Tablet View */}
              <div className="hidden sm:flex space-x-2">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'achievements', label: 'Achievements', icon: Trophy },
                  { id: 'evidence', label: 'Evidence', icon: FileText },
                  { id: 'stats', label: 'Statistics', icon: Target },
                  { id: 'referrals', label: 'Referrals', icon: Users }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 lg:px-6 py-3 rounded-xl transition-all duration-300 font-medium flex-1 justify-center ${
                      selectedTab === tab.id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 shadow-lg shadow-amber-500/30'
                        : 'text-slate-300 hover:text-amber-300 hover:bg-slate-700/30 border border-transparent hover:border-slate-600/30'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-xs lg:text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Mobile View - Grid Layout */}
              <div className="grid grid-cols-2 gap-2 sm:hidden">
                {[
                  { id: 'overview', label: 'Overview', icon: User },
                  { id: 'achievements', label: 'Achievements', icon: Trophy },
                  { id: 'evidence', label: 'Evidence', icon: FileText },
                  { id: 'stats', label: 'Statistics', icon: Target },
                  { id: 'referrals', label: 'Referrals', icon: Users }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-xl transition-all duration-300 font-medium ${
                      selectedTab === tab.id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 shadow-lg shadow-amber-500/30'
                        : 'text-slate-300 hover:text-amber-300 hover:bg-slate-700/30 border border-transparent hover:border-slate-600/30'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-4 sm:p-6 lg:p-8 shadow-2xl shadow-slate-950/50">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-600/20 backdrop-blur-md border border-amber-400/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 relative shadow-2xl shadow-amber-500/20">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-200 drop-shadow-lg">
                      {(userData?.displayName || currentUser?.displayName || 'U').charAt(0).toUpperCase()}
                    </span>
                    <button
                      onClick={() => setShowProfilePictureModal(true)}
                      className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border border-amber-400/30 shadow-lg hover:shadow-amber-400/20"
                    >
                      <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-amber-400" />
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editData.displayName}
                        onChange={(e) => setEditData({ displayName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 text-sm sm:text-base"
                        placeholder="Display Name"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                        {userData?.displayName || currentUser?.displayName || 'Detective'}
                      </h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-amber-500 hover:text-amber-400 text-xs sm:text-sm flex items-center space-x-1 mx-auto"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-slate-300">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{currentUser?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-slate-300">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Joined {formatDate(userData?.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-slate-300">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Level {userData?.level || 1}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-slate-300">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Rank: {getCurrentRank().name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div id="profile-cases-solved" className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-4 sm:p-6 shadow-xl shadow-slate-950/50 hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/20">
                      <span className="text-blue-400 text-base sm:text-lg font-bold">🕵️</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-100">Cases Solved</h3>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">{userData?.completedCases?.length || 0}</p>
                  <p className="text-xs sm:text-sm text-slate-400">Detective missions completed</p>
                </div>

                <div id="profile-hints-available" className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-4 sm:p-6 shadow-xl shadow-slate-950/50 hover:shadow-amber-500/10 transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-amber-400/20">
                      <span className="text-amber-400 text-base sm:text-lg font-bold">💡</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-100">Hints Available</h3>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-amber-400 mb-2">{userData?.hints || 0}</p>
                  <p className="text-xs sm:text-sm text-slate-400">Ready for use</p>
                </div>

                <div id="profile-total-points" className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-4 sm:p-6 shadow-xl shadow-slate-950/50 hover:shadow-green-500/10 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-green-400/20">
                      <span className="text-green-400 text-base sm:text-lg font-bold">⭐</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-100">Total Points</h3>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">{userData?.totalPoints || 0}</p>
                  <p className="text-xs sm:text-sm text-slate-400">Experience earned</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-4 sm:p-6 lg:p-8 shadow-2xl shadow-slate-950/50">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-amber-400 text-sm sm:text-base">⚡</span>
                  </div>
                  <span>Quick Actions</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => setSelectedTab('evidence')}
                    className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-amber-400/30 shadow-lg hover:shadow-amber-400/10 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-semibold text-slate-100 text-sm sm:text-base">View Evidence</h3>
                      <p className="text-xs sm:text-sm text-slate-400">{evidenceData.length} pieces collected</p>
                    </div>
                  </button>
                  
                  <button
                    id="profile-achievements-tab"
                    onClick={() => setSelectedTab('achievements')}
                    className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-amber-400/30 shadow-lg hover:shadow-amber-400/10 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-semibold text-slate-100 text-sm sm:text-base">Achievements</h3>
                      <p className="text-xs sm:text-sm text-slate-400">{achievements.filter(a => a.unlocked).length} unlocked</p>
                    </div>
                  </button>
                  
                  <button
                    id="profile-security-settings"
                    onClick={() => setShowSecurityModal(true)}
                    className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-amber-400/30 shadow-lg hover:shadow-amber-400/10 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-semibold text-slate-100 text-sm sm:text-base">Security Settings</h3>
                      <p className="text-xs sm:text-sm text-slate-400">Password & Email</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={onBack}
                    className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-amber-400/30 shadow-lg hover:shadow-amber-400/10 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-semibold text-slate-100 text-sm sm:text-base">Case Files</h3>
                      <p className="text-xs sm:text-sm text-slate-400">Browse all cases</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick Actions Section */}
            <div className="lg:col-span-3 mt-4 sm:mt-8">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-4 sm:p-6 lg:p-8 shadow-2xl shadow-slate-950/50">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-4 sm:mb-6 flex items-center space-x-2 sm:space-x-3">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                  <span>Daily Actions</span>
                </h3>
                
                <div className={`grid gap-2 sm:gap-3 ${
                  userData?.referredBy 
                    ? 'grid-cols-1 sm:grid-cols-2' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {/* Daily Login Streak */}
                  <button
                    onClick={() => setIsDailyLoginModalOpen(true)}
                    className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 rounded-xl transition-all duration-300 border border-orange-400/30 hover:border-orange-400/50 shadow-lg hover:shadow-orange-400/10 w-full"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm sm:text-base">🎯</span>
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="font-semibold text-slate-100 text-sm sm:text-base">Daily Login</h4>
                      <p className="text-xs sm:text-sm text-orange-300">{userData?.loginStreak || 0} day streak</p>
                    </div>
                  </button>

                  {/* Use Referral Code */}
                  {!userData?.referredBy && (
                    <button
                      onClick={() => setIsReferralModalOpen(true)}
                      className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 rounded-xl transition-all duration-300 border border-purple-400/30 hover:border-purple-400/50 shadow-lg hover:shadow-purple-400/10 w-full"
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                      </div>
                      <div className="text-left min-w-0">
                        <h4 className="font-semibold text-slate-100 text-sm sm:text-base">Use Referral Code</h4>
                        <p className="text-xs sm:text-sm text-purple-300">Get bonus rewards</p>
                      </div>
                    </button>
                  )}

                  {/* Share Your Code */}
                  <button
                    onClick={copyReferralCode}
                    className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 rounded-xl transition-all duration-300 border border-emerald-400/30 hover:border-emerald-400/50 shadow-lg hover:shadow-emerald-400/10 w-full"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                    </div>
                    <div className="text-left min-w-0">
                      <h4 className="font-semibold text-slate-100 text-sm sm:text-base">Share Your Code</h4>
                      <p className="text-xs sm:text-sm text-emerald-300">Invite friends</p>
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
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Detective Achievements</h2>
              <p className="text-slate-400 text-lg">Unlock badges by completing cases and mastering skills</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Unlocked: {achievements.filter(a => a.unlocked).length}</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                  <span className="text-slate-400">Locked: {achievements.filter(a => !a.unlocked).length}</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Star className="w-3 h-3 text-amber-400" />
                  <span className="text-slate-300">Total Points: {achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)}</span>
                </div>
              </div>
            </div>

            {/* Achievement Categories */}
            {['Progress', 'Skills', 'Milestones', 'Points', 'Investigation', 'Special', 'Ultimate'].map(category => {
              const categoryAchievements = achievements.filter(a => a.category === category);
              if (categoryAchievements.length === 0) return null;
              
              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {category === 'Progress' && '📈'}
                        {category === 'Skills' && '🛠️'}
                        {category === 'Milestones' && '🎯'}
                        {category === 'Points' && '💰'}
                        {category === 'Investigation' && '🔍'}
                        {category === 'Special' && '⭐'}
                        {category === 'Ultimate' && '👑'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-100">{category} Achievements</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-500/30 to-transparent"></div>
                    <span className="text-sm text-slate-400">
                      {categoryAchievements.filter(a => a.unlocked).length}/{categoryAchievements.length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                          achievement.unlocked
                            ? 'bg-slate-800/60 border-amber-400/40 shadow-lg shadow-amber-400/10'
                            : 'bg-slate-900/40 border-slate-700/30'
                        }`}
                      >
                        {achievement.unlocked && (
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5" />
                        )}
                        
                        <div className="relative p-6">
                          <div className="text-center mb-4">
                            <div className={`text-6xl mb-3 transition-all duration-300 ${
                              achievement.unlocked ? 'grayscale-0 scale-110' : 'grayscale opacity-50'
                            }`}>
                              {achievement.icon}
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize border backdrop-blur-sm ${
                              getRarityColor(achievement.rarity)
                            }`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          
                          <div className="text-center">
                            <h3 className={`font-bold text-lg mb-2 ${
                              achievement.unlocked ? 'text-slate-100' : 'text-slate-400'
                            }`}>
                              {achievement.name}
                            </h3>
                            <p className={`text-sm mb-3 ${
                              achievement.unlocked ? 'text-slate-300' : 'text-slate-500'
                            }`}>
                              {achievement.description}
                            </p>
                            
                            <div className={`flex items-center justify-center space-x-2 mb-3 p-2 rounded-lg ${
                              achievement.unlocked ? 'bg-amber-500/20' : 'bg-slate-700/30'
                            }`}>
                              <Star className="w-4 h-4 text-amber-400" />
                              <span className="text-amber-400 font-semibold">{achievement.points} pts</span>
                            </div>
                            
                            {achievement.unlocked && (
                              <div className="flex items-center justify-center space-x-2 bg-green-500/20 rounded-lg p-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 font-medium text-sm">Unlocked</span>
                              </div>
                            )}
                            
                            {!achievement.unlocked && (
                              <div className="flex items-center justify-center space-x-2 bg-slate-700/30 rounded-lg p-2">
                                <Lock className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-500 font-medium text-sm">Locked</span>
                              </div>
                            )}
                          </div>
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
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <h2 className="text-3xl font-bold text-slate-100 mb-2">Evidence Collection</h2>
                <p className="text-slate-400 text-lg">Review all evidence discovered during your investigations</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedTab('stats')}
                  className="bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 border border-slate-600/30 hover:border-amber-400/30 backdrop-blur-sm"
                >
                  <Target className="w-4 h-4" />
                  <span>View Stats</span>
                </button>
              </div>
            </div>

            {/* Evidence Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {['code', 'document', 'clue', 'critical'].map((type) => {
                const count = type === 'critical' 
                  ? evidenceData.filter(e => e.importance === 'critical').length
                  : evidenceData.filter(e => e.type === type).length;
                
                return (
                  <div key={type} className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6 text-center shadow-lg hover:shadow-amber-400/10 transition-all duration-300 hover:border-amber-400/30">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      {type === 'code' && <Code className="w-6 h-6 text-amber-400" />}
                      {type === 'document' && <FileText className="w-6 h-6 text-amber-400" />}
                      {type === 'clue' && <Star className="w-6 h-6 text-amber-400" />}
                      {type === 'critical' && <Shield className="w-6 h-6 text-red-400" />}
                    </div>
                    <p className="text-3xl font-bold text-slate-100 mb-2">{count}</p>
                    <p className="text-sm text-slate-400 capitalize">
                      {type === 'critical' ? 'Critical Evidence' : `${type} Evidence`}
                    </p>
                  </div>
                );
              })}
            </div>
            
            {evidenceData.length > 0 ? (
              <>
                {/* Evidence by Case */}
                {Object.entries(
                  evidenceData.reduce((groups: { [key: string]: Evidence[] }, evidence) => {
                    const caseTitle = getCaseTitle(evidence.caseId);
                    if (!groups[caseTitle]) groups[caseTitle] = [];
                    groups[caseTitle].push(evidence);
                    return groups;
                  }, {})
                ).map(([caseTitle, caseEvidence]) => (
                  <div key={caseTitle} className="space-y-4">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-100">{caseTitle}</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 to-transparent"></div>
                      <span className="text-sm text-slate-400">{caseEvidence.length} pieces</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {caseEvidence.map((evidence) => (
                        <div
                          key={evidence.id}
                          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6 hover:border-amber-400/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg hover:shadow-amber-400/10"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                {getEvidenceIcon(evidence.type)}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-100 text-sm leading-tight">{evidence.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">{evidence.type}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm ${getImportanceColor(evidence.importance)}`}>
                              {evidence.importance}
                            </span>
                          </div>
                          
                          <p className="text-sm text-slate-300 mb-4 leading-relaxed line-clamp-3">{evidence.description}</p>
                          
                          <div className="bg-slate-700/30 rounded-lg p-3">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                              <span>{formatDate(evidence.discoveredAt)}</span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>Evidence #{evidence.id.split('-').pop()}</span>
                              </div>
                            </div>
                            {evidence.content && (
                              <p className="text-xs text-slate-400 mt-2 italic line-clamp-2">"{evidence.content.substring(0, 100)}..."</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Evidence Analysis */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-8 shadow-lg mt-8">
                  <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-400" />
                    </div>
                    <span>Evidence Analysis</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center bg-slate-700/30 rounded-xl p-6">
                      <p className="text-4xl font-bold text-amber-400 mb-2">
                        {Math.round((evidenceData.filter(e => e.importance === 'high' || e.importance === 'critical').length / Math.max(evidenceData.length, 1)) * 100)}%
                      </p>
                      <p className="text-sm text-slate-400">High-Value Evidence</p>
                    </div>
                    <div className="text-center bg-slate-700/30 rounded-xl p-6">
                      <p className="text-3xl font-bold text-blue-500">
                        {evidenceData.filter(e => e.type === 'code').length}
                      </p>
                      <p className="text-sm text-slate-400">Code Fragments</p>
                    </div>
                    <div className="text-center bg-slate-700/30 rounded-xl p-6">
                      <p className="text-3xl font-bold text-green-500">
                        {new Set(evidenceData.map(e => e.caseId)).size}
                      </p>
                      <p className="text-sm text-slate-400">Cases with Evidence</p>
                    </div>
                    <div className="text-center bg-slate-700/30 rounded-xl p-6">
                      <p className="text-3xl font-bold text-purple-500">
                        {evidenceData.filter(e => e.importance === 'critical').length}
                      </p>
                      <p className="text-sm text-slate-400">Critical Discoveries</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Evidence Yet</h3>
                <p className="text-slate-400 mb-6">Start solving cases to collect evidence and build your detective portfolio</p>
                <button
                  onClick={onBack}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
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
            
            {/* Current Rank Display */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Current Rank</h3>
                <button
                  onClick={() => setSelectedTab('evidence')}
                  className="text-amber-500 hover:text-amber-400 text-sm flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Evidence ({evidenceData.length})</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3 sm:space-x-6">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 ${getCurrentRank().bgColor} rounded-full flex items-center justify-center`}>
                  <span className="text-2xl sm:text-4xl">{getCurrentRank().icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className={`text-2xl font-bold ${getCurrentRank().color} mb-2`}>
                    {getCurrentRank().name}
                  </h4>
                  <p className="text-slate-300 mb-4">{getCurrentRank().description}</p>
                  
                  {/* Level Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Level {userData?.level || 1}</span>
                      {getNextRank() && (
                        <span className="text-slate-400">
                          Next: {getNextRank()!.name} (Level {getNextRank()!.minLevel})
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: getNextRank() 
                            ? `${Math.min(100, ((userData?.level || 1) - getCurrentRank().minLevel) / (getNextRank()!.minLevel - getCurrentRank().minLevel) * 100)}%`
                            : '100%'
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{userData?.totalPoints || 0} Total XP</span>
                      {getNextRank() && (
                        <span>{(getNextRank()!.minLevel - (userData?.level || 1)) * 1000} XP to next rank</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
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
                <h3 className="font-semibold text-white mb-2">Evidence Found</h3>
                <p className="text-3xl font-bold text-amber-400">{evidenceData.length}</p>
                <p className="text-sm text-slate-400">Total pieces</p>
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
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Achievements</h3>
                <p className="text-3xl font-bold text-purple-400">
                  {achievements.filter(a => a.unlocked).length}
                </p>
                <p className="text-sm text-slate-400">Unlocked</p>
              </div>
            </div>

            {/* Rank Progression Chart */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Detective Rank Progression</h3>
              <div className="space-y-4">
                {detectiveRanks.map((rank) => {
                  const isUnlocked = (userData?.level || 1) >= rank.minLevel;
                  const isCurrent = getCurrentRank().id === rank.id;
                  
                  return (
                    <div
                      key={rank.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                        isCurrent 
                          ? 'bg-amber-500/20 border border-amber-500/50' 
                          : isUnlocked 
                            ? 'bg-slate-700/50' 
                            : 'bg-slate-700/20 opacity-50'
                      }`}
                    >
                      <div className={`w-12 h-12 ${rank.bgColor} rounded-full flex items-center justify-center`}>
                        <span className="text-2xl">{rank.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className={`font-bold ${rank.color}`}>{rank.name}</h4>
                          {isCurrent && (
                            <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full font-semibold">
                              CURRENT
                            </span>
                          )}
                          {isUnlocked && !isCurrent && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mt-1">{rank.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">
                          Level {rank.minLevel}
                          {rank.maxLevel < 999 && ` - ${rank.maxLevel}`}
                        </p>
                        <p className="text-xs text-slate-400">
                          {rank.minLevel * 1000} XP
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detective Profile Summary */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Detective Profile Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Cases Solved:</span>
                    <span className="text-white font-semibold">{userData?.completedCases?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Evidence Collected:</span>
                    <span className="text-white font-semibold">{evidenceData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Hints Available:</span>
                    <span className="text-white font-semibold">{userData?.hints || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Points:</span>
                    <span className="text-white font-semibold">{userData?.totalPoints || 0}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Current Rank:</span>
                    <span className={`font-semibold ${getCurrentRank().color}`}>{getCurrentRank().name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Join Date:</span>
                    <span className="text-white font-semibold">{formatDate(userData?.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Achievements:</span>
                    <span className="text-white font-semibold">
                      {achievements.filter(a => a.unlocked).length}/{achievements.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Success Rate:</span>
                    <span className="text-green-400 font-semibold">
                      {userData?.completedCases?.length ? '100%' : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'referrals' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-100 mb-2">Referral Program</h2>
              <p className="text-slate-400 text-lg">Invite friends and earn rewards together!</p>
            </div>

            {/* Referral Code Section */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-8 shadow-2xl shadow-slate-950/50">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-amber-600/20 backdrop-blur-md border border-amber-400/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/20">
                  <Users className="w-10 h-10 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">Your Referral Code</h3>
                <p className="text-slate-400">Share this code with friends to earn rewards when they join!</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 p-4 sm:p-6 mb-6">
                <div className="flex items-center justify-center">
                  <div className="text-center w-full">
                    <p className="text-xs sm:text-sm text-slate-400 mb-2">Your Referral Code</p>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-400 font-mono tracking-wider bg-slate-700/50 rounded-lg px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border border-amber-400/30 break-all">
                      {referralCode || 'LOADING...'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={copyReferralCode}
                  className="flex items-center justify-center space-x-2 sm:space-x-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 rounded-xl px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-amber-400/20"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span className="font-medium text-slate-100 text-sm sm:text-base">Copy Referral Link</span>
                </button>
                <button
                  onClick={shareReferralCode}
                  className="flex items-center justify-center space-x-2 sm:space-x-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-400/20"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <span className="font-medium text-slate-100 text-sm sm:text-base">Share with Friends</span>
                </button>
              </div>
            </div>

            {/* Referral Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6 text-center shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-blue-400 mb-2">{referralStats.totalReferrals}</p>
                <p className="text-sm text-slate-400">Total Referrals</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6 text-center shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-green-400 mb-2">{referralStats.successfulReferrals}</p>
                <p className="text-sm text-slate-400">Successful Referrals</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6 text-center shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold text-yellow-400 mb-2">{referralStats.pendingReferrals}</p>
                <p className="text-sm text-slate-400">Pending Referrals</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-6 text-center shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-amber-400" />
                </div>
                <p className="text-3xl font-bold text-amber-400 mb-2">{referralStats.totalRewards}</p>
                <p className="text-sm text-slate-400">Total Rewards</p>
              </div>
            </div>

            {/* Referral Rewards Info */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-8 shadow-2xl shadow-slate-950/50">
              <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-amber-400" />
                </div>
                <span>Referral Rewards</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-200 mb-4">For You (Referrer)</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-amber-400 font-bold">+100</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">100 Points</p>
                        <p className="text-sm text-slate-400">Per successful referral</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-400 font-bold">+1</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">1 Hint</p>
                        <p className="text-sm text-slate-400">Per successful referral</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-200 mb-4">For Your Friend (Referee)</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-green-400 font-bold">+200</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">200 Bonus Points</p>
                        <p className="text-sm text-slate-400">On top of starting 500 points</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-purple-400 font-bold">+1</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100">1 Extra Hint</p>
                        <p className="text-sm text-slate-400">On top of starting 2 hints</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-400/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Star className="w-6 h-6 text-amber-400" />
                  <h4 className="text-lg font-semibold text-slate-100">Special Milestone Bonuses</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-amber-400">5 Referrals</p>
                    <p className="text-slate-300">+500 bonus points</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-amber-400">10 Referrals</p>
                    <p className="text-slate-300">+1000 bonus points</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-amber-400">25 Referrals</p>
                    <p className="text-slate-300">+2500 bonus points</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Referrals */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <span>Recent Referrals</span>
              </h3>
              
              {referralStats.totalReferrals > 0 ? (
                <div className="space-y-4">
                  {userData?.referralStats?.referralHistory && userData.referralStats.referralHistory.length > 0 ? (
                    userData.referralStats.referralHistory.map((referral, index) => (
                      <div key={referral.id || index} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-100">{referral.referredUserEmail}</p>
                              <p className="text-sm text-slate-400">
                                Joined {formatDate(referral.completedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 text-green-400">
                              <span className="text-lg">🎯</span>
                              <span className="font-bold">+{referral.pointsEarned} pts</span>
                            </div>
                            <div className="flex items-center space-x-2 text-blue-400">
                              <span className="text-lg">💡</span>
                              <span className="text-sm">+{referral.hintsEarned} hint</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            referral.status === 'completed' 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          }`}>
                            {referral.status === 'completed' ? '✅ Completed' : '⏳ Pending'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-slate-400">Loading referral history...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-slate-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-100 mb-2">No Referrals Yet</h4>
                  <p className="text-slate-400 mb-6">Start sharing your referral code to see your progress here!</p>
                  <button
                    onClick={copyReferralCode}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Copy Referral Code
                  </button>
                </div>
              )}
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
      
      </div> {/* Close relative z-10 container */}

      {/* Modals */}
      <DailyLoginModal 
        isOpen={isDailyLoginModalOpen} 
        onClose={() => setIsDailyLoginModalOpen(false)} 
      />
      <EnhancedReferralModal 
        isOpen={isReferralModalOpen} 
        onClose={() => setIsReferralModalOpen(false)} 
      />
    </section>
  );
};
