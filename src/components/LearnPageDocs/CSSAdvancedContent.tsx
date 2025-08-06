import React, { useState } from 'react';
import { CodePlayground } from '../CodePlayground';

interface CSSAdvancedContentProps {
  copyToClipboard: (code: string, id: string) => void;
  copiedCode: string | null;
}

export const CSSAdvancedContent: React.FC<CSSAdvancedContentProps> = ({ copyToClipboard, copiedCode }) => {
  const [activeExample, setActiveExample] = useState('css-variables');

  const examples = {
    'css-variables': {
      title: 'CSS Custom Properties (Variables)',
      html: `<div class="detective-agency">
    <header class="agency-header">
        <h1 class="agency-title">Elite Detective Agency</h1>
        <p>Solving mysteries with style</p>
    </header>
    
    <div class="services">
        <div class="service-card primary">
            <h3>Criminal Investigation</h3>
            <p>Professional crime scene analysis</p>
        </div>
        <div class="service-card secondary">
            <h3>Missing Persons</h3>
            <p>Finding people who vanish</p>
        </div>
        <div class="service-card accent">
            <h3>Corporate Security</h3>
            <p>Protecting business interests</p>
        </div>
    </div>
    
    <button class="theme-toggle" onclick="document.documentElement.classList.toggle('dark-theme')">
        🌙 Toggle Dark Mode
    </button>
</div>`,
      css: `:root {
    /* Light theme variables */
    --primary-color: #3b82f6;
    --secondary-color: #6b7280;
    --accent-color: #f59e0b;
    --background-color: #ffffff;
    --text-color: #1f2937;
    --card-background: #f9fafb;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --border-radius: 12px;
    --spacing-unit: 20px;
}

.dark-theme {
    /* Dark theme variables - same names, different values */
    --primary-color: #60a5fa;
    --secondary-color: #9ca3af;
    --accent-color: #fbbf24;
    --background-color: #1f2937;
    --text-color: #f9fafb;
    --card-background: #374151;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.detective-agency {
    background-color: var(--background-color);
    color: var(--text-color);
    padding: var(--spacing-unit);
    border-radius: var(--border-radius);
    transition: all 0.3s ease;
    min-height: 400px;
}

.agency-header {
    text-align: center;
    margin-bottom: calc(var(--spacing-unit) * 2);
}

.agency-header h1 {
    color: var(--primary-color);
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.services {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-unit);
    margin-bottom: calc(var(--spacing-unit) * 2);
}

.service-card {
    background: var(--card-background);
    padding: var(--spacing-unit);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    transition: transform 0.3s ease;
}

.service-card:hover {
    transform: translateY(-5px);
}

.service-card.primary {
    border-left: 4px solid var(--primary-color);
}

.service-card.secondary {
    border-left: 4px solid var(--secondary-color);
}

.service-card.accent {
    border-left: 4px solid var(--accent-color);
}

.theme-toggle {
    background: var(--primary-color);
    color: var(--background-color);
    border: none;
    padding: 12px 24px;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: block;
    margin: 0 auto;
}

.theme-toggle:hover {
    transform: scale(1.05);
}`
    },
    'flexbox-advanced': {
      title: 'Advanced Flexbox Techniques',
      html: `<div class="investigation-dashboard">
    <header class="dashboard-header">
        <h2>🔍 Investigation Dashboard</h2>
    </header>
    
    <div class="dashboard-content">
        <aside class="sidebar">
            <h3>Quick Actions</h3>
            <nav class="sidebar-nav">
                <a href="#" class="nav-item">New Case</a>
                <a href="#" class="nav-item">Evidence Log</a>
                <a href="#" class="nav-item">Team Chat</a>
                <a href="#" class="nav-item">Reports</a>
            </nav>
        </aside>
        
        <main class="main-content">
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Active Cases</h4>
                    <span class="stat-number">12</span>
                </div>
                <div class="stat-card">
                    <h4>Solved Today</h4>
                    <span class="stat-number">3</span>
                </div>
                <div class="stat-card">
                    <h4>Team Members</h4>
                    <span class="stat-number">8</span>
                </div>
            </div>
            
            <div class="recent-activity">
                <h3>Recent Activity</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon">🔍</div>
                        <div class="activity-content">
                            <h4>Case #2024-001 Updated</h4>
                            <p>New evidence added to the missing person case</p>
                        </div>
                        <div class="activity-time">2 min ago</div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">✅</div>
                        <div class="activity-content">
                            <h4>Case #2024-007 Solved</h4>
                            <p>The mystery of the missing cookies</p>
                        </div>
                        <div class="activity-time">1 hour ago</div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>`,
      css: `.investigation-dashboard {
    background: linear-gradient(135deg, #f6f8fc 0%, #e9ecef 100%);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    max-width: 1000px;
    margin: 20px auto;
}

.dashboard-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px;
    text-align: center;
}

.dashboard-content {
    display: flex;
    min-height: 500px;
}

.sidebar {
    flex: 0 0 250px; /* Don't grow, don't shrink, fixed width */
    background: #2d3748;
    color: white;
    padding: 25px;
}

.sidebar h3 {
    margin-bottom: 20px;
    color: #e2e8f0;
    font-size: 16px;
}

.sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.nav-item {
    color: #cbd5e0;
    text-decoration: none;
    padding: 12px 15px;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-weight: 500;
}

.nav-item:hover {
    background: #4a5568;
    color: white;
    transform: translateX(5px);
}

.main-content {
    flex: 1; /* Take up remaining space */
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.stats-grid {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.stat-card {
    flex: 1;
    min-width: 150px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-3px);
}

.stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
    color: #3b82f6;
    margin-top: 10px;
}

.recent-activity {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 15px;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8fafc;
    border-radius: 8px;
    transition: background 0.3s ease;
}

.activity-item:hover {
    background: #e2e8f0;
}

.activity-icon {
    flex: 0 0 40px;
    height: 40px;
    background: #3b82f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.activity-content {
    flex: 1; /* Take remaining space */
}

.activity-content h4 {
    margin: 0 0 5px 0;
    color: #1f2937;
    font-size: 14px;
}

.activity-content p {
    margin: 0;
    color: #6b7280;
    font-size: 13px;
}

.activity-time {
    flex: 0 0 auto;
    color: #9ca3af;
    font-size: 12px;
    font-weight: 500;
}`
    },
    'grid-advanced': {
      title: 'CSS Grid Advanced Layouts',
      html: `<div class="evidence-board">
    <header class="board-header">
        <h2>🎯 Evidence Board</h2>
        <div class="case-info">Case #2024-042</div>
    </header>
    
    <aside class="suspect-list">
        <h3>Suspects</h3>
        <div class="suspect">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-size='12' text-anchor='middle' dy='.3em' fill='%23374151'%3E👤%3C/text%3E%3C/svg%3E" alt="Suspect 1">
            <span>John Doe</span>
        </div>
        <div class="suspect">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-size='12' text-anchor='middle' dy='.3em' fill='%23374151'%3E👤%3C/text%3E%3C/svg%3E" alt="Suspect 2">
            <span>Jane Smith</span>
        </div>
    </aside>
    
    <main class="evidence-main">
        <div class="evidence-item fingerprint">
            <h4>🔍 Fingerprint</h4>
            <p>Found on weapon</p>
        </div>
        <div class="evidence-item dna">
            <h4>🧬 DNA Sample</h4>
            <p>Blood on scene</p>
        </div>
        <div class="evidence-item video">
            <h4>📹 Security Footage</h4>
            <p>3:42 AM timestamp</p>
        </div>
        <div class="evidence-item witness">
            <h4>👁️ Witness Statement</h4>
            <p>"I saw someone in a red coat"</p>
        </div>
    </main>
    
    <section class="timeline">
        <h3>Timeline</h3>
        <div class="timeline-item">3:00 AM - Break-in</div>
        <div class="timeline-item">3:15 AM - Alarm triggered</div>
        <div class="timeline-item">3:42 AM - Suspect on camera</div>
        <div class="timeline-item">4:00 AM - Police arrived</div>
    </section>
    
    <footer class="case-notes">
        <h3>Detective Notes</h3>
        <p>The evidence suggests an inside job. Need to investigate employee access logs and check alibi for 3 AM time frame.</p>
    </footer>
</div>`,
      css: `.evidence-board {
    display: grid;
    grid-template-areas:
        "header header header"
        "suspects main timeline"
        "suspects main notes";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    gap: 20px;
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background: #1f2937;
    border-radius: 16px;
    color: white;
    min-height: 600px;
}

.board-header {
    grid-area: header;
    background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    padding: 20px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.case-info {
    background: rgba(255,255,255,0.2);
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
}

.suspect-list {
    grid-area: suspects;
    background: #374151;
    padding: 20px;
    border-radius: 12px;
}

.suspect-list h3 {
    margin-bottom: 15px;
    color: #f3f4f6;
    text-align: center;
}

.suspect {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 15px;
    padding: 15px;
    background: #4b5563;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.suspect:hover {
    transform: scale(1.05);
}

.suspect img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 8px;
}

.evidence-main {
    grid-area: main;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    padding: 10px;
}

.evidence-item {
    background: #374151;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
}

.evidence-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

.fingerprint { border-left-color: #3b82f6; }
.dna { border-left-color: #ef4444; }
.video { border-left-color: #10b981; }
.witness { border-left-color: #f59e0b; }

.evidence-item h4 {
    margin-bottom: 10px;
    font-size: 16px;
}

.timeline {
    grid-area: timeline;
    background: #374151;
    padding: 20px;
    border-radius: 12px;
}

.timeline h3 {
    margin-bottom: 15px;
    color: #f3f4f6;
    text-align: center;
}

.timeline-item {
    padding: 10px 15px;
    margin-bottom: 10px;
    background: #4b5563;
    border-radius: 6px;
    font-size: 12px;
    border-left: 3px solid #10b981;
}

.case-notes {
    grid-area: notes;
    background: #374151;
    padding: 20px;
    border-radius: 12px;
}

.case-notes h3 {
    margin-bottom: 15px;
    color: #f3f4f6;
}

.case-notes p {
    font-size: 14px;
    line-height: 1.6;
    color: #d1d5db;
}

/* Responsive design */
@media (max-width: 768px) {
    .evidence-board {
        grid-template-areas:
            "header"
            "main"
            "suspects"
            "timeline"
            "notes";
        grid-template-columns: 1fr;
        grid-template-rows: auto;
    }
}`
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">🚀 Advanced CSS Techniques</h2>
        <p className="text-slate-200 text-lg">
          Master CSS variables, advanced layouts, and modern techniques for scalable, maintainable stylesheets.
        </p>
      </div>

      {/* Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-sm border border-indigo-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-indigo-200 mb-3">🎨 CSS Variables</h3>
          <p className="text-indigo-100 text-sm">
            Create reusable values and enable dynamic theming with CSS custom properties.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-200 mb-3">🔧 Advanced Flexbox</h3>
          <p className="text-purple-100 text-sm">
            Master complex layouts with advanced flexbox techniques and responsive design patterns.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm border border-pink-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-pink-200 mb-3">🎯 CSS Grid Mastery</h3>
          <p className="text-pink-100 text-sm">
            Create complex, responsive layouts with CSS Grid's powerful 2D layout system.
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
        <div className="mt-6 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-sm border border-indigo-400/40 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-indigo-200 mb-3">
            🔍 Understanding This Example
          </h4>
          {activeExample === 'css-variables' && (
            <div className="text-indigo-100 space-y-3">
              <p><strong>:root</strong> - Defines global CSS variables accessible throughout the document</p>
              <p><strong>--variable-name</strong> - CSS custom properties start with double dashes</p>
              <p><strong>var(--variable-name)</strong> - Function to use CSS variables in properties</p>
              <p><strong>calc()</strong> - Perform mathematical calculations (e.g., calc(var(--spacing) * 2))</p>
              <p><strong>Theme switching</strong> - Change variable values to instantly update entire design</p>
              <p><strong>Fallback values</strong> - var(--color, #fallback) provides backup if variable undefined</p>
              <p className="mt-4 font-semibold">CSS variables make maintenance easier and enable dynamic theming!</p>
            </div>
          )}
          {activeExample === 'flexbox-advanced' && (
            <div className="text-indigo-100 space-y-3">
              <p><strong>flex: 0 0 250px</strong> - Don't grow, don't shrink, fixed 250px width</p>
              <p><strong>flex: 1</strong> - Grow to fill remaining space, shorthand for flex: 1 1 0</p>
              <p><strong>flex-direction: column</strong> - Stack items vertically instead of horizontally</p>
              <p><strong>flex-wrap: wrap</strong> - Allow items to wrap to new lines when needed</p>
              <p><strong>align-items: center</strong> - Center items on the cross axis</p>
              <p><strong>justify-content: space-between</strong> - Distribute space evenly between items</p>
              <p><strong>gap</strong> - Modern property for spacing between flex items</p>
              <p className="mt-4 font-semibold">Advanced flexbox enables complex, responsive layouts!</p>
            </div>
          )}
          {activeExample === 'grid-advanced' && (
            <div className="text-indigo-100 space-y-3">
              <p><strong>grid-template-areas</strong> - Define named grid areas for intuitive layouts</p>
              <p><strong>grid-template-columns</strong> - Define column sizes (200px 1fr 200px = fixed, flexible, fixed)</p>
              <p><strong>grid-template-rows</strong> - Define row sizes (auto = content height, 1fr = remaining space)</p>
              <p><strong>grid-area: name</strong> - Assign elements to named grid areas</p>
              <p><strong>repeat(auto-fit, minmax(200px, 1fr))</strong> - Responsive columns that adapt to screen size</p>
              <p><strong>gap</strong> - Space between grid items (replaces grid-gap)</p>
              <p><strong>@media queries</strong> - Change grid layout for different screen sizes</p>
              <p className="mt-4 font-semibold">CSS Grid excels at complex 2D layouts and responsive design!</p>
            </div>
          )}
        </div>
      </div>

      {/* Advanced CSS Reference */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🛠️ Advanced CSS Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">CSS Variables & Functions</h4>
            <div className="space-y-2">
              {[
                { property: ':root', desc: 'Define global variables' },
                { property: 'var(--name)', desc: 'Use CSS variables' },
                { property: 'calc()', desc: 'Mathematical calculations' },
                { property: 'clamp()', desc: 'Responsive values with min/max' },
                { property: 'min() & max()', desc: 'Choose minimum or maximum values' },
                { property: 'attr()', desc: 'Use HTML attribute values' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono text-indigo-600 dark:text-indigo-400">
                    {item.property}
                  </code>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Modern Layout Properties</h4>
            <div className="space-y-2">
              {[
                { property: 'grid-template-areas', desc: 'Named grid layouts' },
                { property: 'aspect-ratio', desc: 'Maintain width/height ratio' },
                { property: 'object-fit', desc: 'How images fit containers' },
                { property: 'backdrop-filter', desc: 'Blur backgrounds' },
                { property: 'scroll-behavior', desc: 'Smooth scrolling' },
                { property: 'contain', desc: 'Optimize rendering performance' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono text-purple-600 dark:text-purple-400">
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
