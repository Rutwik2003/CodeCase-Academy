import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AudioProvider } from '../contexts/AudioContext';
import { HomePage } from './HomePage';
import { TutorialCase } from './TutorialCase';
import { VanishingBloggerCase } from './VanishingBloggerCase';
import { LearnPage } from './LearnPage';
import { AuthPage } from './AuthPage';
import { ProfilePage } from './ProfilePage';
import { AboutPage } from './AboutPage';
import { PrivacyPage } from './PrivacyPage';
import { TermsPage } from './TermsPage';
import { NotFoundPage } from './NotFoundPage';
import { Footer } from './Footer';
import InteractiveTourTooltip from './InteractiveTourTooltip';
import CMSRouter from '../cms/CMSRouter';

// Component to scroll to top on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

interface AppRouterProps {
  availableHints: number;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onCaseComplete: (caseId: string, score: number, timeSpent: number, hintsUsed: number) => void;
}

// Create wrapper components that provide navigate function
function AuthPageWrapper() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  return <AuthPage onBack={handleBack} />;
}

function LearnPageWrapper() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  return <LearnPage onBack={handleBack} />;
}

function ProfilePageWrapper() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  return <ProfilePage onBack={handleBack} />;
}

function AboutPageWrapper() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  return <AboutPage onBack={handleBack} />;
}

function PrivacyPageWrapper() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  // Scroll to top when Privacy page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return <PrivacyPage onBack={handleBack} />;
}

function TermsPageWrapper() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  // Scroll to top when Terms page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  return <TermsPage onBack={handleBack} />;
}

function FooterWrapper() {
  const navigate = useNavigate();
  const { pathname } = window.location;
  
  // Don't show footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  const handleLearnClick = () => navigate('/training');
  const handleAboutClick = () => {
    navigate('/about');
    // Scroll to top when navigating to About page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handlePrivacyClick = () => {
    navigate('/privacy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleTermsClick = () => {
    navigate('/terms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return <Footer 
    onLearnClick={handleLearnClick} 
    onAboutClick={handleAboutClick}
    onPrivacyClick={handlePrivacyClick}
    onTermsClick={handleTermsClick}
  />;
}

function TutorialCaseWrapper({ onCaseComplete }: { onCaseComplete: (caseId: string, score: number, timeSpent: number, hintsUsed: number) => void }) {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  const handleComplete = (points: number) => {
    onCaseComplete('case-tutorial', points, 0, 0);
    // Navigate back to homepage after completing the tutorial
    // Use replace to force a fresh render of the homepage
    navigate('/', { replace: true });
  };
  
  return (
    <TutorialCase 
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}

function VanishingBloggerWrapper({ onCaseComplete }: { onCaseComplete: (caseId: string, score: number, timeSpent: number, hintsUsed: number) => void }) {
  const navigate = useNavigate();
  const handleBack = () => navigate('/');
  
  const handleComplete = (points: number) => {
    onCaseComplete('visual-vanishing-blogger', points, 0, 0);
    // Navigate back to homepage after completing the case
    // Use replace to force a fresh render of the homepage
    navigate('/', { replace: true });
  };
  
  return (
    <VanishingBloggerCase 
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}

// Helper component to handle dynamic case routes
function CaseRouteHandler({ onCaseComplete }: { onCaseComplete: (caseId: string, score: number, timeSpent: number, hintsUsed: number) => void }) {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  
  if (!caseId) {
    return <Navigate to="/" replace />;
  }

  const handleBack = () => navigate('/');
  
  // Function to handle case completion with consistent navigation behavior
  const handleCaseComplete = (caseName: string, points: number) => {
    onCaseComplete(caseName, points, 0, 0);
    // Use replace to force a fresh render of the homepage
    navigate('/', { replace: true });
  };

  // Handle different case types dynamically
  switch (caseId) {
    case 'case-vanishing-blogger':
      return (
        <TutorialCaseWrapper 
          onCaseComplete={onCaseComplete}
        />
      );
    case 'visual-vanishing-blogger':
      return (
        <VanishingBloggerWrapper 
          onCaseComplete={onCaseComplete}
        />
      );
    case 'case-2':
    case 'case-3':
    case 'case-4':
    case 'case-5':
      // For future cases, you can add specific components here
      // For now, show a "Coming Soon" message
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-white mb-4">Case Coming Soon!</h1>
            <p className="text-slate-300 mb-6">This case is under development.</p>
            <button 
              onClick={handleBack}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
            >
              Return to Cases
            </button>
          </div>
        </div>
      );
    default:
      return <Navigate to="/" replace />;
  }
}

export function AppRouter({ availableHints, addToast, onCaseComplete }: AppRouterProps) {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <AudioProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/training" element={<LearnPageWrapper />} />
            <Route path="/about" element={<AboutPageWrapper />} />
            <Route path="/privacy" element={<PrivacyPageWrapper />} />
            <Route path="/terms" element={<TermsPageWrapper />} />
            
            {/* Auth Routes */}
            <Route 
              path="/signin" 
              element={
                currentUser ? 
                <Navigate to="/" replace /> : 
                <AuthPageWrapper />
              } 
            />
            <Route 
              path="/signup" 
              element={
                currentUser ? 
                <Navigate to="/" replace /> : 
                <AuthPageWrapper />
              } 
            />

            {/* Case Routes */}
            <Route 
              path="/tutorialcase" 
              element={
                <TutorialCaseWrapper 
                  onCaseComplete={onCaseComplete}
                />
              } 
            />
            <Route 
              path="/vanishingblogger" 
              element={
                <VanishingBloggerWrapper 
                  onCaseComplete={onCaseComplete}
                />
              } 
            />
            <Route 
              path="/case/:caseId" 
              element={
                <CaseRouteHandler 
                  onCaseComplete={onCaseComplete}
                />
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                currentUser ? 
                <ProfilePageWrapper /> : 
                <Navigate to="/signin" replace />
              } 
            />
            <Route 
              path="/profile/referral" 
              element={
                currentUser ? 
                <ProfilePageWrapper /> : 
                <Navigate to="/signin" replace />
              } 
            />
            <Route 
              path="/profile/achievements" 
              element={
                currentUser ? 
                <ProfilePageWrapper /> : 
                <Navigate to="/signin" replace />
              } 
            />

            {/* CMS Admin Routes */}
            <Route 
              path="/admin/*" 
              element={<CMSRouter />} 
            />
            <Route 
              path="/cms/*" 
              element={<CMSRouter />} 
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        
        {/* Global Footer - appears on all pages except admin */}
        <FooterWrapper />
      </div>
      
      {/* Add InteractiveTourTooltip inside Router context */}
      <InteractiveTourTooltip />
      </AudioProvider>
    </BrowserRouter>
  );
}
