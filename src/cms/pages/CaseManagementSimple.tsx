import React, { useState, useEffect } from 'react';
import { cases as importedCases } from '../../data/cases';
import { logger, LogCategory } from '../../utils/logger';

const CaseManagementSimple: React.FC = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just load from imported cases for debugging
    logger.info('🎯 DEBUGGING: importedCases length:', importedCases.length, LogCategory.CMS);
    logger.info('🎯 DEBUGGING: importedCases:', importedCases.map(c => ({ id: c.id, title: c.title })), LogCategory.CMS);
    
    setTimeout(() => {
      setCases(importedCases);
      setLoading(false);
    }, 100);
  }, []);

  if (loading) {
    return <div className="text-white p-8">Loading cases...</div>;
  }

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold text-white">
        Case Management Debug - Found {cases.length} cases
      </h1>
      
      <div className="grid gap-4">
        {cases.length === 0 ? (
          <div className="text-red-400 text-xl">
            ❌ NO CASES FOUND - Check data import
          </div>
        ) : (
          cases.map((case_, index) => (
            <div key={case_.id} className="bg-white/10 p-4 rounded-lg border border-white/20">
              <div className="flex items-center space-x-4">
                <span className="bg-purple-500 text-white px-3 py-1 rounded font-bold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-white font-bold text-lg">{case_.title}</h3>
                  <p className="text-white/60 text-sm">{case_.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      {case_.difficulty}
                    </span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {case_.cluePoints} pts
                    </span>
                    {case_.isDetectiveMission && (
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                        🔍 Detective ({case_.missions?.length || 0} missions)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white font-bold mb-2">Debug Info:</h3>
        <pre className="text-green-400 text-sm">
          {JSON.stringify(
            {
              totalCases: cases.length,
              caseIds: cases.map(c => c.id),
              caseTitles: cases.map(c => c.title),
              detectiveCases: cases.filter(c => c.isDetectiveMission).length
            }, 
            null, 
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default CaseManagementSimple;
