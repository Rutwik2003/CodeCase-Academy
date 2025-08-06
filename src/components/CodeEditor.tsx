import React, { useState, useEffect, useMemo } from 'react';
import { Play, RotateCcw, Eye, EyeOff, Lightbulb } from 'lucide-react';

interface CodeEditorProps {
  initialHtml: string;
  initialCss: string;
  targetHtml?: string;
  targetCss?: string;
  onCodeChange: (html: string, css: string) => void;
  onHintRequest: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialHtml,
  initialCss,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  targetHtml: _targetHtml = '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  targetCss: _targetCss = '',
  onCodeChange,
  onHintRequest
}) => {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    onCodeChange(html, css);
  }, [html, css, onCodeChange]);

  // Calculate dynamic height based on content
  const dynamicHeight = useMemo(() => {
    const currentCode = activeTab === 'html' ? html : css;
    const lines = currentCode.split('\n').length;
    const minHeight = 300; // Minimum height for editor
    const maxHeight = 800; // Maximum height for editor
    const lineHeight = 20; // Approximate height per line
    
    const calculatedHeight = Math.max(minHeight, Math.min(maxHeight, lines * lineHeight + 60)); // +60 for padding and controls
    return calculatedHeight;
  }, [html, css, activeTab]);

  const resetCode = () => {
    setHtml(initialHtml);
    setCss(initialCss);
  };

  const runCode = () => {
    // Force preview update
    setShowPreview(false);
    setTimeout(() => setShowPreview(true), 100);
  };

  const currentCode = activeTab === 'html' ? html : css;
  const currentLines = currentCode.split('\n').length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'html'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            HTML ({html.split('\n').length} lines)
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'css'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            CSS ({css.split('\n').length} lines)
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {currentLines} lines • {currentCode.length} chars
          </span>
          <button
            onClick={onHintRequest}
            className="p-2 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
            title="Get a hint from your AI partner"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            title="Toggle preview"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={resetCode}
            className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={runCode}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
        </div>
      </div>
      
      <div 
        className="grid grid-cols-1 lg:grid-cols-2 dynamic-height-transition"
        style={{ height: `${dynamicHeight}px` }}
      >
        <div className="border-r border-gray-200 dark:border-gray-600">
          {activeTab === 'html' ? (
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset leading-5 custom-scrollbar code-editor-focus overflow-auto"
              placeholder="Enter your HTML code here..."
              spellCheck={false}
              style={{ 
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            />
          ) : (
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="w-full h-full p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset leading-5 custom-scrollbar code-editor-focus overflow-auto"
              placeholder="Enter your CSS code here..."
              spellCheck={false}
              style={{ 
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            />
          )}
        </div>
        
        {showPreview ? (
          <div className="bg-white">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-600">
              Live Preview
            </div>
            <div 
              className="overflow-auto custom-scrollbar"
              style={{ height: `${dynamicHeight - 32}px` }}
            >
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>${css}</style>
                    </head>
                    <body>${html}</body>
                  </html>
                `}
                className="w-full h-full border-none"
                title="Code Preview"
              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Eye className="w-12 h-12 mx-auto mb-2" />
              <p>Preview Hidden</p>
              <p className="text-sm">Click the eye icon to show preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};