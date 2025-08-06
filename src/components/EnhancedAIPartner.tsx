import React, { useState, useEffect } from 'react';
import { Bot, X, Send, Target, Lightbulb, Code, Eye, ArrowRight } from 'lucide-react';
import { logger, LogCategory } from '../utils/logger';

interface AIPartnerProps {
  isOpen: boolean;
  onToggle: () => void;
  currentHint: string;
  onSendMessage: (message: string) => void;
  messages: Array<{ type: 'user' | 'ai'; content: string; timestamp: Date }>;
  currentHtml: string;
  currentCss: string;
  caseId: string;
  onHighlightCode: (lineNumber: number, language: 'html' | 'css') => void;
}

interface CodeSuggestion {
  line: number;
  language: 'html' | 'css';
  issue: string;
  solution: string;
  example: string;
}

export const EnhancedAIPartner: React.FC<AIPartnerProps> = ({
  isOpen,
  onToggle,
  currentHint,
  onSendMessage,
  messages,
  currentHtml,
  currentCss,
  caseId,
  onHighlightCode
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [currentSuggestions, setCurrentSuggestions] = useState<CodeSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'hints' | 'analysis'>('chat');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze code and generate specific suggestions
  const analyzeCode = () => {
    setIsAnalyzing(true);
    const suggestions: CodeSuggestion[] = [];
    const htmlLines = currentHtml.split('\n');
    const cssLines = currentCss.split('\n');

    // Case-specific analysis with enhanced intelligence
    if (caseId === 'case-1') {
      // Check for semantic HTML issues
      htmlLines.forEach((line, index) => {
        if (line.includes('class="navigation"') && line.includes('<div')) {
          suggestions.push({
            line: index + 1,
            language: 'html',
            issue: 'Non-semantic navigation element',
            solution: 'Replace <div> with <nav> tag for better accessibility',
            example: `<nav class="navigation">\n  <a href="#home">Home</a>\n  <a href="#about">About</a>\n  <a href="#services">Services</a>\n  <a href="#contact">Contact</a>\n</nav>`
          });
        }
        
        if (line.includes('class="content"') && !currentHtml.includes('<header')) {
          suggestions.push({
            line: index + 1,
            language: 'html',
            issue: 'Content should be wrapped in semantic header',
            solution: 'Wrap content in <header> tag for better page structure',
            example: `<header class="header">\n  <div class="content">\n    <h1>Welcome to TechCorp</h1>\n    <p>We provide cutting-edge technology solutions.</p>\n  </div>\n  <!-- navigation will go here -->\n</header>`
          });
        }
      });

      // CSS analysis with modern best practices
      cssLines.forEach((line, index) => {
        if (line.includes('.navigation {') && !currentCss.includes('display: flex')) {
          suggestions.push({
            line: index + 1,
            language: 'css',
            issue: 'Navigation uses outdated layout method',
            solution: 'Add flexbox for modern, responsive navigation',
            example: `.navigation {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(0, 0, 0, 0.2);\n  padding: 10px;\n}`
          });
        }
        
        if (line.includes('.header {') && !currentCss.includes('background: linear-gradient')) {
          suggestions.push({
            line: index + 1,
            language: 'css',
            issue: 'Header lacks modern visual styling',
            solution: 'Add gradient background and flexbox layout',
            example: `.header {\n  display: flex;\n  flex-direction: column;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n}`
          });
        }
      });

      // Check for missing header styles if header class exists
      if (currentHtml.includes('class="header"') && !currentCss.includes('.header {')) {
        suggestions.push({
          line: 1,
          language: 'css',
          issue: 'Header element exists but has no CSS styling',
          solution: 'Add header styles for proper layout and appearance',
          example: `.header {\n  display: flex;\n  flex-direction: column;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n}`
        });
      }
    }

    if (caseId === 'case-2') {
      // Button accessibility and UX improvements
      cssLines.forEach((line, index) => {
        if (line.includes('.btn {') && !currentCss.includes('cursor: pointer')) {
          suggestions.push({
            line: index + 1,
            language: 'css',
            issue: 'Buttons don\'t indicate they are clickable',
            solution: 'Add cursor pointer and interactive states',
            example: `.btn {\n  cursor: pointer;\n  transition: all 0.3s ease;\n  background: linear-gradient(135deg, #007bff, #0056b3);\n}\n\n.btn:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 15px rgba(0,123,255,0.3);\n}`
          });
        }
        
        if (line.includes('.btn {') && !currentCss.includes('transition:')) {
          suggestions.push({
            line: index + 1,
            language: 'css',
            issue: 'Buttons lack smooth interactions',
            solution: 'Add CSS transitions for professional user experience',
            example: `.btn {\n  transition: all 0.3s ease;\n}\n\n.btn:hover {\n  transform: translateY(-2px);\n  background: darken(#007bff, 10%);\n}`
          });
        }
      });
    }

    setCurrentSuggestions(suggestions);
    setTimeout(() => setIsAnalyzing(false), 1500);
  };

  useEffect(() => {
    analyzeCode();
  }, [currentHtml, currentCss, caseId]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCodeHighlight = (suggestion: CodeSuggestion) => {
    // Notify parent component to highlight the code
    onHighlightCode(suggestion.line, suggestion.language);
    
    // Switch to the appropriate tab in the editor
    // This would typically be handled by the parent component
    
    // Show visual feedback
    // logger.info(`Highlighting ${suggestion.language} line ${suggestion.line}`, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
    
    // Optional: Add a toast notification
    const toastMessage = `Highlighted ${suggestion.language.toUpperCase()} line ${suggestion.line}`;
    // logger.info(toastMessage, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
  };

  const generateContextualResponse = () => {
    const suggestions = currentSuggestions;
    if (suggestions.length === 0) {
      return `🎉 **Excellent Detective Work!** 

Your code analysis shows no major issues detected. You're following modern web development best practices!

**🔍 Keep investigating:**
- Check the code quality score above (aim for 90%+)
- Look for any yellow hints on the editor
- Try the Smart Snippets for even more professional touches

**💡 Pro tip:** Even perfect code can be enhanced with animations, better accessibility, or mobile responsiveness!`;
    }
    
    const mainIssue = suggestions[0];
    const totalIssues = suggestions.length;
    
    return `🔍 **Code Analysis Complete!**

**${totalIssues} improvement${totalIssues > 1 ? 's' : ''} detected:**

**🎯 Priority Issue (Line ${mainIssue.line}):**
${mainIssue.issue}

**💡 Solution:** ${mainIssue.solution}

**📝 Example code:**
\`\`\`${mainIssue.language}
${mainIssue.example}
\`\`\`

${totalIssues > 1 ? `**Additional issues:** ${totalIssues - 1} more suggestion${totalIssues > 1 ? 's' : ''} in the "Smart Hints" tab.` : ''}

**🚀 Quick Action:** Click "View Details" below to see exactly where to make changes and try Smart Snippets for instant fixes!`;
  };

  useEffect(() => {
    // Welcome message is now handled by the parent CaseInterface component
    // when the AI partner is first opened
  }, [isOpen, messages.length]);

  return (
    <>
      {/* Enhanced AI Partner Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 group"
      >
        <div className="flex items-center justify-center">
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-pulse flex items-center justify-center">
          {currentSuggestions.length > 0 && (
            <span className="text-xs font-bold text-green-800">{currentSuggestions.length}</span>
          )}
        </div>
        {!isOpen && currentSuggestions.length > 0 && (
          <div className="absolute -top-12 right-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {currentSuggestions.length} suggestion{currentSuggestions.length > 1 ? 's' : ''} ready!
          </div>
        )}
      </button>

      {/* Enhanced AI Partner Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] theme-card rounded-xl shadow-2xl z-40 flex flex-col">
          {/* Header with Analysis Status */}
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Detective Claude AI</h3>
                  <p className="text-xs opacity-90 flex items-center">
                    {isAnalyzing ? (
                      <>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                        Analyzing your code...
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        {currentSuggestions.length} suggestions ready
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex theme-border-b">
            {[
              { id: 'chat', label: 'Chat', icon: Bot },
              { id: 'hints', label: 'Smart Hints', icon: Lightbulb },
              { id: 'analysis', label: 'Code Analysis', icon: Code }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'theme-text-muted hover:theme-text-primary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'hints' && currentSuggestions.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {currentSuggestions.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {/* AI Status Message */}
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="theme-bg-secondary rounded-lg p-3 max-w-xs">
                      <p className="text-sm theme-text-primary">
                        {generateContextualResponse()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Current Hint */}
                  {currentHint && (
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-lg p-3 max-w-xs">
                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">💡 Detective Hint:</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{currentHint}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Chat Messages */}
                  {messages.map((message, index) => {
                    // Check if this is a detective hint/clue message
                    const isDetectiveHint = message.content.includes('DETECTIVE CASE FILE') || message.content.includes('Detective Hint');
                    
                    return (
                      <div key={index} className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' 
                            ? 'bg-green-100 dark:bg-green-900' 
                            : isDetectiveHint 
                              ? 'bg-amber-100 dark:bg-amber-900'
                              : 'bg-blue-100 dark:bg-blue-900'
                        }`}>
                          {message.type === 'user' ? (
                            <span className="text-xs font-bold text-green-600 dark:text-green-400">U</span>
                          ) : isDetectiveHint ? (
                            <span className="text-xs">🕵️</span>
                          ) : (
                            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 max-w-xs'
                            : isDetectiveHint
                              ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 text-amber-900 dark:text-amber-100 border-2 border-amber-200 dark:border-amber-700 shadow-lg max-w-md'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 max-w-xs'
                        }`}>
                          <p className={`text-sm whitespace-pre-wrap ${isDetectiveHint ? 'font-mono' : ''}`}>
                            {message.content}
                          </p>
                          {isDetectiveHint && (
                            <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-600">
                              <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                                🔍 Detective Evidence • {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your code..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Smart Hints Tab */}
            {activeTab === 'hints' && (
              <div className="p-4 space-y-4 overflow-y-auto">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  🎯 **Precise Code Locations** - Click to highlight in editor
                </div>
                
                {currentSuggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No issues found! Your code is looking great! 🎉
                    </p>
                  </div>
                ) : (
                  currentSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => handleCodeHighlight(suggestion)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Target className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 text-xs rounded ${
                              suggestion.language === 'html' 
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' 
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                              {suggestion.language.toUpperCase()}
                            </span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Line {suggestion.line}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {suggestion.issue}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {suggestion.solution}
                          </p>
                          <div className="bg-gray-800 text-green-400 text-xs p-2 rounded font-mono overflow-x-auto">
                            {suggestion.example}
                          </div>
                          <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-2">
                            <ArrowRight className="w-3 h-3 mr-1" />
                            Click to highlight in editor
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Code Analysis Tab */}
            {activeTab === 'analysis' && (
              <div className="p-4 space-y-4 overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    🔍 Real-time Code Analysis
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">HTML Lines:</span>
                      <span className="ml-2 font-medium">{currentHtml.split('\n').length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">CSS Lines:</span>
                      <span className="ml-2 font-medium">{currentCss.split('\n').length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Issues Found:</span>
                      <span className="ml-2 font-medium text-red-500">{currentSuggestions.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Quality Score:</span>
                      <span className="ml-2 font-medium text-green-500">
                        {Math.max(0, 100 - currentSuggestions.length * 15)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Case-Specific Objectives:
                  </h4>
                  {caseId === 'case-1' && (
                    <div className="space-y-2">
                      <div className={`flex items-center space-x-2 p-2 rounded ${
                        !currentHtml.includes('<nav') ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'
                      }`}>
                        <div className={`w-4 h-4 rounded-full ${
                          !currentHtml.includes('<nav') ? 'bg-red-400' : 'bg-green-400'
                        }`}></div>
                        <span className="text-sm">Use semantic &lt;nav&gt; tag</span>
                      </div>
                      <div className={`flex items-center space-x-2 p-2 rounded ${
                        !currentHtml.includes('<header') ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'
                      }`}>
                        <div className={`w-4 h-4 rounded-full ${
                          !currentHtml.includes('<header') ? 'bg-red-400' : 'bg-green-400'
                        }`}></div>
                        <span className="text-sm">Create proper header structure</span>
                      </div>
                      <div className={`flex items-center space-x-2 p-2 rounded ${
                        !currentCss.includes('display: flex') ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'
                      }`}>
                        <div className={`w-4 h-4 rounded-full ${
                          !currentCss.includes('display: flex') ? 'bg-red-400' : 'bg-green-400'
                        }`}></div>
                        <span className="text-sm">Modern flexbox layout</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
