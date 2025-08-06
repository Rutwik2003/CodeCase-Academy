import React from 'react';
import { BookOpen } from 'lucide-react';
import { CasePreview } from './CasePreview';
import { cases } from '../data/cases';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import { GuideHighlight } from './GuidePointer';

interface CasesSectionProps {
  onCaseSelect?: (caseId: string) => void;
  onLearnClick?: () => void;
}

export const CasesSection: React.FC<CasesSectionProps> = ({ onCaseSelect, onLearnClick }) => {
  const { userData, currentUser } = useAuth();
  const { shouldShowOnboarding } = useOnboarding();
  
  // Show guide highlights for new users who haven't completed onboarding
  const showGuideHighlights = currentUser && shouldShowOnboarding;
  
  // This will be used to force re-render of CasePreview components when userData changes
  return (
    <section id="cases" className="relative min-h-screen py-20">
      {/* Detective atmosphere background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90"></div>
      <div className="absolute inset-0 backdrop-blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
            <span className="text-sm font-mono text-slate-400 uppercase tracking-[0.2em]">Detective Archives</span>
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-lg shadow-amber-400/50"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-100 mb-6 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent">
            Active Case Files
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Each case is meticulously crafted to teach specific HTML/CSS forensics while immersing you 
            in compelling detective mysteries that challenge your analytical skills.
          </p>
          <button
            id="training-academy-button"
            onClick={onLearnClick}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-600/80 via-yellow-500/80 to-amber-600/80 hover:from-amber-500/90 hover:via-yellow-400/90 hover:to-amber-500/90 text-black px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-500 transform hover:scale-105 backdrop-blur-sm border border-amber-400/50 shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40"
          >
            <BookOpen className="w-5 h-5" />
            <span>Access Training Academy</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {cases.map((caseData, index) => {
            // Check if this case is completed to force re-render when completion status changes
            // Only show as completed if user is logged in AND has completed the case
            const isCompleted = currentUser && userData?.completedCases?.includes(caseData.id) || false;
            // Use a key that includes the completion status, user login status and total completed cases to force re-render when it changes
            const completedCasesCount = userData?.completedCases?.length || 0;
            const userLoginStatus = currentUser ? 'logged-in' : 'logged-out';
            
            // Highlight the first case (tutorial) for new users
            const shouldHighlight = showGuideHighlights && index === 0 && caseData.id === 'case-vanishing-blogger';
            
            const caseElement = (
              <CasePreview 
                key={`${caseData.id}-${isCompleted}-${completedCasesCount}-${userLoginStatus}`} 
                {...caseData} 
                onSelect={() => onCaseSelect?.(caseData.id)}
                data-case-id={caseData.id}
              />
            );
            
            if (shouldHighlight) {
              return (
                <GuideHighlight
                  key={`guide-${caseData.id}`}
                  isVisible={true}
                  message="Start here! This is your first detective case. Click to begin solving mysteries by fixing code! 🕵️‍♀️"
                  pointerPosition="top"
                  showPlayIcon={true}
                  onPointerClick={() => onCaseSelect?.(caseData.id)}
                  pulseColor="amber"
                >
                  {caseElement}
                </GuideHighlight>
              );
            }
            
            return caseElement;
          })}
        </div>

        {/* Detective Command Center Info */}
        <div className="text-center">
          <div className="relative bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-bold text-amber-300 font-mono uppercase tracking-wider">
                  Case Unlocking Protocol
                </h3>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-600/30">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                  <span className="text-slate-300 font-medium">Complete missions to earn investigation points</span>
                </div>
                <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-600/30">
                  <div className="w-3 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"></div>
                  <span className="text-slate-300 font-medium">Spend points to unlock classified case files</span>
                </div>
                <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-lg border border-slate-600/30">
                  <div className="w-3 h-3 bg-red-400 rounded-full shadow-lg shadow-red-400/50"></div>
                  <span className="text-slate-300 font-medium">Advanced cases require higher clearance levels</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};