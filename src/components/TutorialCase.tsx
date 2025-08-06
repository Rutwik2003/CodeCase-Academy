import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Star, Search, Monitor, CheckCircle, AlertCircle, Play, BookOpen, Trophy, Lightbulb, X, MousePointer, Eye, Code2 } from 'lucide-react';
import { Toast } from './Toast';
import { showConfirm } from './CustomAlert';
import { AudioWaveform } from './AudioWaveform';

// Import hint guy image
import hintGuyImg from '/assets/hint_guy.jpeg';

interface TutorialCaseProps {
  onComplete: (points: number) => void;
  onBack: () => void;
}

interface TooltipTarget {
  id: string;
  type: 'element' | 'line' | 'syntax';
  target: string;
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  trigger: 'hover' | 'click' | 'auto';
  icon?: React.ReactNode;
  action?: string;
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
  highlightElement?: string;
  tooltipText?: string;
  clickTarget?: string;
  validationFunction?: (code: string) => boolean;
  tip?: string;
  popupPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  tooltipTargets?: TooltipTarget[];
  htmlCode?: string;
  cssCode?: string;
  aiHint?: string;
}

const tutorialSteps: TutorialStepData[] = [
  {
    id: 'welcome',
    title: 'Welcome to CodeCase Detective Academy!',
    description: 'Ready to become a web detective? Let\'s start your training!',
    instruction: 'Click the "Start Training" button below to begin your detective journey.',
    popupPosition: 'center',
  },
  {
    id: 'interface-overview',
    title: 'Your Detective Dashboard',
    description: 'This is your command center. Notice the score and hints counter at the top.',
    instruction: 'Look at the top right - you can see your current score and available hints.',
    popupPosition: 'bottom',
  },
  {
    id: 'first-code-edit',
    title: '🔍 Your First Investigation',
    description: 'Sam\'s blog is corrupted and won\'t load properly. The real content is hidden until you fix the broken HTML structure!',
    instruction: 'Fix the HTML structure by changing the <h2> tags to <h1> tags. This will unlock the hidden detective clue!',
    htmlCode: `<div class="blog-container">
  <h2 class="blog-title">Loading...</h2>
  <p class="last-seen">Status: Connection Error</p>
  <div class="content">
    <p>Unable to load blog content.</p>
    <p>Please check the HTML structure.</p>
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
  font-size: 2rem;
  font-weight: bold;
}

h1.blog-title {
  font-size: 2.5rem;
  color: #c53030;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
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
    aiHint: 'The website is broken and hiding crucial evidence! Fix the heading tags to unlock Sam\'s secret message.',
  },
  {
    id: 'get-hint-demo',
    title: 'Need Help? Use Hints!',
    description: 'Stuck? The hint system is here to help you!',
    instruction: 'Click the hint guy (detective character) to see how hints work.',
  },
  {
    id: 'code-validation',
    title: 'Revealing Hidden Evidence',
    description: 'There\'s a secret message hidden in the CSS! Let\'s reveal it.',
    instruction: 'In the CSS editor, find the .secret-message class and change "display: none" to "display: block".',
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
    validationFunction: (css: string) => {
      const hasDisplayBlock = css.includes('display: block');
      const hasDisplayNone = css.includes('display: none');
      const hasIncompleteDisplay = /display:\s*;/.test(css) || /display:\s*$/.test(css);
      return hasDisplayBlock && !hasDisplayNone && !hasIncompleteDisplay;
    },
    aiHint: 'Something important is hidden! Look for display: none in the CSS and change it to display: block.',
  },
  {
    id: 'completion',
    title: 'Congratulations, Detective!',
    description: 'You\'ve completed the basic training. Ready for real cases?',
    instruction: 'Click "Complete Training" to unlock the full CodeCase experience!',
    popupPosition: 'center',
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
  const [activeEditor, setActiveEditor] = useState<'html' | 'css'>('html');

  const currentStep = tutorialSteps[currentStepIndex];

  useEffect(() => {
    if (currentStep.htmlCode) {
      setHtmlCode(currentStep.htmlCode);
    }
    if (currentStep.cssCode) {
      setCssCode(currentStep.cssCode);
    }
  }, [currentStepIndex]);

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const validateCode = () => {
    if (!currentStep.validationFunction) return false;
    if (currentStep.id === 'first-code-edit') {
      return currentStep.validationFunction(htmlCode);
    }
    if (currentStep.id === 'code-validation') {
      return currentStep.validationFunction(cssCode);
    }
    return false;
  };

  // Real-time validation helper
  const isCurrentlyValid = () => {
    if (currentStep.id === 'first-code-edit') {
      return htmlCode.includes('<h1') && htmlCode.includes('</h1>') && !htmlCode.includes('<h2');
    }
    if (currentStep.id === 'code-validation') {
      // Strict validation: must have exactly "display: block" (not "display: " or other incomplete syntax)
      const hasDisplayBlock = cssCode.includes('display: block');
      const hasDisplayNone = cssCode.includes('display: none');
      const hasIncompleteDisplay = /display:\s*;/.test(cssCode) || /display:\s*$/.test(cssCode);
      
      // Must have "display: block", must NOT have "display: none", and must NOT have incomplete display
      return hasDisplayBlock && !hasDisplayNone && !hasIncompleteDisplay;
    }
    return false;
  };

  // Check for CSS syntax errors
  const hasCSSError = () => {
    if (currentStep.id === 'code-validation') {
      // Check for incomplete display property
      const hasIncompleteDisplay = /display:\s*;/.test(cssCode) || /display:\s*$/.test(cssCode);
      const hasInvalidDisplay = /display:\s*[^;]+;/.test(cssCode) && !cssCode.includes('display: block') && !cssCode.includes('display: none');
      return hasIncompleteDisplay || hasInvalidDisplay;
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
      setShowHintPanel(false);
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
    const hintText = currentStep.tip || currentStep.aiHint || 'Follow the instruction carefully and check your syntax!';
    setCurrentHint(hintText);
    setShowHintPanel(true);
  };

  const calculateScore = () => {
    return 2000; // Tutorial doesn't deduct points
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
              {currentStep.id === 'interface-overview' && <Monitor className="w-8 h-8 text-white" />}
              {currentStep.id === 'first-code-edit' && <Code2 className="w-8 h-8 text-white" />}
              {currentStep.id === 'get-hint-demo' && <Lightbulb className="w-8 h-8 text-white" />}
              {currentStep.id === 'code-validation' && <Eye className="w-8 h-8 text-white" />}
              {currentStep.id === 'completion' && <Trophy className="w-8 h-8 text-white" />}
              {!['interface-overview', 'first-code-edit', 'get-hint-demo', 'code-validation', 'completion'].includes(currentStep.id) && <AlertCircle className="w-8 h-8 text-white" />}
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

  // Hint Panel Component
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-amber-500/30 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-blue-500/30 rounded-full"></div>
          <div className="absolute bottom-40 left-40 w-20 h-20 border border-green-500/30 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-purple-500/30 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="max-w-2xl w-full">
            {/* Detective Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-2xl mb-6 relative">
                <Trophy className="w-16 h-16 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
                Detective Academy Complete!
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                Congratulations! You've mastered the fundamentals of web investigation and are now ready for real cases.
              </p>
            </div>

            {/* Stats Card */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-400">Detective's Report</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                  <span className="text-3xl font-bold">A+</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-xs opacity-80">{calculateScore()}/{2000} points</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Excellent! You've completed the tutorial.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Steps completed: {stepCompleted.filter(Boolean).length}/{tutorialSteps.length}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Hints used: {hintsUsed}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">You're ready for real investigations!</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-amber-300">🎉 Visual Investigation System Unlocked!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Unlocked */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8 shadow-2xl">
              <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6" />
                Skills Mastered
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                  <Code2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-blue-300 font-semibold">HTML Structure</div>
                  <p className="text-blue-200 text-sm mt-2">Fixing heading tags to properly structure web content</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
                  <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-purple-300 font-semibold">CSS Investigation</div>
                  <p className="text-purple-200 text-sm mt-2">Revealing hidden content by modifying display properties</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <Search className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-green-300 font-semibold">Clue Discovery</div>
                  <p className="text-green-200 text-sm mt-2">Uncovering hidden evidence through code inspection</p>
                </div>
              </div>
            </div>
            
            {/* What You Learned */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8 shadow-2xl">
              <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Detective's Learning Report
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                  <h4 className="text-lg font-semibold text-blue-300 mb-2 flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    HTML Investigation Techniques
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-300">
                    <li>Identified and fixed improper heading structure (<code>&lt;h2&gt;</code> to <code>&lt;h1&gt;</code>)</li>
                    <li>Learned how semantic HTML elements affect content hierarchy</li>
                    <li>Discovered how proper HTML structure reveals hidden content</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                  <h4 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    CSS Detective Skills
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-300">
                    <li>Uncovered hidden evidence by changing <code>display: none</code> to <code>display: block</code></li>
                    <li>Learned how CSS can be used to hide important information</li>
                    <li>Discovered the relationship between HTML structure and CSS styling</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                  <h4 className="text-lg font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Web Detective Methodology
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-slate-300">
                    <li>Applied systematic debugging to identify and fix code issues</li>
                    <li>Used the hint system to guide your investigation when needed</li>
                    <li>Learned to validate your code fixes to ensure they solve the problem</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  onComplete(calculateScore());
                }}
                className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span className="flex items-center gap-3">
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  Start Real Cases
                </span>
              </button>

              <button
                onClick={() => {
                  setCurrentStepIndex(0);
                  setStepCompleted(new Array(tutorialSteps.length).fill(false));
                  setHintsUsed(0);
                  setShowCompletion(false);
                }}
                className="px-8 py-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl font-semibold transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50"
              >
                Retry Tutorial
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Tutorial Overlay */}
        <TutorialOverlay />
      
      {/* Tutorial Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-amber-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-500">🎓 Tutorial: Web Detective Training</h1>
            <p className="text-slate-300 text-sm">Step {currentStepIndex + 1} of {tutorialSteps.length} • {currentStep.title}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Score and Stats */}
            <div className="flex items-center gap-4 score-display">
              <div className="flex items-center gap-2 text-sm text-slate-300 px-3 py-1 rounded-lg bg-slate-800/50 score-number">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Score: {calculateScore().toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-1 rounded-lg">
                <Search className="w-4 h-4 text-blue-400" />
                <span>Hints: {hintsUsed}</span>
              </div>
            </div>
            
            {/* Audio Waveform */}
            <AudioWaveform className="detective-audio-control" />
            
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
        <div className="max-w-7xl mx-auto mt-4">
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
        <div className="max-w-full mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Side - Instructions (Symmetric with other containers) */}
            <div className="guidance-panel lg:col-span-1 space-y-4">
              {/* Main Step Card - Better height and readability */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 shadow-xl min-h-[22rem] flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  {stepCompleted[currentStepIndex] ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-amber-400 animate-pulse" />
                  )}
                  <h2 className="text-xl font-bold text-amber-400">{currentStep.title}</h2>
                </div>
                
                <p className="text-slate-300 mb-5 leading-relaxed text-base">{currentStep.description}</p>
                
                <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border border-blue-400/30 rounded-lg p-4 mb-5 flex-1">
                  <h3 className="text-blue-300 font-semibold mb-3 flex items-center gap-2 text-base">
                    <MousePointer className="w-5 h-5" />
                    Next Action:
                  </h3>
                  <p className="text-blue-100 leading-relaxed text-base mb-3">{currentStep.instruction}</p>
                  {currentStep.tip && (
                    <div className="mt-3 p-3 bg-amber-900/30 border border-amber-400/30 rounded-md">
                      <p className="text-amber-200 text-sm"><strong>Tip:</strong> {currentStep.tip}</p>
                    </div>
                  )}
                </div>

                {currentStep.aiHint && (
                  <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-500/30 rounded-lg p-4 mt-auto">
                    <h4 className="text-purple-400 font-semibold mb-3 flex items-center gap-2 text-base">
                      <Lightbulb className="w-5 h-5" />
                      AI Hint:
                    </h4>
                    <p className="text-purple-100 text-sm leading-relaxed">{currentStep.aiHint}</p>
                  </div>
                )}
              </div>

              {/* Navigation Panel - Compact but readable */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 shadow-xl">
                <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                  Actions
                </h3>
                
                <div className="space-y-3">
                  <button
                    onClick={prevStep}
                    disabled={currentStepIndex <= 1}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed text-base font-medium"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>

                  {/* Interactive Hint Guy Button */}
                  <button
                    onClick={handleHint}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-200 hover:scale-105 text-base font-medium"
                  >
                    <div className="relative">
                      <img 
                        src={hintGuyImg} 
                        alt="Tutorial Helper" 
                        className="w-8 h-8 rounded-full border-2 border-blue-200 object-cover"
                      />
                      {/* Hints used counter badge */}
                      {hintsUsed > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-300 rounded-full flex items-center justify-center">
                          <span className="text-xs text-blue-800 font-bold">{hintsUsed}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Need Help?</div>
                      <div className="text-xs opacity-90">Click for hint</div>
                    </div>
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
                      className="test-button w-full px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all duration-200 hover:scale-105 text-base font-medium"
                    >
                      Test My Fix
                    </button>
                  )}

                  {/* Next Step Button */}
                  {!currentStep.validationFunction && (
                    <button
                      onClick={handleNext}
                      className="completion-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg text-base"
                    >
                      {currentStepIndex === tutorialSteps.length - 1 ? 'Complete Training' : 'Continue'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Code Editor and Preview (Side by Side) */}
            <div className="preview-panel lg:col-span-3 space-y-4">
              {(currentStep.htmlCode || currentStep.cssCode) ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Code Editor Section */}
                  <div className="space-y-4">
                    {/* Code Editor Tabs */}
                    {currentStep.htmlCode && currentStep.cssCode && (
                      <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <button
                          onClick={() => setActiveEditor('html')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-base font-medium ${
                            activeEditor === 'html'
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                          }`}
                        >
                          <Code2 className="w-5 h-5" />
                          HTML
                        </button>
                        <button
                          onClick={() => setActiveEditor('css')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-base font-medium ${
                            activeEditor === 'css'
                              ? 'bg-purple-600 text-white shadow-lg'
                              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                          }`}
                        >
                          <Eye className="w-5 h-5" />
                          CSS
                        </button>
                      </div>
                    )}

                    {/* HTML Editor */}
                    {(activeEditor === 'html' || !currentStep.cssCode) && currentStep.htmlCode && (
                      <div className="html-editor bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-blue-400 flex items-center gap-3">
                            <Code2 className="w-6 h-6" />
                            HTML Editor
                          </h3>
                          <span className="text-base text-slate-400">.html</span>
                        </div>
                        
                        <textarea
                          value={htmlCode}
                          onChange={(e) => setHtmlCode(e.target.value)}
                          className="w-full h-80 font-mono text-base leading-relaxed p-6 rounded-lg border bg-slate-900 text-green-400 border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
                          placeholder="Edit your HTML code here..."
                          spellCheck={false}
                        />
                      </div>
                    )}

                    {/* CSS Editor */}
                    {(activeEditor === 'css' || !currentStep.htmlCode) && currentStep.cssCode && (
                      <div className="css-editor bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-purple-400 flex items-center gap-3">
                            <Eye className="w-6 h-6" />
                            CSS Editor
                          </h3>
                          <span className="text-base text-slate-400">.css</span>
                        </div>
                        
                        <textarea
                          value={cssCode}
                          onChange={(e) => setCssCode(e.target.value)}
                          className="w-full h-80 font-mono text-base leading-relaxed p-6 rounded-lg border bg-slate-900 text-cyan-400 border-slate-600 focus:border-purple-500 focus:outline-none resize-none"
                          placeholder="Edit your CSS code here..."
                          spellCheck={false}
                        />
                      </div>
                    )}
                  </div>

                  {/* Live Preview Section */}
                  <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-green-400 flex items-center gap-3">
                        <Monitor className="w-6 h-6" />
                        Live Preview
                        <span className="text-base bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                          Real-time
                        </span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          hasCSSError() ? 'bg-red-500 animate-pulse' :
                          isCurrentlyValid() ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          hasCSSError() ? 'text-red-500' :
                          isCurrentlyValid() ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {hasCSSError() ? 'Syntax Error' :
                           isCurrentlyValid() ? 'Fix Applied' : 'Needs Fix'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-6 min-h-[20rem] h-80 border-2 border-dashed border-slate-300 relative overflow-auto">
                      {/* Inject CSS styles */}
                      <style dangerouslySetInnerHTML={{ __html: cssCode }} />
                      
                      {/* Base styling for tutorial preview */}
                      <style dangerouslySetInnerHTML={{ __html: `
                        .tutorial-preview {
                          font-family: Arial, sans-serif;
                          color: #333;
                          line-height: 1.6;
                        }
                        .tutorial-preview h1, .tutorial-preview h2, .tutorial-preview h3 {
                          margin: 0;
                          padding: 0;
                        }
                        .tutorial-preview p {
                          margin: 10px 0;
                        }
                        .error-state {
                          opacity: 0.5;
                          filter: blur(1px);
                        }
                        .revealed-content {
                          animation: fadeIn 0.5s ease-in;
                        }
                        .css-error-message {
                          background: #ffe6e6;
                          border: 2px solid #ff6b6b;
                          border-radius: 6px;
                          padding: 15px;
                          margin: 15px 0;
                          animation: shake 0.5s ease-in-out;
                        }
                        .hidden-evidence {
                          background: #f0f0f0;
                          border: 2px dashed #ccc;
                          border-radius: 6px;
                          padding: 15px;
                          margin: 15px 0;
                          text-align: center;
                        }
                        @keyframes fadeIn {
                          from { opacity: 0; transform: translateY(10px); }
                          to { opacity: 1; transform: translateY(0); }
                        }
                        @keyframes shake {
                          0%, 100% { transform: translateX(0); }
                          25% { transform: translateX(-2px); }
                          75% { transform: translateX(2px); }
                        }
                      ` }} />
                      
                      {/* Render HTML - Dynamic content based on fix status */}
                      <div className="tutorial-preview">
                        {currentStep.id === 'first-code-edit' ? (
                          <div className="blog-container">
                            <h1 className={`blog-title ${isCurrentlyValid() ? 'revealed-content' : 'error-state'}`}>
                              {isCurrentlyValid() ? "Sam's Missing Blog" : "Loading..."}
                            </h1>
                            <p className={`last-seen ${isCurrentlyValid() ? 'revealed-content' : 'error-state'}`}>
                              {isCurrentlyValid() ? "Last seen: 3 days ago" : "Status: Connection Error"}
                            </p>
                            <div className={`content ${isCurrentlyValid() ? 'revealed-content' : 'error-state'}`}>
                              {isCurrentlyValid() ? (
                                <>
                                  <p>🔍 <strong>DETECTIVE CLUE REVEALED:</strong></p>
                                  <p>"This blog has been acting strange lately... Sam left a message in the CSS!"</p>
                                  <p><em>💡 Hint: Someone has been tampering with the website structure.</em></p>
                                </>
                              ) : (
                                <>
                                  <p>Unable to load blog content.</p>
                                  <p>Please check the HTML structure.</p>
                                </>
                              )}
                            </div>
                          </div>
                        ) : currentStep.id === 'code-validation' ? (
                          <div className="evidence-container">
                            <h3>Investigation Notes</h3>
                            <p>Sam's blog shows signs of unusual activity...</p>
                            
                            {hasCSSError() ? (
                              <div className="css-error-message">
                                <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>❌ CSS SYNTAX ERROR DETECTED</p>
                                <p style={{ color: '#666' }}>Fix the CSS syntax to continue investigation...</p>
                              </div>
                            ) : isCurrentlyValid() ? (
                              <div className="secret-message revealed-content">
                                🔍 <strong>EVIDENCE FOUND:</strong> Sam left a hidden clue - "Check the backup files on the old server!"
                              </div>
                            ) : (
                              <div className="hidden-evidence error-state">
                                <p style={{ color: '#666', fontStyle: 'italic' }}>[Evidence hidden - Fix CSS to reveal]</p>
                              </div>
                            )}
                            
                            <p>Keep investigating to uncover the truth.</p>
                          </div>
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
                        )}
                      </div>
                      
                      {/* Special handling for HTML validation step */}
                      {currentStep.id === 'first-code-edit' && isCurrentlyValid() && (
                        <div className="absolute top-2 right-2 bg-green-100 border border-green-400 rounded-lg p-2 shadow-lg animate-pulse">
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-semibold text-sm">Title Fixed!</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Special handling for CSS validation step */}
                      {currentStep.id === 'code-validation' && cssCode.includes('display: block') && (
                        <div className="absolute top-2 right-2 bg-green-100 border border-green-400 rounded-lg p-2 shadow-lg animate-pulse">
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-semibold text-sm">Evidence Revealed!</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 text-sm text-slate-400">
                      {activeEditor === 'html' ? 'HTML structure' : 'CSS styling'} preview
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-8 text-center shadow-xl">
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      currentStep.id === 'interface-overview' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                      currentStep.id === 'get-hint-demo' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                      'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                      {currentStep.id === 'interface-overview' && <Monitor className="w-8 h-8 text-white" />}
                      {currentStep.id === 'get-hint-demo' && <Lightbulb className="w-8 h-8 text-white" />}
                      {currentStep.id === 'completion' && <Trophy className="w-8 h-8 text-white" />}
                      {!['interface-overview', 'get-hint-demo', 'completion'].includes(currentStep.id) && <BookOpen className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {currentStep.id === 'interface-overview' ? 'Command Center Overview' :
                       currentStep.id === 'get-hint-demo' ? 'Investigation Assistance' :
                       currentStep.id === 'completion' ? 'Mission Accomplished!' :
                       'Detective Training in Progress'}
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      {currentStep.id === 'interface-overview' ? 'Familiarize yourself with your detective dashboard and tools.' :
                       currentStep.id === 'get-hint-demo' ? 'Discover how to get help when investigating complex cases.' :
                       currentStep.id === 'completion' ? 'You\'ve mastered the basics! Ready for real investigations?' :
                       'You\'re learning the fundamentals of web investigation. Each step builds your skills as a digital detective.'}
                    </p>
                  </div>
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
    </>
  );
};
