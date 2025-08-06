import React, { useState } from 'react';
import { Code, Palette, Search, Lightbulb, Copy, Check, Zap, AlertTriangle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getSnippetsByType, 
  getSnippetsByDifficulty,
  getCriticalClueSnippets,
  DetectiveSnippet, 
  QUICK_FIX_SNIPPETS 
} from '../data/detectiveSnippets';

interface DetectiveSnippetPanelProps {
  currentMissionId: string;
  activeTab: 'html' | 'css';
  onInsertSnippet: (code: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

export const DetectiveSnippetPanel: React.FC<DetectiveSnippetPanelProps> = ({
  currentMissionId,
  activeTab,
  onInsertSnippet,
  isVisible,
  onToggle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'critical' | 'mission' | 'quick-fix'>('critical');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'all'>('all');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get different types of snippets
  const criticalSnippets = getCriticalClueSnippets(currentMissionId).filter(s => s.type === activeTab);
  const allMissionSnippets = getSnippetsByType(currentMissionId, activeTab);
  const filteredMissionSnippets = selectedDifficulty === 'all' 
    ? allMissionSnippets 
    : getSnippetsByDifficulty(currentMissionId, selectedDifficulty).filter(s => s.type === activeTab);

  // Apply search filter
  const getFilteredSnippets = (snippets: DetectiveSnippet[]) => {
    if (!searchTerm) return snippets;
    return snippets.filter(snippet => 
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleInsertSnippet = (snippet: DetectiveSnippet) => {
    onInsertSnippet(snippet.code);
    setCopiedSnippetId(snippet.id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleInsertQuickFix = (code: string, id: string) => {
    onInsertSnippet(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const getSnippetIcon = (snippet: DetectiveSnippet) => {
    if (snippet.tags.includes('critical') || snippet.tags.includes('clue-reveal')) {
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
    if (snippet.tags.includes('complete-solution') || snippet.tags.includes('victory')) {
      return <Trophy className="w-4 h-4 text-yellow-500" />;
    }
    if (snippet.difficulty === 'hard') {
      return <Zap className="w-4 h-4 text-purple-500" />;
    }
    return activeTab === 'html' ? <Code className="w-4 h-4" /> : <Palette className="w-4 h-4" />;
  };

  if (!isVisible) {
    const criticalCount = criticalSnippets.length;
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full shadow-lg relative"
        >
          <Search className="w-5 h-5" />
          {criticalCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {criticalCount}
            </span>
          )}
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 w-96 max-h-[500px] theme-card rounded-xl overflow-hidden z-50"
      style={{ boxShadow: 'var(--shadow-xl)' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">🕵️ Detective Toolkit</h3>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            ×
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setSelectedCategory('critical')}
          className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
            selectedCategory === 'critical'
              ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900 dark:text-amber-400'
              : 'theme-text-secondary hover:theme-text-primary'
          }`}
        >
          <div className="flex items-center justify-center space-x-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Clues</span>
            {criticalSnippets.length > 0 && (
              <span className="bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {criticalSnippets.length}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => setSelectedCategory('mission')}
          className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
            selectedCategory === 'mission'
              ? 'border-b-2 border-blue-500 theme-text-primary bg-blue-50 dark:bg-blue-900'
              : 'theme-text-secondary hover:theme-text-primary'
          }`}
        >
          <div className="flex items-center justify-center space-x-1">
            {activeTab === 'html' ? <Code className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
            <span>{activeTab.toUpperCase()}</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedCategory('quick-fix')}
          className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
            selectedCategory === 'quick-fix'
              ? 'border-b-2 border-green-500 text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-400'
              : 'theme-text-secondary hover:theme-text-primary'
          }`}
        >
          <div className="flex items-center justify-center space-x-1">
            <Lightbulb className="w-4 h-4" />
            <span>Quick</span>
          </div>
        </button>
      </div>

      {/* Difficulty Filter for Mission Tab */}
      {selectedCategory === 'mission' && (
        <div className="bg-gray-50 dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty as any)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 theme-text-secondary hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {selectedCategory === 'critical' ? (
            <motion.div
              key="critical"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-3"
            >
              {getFilteredSnippets(criticalSnippets).length > 0 ? (
                getFilteredSnippets(criticalSnippets).map((snippet) => (
                  <motion.div
                    key={snippet.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg cursor-pointer transition-all hover:shadow-md"
                    onClick={() => handleInsertSnippet(snippet)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getSnippetIcon(snippet)}
                          <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm">{snippet.title}</h4>
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">{snippet.description}</p>
                      </div>
                      <div className="ml-2">
                        {copiedSnippetId === snippet.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                        🔍 Critical Clue
                      </span>
                      
                      <div className="flex space-x-1">
                        {snippet.tags.filter(tag => ['clue-reveal', 'critical', 'investigation'].includes(tag)).slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs text-amber-600 dark:text-amber-400">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6 theme-text-muted">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No critical clues found</p>
                  <p className="text-xs">Check the Mission tab for other snippets</p>
                </div>
              )}
            </motion.div>
          ) : selectedCategory === 'mission' ? (
            <motion.div
              key="mission"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-3"
            >
              {getFilteredSnippets(filteredMissionSnippets).length > 0 ? (
                getFilteredSnippets(filteredMissionSnippets).map((snippet) => (
                  <motion.div
                    key={snippet.id}
                    whileHover={{ scale: 1.02 }}
                    className="theme-card-interactive p-3 rounded-lg cursor-pointer"
                    onClick={() => handleInsertSnippet(snippet)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getSnippetIcon(snippet)}
                          <h4 className="font-medium theme-text-primary text-sm">{snippet.title}</h4>
                        </div>
                        <p className="text-xs theme-text-muted mt-1">{snippet.description}</p>
                      </div>
                      <div className="ml-2">
                        {copiedSnippetId === snippet.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 theme-text-muted" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        snippet.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        snippet.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {snippet.difficulty}
                      </span>
                      
                      <div className="flex space-x-1">
                        {snippet.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs theme-text-muted">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6 theme-text-muted">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No snippets found</p>
                  {searchTerm && <p className="text-xs">Try different search terms</p>}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="quick-fix"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 space-y-3"
            >
              {QUICK_FIX_SNIPPETS.filter(fix => 
                !searchTerm || 
                fix.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fix.description.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((fix) => (
                <motion.div
                  key={fix.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-3 rounded-lg cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleInsertQuickFix(fix.code, fix.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Lightbulb className="w-4 h-4 text-green-600" />
                        <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">{fix.title}</h4>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">{fix.description}</p>
                    </div>
                    <div className="ml-2">
                      {copiedSnippetId === fix.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded text-xs font-mono text-green-800 dark:text-green-200 mt-2">
                    {fix.code.split('\n')[0]}
                    {fix.code.includes('\n') && '...'}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 p-3 text-center border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs theme-text-muted">
          {selectedCategory === 'critical' ? '🔍 Critical clues to solve the case!' :
           selectedCategory === 'mission' ? '💡 Click any snippet to insert it into your code' :
           '⚡ Quick fixes for common issues'}
        </p>
      </div>
    </motion.div>
  );
};
        >
          <div className="flex items-center justify-center space-x-2">
            {activeTab === 'html' ? <Code className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
            <span>Mission {activeTab.toUpperCase()}</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedCategory('quick-fix')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            selectedCategory === 'quick-fix'
              ? 'border-b-2 border-blue-500 theme-text-primary bg-blue-50 dark:bg-blue-900'
              : 'theme-text-secondary hover:theme-text-primary'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Quick Fixes</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {selectedCategory === 'mission' ? (
            <motion.div
              key="mission"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-3"
            >
              {filteredSnippets.length > 0 ? (
                filteredSnippets.map((snippet) => (
                  <motion.div
                    key={snippet.id}
                    whileHover={{ scale: 1.02 }}
                    className="theme-card-interactive p-3 rounded-lg cursor-pointer"
                    onClick={() => handleInsertSnippet(snippet)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium theme-text-primary text-sm">{snippet.title}</h4>
                        <p className="text-xs theme-text-muted mt-1">{snippet.description}</p>
                      </div>
                      <div className="ml-2">
                        {copiedSnippetId === snippet.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 theme-text-muted" />
                        )}
                      </div>
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        snippet.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        snippet.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {snippet.difficulty}
                      </span>
                      
                      {/* Tags */}
                      <div className="flex space-x-1">
                        {snippet.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs theme-text-muted">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-6 theme-text-muted">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No snippets found for "{searchTerm}"</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="quick-fix"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 space-y-3"
            >
              {QUICK_FIX_SNIPPETS.map((fix) => (
                <motion.div
                  key={fix.id}
                  whileHover={{ scale: 1.02 }}
                  className="theme-card-interactive p-3 rounded-lg cursor-pointer"
                  onClick={() => handleInsertQuickFix(fix.code, fix.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium theme-text-primary text-sm">{fix.title}</h4>
                      <p className="text-xs theme-text-muted mt-1">{fix.description}</p>
                    </div>
                    <div className="ml-2">
                      {copiedSnippetId === fix.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 theme-text-muted" />
                      )}
                    </div>
                  </div>
                  
                  {/* Code Preview */}
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono theme-text-secondary mt-2">
                    {fix.code.split('\n')[0]}
                    {fix.code.includes('\n') && '...'}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 p-3 text-center">
        <p className="text-xs theme-text-muted">
          💡 Click any snippet to insert it into your code
        </p>
      </div>
    </motion.div>
  );
};
