import React, { useState } from 'react';
import { CodePlayground } from '../CodePlayground';

interface LayoutsContentProps {
  copyToClipboard: (code: string, id: string) => void;
  copiedCode: string | null;
}

export const LayoutsContent: React.FC<LayoutsContentProps> = ({ copyToClipboard, copiedCode }) => {
  const [activeExample, setActiveExample] = useState('flexbox-basics');

  const examples = {
    'flexbox-basics': {
      title: 'Flexbox Basics',
      html: `<div class="flex-container">
    <div class="flex-item">Evidence 1</div>
    <div class="flex-item">Evidence 2</div>
    <div class="flex-item">Evidence 3</div>
</div>

<div class="flex-container centered">
    <div class="flex-item">Centered</div>
    <div class="flex-item">Content</div>
</div>

<div class="flex-container space-between">
    <div class="flex-item">Left</div>
    <div class="flex-item">Right</div>
</div>`,
      css: `.flex-container {
    display: flex;
    background-color: #f7fafc;
    border: 2px dashed #cbd5e0;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
}

.flex-item {
    background-color: #4299e1;
    color: white;
    padding: 15px 20px;
    margin: 5px;
    border-radius: 6px;
    font-weight: 600;
    text-align: center;
    min-width: 100px;
}

.centered {
    justify-content: center;
    align-items: center;
    min-height: 100px;
}

.space-between {
    justify-content: space-between;
    align-items: center;
}`
    },
    'grid-layout': {
      title: 'CSS Grid Layout',
      html: `<div class="grid-container">
    <header class="grid-header">Detective Dashboard</header>
    <nav class="grid-nav">
        <div>Cases</div>
        <div>Evidence</div>
        <div>Reports</div>
    </nav>
    <main class="grid-main">
        <h2>Active Investigation</h2>
        <p>Current case details and progress...</p>
    </main>
    <aside class="grid-sidebar">
        <h3>Quick Links</h3>
        <ul>
            <li>Recent Cases</li>
            <li>Team Members</li>
            <li>Resources</li>
        </ul>
    </aside>
    <footer class="grid-footer">© 2024 Detective Agency</footer>
</div>`,
      css: `.grid-container {
    display: grid;
    grid-template-areas:
        "header header"
        "nav nav"
        "main sidebar"
        "footer footer";
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto auto 1fr auto;
    gap: 20px;
    min-height: 500px;
    background-color: #f7fafc;
    padding: 20px;
    border-radius: 12px;
}

.grid-header {
    grid-area: header;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    text-align: center;
    border-radius: 8px;
    font-size: 24px;
    font-weight: bold;
}

.grid-nav {
    grid-area: nav;
    background-color: #e2e8f0;
    padding: 15px;
    border-radius: 8px;
    display: flex;
    gap: 10px;
    justify-content: center;
}

.grid-nav div {
    background-color: #4299e1;
    color: white;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.grid-nav div:hover {
    background-color: #3182ce;
}

.grid-main {
    grid-area: main;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.grid-sidebar {
    grid-area: sidebar;
    background-color: #edf2f7;
    padding: 20px;
    border-radius: 8px;
}

.grid-sidebar ul {
    list-style: none;
    padding: 0;
}

.grid-sidebar li {
    padding: 8px 0;
    border-bottom: 1px solid #cbd5e0;
}

.grid-footer {
    grid-area: footer;
    background-color: #2d3748;
    color: white;
    padding: 15px;
    text-align: center;
    border-radius: 8px;
}`
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">📐 Layouts & Positioning</h2>
        <p className="text-slate-200 text-lg mb-4">
          Master modern layout techniques with Flexbox and CSS Grid to create responsive, professional designs.
        </p>
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-400/40 rounded-lg p-4 border-l-4 border-green-500">
          <h4 className="font-semibold text-emerald-200 mb-2">Layout Mastery Includes:</h4>
          <ul className="text-emerald-100 space-y-1">
            <li>• Flexbox fundamentals for one-dimensional layouts</li>
            <li>• CSS Grid for complex two-dimensional layouts</li>
            <li>• When to use each layout method for optimal results</li>
            <li>• Real-world layout patterns and component design</li>
          </ul>
        </div>
      </div>

      {/* Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-200 mb-3">🔄 Flexbox</h3>
          <p className="text-blue-100 text-sm">
            Perfect for one-dimensional layouts. Great for navigation bars, centering content, and distributing space between items.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-emerald-200 mb-3">🏗️ CSS Grid</h3>
          <p className="text-emerald-100 text-sm">
            Ideal for two-dimensional layouts. Create complex page layouts with rows and columns easily.
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

        {/* Detailed Explanation for Active Example */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-emerald-200 mb-3">
            🔍 Understanding: {examples[activeExample as keyof typeof examples].title}
          </h4>
          {activeExample === 'flexbox-basics' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🔧 Flexbox Core Concepts</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">display: flex</code> - Creates a flex container, making direct children flex items</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">justify-content</code> - Controls alignment along main axis (horizontal by default)</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">align-items</code> - Controls alignment along cross axis (vertical by default)</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">flex-direction</code> - Sets main axis direction (row, column, row-reverse, column-reverse)</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Common Flexbox Patterns</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Center Everything:</strong> justify-content: center + align-items: center</li>
                  <li><strong>Space Between:</strong> justify-content: space-between for equal spacing</li>
                  <li><strong>Responsive Columns:</strong> flex: 1 to make items grow equally</li>
                  <li><strong>Card Layouts:</strong> Perfect for horizontal or vertical card arrangements</li>
                </ul>
              </div>
            </div>
          )}
          {activeExample === 'css-grid-layout' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🗂️ CSS Grid Power Features</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">grid-template-areas</code> - Visual layout definition using named areas</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">grid-template-columns: 2fr 1fr</code> - Fractional units for proportional sizing</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">auto</code> - Automatic sizing based on content</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">gap</code> - Spacing between grid items without affecting outer margins</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🏗️ Grid vs Flexbox</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h6 className="font-medium text-green-700 dark:text-green-300">Use Grid For:</h6>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                      <li>• 2D layouts (rows AND columns)</li>
                      <li>• Page-level structure</li>
                      <li>• Complex overlapping layouts</li>
                      <li>• When you know the layout structure</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-blue-700 dark:text-blue-300">Use Flexbox For:</h6>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                      <li>• 1D layouts (either rows OR columns)</li>
                      <li>• Component-level layouts</li>
                      <li>• Dynamic content sizing</li>
                      <li>• When content determines layout</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Layout Properties Reference */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📚 Layout Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Flexbox Properties</h4>
            <div className="space-y-2">
              {[
                { property: 'display: flex', desc: 'Creates flex container' },
                { property: 'justify-content', desc: 'Horizontal alignment' },
                { property: 'align-items', desc: 'Vertical alignment' },
                { property: 'flex-direction', desc: 'Row or column layout' },
                { property: 'flex-wrap', desc: 'Allow items to wrap' },
                { property: 'gap', desc: 'Space between items' }
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
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Grid Properties</h4>
            <div className="space-y-2">
              {[
                { property: 'display: grid', desc: 'Creates grid container' },
                { property: 'grid-template-columns', desc: 'Define column sizes' },
                { property: 'grid-template-rows', desc: 'Define row sizes' },
                { property: 'grid-template-areas', desc: 'Named grid areas' },
                { property: 'grid-gap', desc: 'Space between grid items' },
                { property: 'grid-area', desc: 'Assign item to area' }
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
