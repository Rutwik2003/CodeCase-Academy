import React, { useState } from 'react';
import { CodePlayground } from '../CodePlayground';

interface CSSBasicsContentProps {
  copyToClipboard: (code: string, id: string) => void;
  copiedCode: string | null;
}

export const CSSBasicsContent: React.FC<CSSBasicsContentProps> = ({ copyToClipboard, copiedCode }) => {
  const [activeExample, setActiveExample] = useState<keyof typeof examples>('selectors-basics');

  const examples = {
    'selectors-basics': {
      title: 'CSS Selectors - Detective Case Files',
      html: `<div class="case-file">
    <header id="case-header">
        <h1>🔍 Case File Database</h1>
    </header>
    
    <div class="case-list">
        <article class="case active">
            <h2>The Missing USB Drive</h2>
            <p class="priority high">High Priority</p>
            <span class="status">Under Investigation</span>
        </article>
        
        <article class="case solved">
            <h2>The Vanishing Blogger</h2>
            <p class="priority medium">Medium Priority</p>
            <span class="status">Solved</span>
        </article>
        
        <article class="case">
            <h2>The Code Academy Mystery</h2>
            <p class="priority low">Low Priority</p>
            <span class="status">Pending</span>
        </article>
    </div>
    
    <footer>
        <p>Total Cases: <strong data-count="3">3</strong></p>
    </footer>
</div>`,
      css: `/* Element Selector - Targets all elements of a specific type */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
    margin: 0;
    padding: 20px;
}

/* ID Selector - Targets unique element with specific ID */
#case-header {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    color: white;
    text-align: center;
    padding: 20px;
    border-radius: 10px 10px 0 0;
    margin-bottom: 0;
}

/* Class Selector - Targets elements with specific class */
.case-file {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    overflow: hidden;
}

.case {
    border-bottom: 1px solid #eee;
    padding: 20px;
    transition: background-color 0.3s ease;
}

/* Pseudo-class Selector - Targets elements in specific states */
.case:hover {
    background-color: #f8f9fa;
    cursor: pointer;
}

.case:last-child {
    border-bottom: none;
}

/* Multiple Class Selector - Targets elements with multiple classes */
.case.active {
    border-left: 5px solid #e74c3c;
    background-color: #fdf2f2;
}

.case.solved {
    border-left: 5px solid #27ae60;
    background-color: #f0fff4;
    opacity: 0.8;
}

/* Descendant Selector - Targets elements inside other elements */
.case h2 {
    color: #2c3e50;
    margin: 0 0 10px 0;
    font-size: 1.4em;
}

.case p {
    margin: 5px 0;
    font-size: 0.9em;
}

/* Attribute Selector - Targets elements with specific attributes */
.priority[class*="high"] {
    color: #e74c3c;
    font-weight: bold;
}

.priority[class*="medium"] {
    color: #f39c12;
    font-weight: bold;
}

.priority[class*="low"] {
    color: #27ae60;
    font-weight: bold;
}

/* Child Selector - Direct children only */
.case-list > .case {
    position: relative;
}

/* Pseudo-element Selector - Creates virtual elements */
.status::before {
    content: "📋 ";
    margin-right: 5px;
}

/* Universal Selector - Targets all elements */
* {
    box-sizing: border-box;
}

footer {
    background-color: #34495e;
    color: white;
    text-align: center;
    padding: 15px;
}

/* Attribute Selector for data attributes */
[data-count] {
    color: #3498db;
    font-size: 1.2em;
}`
    },
    'box-model': {
      title: 'CSS Box Model - Evidence Container',
      html: `<div class="evidence-container">
    <div class="evidence-item fingerprint">
        <h3>🔍 Fingerprint Analysis</h3>
        <p>Match found in database - 98% certainty</p>
        <div class="evidence-details">
            <span class="collected">Collected: Jan 15, 2025</span>
            <span class="status">Status: Analyzed</span>
        </div>
    </div>
    
    <div class="evidence-item dna">
        <h3>🧬 DNA Sample</h3>
        <p>Hair follicle found at scene</p>
        <div class="evidence-details">
            <span class="collected">Collected: Jan 16, 2025</span>
            <span class="status">Status: Processing</span>
        </div>
    </div>
    
    <div class="evidence-item digital">
        <h3>💻 Digital Evidence</h3>
        <p>Deleted files recovered from suspect's computer</p>
        <div class="evidence-details">
            <span class="collected">Collected: Jan 17, 2025</span>
            <span class="status">Status: Under Review</span>
        </div>
    </div>
</div>`,
      css: `/* CSS Box Model Components:
   Content → Padding → Border → Margin */

.evidence-container {
    max-width: 900px;
    margin: 20px auto; /* Outer spacing */
    padding: 0; /* No internal spacing for container */
    background-color: #f8f9fa;
    border-radius: 15px;
}

.evidence-item {
    /* Content: The actual content area */
    width: 280px;
    height: auto;
    
    /* Padding: Space between content and border */
    padding: 25px 20px; /* top/bottom: 25px, left/right: 20px */
    
    /* Border: The border around the padding */
    border: 3px solid transparent;
    border-radius: 12px;
    
    /* Margin: Space outside the border */
    margin: 15px; /* Space between evidence items */
    
    /* Other styling */
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    display: inline-block;
    vertical-align: top;
}

/* Different border colors for different evidence types */
.evidence-item.fingerprint {
    border-color: #e74c3c; /* Red border for fingerprints */
}

.evidence-item.dna {
    border-color: #3498db; /* Blue border for DNA */
}

.evidence-item.digital {
    border-color: #2ecc71; /* Green border for digital evidence */
}

/* Box model changes on hover */
.evidence-item:hover {
    /* Increase border width */
    border-width: 5px;
    
    /* Adjust margin to compensate for border increase */
    margin: 13px; /* Reduced to maintain layout */
    
    /* Transform to show interaction */
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.evidence-item h3 {
    margin: 0 0 15px 0; /* Remove default margins, add bottom spacing */
    color: #2c3e50;
    font-size: 1.3em;
    padding-bottom: 8px; /* Internal spacing */
    border-bottom: 2px solid #ecf0f1; /* Separator line */
}

.evidence-item p {
    margin: 0 0 20px 0; /* Bottom margin for separation */
    padding: 0; /* No internal padding needed */
    color: #555;
    line-height: 1.5;
}

.evidence-details {
    /* Using flexbox changes how box model applies */
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    /* Padding for internal spacing */
    padding: 12px 15px;
    
    /* Border for visual separation */
    border: 1px solid #e9ecef;
    border-radius: 6px;
    
    /* No margin needed as it's the last element */
    margin: 0;
    
    background-color: #f8f9fa;
}

.evidence-details span {
    font-size: 0.85em;
    padding: 4px 8px; /* Internal spacing for labels */
    border-radius: 4px;
    margin: 0 2px; /* Small margin between spans */
}

.collected {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.status {
    background-color: #cce5ff;
    color: #0056b3;
    border: 1px solid #99d6ff;
}

/* Box sizing example - includes padding and border in width */
* {
    box-sizing: border-box; /* Modern best practice */
}`
    },
    'typography': {
      title: 'Typography - Detective Report',
      html: `<article class="detective-report">
    <header class="report-header">
        <h1>Detective Investigation Report</h1>
        <div class="case-meta">
            <span class="case-number">Case #2025-001</span>
            <time class="report-date">January 20, 2025</time>
        </div>
    </header>
    
    <section class="executive-summary">
        <h2>Executive Summary</h2>
        <p class="lead">This report documents the comprehensive investigation into the suspicious disappearance of classified documents from the headquarters of TechCorp Industries.</p>
    </section>
    
    <section class="findings">
        <h2>Key Findings</h2>
        <h3>Physical Evidence</h3>
        <p>Our forensic team discovered several <strong>critical pieces of evidence</strong> at the scene:</p>
        <ul>
            <li><em>Fingerprints</em> on the filing cabinet handle</li>
            <li><mark>USB drive</mark> hidden behind the desk</li>
            <li>Security badge <code>access logs</code> showing unusual activity</li>
        </ul>
        
        <h3>Digital Analysis</h3>
        <p>The IT forensics team analyzed the suspect's computer and found:</p>
        <blockquote cite="https://forensics.example.com">
            "The deleted files contained <strong>highly sensitive</strong> information that could compromise the entire operation. The perpetrator used advanced techniques to hide their tracks."
            <cite>— Chief Digital Forensics Officer</cite>
        </blockquote>
        
        <h4>Technical Details</h4>
        <p>Code fragments recovered from the system:</p>
        <pre><code>SELECT * FROM classified_docs 
WHERE access_level = 'top_secret' 
AND date_accessed > '2025-01-15';</code></pre>
    </section>
    
    <section class="conclusion">
        <h2>Conclusion</h2>
        <p>Based on the <dfn title="Evidence that directly proves a fact">direct evidence</dfn> collected, we recommend immediate action. The investigation reveals a clear pattern of <abbr title="Industrial Espionage">IE</abbr> activities.</p>
        
        <p><small>Report compiled by Detective Sarah Chen • Reviewed by Captain Mike Rodriguez</small></p>
    </section>
</article>`,
      css: `/* Modern Typography Principles */

/* Font Loading and Fallbacks */
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Open+Sans:wght@300;400;600;700&display=swap');

.detective-report {
    max-width: 800px;
    margin: 40px auto;
    padding: 40px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    
    /* Base Typography Settings */
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 16px; /* Base font size */
    line-height: 1.7; /* Optimal reading line height */
    color: #2c3e50;
}

/* Heading Hierarchy and Typography Scale */
h1 {
    font-family: 'Merriweather', Georgia, serif;
    font-size: 2.5rem; /* 40px */
    font-weight: 700;
    line-height: 1.2;
    color: #1a252f;
    margin-bottom: 1rem;
    text-align: center;
    letter-spacing: -0.02em; /* Tighter spacing for large text */
}

h2 {
    font-family: 'Merriweather', Georgia, serif;
    font-size: 1.8rem; /* 28.8px */
    font-weight: 700;
    line-height: 1.3;
    color: #2c3e50;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    border-bottom: 3px solid #3498db;
    padding-bottom: 0.5rem;
}

h3 {
    font-family: 'Open Sans', sans-serif;
    font-size: 1.4rem; /* 22.4px */
    font-weight: 600;
    line-height: 1.4;
    color: #34495e;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
}

h4 {
    font-family: 'Open Sans', sans-serif;
    font-size: 1.1rem; /* 17.6px */
    font-weight: 600;
    line-height: 1.4;
    color: #7f8c8d;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Paragraph and Text Formatting */
p {
    margin-bottom: 1.25rem;
    text-align: justify;
    hyphens: auto; /* Better text wrapping */
    word-spacing: 0.05em;
}

.lead {
    font-size: 1.2rem; /* 19.2px */
    font-weight: 400;
    color: #34495e;
    font-style: italic;
    margin-bottom: 2rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-left: 4px solid #3498db;
    border-radius: 0 8px 8px 0;
}

/* Text Emphasis and Semantic Elements */
strong {
    font-weight: 700;
    color: #c0392b;
}

em {
    font-style: italic;
    color: #27ae60;
    font-weight: 500;
}

mark {
    background: linear-gradient(120deg, #f39c12 0%, #f1c40f 100%);
    color: #2c3e50;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-weight: 500;
}

/* Code and Technical Text */
code {
    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    font-size: 0.9em;
    background: #2c3e50;
    color: #ecf0f1;
    padding: 0.2em 0.5em;
    border-radius: 4px;
    font-weight: 500;
}

pre {
    background: #2c3e50;
    color: #ecf0f1;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5rem 0;
    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    font-size: 0.85rem;
    line-height: 1.5;
}

pre code {
    background: none;
    padding: 0;
    border-radius: 0;
}

/* Lists */
ul, ol {
    margin-bottom: 1.25rem;
    padding-left: 2rem;
}

li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
}

/* Blockquotes */
blockquote {
    margin: 2rem 0;
    padding: 1.5rem 2rem;
    background: #f8f9fa;
    border-left: 5px solid #95a5a6;
    font-style: italic;
    font-size: 1.1rem;
    color: #5d6d7e;
    position: relative;
}

blockquote::before {
    content: '"';
    font-size: 4rem;
    color: #bdc3c7;
    position: absolute;
    top: -10px;
    left: 10px;
    font-family: Georgia, serif;
}

cite {
    display: block;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #7f8c8d;
    font-style: normal;
    font-weight: 600;
}

/* Semantic Elements */
dfn {
    font-weight: 600;
    color: #8e44ad;
    cursor: help;
    text-decoration: underline;
    text-decoration-style: dotted;
}

abbr[title] {
    cursor: help;
    text-decoration: underline;
    text-decoration-style: dotted;
    color: #3498db;
}

small {
    font-size: 0.85rem;
    color: #95a5a6;
    font-style: italic;
}

/* Header Styling */
.report-header {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #ecf0f1;
}

.case-meta {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: #7f8c8d;
}

.case-number, .report-date {
    background: #ecf0f1;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    margin: 0 0.5rem;
    font-weight: 500;
}

/* Responsive Typography */
@media (max-width: 768px) {
    .detective-report {
        padding: 20px;
        margin: 20px;
    }
    
    h1 { font-size: 2rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.2rem; }
    
    .lead {
        font-size: 1.1rem;
    }
    
    blockquote {
        padding: 1rem;
        margin: 1rem 0;
    }
}`
    },
    'colors-and-backgrounds': {
      title: 'Colors & Backgrounds - Evidence Lab',
      html: `<div class="evidence-lab">
    <header class="lab-header">
        <h1>🧪 Digital Forensics Laboratory</h1>
        <p class="lab-subtitle">Advanced Evidence Analysis Division</p>
    </header>
    
    <div class="analysis-stations">
        <div class="station fingerprint-station">
            <h3>🔍 Fingerprint Analysis</h3>
            <div class="progress-bar">
                <div class="progress" data-progress="85"></div>
            </div>
            <p class="status-text">Analysis: 85% Complete</p>
        </div>
        
        <div class="station dna-station">
            <h3>🧬 DNA Sequencing</h3>
            <div class="progress-bar">
                <div class="progress" data-progress="60"></div>
            </div>
            <p class="status-text">Sequencing: 60% Complete</p>
        </div>
        
        <div class="station digital-station">
            <h3>💻 Digital Recovery</h3>
            <div class="progress-bar">
                <div class="progress" data-progress="95"></div>
            </div>
            <p class="status-text">Recovery: 95% Complete</p>
        </div>
    </div>
    
    <div class="evidence-samples">
        <div class="sample high-priority">
            <span class="priority-label">HIGH</span>
            <p>Critical Evidence - Case #2025-001</p>
        </div>
        <div class="sample medium-priority">
            <span class="priority-label">MEDIUM</span>
            <p>Supporting Evidence - Case #2025-002</p>
        </div>
        <div class="sample low-priority">
            <span class="priority-label">LOW</span>
            <p>Background Check - Case #2025-003</p>
        </div>
    </div>
</div>`,
      css: `/* Modern Color Theory and CSS Color Functions */

/* CSS Custom Properties (Variables) for Color Management */
:root {
    /* Primary Color Palette */
    --primary-blue: #2563eb;
    --primary-blue-light: #3b82f6;
    --primary-blue-dark: #1d4ed8;
    
    /* Secondary Colors */
    --secondary-green: #059669;
    --secondary-red: #dc2626;
    --secondary-amber: #d97706;
    
    /* Neutral Grays */
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-800: #1f2937;
    --gray-900: #111827;
    
    /* Semantic Colors */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    
    /* Alpha Channel Colors */
    --overlay-dark: rgba(0, 0, 0, 0.7);
    --overlay-light: rgba(255, 255, 255, 0.9);
}

.evidence-lab {
    min-height: 100vh;
    background: linear-gradient(135deg, 
        var(--gray-900) 0%, 
        var(--primary-blue-dark) 50%, 
        var(--gray-800) 100%);
    
    /* CSS Background Patterns */
    background-image: 
        radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
    
    padding: 40px 20px;
    color: white;
    font-family: 'Inter', sans-serif;
}

/* Advanced Background Techniques */
.lab-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 40px;
    
    /* Multiple Background Layers */
    background: 
        linear-gradient(145deg, var(--overlay-light), var(--overlay-dark)),
        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    
    background-blend-mode: overlay;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.lab-header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    
    /* Text Shadow for Readability */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    
    /* CSS Color Functions */
    color: hsl(210, 100%, 85%); /* HSL Color Model */
}

.lab-subtitle {
    color: hsla(210, 50%, 80%, 0.8); /* HSLA with Alpha */
    font-size: 1.1rem;
    margin: 0;
}

/* CSS Grid with Color Coding */
.analysis-stations {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 40px;
}

.station {
    padding: 30px;
    border-radius: 15px;
    
    /* CSS Color Mixing and Gradients */
    background: linear-gradient(145deg, 
        color-mix(in srgb, var(--gray-100) 90%, var(--primary-blue) 10%), 
        color-mix(in srgb, var(--gray-200) 80%, var(--primary-blue) 20%));
    
    /* Modern Box Shadow with Color */
    box-shadow: 
        0 10px 25px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
    
    color: var(--gray-800);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Station-Specific Color Schemes */
.fingerprint-station {
    border-left: 5px solid var(--error);
    background: linear-gradient(145deg, #fef2f2, #fee2e2);
}

.dna-station {
    border-left: 5px solid var(--primary-blue);
    background: linear-gradient(145deg, #eff6ff, #dbeafe);
}

.digital-station {
    border-left: 5px solid var(--success);
    background: linear-gradient(145deg, #f0fdf4, #dcfce7);
}

.station:hover {
    transform: translateY(-5px);
    
    /* Filter Effects */
    filter: brightness(1.05) saturate(1.1);
}

.station h3 {
    margin: 0 0 20px 0;
    font-size: 1.3rem;
    color: var(--gray-900);
}

/* Progress Bars with CSS Custom Properties */
.progress-bar {
    width: 100%;
    height: 12px;
    background: var(--gray-200);
    border-radius: 6px;
    overflow: hidden;
    margin: 15px 0;
    position: relative;
}

.progress {
    height: 100%;
    border-radius: 6px;
    transition: width 2s ease-in-out;
    position: relative;
    
    /* Animated Gradient Background */
    background: linear-gradient(90deg, 
        var(--primary-blue) 0%, 
        var(--primary-blue-light) 50%, 
        var(--primary-blue) 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* CSS Attribute Selectors for Dynamic Width */
.progress[data-progress="85"] { width: 85%; }
.progress[data-progress="60"] { width: 60%; }
.progress[data-progress="95"] { width: 95%; }

.status-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--gray-700);
    margin: 0;
}

/* Priority System with Color Psychology */
.evidence-samples {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.sample {
    flex: 1;
    min-width: 250px;
    padding: 20px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
}

/* CSS Color Contrast and Accessibility */
.high-priority {
    background: linear-gradient(135deg, 
        color-mix(in srgb, var(--error) 10%, white), 
        color-mix(in srgb, var(--error) 5%, white));
    border: 2px solid var(--error);
    color: color-mix(in srgb, var(--error) 80%, black);
}

.medium-priority {
    background: linear-gradient(135deg, 
        color-mix(in srgb, var(--warning) 10%, white), 
        color-mix(in srgb, var(--warning) 5%, white));
    border: 2px solid var(--warning);
    color: color-mix(in srgb, var(--warning) 80%, black);
}

.low-priority {
    background: linear-gradient(135deg, 
        color-mix(in srgb, var(--success) 10%, white), 
        color-mix(in srgb, var(--success) 5%, white));
    border: 2px solid var(--success);
    color: color-mix(in srgb, var(--success) 80%, black);
}

.priority-label {
    position: absolute;
    top: -10px;
    right: 15px;
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
}

.high-priority .priority-label {
    background: var(--error);
    color: white;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.medium-priority .priority-label {
    background: var(--warning);
    color: white;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.low-priority .priority-label {
    background: var(--success);
    color: white;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

/* CSS Color Accessibility Features */
@media (prefers-color-scheme: dark) {
    .station {
        background: linear-gradient(145deg, var(--gray-800), var(--gray-700));
        color: var(--gray-100);
    }
}

@media (prefers-reduced-motion: reduce) {
    .progress {
        animation: none;
    }
    
    .station {
        transition: none;
    }
}`
    },
    'flexbox-layout': {
      title: 'Flexbox Layout - Investigation Dashboard',
      html: `<div class="investigation-dashboard">
    <header class="dashboard-header">
        <h1>🕵️ Investigation Command Center</h1>
        <div class="header-controls">
            <button class="btn btn-primary">New Case</button>
            <button class="btn btn-secondary">Export Report</button>
        </div>
    </header>
    
    <main class="dashboard-main">
        <aside class="sidebar">
            <nav class="nav-menu">
                <h3>Navigation</h3>
                <a href="#" class="nav-item active">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-text">Dashboard</span>
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">📁</span>
                    <span class="nav-text">Active Cases</span>
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">✅</span>
                    <span class="nav-text">Solved Cases</span>
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">👥</span>
                    <span class="nav-text">Team</span>
                </a>
                <a href="#" class="nav-item">
                    <span class="nav-icon">⚙️</span>
                    <span class="nav-text">Settings</span>
                </a>
            </nav>
        </aside>
        
        <section class="content-area">
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Active Cases</h4>
                    <div class="stat-number">12</div>
                    <div class="stat-change positive">+3 this week</div>
                </div>
                <div class="stat-card">
                    <h4>Solved Cases</h4>
                    <div class="stat-number">847</div>
                    <div class="stat-change positive">+15 this month</div>
                </div>
                <div class="stat-card">
                    <h4>Success Rate</h4>
                    <div class="stat-number">94%</div>
                    <div class="stat-change neutral">No change</div>
                </div>
            </div>
            
            <div class="recent-activity">
                <h3>Recent Activity</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon">🔍</div>
                        <div class="activity-content">
                            <h5>New evidence uploaded</h5>
                            <p>Case #2025-001 - Digital forensics report</p>
                            <span class="activity-time">2 hours ago</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">✅</div>
                        <div class="activity-content">
                            <h5>Case marked as solved</h5>
                            <p>Case #2024-089 - The Missing Database</p>
                            <span class="activity-time">5 hours ago</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon">👤</div>
                        <div class="activity-content">
                            <h5>New team member assigned</h5>
                            <p>Detective Martinez joined Case #2025-002</p>
                            <span class="activity-time">1 day ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>`,
      css: `/* CSS Flexbox Layout System */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.investigation-dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Flexbox Header Layout */
.dashboard-header {
    display: flex;
    justify-content: space-between; /* Space between title and controls */
    align-items: center; /* Vertical center alignment */
    
    padding: 20px 30px;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
    color: #1e293b;
    font-size: 1.8rem;
    font-weight: 700;
}

.header-controls {
    display: flex;
    gap: 15px; /* Space between buttons */
    align-items: center;
}

/* Button Flexbox Styling */
.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary {
    background: #3b82f6;
    color: white;
}

.btn-primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
}

.btn-secondary {
    background: #e2e8f0;
    color: #475569;
}

.btn-secondary:hover {
    background: #cbd5e1;
}

/* Main Layout with Flexbox */
.dashboard-main {
    display: flex;
    min-height: calc(100vh - 80px); /* Full height minus header */
}

/* Sidebar Flexbox Layout */
.sidebar {
    flex: 0 0 280px; /* Fixed width, no grow/shrink */
    background: white;
    border-right: 1px solid #e2e8f0;
    padding: 30px 0;
}

.nav-menu h3 {
    padding: 0 30px 20px;
    color: #64748b;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
}

.nav-item {
    display: flex;
    align-items: center; /* Vertical center */
    
    padding: 12px 30px;
    text-decoration: none;
    color: #64748b;
    transition: all 0.2s ease;
    position: relative;
}

.nav-item:hover {
    background: #f8fafc;
    color: #3b82f6;
}

.nav-item.active {
    background: #eff6ff;
    color: #3b82f6;
    border-right: 3px solid #3b82f6;
}

.nav-icon {
    flex: 0 0 auto; /* Don't grow or shrink */
    margin-right: 12px;
    font-size: 1.1em;
}

.nav-text {
    flex: 1; /* Take remaining space */
    font-weight: 500;
}

/* Content Area Flexbox */
.content-area {
    flex: 1; /* Take remaining space */
    padding: 30px;
    display: flex;
    flex-direction: column; /* Stack children vertically */
    gap: 30px;
}

/* Stats Grid using Flexbox */
.stats-grid {
    display: flex;
    gap: 20px;
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
}

.stat-card {
    flex: 1; /* Equal width distribution */
    min-width: 200px; /* Minimum width before wrapping */
    
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.stat-card h4 {
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 10px;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
}

.stat-change {
    font-size: 0.8rem;
    padding: 3px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.stat-change.positive {
    background: #dcfce7;
    color: #166534;
}

.stat-change.neutral {
    background: #f1f5f9;
    color: #64748b;
}

/* Recent Activity Flexbox Layout */
.recent-activity {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    flex: 1; /* Take remaining space */
}

.recent-activity h3 {
    color: #1e293b;
    margin-bottom: 20px;
    font-size: 1.2rem;
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.activity-item {
    display: flex;
    align-items: flex-start; /* Top alignment */
    gap: 15px;
    
    padding: 15px;
    border-radius: 8px;
    transition: background-color 0.2s ease;
}

.activity-item:hover {
    background: #f8fafc;
}

.activity-icon {
    flex: 0 0 auto; /* Fixed size */
    width: 40px;
    height: 40px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    background: #eff6ff;
    border-radius: 50%;
    font-size: 1.2em;
}

.activity-content {
    flex: 1; /* Take remaining space */
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.activity-content h5 {
    color: #1e293b;
    font-weight: 600;
    font-size: 0.95rem;
}

.activity-content p {
    color: #64748b;
    font-size: 0.85rem;
}

.activity-time {
    color: #94a3b8;
    font-size: 0.75rem;
    align-self: flex-start; /* Align to start of flex container */
}

/* Responsive Flexbox Design */
@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .dashboard-main {
        flex-direction: column;
    }
    
    .sidebar {
        flex: none;
        order: 2; /* Move sidebar after content on mobile */
    }
    
    .stats-grid {
        flex-direction: column;
    }
    
    .stat-card {
        min-width: auto;
    }
}

@media (max-width: 480px) {
    .activity-item {
        flex-direction: column;
        text-align: center;
    }
    
    .activity-content {
        align-items: center;
    }
}`
    }
  };

  return (
    <div className="p-6">
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🎨 CSS Fundamentals</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            CSS (Cascading Style Sheets) is the language that brings your HTML to life with colors, layouts, and visual effects. Think of it as the forensic tools that help you present evidence in the most compelling way.
          </p>
          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">What You'll Master:</h4>
            <ul className="text-purple-800 dark:text-purple-200 space-y-1">
              <li>• CSS selectors and specificity for precise targeting</li>
              <li>• Box model understanding for perfect layouts</li>
              <li>• Modern color systems and CSS custom properties</li>
              <li>• Typography principles for readability and impact</li>
              <li>• Flexbox and Grid for responsive layouts</li>
              <li>• CSS transitions and animations for user experience</li>
              <li>• Modern CSS features and best practices</li>
            </ul>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">🎯 Precision</h3>
            <p className="text-purple-800 dark:text-purple-200 text-sm">
              CSS selectors let you target specific elements with surgical precision, just like a detective focusing on key evidence.
            </p>
          </div>
          <div className="bg-pink-50 dark:bg-pink-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-3">🎨 Visual Impact</h3>
            <p className="text-pink-800 dark:text-pink-200 text-sm">
              Transform plain HTML into engaging experiences using colors, typography, and layout techniques.
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-3">📱 Responsiveness</h3>
            <p className="text-indigo-800 dark:text-indigo-200 text-sm">
              Create layouts that adapt to any screen size, ensuring your content looks perfect everywhere.
            </p>
          </div>
        </div>

        {/* Interactive Examples */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🧪 Interactive CSS Examples</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Explore advanced CSS concepts through practical detective-themed examples. Each demonstration shows modern CSS techniques with real-world applications.
          </p>

          {/* Example Selection Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4 w-full">
            {Object.entries(examples).map(([key, example]) => (
              <button
                key={key}
                onClick={() => setActiveExample(key as keyof typeof examples)}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 text-left ${
                  activeExample === key
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>

          {/* Active Example Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {examples[activeExample].title}
              </h4>
            </div>
            
            <CodePlayground
              title={examples[activeExample].title}
              html={examples[activeExample].html}
              css={examples[activeExample].css}
              copyToClipboard={copyToClipboard}
              copiedCode={copiedCode}
            />
          </div>
        </div>

        {/* CSS Properties Reference */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📚 Essential CSS Properties</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            A comprehensive reference of the most important CSS properties organized by category, following current web standards and best practices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { property: 'display', desc: 'Controls how elements are displayed (block, inline, flex, grid)' },
              { property: 'position', desc: 'Element positioning (static, relative, absolute, fixed, sticky)' },
              { property: 'flex', desc: 'Flexbox shorthand for grow, shrink, and basis' },
              { property: 'grid', desc: 'CSS Grid shorthand for template rows/columns' },
              { property: 'margin', desc: 'Outer spacing around elements' },
              { property: 'padding', desc: 'Inner spacing within elements' },
              { property: 'border', desc: 'Element borders (width, style, color)' },
              { property: 'background', desc: 'Background colors, images, and gradients' },
              { property: 'color', desc: 'Text color using various color formats' },
              { property: 'font-family', desc: 'Font selection with fallback stack' },
              { property: 'font-size', desc: 'Text size using px, rem, em, or other units' },
              { property: 'font-weight', desc: 'Text thickness (normal, bold, 100-900)' },
              { property: 'line-height', desc: 'Vertical spacing between text lines' },
              { property: 'text-align', desc: 'Horizontal text alignment' },
              { property: 'width', desc: 'Element width (px, %, vw, auto)' },
              { property: 'height', desc: 'Element height (px, vh, auto)' },
              { property: 'max-width', desc: 'Maximum element width for responsiveness' },
              { property: 'min-height', desc: 'Minimum element height' },
              { property: 'border-radius', desc: 'Rounded corners for elements' },
              { property: 'box-shadow', desc: 'Drop shadows and elevation effects' },
              { property: 'opacity', desc: 'Element transparency (0-1)' },
              { property: 'transform', desc: '2D/3D transformations (scale, rotate, translate)' },
              { property: 'transition', desc: 'Smooth property changes over time' },
              { property: 'animation', desc: 'Complex keyframe-based animations' },
              { property: 'z-index', desc: 'Stacking order of positioned elements' },
              { property: 'overflow', desc: 'Content overflow behavior' },
              { property: 'cursor', desc: 'Mouse cursor appearance' },
              { property: 'box-sizing', desc: 'Box model calculation method' },
              { property: '--custom-property', desc: 'CSS custom properties (variables)' },
              { property: 'filter', desc: 'Visual effects (blur, brightness, contrast)' },
              { property: 'backdrop-filter', desc: 'Background blur and effects' },
              { property: 'aspect-ratio', desc: 'Width-to-height ratio constraint' }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-purple-600 dark:text-purple-400 whitespace-nowrap">
                  {item.property}
                </code>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CSS Units and Values */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📏 CSS Units & Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Absolute Units</h4>
              <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                <li><code>px</code> - Pixels (most common)</li>
                <li><code>pt</code> - Points (print)</li>
                <li><code>in</code> - Inches</li>
                <li><code>cm</code> - Centimeters</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Relative Units</h4>
              <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
                <li><code>rem</code> - Root element font size</li>
                <li><code>em</code> - Parent element font size</li>
                <li><code>%</code> - Percentage of parent</li>
                <li><code>vw/vh</code> - Viewport width/height</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-6">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">Modern Units</h4>
              <ul className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
                <li><code>vmin/vmax</code> - Viewport min/max</li>
                <li><code>ch</code> - Character width</li>
                <li><code>fr</code> - Grid fraction</li>
                <li><code>clamp()</code> - Responsive values</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
