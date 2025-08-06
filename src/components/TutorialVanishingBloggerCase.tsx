import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Search, Monitor, CheckCircle, AlertCircle, BookOpen, Trophy, Lightbulb, Target, Eye, Code2, Zap, HelpCircle, ArrowDown, ArrowRight, X } from 'lucide-react';
import { Toast } from './Toast';
import { CaseCompletion } from './CaseCompletion';
import { useAuth } from '../contexts/AuthContext';
import { showConfirm } from './CustomAlert';

interface TutorialVanishingBloggerCaseProps {
  onComplete: (points: number) => void;
  onBack: () => void;
}

type TutorialStep = 
  | 'welcome' 
  | 'interface-tour'
  | 'clue-1-intro'
  | 'clue-1-fix' 
  | 'clue-1-reveal'
  | 'clue-2-intro'
  | 'clue-2-fix'
  | 'clue-2-reveal'
  | 'clue-3-intro'
  | 'clue-3-fix'
  | 'clue-3-reveal'
  | 'case-solved';

interface TutorialStepData {
  id: TutorialStep;
  title: string;
  description: string;
  instruction: string;
  code?: string;
  expectedChanges?: string[];
  validationFunction?: (html: string, css: string) => boolean;
  clueRevealed?: string;
  tip?: string;
  aiHint?: string;
  highlightLines?: { html?: number[]; css?: number[] };
  tooltipTargets?: TooltipTarget[];
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

const tutorialSteps: TutorialStepData[] = [
  {
    id: 'welcome',
    title: 'Welcome to CodeCase Detective Academy!',
    description: 'You\'re about to solve your first case! Sam Lens, a local blogger, has mysteriously vanished.',
    instruction: 'His blog is broken and contains hidden clues. As a web detective, you\'ll fix the code to reveal the truth. Click "Start Investigation" to begin!',
    tooltipTargets: [
      {
        id: 'welcome-start',
        type: 'element',
        target: '.next-button',
        message: 'Click here to begin your first detective case!',
        position: 'top',
        trigger: 'auto',
        icon: <Target className="w-4 h-4" />,
        action: 'Click to start'
      }
    ]
  },
  {
    id: 'interface-tour',
    title: 'Your Detective Dashboard',
    description: 'This is your command center. You can edit code, get hints, and track your progress.',
    instruction: 'Notice the guidance panel on the left, the code editor in the center, and the live preview on the right. This layout helps you learn efficiently.',
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
        id: 'code-editor',
        type: 'element',
        target: '.code-editor',
        message: 'Write and edit your HTML/CSS code here',
        position: 'top',
        trigger: 'auto',
        icon: <Code2 className="w-4 h-4" />
      },
      {
        id: 'live-preview',
        type: 'element',
        target: '.preview-panel',
        message: 'See your changes in real-time and collect evidence',
        position: 'left',
        trigger: 'auto',
        icon: <Eye className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'clue-1-intro',
    title: 'Clue 1: Sam\'s Broken Blog Header',
    description: 'Sam\'s blog header is broken with old HTML tags. Fix it to reveal the first clue!',
    instruction: 'Replace the <center> and <font> tags with modern HTML and CSS. Change <center> to <header> and remove <font> tags.',
    tip: 'Replace <center><font>text</font></center> with <header><h1>text</h1></header>',
    aiHint: 'Those <center> and <font> tags are from the 90s! Use semantic HTML like <header> and <h1> instead.',
    highlightLines: { html: [8] },
    tooltipTargets: [
      {
        id: 'deprecated-center',
        type: 'syntax',
        target: '<center>',
        message: 'This <center> tag is deprecated. Replace with <header> for better semantics.',
        position: 'top',
        trigger: 'hover',
        icon: <AlertCircle className="w-4 h-4 text-red-500" />,
        action: 'Replace with <header>'
      },
      {
        id: 'deprecated-font',
        type: 'syntax',
        target: '<font>',
        message: 'The <font> tag is obsolete. Use <h1> and CSS for styling instead.',
        position: 'bottom',
        trigger: 'hover',
        icon: <AlertCircle className="w-4 h-4 text-red-500" />,
        action: 'Replace with <h1>'
      }
    ]
  },
  {
    id: 'clue-1-fix',
    title: 'Fix the Blog Header',
    description: 'Replace deprecated HTML with semantic elements',
    instruction: 'Change <center><font size="6" color="red">...</font></center> to <header><h1>...</h1></header>',
    expectedChanges: ['<header>', '<h1>', '</h1>', '</header>'],
    validationFunction: (html: string) => 
      html.includes('<header>') && 
      html.includes('<h1>') && 
      html.includes('</h1>') && 
      html.includes('</header>') &&
      !html.includes('<center>') &&
      !html.includes('<font>'),
    highlightLines: { html: [8] },
    tooltipTargets: [
      {
        id: 'solution-hint',
        type: 'element',
        target: '.test-button',
        message: 'Click to test your solution once you\'ve made the changes',
        position: 'top',
        trigger: 'auto',
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        action: 'Test your fix'
      }
    ]
  },
  {
    id: 'clue-1-reveal',
    title: 'Clue 1 Revealed!',
    description: 'Excellent detective work! You\'ve revealed the first clue.',
    instruction: 'Sam left a hidden message: "Check my last Insta story before they wipe it." This suggests we should look for more clues in his social media.',
    clueRevealed: 'Check my last Insta story before they wipe it.',
    tooltipTargets: [
      {
        id: 'clue-found',
        type: 'element',
        target: '.evidence-panel',
        message: 'Your first piece of evidence! This clue points to social media.',
        position: 'left',
        trigger: 'auto',
        icon: <Search className="w-4 h-4 text-green-500" />,
        action: 'Evidence collected'
      }
    ]
  },
  {
    id: 'clue-2-intro',
    title: 'Clue 2: Hidden Instagram Story',
    description: 'There\'s a hidden Instagram story in Sam\'s social media archive.',
    instruction: 'The Instagram story section is hidden with CSS. Find the element with display: none and change it to display: block.',
    tip: 'Look for .instagram-story in the CSS and change display: none to display: block',
    aiHint: 'Something is hidden with display: none. Change it to display: block to reveal the Instagram story!',
    highlightLines: { css: [46] },
    tooltipTargets: [
      {
        id: 'css-tab',
        type: 'element',
        target: '.css-tab',
        message: 'Switch to the CSS tab to find the hidden Instagram story styles',
        position: 'bottom',
        trigger: 'auto',
        icon: <ArrowDown className="w-4 h-4 text-blue-500" />,
        action: 'Click CSS tab'
      },
      {
        id: 'hidden-display',
        type: 'syntax',
        target: 'display: none',
        message: 'This CSS rule hides the Instagram story. Change to "display: block" to reveal it.',
        position: 'top',
        trigger: 'hover',
        icon: <Eye className="w-4 h-4 text-blue-500" />,
        action: 'Change to display: block'
      }
    ]
  },
  {
    id: 'clue-2-fix',
    title: 'Reveal the Instagram Story',
    description: 'Change the CSS to make the hidden story visible',
    instruction: 'Find .instagram-story { display: none; } and change it to display: block;',
    expectedChanges: ['display: block'],
    validationFunction: (html: string, css: string) => 
      css.includes('.instagram-story') && 
      css.includes('display: block') && 
      !css.includes('display: none'),
    highlightLines: { css: [46] },
    tooltipTargets: [
      {
        id: 'css-validation',
        type: 'element',
        target: '.test-button',
        message: 'Test your CSS changes to reveal the hidden Instagram story',
        position: 'top',
        trigger: 'auto',
        icon: <Zap className="w-4 h-4 text-green-500" />,
        action: 'Validate CSS fix'
      }
    ]
  },
  {
    id: 'clue-2-reveal',
    title: 'Clue 2 Revealed!',
    description: 'The Instagram story is now visible! You found another clue.',
    instruction: 'The story shows: "Meet me where the shadows watch but cameras don\'t." This is clearly referring to a specific location.',
    clueRevealed: 'Meet me where the shadows watch but cameras don\'t.',
    tooltipTargets: [
      {
        id: 'second-clue',
        type: 'element',
        target: '.evidence-panel',
        message: 'Second clue discovered! This hints at a secret meeting location.',
        position: 'left',
        trigger: 'auto',
        icon: <Search className="w-4 h-4 text-green-500" />,
        action: 'Evidence updated'
      }
    ]
  },
  {
    id: 'clue-3-intro',
    title: 'Clue 3: The Final Location',
    description: 'Sam\'s final blog post is hidden and contains his exact location.',
    instruction: 'There\'s a hidden blog post with visibility: hidden. Change it to visibility: visible to reveal Sam\'s whereabouts.',
    tip: 'Look for visibility: hidden in the CSS and change it to visibility: visible',
    aiHint: 'There\'s a hidden post that will reveal Sam\'s final location. Change visibility: hidden to visibility: visible!',
    highlightLines: { css: [64] },
    tooltipTargets: [
      {
        id: 'visibility-property',
        type: 'syntax',
        target: 'visibility: hidden',
        message: 'This CSS property hides content while maintaining layout. Change to "visible".',
        position: 'top',
        trigger: 'hover',
        icon: <HelpCircle className="w-4 h-4 text-amber-500" />,
        action: 'Change to visibility: visible'
      }
    ]
  },
  {
    id: 'clue-3-fix',
    title: 'Reveal the Final Post',
    description: 'Make the hidden blog post visible',
    instruction: 'Find the CSS rule with visibility: hidden and change it to visibility: visible',
    expectedChanges: ['visibility: visible'],
    validationFunction: (html: string, css: string) => 
      css.includes('visibility: visible') && 
      !css.includes('visibility: hidden'),
    highlightLines: { css: [64] },
    tooltipTargets: [
      {
        id: 'final-validation',
        type: 'element',
        target: '.test-button',
        message: 'This is the final clue! Test your fix to reveal Sam\'s location.',
        position: 'top',
        trigger: 'auto',
        icon: <Target className="w-4 h-4 text-red-500" />,
        action: 'Reveal final clue'
      }
    ]
  },
  {
    id: 'clue-3-reveal',
    title: 'Clue 3 Revealed!',
    description: 'Perfect! You\'ve found Sam\'s exact location.',
    instruction: 'The final post reveals: "Warehouse 17, Dockside Street - Going live at midnight with the truth." Now we know where Sam is!',
    clueRevealed: 'Warehouse 17, Dockside Street - Going live at midnight with the truth.',
    tooltipTargets: [
      {
        id: 'final-clue',
        type: 'element',
        target: '.evidence-panel',
        message: 'Case solved! You\'ve found Sam\'s exact location through detective code work.',
        position: 'left',
        trigger: 'auto',
        icon: <Trophy className="w-4 h-4 text-yellow-500" />,
        action: 'Mission complete'
      }
    ]
  },
  {
    id: 'case-solved',
    title: 'Case Solved!',
    description: 'Congratulations! You\'ve successfully solved your first case.',
    instruction: 'Thanks to your detective work, police found Sam at Warehouse 17 just in time. You\'ve learned the basics of CodeCase and are ready for more challenging cases!',
    tooltipTargets: [
      {
        id: 'completion',
        type: 'element',
        target: '.completion-modal',
        message: 'Excellent work! You\'re now ready for advanced detective cases.',
        position: 'top',
        trigger: 'auto',
        icon: <Trophy className="w-4 h-4 text-yellow-500" />,
        action: 'Continue to next case'
      }
    ]
  }
];

const initialHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Last Blog Post</title>
</head>
<body>
    <center><font size="6" color="red">The Truth About NovaCorp</font></center>
    
    <p>Hey, it's Sam Lens. If you're reading this, I've probably vanished. No, I'm not kidding. The company I'm exposing—NovaCorp—has dark secrets that they don't want out. Data manipulation, stolen AI research, blackmail... you name it.</p>
    
    <p>This might get taken down, so look closely. Maybe you'll find a message here if you care enough to look.</p>
    
    <div class="hidden-message" style="display: block;">
        <p><strong>Check my last Insta story before they wipe it.</strong></p>
    </div>
    
    <p>They control everything: the media, the feeds, the ads. They think they can silence me like they silenced others.</p>
    
    <div class="social-media-section">
        <h2>My Social Media Archive</h2>
        <div class="instagram-grid">
            <img src="post1.jpg" alt="Coffee time" />
            <img src="post2.jpg" alt="Coding session" />
            <img src="post3.jpg" alt="Sunset view" />
        </div>
        
        <div class="instagram-story">
            <h3>📱 Last Story (24hrs ago)</h3>
            <div class="story-image">
                <img src="story-final.jpg" alt="Story screenshot" />
                <div class="story-text">
                    <p><strong>"Meet me where the shadows watch but cameras don't."</strong></p>
                </div>
            </div>
        </div>
    </div>
    
    <div class="hidden-post">
        <h2>BREAKING: Final Investigation Update</h2>
        <p>I've been investigating the old Eastside Station for weeks. The truth about what happened there in the 90s is finally coming to light.</p>
        <div class="critical-message">
            <p><strong>Warehouse 17, Dockside Street - Going live at midnight with the truth.</strong></p>
        </div>
        <p>Posted 2 days ago - Sam</p>
    </div>
    
    <center><p>Sam out.</p></center>
</body>
</html>`;

const initialCss = `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

header h1 {
    color: #d32f2f;
    font-size: 2.5rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

main {
    line-height: 1.6;
}

.hidden-message {
    background: #fff3cd;
    border: 2px solid #ffc107;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
}

.social-media-section {
    margin-top: 30px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.instagram-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 20px 0;
}

.instagram-grid img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
}

.instagram-story {
    display: none;
    border-top: 2px solid #e1306c;
    padding-top: 20px;
    margin-top: 30px;
}

.story-image {
    position: relative;
    text-align: center;
}

.story-image img {
    width: 200px;
    height: 350px;
    object-fit: cover;
    border-radius: 12px;
    border: 3px solid #e1306c;
}

.story-text {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px;
    border-radius: 6px;
    width: 80%;
}

.hidden-post {
    visibility: hidden;
    background: rgba(255,255,255,0.95);
    color: #1f2937;
    padding: 30px;
    margin: 30px 0;
    border-radius: 12px;
    border: 3px solid #dc2626;
}

.critical-message {
    text-align: center;
    background: #fef3c7;
    border: 2px solid #f59e0b;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
}

.critical-message p {
    color: #92400e;
    font-size: 1.2rem;
    margin: 0;
    font-weight: bold;
}`;

export const TutorialVanishingBloggerCase: React.FC<TutorialVanishingBloggerCaseProps> = ({ onComplete, onBack }) => {
  const { userData } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [htmlCode, setHtmlCode] = useState(initialHtml);
  const [cssCode, setCssCode] = useState(initialCss);
  const [stepCompleted, setStepCompleted] = useState<boolean[]>(new Array(tutorialSteps.length).fill(false));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [activeTooltips, setActiveTooltips] = useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [cluesFound, setCluesFound] = useState<string[]>([]);
  const [activeEditorTab, setActiveEditorTab] = useState<'html' | 'css'>('html');
  const [showSmartHints, setShowSmartHints] = useState(true);
  const [interactionCount, setInteractionCount] = useState(0);

  const currentStep = tutorialSteps[currentStepIndex];

  // Auto-show relevant tooltips based on current step
  useEffect(() => {
    const currentTooltips = currentStep.tooltipTargets?.map(t => t.id) || [];
    setActiveTooltips(new Set(currentTooltips.filter(id => 
      currentStep.tooltipTargets?.find(t => t.id === id)?.trigger === 'auto'
    )));
  }, [currentStepIndex, currentStep]);

  // Smart validation with detailed feedback
  const validateWithFeedback = () => {
    const errors: string[] = [];
    
    if (currentStep.validationFunction) {
      const isValid = currentStep.validationFunction(htmlCode, cssCode);
      
      if (!isValid) {
        // Provide specific feedback based on step
        switch (currentStep.id) {
          case 'clue-1-fix':
            if (htmlCode.includes('<center>')) errors.push('Remove the <center> tag and replace with <header>');
            if (htmlCode.includes('<font>')) errors.push('Remove the <font> tag and replace with <h1>');
            if (!htmlCode.includes('<header>')) errors.push('Add a <header> element');
            if (!htmlCode.includes('<h1>')) errors.push('Add an <h1> element inside the header');
            break;
          case 'clue-2-fix':
            if (cssCode.includes('display: none')) errors.push('Change "display: none" to "display: block" for .instagram-story');
            if (!cssCode.includes('display: block')) errors.push('Add "display: block" to make the Instagram story visible');
            break;
          case 'clue-3-fix':
            if (cssCode.includes('visibility: hidden')) errors.push('Change "visibility: hidden" to "visibility: visible"');
            if (!cssCode.includes('visibility: visible')) errors.push('Add "visibility: visible" to reveal the hidden post');
            break;
        }
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const toggleTooltip = (tooltipId: string) => {
    setActiveTooltips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tooltipId)) {
        newSet.delete(tooltipId);
      } else {
        newSet.add(tooltipId);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentStep.validationFunction) {
      if (validateWithFeedback()) {
        markStepCompleted();
        if (currentStep.clueRevealed) {
          setCluesFound(prev => [...prev, currentStep.clueRevealed!]);
        }
        showToastMessage('Perfect detective work! Clue revealed!', 'success');
        setTimeout(() => nextStep(), 1500);
      } else {
        showToastMessage(`Not quite right. ${validationErrors[0] || 'Check your code and try again.'}`, 'error');
      }
    } else {
      markStepCompleted();
      nextStep();
    }
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    setInteractionCount(prev => prev + 1);
    const hintText = currentStep.tip || currentStep.aiHint || 'Follow the instruction carefully and check your syntax!';
    showToastMessage(`💡 Smart Hint: ${hintText}`, 'info');
  };

  // Enhanced tooltip component with animations and smart positioning
  const SmartTooltip: React.FC<{
    tooltip: TooltipTarget;
    isActive: boolean;
    onClose: () => void;
  }> = ({ tooltip, isActive, onClose }) => {
    if (!isActive) return null;

    const getTooltipColor = (type: string) => {
      switch (type) {
        case 'syntax': return 'bg-red-50 border-red-200 text-red-800';
        case 'element': return 'bg-blue-50 border-blue-200 text-blue-800';
        case 'line': return 'bg-amber-50 border-amber-200 text-amber-800';
        default: return 'bg-gray-50 border-gray-200 text-gray-800';
      }
    };

    return (
      <div className={`fixed z-50 p-4 rounded-lg border shadow-lg max-w-sm animate-fadeIn ${getTooltipColor(tooltip.type)}`}
           style={{ 
             top: '50%', 
             right: '2rem',
             transform: 'translateY(-50%)'
           }}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {tooltip.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">{tooltip.message}</p>
            {tooltip.action && (
              <p className="text-xs opacity-75 italic">{tooltip.action}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-white/50 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  // Code highlighting component for syntax hints
  const CodeHighlighter: React.FC<{ 
    code: string; 
    highlightLines?: number[];
    language: 'html' | 'css';
  }> = ({ code, highlightLines = [], language: _language }) => {
    const lines = code.split('\n');
    
    return (
      <div className="font-mono text-sm">
        {lines.map((line, index) => (
          <div 
            key={index}
            className={`flex items-center space-x-3 px-2 py-1 rounded ${
              highlightLines.includes(index + 1) 
                ? 'bg-yellow-100 border-l-4 border-yellow-400' 
                : ''
            }`}
          >
            <span className="text-gray-400 text-xs w-8 text-right">
              {index + 1}
            </span>
            <span className={highlightLines.includes(index + 1) ? 'font-semibold' : ''}>
              {line}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Smart validation feedback component
  const ValidationFeedback: React.FC = () => {
    if (validationErrors.length === 0) return null;

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-red-800 font-medium mb-2">Code Issues Found:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const markStepCompleted = () => {
    const newCompleted = [...stepCompleted];
    newCompleted[currentStepIndex] = true;
    setStepCompleted(newCompleted);
  };

  const nextStep = async () => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Check if this is a repeat completion and provide appropriate feedback
      const isAlreadyCompleted = userData?.completedCases.includes('case-vanishing-blogger') || false;
      
      if (isAlreadyCompleted) {
        setToastMessage('Great practice! You\'ve already completed this tutorial. Try other cases to earn more points!');
        setToastType('info');
        setShowToast(true);
      } else {
        setToastMessage('Tutorial completed! You earned points for your first completion!');
        setToastType('success');
        setShowToast(true);
      }
      
      setShowCompletion(true);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    // Each clue found = 600 points, completion bonus = 200 points
    // Max score = 2000 points (3 clues × 600 + 200 bonus)
    // Deduct 50 points per hint used
    const cluePoints = cluesFound.length * 600;
    const completionBonus = showCompletion ? 200 : 0;
    const hintPenalty = hintsUsed * 50;
    const totalScore = Math.max(0, cluePoints + completionBonus - hintPenalty);
    return Math.min(totalScore, 2000); // Cap at 2000 points
  };

  const getStepProgress = () => {
    const completedSteps = stepCompleted.filter(completed => completed).length;
    return Math.round((completedSteps / tutorialSteps.length) * 100);
  };

  // Enhanced Tooltip Component for comprehensive step guidance
  const StepTooltip = () => {
    return (
      <div className="guidance-panel bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-200 dark:border-blue-700 rounded-xl p-6 shadow-lg h-full">
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {currentStep.title}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                  Step {currentStepIndex + 1}/{tutorialSteps.length}
                </span>
              </div>
            </div>
            {showSmartHints && (
              <button
                onClick={() => setShowSmartHints(false)}
                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
                title="Hide smart hints"
              >
                <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
              {currentStep.description}
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-600 shadow-sm">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-500" />
                What to do:
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {currentStep.instruction}
              </p>
            </div>

            {/* Smart Validation Feedback */}
            <ValidationFeedback />

            {/* Code highlighting hints */}
            {currentStep.highlightLines && (activeEditorTab === 'html' ? currentStep.highlightLines.html : currentStep.highlightLines.css) && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700 shadow-sm">
                <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                  <Code2 className="w-4 h-4 mr-2 text-yellow-600" />
                  Focus on line {currentStep.highlightLines[activeEditorTab]?.join(', ')}:
                </h4>
                <div className="bg-white dark:bg-gray-900 rounded p-2 text-xs border">
                  <CodeHighlighter 
                    code={activeEditorTab === 'html' ? htmlCode : cssCode}
                    highlightLines={currentStep.highlightLines[activeEditorTab]}
                    language={activeEditorTab}
                  />
                </div>
              </div>
            )}
            
            {currentStep.tip && (
              <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4 border border-amber-200 dark:border-amber-700 shadow-sm">
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2 text-amber-500" />
                  Pro Tip:
                </h4>
                <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                  {currentStep.tip}
                </p>
              </div>
            )}

            {currentStep.clueRevealed && (
              <div className="evidence-panel bg-green-50 dark:bg-green-900/30 rounded-lg p-4 border border-green-200 dark:border-green-700 shadow-sm">
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                  <Search className="w-4 h-4 mr-2 text-green-500" />
                  Evidence Found:
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm italic font-medium">
                  "{currentStep.clueRevealed}"
                </p>
              </div>
            )}

            {/* Interactive learning metrics */}
            {interactionCount > 0 && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-indigo-700 dark:text-indigo-300">Learning Progress:</span>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-indigo-500" />
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {interactionCount} interactions
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Progress bar with step indicators */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm text-blue-600 dark:text-blue-400">
              <span className="font-medium">Tutorial Progress</span>
              <span className="font-bold">{getStepProgress()}%</span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 shadow-inner relative">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${getStepProgress()}%` }}
              />
              {/* Step indicators */}
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white ${
                    stepCompleted[index] 
                      ? 'bg-green-500' 
                      : index === currentStepIndex 
                        ? 'bg-blue-500' 
                        : 'bg-gray-300'
                  }`}
                  style={{ left: `${((index + 1) / tutorialSteps.length) * 100}%`, marginLeft: '-4px' }}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Navigation buttons */}
          <div className="flex justify-between items-center space-x-3">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleHint}
                className="flex items-center space-x-2 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors border border-amber-300 dark:border-amber-700 text-sm font-medium"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Smart Hint</span>
                {hintsUsed > 0 && (
                  <span className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs px-1.5 py-0.5 rounded-full">
                    {hintsUsed}
                  </span>
                )}
              </button>

              <button
                onClick={nextStep}
                disabled={currentStepIndex === tutorialSteps.length - 1}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-sm font-semibold"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-8px); }
          70% { transform: translateY(-4px); }
          90% { transform: translateY(-2px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce 1s infinite;
        }
        
        .tooltip-enter {
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
          transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        }
        
        .tooltip-enter-active {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        
        .code-highlight {
          background: linear-gradient(90deg, transparent, rgba(255, 235, 59, 0.2), transparent);
          animation: highlight 2s ease-in-out infinite;
        }
        
        @keyframes highlight {
          0%, 100% { background-position: -100% 0; }
          50% { background-position: 100% 0; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="w-full px-2 sm:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Cases</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">The Vanishing Blogger</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tutorial Case</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">Score:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{calculateScore().toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Clues:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{cluesFound.length}/3</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-600 dark:text-gray-400">Hints:</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{hintsUsed}</span>
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
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 border border-red-300 dark:border-red-700 text-sm font-medium"
                title="Exit tutorial and return to cases"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Tutorial</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-2 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full min-h-screen">
          {/* Tutorial Guidance Panel - takes 1 column */}
          <div className="lg:col-span-1">
            <StepTooltip />
          </div>

          {/* Code Editor - takes 1 column */}
          <div className="lg:col-span-1 code-editor bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 flex flex-col">
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl">
              <div className="flex">
                <button
                  onClick={() => setActiveEditorTab('html')}
                  className={`flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeEditorTab === 'html'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 shadow-sm'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Monitor className="w-4 h-4" />
                    <span>HTML</span>
                    {currentStep.highlightLines?.html && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setActiveEditorTab('css')}
                  className={`css-tab flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeEditorTab === 'css'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 shadow-sm'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>CSS</span>
                    {currentStep.highlightLines?.css && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-1 relative">
              <div className="relative">
                <textarea
                  value={activeEditorTab === 'html' ? htmlCode : cssCode}
                  onChange={(e) => {
                    if (activeEditorTab === 'html') {
                      setHtmlCode(e.target.value);
                    } else {
                      setCssCode(e.target.value);
                    }
                    setInteractionCount(prev => prev + 1);
                  }}
                  className="w-full h-80 font-mono text-sm p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none backdrop-blur-sm transition-all duration-200 focus:shadow-lg"
                  placeholder={`Enter your ${activeEditorTab.toUpperCase()} code here...`}
                  spellCheck={false}
                  onFocus={() => setInteractionCount(prev => prev + 1)}
                />
                
                {/* Code syntax tooltips */}
                {currentStep.tooltipTargets?.map((tooltip) => (
                  <SmartTooltip
                    key={tooltip.id}
                    tooltip={tooltip}
                    isActive={activeTooltips.has(tooltip.id)}
                    onClose={() => toggleTooltip(tooltip.id)}
                  />
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30 rounded-b-xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Fix the code to reveal clues</span>
                  {currentStep.highlightLines && (
                    <div className="flex items-center space-x-1 ml-2">
                      <Eye className="w-3 h-3 text-yellow-500" />
                      <span className="text-yellow-600 dark:text-yellow-400 text-xs">
                        Focus on highlighted lines
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleHint}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all duration-200 border border-amber-300 dark:border-amber-700 text-sm font-medium"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Smart Hint</span>
                    {hintsUsed > 0 && (
                      <span className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs px-1.5 py-0.5 rounded-full ml-1">
                        {hintsUsed}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleNext}
                    className="test-button flex items-center justify-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-semibold"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Test Solution</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel - takes 1 column */}
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 flex flex-col">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Monitor className="w-5 h-5 text-blue-500" />
                  <span>Sam's Blog Preview</span>
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Live Preview</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="p-6 flex-1">
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg h-80 overflow-auto bg-white shadow-inner">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<style>${cssCode}</style>${htmlCode}`
                  }}
                />
              </div>
            </div>

            {/* Clues Found Panel */}
            {cluesFound.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-green-50/50 dark:bg-green-900/20 rounded-b-xl">
                <h4 className="text-base font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Evidence Collected:</span>
                </h4>
                <div className="space-y-3">
                  {cluesFound.map((clue, index) => (
                    <div key={index} className="p-4 bg-green-100/80 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700 shadow-sm">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-green-800 dark:text-green-200 font-semibold mb-1">Evidence #{index + 1}</p>
                          <p className="text-sm text-green-700 dark:text-green-300 italic leading-relaxed">"{clue}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Case Completion Modal */}
      {showCompletion && (
        <CaseCompletion
          isVisible={showCompletion}
          score={calculateScore()}
          maxScore={2000}
          feedback={[
            '🎉 Congratulations! You\'ve successfully completed your first detective case!',
            `🔍 You found all ${cluesFound.length} clues and learned the CodeCase basics.`,
            '🚀 You\'re now ready to take on more challenging cases!',
            `💡 You used ${hintsUsed} hints. Try to use fewer hints in future cases for higher scores.`
          ]}
          onNextCase={() => {}}
          onRetry={() => {
            setCurrentStepIndex(0);
            setHtmlCode(initialHtml);
            setCssCode(initialCss);
            setCluesFound([]);
            setHintsUsed(0);
            setStepCompleted(new Array(tutorialSteps.length).fill(false));
            setShowCompletion(false);
          }}
          onHome={async () => {
            const score = calculateScore();
            
            // Show completion message (the actual case completion will be handled by AppRouter)
            setToastMessage('Tutorial completed! Returning to cases...');
            setToastType('success');
            setShowToast(true);
            
            // Wait a bit for the user to see the message, then navigate
            setTimeout(() => {
              onComplete(score);
            }, 2000);
          }}
          hasNextCase={false}
        />
      )}

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
