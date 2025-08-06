import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Search, ChevronRight, Badge, Trophy, Lightbulb } from 'lucide-react';
import { Toast } from './Toast';
import { showAlert, showConfirm, alertManager } from './CustomAlert';
import { useAuth } from '../contexts/AuthContext';
import { AudioWaveform } from './AudioWaveform';

// Import character images
import policeGuyImg from '/assets/police_guy.jpeg';
import subordinateImg from '/assets/subordinate_detective.jpeg';
import hintGuyImg from '/assets/hint_guy.jpeg';

// Import device/investigation images
import laptopCloseupImg from '/assets/laptop_closeup.png.png';
import phoneCloseupImg from '/assets/phone_closeup.png.png';
import notebookImg from '/assets/notebook.png';
import desktopFileImg from '/assets/desktop_file.png';
import rishiRoomImg from '/assets/rishi_room.png';
import rishiEmbarrassedImg from '/assets/rishi_embarrassed.png';
import confessionNoteImg from '/assets/confession_note.png.png';

// Scene types for the investigation flow
type GameScene = 'introduction' | 'building' | 'room' | 'investigation' | 'confrontation' | 'completed';
type InvestigationItem = 'laptop' | 'phone' | 'notebook' | 'desktop' | null;

interface VanishingBloggerCaseProps {
  onBack: () => void;
  onComplete: (points: number) => void;
}

interface Evidence {
  id: string;
  title: string;
  description: string;
  revealed: boolean;
}

interface CodePuzzle {
  id: string;
  name: string;
  description: string;
  problemStatement: string;
  brokenCode: string;
  fixedCode: string;
  solved: boolean;
  evidence: Evidence;
}

export const VanishingBloggerCase: React.FC<VanishingBloggerCaseProps> = ({
  onBack,
  onComplete
}) => {
  // Auth context for hint points
  const { userData, updateUserData } = useAuth();
  
  // Game state
  const [currentScene, setCurrentScene] = useState<GameScene>('introduction');
  const [, setActiveItem] = useState<InvestigationItem>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  
  // Persistent hint system - tracks which hints are unlocked for each puzzle
  const [unlockedHints, setUnlockedHints] = useState<{[puzzleId: string]: boolean}>({});
  const [showHintPanel, setShowHintPanel] = useState(false);

  // Load unlocked hints from localStorage on component mount
  useEffect(() => {
    if (userData?.uid) {
      const savedHints = localStorage.getItem(`vanishingBloggerUnlockedHints_${userData.uid}`);
      if (savedHints) {
        try {
          setUnlockedHints(JSON.parse(savedHints));
        } catch (error) {
          console.error('Error loading saved hints:', error);
        }
      }
    }
  }, [userData?.uid]);

  // Save unlocked hints to localStorage whenever they change
  useEffect(() => {
    if (userData?.uid && Object.keys(unlockedHints).length > 0) {
      localStorage.setItem(`vanishingBloggerUnlockedHints_${userData.uid}`, JSON.stringify(unlockedHints));
    }
  }, [unlockedHints, userData?.uid]);

  // Evidence and puzzles state
  const [puzzles, setPuzzles] = useState<CodePuzzle[]>([
    {
      id: 'laptop',
      name: 'Laptop Investigation',
      description: 'The blog draft is completely invisible! There\'s a CSS property hiding the content.',
      problemStatement: 'PROBLEM: The blog draft div is hidden from view. Find the CSS property that\'s making it invisible and fix it to reveal Rishi\'s secret blog post.',
      brokenCode: `<div class="blog-draft" style="display: none;">
  <h2>The Truth About Sherpa Companies</h2>
  <p>I've discovered some shady practices...</p>
</div>`,
      fixedCode: `<div class="blog-draft" style="display: block;">
  <h2>The Truth About Sherpa Companies</h2>
  <p>I've discovered some shady practices...</p>
</div>`,
      solved: false,
      evidence: {
        id: 'blog-draft',
        title: 'Blog Draft Found',
        description: 'Draft post accusing Sherpa companies of shady practices.',
        revealed: false
      }
    },
    {
      id: 'phone',
      name: 'Phone Messages',
      description: 'The message is completely misaligned and unreadable! The flex container layout is broken.',
      problemStatement: 'PROBLEM: The message container uses flexbox but it\'s wrongly configured. The content should be centered both horizontally and vertically.',
      brokenCode: `.message-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}`,
      fixedCode: `.message-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}`,
      solved: false,
      evidence: {
        id: 'fame-message',
        title: 'Suspicious Message',
        description: 'Message found: "I\'ll be famous by tomorrow."',
        revealed: false
      }
    },
    {
      id: 'notebook',
      name: 'Personal Notes',
      description: 'There\'s something written in the notebook but it\'s cut off! The container is hiding the content.',
      problemStatement: 'PROBLEM: The notebook page has overflow issues and wrong positioning. The hidden plan is positioned outside the visible area.',
      brokenCode: `.notebook-page {
  width: 300px;
  height: 200px;
  overflow: hidden;
}
.hidden-plan {
  width: 500px;
  height: 400px;
  position: relative;
  top: -200px;
  left: -100px;
}`,
      fixedCode: `.notebook-page {
  width: 300px;
  height: 200px;
  overflow: visible;
}
.hidden-plan {
  width: 300px;
  height: 200px;
  position: relative;
  top: 0px;
  left: 0px;
}`,
      solved: false,
      evidence: {
        id: 'disappearance-plan',
        title: 'Disappearance Plan',
        description: 'Plan to disappear, fake proof on Reddit, gain followers.',
        revealed: false
      }
    },
    {
      id: 'desktop',
      name: 'Desktop Files',
      description: 'The desktop files are invisible! The grid layout is broken and nothing shows up.',
      problemStatement: 'PROBLEM: The CSS Grid has zero height for its rows. The grid-auto-rows property needs to be fixed to give the files proper height.',
      brokenCode: `.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  grid-auto-rows: 0px;
}`,
      fixedCode: `.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  grid-auto-rows: minmax(100px, auto);
}`,
      solved: false,
      evidence: {
        id: 'fake-screenshots',
        title: 'Fake Reddit Screenshots',
        description: 'Prepared fake Reddit screenshots for the hoax.',
        revealed: false
      }
    }
  ]);

  const [currentPuzzle, setCurrentPuzzle] = useState<CodePuzzle | null>(null);
  const [codeInput, setCodeInput] = useState('');

  // Character dialogue states
  const [currentDialogue, setCurrentDialogue] = useState('');
  const [showDialogue, setShowDialogue] = useState(false);

  // Calculate progress
  const solvedPuzzles = puzzles.filter(p => p.solved).length;
  const totalPuzzles = puzzles.length;
  const progress = (solvedPuzzles / totalPuzzles) * 100;

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const showCharacterDialogue = (_character: string, text: string) => {
    setCurrentDialogue(text);
    setShowDialogue(true);
    setTimeout(() => setShowDialogue(false), 4000);
  };

  const handleItemClick = (item: InvestigationItem) => {
    if (!item) return;
    
    const puzzle = puzzles.find(p => p.id === item);
    if (puzzle && !puzzle.solved) {
      setActiveItem(item);
      setCurrentPuzzle(puzzle);
      setCodeInput(puzzle.brokenCode);
      setCurrentScene('investigation');
    } else if (puzzle && puzzle.solved) {
      showToast(`✅ Already solved: ${puzzle.evidence.title}`);
    }
  };

  const handleCodeSubmit = () => {
    if (!currentPuzzle) return;

    // More precise validation logic for each puzzle type with flexible spacing
    let isCorrect = false;
    const normalizedCode = codeInput.replace(/\s+/g, ' ').trim();
    
    switch (currentPuzzle.id) {
      case 'laptop': {
        // Must have display: block (not display: none)
        const hasDisplayBlock = normalizedCode.includes('display:block') || normalizedCode.includes('display: block');
        const hasDisplayNone = normalizedCode.includes('display:none') || normalizedCode.includes('display: none');
        isCorrect = hasDisplayBlock && !hasDisplayNone;
        break;
      }
        
      case 'phone': {
        // Must have ALL three properties correct: column, center, center
        const hasColumn = normalizedCode.includes('flex-direction:column') || normalizedCode.includes('flex-direction: column');
        const hasAlignCenter = normalizedCode.includes('align-items:center') || normalizedCode.includes('align-items: center');
        const hasJustifyCenter = normalizedCode.includes('justify-content:center') || normalizedCode.includes('justify-content: center');
        isCorrect = hasColumn && hasAlignCenter && hasJustifyCenter;
        break;
      }
        
      case 'notebook': {
        // Must have overflow: visible AND correct positioning (both top: 0px and left: 0px)
        const hasVisibleOverflow = normalizedCode.includes('overflow:visible') || normalizedCode.includes('overflow: visible');
        const hasCorrectTop = normalizedCode.includes('top:0px') || normalizedCode.includes('top: 0px') || normalizedCode.includes('top:0') || normalizedCode.includes('top: 0');
        const hasCorrectLeft = normalizedCode.includes('left:0px') || normalizedCode.includes('left: 0px') || normalizedCode.includes('left:0') || normalizedCode.includes('left: 0');
        isCorrect = hasVisibleOverflow && hasCorrectTop && hasCorrectLeft;
        break;
      }
        
      case 'desktop': {
        // Must have the minmax value (flexible spacing)
        isCorrect = normalizedCode.includes('minmax(100px,auto)') || 
                   normalizedCode.includes('minmax(100px, auto)') ||
                   normalizedCode.includes('minmax( 100px , auto )') ||
                   normalizedCode.includes('minmax( 100px, auto)') ||
                   normalizedCode.includes('minmax(100px ,auto)');
        break;
      }
        
      default:
        isCorrect = codeInput.trim() === currentPuzzle.fixedCode.trim();
    }
    
    if (isCorrect) {
      // Update puzzle state
      setPuzzles(prev => prev.map(p => 
        p.id === currentPuzzle.id 
          ? { ...p, solved: true, evidence: { ...p.evidence, revealed: true } }
          : p
      ));
      
      showToast(`🔍 Evidence discovered: ${currentPuzzle.evidence.title}`);
      
      // Return to room after solving
      setTimeout(() => {
        setCurrentScene('room');
        setActiveItem(null);
        setCurrentPuzzle(null);
        
        // Check if all puzzles are solved
        const newSolvedCount = puzzles.filter(p => p.solved).length + 1;
        if (newSolvedCount === totalPuzzles) {
          setTimeout(() => {
            setCurrentScene('confrontation');
            showCharacterDialogue('police', "We caught him livestreaming his 'grand comeback' at a café nearby. Help us extract his confession note.");
          }, 1000);
        }
      }, 2000);
    } else {
      // More specific error messages
      let errorMessage = '❌ That\'s not quite right. ';
      
      switch (currentPuzzle.id) {
        case 'laptop':
          errorMessage += 'Make sure you change "display: none" to "display: block"';
          break;
        case 'phone':
          errorMessage += 'You need ALL three properties: flex-direction: column, align-items: center, AND justify-content: center';
          break;
        case 'notebook':
          errorMessage += 'You need "overflow: visible" AND both "top: 0px" and "left: 0px"';
          break;
        case 'desktop':
          errorMessage += 'Use exactly "grid-auto-rows: minmax(100px, auto)"';
          break;
        default:
          errorMessage += 'Check the CSS carefully!';
      }
      
      showToast(errorMessage);
    }
  };

  const handleHint = () => {
    if (!currentPuzzle) return;
    
    // Check if hint is already unlocked for this puzzle
    if (unlockedHints[currentPuzzle.id]) {
      // Hint already unlocked, just show the hint panel
      setShowHintPanel(true);
      showToast(`💡 Viewing unlocked hint for ${currentPuzzle.name}`);
      return;
    }
    
    // Check if user has enough hint points to unlock
    const hintCost = 1; // Cost 1 hint point to unlock a hint
    if (!userData || userData.hints < hintCost) {
      showAlert(`Not enough hint points! You need ${hintCost} hint point but only have ${userData?.hints || 0}. Complete tutorials or daily logins to earn more hints.`, {
        title: "💡 Insufficient Hint Points",
        type: "warning"
      });
      return;
    }
    
    // Deduct hint points and unlock the hint permanently for this puzzle
    updateUserData({
      hints: userData.hints - hintCost,
      totalPoints: userData.totalPoints // Don't change total points for buying hints
    });
    
    // Mark hint as unlocked for this puzzle
    setUnlockedHints(prev => ({
      ...prev,
      [currentPuzzle.id]: true
    }));
    
    setHintsUsed(prev => prev + 1);
    setShowHintPanel(true);
    
    showToast(`💡 Hint unlocked for ${currentPuzzle.name}! Click the hint guy anytime to view it.`);
  };

  // Get hint content for current puzzle
  const getCurrentHintContent = () => {
    if (!currentPuzzle) return null;
    
    const detailedHints = {
      laptop: {
        hint: "The blog draft is hidden! Look for the CSS 'display' property and change it from 'none' to 'block' to reveal the content.",
        explanation: "Web developers often hide elements using 'display: none'. Change it to 'display: block' to make it visible.",
        technical: "In CSS, 'display: none' completely removes an element from the page layout. To make it visible again, change it to 'display: block' or another appropriate display value."
      },
      phone: {
        hint: "The message is misaligned! The flex container needs 'flex-direction: column' and proper alignment with 'align-items: center' and 'justify-content: center'.",
        explanation: "Flexbox layout is broken. Fix the direction and alignment properties to center the content properly.",
        technical: "Flexbox properties: 'flex-direction' controls the main axis direction, 'align-items' aligns on the cross axis, and 'justify-content' aligns on the main axis."
      },
      notebook: {
        hint: "The secret plan is hidden outside the container! Change 'overflow: hidden' to 'overflow: visible' and reset the position values to 0px.",
        explanation: "Content is positioned outside the visible area. Fix the overflow and positioning to reveal the hidden text.",
        technical: "When 'overflow: hidden' is set, content outside the container boundaries is clipped. Change to 'overflow: visible' to show all content."
      },
      desktop: {
        hint: "The file grid has no height! Change 'grid-auto-rows: 0px' to 'grid-auto-rows: minmax(100px, auto)' to give the grid items proper height.",
        explanation: "CSS Grid items have zero height. Set a minimum height using minmax() to make them visible.",
        technical: "The 'grid-auto-rows' property with '0px' gives grid items no height. Use 'minmax(100px, auto)' to set a minimum height while allowing content to expand."
      }
    };
    
    return detailedHints[currentPuzzle.id as keyof typeof detailedHints];
  };

  // Handle exit case with confirmation
  const handleExitCase = async (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      const unlockedCount = Object.values(unlockedHints).filter(Boolean).length;
      const hintMessage = unlockedCount > 0 
        ? `You have ${unlockedCount} unlocked hint(s) that will be saved for when you return.`
        : 'Your progress will be saved.';
      
      const confirmed = await alertManager.show({
        message: `Are you sure you want to exit this case? ${hintMessage}`,
        title: '🚪 Exit Case?',
        confirmText: 'Yes, Exit Case',
        cancelText: 'Continue Playing',
        showCancel: true,
        type: 'warning'
      });
      
      if (confirmed) {
        onBack();
      }
    } catch (error) {
      console.error('Error in exit confirmation:', error);
      // Fallback to simple alert if custom modal fails
      const fallbackConfirmed = window.confirm('Exit case? Your progress will be saved.');
      if (fallbackConfirmed) {
        onBack();
      }
    }
  };

  const completeCase = () => {
    const finalScore = calculateFinalScore();
    
    // Clear unlocked hints from localStorage since case is completed
    if (userData?.uid) {
      localStorage.removeItem(`vanishingBloggerUnlockedHints_${userData.uid}`);
    }
    
    onComplete(finalScore);
  };

  // Calculate final score - hints no longer reduce score since they cost hint points
  const calculateFinalScore = () => {
    const basePoints = 1500; // Base points for completing the case
    const evidenceBonus = solvedPuzzles * 200; // 200 points per evidence found
    
    // No hint penalty since hints now cost hint points directly
    const finalScore = basePoints + evidenceBonus;
    return Math.round(finalScore);
  };

  // Calculate current score for real-time display
  const getCurrentScore = () => {
    const basePoints = 1500;
    const evidenceBonus = solvedPuzzles * 200;
    return basePoints + evidenceBonus;
  };

  // Render different scenes
  const renderIntroduction = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-8 shadow-2xl">
          <div className="flex items-center gap-6 mb-6">
            <img 
              src={policeGuyImg} 
              alt="Police Officer" 
              className="w-24 h-24 rounded-full border-4 border-amber-500/50 object-cover"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-amber-400 mb-4">First Real Case: Vanishing Blogger</h2>
              <div className="bg-slate-700/50 rounded-lg p-6">
                <p className="text-slate-200 text-lg leading-relaxed">
                  "Congratulations on completing the tutorial, Detective! This is <strong>Rishi Nair</strong>, a tech and health blogger, reported missing after posting about exposing Sherpa companies. We suspect foul play, but your tech team might find the truth. Go check his room and devices."
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleExitCase}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/20 border border-red-500 text-red-400 rounded-lg transition-all duration-200 hover:bg-red-600/30"
            >
              <ArrowLeft className="w-5 h-5" />
              Exit Case
            </button>
            
            <button
              onClick={() => setCurrentScene('building')}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg"
            >
              Start Investigation
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBuilding = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-amber-400 mb-6 text-center">Rishi's Apartment Building</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((floor) => (
              <div
                key={floor}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  floor === 3 
                    ? 'bg-amber-500/20 border-amber-500 hover:bg-amber-500/30 hover:scale-105' 
                    : 'bg-slate-700/30 border-slate-600 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => floor === 3 && setCurrentScene('room')}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">🏠</div>
                  <h3 className="text-xl font-bold text-slate-100">Floor {floor}</h3>
                  {floor === 3 && (
                    <p className="text-amber-400 font-semibold mt-2">Rishi's Apartment</p>
                  )}
                  {floor !== 3 && (
                    <p className="text-slate-500 mt-2">Not accessible</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          
          <div className="text-center mb-4">
            <p className="text-slate-300">Click on the 3rd floor to enter Rishi's apartment</p>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleExitCase}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/20 border border-red-500 text-red-400 rounded-lg transition-all duration-200 hover:bg-red-600/30"
            >
              <ArrowLeft className="w-5 h-5" />
              Exit Case
            </button>
            
            <button
              onClick={() => setCurrentScene('introduction')}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-all duration-200"
            >
              Back to Briefing
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoom = () => (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${rishiRoomImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80" />
      
      {/* Content - needs to be relative to appear above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-amber-500/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentScene('building')}
              className="p-2 text-amber-500 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-amber-500">First Real Case: Rishi's Room Investigation</h1>
              <p className="text-slate-300 text-sm">Click on objects to investigate and solve coding puzzles • Visual Investigation Mode</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Evidence: {solvedPuzzles}/{totalPuzzles}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300 border-l border-slate-600 pl-4">
              <Badge className="w-4 h-4 text-green-400" />
              <span>Current Score: {getCurrentScore().toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300 border-l border-slate-600 pl-4">
              <Search className="w-4 h-4 text-blue-400" />
              <span>Hints: {hintsUsed}</span>
            </div>
            
            {/* Audio Waveform */}
            <div className="border-l border-slate-600 pl-4">
              <AudioWaveform className="detective-audio-control" />
            </div>
            
            {/* Exit Case Button */}
            <button
              onClick={handleExitCase}
              className="flex items-center gap-2 px-3 py-2 bg-red-600/20 border border-red-500 text-red-400 rounded-lg text-xs font-medium transition-all duration-300 hover:bg-red-600/30 ml-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit Case</span>
            </button>
          </div>
        </div>
        
        {/* Progress */}
        <div className="mt-4">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Investigation Progress: {Math.round(progress)}%</p>
        </div>
      </div>

      {/* Room Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Subordinate Character */}
          <div className="flex items-center gap-4 mb-8 bg-slate-800/50 rounded-lg p-4">
            <img 
              src={subordinateImg} 
              alt="Detective Assistant" 
              className="w-16 h-16 rounded-full border-2 border-amber-500/50 object-cover"
            />
            <div className="flex-1 bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-200">
                "Click on the objects and solve the webpage glitches you find in his local files. Each fix will uncover a clue about Rishi's disappearance."
              </p>
            </div>
            
            {/* Hint Guy Helper */}
            <div className="flex flex-col items-center gap-2">
              <img 
                src={hintGuyImg} 
                alt="Hint Guy" 
                className="w-14 h-14 rounded-full border-2 border-amber-500/50 object-cover cursor-pointer hover:border-amber-400 transition-all duration-200 hover:scale-110"
                onClick={() => showCharacterDialogue('hint', 'Click on any object to investigate! I\'ll give you coding hints when you need them. Look for broken CSS properties!')}
                title="Click for general investigation tips!"
              />
              <span className="text-xs text-amber-400 font-semibold">Hint Guy</span>
            </div>
          </div>

          {/* Investigation Objects Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Laptop */}
            <div
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                puzzles[0].solved 
                  ? 'bg-green-500/20 border-green-500' 
                  : 'bg-slate-700/50 border-slate-600 hover:border-amber-500 hover:bg-amber-500/10'
              }`}
              onClick={() => handleItemClick('laptop')}
            >
              <div className="text-center">
                <div className="w-16 h-12 mx-auto mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={laptopCloseupImg} 
                    alt="Laptop closeup" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Laptop</h3>
                <p className="text-sm text-slate-400 mt-2">
                  {puzzles[0].solved ? '✅ Evidence Found' : 'Click to investigate'}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                puzzles[1].solved 
                  ? 'bg-green-500/20 border-green-500' 
                  : 'bg-slate-700/50 border-slate-600 hover:border-amber-500 hover:bg-amber-500/10'
              }`}
              onClick={() => handleItemClick('phone')}
            >
              <div className="text-center">
                <div className="w-10 h-12 mx-auto mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={phoneCloseupImg} 
                    alt="Phone closeup" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Phone</h3>
                <p className="text-sm text-slate-400 mt-2">
                  {puzzles[1].solved ? '✅ Evidence Found' : 'Click to investigate'}
                </p>
              </div>
            </div>

            {/* Notebook */}
            <div
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                puzzles[2].solved 
                  ? 'bg-green-500/20 border-green-500' 
                  : 'bg-slate-700/50 border-slate-600 hover:border-amber-500 hover:bg-amber-500/10'
              }`}
              onClick={() => handleItemClick('notebook')}
            >
              <div className="text-center">
                <img 
                  src={notebookImg} 
                  alt="Notebook" 
                  className="w-16 h-16 mx-auto mb-4 object-contain rounded-lg" 
                />
                <h3 className="text-lg font-bold text-slate-100">Notebook</h3>
                <p className="text-sm text-slate-400 mt-2">
                  {puzzles[2].solved ? '✅ Evidence Found' : 'Click to investigate'}
                </p>
              </div>
            </div>

            {/* Desktop */}
            <div
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                puzzles[3].solved 
                  ? 'bg-green-500/20 border-green-500' 
                  : 'bg-slate-700/50 border-slate-600 hover:border-amber-500 hover:bg-amber-500/10'
              }`}
              onClick={() => handleItemClick('desktop')}
            >
              <div className="text-center">
                <img 
                  src={desktopFileImg} 
                  alt="Desktop Files" 
                  className="w-16 h-16 mx-auto mb-4 object-contain rounded-lg" 
                />
                <h3 className="text-lg font-bold text-slate-100">Desktop Files</h3>
                <p className="text-sm text-slate-400 mt-2">
                  {puzzles[3].solved ? '✅ Evidence Found' : 'Click to investigate'}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence Summary */}
          {solvedPuzzles > 0 && (
            <div className="mt-8 bg-slate-800/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-amber-400 mb-4">Evidence Collected</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {puzzles
                  .filter(p => p.solved)
                  .map(puzzle => (
                    <div key={puzzle.id} className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="font-bold text-green-400">{puzzle.evidence.title}</h4>
                      <p className="text-slate-300 text-sm mt-1">{puzzle.evidence.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>
      </div>
      </div>
    </div>
  );

  const renderInvestigation = () => {
    if (!currentPuzzle) return null;

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="bg-slate-800/90 backdrop-blur-sm border-b border-amber-500/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setCurrentScene('room');
                  setActiveItem(null);
                  setCurrentPuzzle(null);
                }}
                className="p-2 text-amber-500 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-amber-500">{currentPuzzle.name}</h1>
                <p className="text-slate-300 text-sm">{currentPuzzle.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/30 px-3 py-1 rounded-lg">
                <Badge className="w-4 h-4 text-green-400" />
                <span>{getCurrentScore().toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/30 px-3 py-1 rounded-lg">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>{userData?.hints || 0}</span>
              </div>
              
              {/* Unified Interactive Hint Guy Button */}
              <button 
                onClick={handleHint}
                disabled={!userData || (userData.hints < 1 && !unlockedHints[currentPuzzle?.id])}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  unlockedHints[currentPuzzle?.id] 
                    ? 'bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30' 
                    : userData && userData.hints >= 1 
                      ? 'bg-amber-400/20 border border-amber-400 text-amber-400 hover:bg-amber-400/30' 
                      : 'bg-gray-500/20 border border-gray-500 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="relative">
                  <img 
                    src={hintGuyImg} 
                    alt="Detective Helper" 
                    className="w-8 h-8 rounded-full border border-white/20 object-cover"
                  />
                  {unlockedHints[currentPuzzle?.id] && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-xs text-slate-900">✓</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {unlockedHints[currentPuzzle?.id] ? 'Hint Ready!' : 'Need Help?'}
                  </div>
                  <div className="text-xs opacity-80">
                    {unlockedHints[currentPuzzle?.id] ? 'Click to view' : 'Click for hint'}
                  </div>
                </div>
              </button>

              {/* Exit Case Button */}
              <button
                onClick={handleExitCase}
                className="flex items-center gap-2 px-3 py-2 bg-red-600/20 border border-red-500 text-red-400 rounded-lg text-xs font-medium transition-all duration-300 hover:bg-red-600/30"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit Case</span>
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-amber-400">Fix the Code to Reveal Evidence</h3>
                
                {/* Unified Interactive Hint Guy Button in Investigation */}
                <button 
                  onClick={handleHint}
                  disabled={!userData || (userData.hints < 1 && !unlockedHints[currentPuzzle?.id])}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    unlockedHints[currentPuzzle?.id] 
                      ? 'bg-green-400/20 border border-green-400 text-green-400 hover:bg-green-400/30' 
                      : userData && userData.hints >= 1 
                        ? 'bg-amber-400/20 border border-amber-400 text-amber-400 hover:bg-amber-400/30' 
                        : 'bg-gray-500/20 border border-gray-500 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={hintGuyImg} 
                      alt="Detective Helper" 
                      className="w-12 h-12 rounded-full border border-white/20 object-cover"
                    />
                    {unlockedHints[currentPuzzle?.id] && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                        <span className="text-xs text-slate-900">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-medium">
                      {unlockedHints[currentPuzzle?.id] ? 'Hint Ready!' : 'Need Help?'}
                    </div>
                    <div className="text-xs opacity-80">
                      {unlockedHints[currentPuzzle?.id] ? 'Click to view' : 'Click for hint'}
                    </div>
                  </div>
                </button>
              </div>

              {/* Problem Statement */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-red-400 font-bold mb-2">🔍 What's Wrong?</h4>
                <p className="text-slate-200">{currentPuzzle.problemStatement}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    🛠️ Broken Code (Fix this to reveal evidence):
                  </label>
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    className="w-full h-64 p-4 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 font-mono text-sm resize-none focus:border-amber-500 focus:outline-none"
                    placeholder="Edit the code to fix the issue..."
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleCodeSubmit}
                    className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    🔍 Submit Fix
                  </button>
                  
                  <button
                    onClick={() => setCodeInput(currentPuzzle.brokenCode)}
                    className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg font-medium transition-all duration-200"
                  >
                    ↺ Reset Code
                  </button>
                </div>
              </div>
            </div>

            {/* Code Preview */}
            <div className="mt-6 bg-slate-800/50 rounded-lg border border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-4">📱 Live Preview - See Your Changes</h3>
              <div className="bg-white rounded-lg p-4 min-h-32">
                <div dangerouslySetInnerHTML={{ __html: `<style>${codeInput}</style>` }} />
                <div className="text-slate-800">
                  {currentPuzzle.id === 'laptop' && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-600 mb-2">Rishi's Blog Draft:</h4>
                      {(() => {
                        const normalizedCode = codeInput.replace(/\s+/g, ' ').trim();
                        const hasDisplayBlock = normalizedCode.includes('display:block') || normalizedCode.includes('display: block');
                        const hasDisplayNone = normalizedCode.includes('display:none') || normalizedCode.includes('display: none');
                        const isVisible = hasDisplayBlock && !hasDisplayNone;
                        
                        return (
                          <>
                            <div className="blog-draft" style={isVisible ? {display: 'block'} : {display: 'none'}}>
                              <h2 style={{color: '#333', fontSize: '18px', marginBottom: '10px'}}>The Truth About Sherpa Companies</h2>
                              <p style={{color: '#666', fontSize: '14px'}}>I've discovered some shady practices that I need to expose...</p>
                              {isVisible && (
                                <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: '4px'}}>
                                  ✅ Evidence revealed! Blog draft is now visible.
                                </div>
                              )}
                            </div>
                            {!isVisible && (
                              <div style={{padding: '20px', backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px', textAlign: 'center'}}>
                                ❌ Content is hidden! Change "display: none" to "display: block" to reveal the blog draft.
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                  {currentPuzzle.id === 'phone' && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-600 mb-2">Phone Message:</h4>
                      <div className="message-container" style={{
                        display: 'flex',
                        flexDirection: codeInput.includes('flex-direction: column') ? 'column' : 'row',
                        alignItems: codeInput.includes('align-items: center') ? 'center' : 'flex-start',
                        justifyContent: codeInput.includes('justify-content: center') ? 'center' : 'flex-start',
                        padding: '20px',
                        backgroundColor: '#f0f0f0',
                        minHeight: '80px',
                        border: '1px solid #ddd',
                        borderRadius: '8px'
                      }}>
                        <div style={{padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #2196f3'}}>
                          💬 "I'll be famous by tomorrow."
                        </div>
                      </div>
                      {/* More precise validation for success message */}
                      {codeInput.includes('flex-direction: column') && 
                       codeInput.includes('align-items: center') && 
                       codeInput.includes('justify-content: center') ? (
                        <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: '4px'}}>
                          ✅ Evidence revealed! Message is properly centered and readable.
                        </div>
                      ) : (
                        <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px'}}>
                          ❌ Message is misaligned! You need ALL three: flex-direction: column, align-items: center, AND justify-content: center
                        </div>
                      )}
                    </div>
                  )}
                  {currentPuzzle.id === 'notebook' && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-600 mb-2">Notebook Page:</h4>
                      <div className="notebook-page" style={{
                        width: '300px',
                        height: '200px',
                        border: '2px solid #8B4513',
                        borderRadius: '4px',
                        overflow: codeInput.includes('visible') ? 'visible' : 'hidden',
                        backgroundColor: '#fffef7',
                        position: 'relative'
                      }}>
                        <div className="hidden-plan" style={{
                          width: codeInput.includes('300px') ? '300px' : '500px',
                          height: codeInput.includes('200px') ? '200px' : '400px',
                          position: 'relative',
                          top: codeInput.includes('0px') ? '0px' : '-200px',
                          left: codeInput.includes('0px') ? '0px' : '-100px',
                          backgroundColor: '#fff3e0',
                          padding: '10px',
                          border: '1px dashed #ff9800',
                          borderRadius: '4px'
                        }}>
                          📝 <strong>SECRET PLAN:</strong><br/>
                          1. Fake disappearance<br/>
                          2. Post "evidence" on Reddit<br/>
                          3. Become famous blogger<br/>
                          4. Profit from controversy
                        </div>
                      </div>
                      {(() => {
                        const normalizedCode = codeInput.replace(/\s+/g, ' ').trim();
                        const hasVisibleOverflow = normalizedCode.includes('overflow:visible') || normalizedCode.includes('overflow: visible');
                        const hasCorrectTop = normalizedCode.includes('top:0px') || normalizedCode.includes('top: 0px') || normalizedCode.includes('top:0') || normalizedCode.includes('top: 0');
                        const hasCorrectLeft = normalizedCode.includes('left:0px') || normalizedCode.includes('left: 0px') || normalizedCode.includes('left:0') || normalizedCode.includes('left: 0');
                        const isCorrect = hasVisibleOverflow && hasCorrectTop && hasCorrectLeft;
                        
                        return isCorrect ? (
                          <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: '4px'}}>
                            ✅ Evidence revealed! Secret disappearance plan is now visible.
                          </div>
                        ) : (
                          <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px'}}>
                            ❌ Secret plan is hidden! Change overflow to "visible" and set top and left to "0px".
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {currentPuzzle.id === 'desktop' && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-600 mb-2">Desktop Files:</h4>
                      <div className="file-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '10px',
                        gridAutoRows: (() => {
                          const normalizedCode = codeInput.replace(/\s+/g, ' ').trim();
                          const hasMinmax = normalizedCode.includes('minmax(100px,auto)') || 
                                           normalizedCode.includes('minmax(100px, auto)') ||
                                           normalizedCode.includes('minmax( 100px , auto )') ||
                                           normalizedCode.includes('minmax( 100px, auto)') ||
                                           normalizedCode.includes('minmax(100px ,auto)');
                          return hasMinmax ? 'minmax(100px, auto)' : '0px';
                        })(),
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '8px'
                      }}>
                        <div style={{backgroundColor: '#ffecb3', padding: '10px', borderRadius: '4px', border: '1px solid #ffc107'}}>📄 Fake_Reddit_1.png</div>
                        <div style={{backgroundColor: '#ffecb3', padding: '10px', borderRadius: '4px', border: '1px solid #ffc107'}}>📄 Fake_Reddit_2.png</div>
                        <div style={{backgroundColor: '#ffecb3', padding: '10px', borderRadius: '4px', border: '1px solid #ffc107'}}>📄 Hoax_Plan.txt</div>
                      </div>
                      {(() => {
                        const normalizedCode = codeInput.replace(/\s+/g, ' ').trim();
                        const hasMinmax = normalizedCode.includes('minmax(100px,auto)') || 
                                         normalizedCode.includes('minmax(100px, auto)') ||
                                         normalizedCode.includes('minmax( 100px , auto )') ||
                                         normalizedCode.includes('minmax( 100px, auto)') ||
                                         normalizedCode.includes('minmax(100px ,auto)');
                        
                        return hasMinmax ? (
                          <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: '4px'}}>
                            ✅ Evidence revealed! Fake Reddit screenshots and hoax plan discovered.
                          </div>
                        ) : (
                          <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px'}}>
                            ❌ Files are invisible! Change "0px" to "minmax(100px, auto)" in grid-auto-rows.
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Persistent Hint Panel */}
            {showHintPanel && unlockedHints[currentPuzzle?.id] && (
              <div className="mt-6 bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-orange-500/10 rounded-lg border border-amber-500/30 p-6 relative">
                <button
                  onClick={() => setShowHintPanel(false)}
                  className="absolute top-3 right-3 text-amber-400 hover:text-amber-300 text-xl font-bold"
                >
                  ×
                </button>
                
                <div className="flex items-start gap-4">
                  <img 
                    src={hintGuyImg} 
                    alt="Detective Helper" 
                    className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                      💡 Detective's Hint <span className="text-sm font-normal text-green-400">(Unlocked)</span>
                    </h3>
                    {(() => {
                      const hintContent = getCurrentHintContent();
                      return hintContent ? (
                        <div className="space-y-3">
                          <div className="bg-slate-800/50 rounded-lg p-4 border border-amber-500/20">
                            <h4 className="text-amber-300 font-semibold mb-2">🔍 Quick Hint:</h4>
                            <p className="text-slate-200">{hintContent.hint}</p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-4 border border-amber-500/20">
                            <h4 className="text-amber-300 font-semibold mb-2">📖 Explanation:</h4>
                            <p className="text-slate-200">{hintContent.explanation}</p>
                          </div>
                          <div className="bg-slate-800/50 rounded-lg p-4 border border-amber-500/20">
                            <h4 className="text-amber-300 font-semibold mb-2">🎓 Technical Details:</h4>
                            <p className="text-slate-200">{hintContent.technical}</p>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderConfrontation = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-4xl font-bold text-amber-400 mb-3">The Vanishing Blogger: Rishi Nair Investigation Complete!</h2>
          <p className="text-slate-300 text-lg">🎉 Outstanding detective work! You've successfully completed your first real visual investigation case.</p>
        </div>

        {/* Main Content Grid - Full Width */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column - Case Resolution */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Characters and Confession */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-6 mb-6">
                <img 
                  src={policeGuyImg} 
                  alt="Police Officer" 
                  className="w-20 h-20 rounded-full border-3 border-amber-500/50 object-cover"
                />
                <div className="flex-1">
                  <p className="text-slate-200 text-lg leading-relaxed">
                    "We caught him livestreaming his 'grand comeback' at a café nearby. Here's his confession - he admits to faking it all for fame."
                  </p>
                </div>
                <img 
                  src={rishiEmbarrassedImg} 
                  alt="Rishi" 
                  className="w-20 h-20 rounded-full border-3 border-red-500/50 object-cover"
                />
              </div>
              
              {/* Confession Note */}
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <h4 className="text-red-400 font-bold text-lg mb-3">📋 Confession Note</h4>
                    <p className="text-slate-200 text-lg italic leading-relaxed">
                      "I faked my disappearance to defame Sherpa companies for fame. I wanted to become famous by exposing them, even if it meant lying."
                    </p>
                    <p className="text-slate-400 text-sm mt-3">- Rishi Nair</p>
                  </div>
                  <div className="w-24 h-18 rounded-lg border border-red-500/30 overflow-hidden">
                    <img src={confessionNoteImg} alt="Note" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Case Conclusion */}
            <div className="bg-amber-500/20 border border-amber-500/50 rounded-xl p-6">
              <h4 className="text-amber-400 font-bold text-lg mb-4 flex items-center gap-2">
                🔍 Case Conclusion
              </h4>
              <div className="grid grid-cols-2 gap-4 text-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Fake disappearance exposed</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Digital forensics successful</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Sherpa companies cleared</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Evidence: {solvedPuzzles}/{totalPuzzles} pieces collected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Learning & Stats */}
          <div className="space-y-6">
            
            {/* Investigation Stats */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
              <h4 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Investigation Report
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Evidence collected:</span>
                  <span className="text-green-400 font-bold text-lg">4/4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Hints used:</span>
                  <span className="text-blue-400 font-bold text-lg">{hintsUsed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Case status:</span>
                  <span className="text-green-400 font-bold text-lg">✅ SOLVED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Investigation type:</span>
                  <span className="text-amber-400 font-bold">Visual Investigation</span>
                </div>
                <div className="bg-green-500/20 rounded-lg px-4 py-3 mt-4">
                  <span className="text-green-300 font-medium">🎯 Visual investigation experience gained!</span>
                </div>
              </div>
            </div>

            {/* What You Learned */}
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-blue-400 font-bold text-lg mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                What You Learned
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-slate-300">CSS display properties (block/none)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-slate-300">Flexbox alignment techniques</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-slate-300">CSS overflow and positioning</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-slate-300">HTML structure debugging</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-slate-300">Visual investigation skills</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-lg">✓</span>
                  <span className="text-slate-300">Real-world problem solving</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Actions - Full Width */}
        <div className="text-center pb-8 space-y-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleExitCase}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/20 border border-red-500 text-red-400 rounded-lg transition-all duration-200 hover:bg-red-600/30"
            >
              <ArrowLeft className="w-5 h-5" />
              Exit Without Claiming Rewards
            </button>
            
            <button
              onClick={completeCase}
              className="px-12 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-lg rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center gap-3 hover:scale-105"
            >
              <Trophy className="w-5 h-5" />
              Complete Investigation & Claim Rewards
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render based on current scene
  const renderCurrentScene = () => {
    switch (currentScene) {
      case 'introduction':
        return renderIntroduction();
      case 'building':
        return renderBuilding();
      case 'room':
        return renderRoom();
      case 'investigation':
        return renderInvestigation();
      case 'confrontation':
        return renderConfrontation();
      default:
        return renderIntroduction();
    }
  };

  return (
    <>
      <div className="relative">
        {renderCurrentScene()}

      {/* Character Dialogue Overlay */}
      {showDialogue && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 max-w-md w-full mx-4 z-50">
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-lg border border-amber-500/50 p-4 shadow-2xl">
            <p className="text-slate-200">{currentDialogue}</p>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
    </>
  );
};
