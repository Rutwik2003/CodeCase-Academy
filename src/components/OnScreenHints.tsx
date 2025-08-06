import React, { useState, useEffect } from 'react';
import { Target, X, ArrowDown, ArrowRight, Code, Lightbulb } from 'lucide-react';

interface CodeOverlay {
  id: string;
  line: number;
  language: 'html' | 'css';
  message: string;
  type: 'error' | 'suggestion' | 'info';
  position: { x: number; y: number };
  action?: string;
}

interface OnScreenHintsProps {
  currentHtml: string;
  currentCss: string;
  caseId: string;
  activeEditorTab: 'html' | 'css';
  showSpecificHint?: { type: string; line?: number } | null;
  onHintDismissed?: (hintId: string) => void;
}

export const OnScreenHints: React.FC<OnScreenHintsProps> = ({
  currentHtml,
  currentCss,
  caseId,
  activeEditorTab,
  showSpecificHint,
  onHintDismissed
}) => {
  const [overlays, setOverlays] = useState<CodeOverlay[]>([]);
  const [dismissedOverlays, setDismissedOverlays] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (showSpecificHint) {
      generateSpecificOverlay();
    } else {
      setOverlays([]);
    }
  }, [currentHtml, currentCss, caseId, activeEditorTab, showSpecificHint]);

  const generateSpecificOverlay = () => {
    if (!showSpecificHint || dismissedOverlays.has(showSpecificHint.type)) return;

    const newOverlays: CodeOverlay[] = [];
    const htmlLines = currentHtml.split('\n');
    const cssLines = currentCss.split('\n');

    // Generate specific overlay based on AI request
    switch (showSpecificHint.type) {
      case 'nav-semantic':
        htmlLines.forEach((line, index) => {
          if (line.trim().includes('<div class="navigation">')) {
            newOverlays.push({
              id: 'nav-semantic',
              line: index + 1,
              language: 'html',
              message: `🔍 Line ${index + 1}: Replace <div> with <nav> for semantic HTML!`,
              type: 'error',
              position: { x: 30, y: 80 + index * 40 },
              action: 'Use Smart Snippet "nav" to fix automatically!'
            });
          }
        });
        break;

      case 'header-wrapper':
        htmlLines.forEach((line, index) => {
          if (line.trim().includes('<div class="content">') && !currentHtml.includes('<header')) {
            newOverlays.push({
              id: 'header-wrapper',
              line: index + 1,
              language: 'html',
              message: `💡 Line ${index + 1}: Wrap content in <header> tag!`,
              type: 'suggestion',
              position: { x: 280, y: 120 + index * 40 },
              action: 'Add <header class="header"> wrapper'
            });
          }
        });
        break;

      case 'flexbox-layout':
        if (activeEditorTab === 'css') {
          cssLines.forEach((line, index) => {
            if (line.includes('.navigation {') && !currentCss.includes('display: flex')) {
              newOverlays.push({
                id: 'flexbox-layout',
                line: index + 1,
                language: 'css',
                message: `⚡ Line ${index + 1}: Add modern flexbox layout!`,
                type: 'suggestion',
                position: { x: 100, y: 180 + index * 40 },
                action: 'Use Smart Snippet "flex-center"'
              });
            }
          });
        }
        break;

      case 'button-cursor':
        if (activeEditorTab === 'css') {
          cssLines.forEach((line, index) => {
            if (line.includes('.btn {') && !currentCss.includes('cursor: pointer')) {
              newOverlays.push({
                id: 'button-cursor',
                line: index + 1,
                language: 'css',
                message: `👆 Line ${index + 1}: Add cursor: pointer!`,
                type: 'error',
                position: { x: 150, y: 140 + index * 40 },
                action: 'Use Smart Snippet "button-modern"'
              });
            }
          });
        }
        break;
    }

    setOverlays(newOverlays);
  };

  const dismissOverlay = (id: string) => {
    setDismissedOverlays(prev => new Set([...prev, id]));
    setOverlays(prev => prev.filter(overlay => overlay.id !== id));
    onHintDismissed?.(id);
  };

  const getOverlayStyles = (overlay: CodeOverlay) => {
    const baseStyles = 'absolute z-50 max-w-xs p-4 rounded-lg shadow-xl border-2 transform transition-all duration-300 hover:scale-105';
    
    switch (overlay.type) {
      case 'error':
        return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200`;
      case 'suggestion':
        return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200`;
      case 'info':
        return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-200`;
      default:
        return baseStyles;
    }
  };

  const getOverlayIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <Target className="w-5 h-5 text-red-500" />;
      case 'suggestion':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Code className="w-5 h-5 text-blue-500" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  if (!showSpecificHint || overlays.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {overlays.map((overlay) => (
        <div
          key={overlay.id}
          className={getOverlayStyles(overlay)}
          style={{
            left: `${overlay.position.x}px`,
            top: `${overlay.position.y}px`,
            pointerEvents: 'auto'
          }}
        >
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 mt-0.5">
              {getOverlayIcon(overlay.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {overlay.language} Line {overlay.line}
                </span>
                <button
                  onClick={() => dismissOverlay(overlay.id)}
                  className="theme-text-muted hover:theme-text-primary"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm font-medium mb-2">{overlay.message}</p>
              {overlay.action && (
                <div className="flex items-center space-x-1 text-xs">
                  <ArrowRight className="w-3 h-3" />
                  <span className="font-medium">{overlay.action}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Animated arrow pointing to the relevant area */}
          <div className="absolute -bottom-2 left-4">
            <ArrowDown className="w-4 h-4 animate-bounce text-current" />
          </div>
        </div>
      ))}
    </div>
  );
};
