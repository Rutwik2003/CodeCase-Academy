// Achievement System Utilities
// This file provides utilities for managing achievements and evidence collection

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  category: 'Getting Started' | 'Cases' | 'Milestones' | 'Skills' | 'Progression' | 'Special';
  unlockCondition: (userData: any) => boolean;
}

// All available achievements
export const allAchievements: Achievement[] = [
  // Getting Started
  {
    id: 'first-detective',
    name: 'First Detective',
    icon: '🕵️',
    description: 'Started your first case',
    rarity: 'common',
    points: 50,
    category: 'Getting Started',
    unlockCondition: (userData) => (userData?.completedCases?.length || 0) > 0
  },
  {
    id: 'tutorial-master',
    name: 'Tutorial Master',
    icon: '🎓',
    description: 'Completed the tutorial case',
    rarity: 'common',
    points: 100,
    category: 'Getting Started',
    unlockCondition: (userData) => userData?.completedCases?.includes('case-vanishing-blogger') || false
  },

  // Case-Specific Achievements
  {
    id: 'vanishing-blogger-solved',
    name: 'Vanishing Blogger Detective',
    icon: '📰',
    description: 'Solved the Vanishing Blogger case',
    rarity: 'common',
    points: 200,
    category: 'Cases',
    unlockCondition: (userData) => userData?.completedCases?.includes('case-vanishing-blogger') || false
  },
  {
    id: 'social-media-investigator',
    name: 'Social Media Investigator',
    icon: '📱',
    description: 'Solved the Social Media Stalker case',
    rarity: 'uncommon',
    points: 300,
    category: 'Cases',
    unlockCondition: (userData) => userData?.completedCases?.includes('case-social-media-stalker') || false
  },
  {
    id: 'corporate-sleuth',
    name: 'Corporate Sleuth',
    icon: '🏢',
    description: 'Solved the Corporate Sabotage case',
    rarity: 'uncommon',
    points: 400,
    category: 'Cases',
    unlockCondition: (userData) => userData?.completedCases?.includes('case-corporate-sabotage') || false
  },
  {
    id: 'dating-app-detective',
    name: 'Dating App Detective',
    icon: '💕',
    description: 'Solved the Dating App Disaster case',
    rarity: 'rare',
    points: 500,
    category: 'Cases',
    unlockCondition: (userData) => userData?.completedCases?.includes('case-dating-app-disaster') || false
  },
  {
    id: 'e-commerce-expert',
    name: 'E-Commerce Expert',
    icon: '🛒',
    description: 'Solved the E-Commerce Fraud case',
    rarity: 'rare',
    points: 600,
    category: 'Cases',
    unlockCondition: (userData) => userData?.completedCases?.includes('case-ecommerce-fraud') || false
  },
  {
    id: 'gaming-guru',
    name: 'Gaming Guru',
    icon: '🎮',
    description: 'Solved the Gaming Platform Hack case',
    rarity: 'epic',
    points: 750,
    category: 'Cases',
    unlockCondition: (userData) => userData?.completedCases?.includes('case-gaming-platform-hack') || false
  },

  // Milestone Achievements
  {
    id: 'detective-expert',
    name: 'Detective Expert',
    icon: '🏆',
    description: 'Completed 3 cases',
    rarity: 'rare',
    points: 500,
    category: 'Milestones',
    unlockCondition: (userData) => (userData?.completedCases?.length || 0) >= 3
  },
  {
    id: 'case-closer',
    name: 'Case Closer',
    icon: '📁',
    description: 'Completed 5 cases',
    rarity: 'rare',
    points: 1000,
    category: 'Milestones',
    unlockCondition: (userData) => (userData?.completedCases?.length || 0) >= 5
  },
  {
    id: 'master-detective',
    name: 'Master Detective',
    icon: '👑',
    description: 'Solved all available cases',
    rarity: 'legendary',
    points: 2000,
    category: 'Milestones',
    unlockCondition: (userData) => (userData?.completedCases?.length || 0) >= 6
  },

  // Skills
  {
    id: 'hint-master',
    name: 'Hint Master',
    icon: '💡',
    description: 'Earned 10 hints',
    rarity: 'uncommon',
    points: 200,
    category: 'Skills',
    unlockCondition: (userData) => (userData?.hints || 0) >= 10
  },
  {
    id: 'evidence-collector',
    name: 'Evidence Collector',
    icon: '📋',
    description: 'Collected 10 pieces of evidence',
    rarity: 'rare',
    points: 750,
    category: 'Skills',
    unlockCondition: (userData) => (userData?.evidence?.length || 0) >= 10
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    icon: '⚡',
    description: 'Completed a case in under 10 minutes',
    rarity: 'epic',
    points: 1500,
    category: 'Skills',
    unlockCondition: (userData) => (userData?.statistics?.averageCaseTime || Infinity) < 600
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    icon: '🔥',
    description: 'Completed 3 cases in a row',
    rarity: 'rare',
    points: 800,
    category: 'Skills',
    unlockCondition: (userData) => (userData?.statistics?.currentStreak || 0) >= 3
  },

  // Progression
  {
    id: 'code-buster-pro',
    name: 'CodeCase Pro',
    icon: '⭐',
    description: 'Reached level 5',
    rarity: 'epic',
    points: 1000,
    category: 'Progression',
    unlockCondition: (userData) => (userData?.level || 0) >= 5
  },
  {
    id: 'elite-investigator',
    name: 'Elite Investigator',
    icon: '💎',
    description: 'Reached level 10',
    rarity: 'legendary',
    points: 2500,
    category: 'Progression',
    unlockCondition: (userData) => (userData?.level || 0) >= 10
  },
  {
    id: 'point-collector',
    name: 'Point Collector',
    icon: '🎯',
    description: 'Earned 5000 total points',
    rarity: 'rare',
    points: 500,
    category: 'Progression',
    unlockCondition: (userData) => (userData?.totalPoints || 0) >= 5000
  },
  {
    id: 'veteran-detective',
    name: 'Veteran Detective',
    icon: '🎖️',
    description: 'Earned 10000 total points',
    rarity: 'epic',
    points: 1000,
    category: 'Progression',
    unlockCondition: (userData) => (userData?.totalPoints || 0) >= 10000
  }
];

// Check which achievements should be unlocked for a user
export const checkPendingAchievements = (userData: any): Achievement[] => {
  if (!userData) return [];

  return allAchievements.filter(achievement => 
    achievement.unlockCondition(userData) && 
    !userData.achievements?.includes(achievement.id)
  );
};

// Get case display title
export const getCaseTitle = (caseId: string): string => {
  const caseTitles: Record<string, string> = {
    'case-vanishing-blogger': 'The Vanishing Blogger',
    'visual-vanishing-blogger': 'Vanishing Blogger: Visual Investigation',
    'case-social-media-stalker': 'Social Media Stalker',
    'case-corporate-sabotage': 'Corporate Sabotage', 
    'case-dating-app-disaster': 'Dating App Disaster',
    'case-ecommerce-fraud': 'E-Commerce Fraud',
    'case-gaming-platform-hack': 'Gaming Platform Hack'
  };
  return caseTitles[caseId] || caseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Get all available case IDs
export const getAllCaseIds = (): string[] => {
  return [
    'case-vanishing-blogger',
    'visual-vanishing-blogger',
    'case-social-media-stalker', 
    'case-corporate-sabotage',
    'case-dating-app-disaster',
    'case-ecommerce-fraud',
    'case-gaming-platform-hack'
  ];
};
