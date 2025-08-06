import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Play, SkipForward, Volume2, VolumeX, CheckCircle, Lightbulb, AlertTriangle, Trophy, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartCodeEditor } from './SmartCodeEditor';
import { useAuth } from '../contexts/AuthContext';
import { validateDetectiveMission, DetectiveMissionValidation } from '../utils/detectiveMissionValidator';
import { ClueProgress } from './ClueProgress';
import { logger, LogCategory } from '../utils/logger';

interface CinematicSlide {
  id: string;
  title: string;
  dialogue: string;
  speaker: string;
  background: string;
  characterImage?: string;
  soundEffect?: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  objective: string;
  brokenHtml: string;
  brokenCss: string;
  targetHtml: string;
  targetCss: string;
  successConditions: string[];
  clueRevealed: string;
  aiHints: string[];
  hintsSteps?: HintStep[];
}

interface HintStep {
  id: string;
  condition: string;
  hint: string;
  points: number;
}

interface DetectiveCaseData {
  id: string;
  title: string;
  description: string;
  story: string;
  objective: string;
  isDetectiveMission: boolean;
  cinematicSlides: CinematicSlide[];
  missions: Mission[];
  finalResolution: string;
  cluePoints: number;
  difficulty: string;
  duration: string;
}

interface DetectiveCaseInterfaceProps {
  caseData: DetectiveCaseData;
  onBack: () => void;
  onComplete: (points: number) => void;
}

type GamePhase = 'cinematic' | 'mission' | 'completion';

export const DetectiveCaseInterface: React.FC<DetectiveCaseInterfaceProps> = ({
  caseData,
  onBack,
  onComplete
}) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('cinematic');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [currentHtml, setCurrentHtml] = useState(caseData.missions[0]?.brokenHtml || '');
  const [currentCss, setCurrentCss] = useState(caseData.missions[0]?.brokenCss || '');
  const [revealedClues, setRevealedClues] = useState<string[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [currentValidation, setCurrentValidation] = useState<DetectiveMissionValidation | null>(null);
  
  // Track whether we should reset code (only on first entry to mission or explicit mission change)
  const [shouldResetCode, setShouldResetCode] = useState(true);
  
  // State to control the active tab in code editor
  const [activeEditorTab, setActiveEditorTab] = useState<'html' | 'css'>('html');
  
  // Auth context for updating user data
  const { userData: _userData, updateUserData: _updateUserData } = useAuth();

  const currentSlide = caseData.cinematicSlides[currentSlideIndex];
  const currentMission = caseData.missions[currentMissionIndex];

  // Initialize mission HTML/CSS only when truly changing missions or entering mission phase for first time
  useEffect(() => {
    if (gamePhase === 'mission' && currentMission && shouldResetCode) {
      // logger.info('🔄 RESETTING CODE FOR MISSION:', { // COMMENTED FOR PRODUCTION
      //   missionId: currentMission.id,
      //   missionTitle: currentMission.title,
      //   missionIndex: currentMissionIndex + 1,
      //   brokenHtmlLength: currentMission.brokenHtml.length,
      //   brokenCssLength: currentMission.brokenCss.length,
      // }, LogCategory.COMPONENT);
      
      setCurrentHtml(currentMission.brokenHtml);
      setCurrentCss(currentMission.brokenCss);
      setMissionCompleted(false);
      setShouldResetCode(false); // Prevent future resets until mission changes
      
      // logger.info('✅ Code reset completed for mission:', currentMission.id, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
    }
  }, [gamePhase, currentMissionIndex, currentMission, shouldResetCode]);

  // Check mission completion with debouncing and proper validation
  useEffect(() => {
    if (gamePhase === 'mission' && currentMission && currentHtml && currentCss) {
      // Debounce validation to prevent triggering while user is still typing
      const timeoutId = setTimeout(() => {
        // Check if code appears to be in a complete state
        if (isCodeInCompleteState(currentHtml, currentCss)) {
          const validation = validateDetectiveMission(
            currentHtml,
            currentCss,
            currentMission.successConditions
          );
          
          setCurrentValidation(validation);
          
          // Debug logging
          // logger.info('🎮 Mission validation (debounced):', { // COMMENTED FOR PRODUCTION
          //   missionId: currentMission.id,
          //   missionTitle: currentMission.title,
          //   missionIndex: currentMissionIndex + 1,
          //   totalMissions: caseData.missions.length,
          //   htmlLength: currentHtml.length,
          //   cssLength: currentCss.length,
          //   conditions: currentMission.successConditions,
          //   completed: validation.completedConditions,
          //   remaining: validation.remainingConditions,
          //   score: validation.score,
          //   isCompleted: validation.isCompleted
          // }, LogCategory.COMPONENT);
          
          // Additional logging for Mission 2 debugging
          if (currentMission.id === 'clue-2') {
            // logger.info('🔍 MISSION 2 DEBUGGING:', LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
            // logger.info('  HTML contains #insta-clue:', currentHtml.toLowerCase().includes('id="insta-clue"'), LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
            // logger.info('  CSS contains #insta-clue:', currentCss.toLowerCase().includes('#insta-clue'), LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
            // logger.info('  CSS contains display: none:', currentCss.toLowerCase().includes('display: none'), LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
            // logger.info('  CSS contains display: block:', currentCss.toLowerCase().includes('display: block'), LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
            // logger.info('  Full CSS for #insta-clue:', currentCss.match(/#insta-clue[^}]*}/gi), LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
          }
          
          if (validation.isCompleted && !missionCompleted) {
            // logger.info('Mission completed! Revealing clue:', currentMission.clueRevealed, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
            setMissionCompleted(true);
            // Always add the clue when mission is completed
            setRevealedClues(prev => {
              if (!prev.includes(currentMission.clueRevealed)) {
                return [...prev, currentMission.clueRevealed];
              }
              return prev;
            });
          }
        } else {
          // Code appears incomplete, show partial progress but don't complete mission
          const validation = validateDetectiveMission(
            currentHtml,
            currentCss,
            currentMission.successConditions
          );
          
          // Set validation but force incomplete state if code isn't properly formed
          setCurrentValidation({
            ...validation,
            isCompleted: false,
            clueUnlocked: false
          });
        }
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timeoutId);
    }
  }, [currentHtml, currentCss, gamePhase, currentMission, missionCompleted]);

  // Helper function to check if code is in a complete/stable state
  const isCodeInCompleteState = (html: string, css: string): boolean => {
    // Check for basic HTML structure completeness
    const htmlBalanced = isHtmlTagsBalanced(html);
    const cssValid = isCssBasicallyValid(css);
    
    // Don't validate if user is in middle of typing a tag or attribute
    const inMiddleOfTag = html.includes('<') && html.lastIndexOf('<') > html.lastIndexOf('>');
    const inMiddleOfAttribute = html.includes('"') && (html.split('"').length - 1) % 2 !== 0;
    const inMiddleCssRule = css.includes('{') && css.lastIndexOf('{') > css.lastIndexOf('}');
    
    return htmlBalanced && cssValid && !inMiddleOfTag && !inMiddleOfAttribute && !inMiddleCssRule;
  };

  // Check if HTML tags are properly balanced (basic check)
  const isHtmlTagsBalanced = (html: string): boolean => {
    try {
      const openTags = (html.match(/<[^/][^>]*>/g) || []).length;
      const closeTags = (html.match(/<\/[^>]*>/g) || []).length;
      const selfClosing = (html.match(/<[^>]*\/>/g) || []).length;
      
      // For basic validation, check if we have reasonable tag balance
      // Allow some flexibility for self-closing tags and DOCTYPE/meta tags
      return Math.abs(openTags - closeTags - selfClosing) <= 2;
    } catch {
      return false;
    }
  };

  // Check if CSS is basically valid (not in middle of editing)
  const isCssBasicallyValid = (css: string): boolean => {
    try {
      // Check for balanced braces
      const openBraces = (css.match(/{/g) || []).length;
      const closeBraces = (css.match(/}/g) || []).length;
      
      return openBraces === closeBraces;
    } catch {
      return false;
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < caseData.cinematicSlides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      setShouldResetCode(true); // Ensure code resets when entering mission phase
      setGamePhase('mission');
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleSkipCinematic = () => {
    setShouldResetCode(true); // Ensure code resets when skipping to mission phase
    setGamePhase('mission');
  };

  const handleNextMission = () => {
    // logger.info('🚀 MISSION TRANSITION:', { // COMMENTED FOR PRODUCTION
    //   from: `Mission ${currentMissionIndex + 1} (${currentMission?.id})`,
    //   to: `Mission ${currentMissionIndex + 2} (${caseData.missions[currentMissionIndex + 1]?.id})`,
    //   totalMissions: caseData.missions.length
    // }, LogCategory.COMPONENT);
    
    if (currentMissionIndex < caseData.missions.length - 1) {
      setCurrentMissionIndex(prev => {
        const newIndex = prev + 1;
        // logger.info('🎯 Setting new mission index:', newIndex, LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
        return newIndex;
      });
      setMissionCompleted(false);
      setShouldResetCode(true); // Trigger code reset for new mission
      
      // Switch to HTML tab when transitioning to next mission
      setActiveEditorTab('html');
    } else {
      // logger.info('🏁 All missions completed, showing completion', LogCategory.COMPONENT); // COMMENTED FOR PRODUCTION
      setShowCompletion(true);
    }
  };

  const handleCodeChange = useCallback((html: string, css: string) => {
    setCurrentHtml(html);
    setCurrentCss(css);
  }, []);

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-amber-500/30 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-blue-500/30 rounded-full"></div>
          <div className="absolute bottom-40 left-40 w-20 h-20 border border-green-500/30 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-purple-500/30 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
          <div className="max-w-2xl w-full">
            {/* Detective Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-2xl mb-6 relative">
                <Trophy className="w-16 h-16 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
                Case Solved!
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                🎉 Excellent detective work! You've successfully solved "{caseData.title}" using your HTML/CSS investigation skills.
              </p>
            </div>

            {/* Case Summary */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mb-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-amber-400">Investigation Summary</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                  <span className="text-3xl font-bold">A+</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">SOLVED</div>
                    <div className="text-xs opacity-80">{caseData.cluePoints} points</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Case: {caseData.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Clues found: {revealedClues.length}/{caseData.missions.length}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Missions completed: {caseData.missions.length}/{caseData.missions.length}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Investigation status: ✅ SOLVED</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-amber-300">🎉 Detective experience gained!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Resolution */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-8 shadow-2xl">
              <h3 className="text-xl font-bold text-blue-400 mb-4">📋 Case Resolution</h3>
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
                {caseData.finalResolution.split('\n').map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onComplete(caseData.cluePoints)}
                className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span className="flex items-center gap-3">
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  Continue Investigation
                </span>
              </button>

              <button
                onClick={onBack}
                className="px-8 py-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white rounded-xl font-semibold transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50"
              >
                Back to Cases
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg-primary">
      {/* Header */}
      <div className="theme-card theme-border-b sticky top-0 z-50 backdrop-blur-lg">
        <div className="theme-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 theme-hover-bg rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 theme-text-secondary" />
              </button>
              <div>
                <h1 className="text-xl font-bold theme-text-primary">{caseData.title}</h1>
                <p className="text-sm theme-text-muted">Detective Mission • {caseData.duration}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm theme-text-muted">
                Phase: {gamePhase === 'cinematic' ? 'Investigation Briefing' : `Mission ${currentMissionIndex + 1}/3`}
              </div>
              {gamePhase === 'cinematic' && (
                <button
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className="p-2 theme-hover-bg rounded-lg transition-colors"
                >
                  {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Phase */}
      {gamePhase === 'cinematic' && (
        <div className="theme-container py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="theme-card rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)' }}>
                {/* Slide Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{currentSlide.title}</h2>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <span className="text-sm">🕵️ {currentSlide.speaker}</span>
                  </div>
                </div>

                {/* Slide Content */}
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Character/Background Image */}
                    <div className="lg:w-1/3">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-2">
                            {currentSlide.speaker === 'Police Chief' ? '👮‍♂️' : 
                             currentSlide.speaker === 'Detective Codec' ? '🕵️‍♀️' : '💻'}
                          </div>
                          <p className="text-sm theme-text-muted">{currentSlide.background}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dialogue */}
                    <div className="lg:w-2/3">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg p-6">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.7 }}
                          className="text-lg leading-relaxed theme-text-primary"
                        >
                          {currentSlide.dialogue}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm theme-text-muted">
                      Slide {currentSlideIndex + 1} of {caseData.cinematicSlides.length}
                    </span>
                    <div className="flex space-x-1">
                      {caseData.cinematicSlides.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentSlideIndex ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSkipCinematic}
                      className="px-4 py-2 theme-button-secondary rounded-lg text-sm"
                    >
                      <SkipForward className="w-4 h-4 mr-2 inline" />
                      Skip to Investigation
                    </button>
                    
                    {currentSlideIndex > 0 && (
                      <button
                        onClick={handlePrevSlide}
                        className="px-4 py-2 theme-button-secondary rounded-lg text-sm"
                      >
                        Previous
                      </button>
                    )}
                    
                    <button
                      onClick={handleNextSlide}
                      className="px-4 py-2 theme-btn-primary rounded-lg text-sm"
                    >
                      {currentSlideIndex === caseData.cinematicSlides.length - 1 ? (
                        <>
                          <Play className="w-4 h-4 mr-2 inline" />
                          Start Investigation
                        </>
                      ) : (
                        'Next'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Mission Phase */}
      {gamePhase === 'mission' && currentMission && (
        <div className="theme-container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mission Info & Clues Panel */}
            <div className="lg:col-span-1">
              <div className="theme-card rounded-xl p-6 mb-6" style={{ boxShadow: 'var(--shadow-md)' }}>
                <h3 className="text-xl font-bold theme-text-primary mb-4">{currentMission.title}</h3>
                <p className="theme-text-secondary mb-4">{currentMission.description}</p>
                
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🎯 Objective:</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">{currentMission.objective}</p>
                </div>

                {/* Dynamic Clue Progress */}
                {currentValidation && (
                  <ClueProgress 
                    validation={currentValidation}
                    missionTitle={currentMission.title}
                    clueRevealed={currentMission.clueRevealed}
                    isCompleted={missionCompleted}
                  />
                )}

                {/* Revealed Clues */}
                <div className="mb-4">
                  <h4 className="font-semibold theme-text-primary mb-2">🔍 Clues Found:</h4>
                  {revealedClues.map((clue, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-2"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 dark:text-green-200 font-medium">
                          Clue {index + 1}: {clue}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mission Completion Status */}
                {missionCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-100 dark:bg-green-800 border border-green-300 dark:border-green-600 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800 dark:text-green-200">Mission Complete!</span>
                    </div>
                    <button
                      onClick={handleNextMission}
                      className="w-full theme-btn-primary py-2 text-sm rounded-lg"
                    >
                      {currentMissionIndex < caseData.missions.length - 1 ? 'Next Mission' : 'Solve Case'}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Code Editor Panel */}
            <div className="lg:col-span-2 relative">
              <SmartCodeEditor
                initialHtml={currentHtml}
                initialCss={currentCss}
                onCodeChange={handleCodeChange}
                validationResult={currentValidation}
                activeTab={activeEditorTab}
                onTabChange={setActiveEditorTab}
              />
              
              {/* Tutorial-style Hints Panel */}
              <div className="fixed bottom-6 right-6 max-w-sm w-full z-50">
                <AnimatePresence>
                  {currentValidation && !missionCompleted && renderHintsPanel()}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Tutorial-style hints rendering function
  function renderHintsPanel() {
    const currentStep = getCurrentDetectiveStep();
    if (!currentStep) return null;

    return (
      <motion.div
        key={`hint-${currentStep.id}`}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl p-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-200 mb-1">Detective Hint</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStep.hint}
            </p>
          </div>
          {currentStep.isValid && (
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          )}
        </div>
        
        {currentStep.error && (
          <div className="mt-3 p-2 bg-red-500/20 rounded border border-red-500/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-300">{currentStep.error}</span>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Get current detective step based on validation
  function getCurrentDetectiveStep() {
    if (!currentMission || !currentValidation) return null;

    const missionId = currentMission.id;
    const html = currentHtml.toLowerCase();
    const css = currentCss.toLowerCase();

    if (missionId === 'clue-1') {
      // Check for hidden attribute issue
      if (html.includes('hidden')) {
        return {
          id: 'remove-hidden',
          hint: '🔍 I can see a paragraph with the "hidden" attribute! Remove the word "hidden" to reveal Sam\'s secret message.',
          isValid: false,
          error: null
        };
      }
      
      // Check for center tags
      if (html.includes('<center>') || html.includes('</center>')) {
        return {
          id: 'remove-center',
          hint: '🏗️ The <center> tags are outdated! Replace them with semantic HTML elements like <header> and <footer>.',
          isValid: false,
          error: null
        };
      }

      // Check for syntax errors
      if (hasCSSError(css)) {
        return {
          id: 'css-error',
          hint: '⚠️ There\'s a CSS syntax error. Check for missing colons, semicolons, or malformed properties.',
          isValid: false,
          error: 'CSS syntax error detected'
        };
      }

      // All conditions met
      return {
        id: 'mission-complete',
        hint: '🎉 Excellent detective work! You\'ve revealed the hidden clue. The mission is complete!',
        isValid: true,
        error: null
      };
    }

    if (missionId === 'clue-2') {
      // Check for display issue
      if (css.includes('display: none') || css.includes('display:none')) {
        return {
          id: 'fix-display',
          hint: '👁️ I found hidden Instagram evidence! Change "display: none" to "display: block" to reveal it.',
          isValid: false,
          error: null
        };
      }

      // Check for missing ID target
      if (!html.includes('id="insta-clue"')) {
        return {
          id: 'add-id',
          hint: '🎯 Add id="insta-clue" to the Instagram evidence element so we can style it with CSS.',
          isValid: false,
          error: null
        };
      }

      // All conditions met
      return {
        id: 'mission-complete',
        hint: '🎉 Perfect! You\'ve uncovered the Instagram evidence. Another clue revealed!',
        isValid: true,
        error: null
      };
    }

    if (missionId === 'clue-3') {
      // Check for visibility issue
      if (css.includes('visibility: hidden') || css.includes('visibility:hidden')) {
        return {
          id: 'fix-visibility',
          hint: '🕵️ There\'s hidden address information! Change "visibility: hidden" to "visibility: visible".',
          isValid: false,
          error: null
        };
      }

      // All conditions met
      return {
        id: 'mission-complete',
        hint: '🎉 Outstanding work! You\'ve found the final piece of evidence. Case solved!',
        isValid: true,
        error: null
      };
    }

    // Default encouragement
    return {
      id: 'investigate',
      hint: '🔍 Keep investigating the code! Look for hidden elements or broken HTML/CSS that might contain clues.',
      isValid: false,
      error: null
    };
  }

  // Helper function to check for CSS errors
  function hasCSSError(css: string): boolean {
    // Check for incomplete CSS rules
    if (css.includes('display: ;') || css.includes('display:;')) return true;
    if (css.includes('visibility: ;') || css.includes('visibility:;')) return true;
    
    // Check for unclosed braces
    const openBraces = (css.match(/{/g) || []).length;
    const closeBraces = (css.match(/}/g) || []).length;
    if (openBraces !== closeBraces) return true;
    
    return false;
  }
};
