import React, { useState, useEffect } from 'react';
import { X, Target, Gift, Calendar, Star, Flame, CheckCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

interface DailyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginReward {
  day: number;
  type: 'points' | 'hints' | 'achievement';
  amount: number;
  title: string;
  description: string;
  icon: string;
  special?: boolean;
}

const loginRewards: LoginReward[] = [
  { day: 1, type: 'points', amount: 100, title: 'First Day', description: 'Welcome bonus', icon: '👋', special: false },
  { day: 2, type: 'hints', amount: 1, title: 'Second Day', description: 'Helpful hint', icon: '💡', special: false },
  { day: 3, type: 'points', amount: 150, title: 'Third Day', description: 'Keep going!', icon: '🔍', special: false },
  { day: 4, type: 'hints', amount: 1, title: 'Fourth Day', description: 'Another clue', icon: '🕵️', special: false },
  { day: 5, type: 'points', amount: 200, title: 'Fifth Day', description: 'Week warrior', icon: '⭐', special: true },
  { day: 6, type: 'hints', amount: 2, title: 'Sixth Day', description: 'Double hints', icon: '🔮', special: false },
  { day: 7, type: 'points', amount: 300, title: 'Week Complete', description: 'Weekly bonus', icon: '🏆', special: true },
  { day: 8, type: 'hints', amount: 1, title: 'Eighth Day', description: 'Back for more', icon: '🎯', special: false },
  { day: 9, type: 'points', amount: 200, title: 'Ninth Day', description: 'Persistence pays', icon: '💎', special: false },
  { day: 10, type: 'points', amount: 250, title: 'Tenth Day', description: 'Double digits!', icon: '🔟', special: true },
  { day: 11, type: 'hints', amount: 2, title: 'Eleventh Day', description: 'Helpful boost', icon: '🚀', special: false },
  { day: 12, type: 'points', amount: 200, title: 'Twelfth Day', description: 'Steady progress', icon: '📈', special: false },
  { day: 13, type: 'hints', amount: 1, title: 'Thirteenth Day', description: 'Lucky hint', icon: '🍀', special: false },
  { day: 14, type: 'points', amount: 400, title: 'Two Weeks', description: 'Fortnight champion', icon: '🥇', special: true },
  { day: 15, type: 'hints', amount: 3, title: 'Fifteenth Day', description: 'Triple hints', icon: '🎁', special: true },
  { day: 16, type: 'points', amount: 250, title: 'Sixteenth Day', description: 'Halfway hero', icon: '⚡', special: false },
  { day: 17, type: 'hints', amount: 1, title: 'Seventeenth Day', description: 'Keep investigating', icon: '🔍', special: false },
  { day: 18, type: 'points', amount: 300, title: 'Eighteenth Day', description: 'Almost there', icon: '🎯', special: false },
  { day: 19, type: 'hints', amount: 2, title: 'Nineteenth Day', description: 'Clue collector', icon: '📝', special: false },
  { day: 20, type: 'points', amount: 500, title: 'Twenty Days', description: 'Major milestone', icon: '🏅', special: true },
  { day: 21, type: 'hints', amount: 2, title: 'Twenty-first Day', description: 'Three weeks strong', icon: '💪', special: true },
  { day: 22, type: 'points', amount: 300, title: 'Twenty-second Day', description: 'Detective dedication', icon: '🎖️', special: false },
  { day: 23, type: 'hints', amount: 1, title: 'Twenty-third Day', description: 'Almost a month', icon: '📅', special: false },
  { day: 24, type: 'points', amount: 350, title: 'Twenty-fourth Day', description: 'Final stretch', icon: '🏃', special: false },
  { day: 25, type: 'hints', amount: 3, title: 'Twenty-fifth Day', description: 'Final week boost', icon: '🚀', special: true },
  { day: 26, type: 'points', amount: 400, title: 'Twenty-sixth Day', description: 'Nearing the end', icon: '🔥', special: false },
  { day: 27, type: 'hints', amount: 2, title: 'Twenty-seventh Day', description: 'Last few days', icon: '⏰', special: false },
  { day: 28, type: 'points', amount: 500, title: 'Twenty-eighth Day', description: 'Almost legendary', icon: '👑', special: true },
  { day: 29, type: 'hints', amount: 4, title: 'Twenty-ninth Day', description: 'Tomorrow is the day!', icon: '🎊', special: true },
  { day: 30, type: 'achievement', amount: 1000, title: 'Month Master', description: 'Legendary detective!', icon: '🏆', special: true }
];

export const DailyLoginModal: React.FC<DailyLoginModalProps> = ({ isOpen, onClose }) => {
  const { userData, refreshUserData } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [canClaimToday, setCanClaimToday] = useState(false);
  const [todaysClaimed, setTodaysClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<string>('');

  // Helper function to calculate time difference in hours
  const getHoursDifference = (date1: Date, date2: Date) => {
    return Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
  };

  // Helper function to format time remaining
  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return '';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  useEffect(() => {
    if (userData && isOpen) {
      const now = new Date();
      
      // Get last claim timestamp from Firebase
      const lastClaimDate = userData.lastClaimDate ? 
        (userData.lastClaimDate instanceof Timestamp ? 
          userData.lastClaimDate.toDate() : 
          new Date(userData.lastClaimDate)) : null;

      let currentStreakValue = userData.loginStreak || 0;
      let canClaim = false;
      let alreadyClaimed = false;
      let nextClaim: Date | null = null;

      if (lastClaimDate) {
        const hoursSinceLastClaim = getHoursDifference(lastClaimDate, now);
        
        // Check if 24 hours have passed since last claim
        if (hoursSinceLastClaim >= 24) {
          canClaim = true;
          
          // Check if streak should continue or reset
          if (hoursSinceLastClaim > 48) { // More than 48 hours = streak broken
            currentStreakValue = 0;
          }
        } else {
          // Still in cooldown period
          alreadyClaimed = true;
          nextClaim = new Date(lastClaimDate.getTime() + (24 * 60 * 60 * 1000));
        }
      } else {
        // First time claiming
        canClaim = true;
      }

      setCurrentStreak(currentStreakValue);
      setCanClaimToday(canClaim);
      setTodaysClaimed(alreadyClaimed);
      setNextClaimTime(nextClaim);
    }
  }, [userData, isOpen]);

  // Update countdown timer
  useEffect(() => {
    if (nextClaimTime) {
      const interval = setInterval(() => {
        const remaining = formatTimeRemaining(nextClaimTime);
        setTimeUntilNextClaim(remaining);
        
        // Check if time has passed
        if (new Date() >= nextClaimTime) {
          setCanClaimToday(true);
          setTodaysClaimed(false);
          setNextClaimTime(null);
          setTimeUntilNextClaim('');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nextClaimTime]);

  const claimDailyReward = async () => {
    if (!userData || !canClaimToday || todaysClaimed || isLoading) return;

    setIsLoading(true);
    
    try {
      // Double-check on server side to prevent race conditions
      const now = new Date();
      const lastClaimDate = userData.lastClaimDate ? 
        (userData.lastClaimDate instanceof Timestamp ? 
          userData.lastClaimDate.toDate() : 
          new Date(userData.lastClaimDate)) : null;

      // Server-side validation: ensure 24 hours have passed
      if (lastClaimDate) {
        const hoursSinceLastClaim = getHoursDifference(lastClaimDate, now);
        if (hoursSinceLastClaim < 24) {
          toast.error('You must wait 24 hours between claims!');
          setIsLoading(false);
          return;
        }
      }

      // Calculate new streak (server-side logic)
      let newStreak = (userData.loginStreak || 0) + 1;
      
      // Check if streak should reset due to gap > 48 hours
      if (lastClaimDate) {
        const hoursSinceLastClaim = getHoursDifference(lastClaimDate, now);
        if (hoursSinceLastClaim > 48) {
          newStreak = 1; // Reset to 1 (this claim)
        }
      }

      // Cap at 30 days
      newStreak = Math.min(newStreak, 30);
      const reward = loginRewards[newStreak - 1];

      // Calculate new values
      const newTotalPoints = reward.type === 'points' || reward.type === 'achievement' 
        ? (userData.totalPoints || 0) + reward.amount 
        : userData.totalPoints || 0;
      
      const newHints = reward.type === 'hints' 
        ? (userData.hints || 0) + reward.amount 
        : userData.hints || 0;
      
      const newAchievements = reward.type === 'achievement' 
        ? [...(userData.achievements || []), 'month-master']
        : userData.achievements || [];

      // Use server timestamp to prevent client-side manipulation
      const updates: any = {
        loginStreak: newStreak,
        lastLoginStreak: serverTimestamp(), // Server timestamp
        lastClaimDate: serverTimestamp(),   // Server timestamp
        totalPoints: newTotalPoints,
        hints: newHints,
        achievements: newAchievements
      };

      // Log the update for debugging
      /*
      // logger.info('Daily Login Reward Update:', { // COMMENTED FOR PRODUCTION // COMMENTED FOR PRODUCTION
        currentPoints: userData.totalPoints,
        rewardAmount: reward.amount,
        newPoints: newTotalPoints,
        currentHints: userData.hints,
        newHints: newHints,
        newStreak,
        rewardType: reward.type,
        lastClaimWas: lastClaimDate ? lastClaimDate.toISOString() : 'never',
        hoursSinceLastClaim: lastClaimDate ? getHoursDifference(lastClaimDate, now) : 'N/A'
      }, LogCategory.COMPONENT);
      */

      // Update Firebase with server timestamp
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, updates);
      
      // Refresh user data from Firebase to get server timestamps
      await refreshUserData();
      
      // Update local state
      setCurrentStreak(newStreak);
      setTodaysClaimed(true);
      setCanClaimToday(false);
      
      // Set next claim time (24 hours from now)
      const nextClaim = new Date(now.getTime() + (24 * 60 * 60 * 1000));
      setNextClaimTime(nextClaim);

      toast.success(
        `Day ${newStreak} claimed! +${reward.amount} ${reward.type}${reward.type === 'achievement' ? ' + badge' : ''}`,
        {
          icon: reward.icon,
          duration: 4000,
        }
      );
      
    } catch (error) {
      // logger.error('Error claiming daily reward:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      toast.error('Failed to claim reward. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-700 max-w-sm sm:max-w-4xl lg:max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-700 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="p-2 sm:p-3 bg-amber-500/20 rounded-xl flex-shrink-0">
                  <Target className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-100 truncate">Daily Investigation</h2>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-400 hidden sm:block">Claim your daily detective rewards</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Current Streak Info */}
          <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl">
                  <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-100">{currentStreak} Days</p>
                  <p className="text-xs sm:text-sm text-slate-400">Current Streak</p>
                </div>
              </div>
              
              <div className="flex flex-col items-start sm:items-end space-y-2 w-full sm:w-auto">
                {canClaimToday && !todaysClaimed && (
                  <motion.button
                    onClick={claimDailyReward}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base"
                  >
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{isLoading ? 'Claiming...' : 'Claim Today\'s Reward'}</span>
                  </motion.button>
                )}
                
                {todaysClaimed && nextClaimTime && (
                  <div className="space-y-2 sm:space-y-3 w-full sm:w-auto">
                    <div className="flex items-center space-x-2 text-green-400 bg-green-500/20 px-3 sm:px-4 py-2 rounded-xl text-sm">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Reward claimed!</span>
                    </div>
                    <div className="text-center text-slate-400 bg-slate-800/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl">
                      <p className="text-xs mb-1">⏰ Next claim available in:</p>
                      <p className="text-sm sm:text-lg font-mono text-amber-400">{timeUntilNextClaim}</p>
                    </div>
                  </div>
                )}
                
                {!canClaimToday && !todaysClaimed && (
                  <div className="text-center text-slate-400 bg-slate-800/50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl w-full sm:w-auto">
                    <p className="text-xs sm:text-sm">⏰ Come back when your 24-hour cooldown is over!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
              {loginRewards.map((reward, index) => {
                const isCompleted = currentStreak >= reward.day;
                const isCurrent = currentStreak + 1 === reward.day && canClaimToday && !todaysClaimed;
                const isToday = currentStreak === reward.day && todaysClaimed;
                
                return (
                  <motion.div
                    key={reward.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                      isCompleted
                        ? 'bg-green-500/20 border-green-500/50'
                        : isCurrent
                        ? 'bg-amber-500/20 border-amber-500/50 ring-2 ring-amber-400/50'
                        : isToday
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    {/* Day Number */}
                    <div className="text-center mb-2 sm:mb-3">
                      <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                        isCompleted ? 'text-green-400' :
                        isCurrent ? 'text-amber-400' :
                        isToday ? 'text-blue-400' :
                        'text-slate-500'
                      }`}>
                        {reward.day}
                      </div>
                    </div>

                    {/* Reward Icon */}
                    <div className="text-center mb-1 sm:mb-2">
                      <div className="text-xl sm:text-2xl lg:text-3xl mb-1">{reward.icon}</div>
                      {reward.special && (
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 mx-auto" />
                      )}
                    </div>

                    {/* Reward Info */}
                    <div className="text-center">
                      <p className={`text-xs sm:text-sm font-medium truncate ${
                        isCompleted ? 'text-green-300' :
                        isCurrent ? 'text-amber-300' :
                        isToday ? 'text-blue-300' :
                        'text-slate-400'
                      }`} title={reward.title}>
                        {reward.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 sm:mt-1 truncate" title={`+${reward.amount} ${reward.type === 'achievement' ? 'pts + badge' : reward.type}`}>
                        +{reward.amount} {reward.type === 'achievement' ? 'pts + badge' : reward.type}
                      </p>
                    </div>

                    {/* Status Indicators */}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                        <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-400 bg-slate-900 rounded-full" />
                      </div>
                    )}
                    
                    {!isCompleted && !isCurrent && !isToday && (
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                        <Lock className="w-4 h-4 sm:w-6 sm:h-6 text-slate-600 bg-slate-900 rounded-full" />
                      </div>
                    )}

                    {isCurrent && (
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Gift className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400 bg-slate-900 rounded-full" />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 lg:p-6 border-t border-slate-700 bg-slate-800/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-xs sm:text-sm">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Login daily to maintain your streak</span>
                  <span className="sm:hidden">Daily login streak</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 text-slate-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-500"></div>
                  <span className="text-xs">Available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-slate-600"></div>
                  <span className="text-xs">Locked</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
