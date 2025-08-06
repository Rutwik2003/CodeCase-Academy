import React from 'react';
import { Github, Heart } from 'lucide-react';

// Discord Icon Component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

interface FooterProps {
  onLearnClick?: () => void;
  onAboutClick?: () => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onLearnClick, onAboutClick, onPrivacyClick, onTermsClick }) => {
  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-slate-700/50">
      {/* Detective atmosphere overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Detective Agency Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🕵️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-100">Code<span className="text-amber-400">Case</span></h3>
                <p className="text-sm text-slate-400 font-mono uppercase tracking-wider">Detective Academy</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Master HTML & CSS through elite detective training. Investigate digital crime scenes, 
              decode web mysteries, and become a certified forensic web developer.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => openExternalLink('https://github.com/rutwik2003')}
                className="text-slate-400 hover:text-amber-400 transition-colors p-3 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 hover:border-amber-400/50"
                title="GitHub Repository"
              >
                <Github className="w-6 h-6" />
              </button>
              <button 
                onClick={() => openExternalLink('https://discord.rutwikdev.com/')}
                className="text-slate-400 hover:text-blue-400 transition-colors p-3 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 hover:border-blue-400/50"
                title="Join Discord Community"
              >
                <DiscordIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Investigation Training */}
          <div>
            <h4 className="text-lg font-bold text-slate-100 mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span>Training</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={onLearnClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  HTML Forensics
                </button>
              </li>
              <li>
                <button 
                  onClick={onLearnClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  CSS Investigation
                </button>
              </li>
              <li>
                <button 
                  onClick={onLearnClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  Responsive Analysis
                </button>
              </li>
              <li>
                <button 
                  onClick={onLearnClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  Animation Decoding
                </button>
              </li>
            </ul>
          </div>
          
          {/* Combined Platform & Community Section */}
          <div>
            <h4 className="text-lg font-bold text-slate-100 mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Community</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={onAboutClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  About CodeCase
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openExternalLink('https://discord.rutwikdev.com/')}
                  className="text-slate-400 hover:text-blue-300 transition-colors text-left font-medium"
                >
                  Join Discord Community
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openExternalLink('https://discord.rutwikdev.com/')}
                  className="text-slate-400 hover:text-emerald-300 transition-colors text-left font-medium"
                >
                  Support & Help
                </button>
              </li>
              <li>
                <button 
                  onClick={onPrivacyClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={onTermsClick}
                  className="text-slate-400 hover:text-amber-300 transition-colors text-left font-medium"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Detective Badge Footer */}
        <div className="border-t border-slate-700/50 pt-8">
          <div className="bg-gradient-to-r from-slate-800/40 via-slate-700/20 to-slate-800/40 backdrop-blur-md border border-slate-600/30 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-400/30 rounded-xl flex items-center justify-center">
                  <Heart className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-slate-300 text-sm">
                  <span className="font-medium">Built with </span>
                  <span className="text-amber-400 font-mono">detective passion</span>
                  <span className="font-medium"> by <a href="https://github.com/rutwik2003" target="_blank" rel="noopener noreferrer">Rutwik Butani</a></span>
                </p>
              </div>
              <p className="text-slate-400 text-sm font-mono">
                © 2025 CodeCase Detective Academy. All evidence secured.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};