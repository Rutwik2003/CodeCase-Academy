import { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Eye, EyeOff, Code, Palette, Search } from 'lucide-react';

interface SmartCodeEditorProps {
  initialHtml: string;
  initialCss: string;
  onCodeChange: (html: string, css: string) => void;
  validationResult?: any;
  activeTab?: 'html' | 'css';
  onTabChange?: (tab: 'html' | 'css') => void;
  caseData?: any;
  onDetectiveHints?: () => void;
}

export const SmartCodeEditor: React.FC<SmartCodeEditorProps> = ({
  initialHtml,
  initialCss,
  onCodeChange,
  validationResult,
  activeTab: externalActiveTab,
  onTabChange,
  caseData,
  onDetectiveHints
}) => {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [activeTab, setActiveTab] = useState<'html' | 'css'>(externalActiveTab || 'html');
  const [showPreview, setShowPreview] = useState(true);
  
  const htmlEditorRef = useRef<any>(null);
  const cssEditorRef = useRef<any>(null);

  useEffect(() => {
    onCodeChange(html, css);
  }, [html, css, onCodeChange]);

  useEffect(() => {
    setHtml(initialHtml);
    setCss(initialCss);
  }, [initialHtml, initialCss]);

  useEffect(() => {
    if (externalActiveTab && externalActiveTab !== activeTab) {
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab, activeTab]);

  const resetCode = () => {
    setHtml(initialHtml);
    setCss(initialCss);
  };

  const runCode = () => {
    setShowPreview(false);
    setTimeout(() => setShowPreview(true), 100);
  };

  const handleEditorMount = (editor: any) => {
    if (activeTab === 'html') {
      htmlEditorRef.current = editor;
    } else {
      cssEditorRef.current = editor;
    }
  };

  const handleTabChange = (tab: 'html' | 'css') => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-600/30 rounded-lg overflow-hidden shadow-2xl shadow-slate-900/50">
      {/* Detective Header */}
      <div className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-600/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg flex items-center justify-center border border-amber-500/30">
              <Code className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-slate-200 font-semibold">🔍 Detective Code Editor</h3>
              <p className="text-xs text-slate-400">{caseData?.title || 'Detective Case'}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {validationResult?.isComplete && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <span className="text-xs text-green-300 font-medium">Case Solved!</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1 text-xs">
              <span className="font-medium text-amber-400">
                Progress: {validationResult?.score || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detective Tab Controls */}
      <div className="flex items-center justify-between p-4 bg-slate-800/40 backdrop-blur-sm border-b border-slate-600/30">
        <div className="flex space-x-2">
          <button
            onClick={() => handleTabChange('html')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              activeTab === 'html'
                ? 'bg-gradient-to-r from-orange-600/80 to-orange-500/80 text-white shadow-lg shadow-orange-500/25 backdrop-blur-sm'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 backdrop-blur-sm'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>📄 HTML Evidence</span>
          </button>
          <button
            onClick={() => handleTabChange('css')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
              activeTab === 'css'
                ? 'bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white shadow-lg shadow-blue-500/25 backdrop-blur-sm'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 backdrop-blur-sm'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>🎨 CSS Styling</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onDetectiveHints}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 border backdrop-blur-sm bg-gradient-to-r from-amber-600/30 to-amber-500/30 text-amber-200 hover:from-amber-600/40 hover:to-amber-500/40 border-amber-400/40 cursor-pointer shadow-lg hover:shadow-amber-500/20 transform hover:scale-105"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">🔍 Detective Hints</span>
          </button>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded-lg transition-all backdrop-blur-sm ${
              showPreview 
                ? 'bg-gradient-to-r from-emerald-600/80 to-emerald-500/80 text-white shadow-lg shadow-emerald-500/25' 
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            }`}
            title={showPreview ? "Hide evidence preview" : "Show evidence preview"}
          >
            {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          
          <button
            onClick={resetCode}
            className="p-2 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 rounded-lg transition-all backdrop-blur-sm"
            title="Reset evidence to original state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={runCode}
            className="px-4 py-2 bg-gradient-to-r from-green-600/80 to-green-500/80 text-white rounded-lg hover:from-green-500/90 hover:to-green-400/90 transition-all flex items-center space-x-2 shadow-lg shadow-green-500/25 backdrop-blur-sm"
          >
            <Play className="w-4 h-4" />
            <span>🚀 Execute</span>
          </button>
        </div>
      </div>

      {/* Detective Code Editor and Evidence Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 bg-slate-900/60 backdrop-blur-sm" style={{ height: '600px' }}>
        <div className="border-r border-slate-600/30 bg-slate-900/70 backdrop-blur-sm">
          {activeTab === 'html' ? (
            <Editor
              height="100%"
              defaultLanguage="html"
              value={html}
              theme="vs-dark"
              onChange={(value) => setHtml(value || '')}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                autoIndent: 'full',
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                parameterHints: { enabled: true }
              }}
            />
          ) : (
            <Editor
              height="100%"
              defaultLanguage="css"
              value={css}
              theme="vs-dark"
              onChange={(value) => setCss(value || '')}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                autoIndent: 'full',
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                parameterHints: { enabled: true }
              }}
            />
          )}
        </div>

        {/* Evidence Preview */}
        {showPreview && (
          <div className="bg-white">
            <div className="h-full overflow-auto">
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>${css}</style>
                    </head>
                    <body>
                      ${html}
                    </body>
                  </html>
                `}
                className="w-full h-full border-0"
                title="Code Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
