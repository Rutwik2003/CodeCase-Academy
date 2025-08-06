import React, { useState } from 'react';
import { Clock, Star, Lock, CheckCircle } from 'lucide-react';
import { UnlockModal } from './UnlockModal';
import { useUnlockSystem } from '../contexts/UnlockSystemContext';
import { useAuth } from '../contexts/AuthContext';
import { showAlert } from './CustomAlert';

interface CasePreviewProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  cluePoints: number;
  onSelect?: () => void;
  'data-case-id'?: string;
  isComingSoon?: boolean;
}

export const CasePreview: React.FC<CasePreviewProps> = ({
  id,
  title,
  description,
  difficulty,
  duration,
  cluePoints,
  onSelect,
  isComingSoon = false
}) => {
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const { unlockedCases, unlockCase } = useUnlockSystem();
  const { userData, currentUser } = useAuth();

  const isLocked = !unlockedCases.includes(id);
  
  // Check for completion - handle both new and legacy case IDs for tutorial
  // Only show as completed if user is logged in AND has completed the case
  const isCompleted = currentUser && userData && (
    userData.completedCases?.includes(id) || 
    (id === 'case-vanishing-blogger' && userData.completedCases?.includes('case-tutorial'))
  ) || false;
    
  const userPoints = userData?.totalPoints || 0;

    // Enhanced debug logging for tutorial case - COMMENTED FOR PRODUCTION
    // if (id === 'case-vanishing-blogger') {
    //   logger.info('CasePreview debug for tutorial:', {
    //     id,
    //     isCompleted,
    //     completedCases: userData?.completedCases,
    //     userDataExists: !!userData,
    //     arrayIncludes: userData?.completedCases?.includes(id),
    //     arrayContents: userData?.completedCases?.map((caseId, index) => ({ index, caseId, type: typeof caseId, length: caseId?.length })),
    //     exactMatch: userData?.completedCases?.find(caseId => caseId === 'case-vanishing-blogger'),
    //     stringComparison: userData?.completedCases?.map(caseId => ({
    //       stored: caseId,
    //       target: 'case-vanishing-blogger',
    //       equal: caseId === 'case-vanishing-blogger',
    //       strictEqual: caseId === id
    //     }))
    //   }, LogCategory.COMPONENT);
    // }

  // Calculate unlock cost
  const getUnlockCost = () => {
    const baseCost = cluePoints * 2;
    switch (difficulty) {
      case 'Beginner': return baseCost;
      case 'Intermediate': return Math.floor(baseCost * 1.5);
      case 'Advanced': return baseCost * 2;
      default: return baseCost;
    }
  };

  const unlockCost = getUnlockCost();

  const handleButtonClick = () => {
    if (isComingSoon) {
      showAlert(`🚧 "${title}" is currently under development!\n\nOur detectives are working hard to prepare this case for you. Check back soon for an amazing new mystery to solve!\n\n💡 Try the other available cases while you wait.`, {
        title: 'Case Under Development'
      });
      return;
    }
    
    if (isLocked) {
      setShowUnlockModal(true);
    } else {
      onSelect?.();
    }
  };

  const handleCloseModal = () => {
    setShowUnlockModal(false);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'text-emerald-300 bg-emerald-900/30 border-emerald-500/30';
      case 'Intermediate': return 'text-amber-300 bg-amber-900/30 border-amber-500/30';
      case 'Advanced': return 'text-red-300 bg-red-900/30 border-red-500/30';
      default: return 'text-slate-300 bg-slate-900/30 border-slate-500/30';
    }
  };

  return (
    <>
      <div 
        data-case-id={id}
        className={`
        relative overflow-hidden
        bg-gradient-to-br ${isComingSoon ? 'from-slate-900/40 via-slate-800/30 to-slate-900/50' : isCompleted ? 'from-emerald-900/20 via-slate-800/30 to-emerald-900/20' : 'from-slate-900/40 via-slate-800/30 to-slate-900/50'}
        ${isComingSoon ? 'dark:from-slate-950/60 dark:via-slate-900/40 dark:to-black/50' : isCompleted ? 'dark:from-emerald-950/30 dark:via-slate-900/40 dark:to-emerald-950/30' : 'dark:from-slate-950/60 dark:via-slate-900/40 dark:to-black/50'}
        backdrop-blur-md backdrop-saturate-150
        border ${isComingSoon ? 'border-slate-600/40 dark:border-slate-500/30' : isCompleted ? 'border-emerald-700/30 dark:border-emerald-600/20' : 'border-slate-700/50 dark:border-slate-600/30'}
        rounded-2xl shadow-2xl
        p-6 transition-all duration-500 ease-out
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]
        ${isComingSoon ? 'hover:border-slate-500/40 hover:from-slate-800/50' : isCompleted ? 'hover:border-emerald-500/40 hover:from-emerald-800/50' : 'hover:border-amber-500/40 hover:from-slate-800/50'} hover:bg-gradient-to-br hover:via-slate-700/40 ${isComingSoon ? 'hover:to-slate-800/60' : isCompleted ? 'hover:to-emerald-800/60' : 'hover:to-slate-800/60'}
        group cursor-pointer
        ${isComingSoon ? 'opacity-75 hover:opacity-85' : isLocked ? 'opacity-80 hover:opacity-90' : 'hover:scale-[1.02]'}
        before:absolute before:inset-0 before:bg-gradient-to-br 
        ${isComingSoon ? 'before:from-slate-500/5' : isCompleted ? 'before:from-emerald-500/5' : 'before:from-amber-500/5'} before:via-transparent before:to-blue-500/5
        before:opacity-0 before:transition-opacity before:duration-500
        before:hover:opacity-100
      `}>
        
        {/* Detective Case File Header */}
        <div className="relative z-10 flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Case File #{id.slice(-4)}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 dark:text-slate-50 mb-3 flex items-center gap-3 group-hover:text-amber-100 transition-colors duration-300">
              {title}
              {isCompleted && (
                <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-4 h-4 text-emerald-400 drop-shadow-lg" />
                  <span className="text-xs font-medium text-emerald-300 animate-pulse">Solved</span>
                </div>
              )}
              {isLocked && <Lock className="w-5 h-5 text-amber-400 drop-shadow-lg" />}
            </h3>
            <p className="text-slate-300 dark:text-slate-400 text-sm mb-4 leading-relaxed font-light">
              {description}
            </p>
          </div>
        </div>

        {/* Case Details with Detective Theme */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border backdrop-blur-sm ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-slate-600/30">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-mono">{duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-amber-300 bg-amber-900/20 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-amber-500/30">
            <Star className="w-4 h-4 text-amber-400 drop-shadow-lg" />
            <span className="font-semibold">{cluePoints} pts</span>
          </div>
        </div>

        {/* Action Button with Detective Styling */}
        <button 
          onClick={handleButtonClick}
          className={`
            relative w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider
            transition-all duration-500 ease-out transform
            backdrop-blur-sm border shadow-lg
            group-hover:scale-[1.02] active:scale-[0.98]
            ${isComingSoon
              ? 'bg-gradient-to-r from-slate-600/80 via-slate-500/80 to-slate-600/80 hover:from-slate-500/90 hover:via-slate-400/90 hover:to-slate-500/90 text-white border-slate-400/50 shadow-slate-500/25 hover:shadow-slate-400/40 cursor-pointer'
              : isLocked 
              ? 'bg-gradient-to-r from-blue-600/80 via-blue-500/80 to-purple-600/80 hover:from-blue-500/90 hover:via-blue-400/90 hover:to-purple-500/90 text-white border-blue-400/50 shadow-blue-500/25 hover:shadow-blue-400/40' 
              : isCompleted
              ? 'bg-gradient-to-r from-emerald-600/80 via-emerald-500/80 to-teal-600/80 hover:from-emerald-500/90 hover:via-emerald-400/90 hover:to-teal-500/90 text-white border-emerald-400/50 shadow-emerald-500/25 hover:shadow-emerald-400/40'
              : 'bg-gradient-to-r from-amber-600/80 via-yellow-500/80 to-amber-600/80 hover:from-amber-500/90 hover:via-yellow-400/90 hover:to-amber-500/90 text-black border-amber-400/50 shadow-amber-500/25 hover:shadow-amber-400/40'
            }
            before:absolute before:inset-0 before:bg-white/10 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
          `}
        >
          <div className="relative z-10 flex items-center justify-center space-x-3">
            {isComingSoon ? (
              <>
                <Clock className="w-5 h-5 drop-shadow-lg" />
                <span className="font-mono">Coming Soon</span>
              </>
            ) : isLocked ? (
              <>
                <Lock className="w-5 h-5 drop-shadow-lg" />
                <span className="font-mono">Unlock for {unlockCost} pts</span>
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle className="w-5 h-5 drop-shadow-lg" />
                <span>Case Solved</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                </div>
                <span>Start Investigation</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Unlock Modal */}
      <UnlockModal
        isOpen={showUnlockModal}
        onClose={handleCloseModal}
        caseTitle={title}
        caseId={id}
        unlockCost={unlockCost}
        difficulty={difficulty}
        duration={duration}
        description={description}
        userPoints={userPoints}
        onUnlock={unlockCase}
      />
    </>
  );
};