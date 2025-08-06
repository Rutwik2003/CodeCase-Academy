import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Search,
  Filter,
  X,
  Target,
  Clock,
  Star,
  Users,
  TrendingUp,
  Lightbulb,
  Download,
  RefreshCw
} from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { cases as importedCases } from '../../data/cases';
import { professionalToast } from '../utils/professionalToast';
import AdvancedCaseEditor from './AdvancedCaseEditor';
import { logger, LogCategory } from '../../utils/logger';
import { showConfirm } from '../../components/CustomAlert';

// Function to calculate real case statistics from user data
const calculateRealCaseStats = async (caseId: string) => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    let completions = 0;
    let totalScore = 0;
    let scoreCount = 0;
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.completedCases && userData.completedCases.includes(caseId)) {
        completions++;
        if (userData.totalPoints) {
          totalScore += userData.totalPoints;
          scoreCount++;
        }
      }
    });
    
    return {
      completions,
      averageScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0
    };
  } catch (error) {
    logger.error('Error calculating case stats:', error, LogCategory.CMS);
    return { completions: 0, averageScore: 0 };
  }
};

interface CaseData {
  id: string;
  title: string;
  description: string;
  story: string;
  objective: string;
  initialHtml: string;
  initialCss: string;
  targetHtml: string;
  targetCss: string;
  hints: string[];
  cluePoints: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  // Additional fields for management
  displayOrder?: number;
  isActive?: boolean;
  completions?: number;
  averageScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
  // Detective mission fields
  isDetectiveMission: boolean; // Made required
  cinematicSlides?: any[];
  missions?: any[];
  finalResolution?: string;
}

const CaseManagement: React.FC = () => {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseData | null>(null);
  const [previewCase, setPreviewCase] = useState<CaseData | null>(null);

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    filterCases();
  }, [cases, searchTerm, filterDifficulty]);

  const loadCases = async () => {
    try {
      setLoading(true);
      logger.info('🔄 Loading cases from Firebase...', LogCategory.CMS);
      
      // Try to load cases from Firebase
      const casesCollection = collection(db, 'cases');
      const casesSnapshot = await getDocs(casesCollection);
      
      logger.info('📊 Firebase query result - isEmpty:', casesSnapshot.empty, 'size:', casesSnapshot.size, LogCategory.CMS);
      
      if (casesSnapshot.empty || true) { // Force re-initialization to include all cases
        logger.info('📦 Re-initializing all cases including Vanishing Blogger...', LogCategory.CMS);
        await initializeCasesInFirebase();
        // Reload after initialization
        const newSnapshot = await getDocs(casesCollection);
        const firebaseCases = newSnapshot.docs.map(doc => {
          const data = doc.data();
          logger.info('🔍 Firebase case loaded after init:', data.id, data.title, LogCategory.CMS);
          logger.info('🎬 Cinematics:', data.cinematicSlides?.length || 0, LogCategory.CMS);
          logger.info('🎯 Missions:', data.missions?.length || 0, LogCategory.CMS);
          return {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          } as CaseData;
        }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)); // Sort by display order
        logger.info('✅ Loaded cases from Firebase after initialization:', firebaseCases.length, firebaseCases.map(c => `${c.title} (${c.id})`), LogCategory.CMS);
        
        // Update cases with real statistics
        const casesWithRealStats = await Promise.all(firebaseCases.map(async (caseItem) => {
          const realStats = await calculateRealCaseStats(caseItem.id);
          return {
            ...caseItem,
            completions: realStats.completions,
            averageScore: realStats.averageScore
          };
        }));
        
        setCases(casesWithRealStats);
        professionalToast.success('Cases Initialized', `Successfully loaded ${firebaseCases.length} cases from Firebase`);
      } else {
        logger.info(`📚 Loaded ${casesSnapshot.size} cases from Firebase`, LogCategory.CMS);
        const firebaseCases = casesSnapshot.docs.map(doc => {
          const data = doc.data();
          logger.info('🔍 Firebase case loaded:', data.id, data.title, LogCategory.CMS);
          logger.info('🎬 Cinematics:', data.cinematicSlides?.length || 0, LogCategory.CMS);
          logger.info('🎯 Missions:', data.missions?.length || 0, LogCategory.CMS);
          return {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          } as CaseData;
        }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)); // Sort by display order
        logger.info('✅ Final cases array:', firebaseCases.length, firebaseCases.map(c => c.title), LogCategory.CMS);
        
        // Update cases with real statistics
        const casesWithRealStats = await Promise.all(firebaseCases.map(async (caseItem) => {
          const realStats = await calculateRealCaseStats(caseItem.id);
          return {
            ...caseItem,
            completions: realStats.completions,
            averageScore: realStats.averageScore
          };
        }));
        
        setCases(casesWithRealStats);
      }
    } catch (error) {
      logger.error('❌ Error loading cases:', error, LogCategory.CMS);
      professionalToast.error('Loading Failed', 'Failed to load cases from Firebase');
      
      // Fallback to imported cases
      logger.info('🔄 Falling back to imported cases data...', LogCategory.CMS);
      const fallbackCases = importedCases.map(caseData => ({
        ...caseData,
        isDetectiveMission: caseData.isDetectiveMission || false, // Ensure boolean
        cinematicSlides: caseData.cinematicSlides || [],
        missions: caseData.missions || [],
        isActive: true,
        completions: 0, // Real data will come from user completions
        averageScore: 0, // Real data will come from user scores
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      logger.info('✅ Fallback cases loaded:', fallbackCases.length, fallbackCases.map(c => c.title), LogCategory.CMS);
      
      // Update fallback cases with real statistics
      const fallbackCasesWithRealStats = await Promise.all(fallbackCases.map(async (caseItem) => {
        const realStats = await calculateRealCaseStats(caseItem.id);
        return {
          ...caseItem,
          completions: realStats.completions,
          averageScore: realStats.averageScore
        };
      }));
      
      setCases(fallbackCasesWithRealStats);
    } finally {
      setLoading(false);
    }
  };

  const initializeCasesInFirebase = async () => {
    try {
      logger.info('🚀 Initializing cases in Firebase...', LogCategory.CMS);
      const casesCollection = collection(db, 'cases');
      
      // Maintain the exact order from the data file
      const casesInOrder = [
        importedCases.find(c => c.id === 'case-vanishing-blogger'), // Tutorial case: Sam Lens (first)
        importedCases.find(c => c.id === 'visual-vanishing-blogger'), // Real case: Rishi Nair
        importedCases.find(c => c.id === 'case-2'), // Navigation mystery
        importedCases.find(c => c.id === 'case-3'), // Last Frame
        importedCases.find(c => c.id === 'case-broken-portfolio') // Broken portfolio
      ].filter(Boolean); // Remove any undefined cases
      
      for (let i = 0; i < casesInOrder.length; i++) {
        const caseData = casesInOrder[i];
        if (!caseData) continue; // Skip if case not found
        
        logger.info(`📦 Processing case ${i + 1}: ${caseData.title}`, LogCategory.CMS);
        logger.info(`🎬 Original cinematicSlides:`, caseData.cinematicSlides?.length || 0, LogCategory.CMS);
        logger.info(`🎯 Original missions:`, caseData.missions?.length || 0, LogCategory.CMS);
        logger.info(`🔍 Is detective mission:`, caseData.isDetectiveMission, LogCategory.CMS);
        
        const caseWithMetadata = {
          ...caseData, // This preserves the missions array and all other data
          displayOrder: i + 1, // Add display order field
          isActive: true,
          completions: 0, // Real completions will be calculated from user data
          averageScore: 0, // Real scores will be calculated from user data
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        logger.info(`✍️ Saving case with cinematicSlides:`, caseWithMetadata.cinematicSlides?.length || 0, LogCategory.CMS);
        logger.info(`✍️ Saving case with missions:`, caseWithMetadata.missions?.length || 0, LogCategory.CMS);
        
        // Use setDoc to overwrite existing data, ensuring missions are preserved
        await setDoc(doc(casesCollection, caseData.id), caseWithMetadata);
        logger.info(`✅ Added case ${i + 1}: ${caseData.title} (cinematics: ${caseData.cinematicSlides?.length || 0}, missions: ${caseData.missions?.length || 0})`, LogCategory.CMS);
      }
      
      logger.info('🎉 All cases successfully added to Firebase in correct order with complete data', LogCategory.CMS);
    } catch (error) {
      logger.error('❌ Error initializing cases in Firebase:', error, LogCategory.CMS);
      throw error;
    }
  };

  const filterCases = () => {
    logger.info('🔍 filterCases called - cases:', cases.length, 'searchTerm:', searchTerm, 'filterDifficulty:', filterDifficulty, LogCategory.CMS);
    let filtered = cases;

    if (searchTerm) {
      filtered = filtered.filter(case_ => 
        case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        case_.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(case_ => case_.difficulty.toLowerCase() === filterDifficulty);
    }

    logger.info('🔍 Filtered cases:', filtered.length, 'filtered cases:', filtered.map(c => c.title), LogCategory.CMS);
    setFilteredCases(filtered);
  };

  const handleSaveCase = (caseData: any) => {
    if (editingCase) {
      // Update existing case
      setCases(cases.map(case_ => 
        case_.id === editingCase.id 
          ? { 
            ...case_, 
            ...caseData, 
            updatedAt: new Date() 
          }
          : case_
      ));
      professionalToast.success('Case Updated', 'Case has been successfully updated');
    } else {
      // Create new case
      const newCase: CaseData = {
        ...caseData,
        id: caseData.id || `case-${Date.now()}`,
        isActive: caseData.isActive ?? true,
        completions: 0,
        averageScore: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCases([newCase, ...cases]);
      professionalToast.success('Case Created', 'New case has been successfully created');
    }
    
    setShowCaseModal(false);
    setEditingCase(null);
  };

  const handleDeleteCase = async (caseId: string) => {
    const shouldDelete = await showConfirm(
      'Are you sure you want to delete this case? This action cannot be undone.',
      {
        title: '🗑️ Delete Case',
        type: 'error',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    );
    
    if (!shouldDelete) {
      return;
    }
    setCases(cases.filter(case_ => case_.id !== caseId));
  };

  const handleToggleCaseStatus = (caseId: string) => {
    setCases(cases.map(case_ => 
      case_.id === caseId 
        ? { ...case_, isActive: !case_.isActive, updatedAt: new Date() }
        : case_
    ));
  };

  const handleRefreshFromDataFile = async () => {
    try {
      logger.info(LogCategory.CMS, '🔄 Refreshing cases from data file...');
      professionalToast.info('Refreshing', 'Loading cases from data file...');
      
      // Force re-initialization from data file
      await initializeCasesInFirebase();
      
      // Reload cases
      await loadCases();
      
      professionalToast.replace('success', 'Refresh Complete', 'Cases refreshed successfully with missions!');
    } catch (error) {
      logger.error(LogCategory.CMS, '❌ Error refreshing cases:', error);
      professionalToast.replace('error', 'Refresh Failed', 'Failed to refresh cases from data file');
    }
  };

  const exportCases = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalCases: cases.length,
      cases: cases.map(caseData => ({
        id: caseData.id,
        title: caseData.title,
        description: caseData.description,
        difficulty: caseData.difficulty,
        isActive: caseData.isActive,
        completions: caseData.completions || 0,
        averageScore: caseData.averageScore || 0,
        createdAt: caseData.createdAt,
        updatedAt: caseData.updatedAt
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codecase-cases-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Advanced': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Case Management</h2>
            <p className="text-white/60">
              Manage {cases.length} detective cases across CodeCase Academy
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setEditingCase(null);
                setShowCaseModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors border border-purple-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Case</span>
            </button>
            
            <button
              onClick={handleRefreshFromDataFile}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors border border-blue-500/30"
              title="Re-import cases from data file to ensure all missions are loaded"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={exportCases}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors border border-emerald-500/30"
              title="Export all cases data to JSON file"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Cases</p>
              <p className="text-2xl font-bold text-white">{cases.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Cases</p>
              <p className="text-2xl font-bold text-white">
                {cases.filter(c => c.isActive).length}
              </p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Completions</p>
              <p className="text-2xl font-bold text-white">
                {cases.reduce((acc, c) => acc + (c.completions || 0), 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Avg. Score</p>
              <p className="text-2xl font-bold text-white">
                {cases.length > 0 ? Math.round(cases.reduce((acc, c) => acc + (c.averageScore || 0), 0) / cases.length) : 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search cases by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/60" />
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all" className="bg-slate-800 text-white">All Difficulties</option>
              <option value="beginner" className="bg-slate-800 text-white">Beginner</option>
              <option value="intermediate" className="bg-slate-800 text-white">Intermediate</option>
              <option value="advanced" className="bg-slate-800 text-white">Advanced</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCases.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-white/60 text-lg mb-2">
              No cases found
            </div>
            <div className="text-white/40 text-sm">
              {cases.length === 0 ? 'No cases loaded from database' : `${cases.length} cases total, but none match current filters`}
            </div>
            <div className="text-white/40 text-xs mt-2">
              Search: "{searchTerm}" | Difficulty: {filterDifficulty}
            </div>
          </div>
        ) : (
          filteredCases.map((case_, index) => (
            <motion.div
              key={case_.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{case_.title}</h3>
                    {case_.displayOrder && (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
                        {case_.displayOrder}
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">{case_.description}</p>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(case_.difficulty)}`}>
                      {case_.difficulty}
                    </span>
                    <div className="flex items-center space-x-1 text-white/60">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{case_.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-white/60">
                      <Star className="w-3 h-3" />
                      <span className="text-xs">{case_.cluePoints} pts</span>
                    </div>
                    {case_.isDetectiveMission && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        🔍 Detective ({case_.missions?.length || 0} missions)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${case_.isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span className={`text-xs ${case_.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {case_.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-white/60 text-xs">Completions</span>
                  </div>
                  <p className="text-white font-bold">{case_.completions}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-white/60 text-xs">Avg Score</span>
                  </div>
                  <p className="text-white font-bold">{case_.averageScore}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPreviewCase(case_)}
                    className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                    title="Preview Case"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      logger.info(LogCategory.CMS, '🎬 EDITING CASE:', case_);
                      logger.info(LogCategory.CMS, '🎭 Case cinematic slides:', case_.cinematicSlides);
                      logger.info(LogCategory.CMS, '🎯 Case missions:', case_.missions);
                      logger.info(LogCategory.CMS, '🔍 Is detective mission:', case_.isDetectiveMission);
                      setEditingCase(case_);
                      setShowCaseModal(true);
                    }}
                    className="p-2 text-white/60 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                    title="Edit Case"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCase(case_.id)}
                    className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete Case"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => handleToggleCaseStatus(case_.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    case_.isActive
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {case_.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Case Editor Modal - Advanced Editor */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl w-full max-w-6xl h-[90vh] overflow-hidden"
          >
            <AdvancedCaseEditor
              case={editingCase as any}
              onSave={handleSaveCase}
              onCancel={() => setShowCaseModal(false)}
            />
          </motion.div>
        </div>
      )}

      {/* Case Preview Modal - Simplified */}
      {previewCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Case Preview</h3>
              <button
                onClick={() => setPreviewCase(null)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">{previewCase.title}</h4>
                <p className="text-white/70 mb-4">{previewCase.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(previewCase.difficulty)}`}>
                    {previewCase.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
                    ⏱️ {previewCase.duration}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
                    🏆 {previewCase.cluePoints} points
                  </span>
                  {previewCase.isDetectiveMission && (
                    <span className="px-3 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400">
                      🔍 Detective Mission ({previewCase.missions?.length || 0} missions)
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="text-white font-medium mb-3">Hints</h5>
                <div className="space-y-2">
                  {previewCase.hints.map((hint, index) => (
                    <div key={index} className="flex items-start space-x-2 bg-white/5 rounded-lg p-3">
                      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70 text-sm">{hint}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;
