import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Eye,
  Edit3,
  Play,
  Image,
  Code,
  Lightbulb,
  MessageSquare,
  Target,
  FileText,
  Search,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logger, LogCategory } from '../../utils/logger';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'code-fix' | 'investigation' | 'analysis' | 'evidence' | 'story';
  order: number;
  content: {
    // For code-fix missions (convert from existing format)
    initialCode?: string;
    targetCode?: string;
    brokenHtml?: string;
    brokenCss?: string;
    targetHtml?: string;
    targetCss?: string;
    successConditions?: string[];
    clueRevealed?: string;
    clueUnlockCondition?: string;
    
    // For other mission types
    clues?: string[];
    evidence?: string[];
    storyText?: string;
    choices?: { text: string; correct: boolean; explanation: string; }[];
    hints?: string[];
    aiHints?: string[];
    points?: number;
    objective?: string;
  };
  isCompleted?: boolean;
}

interface CinematicSlide {
  id: string;
  type: 'story' | 'character' | 'location' | 'evidence' | 'choice';
  order: number;
  content: {
    title?: string;
    text: string;
    dialogue?: string;
    speaker?: string;
    background?: string;
    characterImage?: string;
    soundEffect?: string;
    image?: string;
    character?: string;
    location?: string;
    backgroundImage?: string;
    choices?: { text: string; nextSlide?: string; }[];
    autoAdvance?: boolean;
    duration?: number;
  };
}

interface DetectiveCase {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  cluePoints: number;
  isDetectiveMission: boolean;
  
  // Story Structure
  story: string;
  objective: string;
  
  // Cinematic Introduction
  cinematicSlides: CinematicSlide[];
  
  // Missions/Challenges
  missions: Mission[];
  
  // Final Resolution
  finalResolution: string;
  
  // Basic coding challenges (for non-detective cases)
  initialHtml?: string;
  initialCss?: string;
  targetHtml?: string;
  targetCss?: string;
  hints?: string[];
}

interface AdvancedCaseEditorProps {
  case?: DetectiveCase | null;
  onSave: (caseData: DetectiveCase) => void;
  onCancel: () => void;
}

const AdvancedCaseEditor: React.FC<AdvancedCaseEditorProps> = ({ case: editCase, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'story' | 'missions' | 'cinematics' | 'preview'>('basic');
  
  // Helper function to convert existing case format to new format
  const convertExistingCase = (existingCase: any): DetectiveCase => {
    const convertedCinematicSlides: CinematicSlide[] = (existingCase?.cinematicSlides || []).map((slide: any, index: number) => ({
      id: slide.id || `slide-${Date.now()}-${index}`,
      type: 'character' as const,
      order: index + 1,
      content: {
        text: slide.dialogue || slide.text || '',
        title: slide.title || '',
        speaker: slide.speaker || slide.character || '',
        background: slide.background || '',
        characterImage: slide.characterImage || '',
        soundEffect: slide.soundEffect || '',
        backgroundImage: slide.background || '',
        dialogue: slide.dialogue || '',
        character: slide.speaker || '',
        autoAdvance: false,
        duration: 5000
      }
    }));

    const convertedMissions: Mission[] = (existingCase?.missions || []).map((mission: any, index: number) => ({
      id: mission.id || `mission-${Date.now()}-${index}`,
      title: mission.title || '',
      description: mission.description || '',
      type: 'code-fix' as const,
      order: index + 1,
      content: {
        brokenHtml: mission.brokenHtml || '',
        brokenCss: mission.brokenCss || '',
        targetHtml: mission.targetHtml || '',
        targetCss: mission.targetCss || '',
        successConditions: mission.successConditions || [],
        clueRevealed: mission.clueRevealed || '',
        clueUnlockCondition: mission.clueUnlockCondition || '',
        aiHints: mission.aiHints || [],
        hints: mission.aiHints || [''],
        points: 250,
        objective: mission.objective || '',
        initialCode: mission.brokenHtml || '',
        targetCode: mission.targetHtml || ''
      }
    }));

    return {
      id: existingCase?.id || `case-${Date.now()}`,
      title: existingCase?.title || '',
      description: existingCase?.description || '',
      difficulty: existingCase?.difficulty || 'Beginner',
      duration: existingCase?.duration || '15-20 minutes',
      cluePoints: existingCase?.cluePoints || 1000,
      isDetectiveMission: existingCase?.isDetectiveMission || false,
      story: existingCase?.story || '',
      objective: existingCase?.objective || '',
      cinematicSlides: convertedCinematicSlides,
      missions: convertedMissions,
      finalResolution: existingCase?.finalResolution || '',
      initialHtml: existingCase?.initialHtml || '',
      initialCss: existingCase?.initialCss || '',
      targetHtml: existingCase?.targetHtml || '',
      targetCss: existingCase?.targetCss || '',
      hints: existingCase?.hints || ['']
    };
  };

  const [caseData, setCaseData] = useState<DetectiveCase>(() => {
    if (editCase) {
      logger.info('🔍 DEBUGGING: Converting existing case:', editCase, LogCategory.CMS);
      logger.info('🎬 Original cinematic slides:', editCase.cinematicSlides, LogCategory.CMS);
      logger.info('🎯 Original missions:', editCase.missions, LogCategory.CMS);
      logger.info('🔢 Cinematic slides length:', editCase.cinematicSlides?.length, LogCategory.CMS);
      logger.info('🔢 Missions length:', editCase.missions?.length, LogCategory.CMS);
      logger.info('🎭 Is detective mission:', editCase.isDetectiveMission, LogCategory.CMS);
      
      if (editCase.cinematicSlides && editCase.cinematicSlides.length > 0) {
        logger.info('📝 First cinematic slide:', editCase.cinematicSlides[0], LogCategory.CMS);
      }
      if (editCase.missions && editCase.missions.length > 0) {
        logger.info('🎯 First mission:', editCase.missions[0], LogCategory.CMS);
      }
      
      const converted = convertExistingCase(editCase);
      logger.info('✅ Converted case:', converted, LogCategory.CMS);
      logger.info('🎬 Converted cinematic slides:', converted.cinematicSlides, LogCategory.CMS);
      logger.info('🎯 Converted missions:', converted.missions, LogCategory.CMS);
      return converted;
    }
    return {
      id: `case-${Date.now()}`,
      title: '',
      description: '',
      difficulty: 'Beginner',
      duration: '15-20 minutes',
      cluePoints: 1000,
      isDetectiveMission: false,
      story: '',
      objective: '',
      cinematicSlides: [],
      missions: [],
      finalResolution: '',
      initialHtml: '',
      initialCss: '',
      targetHtml: '',
      targetCss: '',
      hints: ['']
    };
  });

  // Add new cinematic slide
  const addCinematicSlide = () => {
    const newSlide: CinematicSlide = {
      id: `slide-${Date.now()}`,
      type: 'story',
      order: caseData.cinematicSlides.length + 1,
      content: {
        text: '',
        autoAdvance: false,
        duration: 5000
      }
    };
    setCaseData({
      ...caseData,
      cinematicSlides: [...caseData.cinematicSlides, newSlide]
    });
  };

  // Update cinematic slide
  const updateCinematicSlide = (slideId: string, updates: Partial<CinematicSlide>) => {
    setCaseData({
      ...caseData,
      cinematicSlides: caseData.cinematicSlides.map(slide => 
        slide.id === slideId ? { ...slide, ...updates } : slide
      )
    });
  };

  // Delete cinematic slide
  const deleteCinematicSlide = (slideId: string) => {
    setCaseData({
      ...caseData,
      cinematicSlides: caseData.cinematicSlides.filter(slide => slide.id !== slideId)
    });
  };

  // Add new mission
  const addMission = () => {
    const newMission: Mission = {
      id: `mission-${Date.now()}`,
      title: '',
      description: '',
      type: 'code-fix',
      order: caseData.missions.length + 1,
      content: {
        points: 250,
        hints: ['']
      }
    };
    setCaseData({
      ...caseData,
      missions: [...caseData.missions, newMission]
    });
  };

  // Update mission
  const updateMission = (missionId: string, updates: Partial<Mission>) => {
    setCaseData({
      ...caseData,
      missions: caseData.missions.map(mission => 
        mission.id === missionId ? { ...mission, ...updates } : mission
      )
    });
  };

  // Delete mission
  const deleteMission = (missionId: string) => {
    setCaseData({
      ...caseData,
      missions: caseData.missions.filter(mission => mission.id !== missionId)
    });
  };

  // Move mission order
  const moveMission = (missionId: string, direction: 'up' | 'down') => {
    const missions = [...caseData.missions];
    const index = missions.findIndex(m => m.id === missionId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      [missions[index], missions[index - 1]] = [missions[index - 1], missions[index]];
    } else if (direction === 'down' && index < missions.length - 1) {
      [missions[index], missions[index + 1]] = [missions[index + 1], missions[index]];
    }

    // Update order numbers
    missions.forEach((mission, idx) => {
      mission.order = idx + 1;
    });

    setCaseData({ ...caseData, missions });
  };

  const handleSave = () => {
    if (!caseData.title.trim()) {
      toast.error('Please enter a case title');
      return;
    }

    if (!caseData.description.trim()) {
      toast.error('Please enter a case description');
      return;
    }

    if (caseData.isDetectiveMission && caseData.missions.length === 0) {
      toast.error('Detective cases need at least one mission');
      return;
    }

    // Convert back to original format for compatibility
    const convertedCase = {
      ...caseData,
      cinematicSlides: caseData.cinematicSlides.map(slide => ({
        id: slide.id,
        title: slide.content.title || '',
        dialogue: slide.content.text || slide.content.dialogue || '',
        speaker: slide.content.speaker || slide.content.character || '',
        background: slide.content.background || slide.content.backgroundImage || '',
        characterImage: slide.content.characterImage || slide.content.image || '',
        soundEffect: slide.content.soundEffect || ''
      })),
      missions: caseData.missions.map(mission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        objective: mission.content.objective || '',
        brokenHtml: mission.content.brokenHtml || mission.content.initialCode || '',
        brokenCss: mission.content.brokenCss || '',
        targetHtml: mission.content.targetHtml || mission.content.targetCode || '',
        targetCss: mission.content.targetCss || '',
        successConditions: mission.content.successConditions || [],
        clueRevealed: mission.content.clueRevealed || '',
        clueUnlockCondition: mission.content.clueUnlockCondition || '',
        aiHints: mission.content.aiHints || mission.content.hints || ['']
      }))
    };

    onSave(convertedCase as any);
    toast.success('Case saved successfully!');
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'story', label: 'Story & Objective', icon: MessageSquare },
    { id: 'cinematics', label: 'Intro Cinematics', icon: Play },
    { id: 'missions', label: 'Missions', icon: Target },
    { id: 'preview', label: 'Preview', icon: Eye }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {editCase ? 'Edit Case' : 'Create New Case'}
          </h2>
          <p className="text-white/60">
            {caseData.isDetectiveMission ? 'Detective Mission with Story & Missions' : 'Standard Coding Challenge'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-white/70 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Case</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/20">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'basic' && (
          <BasicInfoTab caseData={caseData} setCaseData={setCaseData} />
        )}

        {activeTab === 'story' && (
          <StoryTab caseData={caseData} setCaseData={setCaseData} />
        )}

        {activeTab === 'cinematics' && (
          <CinematicsTab 
            slides={caseData.cinematicSlides}
            onAddSlide={addCinematicSlide}
            onUpdateSlide={updateCinematicSlide}
            onDeleteSlide={deleteCinematicSlide}
          />
        )}

        {activeTab === 'missions' && (
          <MissionsTab 
            missions={caseData.missions}
            onAddMission={addMission}
            onUpdateMission={updateMission}
            onDeleteMission={deleteMission}
            onMoveMission={moveMission}
          />
        )}

        {activeTab === 'preview' && (
          <PreviewTab caseData={caseData} />
        )}
      </div>
    </div>
  );
};

// Basic Info Tab Component
const BasicInfoTab: React.FC<{
  caseData: DetectiveCase;
  setCaseData: (data: DetectiveCase) => void;
}> = ({ caseData, setCaseData }) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Case Title *</label>
          <input
            type="text"
            value={caseData.title}
            onChange={(e) => setCaseData({ ...caseData, title: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            placeholder="The Vanishing Blogger Mystery"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Difficulty</label>
          <select
            value={caseData.difficulty}
            onChange={(e) => setCaseData({ ...caseData, difficulty: e.target.value as any })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white'
            }}
          >
            <option value="Beginner" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Beginner</option>
            <option value="Intermediate" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Intermediate</option>
            <option value="Advanced" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Advanced</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Description *</label>
        <textarea
          value={caseData.description}
          onChange={(e) => setCaseData({ ...caseData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          placeholder="A mysterious blogger has disappeared, leaving behind only their unfinished website..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Duration</label>
          <input
            type="text"
            value={caseData.duration}
            onChange={(e) => setCaseData({ ...caseData, duration: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            placeholder="30-45 minutes"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Clue Points</label>
          <input
            type="number"
            value={caseData.cluePoints}
            onChange={(e) => setCaseData({ ...caseData, cluePoints: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            placeholder="1000"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🕵️</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Detective Mission Mode</h4>
              <p className="text-white/60 text-sm">Create immersive story-driven cases</p>
            </div>
          </div>
          
          {/* Custom Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={caseData.isDetectiveMission}
              onChange={(e) => setCaseData({ ...caseData, isDetectiveMission: e.target.checked })}
              className="sr-only peer"
            />
            <div className="relative w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-blue-600 shadow-lg"></div>
            <span className="ml-3 text-sm font-medium text-white">
              {caseData.isDetectiveMission ? 'ON' : 'OFF'}
            </span>
          </label>
        </div>
        
        <div className={`transition-all duration-300 ${caseData.isDetectiveMission ? 'opacity-100' : 'opacity-60'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-400">🎬</span>
                <span className="text-white font-medium text-sm">Cinematics</span>
              </div>
              <p className="text-white/60 text-xs">Story intro with character dialogue</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-400">💻</span>
                <span className="text-white font-medium text-sm">Code Missions</span>
              </div>
              <p className="text-white/60 text-xs">Multiple HTML/CSS challenges</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-yellow-400">🎯</span>
                <span className="text-white font-medium text-sm">Story Arc</span>
              </div>
              <p className="text-white/60 text-xs">Progressive clue revelation</p>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            caseData.isDetectiveMission 
              ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-400/50' 
              : 'bg-gray-800/20 border-gray-600/30'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-lg ${caseData.isDetectiveMission ? 'animate-pulse' : ''}`}>
                {caseData.isDetectiveMission ? '✨' : '⭐'}
              </span>
              <span className="text-white font-medium">
                {caseData.isDetectiveMission ? 'Detective Mission Active' : 'Standard Case Mode'}
              </span>
            </div>
            <p className="text-white/70 text-sm">
              {caseData.isDetectiveMission 
                ? 'Create cases like "TUTORIAL CASE" and "Rishi Nair Investigation" with full story experience, cinematics, and multiple coding missions.'
                : 'Simple single-challenge format perfect for focused HTML/CSS practice without story elements.'
              }
            </p>
          </div>
        </div>
      </div>

      {!caseData.isDetectiveMission && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-3">Simple Coding Challenge</h4>
          <p className="text-white/60 text-sm mb-4">
            For basic HTML/CSS coding challenges without story elements.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Initial HTML</label>
              <textarea
                value={caseData.initialHtml}
                onChange={(e) => setCaseData({ ...caseData, initialHtml: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-purple-400"
                placeholder="<div>Initial HTML code...</div>"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Target HTML</label>
              <textarea
                value={caseData.targetHtml}
                onChange={(e) => setCaseData({ ...caseData, targetHtml: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-purple-400"
                placeholder="<div>Target HTML code...</div>"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Story Tab Component
const StoryTab: React.FC<{
  caseData: DetectiveCase;
  setCaseData: (data: DetectiveCase) => void;
}> = ({ caseData, setCaseData }) => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Main Story</label>
        <textarea
          value={caseData.story}
          onChange={(e) => setCaseData({ ...caseData, story: e.target.value })}
          rows={8}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          placeholder="Tell the complete story of this case. This will be used throughout the investigation..."
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Case Objective</label>
        <textarea
          value={caseData.objective}
          onChange={(e) => setCaseData({ ...caseData, objective: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          placeholder="What should the player accomplish? What's the goal of this investigation?"
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Final Resolution</label>
        <textarea
          value={caseData.finalResolution}
          onChange={(e) => setCaseData({ ...caseData, finalResolution: e.target.value })}
          rows={6}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          placeholder="The final reveal and resolution of the case. This will be shown after all missions are completed..."
        />
      </div>
    </div>
  );
};

// Cinematics Tab Component
const CinematicsTab: React.FC<{
  slides: CinematicSlide[];
  onAddSlide: () => void;
  onUpdateSlide: (id: string, updates: Partial<CinematicSlide>) => void;
  onDeleteSlide: (id: string) => void;
}> = ({ slides, onAddSlide, onUpdateSlide, onDeleteSlide }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Cinematic Introduction</h3>
          <p className="text-white/60">Create story slides that introduce the case</p>
        </div>
        <button
          onClick={onAddSlide}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Slide</span>
        </button>
      </div>

      {slides.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
          <Play className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h4 className="text-white/60 text-lg mb-2">No cinematic slides yet</h4>
          <p className="text-white/40 mb-4">Add slides to create an engaging story introduction</p>
          <button
            onClick={onAddSlide}
            className="flex items-center space-x-2 px-6 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create First Slide</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 rounded-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <select
                    value={slide.type}
                    onChange={(e) => onUpdateSlide(slide.id, { type: e.target.value as any })}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                  >
                    <option value="story" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Story</option>
                    <option value="character" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Character</option>
                    <option value="location" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Location</option>
                    <option value="evidence" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Evidence</option>
                    <option value="choice" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Choice</option>
                  </select>
                </div>
                <button
                  onClick={() => onDeleteSlide(slide.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Slide Text *</label>
                  <textarea
                    value={slide.content.text}
                    onChange={(e) => onUpdateSlide(slide.id, {
                      content: { ...slide.content, text: e.target.value }
                    })}
                    rows={4}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                    placeholder="Enter the text for this slide..."
                  />
                </div>

                <div className="space-y-4">
                  {slide.type === 'character' && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Character Name</label>
                      <input
                        type="text"
                        value={slide.content.character || ''}
                        onChange={(e) => onUpdateSlide(slide.id, {
                          content: { ...slide.content, character: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                        placeholder="Detective Smith"
                      />
                    </div>
                  )}

                  {slide.type === 'location' && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        value={slide.content.location || ''}
                        onChange={(e) => onUpdateSlide(slide.id, {
                          content: { ...slide.content, location: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                        placeholder="Blogger's Apartment"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Background Image URL</label>
                    <input
                      type="text"
                      value={slide.content.backgroundImage || ''}
                      onChange={(e) => onUpdateSlide(slide.id, {
                        content: { ...slide.content, backgroundImage: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                      placeholder="/assets/detective-office.jpg"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={slide.content.autoAdvance || false}
                        onChange={(e) => onUpdateSlide(slide.id, {
                          content: { ...slide.content, autoAdvance: e.target.checked }
                        })}
                        className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded"
                      />
                      <span className="text-white/80 text-sm">Auto advance</span>
                    </label>

                    {slide.content.autoAdvance && (
                      <div>
                        <input
                          type="number"
                          value={slide.content.duration || 5000}
                          onChange={(e) => onUpdateSlide(slide.id, {
                            content: { ...slide.content, duration: parseInt(e.target.value) || 5000 }
                          })}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                          placeholder="5000"
                        />
                        <span className="text-white/60 text-xs ml-1">ms</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Missions Tab Component
const MissionsTab: React.FC<{
  missions: Mission[];
  onAddMission: () => void;
  onUpdateMission: (id: string, updates: Partial<Mission>) => void;
  onDeleteMission: (id: string) => void;
  onMoveMission: (id: string, direction: 'up' | 'down') => void;
}> = ({ missions, onAddMission, onUpdateMission, onDeleteMission, onMoveMission }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Case Missions</h3>
          <p className="text-white/60">Create the challenges players will solve</p>
        </div>
        <button
          onClick={onAddMission}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Mission</span>
        </button>
      </div>

      {missions.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
          <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h4 className="text-white/60 text-lg mb-2">No missions yet</h4>
          <p className="text-white/40 mb-4">Add missions to create challenges for players</p>
          <button
            onClick={onAddMission}
            className="flex items-center space-x-2 px-6 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create First Mission</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {missions.map((mission, index) => (
            <MissionEditor
              key={mission.id}
              mission={mission}
              index={index}
              onUpdate={onUpdateMission}
              onDelete={onDeleteMission}
              onMove={onMoveMission}
              canMoveUp={index > 0}
              canMoveDown={index < missions.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Mission Editor Component
const MissionEditor: React.FC<{
  mission: Mission;
  index: number;
  onUpdate: (id: string, updates: Partial<Mission>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}> = ({ mission, index, onUpdate, onDelete, onMove, canMoveUp, canMoveDown }) => {
  const [expanded, setExpanded] = useState(false);

  const missionTypes = [
    { value: 'code-fix', label: 'Code Fix', icon: Code },
    { value: 'investigation', label: 'Investigation', icon: Search },
    { value: 'analysis', label: 'Analysis', icon: Eye },
    { value: 'evidence', label: 'Evidence', icon: FileText },
    { value: 'story', label: 'Story Choice', icon: MessageSquare }
  ];

  const currentType = missionTypes.find(t => t.value === mission.type);
  const Icon = currentType?.icon || Code;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 rounded-lg border border-white/20"
    >
      {/* Mission Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          <Icon className="w-5 h-5 text-white/60" />
          <div>
            <h4 className="text-white font-medium">
              {mission.title || `Mission ${index + 1}`}
            </h4>
            <p className="text-white/60 text-sm">{currentType?.label}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => canMoveUp && onMove(mission.id, 'up')}
            disabled={!canMoveUp}
            className={`p-2 rounded-lg transition-colors ${
              canMoveUp 
                ? 'text-white/60 hover:text-white hover:bg-white/10' 
                : 'text-white/20 cursor-not-allowed'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => canMoveDown && onMove(mission.id, 'down')}
            disabled={!canMoveDown}
            className={`p-2 rounded-lg transition-colors ${
              canMoveDown 
                ? 'text-white/60 hover:text-white hover:bg-white/10' 
                : 'text-white/20 cursor-not-allowed'
            }`}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(mission.id)}
            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mission Details */}
      {expanded && (
        <div className="border-t border-white/20 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Mission Title</label>
              <input
                type="text"
                value={mission.title}
                onChange={(e) => onUpdate(mission.id, { title: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                placeholder="Fix the broken navigation"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Mission Type</label>
              <select
                value={mission.type}
                onChange={(e) => onUpdate(mission.id, { type: e.target.value as any })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              >
                {missionTypes.map(type => (
                  <option 
                    key={type.value} 
                    value={type.value}
                    style={{ backgroundColor: '#1a1a1a', color: 'white' }}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
            <textarea
              value={mission.description}
              onChange={(e) => onUpdate(mission.id, { description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
              placeholder="Describe what the player needs to do in this mission..."
            />
          </div>

          {/* Mission Type Specific Fields */}
          {mission.type === 'code-fix' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Initial Code</label>
                <textarea
                  value={mission.content.initialCode || ''}
                  onChange={(e) => onUpdate(mission.id, {
                    content: { ...mission.content, initialCode: e.target.value }
                  })}
                  rows={6}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-purple-400"
                  placeholder="<div>Broken code here...</div>"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Target Code</label>
                <textarea
                  value={mission.content.targetCode || ''}
                  onChange={(e) => onUpdate(mission.id, {
                    content: { ...mission.content, targetCode: e.target.value }
                  })}
                  rows={6}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-purple-400"
                  placeholder="<div>Fixed code here...</div>"
                />
              </div>
            </div>
          )}

          {mission.type === 'story' && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Story Choices</label>
              <div className="space-y-3">
                {(mission.content.choices || []).map((choice, choiceIndex) => (
                  <div key={choiceIndex} className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg">
                    <input
                      type="text"
                      value={choice.text}
                      onChange={(e) => {
                        const newChoices = [...(mission.content.choices || [])];
                        newChoices[choiceIndex] = { ...choice, text: e.target.value };
                        onUpdate(mission.id, {
                          content: { ...mission.content, choices: newChoices }
                        });
                      }}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                      placeholder="Choice text..."
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={choice.correct}
                        onChange={(e) => {
                          const newChoices = [...(mission.content.choices || [])];
                          newChoices[choiceIndex] = { ...choice, correct: e.target.checked };
                          onUpdate(mission.id, {
                            content: { ...mission.content, choices: newChoices }
                          });
                        }}
                        className="w-4 h-4 text-green-500 bg-white/10 border-white/20 rounded"
                      />
                      <span className="text-white/80 text-sm">Correct</span>
                    </label>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newChoices = [...(mission.content.choices || []), { text: '', correct: false, explanation: '' }];
                    onUpdate(mission.id, {
                      content: { ...mission.content, choices: newChoices }
                    });
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Choice</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Points</label>
              <input
                type="number"
                value={mission.content.points || 250}
                onChange={(e) => onUpdate(mission.id, {
                  content: { ...mission.content, points: parseInt(e.target.value) || 250 }
                })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                placeholder="250"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Hints</label>
              <div className="space-y-2">
                {(mission.content.hints || ['']).map((hint, hintIndex) => (
                  <input
                    key={hintIndex}
                    type="text"
                    value={hint}
                    onChange={(e) => {
                      const newHints = [...(mission.content.hints || [''])];
                      newHints[hintIndex] = e.target.value;
                      onUpdate(mission.id, {
                        content: { ...mission.content, hints: newHints }
                      });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                    placeholder={`Hint ${hintIndex + 1}...`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Preview Tab Component
const PreviewTab: React.FC<{ caseData: DetectiveCase }> = ({ caseData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-lg border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4">{caseData.title}</h3>
        <p className="text-white/70 mb-4">{caseData.description}</p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
            {caseData.difficulty}
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            ⏱️ {caseData.duration}
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            🏆 {caseData.cluePoints} points
          </span>
          {caseData.isDetectiveMission && (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
              🔍 Detective Mission
            </span>
          )}
        </div>

        {caseData.story && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Story</h4>
            <p className="text-white/70 text-sm">{caseData.story}</p>
          </div>
        )}

        {caseData.objective && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">Objective</h4>
            <p className="text-white/70 text-sm">{caseData.objective}</p>
          </div>
        )}
      </div>

      {caseData.cinematicSlides.length > 0 && (
        <div className="bg-white/10 rounded-lg border border-white/20 p-6">
          <h4 className="text-white font-medium mb-4">Cinematic Slides ({caseData.cinematicSlides.length})</h4>
          <div className="space-y-3">
            {caseData.cinematicSlides.map((slide, index) => (
              <div key={slide.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="text-white/60 text-sm capitalize">{slide.type}</span>
                </div>
                <p className="text-white/80 text-sm">{slide.content.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {caseData.missions.length > 0 && (
        <div className="bg-white/10 rounded-lg border border-white/20 p-6">
          <h4 className="text-white font-medium mb-4">Missions ({caseData.missions.length})</h4>
          <div className="space-y-3">
            {caseData.missions.map((mission, index) => (
              <div key={mission.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <span className="text-white font-medium">{mission.title || `Mission ${index + 1}`}</span>
                  <span className="text-white/60 text-sm">({mission.type})</span>
                  <span className="text-green-400 text-sm">{mission.content.points || 250} pts</span>
                </div>
                <p className="text-white/70 text-sm">{mission.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedCaseEditor;
