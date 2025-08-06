import React, { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Code, Monitor, SplitSquareHorizontal } from 'lucide-react';

interface EditableCodePlaygroundProps {
  initialHtml: string;
  initialCss: string;
  onCodeChange: (html: string, css: string) => void;
  codeId: string;
}

type ViewMode = 'code' | 'preview' | 'split';

export const EditableCodePlayground: React.FC<EditableCodePlaygroundProps> = ({
  initialHtml,
  initialCss,
  onCodeChange,
  codeId
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);

  // Update parent component when code changes
  useEffect(() => {
    onCodeChange(html, css);
  }, [html, css, onCodeChange]);

  // Update local state when initial values change
  useEffect(() => {
    setHtml(initialHtml);
    setCss(initialCss);
  }, [initialHtml, initialCss]);

  const currentCode = activeTab === 'html' ? html : css;
  const dynamicHeight = 500;

  const tabs = [
    { id: 'html' as const, label: 'HTML' },
    { id: 'css' as const, label: 'CSS' }
  ];

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              ${css}
            </style>
          </head>
          <body>${html}</body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const setCode = (tab: 'html' | 'css', code: string) => {
    if (tab === 'html') {
      setHtml(code);
    } else {
      setCss(code);
    }
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-600/30 rounded-lg overflow-hidden shadow-xl shadow-slate-900/20">
      {/* Header */}
      <div className="bg-slate-700/60 backdrop-blur-sm border-b border-slate-600/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Tab Selector */}
            <div className="flex items-center space-x-1 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1 border border-slate-600/30">
              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center space-x-1 ${
                  activeTab === 'html'
                    ? 'bg-gradient-to-r from-orange-600/80 to-orange-500/80 text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-300 hover:bg-slate-600/50 backdrop-blur-sm'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>HTML</span>
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center space-x-1 ${
                  activeTab === 'css'
                    ? 'bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-slate-600/50 backdrop-blur-sm'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>CSS</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 bg-slate-700/50 backdrop-blur-sm px-2 py-1 rounded border border-slate-600/30">
              {currentCode.split('\n').length} lines
            </span>
            
            {/* View Mode Selector */}
            <div className="flex items-center space-x-1 bg-slate-700/50 backdrop-blur-sm rounded-lg p-1 border border-slate-600/30">
              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'code'
                    ? 'bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:bg-slate-600/50 backdrop-blur-sm'
                }`}
                title="Code Panel"
              >
                <Code className="w-4 h-4" />
                <span>Code</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'preview'
                    ? 'bg-gradient-to-r from-emerald-600/80 to-emerald-500/80 text-white shadow-lg shadow-emerald-500/25'
                    : 'text-slate-400 hover:bg-slate-600/50 backdrop-blur-sm'
                }`}
                title="Preview Panel"
              >
                <Monitor className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'split'
                    ? 'bg-gradient-to-r from-purple-600/80 to-purple-500/80 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:bg-slate-600/50 backdrop-blur-sm'
                }`}
                title="Mix Panel"
              >
                <SplitSquareHorizontal className="w-4 h-4" />
                <span>Mix</span>
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={openInNewTab}
              className="p-2 bg-slate-700/50 backdrop-blur-sm text-slate-300 rounded-md hover:bg-slate-600/60 transition-colors border border-slate-600/30"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => copyToClipboard(currentCode, codeId)}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white rounded-md hover:from-blue-500/90 hover:to-blue-400/90 transition-all shadow-lg shadow-blue-500/25 backdrop-blur-sm"
            >
              {copiedCode === codeId ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-sm">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div 
        className="flex bg-slate-800/20 backdrop-blur-lg border-t border-slate-600/30 overflow-hidden"
        style={{ height: `${dynamicHeight}px` }}
      >
        {/* Code Editor */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-slate-600/30 overflow-hidden flex flex-col`}>
            {/* Tab Bar */}
            <div className="flex border-b border-slate-600/30 bg-slate-800/40 backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-600/30 to-amber-500/30 text-amber-300 border-b-2 border-amber-500 backdrop-blur-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            {/* Code Editor */}
            <div className="flex-1 overflow-hidden bg-slate-900/70 backdrop-blur-sm">
              <textarea
                value={currentCode}
                onChange={(e) => setCode(activeTab, e.target.value)}
                className="w-full h-full bg-slate-900/80 backdrop-blur-sm text-slate-100 p-4 font-mono text-sm resize-none focus:outline-none border-none focus:ring-2 focus:ring-amber-500/30 focus:bg-slate-900/90 transition-all"
                spellCheck={false}
                placeholder={`🔍 Enter your ${activeTab.toUpperCase()} code here to solve the case...`}
                style={{
                  background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)`,
                  backdropFilter: 'blur(12px)'
                }}
              />
            </div>
          </div>
        )}
        
        {/* Live Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} bg-slate-800/40 backdrop-blur-sm flex flex-col`}>
            <div className="p-2 bg-slate-700/60 backdrop-blur-sm text-xs text-slate-300 font-medium border-b border-slate-600/30 flex items-center justify-between">
              <span>🔍 Live Preview</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400/70 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400/70 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400/70 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-slate-900/80 backdrop-blur-sm border border-slate-600/20 rounded-b-lg">
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        body { 
                          margin: 0; 
                          padding: 20px; 
                          font-family: Arial, sans-serif;
                          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                          color: #e2e8f0;
                          min-height: 100vh;
                        }
                        ${css}
                      </style>
                    </head>
                    <body>${html}</body>
                  </html>
                `}
                className="w-full h-full border-none rounded-b-lg"
                title="Detective Code Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
