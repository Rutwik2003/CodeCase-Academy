import React, { useState } from 'react';
import { CodePlayground } from '../CodePlayground';

interface GridSystemContentProps {
  copyToClipboard: (code: string, id: string) => void;
  copiedCode: string | null;
}

export const GridSystemContent: React.FC<GridSystemContentProps> = ({ copyToClipboard, copiedCode }) => {
  const [activeExample, setActiveExample] = useState('grid-basics');

  const examples = {
    'grid-basics': {
      title: 'CSS Grid Fundamentals',
      html: `<div class="case-file-grid">
    <div class="header">Case File #2024-001</div>
    <div class="photo">Crime Scene Photo</div>
    <div class="evidence">🔍 Evidence List</div>
    <div class="witness">👁️ Witness Statement</div>
    <div class="notes">📝 Detective Notes</div>
    <div class="timeline">⏰ Timeline</div>
    <div class="footer">Status: Under Investigation</div>
</div>`,
      css: `.case-file-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto 200px 200px auto;
    gap: 15px;
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
}

.header {
    grid-column: 1 / -1; /* Span from first to last column */
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 20px;
    text-align: center;
    border-radius: 8px;
    font-weight: bold;
    font-size: 18px;
}

.photo {
    grid-column: 1 / 3; /* Span 2 columns */
    background: #dbeafe;
    border: 2px solid #3b82f6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    color: #1e40af;
}

.evidence {
    background: #dcfce7;
    border: 2px solid #10b981;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #065f46;
    text-align: center;
}

.witness {
    background: #fef3c7;
    border: 2px solid #f59e0b;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #92400e;
    text-align: center;
}

.notes {
    grid-column: 2 / 4; /* Span columns 2-3 */
    background: #fce7f3;
    border: 2px solid #ec4899;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #be185d;
    text-align: center;
}

.timeline {
    background: #e0e7ff;
    border: 2px solid #6366f1;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #4338ca;
    text-align: center;
}

.footer {
    grid-column: 1 / -1; /* Span all columns */
    background: #374151;
    color: white;
    padding: 15px;
    text-align: center;
    border-radius: 8px;
    font-weight: 600;
}`
    },
    'responsive-grid': {
      title: 'Responsive Grid Layout',
      html: `<div class="detective-team">
    <h2>🕵️ Detective Team Dashboard</h2>
    <div class="team-grid">
        <div class="detective-card senior">
            <h3>👨‍💼 Senior Detective</h3>
            <p>John Watson</p>
            <span class="status active">Active</span>
        </div>
        <div class="detective-card junior">
            <h3>👩‍💼 Junior Detective</h3>
            <p>Mary Holmes</p>
            <span class="status active">Active</span>
        </div>
        <div class="detective-card specialist">
            <h3>🔬 Forensics Specialist</h3>
            <p>Dr. Sarah Chen</p>
            <span class="status busy">In Lab</span>
        </div>
        <div class="detective-card tech">
            <h3>💻 Tech Analyst</h3>
            <p>Alex Rivera</p>
            <span class="status active">Active</span>
        </div>
        <div class="detective-card consultant">
            <h3>🎓 Consultant</h3>
            <p>Prof. Williams</p>
            <span class="status off-duty">Off Duty</span>
        </div>
        <div class="detective-card intern">
            <h3>📚 Intern</h3>
            <p>Jamie Parker</p>
            <span class="status training">Training</span>
        </div>
    </div>
</div>`,
      css: `.detective-team {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
}

.detective-team h2 {
    text-align: center;
    color: #1f2937;
    margin-bottom: 30px;
    font-size: 28px;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.detective-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border-left: 5px solid #3b82f6;
    position: relative;
}

.detective-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.detective-card h3 {
    margin: 0 0 10px 0;
    color: #1f2937;
    font-size: 16px;
}

.detective-card p {
    margin: 0 0 15px 0;
    color: #6b7280;
    font-size: 18px;
    font-weight: 600;
}

.status {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status.active {
    background: #d1fae5;
    color: #065f46;
}

.status.busy {
    background: #fef3c7;
    color: #92400e;
}

.status.off-duty {
    background: #f3f4f6;
    color: #374151;
}

.status.training {
    background: #dbeafe;
    color: #1e40af;
}

/* Responsive behavior */
@media (max-width: 768px) {
    .team-grid {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .team-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1025px) {
    .team-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}`
    },
    'complex-grid': {
      title: 'Complex Grid Layout',
      html: `<div class="investigation-center">
    <header class="center-header">
        <h1>🏢 Central Investigation Hub</h1>
    </header>
    
    <nav class="main-nav">
        <a href="#dashboard">Dashboard</a>
        <a href="#cases">Active Cases</a>
        <a href="#evidence">Evidence Room</a>
        <a href="#reports">Reports</a>
    </nav>
    
    <aside class="quick-stats">
        <h3>Quick Stats</h3>
        <div class="stat">
            <span class="number">47</span>
            <span class="label">Open Cases</span>
        </div>
        <div class="stat">
            <span class="number">12</span>
            <span class="label">Solved Today</span>
        </div>
        <div class="stat">
            <span class="number">156</span>
            <span class="label">Evidence Items</span>
        </div>
    </aside>
    
    <main class="main-content">
        <div class="priority-cases">
            <h3>🚨 Priority Cases</h3>
            <div class="case-item urgent">
                <span class="case-id">#2024-089</span>
                <span class="case-title">Bank Robbery Investigation</span>
                <span class="case-priority">URGENT</span>
            </div>
            <div class="case-item high">
                <span class="case-id">#2024-087</span>
                <span class="case-title">Missing Person: Jane Doe</span>
                <span class="case-priority">HIGH</span>
            </div>
            <div class="case-item medium">
                <span class="case-id">#2024-085</span>
                <span class="case-title">Corporate Fraud Case</span>
                <span class="case-priority">MEDIUM</span>
            </div>
        </div>
    </main>
    
    <section class="recent-updates">
        <h3>📋 Recent Updates</h3>
        <div class="update">New evidence in case #2024-089</div>
        <div class="update">Witness statement uploaded</div>
        <div class="update">Lab results pending</div>
    </section>
    
    <footer class="center-footer">
        <p>Central Investigation Hub v2.0 | Last updated: Today at 3:42 PM</p>
    </footer>
</div>`,
      css: `.investigation-center {
    display: grid;
    grid-template-areas:
        "header header header header"
        "nav nav nav nav"
        "stats main main updates"
        "footer footer footer footer";
    grid-template-columns: 200px 1fr 1fr 200px;
    grid-template-rows: auto auto 1fr auto;
    gap: 20px;
    min-height: 100vh;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #f6f8fc 0%, #e9ecef 100%);
}

.center-header {
    grid-area: header;
    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
    color: white;
    padding: 25px;
    border-radius: 12px;
    text-align: center;
}

.center-header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
}

.main-nav {
    grid-area: nav;
    background: white;
    border-radius: 12px;
    padding: 15px 25px;
    display: flex;
    gap: 30px;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.main-nav a {
    color: #374151;
    text-decoration: none;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.main-nav a:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-2px);
}

.quick-stats {
    grid-area: stats;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.quick-stats h3 {
    margin: 0 0 20px 0;
    color: #1f2937;
    text-align: center;
}

.stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8fafc;
    border-radius: 8px;
}

.stat .number {
    font-size: 24px;
    font-weight: 700;
    color: #3b82f6;
}

.stat .label {
    font-size: 12px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.main-content {
    grid-area: main;
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.priority-cases h3 {
    margin: 0 0 20px 0;
    color: #1f2937;
}

.case-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 15px;
    align-items: center;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.case-item:hover {
    transform: translateX(5px);
}

.case-item.urgent {
    background: #fef2f2;
    border-left: 4px solid #dc2626;
}

.case-item.high {
    background: #fef3c7;
    border-left: 4px solid #f59e0b;
}

.case-item.medium {
    background: #f0f9ff;
    border-left: 4px solid #3b82f6;
}

.case-id {
    font-family: monospace;
    font-weight: 600;
    color: #374151;
}

.case-title {
    color: #1f2937;
    font-weight: 500;
}

.case-priority {
    font-size: 11px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.urgent .case-priority {
    background: #dc2626;
    color: white;
}

.high .case-priority {
    background: #f59e0b;
    color: white;
}

.medium .case-priority {
    background: #3b82f6;
    color: white;
}

.recent-updates {
    grid-area: updates;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.recent-updates h3 {
    margin: 0 0 20px 0;
    color: #1f2937;
    text-align: center;
}

.update {
    padding: 12px;
    margin-bottom: 10px;
    background: #f8fafc;
    border-radius: 6px;
    font-size: 14px;
    color: #374151;
    border-left: 3px solid #10b981;
}

.center-footer {
    grid-area: footer;
    background: #374151;
    color: #d1d5db;
    padding: 15px;
    border-radius: 12px;
    text-align: center;
}

.center-footer p {
    margin: 0;
    font-size: 14px;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .investigation-center {
        grid-template-areas:
            "header header"
            "nav nav"
            "main stats"
            "main updates"
            "footer footer";
        grid-template-columns: 1fr 200px;
    }
}

@media (max-width: 768px) {
    .investigation-center {
        grid-template-areas:
            "header"
            "nav"
            "stats"
            "main"
            "updates"
            "footer";
        grid-template-columns: 1fr;
    }
    
    .main-nav {
        flex-direction: column;
        gap: 10px;
    }
}`
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">🎯 CSS Grid Mastery</h2>
        <p className="text-slate-200 text-lg">
          Master CSS Grid's powerful 2D layout system to create complex, responsive designs with ease.
        </p>
      </div>

      {/* Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-200 mb-3">📐 Grid Fundamentals</h3>
          <p className="text-blue-100 text-sm">
            Learn grid containers, grid items, lines, and tracks to build structured layouts.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-emerald-200 mb-3">📱 Responsive Grids</h3>
          <p className="text-emerald-100 text-sm">
            Create adaptive layouts that automatically adjust to different screen sizes.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-200 mb-3">🎨 Complex Layouts</h3>
          <p className="text-purple-100 text-sm">
            Build sophisticated interfaces with named grid areas and advanced positioning.
          </p>
        </div>
      </div>

      {/* Interactive Examples */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold theme-text-primary mb-4">
          <span className="inline-block mr-2">🧪</span>
          Interactive Examples
        </h3>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(examples).map(([key, example]) => (
            <button
              key={key}
              onClick={() => setActiveExample(key)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeExample === key
                  ? 'bg-gradient-to-r from-amber-600/90 via-yellow-500/90 to-amber-600/90 text-black backdrop-blur-sm border border-amber-400/60 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-700/50 hover:bg-slate-600/60 text-slate-200 backdrop-blur-sm border border-slate-600/40 hover:border-slate-500/60 hover:shadow-sm'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        <CodePlayground
          title={examples[activeExample as keyof typeof examples].title}
          html={examples[activeExample as keyof typeof examples].html}
          css={examples[activeExample as keyof typeof examples].css}
          copyToClipboard={copyToClipboard}
          copiedCode={copiedCode}
        />

        {/* Detailed Explanation for Current Example */}
        <div className="mt-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/40 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-200 mb-3">
            🔍 Understanding This Example
          </h4>
          {activeExample === 'grid-basics' && (
            <div className="text-blue-100 space-y-3">
              <p><strong>display: grid</strong> - Creates a grid container</p>
              <p><strong>grid-template-columns: repeat(3, 1fr)</strong> - Creates 3 equal-width columns</p>
              <p><strong>grid-template-rows: auto 200px 200px auto</strong> - Defines row heights</p>
              <p><strong>grid-column: 1 / -1</strong> - Span from first column to last column</p>
              <p><strong>grid-column: 1 / 3</strong> - Span from column 1 to column 3 (2 columns wide)</p>
              <p><strong>gap: 15px</strong> - Space between grid items</p>
              <p className="mt-4 font-semibold">Grid lines are numbered starting from 1, and -1 refers to the last line!</p>
            </div>
          )}
          {activeExample === 'responsive-grid' && (
            <div className="text-blue-100 space-y-3">
              <p><strong>repeat(auto-fit, minmax(250px, 1fr))</strong> - Responsive columns that fit content</p>
              <p><strong>auto-fit</strong> - Columns adjust to container width</p>
              <p><strong>minmax(250px, 1fr)</strong> - Minimum 250px, maximum 1 fraction of available space</p>
              <p><strong>@media queries</strong> - Override grid for specific screen sizes</p>
              <p><strong>grid-template-columns: 1fr</strong> - Single column on mobile</p>
              <p><strong>gap: 20px</strong> - Consistent spacing between items</p>
              <p className="mt-4 font-semibold">This technique creates truly responsive layouts without media queries!</p>
            </div>
          )}
          {activeExample === 'complex-grid' && (
            <div className="text-blue-100 space-y-3">
              <p><strong>grid-template-areas</strong> - Define named regions for layout</p>
              <p><strong>grid-area: header</strong> - Assign element to named area</p>
              <p><strong>grid-template-columns: 200px 1fr 1fr 200px</strong> - Mixed fixed and flexible columns</p>
              <p><strong>grid-template-rows: auto auto 1fr auto</strong> - Header/footer auto-size, content expands</p>
              <p><strong>min-height: 100vh</strong> - Full viewport height layout</p>
              <p><strong>Responsive areas</strong> - Reorganize layout for different screens</p>
              <p className="mt-4 font-semibold">Named grid areas make complex layouts intuitive to build and maintain!</p>
            </div>
          )}
        </div>
      </div>

      {/* CSS Grid Reference */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📚 CSS Grid Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Container Properties</h4>
            <div className="space-y-2">
              {[
                { property: 'display: grid', desc: 'Creates grid container' },
                { property: 'grid-template-columns', desc: 'Define column sizes' },
                { property: 'grid-template-rows', desc: 'Define row sizes' },
                { property: 'grid-template-areas', desc: 'Named layout regions' },
                { property: 'gap', desc: 'Space between grid items' },
                { property: 'justify-items', desc: 'Align items horizontally' },
                { property: 'align-items', desc: 'Align items vertically' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono text-blue-600 dark:text-blue-400">
                    {item.property}
                  </code>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Item Properties</h4>
            <div className="space-y-2">
              {[
                { property: 'grid-column', desc: 'Column span and position' },
                { property: 'grid-row', desc: 'Row span and position' },
                { property: 'grid-area', desc: 'Assign to named area' },
                { property: 'justify-self', desc: 'Individual horizontal alignment' },
                { property: 'align-self', desc: 'Individual vertical alignment' },
                { property: 'grid-column-start', desc: 'Starting column line' },
                { property: 'grid-column-end', desc: 'Ending column line' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono text-green-600 dark:text-green-400">
                    {item.property}
                  </code>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
