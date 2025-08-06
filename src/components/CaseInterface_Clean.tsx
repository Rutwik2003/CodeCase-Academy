import React, { useState, useCallback } from 'react';
import { ArrowLeft, Star, Clock, Target, Send, Code2, Monitor, Search } from 'lucide-react';
import { SmartCodeEditor } from './SmartCodeEditor';
import { EnhancedAIPartner } from './EnhancedAIPartner';
import { ProgressBar } from './ProgressBar';
import { CaseCompletion } from './CaseCompletion';
import { Toast } from './Toast';
import { DetectiveHintsModal } from './DetectiveHintsModal';
import { useAuth } from '../contexts/AuthContext';
import { validateCase } from '../utils/caseValidator';
import { logger, LogCategory } from '../utils/logger';

interface CaseData {
  id: string;
  title: string;
  description: string;
  story: string;
  objective: string;
  initialHtml: string;
  initialCss: string;
  targetHtml: string;
  targetCss: string;
  hints: string[];
  cluePoints: number;
}

interface CaseInterfaceProps {
  caseData: CaseData;
  onBack: () => void;
  onComplete: (points: number) => void;
}

export const CaseInterface: React.FC<CaseInterfaceProps> = ({
  caseData,
  onBack,
  onComplete
}) => {
  const { addEvidence, completeCase, unlockAchievement } = useAuth();
  const [currentHtml, setCurrentHtml] = useState(caseData.initialHtml);
  const [currentCss, setCurrentCss] = useState(caseData.initialCss);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string; timestamp: Date }>>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [validationResult, setValidationResult] = useState(validateCase(caseData.id, caseData.initialHtml, caseData.initialCss, caseData.targetHtml, caseData.targetCss));
  const [activeEditorTab, setActiveEditorTab] = useState<'html' | 'css'>('html');
  const [toastMessage, setToastMessage] = useState('');
  const [isDetectiveModalOpen, setIsDetectiveModalOpen] = useState(false);
  const [caseStartTime] = useState(Date.now());

  // Calculate available hints
  const totalHints = caseData.hints ? caseData.hints.length : 0;
  const hintsRemaining = Math.max(0, totalHints - hintIndex);

  const handleCodeChange = useCallback((newHtml: string, newCss: string) => {
    setCurrentHtml(newHtml);
    setCurrentCss(newCss);
    
    const result = validateCase(caseData.id, newHtml, newCss, caseData.targetHtml, caseData.targetCss);
    setValidationResult(result);
    
    if (result.score >= result.maxScore || result.score >= 90) {
      setShowCompletion(true);
    }
  }, [caseData.id, caseData.targetHtml, caseData.targetCss]);

  const handleAIToggle = () => {
    setIsAIOpen(!isAIOpen);
    
    if (!isAIOpen && messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage = {
          type: 'ai' as const,
          content: `🤖 **Hello! I'm Detective Claude, your AI coding partner!** 

Welcome to this coding case! I'm here to help you solve it step by step.

**🎯 What I can do for you:**
• **Code Analysis** - I'll watch your code and suggest improvements
• **Educational Guidance** - Learn modern web development best practices
• **Smart Problem Solving** - Get hints without giving away the solution

**Ready to begin?** Ask me anything! 🔍`,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }, 500);
    }
  };

  const handleSendMessage = (message: string) => {
    const newMessage = { type: 'user' as const, content: message, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      const aiResponse = {
        type: 'ai' as const,
        content: `I understand you're asking: "${message}". Let me analyze your current code and provide some guidance!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleComplete = async () => {
    const points = validationResult.score;
    const timeSpent = Math.floor((Date.now() - caseStartTime) / 1000); // in seconds
    
    try {
      // Complete the case with statistics tracking
      const result = await completeCase(caseData.id, points, timeSpent);
      
      // Add evidence for this case - only if it's not a repeat tutorial
      if (!(result.isRepeat && caseData.id === 'case-vanishing-blogger')) {
        await addEvidence({
          caseId: caseData.id,
          title: `Solution Evidence: ${caseData.title}`,
          description: `Code evidence and solution for the ${caseData.title} detective case`,
          type: 'code',
          content: `Final HTML:\n${currentHtml}\n\nFinal CSS:\n${currentCss}`,
          importance: points > 80 ? 'high' : points > 60 ? 'medium' : 'low'
        });
      }
      
      // Check for achievements - only if points were awarded
      if (result.pointsAwarded >= 90) {
        await unlockAchievement('perfect-detective');
      }
      if (result.pointsAwarded >= 100) {
        await unlockAchievement('master-solver');
      }
    } catch (error) {
      // logger.error('Error completing case:', error, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
    }
    
    onComplete(points); // Pass original points for UI display
  };

  const handleDetectiveHints = () => {
    setIsDetectiveModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-amber-500/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-amber-500 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-amber-500">{caseData.title}</h1>
              <p className="text-slate-300 text-sm">{caseData.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Detective Hints Button */}
            <button
              onClick={handleDetectiveHints}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-amber-500/25"
            >
              <Search className="w-4 h-4" />
              Detective Hints ({hintsRemaining})
            </button>
            
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Star className="w-4 h-4 text-amber-500" />
              <span>{caseData.cluePoints} points</span>
            </div>
          </div>
        </div>
        
        {/* Progress */}
        <div className="mt-4">
          <ProgressBar 
            progress={validationResult.score} 
            maxProgress={100}
            showLabel={true}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 h-[calc(100vh-120px)]">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <SmartCodeEditor
            initialHtml={currentHtml}
            initialCss={currentCss}
            onCodeChange={handleCodeChange}
            validationResult={validationResult}
            activeTab={activeEditorTab}
            onTabChange={setActiveEditorTab}
            caseData={caseData}
            onDetectiveHints={handleDetectiveHints}
          />
        </div>

        {/* AI Partner */}
        {isAIOpen && (
          <div className="w-96 border-l border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <EnhancedAIPartner
              messages={messages}
              onSendMessage={handleSendMessage}
              onClose={() => setIsAIOpen(false)}
              validationResult={validationResult}
              currentHtml={currentHtml}
              currentCss={currentCss}
            />
          </div>
        )}

        {/* AI Toggle Button */}
        {!isAIOpen && (
          <button
            onClick={handleAIToggle}
            className="fixed right-6 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-500 text-white p-3 rounded-l-lg shadow-lg transition-all duration-200 z-10"
          >
            <Code2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Detective Hints Modal */}
      <DetectiveHintsModal
        isOpen={isDetectiveModalOpen}
        onClose={() => setIsDetectiveModalOpen(false)}
        hints={caseData.hints || []}
        hintIndex={hintIndex}
        onNextHint={() => {
          if (hintIndex < totalHints) {
            setHintIndex(prev => prev + 1);
            setToastMessage(`🕵️ Detective Clue #${hintIndex + 1} discovered!`);
          }
        }}
        caseTitle={caseData.title}
      />

      {/* Case Completion Modal */}
      {showCompletion && (
        <CaseCompletion
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          onContinue={handleComplete}
          score={validationResult.score}
          feedback={validationResult.feedback}
          caseTitle={caseData.title}
        />
      )}

      {/* Toast Notifications */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};
