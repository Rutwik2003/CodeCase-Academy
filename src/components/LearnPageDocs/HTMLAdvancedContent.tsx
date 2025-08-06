import React, { useState } from 'react';
import { CodePlayground } from '../CodePlayground';

interface HTMLAdvancedContentProps {
  copyToClipboard: (code: string, id: string) => void;
  copiedCode: string | null;
}

export const HTMLAdvancedContent: React.FC<HTMLAdvancedContentProps> = ({ copyToClipboard, copiedCode }) => {
  const [activeExample, setActiveExample] = useState('forms');

  const examples = {
    'forms': {
      title: 'HTML Forms & Input Elements',
      html: `<form class="detective-form">
    <div class="form-section">
        <h3>🔍 Case Report Form</h3>
        
        <div class="form-group">
            <label for="case-title">Case Title:</label>
            <input type="text" id="case-title" name="caseTitle" required 
                   placeholder="Enter case title...">
        </div>
        
        <div class="form-group">
            <label for="detective">Assigned Detective:</label>
            <select id="detective" name="detective" required>
                <option value="">Select Detective</option>
                <option value="holmes">Sherlock Holmes</option>
                <option value="watson">Dr. Watson</option>
                <option value="poirot">Hercule Poirot</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="priority">Priority Level:</label>
            <div class="radio-group">
                <input type="radio" id="low" name="priority" value="low">
                <label for="low">Low</label>
                
                <input type="radio" id="medium" name="priority" value="medium" checked>
                <label for="medium">Medium</label>
                
                <input type="radio" id="high" name="priority" value="high">
                <label for="high">High</label>
            </div>
        </div>
        
        <div class="form-group">
            <label for="description">Case Description:</label>
            <textarea id="description" name="description" rows="4" 
                      placeholder="Describe the case details..."></textarea>
        </div>
        
        <div class="form-group">
            <label class="checkbox-label">
                <input type="checkbox" name="urgent" value="yes">
                <span>Mark as urgent case</span>
            </label>
        </div>
        
        <button type="submit" class="submit-btn">Submit Case Report</button>
    </div>
</form>`,
      css: `.detective-form {
    max-width: 600px;
    margin: 20px auto;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-section h3 {
    color: #1a202c;
    margin-bottom: 25px;
    font-size: 24px;
    text-align: center;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #2d3748;
}

.form-group input[type="text"],
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.radio-group {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-top: 8px;
}

.radio-group input[type="radio"] {
    margin-right: 8px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    margin-right: 12px;
    width: 18px;
    height: 18px;
}

.submit-btn {
    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    color: white;
    padding: 14px 28px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(66, 153, 225, 0.3);
}`
    },
    'tables': {
      title: 'Data Tables & Structured Information',
      html: `<div class="table-container">
    <h3>🗂️ Case Evidence Database</h3>
    
    <table class="evidence-table">
        <caption>Evidence collected for Case #2024-001</caption>
        <thead>
            <tr>
                <th scope="col">Evidence ID</th>
                <th scope="col">Type</th>
                <th scope="col">Location Found</th>
                <th scope="col">Date Collected</th>
                <th scope="col">Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>EV-001</td>
                <td>Fingerprint</td>
                <td>Kitchen Window</td>
                <td>2024-01-15</td>
                <td><span class="status-badge pending">Analyzing</span></td>
            </tr>
            <tr>
                <td>EV-002</td>
                <td>DNA Sample</td>
                <td>Front Door</td>
                <td>2024-01-15</td>
                <td><span class="status-badge completed">Processed</span></td>
            </tr>
            <tr>
                <td>EV-003</td>
                <td>Footprint Cast</td>
                <td>Garden Path</td>
                <td>2024-01-16</td>
                <td><span class="status-badge pending">Analyzing</span></td>
            </tr>
            <tr>
                <td>EV-004</td>
                <td>Security Footage</td>
                <td>Street Camera</td>
                <td>2024-01-16</td>
                <td><span class="status-badge completed">Reviewed</span></td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5">
                    <strong>Total Evidence Items: 4 | Processed: 2 | Pending: 2</strong>
                </td>
            </tr>
        </tfoot>
    </table>
</div>`,
      css: `.table-container {
    margin: 20px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table-container h3 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    margin: 0;
    font-size: 20px;
    text-align: center;
}

.evidence-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.evidence-table caption {
    padding: 15px;
    font-style: italic;
    color: #4a5568;
    background-color: #f7fafc;
}

.evidence-table th {
    background-color: #edf2f7;
    color: #2d3748;
    font-weight: 600;
    padding: 15px 12px;
    text-align: left;
    border-bottom: 2px solid #cbd5e0;
}

.evidence-table td {
    padding: 12px;
    border-bottom: 1px solid #e2e8f0;
    color: #4a5568;
}

.evidence-table tbody tr:hover {
    background-color: #f7fafc;
}

.evidence-table tfoot td {
    background-color: #edf2f7;
    font-weight: 600;
    color: #2d3748;
    text-align: center;
    padding: 15px;
    border-top: 2px solid #cbd5e0;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
}

.status-badge.pending {
    background-color: #fed7d7;
    color: #c53030;
}

.status-badge.completed {
    background-color: #c6f6d5;
    color: #22543d;
}

/* Responsive table */
@media (max-width: 768px) {
    .evidence-table {
        font-size: 12px;
    }
    
    .evidence-table th,
    .evidence-table td {
        padding: 8px 6px;
    }
}`
    },
    'semantic': {
      title: 'Semantic HTML5 Elements',
      html: `<div class="semantic-layout">
    <header class="site-header">
        <h1>🕵️ Detective Chronicles</h1>
        <nav class="main-nav">
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#cases">Cases</a></li>
                <li><a href="#team">Team</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <section class="hero-section">
            <h2>Featured Case</h2>
            <article class="featured-case">
                <header class="case-header">
                    <h3>The Mystery of the Vanishing Variables</h3>
                    <time datetime="2024-01-20">January 20, 2024</time>
                </header>
                
                <p>In this intriguing case, we investigate how JavaScript variables 
                mysteriously disappeared from a codebase, leaving developers puzzled...</p>
                
                <details class="case-details">
                    <summary>View Case Details</summary>
                    <p>The investigation revealed that the variables were not properly 
                    declared, leading to scope issues and unexpected behavior.</p>
                </details>
                
                <footer class="case-footer">
                    <address>
                        Solved by: <strong>Detective Holmes</strong><br>
                        <a href="mailto:holmes@detective-agency.com">holmes@detective-agency.com</a>
                    </address>
                </footer>
            </article>
        </section>

        <aside class="sidebar">
            <section class="recent-cases">
                <h3>Recent Cases</h3>
                <ul>
                    <li><a href="#case1">The CSS Grid Mystery</a></li>
                    <li><a href="#case2">The Flexbox Phantom</a></li>
                    <li><a href="#case3">The HTML5 Heist</a></li>
                </ul>
            </section>
            
            <section class="quick-stats">
                <h3>Detective Stats</h3>
                <dl>
                    <dt>Cases Solved:</dt>
                    <dd>247</dd>
                    
                    <dt>Success Rate:</dt>
                    <dd>98.5%</dd>
                    
                    <dt>Years Active:</dt>
                    <dd>15</dd>
                </dl>
            </section>
        </aside>
    </main>

    <footer class="site-footer">
        <p>&copy; 2024 Detective Chronicles. All rights reserved.</p>
        <small>Powered by HTML5 semantic elements</small>
    </footer>
</div>`,
      css: `.semantic-layout {
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
}

.site-header {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px 8px 0 0;
}

.site-header h1 {
    margin: 0;
    font-size: 28px;
}

.main-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 20px;
}

.main-nav a {
    color: white;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.main-nav a:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.main-content {
    display: flex;
    gap: 30px;
    padding: 30px 20px;
    background: #f7fafc;
}

.hero-section {
    flex: 2;
}

.featured-case {
    background: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.case-header {
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 15px;
    margin-bottom: 20px;
}

.case-header h3 {
    margin: 0 0 8px 0;
    color: #1a202c;
    font-size: 24px;
}

.case-header time {
    color: #718096;
    font-style: italic;
}

.case-details {
    margin: 20px 0;
    padding: 15px;
    background: #edf2f7;
    border-radius: 6px;
}

.case-details summary {
    cursor: pointer;
    font-weight: 600;
    color: #2d3748;
}

.case-footer {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #e2e8f0;
}

.case-footer address {
    font-style: normal;
    color: #4a5568;
}

.sidebar {
    flex: 1;
}

.sidebar section {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.sidebar h3 {
    margin-top: 0;
    color: #1a202c;
    border-bottom: 2px solid #4299e1;
    padding-bottom: 8px;
}

.sidebar ul {
    list-style: none;
    padding: 0;
}

.sidebar li {
    margin: 8px 0;
}

.sidebar a {
    color: #4299e1;
    text-decoration: none;
}

.sidebar a:hover {
    text-decoration: underline;
}

.quick-stats dl {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 8px 16px;
}

.quick-stats dt {
    font-weight: 600;
    color: #2d3748;
}

.quick-stats dd {
    margin: 0;
    color: #4a5568;
    font-weight: 500;
}

.site-footer {
    background: #2d3748;
    color: white;
    text-align: center;
    padding: 20px;
    border-radius: 0 0 8px 8px;
}

.site-footer small {
    display: block;
    margin-top: 10px;
    opacity: 0.7;
}

@media (max-width: 768px) {
    .site-header {
        flex-direction: column;
        gap: 15px;
    }
    
    .main-content {
        flex-direction: column;
    }
    
    .main-nav ul {
        justify-content: center;
    }
}`
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">⚡ Advanced HTML Techniques</h2>
        <p className="text-slate-200 text-lg">
          Master advanced HTML concepts including forms, tables, semantic elements, and accessibility best practices.
        </p>
      </div>

      {/* Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-200 mb-3">📝 Forms</h3>
          <p className="text-blue-100 text-sm">
            Create interactive forms with various input types, validation, and proper labeling for accessibility.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-emerald-200 mb-3">📊 Tables</h3>
          <p className="text-emerald-100 text-sm">
            Structure tabular data with proper headers, captions, and responsive design considerations.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-200 mb-3">🏷️ Semantic HTML</h3>
          <p className="text-purple-100 text-sm">
            Use meaningful HTML5 elements that convey structure and improve SEO and accessibility.
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
      </div>

      {/* Best Practices */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🎯 Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Form Accessibility</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Always use <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">&lt;label&gt;</code> elements for form controls</li>
              <li>• Use <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">required</code> attribute for validation</li>
              <li>• Provide clear error messages and instructions</li>
              <li>• Group related fields with <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">&lt;fieldset&gt;</code></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Semantic Structure</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Use <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">&lt;main&gt;</code> for primary content</li>
              <li>• Include proper heading hierarchy (h1-h6)</li>
              <li>• Use <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">&lt;article&gt;</code> for standalone content</li>
              <li>• Add <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">alt</code> text to all images</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
