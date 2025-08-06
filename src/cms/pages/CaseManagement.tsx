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
  Save,
  X,
  Target,
  Clock,
  Star,
  Code,
  FileText,
  Lightbulb,
  Users,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { cases as importedCases } from '../../data/cases';
import { professionalToast } from '../utils/professionalToast';
import { showConfirm } from '../../components/CustomAlert';
import { logger, LogCategory } from '../../utils/logger';

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
  isDetectiveMission?: boolean;
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
      
      if (casesSnapshot.empty) {
        logger.info('📦 No cases found in Firebase, importing from data file...', LogCategory.CMS);
        await initializeCasesInFirebase();
        // Reload after initialization
        const newSnapshot = await getDocs(casesCollection);
        const firebaseCases = newSnapshot.docs.map(doc => {
          const data = doc.data();
          logger.info('🔍 Firebase case loaded:', data.id, data.title, LogCategory.CMS);
          return {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          } as CaseData;
        }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)); // Sort by display order
        logger.info('✅ Loaded cases from Firebase after initialization:', firebaseCases.length, firebaseCases.map(c => c.title), LogCategory.CMS);
        setCases(firebaseCases);
        professionalToast.success('Cases Initialized', `Successfully loaded ${firebaseCases.length} cases from Firebase`);
      } else {
        logger.info(`📚 Loaded ${casesSnapshot.size} cases from Firebase`, LogCategory.CMS);
        const firebaseCases = casesSnapshot.docs.map(doc => {
          const data = doc.data();
          logger.info('🔍 Firebase case loaded:', data.id, data.title, LogCategory.CMS);
          return {
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          } as CaseData;
        }).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)); // Sort by display order
        logger.info('✅ Final cases array:', firebaseCases.length, firebaseCases.map(c => c.title), LogCategory.CMS);
        setCases(firebaseCases);
      }
    } catch (error) {
      logger.error('❌ Error loading cases:', error, LogCategory.CMS);
      professionalToast.error('Loading Failed', 'Failed to load cases from Firebase');
      
      // Fallback to imported cases
      logger.info('🔄 Falling back to imported cases data...', LogCategory.CMS);
      const fallbackCases = importedCases.map(caseData => ({
        ...caseData,
        isActive: true,
        completions: Math.floor(Math.random() * 200) + 50,
        averageScore: Math.floor(Math.random() * 1000) + 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      logger.info('✅ Fallback cases loaded:', fallbackCases.length, fallbackCases.map(c => c.title), LogCategory.CMS);
      setCases(fallbackCases);
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
        
        const caseWithMetadata = {
          ...caseData, // This preserves the missions array and all other data
          displayOrder: i + 1, // Add display order field
          isActive: true,
          completions: Math.floor(Math.random() * 200) + 50, // Random completions for demo
          averageScore: Math.floor(Math.random() * 1000) + 1000, // Random scores for demo
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Use setDoc to overwrite existing data, ensuring missions are preserved
        await setDoc(doc(casesCollection, caseData.id), caseWithMetadata);
        logger.info(`✅ Added case ${i + 1}: ${caseData.title} (missions: ${caseData.missions?.length || 0})`, LogCategory.CMS);
      }
      
      logger.info('🎉 All cases successfully added to Firebase in correct order with missions', LogCategory.CMS);
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

  const handleSaveCase = (caseData: Partial<CaseData>) => {
    if (editingCase) {
      // Update existing case
      setCases(cases.map(case_ => 
        case_.id === editingCase.id 
          ? { 
            ...case_, 
            ...caseData, 
            story: caseData.story || case_.story || 'This is a detective story that will be revealed as you solve the case.',
            objective: caseData.objective || case_.objective || 'Complete the coding challenges to solve this mystery.',
            updatedAt: new Date() 
          }
          : case_
      ));
    } else {
      // Create new case
      const newCase: CaseData = {
        id: `case-${Date.now()}`,
        title: caseData.title || '',
        description: caseData.description || '',
        story: caseData.story || 'This is a detective story that will be revealed as you solve the case.',
        objective: caseData.objective || 'Complete the coding challenges to solve this mystery.',
        difficulty: caseData.difficulty || 'Beginner',
        duration: caseData.duration || '15-20 minutes',
        cluePoints: caseData.cluePoints || 1000,
        hints: caseData.hints || [],
        initialHtml: caseData.initialHtml || '',
        initialCss: caseData.initialCss || '',
        targetHtml: caseData.targetHtml || '',
        targetCss: caseData.targetCss || '',
        isActive: caseData.isActive ?? true,
        completions: 0,
        averageScore: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCases([newCase, ...cases]);
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
      logger.info('🔄 Refreshing cases from data file...', LogCategory.CMS);
      toast.loading('Refreshing cases from data file...', { id: 'refresh-cases' });
      
      // Force re-initialization from data file
      await initializeCasesInFirebase();
      
      // Reload cases
      await loadCases();
      
      professionalToast.success('Refresh Complete', 'Cases refreshed successfully with missions!');
    } catch (error) {
      logger.error('❌ Error refreshing cases:', error, LogCategory.CMS);
      professionalToast.error('Refresh Failed', 'Failed to refresh cases');
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
          
          <button
            onClick={() => {
              setEditingCase(null);
              setShowCaseModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors border border-blue-500/30"
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
        {(() => {
          logger.info('🎨 Rendering cases grid - filteredCases:', filteredCases.length, filteredCases.map(c => c.title), LogCategory.CMS);
          return null;
        })()}
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
                        🔍 Detective
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
                    className="p-2 text-white/60 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all border border-transparent hover:border-blue-500/30"
                    title="Preview Case"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCase(case_);
                      setShowCaseModal(true);
                    }}
                    className="p-2 text-white/60 hover:text-amber-400 hover:bg-amber-500/20 rounded-lg transition-all border border-transparent hover:border-amber-500/30"
                    title="Edit Case"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCase(case_.id)}
                    className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all border border-transparent hover:border-red-500/30"
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

      {/* Case Editor Modal */}
      {showCaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingCase ? 'Edit Case' : 'Create New Case'}
              </h3>
              <button
                onClick={() => setShowCaseModal(false)}
                className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all border border-transparent hover:border-red-500/30"
                title="Close Modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <CaseEditorForm
              case={editingCase}
              onSave={handleSaveCase}
              onCancel={() => setShowCaseModal(false)}
            />
          </motion.div>
        </div>
      )}

      {/* Case Preview Modal */}
      {previewCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Case Preview</h3>
              <button
                onClick={() => setPreviewCase(null)}
                className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all border border-transparent hover:border-red-500/30"
                title="Close Preview"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">{previewCase.title}</h4>
                <p className="text-white/70 mb-4">{previewCase.description}</p>
                
                {previewCase.story && (
                  <div className="mb-4">
                    <h5 className="text-white font-medium mb-2 flex items-center">
                      📖 Story Content
                    </h5>
                    <div className="bg-white/5 rounded-lg p-4 max-h-40 overflow-y-auto custom-scrollbar">
                      <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans">
                        {previewCase.story}
                      </pre>
                    </div>
                  </div>
                )}
                
                {previewCase.objective && (
                  <div className="mb-4">
                    <h5 className="text-white font-medium mb-2 flex items-center">
                      🎯 Objective
                    </h5>
                    <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                      <p className="text-amber-200 text-sm">{previewCase.objective}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    previewCase.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    previewCase.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
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
                      🔍 Detective Mission
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-white font-medium">Initial HTML</h5>
                  <pre className="bg-black/30 rounded-lg p-4 text-green-400 text-sm overflow-x-auto custom-scrollbar">
                    <code>{previewCase.initialHtml}</code>
                  </pre>
                </div>
                
                <div className="space-y-4">
                  <h5 className="text-white font-medium">Target HTML</h5>
                  <pre className="bg-black/30 rounded-lg p-4 text-blue-400 text-sm overflow-x-auto custom-scrollbar">
                    <code>{previewCase.targetHtml}</code>
                  </pre>
                </div>
                
                <div className="space-y-4">
                  <h5 className="text-white font-medium">Initial CSS</h5>
                  <pre className="bg-black/30 rounded-lg p-4 text-green-400 text-sm overflow-x-auto custom-scrollbar">
                    <code>{previewCase.initialCss}</code>
                  </pre>
                </div>
                
                <div className="space-y-4">
                  <h5 className="text-white font-medium">Target CSS</h5>
                  <pre className="bg-black/30 rounded-lg p-4 text-blue-400 text-sm overflow-x-auto custom-scrollbar">
                    <code>{previewCase.targetCss}</code>
                  </pre>
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

// Case Editor Form Component
interface CaseEditorFormProps {
  case: CaseData | null;
  onSave: (caseData: Partial<CaseData>) => void;
  onCancel: () => void;
}

const CaseEditorForm: React.FC<CaseEditorFormProps> = ({ case: editCase, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<CaseData>>({
    title: editCase?.title || '',
    description: editCase?.description || '',
    story: editCase?.story || '',
    objective: editCase?.objective || '',
    difficulty: editCase?.difficulty || 'Beginner',
    duration: editCase?.duration || '',
    cluePoints: editCase?.cluePoints || 1000,
    hints: editCase?.hints || [''],
    initialHtml: editCase?.initialHtml || '',
    initialCss: editCase?.initialCss || '',
    targetHtml: editCase?.targetHtml || '',
    targetCss: editCase?.targetCss || '',
    isActive: editCase?.isActive ?? true,
    isDetectiveMission: editCase?.isDetectiveMission || false,
    missions: editCase?.missions || [],
    cinematicSlides: editCase?.cinematicSlides || [],
    finalResolution: editCase?.finalResolution || ''
  });

  const addHint = () => {
    setFormData({
      ...formData,
      hints: [...(formData.hints || []), '']
    });
  };

  const updateHint = (index: number, value: string) => {
    const newHints = [...(formData.hints || [])];
    newHints[index] = value;
    setFormData({
      ...formData,
      hints: newHints
    });
  };

  const removeHint = (index: number) => {
    const newHints = [...(formData.hints || [])];
    newHints.splice(index, 1);
    setFormData({
      ...formData,
      hints: newHints
    });
  };

  // Mission management functions
  const addMission = () => {
    const newMission = {
      id: `mission-${Date.now()}`,
      title: '',
      description: '',
      objective: '',
      brokenHtml: '',
      brokenCss: '',
      targetHtml: '',
      targetCss: '',
      successConditions: [''],
      clueRevealed: '',
      clueUnlockCondition: '',
      aiHints: ['']
    };
    setFormData({
      ...formData,
      missions: [...(formData.missions || []), newMission]
    });
  };

  const updateMission = (index: number, field: string, value: any) => {
    const newMissions = [...(formData.missions || [])];
    newMissions[index] = { ...newMissions[index], [field]: value };
    setFormData({
      ...formData,
      missions: newMissions
    });
  };

  const removeMission = (index: number) => {
    const newMissions = [...(formData.missions || [])];
    newMissions.splice(index, 1);
    setFormData({
      ...formData,
      missions: newMissions
    });
  };

  const updateMissionArray = (missionIndex: number, arrayField: string, itemIndex: number, value: string) => {
    const newMissions = [...(formData.missions || [])];
    const mission = { ...newMissions[missionIndex] };
    const array = [...(mission[arrayField as keyof typeof mission] as string[] || [])];
    array[itemIndex] = value;
    mission[arrayField as keyof typeof mission] = array as any;
    newMissions[missionIndex] = mission;
    setFormData({
      ...formData,
      missions: newMissions
    });
  };

  const addMissionArrayItem = (missionIndex: number, arrayField: string) => {
    const newMissions = [...(formData.missions || [])];
    const mission = { ...newMissions[missionIndex] };
    const array = [...(mission[arrayField as keyof typeof mission] as string[] || [])];
    array.push('');
    mission[arrayField as keyof typeof mission] = array as any;
    newMissions[missionIndex] = mission;
    setFormData({
      ...formData,
      missions: newMissions
    });
  };

  const removeMissionArrayItem = (missionIndex: number, arrayField: string, itemIndex: number) => {
    const newMissions = [...(formData.missions || [])];
    const mission = { ...newMissions[missionIndex] };
    const array = [...(mission[arrayField as keyof typeof mission] as string[] || [])];
    array.splice(itemIndex, 1);
    mission[arrayField as keyof typeof mission] = array as any;
    newMissions[missionIndex] = mission;
    setFormData({
      ...formData,
      missions: newMissions
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            required
          />
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Difficulty *</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            required
          >
            <option value="Beginner" className="bg-slate-800 text-white">Beginner</option>
            <option value="Intermediate" className="bg-slate-800 text-white">Intermediate</option>
            <option value="Advanced" className="bg-slate-800 text-white">Advanced</option>
          </select>
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 15-20 minutes"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          />
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">Points *</label>
          <input
            type="number"
            value={formData.cluePoints}
            onChange={(e) => setFormData({ ...formData, cluePoints: parseInt(e.target.value) })}
            min="0"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          placeholder="Brief description of the case..."
          required
        />
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          📖 Story Content *
        </label>
        <textarea
          value={formData.story}
          onChange={(e) => setFormData({ ...formData, story: e.target.value })}
          rows={8}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 font-mono text-sm"
          placeholder="The full story content including detective narrative, characters, and plot. Use markdown formatting..."
          required
        />
        <p className="text-white/50 text-xs mt-1">💡 This is the main story content users will see. Use markdown formatting for better presentation.</p>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          🎯 Objective *
        </label>
        <textarea
          value={formData.objective}
          onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          placeholder="Clear objective explaining what the user needs to accomplish..."
          required
        />
        <p className="text-white/50 text-xs mt-1">💡 Brief, clear goal for the user to understand what they need to do.</p>
      </div>

      {/* Code Sections - Conditional based on Detective Mission */}
      {formData.isDetectiveMission ? (
        // Detective Mission: Multiple Missions
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white flex items-center">
              🔍 Detective Missions
            </h4>
            <button
              type="button"
              onClick={addMission}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all border border-blue-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Mission</span>
            </button>
          </div>
          <p className="text-white/60 text-sm">
            Detective missions have multiple coding challenges that reveal clues step by step.
          </p>

          {(formData.missions || []).map((mission, missionIndex) => (
            <div key={mission.id} className="bg-white/5 rounded-xl p-6 border border-amber-500/20">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-white font-semibold flex items-center">
                  <span className="w-6 h-6 bg-amber-500/20 text-amber-300 text-sm font-bold rounded-full flex items-center justify-center mr-2">
                    {missionIndex + 1}
                  </span>
                  Mission {missionIndex + 1}
                </h5>
                {(formData.missions?.length || 0) > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMission(missionIndex)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Remove Mission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Mission Title *</label>
                  <input
                    type="text"
                    value={mission.title}
                    onChange={(e) => updateMission(missionIndex, 'title', e.target.value)}
                    placeholder="e.g., Clue 1: The Truth About NovaCorp"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Clue Unlock Condition</label>
                  <input
                    type="text"
                    value={mission.clueUnlockCondition}
                    onChange={(e) => updateMission(missionIndex, 'clueUnlockCondition', e.target.value)}
                    placeholder="What user needs to do to unlock this clue"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-white/80 text-sm font-medium mb-2">Mission Description</label>
                <textarea
                  value={mission.description}
                  onChange={(e) => updateMission(missionIndex, 'description', e.target.value)}
                  rows={2}
                  placeholder="Brief description of what this mission involves..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white/80 text-sm font-medium mb-2">Mission Objective</label>
                <textarea
                  value={mission.objective}
                  onChange={(e) => updateMission(missionIndex, 'objective', e.target.value)}
                  rows={2}
                  placeholder="Clear objective for this specific mission..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white/80 text-sm font-medium mb-2">Clue Revealed</label>
                <textarea
                  value={mission.clueRevealed}
                  onChange={(e) => updateMission(missionIndex, 'clueRevealed', e.target.value)}
                  rows={2}
                  placeholder="The clue/story element revealed when mission is completed..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Mission Code Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Code className="inline w-4 h-4 mr-1 text-red-400" />
                    Broken HTML
                  </label>
                  <textarea
                    value={mission.brokenHtml}
                    onChange={(e) => updateMission(missionIndex, 'brokenHtml', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 bg-black/30 border border-red-400/30 rounded-lg text-red-300 font-mono text-sm focus:outline-none focus:border-red-400"
                    placeholder="Broken HTML for this mission..."
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Code className="inline w-4 h-4 mr-1 text-green-400" />
                    Target HTML
                  </label>
                  <textarea
                    value={mission.targetHtml}
                    onChange={(e) => updateMission(missionIndex, 'targetHtml', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 bg-black/30 border border-green-400/30 rounded-lg text-green-300 font-mono text-sm focus:outline-none focus:border-green-400"
                    placeholder="Fixed HTML for this mission..."
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <FileText className="inline w-4 h-4 mr-1 text-red-400" />
                    Broken CSS
                  </label>
                  <textarea
                    value={mission.brokenCss}
                    onChange={(e) => updateMission(missionIndex, 'brokenCss', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 bg-black/30 border border-red-400/30 rounded-lg text-red-300 font-mono text-sm focus:outline-none focus:border-red-400"
                    placeholder="Broken CSS for this mission..."
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <FileText className="inline w-4 h-4 mr-1 text-green-400" />
                    Target CSS
                  </label>
                  <textarea
                    value={mission.targetCss}
                    onChange={(e) => updateMission(missionIndex, 'targetCss', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 bg-black/30 border border-green-400/30 rounded-lg text-green-300 font-mono text-sm focus:outline-none focus:border-green-400"
                    placeholder="Fixed CSS for this mission..."
                  />
                </div>
              </div>

              {/* Mission AI Hints */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white/80 text-sm font-medium">
                    <Lightbulb className="inline w-4 h-4 mr-1" />
                    Mission Hints
                  </label>
                  <button
                    type="button"
                    onClick={() => addMissionArrayItem(missionIndex, 'aiHints')}
                    className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Hint</span>
                  </button>
                </div>
                
                <div className="space-y-2">
                  {(mission.aiHints || []).map((hint: string, hintIndex: number) => (
                    <div key={hintIndex} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={hint}
                          onChange={(e) => updateMissionArray(missionIndex, 'aiHints', hintIndex, e.target.value)}
                          placeholder={`Mission hint ${hintIndex + 1}...`}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      {(mission.aiHints?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMissionArrayItem(missionIndex, 'aiHints', hintIndex)}
                          className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {(formData.missions?.length || 0) === 0 && (
            <div className="text-center py-8 text-white/60">
              <p>No missions added yet. Click "Add Mission" to create your first detective mission.</p>
            </div>
          )}

          {/* Final Resolution */}
          <div className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/20">
            <h5 className="text-white font-semibold mb-3 flex items-center">
              🎬 Final Resolution
            </h5>
            <textarea
              value={formData.finalResolution}
              onChange={(e) => setFormData({ ...formData, finalResolution: e.target.value })}
              rows={4}
              placeholder="The final resolution/conclusion of the detective story after all missions are completed..."
              className="w-full px-3 py-2 bg-white/10 border border-amber-500/30 rounded-lg text-white focus:outline-none focus:border-amber-400"
            />
            <p className="text-amber-300/60 text-xs mt-1">🎭 This appears after users complete all missions and solve the case.</p>
          </div>
        </div>
      ) : (
        // Regular Case: Single HTML/CSS Challenge
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <Code className="w-5 h-5 mr-2 text-purple-400" />
            HTML & CSS Code Challenge
          </h4>
          <p className="text-white/60 text-sm">
            Define the broken code (initial) and the fixed code (target) that users need to achieve.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Code className="inline w-4 h-4 mr-1 text-red-400" />
                Initial HTML (Broken Code)
              </label>
              <textarea
                value={formData.initialHtml}
                onChange={(e) => setFormData({ ...formData, initialHtml: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 bg-black/30 border border-red-400/30 rounded-lg text-red-300 font-mono text-sm focus:outline-none focus:border-red-400"
                placeholder="<!DOCTYPE html>
<html>
<head>
  <title>Broken Page</title>
</head>
<body>
  <!-- Enter the broken HTML code here -->
</body>
</html>"
              />
              <p className="text-red-300/60 text-xs mt-1">💀 The broken HTML that users will start with</p>
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Code className="inline w-4 h-4 mr-1 text-green-400" />
                Target HTML (Fixed Code)
              </label>
              <textarea
                value={formData.targetHtml}
                onChange={(e) => setFormData({ ...formData, targetHtml: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 bg-black/30 border border-green-400/30 rounded-lg text-green-300 font-mono text-sm focus:outline-none focus:border-green-400"
                placeholder="<!DOCTYPE html>
<html>
<head>
  <title>Fixed Page</title>
</head>
<body>
  <!-- Enter the correct HTML code here -->
</body>
</html>"
              />
              <p className="text-green-300/60 text-xs mt-1">✅ The correct HTML that users should achieve</p>
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <FileText className="inline w-4 h-4 mr-1 text-red-400" />
                Initial CSS (Broken Styles)
              </label>
              <textarea
                value={formData.initialCss}
                onChange={(e) => setFormData({ ...formData, initialCss: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 bg-black/30 border border-red-400/30 rounded-lg text-red-300 font-mono text-sm focus:outline-none focus:border-red-400"
                placeholder="/* Broken CSS styles */
body {
  /* Enter broken CSS here */
}"
              />
              <p className="text-red-300/60 text-xs mt-1">💀 The broken CSS that users will start with</p>
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <FileText className="inline w-4 h-4 mr-1 text-green-400" />
                Target CSS (Fixed Styles)
              </label>
              <textarea
                value={formData.targetCss}
                onChange={(e) => setFormData({ ...formData, targetCss: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 bg-black/30 border border-green-400/30 rounded-lg text-green-300 font-mono text-sm focus:outline-none focus:border-green-400"
                placeholder="/* Fixed CSS styles */
body {
  /* Enter correct CSS here */
}"
              />
              <p className="text-green-300/60 text-xs mt-1">✅ The correct CSS that users should achieve</p>
            </div>
          </div>
        </div>
      )}

      {/* Hints */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-white/80 text-sm font-medium">
            <Lightbulb className="inline w-4 h-4 mr-1" />
            Hints
          </label>
          <button
            type="button"
            onClick={addHint}
            className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hint</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {(formData.hints || []).map((hint, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => updateHint(index, e.target.value)}
                  placeholder={`Hint ${index + 1}...`}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                />
              </div>
              {(formData.hints?.length || 0) > 1 && (
                <button
                  type="button"
                  onClick={() => removeHint(index)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
          />
          <label htmlFor="isActive" className="text-white/80 text-sm">
            Case is active and available to users
          </label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isDetectiveMission"
            checked={formData.isDetectiveMission}
            onChange={(e) => setFormData({ ...formData, isDetectiveMission: e.target.checked })}
            className="w-4 h-4 text-amber-600 bg-white/10 border-white/20 rounded focus:ring-amber-500"
          />
          <label htmlFor="isDetectiveMission" className="text-white/80 text-sm">
            🔍 Detective Mission (includes cinematic slides and immersive gameplay)
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-white/20">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-white/70 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{editCase ? 'Update Case' : 'Create Case'}</span>
        </button>
      </div>
    </form>
  );
};

export default CaseManagement;
