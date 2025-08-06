import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code, Palette, Layout, Zap, ChevronRight } from 'lucide-react';
import { Header } from './Header';
import { HTMLBasicsContent } from './LearnPageDocs/HTMLBasicsContent';
import { HTMLAdvancedContent } from './LearnPageDocs/HTMLAdvancedContent';
import { CSSBasicsContent } from './LearnPageDocs/CSSBasicsContent';
import { CSSAdvancedContent } from './LearnPageDocs/CSSAdvancedContent';
import { LayoutsContent } from './LearnPageDocs/LayoutsContent';
import { GridSystemContent } from './LearnPageDocs/GridSystemContent';
import { ResponsiveContent } from './LearnPageDocs/ResponsiveContent';
import { AnimationsContent } from './LearnPageDocs/AnimationsContent';

interface LearnPageProps {
  onBack: () => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('html-basics');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to handle section change and scroll to top
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    // Instant scroll to top for snappy, responsive feel
    window.scrollTo(0, 0);
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    {
      id: 'html-basics',
      title: 'HTML Fundamentals',
      icon: <Code className="w-5 h-5" />,
      description: 'Learn the building blocks of web pages',
      badge: '🏗️'
    },
    {
      id: 'html-advanced',
      title: 'Advanced HTML',
      icon: <Code className="w-5 h-5" />,
      description: 'Forms, tables, semantic elements & accessibility',
      badge: '⚡'
    },
    {
      id: 'css-basics',
      title: 'CSS Styling',
      icon: <Palette className="w-5 h-5" />,
      description: 'Master the art of styling and design',
      badge: '🎨'
    },
    {
      id: 'css-advanced',
      title: 'Advanced CSS',
      icon: <Palette className="w-5 h-5" />,
      description: 'Preprocessors, custom properties & architecture',
      badge: '🚀'
    },
    {
      id: 'layouts',
      title: 'Layouts & Flexbox',
      icon: <Layout className="w-5 h-5" />,
      description: 'Create responsive and flexible layouts',
      badge: '📐'
    },
    {
      id: 'grid-system',
      title: 'CSS Grid Mastery',
      icon: <Layout className="w-5 h-5" />,
      description: 'Master complex layouts with CSS Grid',
      badge: '🎯'
    },
    {
      id: 'responsive',
      title: 'Responsive Design',
      icon: <Zap className="w-5 h-5" />,
      description: 'Mobile-first design & media queries',
      badge: '📱'
    },
    {
      id: 'animations',
      title: 'Animations & Effects',
      icon: <Zap className="w-5 h-5" />,
      description: 'CSS animations, transitions & transforms',
      badge: '✨'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Global Header with Audio Controls */}
      <Header 
        onHomeClick={() => navigate('/')}
        onLearnClick={() => {}}
        onAuthClick={() => navigate('/signin')}
        onProfileClick={() => navigate('/profile')}
      />
      
      {/* Detective atmosphere overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-800/50 backdrop-blur-sm rounded-lg transition-colors border border-slate-700/30"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-400/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-lg lg:text-xl font-bold text-white">Detective's Code Academy</h1>
                  <p className="text-xs lg:text-sm text-slate-300 hidden sm:block">Master HTML & CSS fundamentals</p>
                </div>
              </div>
            </div>
            
            <div className="text-xs lg:text-sm text-slate-300 font-mono hidden md:block">
              🕵️ Learn • Practice • Solve
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 lg:py-8">
        {/* Mobile Section Selector */}
        <div className="lg:hidden mb-6">
          <div className="relative bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl shadow-xl p-4">
            <h2 className="text-lg font-bold text-white mb-4">Learning Path</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`text-left p-3 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-amber-600/90 via-yellow-500/90 to-amber-600/90 text-black backdrop-blur-sm border border-amber-400/60 shadow-lg shadow-amber-500/25'
                      : 'bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm text-slate-200 border border-slate-600/30 hover:border-slate-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {section.icon}
                      <span className="text-lg">{section.badge}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className={`text-xs truncate ${
                        activeSection === section.id ? 'text-amber-900' : 'text-slate-300'
                      }`}>
                        {section.description}
                      </div>
                    </div>
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 rotate-90 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Navigation */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="relative bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl shadow-2xl p-6 sticky top-24">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 rounded-xl"></div>
              <h2 className="relative z-10 text-lg font-bold text-white mb-4">Learning Path</h2>
              <nav className="relative z-10 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-amber-600/90 via-yellow-500/90 to-amber-600/90 text-black backdrop-blur-sm border border-amber-400/60 shadow-lg shadow-amber-500/25'
                        : 'hover:bg-slate-700/50 backdrop-blur-sm text-slate-200 border border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {section.icon}
                        <span className="text-lg">{section.badge}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{section.title}</div>
                        <div className={`text-xs ${
                          activeSection === section.id ? 'text-amber-900' : 'text-slate-300'
                        }`}>
                          {section.description}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        activeSection === section.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="relative bg-gradient-to-br from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5"></div>
              
              {/* Mobile section header */}
              <div className="lg:hidden relative z-10 bg-gradient-to-r from-amber-600/20 to-yellow-500/20 border-b border-amber-400/30 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {sections.find(s => s.id === activeSection)?.icon}
                    <span className="text-xl">{sections.find(s => s.id === activeSection)?.badge}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{sections.find(s => s.id === activeSection)?.title}</h2>
                    <p className="text-sm text-amber-200">{sections.find(s => s.id === activeSection)?.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 p-4 lg:p-0">
                {activeSection === 'html-basics' && <HTMLBasicsContent copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
                {activeSection === 'html-advanced' && <HTMLAdvancedContent copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
                {activeSection === 'css-basics' && <CSSBasicsContent copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
                {activeSection === 'css-advanced' && <CSSAdvancedContent copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
                {activeSection === 'layouts' && <LayoutsContent copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
                {activeSection === 'grid-system' && <GridSystemContent copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
                {activeSection === 'responsive' && <ResponsiveContent copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
                {activeSection === 'animations' && <AnimationsContent copyToClipboard={copyToClipboard} copiedCode={copiedCode} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
