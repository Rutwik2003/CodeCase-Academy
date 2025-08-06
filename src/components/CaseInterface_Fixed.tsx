import React, { useState, useCallback } from 'react';
import { ArrowLeft, Star, Clock, Target, Send } from 'lucide-react';
import { SmartCodeEditor } from './SmartCodeEditor';
import { EnhancedAIPartner } from './EnhancedAIPartner';
import { OnScreenHints } from './OnScreenHints';
import { ProgressBar } from './ProgressBar';
import { CaseCompletion } from './CaseCompletion';
import { validateCase } from '../utils/caseValidator';

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
  const [currentHtml, setCurrentHtml] = useState(caseData.initialHtml);
  const [currentCss, setCurrentCss] = useState(caseData.initialCss);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string; timestamp: Date }>>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [validationResult, setValidationResult] = useState(validateCase(caseData.id, caseData.initialHtml, caseData.initialCss, caseData.targetHtml, caseData.targetCss));
  const [activeEditorTab, setActiveEditorTab] = useState<'html' | 'css'>('html');
  const [highlightedLine, setHighlightedLine] = useState<{ line: number; language: 'html' | 'css' } | null>(null);
  const [showHints, setShowHints] = useState(false);

  const handleCodeChange = useCallback((html: string, css: string) => {
    setCurrentHtml(html);
    setCurrentCss(css);
    
    // Real-time validation
    const result = validateCase(caseData.id, html, css, caseData.targetHtml, caseData.targetCss);
    setValidationResult(result);
    
    // Check if case is completed
    if (result.score >= result.maxScore && !showCompletion) {
      setShowCompletion(true);
    }
  }, [caseData.id, caseData.targetHtml, caseData.targetCss, showCompletion]);

  const handleSubmitCase = () => {
    setShowCompletion(true);
  };

  const handleNextCase = () => {
    setShowCompletion(false);
    onComplete(validationResult.score);
  };

  const handleRetry = () => {
    setShowCompletion(false);
    setCurrentHtml(caseData.initialHtml);
    setCurrentCss(caseData.initialCss);
    setValidationResult(validateCase(caseData.id, caseData.initialHtml, caseData.initialCss, caseData.targetHtml, caseData.targetCss));
  };

  const handleBackToHome = () => {
    setShowCompletion(false);
    onBack();
  };

  const handleHintRequest = () => {
    if (hintIndex < caseData.hints.length) {
      setCurrentHint(caseData.hints[hintIndex]);
      setHintIndex(prev => prev + 1);
      setIsAIOpen(true);
      setShowHints(true); // Show hints when user requests them
    }
  };

  const handleCodeHighlight = (line: number, language: 'html' | 'css') => {
    setHighlightedLine({ line, language });
    setActiveEditorTab(language);
  };

  const handleSendMessage = (message: string) => {
    const newMessage = { type: 'user' as const, content: message, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response (in a real app, this would call Claude API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(message, currentHtml, currentCss);
      const aiMessage = { type: 'ai' as const, content: aiResponse, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  // Enhanced AI response generation with educational context
  const generateAIResponse = (userMessage: string, html: string, css: string): string => {
    const msgLower = userMessage.toLowerCase();
    const htmlLower = html.toLowerCase();
    const cssLower = css.toLowerCase();
    
    // Educational responses based on current code context
    if (msgLower.includes('header') || msgLower.includes('nav')) {
      if (!htmlLower.includes('<header')) {
        return `🔍 **Header Analysis**: I can see you have content that should be in a header! Looking at your code, you have a div with class="content" - this should be wrapped in a <header> tag.

**Step-by-step fix:**
1. Find the div with class="content" (around line 2-5)
2. Wrap it like this: \`<header class="header"><div class="content">...</div></header>\`
3. **Quick way**: Click "Smart Snippets" → "header" for automatic fix!

**Why this matters**: The <header> tag tells browsers and screen readers "this is the main heading area" - it's semantic HTML that makes your site more accessible! 🌟`;
      } else {
        return `✅ **Great job!** I see you already have a header! Now let's make it look professional. Try adding CSS flexbox for better layout:
        
\`\`\`css
.header {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
\`\`\`

**Quick way**: Click "Smart Snippets" → "flex-center" to add modern layout! 🎨`;
      }
    }
    
    if (msgLower.includes('center') || msgLower.includes('align')) {
      return `🎯 **Centering Elements**: Modern CSS uses flexbox for alignment! Here's the magic formula:

**For horizontal centering:**
\`\`\`css
.your-element {
  display: flex;
  justify-content: center;
}
\`\`\`

**For both horizontal & vertical:**
\`\`\`css
.your-element {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

**Looking at your code**: ${!cssLower.includes('display: flex') ? 'Your navigation needs flexbox! Try the "flex-center" Smart Snippet!' : 'Perfect! You\'re already using flexbox! 🎉'}

**Quick way**: Click "Smart Snippets" → "flex-center" for instant perfect alignment! ⚡`;
    }
    
    if (msgLower.includes('button') || msgLower.includes('click')) {
      if (!cssLower.includes('cursor: pointer')) {
        return `👆 **Button Investigation**: Your buttons need to look clickable! Here's what's missing:

**Essential button CSS:**
\`\`\`css
.btn {
  cursor: pointer;        /* Shows hand cursor */
  transition: all 0.3s;   /* Smooth animations */
  background: linear-gradient(135deg, #007bff, #0056b3);
}

.btn:hover {
  transform: translateY(-2px);  /* Lifts button up */
  box-shadow: 0 4px 15px rgba(0,123,255,0.3);
}
\`\`\`

**Quick way**: Click "Smart Snippets" → "button-modern" for professional interactive buttons! 🚀`;
      } else {
        return `✅ **Excellent!** Your buttons look clickable! For even better UX, add hover animations and shadows. The "button-modern" snippet has amazing hover effects! 🎭`;
      }
    }
    
    if (msgLower.includes('help') || msgLower.includes('stuck') || msgLower.includes('what')) {
      const issues = [];
      if (!htmlLower.includes('<header')) issues.push("❌ Missing semantic <header> tag");
      if (!htmlLower.includes('<nav')) issues.push("❌ Navigation should use <nav> tag");
      if (!cssLower.includes('display: flex')) issues.push("❌ Missing modern flexbox layout");
      if (!cssLower.includes('cursor: pointer')) issues.push("❌ Buttons don't look clickable");
      
      return `🕵️ **Case Analysis**: Let me analyze your current code...

**Issues Found:**
${issues.length > 0 ? issues.join('\n') : '✅ Your code looks great!'}

**Next Steps:**
1. Use "Smart Snippets" for quick professional fixes
2. Watch the blue AI suggestion bar for real-time tips
3. Check code quality score (aim for 90%+)

**Remember**: Each Smart Snippet teaches you modern web development best practices! Keep investigating! 🔍`;
    }
    
    // Generic educational response
    return `🤖 **Detective Claude here!** I'm analyzing your question...

**Common solutions:**
• **Semantic HTML**: Use proper tags like <nav>, <header>, <main>
• **Modern CSS**: Flexbox for layout, transitions for smooth effects
• **Accessibility**: Always add alt text, proper contrast, keyboard navigation

**Quick help**: Ask me specific questions like "How do I center elements?" or "What's wrong with my navigation?"

**Pro tip**: Try the Smart Snippets for instant professional code! Click the blue "Smart Snippets" button above the editor! 🚀`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Cases</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{caseData.title}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Detective Case #{caseData.id.split('-')[1]}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">15 min</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <Star className="w-4 h-4" />
                <span className="text-sm font-semibold">100 points</span>
              </div>
              <button
                onClick={handleSubmitCase}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Case</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Case Brief */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Case Brief</h2>
                <p className="text-gray-600 dark:text-gray-400">{caseData.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">The Story</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {caseData.story}
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Your Mission</h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {caseData.objective}
                </p>
              </div>
            </div>
          </div>
          
          {/* Code Editor and Progress */}
          <div className="lg:col-span-3 space-y-6">
            {/* Progress Bar Above Editor */}
            <ProgressBar 
              steps={validationResult.objectives}
              currentScore={validationResult.score}
              maxScore={validationResult.maxScore}
            />
            
            {/* Smart Code Editor with OnScreen Hints Overlay */}
            <div className="relative">
              <SmartCodeEditor
                initialHtml={caseData.initialHtml}
                initialCss={caseData.initialCss}
                targetHtml={caseData.targetHtml}
                targetCss={caseData.targetCss}
                onCodeChange={handleCodeChange}
                onHintRequest={handleHintRequest}
                caseTitle={caseData.title}
                isCompleted={validationResult.score >= validationResult.maxScore}
                codeQualityScore={validationResult.score}
              />
              
              {/* On-Screen Hints Overlay */}
              <OnScreenHints
                currentHtml={currentHtml}
                currentCss={currentCss}
                caseId={caseData.id}
                activeEditorTab={activeEditorTab}
                showHints={showHints}
                highlightedLine={highlightedLine}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced AI Partner */}
      <EnhancedAIPartner
        isOpen={isAIOpen}
        onToggle={() => setIsAIOpen(!isAIOpen)}
        currentHint={currentHint}
        onSendMessage={handleSendMessage}
        messages={messages}
        currentHtml={currentHtml}
        currentCss={currentCss}
        caseId={caseData.id}
        onHighlightCode={handleCodeHighlight}
      />
      
      {/* Case Completion Modal */}
      <CaseCompletion
        isVisible={showCompletion}
        score={validationResult.score}
        maxScore={validationResult.maxScore}
        feedback={validationResult.feedback}
        onNextCase={handleNextCase}
        onRetry={handleRetry}
        onHome={handleBackToHome}
        hasNextCase={true} // This would be dynamic based on available cases
      />
    </div>
  );
};
