import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Code, Star, Search, Filter, Calendar, AlertCircle, CheckCircle, Clock, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EvidencePageProps {
  onBack: () => void;
}

interface Evidence {
  id: string;
  caseId: string;
  title: string;
  description: string;
  type: 'code' | 'document' | 'image' | 'clue';
  content: string;
  discoveredAt: Date;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export const EvidencePage: React.FC<EvidencePageProps> = ({ onBack }) => {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | Evidence['type']>('all');
  const [filterImportance, setFilterImportance] = useState<'all' | Evidence['importance']>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [evidenceData, setEvidenceData] = useState<Evidence[]>([]);

  // Load evidence data from completed cases and user data
  useEffect(() => {
    if (userData?.completedCases) {
      const mockEvidence: Evidence[] = userData.completedCases.flatMap((caseId, caseIndex) => [
        {
          id: `evidence-${caseIndex}-1`,
          caseId,
          title: `Code Fragment from ${caseId}`,
          description: `A critical piece of code that revealed the bug in ${caseId}`,
          type: 'code' as const,
          content: `
/* Evidence Code Fragment */
.navbar {
  display: flex;
  justify-content: space-between;
  /* BUG: Missing align-items property caused vertical misalignment */
  align-items: center;
}

.hero-section {
  /* BUG: Incorrect height calculation */
  height: calc(100vh - 60px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
          `,
          discoveredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          importance: ['critical', 'high', 'medium'][caseIndex % 3] as Evidence['importance']
        },
        {
          id: `evidence-${caseIndex}-2`,
          caseId,
          title: `Investigation Notes for ${caseId}`,
          description: `Detective notes and findings during the investigation`,
          type: 'document' as const,
          content: `
DETECTIVE CASE FILE - ${caseId}
========================================

Date: ${new Date().toLocaleDateString()}
Investigator: Detective ${userData.displayName}

CASE SUMMARY:
- Website experiencing layout issues
- Multiple CSS and HTML errors identified
- User experience severely impacted

KEY FINDINGS:
1. Missing CSS properties causing alignment issues
2. Incorrect HTML semantic structure
3. Responsive design failures on mobile devices

EVIDENCE COLLECTED:
- Code fragments showing exact bugs
- Screenshots of broken layouts
- Browser console error logs

RESOLUTION:
Applied systematic debugging approach to identify and fix all issues.
Case successfully closed with full website functionality restored.

STATUS: SOLVED ✓
          `,
          discoveredAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
          importance: ['high', 'medium', 'low'][caseIndex % 3] as Evidence['importance']
        },
        {
          id: `evidence-${caseIndex}-3`,
          caseId,
          title: `Detective Clue #${caseIndex + 1}`,
          description: `A crucial clue that led to solving the mystery`,
          type: 'clue' as const,
          content: `
🔍 DETECTIVE CLUE #${caseIndex + 1}

"The missing piece wasn't in the HTML structure, 
but in the CSS styles that bind everything together. 
Look for what's absent, not what's present."

💡 This clue led to the discovery of:
- Missing CSS properties
- Incorrect selector specificity
- Overlooked responsive breakpoints

Result: Case breakthrough and successful resolution!
          `,
          discoveredAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
          importance: ['medium', 'high', 'critical'][caseIndex % 3] as Evidence['importance']
        }
      ]);
      setEvidenceData(mockEvidence);
    }
  }, [userData?.completedCases, userData?.displayName]);

  const filteredEvidence = evidenceData.filter(evidence => {
    const matchesSearch = evidence.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evidence.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evidence.caseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || evidence.type === filterType;
    const matchesImportance = filterImportance === 'all' || evidence.importance === filterImportance;
    
    return matchesSearch && matchesType && matchesImportance;
  });

  const getEvidenceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'code': return <Code className="w-5 h-5 text-amber-500" />;
      case 'document': return <FileText className="w-5 h-5 text-amber-500" />;
      case 'clue': return <Star className="w-5 h-5 text-amber-500" />;
      default: return <FileText className="w-5 h-5 text-amber-500" />;
    }
  };

  const getImportanceColor = (importance: Evidence['importance']) => {
    switch (importance) {
      case 'low': return 'bg-slate-600/50 text-slate-300 border-slate-500';
      case 'medium': return 'bg-blue-500/20 text-blue-300 border-blue-500';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500';
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500';
      default: return 'bg-slate-600/50 text-slate-300 border-slate-500';
    }
  };

  const getImportanceIcon = (importance: Evidence['importance']) => {
    switch (importance) {
      case 'low': return <Clock className="w-4 h-4" />;
      case 'medium': return <Bookmark className="w-4 h-4" />;
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'critical': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-amber-500/20 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-amber-500" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-amber-500">Evidence Collection</h1>
                  <p className="text-sm text-slate-300">Your detective case portfolio</p>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-slate-400">
              {filteredEvidence.length} pieces of evidence
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search evidence..."
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>
            
            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 appearance-none"
              >
                <option value="all">All Types</option>
                <option value="code">Code</option>
                <option value="document">Document</option>
                <option value="clue">Clue</option>
              </select>
            </div>
            
            {/* Importance Filter */}
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={filterImportance}
                onChange={(e) => setFilterImportance(e.target.value as any)}
                className="pl-10 pr-8 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500 appearance-none"
              >
                <option value="all">All Importance</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Evidence Grid */}
        {filteredEvidence.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvidence.map((evidence) => (
              <div
                key={evidence.id}
                onClick={() => setSelectedEvidence(evidence)}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-amber-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      {getEvidenceIcon(evidence.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white line-clamp-2">{evidence.title}</h3>
                      <p className="text-xs text-slate-400">Case: {evidence.caseId}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-300 mb-4 line-clamp-3">{evidence.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold border ${getImportanceColor(evidence.importance)}`}>
                    {getImportanceIcon(evidence.importance)}
                    <span className="capitalize">{evidence.importance}</span>
                  </span>
                  <div className="text-xs text-slate-400">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {formatDate(evidence.discoveredAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Evidence Found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || filterType !== 'all' || filterImportance !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start solving cases to collect evidence and build your detective portfolio'
              }
            </p>
            {!searchTerm && filterType === 'all' && filterImportance === 'all' && (
              <button
                onClick={onBack}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Start Your First Case
              </button>
            )}
          </div>
        )}
      </div>

      {/* Evidence Detail Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  {getEvidenceIcon(selectedEvidence.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedEvidence.title}</h2>
                  <p className="text-sm text-slate-400">Case: {selectedEvidence.caseId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-slate-300">{selectedEvidence.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Evidence Content</h3>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap overflow-x-auto">
                    {selectedEvidence.content}
                  </pre>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold border ${getImportanceColor(selectedEvidence.importance)}`}>
                    {getImportanceIcon(selectedEvidence.importance)}
                    <span className="capitalize">{selectedEvidence.importance} Importance</span>
                  </span>
                  <span className="text-slate-400 capitalize">{selectedEvidence.type} Evidence</span>
                </div>
                <div className="text-sm text-slate-400">
                  Discovered: {formatDate(selectedEvidence.discoveredAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
