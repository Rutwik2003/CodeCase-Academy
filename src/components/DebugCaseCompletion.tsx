import { useAuth } from '../contexts/AuthContext';

export default function DebugCaseCompletion() {
  const { userData } = useAuth();

  if (!userData) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'black', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Debug: Completed Cases</h4>
      <p><strong>Array Length:</strong> {userData.completedCases?.length || 0}</p>
      <p><strong>Raw Array:</strong> {JSON.stringify(userData.completedCases)}</p>
      
      {userData.completedCases?.map((caseId, index) => (
        <div key={index} style={{ marginBottom: '5px', border: '1px solid gray', padding: '3px' }}>
          <div><strong>Index {index}:</strong></div>
          <div><strong>Value:</strong> "{caseId}"</div>
          <div><strong>Length:</strong> {caseId?.length}</div>
          <div><strong>Type:</strong> {typeof caseId}</div>
          <div><strong>Equals 'case-vanishing-blogger':</strong> {caseId === 'case-vanishing-blogger' ? 'YES' : 'NO'}</div>
          <div><strong>Char codes:</strong> {caseId?.split('').map(c => c.charCodeAt(0)).join(',')}</div>
        </div>
      ))}
      
      <div style={{ marginTop: '10px', borderTop: '1px solid white', paddingTop: '5px' }}>
        <strong>Case Check:</strong>
        <div>includes('case-vanishing-blogger'): {userData.completedCases?.includes('case-vanishing-blogger') ? 'YES' : 'NO'}</div>
      </div>
    </div>
  );
}
