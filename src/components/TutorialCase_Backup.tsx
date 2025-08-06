import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star, Search, Monitor, CheckCircle, AlertCircle, Play, BookOpen, Trophy, Lightbulb, X, MousePointer, Target, Eye, Code2, Zap, ArrowRight } from 'lucide-react';
import { Toast } from './Toast';
import { CaseCompletion } from './CaseCompletion';
import { showConfirm } from './CustomAlert';

interface TutorialCaseProps {
  onComplete: (points: number) => void;
  onBack: () => void;
}

interface TooltipTarget {
  id: string;
  type: 'element' | 'line' | 'syntax';
  target: string; // CSS selector, line number, or syntax pattern
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  trigger: 'hover' | 'click' | 'auto';
  icon?: React.ReactNode;
  action?: string; // Action hint like "Click to fix" or "Replace this"
}

interface ValidationError {
  type: 'missing' | 'incorrect' | 'deprecated' | 'syntax';
  message: string;
  suggestion: string;
  line?: number;
  target?: string;
}

type TutorialStep = 
  | 'welcome' 
  | 'interface-overview'
  | 'score-display'
  | 'first-code-edit' 
  | 'get-hint-demo' 
  | 'code-validation'
  | 'completion';

interface TutorialStepData {
  id: TutorialStep;
  title: string;
  description: string;
  instruction: string;
  highlightElement?: string; // CSS selector for element to highlight
  tooltipText?: string;
  clickTarget?: string; // Where user should click
  code?: string;
  expectedCode?: string;
  validationFunction?: (code: string) => boolean;
  tip?: string;
  popupPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  tooltipTargets?: TooltipTarget[];
  expectedChanges?: string[];
  aiHint?: string;
  highlightLines?: { html?: number[]; css?: number[] };
  htmlCode?: string;
  cssCode?: string;
}

const tutorialSteps: TutorialStepData[] = [
  {
    id: 'welcome',
    title: 'Welcome to CodeCase Detective Academy!',
    description: 'Ready to become a web detective? Let\'s start your training!',
    instruction: 'Click the big "Start Training" button below to begin your detective journey.',
    popupPosition: 'center',
    tooltipTargets: [
      {
        id: 'welcome-start',
        type: 'element',
        target: '.start-training-btn',
        message: 'Click here to begin your first detective case!',
        position: 'top',
        trigger: 'auto',
        icon: <Target className="w-4 h-4" />,
        action: 'Click to start'
      }
    ]
  },
  {
    id: 'interface-overview',
    title: 'Your Detective Dashboard',
    description: 'This is your command center. Notice the score and hints counter at the top.',
    instruction: 'Look at the top right - you can see your current score and available hints.',
    highlightElement: '.score-display',
    tooltipText: 'This shows your current score and hints used',
    popupPosition: 'bottom',
    tooltipTargets: [
      {
        id: 'guidance-panel',
        type: 'element',
        target: '.guidance-panel',
        message: 'This panel provides step-by-step instructions and tips',
        position: 'right',
        trigger: 'auto',
        icon: <BookOpen className="w-4 h-4" />
      },
      {
        id: 'score-display',
        type: 'element',
        target: '.score-display',
        message: 'Track your detective performance here',
        position: 'bottom',
        trigger: 'auto',
        icon: <Star className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'score-display',
    title: 'Understanding Your Score',
    description: 'Your score starts at 2000 points and decreases when you use hints.',
    instruction: 'See your score? It updates in real-time as you progress!',
    highlightElement: '.score-number',
    tooltipText: 'Your detective score - keep it high!',
    popupPosition: 'bottom',
    tooltipTargets: [
      {
        id: 'score-number',
        type: 'element',
        target: '.score-number',
        message: 'Your current detective score - keep it high!',
        position: 'bottom',
        trigger: 'auto',
        icon: <Trophy className="w-4 h-4 text-amber-500" />
      }
    ]
  },
  {
    id: 'first-code-edit',
    title: 'Your First Investigation',
    description: 'Sam\'s blog title is broken. Let\'s fix it using proper HTML!',
    instruction: 'In the HTML editor, change the <h2> tags to <h1> tags to make the title more prominent.',
    htmlCode: `<div class="blog-container">
  <h2 class="blog-title">Sam's Missing Blog</h2>
  <p class="last-seen">Last seen: 3 days ago</p>
  <div class="content">
    <p>This blog has been acting strange lately...</p>
    <p>Something important might be hidden here.</p>
  </div>
</div>`,
    cssCode: `.blog-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.blog-title {
  color: #e53e3e;
  text-align: center;
  margin-bottom: 10px;
}

.last-seen {
  color: #666;
  font-style: italic;
  text-align: center;
  margin-bottom: 20px;
}

.content {
  background: #f7fafc;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #3182ce;
}`,
    validationFunction: (html: string) => html.includes('<h1') && html.includes('</h1>') && !html.includes('<h2'),
    tip: 'Change both <h2> and </h2> to <h1> and </h1> for better semantic structure!',
    aiHint: 'The h2 tag makes the title less prominent. Change it to h1 for proper heading hierarchy!',
    highlightElement: '.html-editor',
    tooltipText: 'Edit the HTML here - change h2 to h1',
    popupPosition: 'left',
    highlightLines: { html: [2] },
    tooltipTargets: [
      {
        id: 'html-tag-fix',
        type: 'syntax',
        target: '<h2>',
        message: 'Change this h2 tag to h1 for better semantic structure',
        position: 'top',
        trigger: 'hover',
        icon: <Code2 className="w-4 h-4 text-blue-500" />,
        action: 'Replace with <h1>'
      },
      {
        id: 'html-close-tag',
        type: 'syntax',
        target: '</h2>',
        message: 'Don\'t forget to change the closing tag too!',
        position: 'bottom',
        trigger: 'hover',
        icon: <Code2 className="w-4 h-4 text-blue-500" />,
        action: 'Replace with </h1>'
      }
    ]
  },
  {
    id: 'get-hint-demo',
    title: 'Need Help? Use Hints!',
    description: 'Stuck? The hint system is here to help you!',
    instruction: 'Click the "Get Hint" button to see how hints work.',
    clickTarget: '.hint-button',
    highlightElement: '.hint-button',
    tooltipText: 'Click here when you need help!',
    popupPosition: 'top',
    tooltipTargets: [
      {
        id: 'hint-button',
        type: 'element',
        target: '.hint-button',
        message: 'Click here when you need investigation assistance!',
        position: 'top',
        trigger: 'auto',
        icon: <Lightbulb className="w-4 h-4 text-yellow-500" />,
        action: 'Get helpful hints'
      }
    ]
  },
  {
    id: 'code-validation',
    title: 'Revealing Hidden Evidence',
    description: 'There\'s a secret message hidden in the CSS! Let\'s reveal it.',
    instruction: 'In the CSS editor, find the .secret-message class and change "display: none" to "display: block" to reveal hidden evidence.',
    htmlCode: `<div class="evidence-container">
  <h3>Investigation Notes</h3>
  <p>Sam's blog shows signs of unusual activity...</p>
  <div class="secret-message">
    🔍 <strong>EVIDENCE FOUND:</strong> Sam left a hidden clue - "Check the backup files on the old server!"
  </div>
  <p>Keep investigating to uncover the truth.</p>
</div>`,
    cssCode: `.evidence-container {
  background: #1a202c;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  font-family: 'Courier New', monospace;
}

.evidence-container h3 {
  color: #68d391;
  margin-bottom: 15px;
}

.secret-message {
  display: none;
  color: #f56565;
  background: #2d3748;
  padding: 15px;
  border: 2px solid #f56565;
  border-radius: 6px;
  margin: 15px 0;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}`,
    validationFunction: (css: string) => css.includes('display: block') && !css.includes('display: none'),
    tip: 'Find the .secret-message class and change "display: none" to "display: block"',
    aiHint: 'Something important is hidden! Look for display: none in the CSS and change it to display: block to reveal the evidence!',
    clickTarget: '.test-button',
    highlightElement: '.css-editor',
    tooltipText: 'Edit the CSS here to reveal hidden content!',
    popupPosition: 'left',
    highlightLines: { css: [15] },
    tooltipTargets: [
      {
        id: 'css-display-none',
        type: 'syntax',
        target: 'display: none',
        message: 'This is hiding the secret message! Change to "display: block"',
        position: 'top',
        trigger: 'hover',
        icon: <Eye className="w-4 h-4 text-red-500" />,
        action: 'Change to display: block'
      },
      {
        id: 'test-button-hint',
        type: 'element',
        target: '.test-button',
        message: 'Click to test your CSS changes and reveal the evidence!',
        position: 'top',
        trigger: 'auto',
        icon: <Zap className="w-4 h-4 text-green-500" />,
        action: 'Test your fix'
      }
    ]
  },
  {
    id: 'completion',
    title: 'Congratulations, Detective!',
    description: 'You\'ve completed the basic training. Ready for real cases?',
    instruction: 'Click "Complete Training" to unlock the full CodeCase experience!',
    popupPosition: 'center',
    tooltipTargets: [
      {
        id: 'completion-badge',
        type: 'element',
        target: '.completion-btn',
        message: 'You\'ve earned your detective badge! Click to continue.',
        position: 'top',
        trigger: 'auto',
        icon: <Trophy className="w-4 h-4 text-amber-500" />,
        action: 'Complete training'
      }
    ]
  }
];

export const TutorialCase: React.FC<TutorialCaseProps> = ({ onComplete, onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [stepCompleted, setStepCompleted] = useState<boolean[]>(new Array(tutorialSteps.length).fill(false));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showTutorialOverlay, setShowTutorialOverlay] = useState(true);
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activeEditor, setActiveEditor] = useState<'html' | 'css'>('html');

  const currentStep = tutorialSteps[currentStepIndex];

  useEffect(() => {
    if (currentStep.htmlCode) {
      setHtmlCode(currentStep.htmlCode);
    }
    if (currentStep.cssCode) {
      setCssCode(currentStep.cssCode);
    }
    // Auto-show tooltips for current step
    if (currentStep.tooltipTargets) {
      const autoTooltips = currentStep.tooltipTargets.filter(t => t.trigger === 'auto');
      if (autoTooltips.length > 0) {
        setTimeout(() => setActiveTooltip(autoTooltips[0].id), 1000);
      }
    }
  }, [currentStepIndex]);

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const validateCode = () => {
    if (!currentStep.validationFunction) return false;
    // For HTML steps, validate HTML code
    if (currentStep.id === 'first-code-edit') {
      return currentStep.validationFunction(htmlCode);
    }
    // For CSS steps, validate CSS code
    if (currentStep.id === 'code-validation') {
      return currentStep.validationFunction(cssCode);
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep.validationFunction) {
      if (validateCode()) {
        markStepCompleted();
        showToastMessage('Perfect! Moving to the next step.', 'success');
        setTimeout(() => nextStep(), 1000);
      } else {
        showToastMessage('Not quite right. Try the hint if you need help!', 'error');
      }
    } else {
      markStepCompleted();
      nextStep();
    }
  };

  const markStepCompleted = () => {
    const newCompleted = [...stepCompleted];
    newCompleted[currentStepIndex] = true;
    setStepCompleted(newCompleted);
  };

  const nextStep = () => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setShowTutorialOverlay(true);
      setShowHintPanel(false); // Close hint panel when moving to next step
    } else {
      setShowCompletion(true);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setShowTutorialOverlay(true);
    }
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    const hintText = currentStep.tip || 'Follow the instruction carefully and check your syntax!';
    setCurrentHint(hintText);
    setShowHintPanel(true);
    
    // Also show a quick toast
    showToastMessage(`💡 Hint revealed! Check the hint panel below.`, 'info');
  };

  const calculateScore = () => {
    // Tutorial doesn't deduct points - always return full score
    return 2000;
  };

  // Smart Tooltip Component
  const SmartTooltip: React.FC<{ tooltip: TooltipTarget; isActive: boolean }> = ({ tooltip, isActive }) => {
    if (!isActive) return null;

    return (
      <div className={`absolute z-50 bg-slate-800 border border-blue-400/50 rounded-lg shadow-2xl p-4 max-w-xs animate-in fade-in-0 slide-in-from-top-2 duration-300 ${
        tooltip.position === 'top' ? '-top-2 left-1/2 transform -translate-x-1/2 -translate-y-full' :
        tooltip.position === 'bottom' ? '-bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full' :
        tooltip.position === 'left' ? 'top-1/2 -left-2 transform -translate-x-full -translate-y-1/2' :
        tooltip.position === 'right' ? 'top-1/2 -right-2 transform translate-x-full -translate-y-1/2' :
        'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      }`}>
        <div className="flex items-start gap-3">
          {tooltip.icon && (
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
              {tooltip.icon}
            </div>
          )}
          <div className="flex-1">
            <p className="text-blue-100 text-sm leading-relaxed mb-2">{tooltip.message}</p>
            {tooltip.action && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-md font-medium">
                <ArrowRight className="w-3 h-3" />
                {tooltip.action}
              </span>
            )}
          </div>
        </div>
        {/* Tooltip arrows based on position */}
        {tooltip.position === 'top' && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        )}
        {tooltip.position === 'bottom' && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-slate-800"></div>
        )}
        {tooltip.position === 'left' && (
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-4 border-transparent border-l-slate-800"></div>
        )}
        {tooltip.position === 'right' && (
          <div className="absolute top-1/2 right-full transform -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
        )}
      </div>
    );
  };

  // Tutorial Overlay Component
  const TutorialOverlay = () => {
    if (!showTutorialOverlay || currentStep.id === 'welcome') return null;

    // Prevent body scroll when overlay is visible
    React.useEffect(() => {
      // Save original styles
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore original style
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }, []);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-lg mx-4 border border-slate-600">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {currentStep.highlightElement?.includes('score') && <Star className="w-8 h-8 text-white" />}
              {currentStep.highlightElement?.includes('code') && <Monitor className="w-8 h-8 text-white" />}
              {currentStep.highlightElement?.includes('hint') && <Lightbulb className="w-8 h-8 text-white" />}
              {currentStep.highlightElement?.includes('test') && <CheckCircle className="w-8 h-8 text-white" />}
              {!currentStep.highlightElement && <AlertCircle className="w-8 h-8 text-white" />}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">{currentStep.title}</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">{currentStep.description}</p>
            
            <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4 mb-6 text-left">
              <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                Next Step:
              </h4>
              <p className="text-blue-100">{currentStep.instruction}</p>
            </div>
            
            <button
              onClick={() => setShowTutorialOverlay(false)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Persistent Hint Panel Component
  const HintPanel = () => {
    if (!showHintPanel || !currentHint) return null;

    return (
      <div className="fixed bottom-6 right-6 max-w-md bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-400/30 rounded-xl p-6 shadow-2xl z-40 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-blue-300" />
            </div>
            <h3 className="text-blue-300 font-semibold">Detective Hint</h3>
          </div>
          <button
            onClick={() => setShowHintPanel(false)}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-blue-100 leading-relaxed mb-4">{currentHint}</p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-400">Hints used: {hintsUsed}</span>
          <span className="text-green-400">Tutorial - No points deducted!</span>
        </div>
      </div>
    );
  };

  if (showCompletion) {
    return (
      <CaseCompletion
        isVisible={true}
        score={calculateScore()}
        maxScore={2000}
        feedback={[
          'Excellent! You\'ve completed the tutorial.',
          `Steps completed: ${stepCompleted.filter(Boolean).length}/${tutorialSteps.length}`,
          `Hints used: ${hintsUsed}`,
          'You\'re ready for real investigations!',
          '🎉 You\'ve unlocked the Visual Investigation System!'
        ]}
        onRetry={() => {
          setCurrentStepIndex(0);
          setStepCompleted(new Array(tutorialSteps.length).fill(false));
          setHintsUsed(0);
          setShowCompletion(false);
        }}
        onHome={() => {
          const finalScore = calculateScore();
          onComplete(finalScore);
        }}
        onNextCase={() => {
          const finalScore = calculateScore();
          onComplete(finalScore);
        }}
        hasNextCase={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Tutorial Overlay */}
      <TutorialOverlay />
      
      {/* Tutorial Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-amber-500/20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-500">🎓 Tutorial: Web Detective Training</h1>
            <p className="text-slate-300 text-sm">Step {currentStepIndex + 1} of {tutorialSteps.length} • {currentStep.title}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Score and Stats */}
            <div className={`flex items-center gap-4 score-display transition-all duration-300 ${
              currentStep.highlightElement?.includes('score') ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-800' : ''
            }`}>
              <div className={`flex items-center gap-2 text-sm text-slate-300 px-3 py-1 rounded-lg score-number transition-all ${
                currentStep.highlightElement?.includes('score') 
                  ? 'bg-blue-600/20 border border-blue-400' 
                  : 'bg-slate-800/50'
              }`}>
                <Star className="w-4 h-4 text-amber-500" />
                <span>Score: {calculateScore().toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-1 rounded-lg">
                <Search className="w-4 h-4 text-blue-400" />
                <span>Hints: {hintsUsed}</span>
              </div>
            </div>
            
            {/* Exit Tutorial Button */}
            <button
              onClick={async () => {
                const confirmed = await showConfirm(
                  'Are you sure you want to exit the tutorial? Your progress will be lost.',
                  {
                    title: '⚠️ Exit Tutorial',
                    type: 'warning',
                    confirmText: 'Exit',
                    cancelText: 'Continue'
                  }
                );
                if (confirmed) {
                  onBack();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg transition-all duration-200 text-sm font-medium"
              title="Exit tutorial and return to cases"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Tutorial</span>
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-6xl mx-auto mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-slate-400">Progress:</span>
            <span className="text-xs text-amber-400 font-medium">
              {Math.round(((currentStepIndex + 1) / tutorialSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
              style={{ width: `${((currentStepIndex + 1) / tutorialSteps.length) * 100}%` }}
            >
              {((currentStepIndex + 1) / tutorialSteps.length) > 0.1 && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Screen for First Step */}
      {currentStepIndex === 0 && (
        <div className="max-w-4xl mx-auto p-8 pt-16">
          <div className="text-center mb-12">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Welcome to CodeCase!</h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Master the art of web detective work. Learn to investigate broken websites, 
                fix code issues, and uncover digital mysteries.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Monitor className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-blue-400 mb-2">Code Investigation</h3>
                <p className="text-slate-300 text-sm">Learn to analyze and fix broken HTML & CSS code</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-green-500/50 transition-all">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Lightbulb className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-green-400 mb-2">Smart Hints</h3>
                <p className="text-slate-300 text-sm">Get intelligent assistance when you need it</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-amber-500/50 transition-all">
                <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-amber-400 mb-2">Earn Rewards</h3>
                <p className="text-slate-300 text-sm">Collect points and unlock advanced cases</p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="start-training-btn group px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 animate-bounce"
            >
              <span className="flex items-center gap-3">
                <Play className="w-6 h-6" />
                Start Your Detective Training
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Tutorial Content (for steps after welcome) */}
      {currentStepIndex > 0 && (
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Side - Instructions (Compact) */}
            <div className="guidance-panel xl:col-span-1 space-y-4">
              {/* Step Card */}
              <div className={`bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 shadow-xl transition-all ${
                currentStep.highlightElement?.includes('instruction') ? 'ring-2 ring-amber-500 ring-opacity-50' : ''
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {stepCompleted[currentStepIndex] ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />
                  )}
                  <h2 className="text-lg font-bold text-amber-400">{currentStep.title}</h2>
                </div>
                
                <p className="text-slate-300 mb-4 leading-relaxed text-sm">{currentStep.description}</p>
                
                <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-400/30 rounded-lg p-4 mb-4">
                  <h3 className="text-blue-300 font-semibold mb-2 flex items-center gap-2 text-sm">
                    <MousePointer className="w-4 h-4" />
                    Next Action:
                  </h3>
                  <p className="text-blue-100 leading-relaxed text-sm">{currentStep.instruction}</p>
                  {currentStep.tip && (
                    <div className="mt-2 p-2 bg-amber-900/30 border border-amber-400/30 rounded-md">
                      <p className="text-amber-200 text-xs"><strong>Tip:</strong> {currentStep.tip}</p>
                    </div>
                  )}
                </div>

                {currentStep.aiHint && (
                  <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-500/30 rounded-lg p-3">
                    <h4 className="text-purple-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                      <Lightbulb className="w-4 h-4" />
                      AI Hint:
                    </h4>
                    <p className="text-purple-100 text-xs leading-relaxed">{currentStep.aiHint}</p>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStepIndex <= 1}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {/* Get Hint Button */}
                  <button
                    onClick={handleHint}
                    className={`hint-button flex items-center gap-2 px-3 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm ${
                      currentStep.clickTarget === '.hint-button'
                        ? 'bg-blue-600 hover:bg-blue-700 animate-pulse border-2 border-blue-300' 
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    Hint
                    <span className="bg-blue-800/50 px-1.5 py-0.5 rounded-full text-xs">
                      {hintsUsed}
                    </span>
                  </button>

                  {/* Test Code Button */}
                  {currentStep.validationFunction && (
                    <button
                      onClick={() => {
                        if (validateCode()) {
                          showToastMessage('✅ Perfect! Your code is correct!', 'success');
                          setTimeout(() => handleNext(), 1000);
                        } else {
                          showToastMessage('❌ Not quite right. Try the hint for help!', 'error');
                        }
                      }}
                      className={`test-button px-3 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105 text-sm ${
                        currentStep.clickTarget === '.test-button'
                          ? 'bg-green-600 hover:bg-green-700 animate-pulse border-2 border-green-300' 
                          : 'bg-green-600 hover:bg-green-500'
                      }`}
                    >
                      Test Fix
                    </button>
                  )}

                  {/* Next Step Button */}
                  {!currentStep.validationFunction && (
                    <button
                      onClick={handleNext}
                      className="completion-btn flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-sm"
                    >
                      {currentStepIndex === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Code Editor and Preview (Side by Side) */}
            <div className="preview-panel xl:col-span-2 space-y-4">
              {(currentStep.htmlCode || currentStep.cssCode) ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Code Editor Section */}
                  <div className="space-y-3">
                    {/* Code Editor Tabs */}
                    <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                      <button
                        onClick={() => setActiveEditor('html')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
                          activeEditor === 'html'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <Code2 className="w-4 h-4" />
                        HTML
                      </button>
                      <button
                        onClick={() => setActiveEditor('css')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
                          activeEditor === 'css'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        CSS
                      </button>
                    </div>

                    {/* HTML Editor */}
                    {activeEditor === 'html' && currentStep.htmlCode && (
                      <div className={`html-editor bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 shadow-xl transition-all relative ${
                        currentStep.highlightElement?.includes('html') 
                          ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 border-blue-400' 
                          : ''
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                            <Code2 className="w-4 h-4" />
                            HTML Editor
                            {currentStep.highlightElement?.includes('html') && (
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full animate-pulse">
                                Edit required
                              </span>
                            )}
                          </h3>
                          <span className="text-xs text-slate-400">.html</span>
                        </div>
                        
                        <textarea
                          value={htmlCode}
                          onChange={(e) => setHtmlCode(e.target.value)}
                          onFocus={() => {
                            // Show relevant tooltips when editing
                            const htmlTooltips = currentStep.tooltipTargets?.filter(t => t.target.includes('h2') || t.target.includes('h1'));
                            if (htmlTooltips && htmlTooltips.length > 0) {
                              setActiveTooltip(htmlTooltips[0].id);
                            }
                          }}
                          className={`w-full h-48 font-mono text-xs p-3 rounded-lg border transition-colors resize-none ${
                            currentStep.highlightElement?.includes('html')
                              ? 'bg-slate-900 text-green-400 border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                              : 'bg-slate-900 text-green-400 border-slate-600 focus:border-blue-500'
                          } focus:outline-none`}
                          placeholder="Edit your HTML code here..."
                          spellCheck={false}
                        />
                        
                        {/* Tooltips for HTML */}
                        {currentStep.tooltipTargets?.map(tooltip => (
                          <SmartTooltip key={tooltip.id} tooltip={tooltip} isActive={activeTooltip === tooltip.id} />
                        ))}
                      </div>
                    )}

                    {/* CSS Editor */}
                    {activeEditor === 'css' && currentStep.cssCode && (
                      <div className={`css-editor bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 shadow-xl transition-all relative ${
                        currentStep.highlightElement?.includes('css') 
                          ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-900 border-purple-400' 
                          : ''
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            CSS Editor
                            {currentStep.highlightElement?.includes('css') && (
                              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full animate-pulse">
                                Edit required
                              </span>
                            )}
                          </h3>
                          <span className="text-xs text-slate-400">.css</span>
                        </div>
                        
                        <textarea
                          value={cssCode}
                          onChange={(e) => setCssCode(e.target.value)}
                          onFocus={() => {
                            // Show relevant tooltips when editing CSS
                            const cssTooltips = currentStep.tooltipTargets?.filter(t => t.target.includes('display'));
                            if (cssTooltips && cssTooltips.length > 0) {
                              setActiveTooltip(cssTooltips[0].id);
                            }
                          }}
                          className={`w-full h-48 font-mono text-xs p-3 rounded-lg border transition-colors resize-none ${
                            currentStep.highlightElement?.includes('css')
                              ? 'bg-slate-900 text-cyan-400 border-purple-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                              : 'bg-slate-900 text-cyan-400 border-slate-600 focus:border-purple-500'
                          } focus:outline-none`}
                          placeholder="Edit your CSS code here..."
                          spellCheck={false}
                        />
                        
                        {/* Tooltips for CSS */}
                        {currentStep.tooltipTargets?.map(tooltip => (
                          <SmartTooltip key={tooltip.id} tooltip={tooltip} isActive={activeTooltip === tooltip.id} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Live Preview Section */}
                  <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-green-400 flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Live Preview
                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                          Real-time
                        </span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          (currentStep.id === 'first-code-edit' && htmlCode.includes('<h1>')) ||
                          (currentStep.id === 'code-validation' && cssCode.includes('display: block'))
                            ? 'bg-green-400 animate-pulse' 
                            : 'bg-red-400'
                        }`}></div>
                        <span className={`text-xs font-medium ${
                          (currentStep.id === 'first-code-edit' && htmlCode.includes('<h1>')) ||
                          (currentStep.id === 'code-validation' && cssCode.includes('display: block'))
                            ? 'text-green-400' 
                            : 'text-red-400'
                        }`}>
                          {(currentStep.id === 'first-code-edit' && htmlCode.includes('<h1>')) ||
                           (currentStep.id === 'code-validation' && cssCode.includes('display: block'))
                            ? 'Fix Applied' 
                            : 'Needs Fix'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 min-h-[12rem] border-2 border-dashed border-slate-300 relative overflow-hidden">
                      {/* Inject CSS styles */}
                      <style dangerouslySetInnerHTML={{ __html: cssCode }} />
                      
                      {/* Render HTML */}
                      <div 
                        dangerouslySetInnerHTML={{ __html: htmlCode }} 
                        className="prose prose-sm max-w-none"
                      />
                      
                      {/* Special handling for CSS validation step */}
                      {currentStep.id === 'code-validation' && cssCode.includes('display: block') && (
                        <div className="absolute top-2 right-2 bg-green-100 border border-green-400 rounded-lg p-2 shadow-lg animate-pulse">
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-semibold text-xs">Evidence Revealed!</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 text-xs text-slate-400">
                      {activeEditor === 'html' ? 'HTML structure' : 'CSS styling'} preview
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center shadow-xl">
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      currentStep.id === 'interface-overview' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                      currentStep.id === 'score-display' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                      currentStep.id === 'get-hint-demo' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                      'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                      {currentStep.id === 'interface-overview' && <Monitor className="w-8 h-8 text-white" />}
                      {currentStep.id === 'score-display' && <Star className="w-8 h-8 text-white" />}
                      {currentStep.id === 'get-hint-demo' && <Lightbulb className="w-8 h-8 text-white" />}
                      {currentStep.id === 'completion' && <Trophy className="w-8 h-8 text-white" />}
                      {!['interface-overview', 'score-display', 'get-hint-demo', 'completion'].includes(currentStep.id) && <BookOpen className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {currentStep.id === 'interface-overview' ? 'Command Center Overview' :
                       currentStep.id === 'score-display' ? 'Detective Scoring System' :
                       currentStep.id === 'get-hint-demo' ? 'Investigation Assistance' :
                       currentStep.id === 'completion' ? 'Mission Accomplished!' :
                       'Detective Training in Progress'}
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      {currentStep.id === 'interface-overview' ? 'Familiarize yourself with your detective dashboard and tools.' :
                       currentStep.id === 'score-display' ? 'Learn how your detective performance is measured and tracked.' :
                       currentStep.id === 'get-hint-demo' ? 'Discover how to get help when investigating complex cases.' :
                       currentStep.id === 'completion' ? 'You\'ve mastered the basics! Ready for real investigations?' :
                       'You\'re learning the fundamentals of web investigation. Each step builds your skills as a digital detective.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-6">
                    {/* Dynamic content based on current step */}
                    {currentStep.id === 'interface-overview' && (
                      <>
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <Monitor className="w-4 h-4 text-purple-400" />
                            </div>
                            <h4 className="text-purple-300 font-semibold">Dashboard Elements</h4>
                          </div>
                          <p className="text-purple-100 text-sm">
                            Score tracker • Progress bar • Hint counter • Case navigation
                          </p>
                        </div>
                        <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center">
                              <Search className="w-4 h-4 text-pink-400" />
                            </div>
                            <h4 className="text-pink-300 font-semibold">Visual Indicators</h4>
                          </div>
                          <p className="text-pink-100 text-sm">
                            Look for highlighted areas and pulsing elements to guide your investigation
                          </p>
                        </div>
                      </>
                    )}

                    {currentStep.id === 'score-display' && (
                      <>
                        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                              <Star className="w-4 h-4 text-amber-400" />
                            </div>
                            <h4 className="text-amber-300 font-semibold">Current Score</h4>
                          </div>
                          <p className="text-amber-100 text-sm">
                            {calculateScore().toLocaleString()} points • Tutorial mode - No deductions!
                          </p>
                        </div>
                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                              <Trophy className="w-4 h-4 text-orange-400" />
                            </div>
                            <h4 className="text-orange-300 font-semibold">Scoring System</h4>
                          </div>
                          <p className="text-orange-100 text-sm">
                            Real cases: Start with 2000 • Hints cost 5 points • Bonus for fast solving
                          </p>
                        </div>
                      </>
                    )}

                    {currentStep.id === 'get-hint-demo' && (
                      <>
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                              <Lightbulb className="w-4 h-4 text-blue-400" />
                            </div>
                            <h4 className="text-blue-300 font-semibold">Hint System</h4>
                          </div>
                          <p className="text-blue-100 text-sm">
                            Smart hints • Context-aware assistance • Step-by-step guidance
                          </p>
                        </div>
                        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                              <Search className="w-4 h-4 text-cyan-400" />
                            </div>
                            <h4 className="text-cyan-300 font-semibold">Investigation Tips</h4>
                          </div>
                          <p className="text-cyan-100 text-sm">
                            Use hints wisely • They provide crucial clues • Perfect for complex puzzles
                          </p>
                        </div>
                      </>
                    )}

                    {/* Default content for other steps */}
                    {!['interface-overview', 'score-display', 'get-hint-demo'].includes(currentStep.id) && (
                      <>
                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Monitor className="w-4 h-4 text-green-400" />
                            </div>
                            <h4 className="text-green-300 font-semibold">Current Mission</h4>
                          </div>
                          <p className="text-green-100 text-sm">
                            {currentStep.id === 'first-code-edit' ? 'Fix Sam\'s broken blog title using HTML tags' :
                             currentStep.id === 'code-validation' ? 'Reveal hidden messages by fixing CSS display properties' :
                             'Investigating Sam\'s missing blog and learning HTML/CSS detective skills'}
                          </p>
                        </div>
                        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h4 className="text-emerald-300 font-semibold">Progress Update</h4>
                          </div>
                          <p className="text-emerald-100 text-sm">
                            Step {currentStepIndex + 1} of {tutorialSteps.length} • {Math.round(((currentStepIndex + 1) / tutorialSteps.length) * 100)}% Complete • 
                            {currentStep.id === 'first-code-edit' ? ' Learning HTML structure' :
                             currentStep.id === 'code-validation' ? ' Mastering CSS properties' :
                             ' Building detective skills'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm">
                    {currentStep.id === 'interface-overview' ? 'Explore your detective tools and get familiar with the interface' :
                     currentStep.id === 'score-display' ? 'Your score reflects your detective expertise and efficiency' :
                     currentStep.id === 'get-hint-demo' ? 'Try clicking the hint button to see how investigation assistance works' :
                     'Follow the instructions on the left to continue your training'}
                  </p>
                </div>
              )} : (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center shadow-xl">
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      currentStep.id === 'interface-overview' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                      currentStep.id === 'score-display' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                      currentStep.id === 'get-hint-demo' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                      'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                      {currentStep.id === 'interface-overview' && <Monitor className="w-8 h-8 text-white" />}
                      {currentStep.id === 'score-display' && <Star className="w-8 h-8 text-white" />}
                      {currentStep.id === 'get-hint-demo' && <Lightbulb className="w-8 h-8 text-white" />}
                      {currentStep.id === 'completion' && <Trophy className="w-8 h-8 text-white" />}
                      {!['interface-overview', 'score-display', 'get-hint-demo', 'completion'].includes(currentStep.id) && <BookOpen className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {currentStep.id === 'interface-overview' ? 'Command Center Overview' :
                       currentStep.id === 'score-display' ? 'Detective Scoring System' :
                       currentStep.id === 'get-hint-demo' ? 'Investigation Assistance' :
                       currentStep.id === 'completion' ? 'Mission Accomplished!' :
                       'Detective Training in Progress'}
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      {currentStep.id === 'interface-overview' ? 'Familiarize yourself with your detective dashboard and tools.' :
                       currentStep.id === 'score-display' ? 'Learn how your detective performance is measured and tracked.' :
                       currentStep.id === 'get-hint-demo' ? 'Discover how to get help when investigating complex cases.' :
                       currentStep.id === 'completion' ? 'You\'ve mastered the basics! Ready for real investigations?' :
                       'You\'re learning the fundamentals of web investigation. Each step builds your skills as a digital detective.'}
                    </p>
                  </div>

                  {/* Tooltips for non-code steps */}
                  {currentStep.tooltipTargets?.map(tooltip => (
                    <div key={tooltip.id} className="relative inline-block">
                      <SmartTooltip tooltip={tooltip} isActive={activeTooltip === tooltip.id} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Persistent Hint Panel */}
      <HintPanel />
    </div>
  );
};
