import React, { useState } from 'react';
import { CodePlayground } from '../CodePlayground';

interface HTMLBasicsContentProps {
  copyToClipboard: (code: string, id: string) => void;
  copiedCode: string | null;
}

export const HTMLBasicsContent: React.FC<HTMLBasicsContentProps> = ({ copyToClipboard, copiedCode }) => {
  const [activeExample, setActiveExample] = useState<keyof typeof examples>('basic-structure');

  const examples = {
    'basic-structure': {
      title: 'Basic HTML Document Structure',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detective Case File #001</title>
    <meta name="description" content="A detective's case file documenting evidence and clues">
</head>
<body>
    <h1>🔍 Detective Case File #001</h1>
    <p><strong>Case Status:</strong> Under Investigation</p>
    <p>This document contains all evidence and witness statements related to the mysterious disappearance at Code Academy.</p>
    <p><em>Last updated:</em> January 15, 2025</p>
</body>
</html>`,
      css: `body {
    font-family: 'Courier New', monospace;
    margin: 0;
    padding: 20px;
    background-color: #f4f1e8;
    line-height: 1.6;
    color: #2c2c2c;
}

h1 {
    color: #8b4513;
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #d2b48c;
    padding-bottom: 10px;
}

p {
    margin-bottom: 15px;
}

strong {
    color: #c41e3a;
}

em {
    color: #556b2f;
}`
    },
    'semantic-elements': {
      title: 'Semantic HTML Elements - Detective Website',
      html: `<header>
    <h1>🕵️ Detective Agency Website</h1>
    <nav>
        <a href="#home">Home</a>
        <a href="#cases">Cases</a>
        <a href="#evidence">Evidence</a>
        <a href="#contact">Contact</a>
    </nav>
</header>

<main>
    <article>
        <header>
            <h2>The Missing USB Drive Case</h2>
            <time datetime="2025-01-15">January 15, 2025</time>
        </header>
        
        <section>
            <h3>Case Summary</h3>
            <p>A crucial USB drive containing sensitive company data has vanished from the CEO's office.</p>
        </section>
        
        <section>
            <h3>Evidence Found</h3>
            <ul>
                <li>Fingerprints on the desk</li>
                <li>Security camera footage</li>
                <li>Access card logs</li>
            </ul>
        </section>
    </article>
    
    <aside>
        <h3>Related Cases</h3>
        <p>Similar cases involving missing data storage devices.</p>
    </aside>
</main>

<footer>
    <address>
        Detective Agency<br>
        123 Mystery Lane<br>
        Investigation City, IC 12345<br>
        <a href="mailto:detective@agency.com">detective@agency.com</a>
    </address>
</footer>`,
      css: `header {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: white;
    padding: 20px;
    text-align: center;
    margin-bottom: 20px;
}

nav a {
    color: white;
    text-decoration: none;
    margin: 0 15px;
    padding: 8px 16px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

nav a:hover {
    background-color: rgba(255,255,255,0.2);
}

main {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

article {
    flex: 2;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

aside {
    flex: 1;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #8b4513;
}

footer {
    background: #2c3e50;
    color: white;
    padding: 20px;
    text-align: center;
}

address {
    font-style: normal;
    line-height: 1.6;
}

time {
    color: #6c757d;
    font-size: 0.9em;
}`
    },
    'lists-and-links': {
      title: 'Lists and Links - Evidence Board',
      html: `<div class="evidence-board">
    <h2>🕵️ Evidence Collection</h2>
    
    <h3>Crime Scene Evidence (Unordered List)</h3>
    <ul>
        <li>Fingerprints found on the keyboard</li>
        <li>Security camera footage from 3:45 PM</li>
        <li>Witness testimony from security guard</li>
        <li>DNA sample from coffee cup</li>
        <li>Suspicious email in deleted folder</li>
    </ul>
    
    <h3>Investigation Steps (Ordered List)</h3>
    <ol>
        <li>Secure and photograph the crime scene</li>
        <li>Collect all physical evidence carefully</li>
        <li>Interview all potential witnesses</li>
        <li>Analyze digital footprints and logs</li>
        <li>Cross-reference with criminal database</li>
        <li>Compile final report with conclusions</li>
    </ol>
    
    <h3>Investigation Resources</h3>
    <p>🔬 Visit our <a href="#forensics">Forensics Laboratory</a> for detailed analysis.</p>
    <p>📊 Check the <a href="#database">Criminal Database</a> for suspect matches.</p>
    <p>📚 External resource: <a href="https://fbi.gov" target="_blank" rel="noopener">FBI Crime Analysis Guide</a></p>
    
    <h4>Nested Lists - Suspect Information</h4>
    <ul>
        <li>Primary Suspects:
            <ol>
                <li>John Doe - Had access to the office</li>
                <li>Jane Smith - Recently fired employee</li>
                <li>Bob Wilson - Security guard on duty</li>
            </ol>
        </li>
        <li>Secondary Suspects:
            <ul>
                <li>IT Staff members</li>
                <li>Cleaning crew</li>
                <li>Visitors logged that day</li>
            </ul>
        </li>
    </ul>
</div>`,
      css: `.evidence-board {
    background: linear-gradient(135deg, #fff8e1 0%, #f3e5ab 100%);
    border: 3px solid #8b4513;
    border-radius: 12px;
    padding: 30px;
    max-width: 700px;
    margin: 20px auto;
    box-shadow: 0 6px 20px rgba(139, 69, 19, 0.3);
    font-family: 'Courier New', monospace;
}

h2 {
    color: #8b4513;
    text-align: center;
    margin-bottom: 25px;
    font-size: 28px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

h3 {
    color: #5d4037;
    margin-top: 25px;
    margin-bottom: 15px;
    border-bottom: 2px solid #8b4513;
    padding-bottom: 5px;
    font-size: 18px;
}

h4 {
    color: #6d4c41;
    margin-top: 20px;
    margin-bottom: 10px;
}

ul, ol {
    margin: 15px 0;
    padding-left: 25px;
}

li {
    margin-bottom: 8px;
    line-height: 1.5;
}

a {
    color: #c41e3a;
    text-decoration: none;
    font-weight: bold;
    border-bottom: 1px dotted #c41e3a;
}

a:hover {
    color: #8b0000;
    background-color: rgba(196, 30, 58, 0.1);
    padding: 2px 4px;
    border-radius: 3px;
}

a[target="_blank"]:after {
    content: " 🔗";
    font-size: 0.8em;
}`
    },
    'headings-and-text': {
      title: 'Headings and Text Formatting',
      html: `<article class="case-report">
    <h1>🔍 Case Report: The Code Academy Mystery</h1>
    
    <h2>Executive Summary</h2>
    <p>This report details the investigation into the <strong>mysterious disappearance</strong> of student data from the Code Academy servers.</p>
    
    <h2>Timeline of Events</h2>
    <h3>Day 1: Discovery</h3>
    <p>At <time>09:30 AM</time>, the IT administrator noticed <em>unusual server activity</em>. Initial investigation revealed:</p>
    <ul>
        <li><mark>Critical files were missing</mark> from the main database</li>
        <li>No obvious signs of <strong>external intrusion</strong></li>
        <li>Security logs showed <em style="color: red;">suspicious internal access</em></li>
    </ul>
    
    <h3>Day 2: Evidence Collection</h3>
    <p>The detective team collected the following evidence:</p>
    <blockquote cite="https://evidence.db">
        "The perpetrator left clear digital fingerprints in the system logs, 
        indicating someone with <strong>administrative privileges</strong> was responsible."
        <cite>- Chief Digital Forensics Officer</cite>
    </blockquote>
    
    <h4>Technical Analysis</h4>
    <p>Code fragments found in the logs:</p>
    <pre><code>SELECT * FROM students WHERE access_level = 'admin';
DELETE FROM backup_logs WHERE date < '2025-01-01';</code></pre>
    
    <h2>Conclusion</h2>
    <p>The investigation revealed that <dfn title="An authorized user who misuses their access">insider threat</dfn> was responsible for the data breach.</p>
    
    <p><small>Report compiled by Detective <abbr title="Structured Query Language">SQL</abbr> on <time datetime="2025-01-15">January 15, 2025</time></small></p>
</article>`,
      css: `.case-report {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px;
    background: #ffffff;
    border-left: 5px solid #2563eb;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    font-family: 'Georgia', serif;
    line-height: 1.6;
}

h1 {
    color: #1e40af;
    font-size: 2.5em;
    margin-bottom: 30px;
    text-align: center;
    border-bottom: 3px double #2563eb;
    padding-bottom: 15px;
}

h2 {
    color: #1e3a8a;
    font-size: 1.8em;
    margin-top: 35px;
    margin-bottom: 15px;
    border-left: 4px solid #3b82f6;
    padding-left: 15px;
}

h3 {
    color: #1e40af;
    font-size: 1.4em;
    margin-top: 25px;
    margin-bottom: 12px;
}

h4 {
    color: #3730a3;
    font-size: 1.2em;
    margin-top: 20px;
    margin-bottom: 10px;
}

p {
    margin-bottom: 16px;
    text-align: justify;
}

strong {
    color: #dc2626;
    font-weight: 700;
}

em {
    color: #059669;
    font-style: italic;
}

mark {
    background-color: #fef3c7;
    color: #92400e;
    padding: 2px 4px;
    border-radius: 3px;
}

blockquote {
    background: #f8fafc;
    border-left: 4px solid #64748b;
    margin: 20px 0;
    padding: 15px 20px;
    font-style: italic;
    color: #475569;
}

cite {
    display: block;
    margin-top: 10px;
    font-size: 0.9em;
    color: #64748b;
    font-weight: bold;
}

code {
    background: #1e293b;
    color: #e2e8f0;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
}

pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 20px 0;
}

pre code {
    background: none;
    padding: 0;
}

dfn {
    color: #7c3aed;
    font-weight: bold;
    cursor: help;
    border-bottom: 1px dotted #7c3aed;
}

abbr {
    cursor: help;
    border-bottom: 1px dotted #6b7280;
}

small {
    color: #6b7280;
    font-size: 0.85em;
}

time {
    color: #dc2626;
    font-weight: 500;
}`
    },
    'forms': {
      title: 'Forms - Detective Registration',
      html: `<form class="detective-form" action="#" method="post">
    <fieldset>
        <legend>🕵️ Detective Registration Form</legend>
        
        <div class="form-group">
            <label for="detective-name">Full Name:</label>
            <input type="text" id="detective-name" name="name" required 
                   placeholder="Enter your full name" autocomplete="name">
        </div>
        
        <div class="form-group">
            <label for="badge-number">Badge Number:</label>
            <input type="number" id="badge-number" name="badge" 
                   min="1000" max="9999" required>
        </div>
        
        <div class="form-group">
            <label for="email">Email Address:</label>
            <input type="email" id="email" name="email" required 
                   placeholder="detective@agency.com" autocomplete="email">
        </div>
        
        <div class="form-group">
            <label for="specialization">Specialization:</label>
            <select id="specialization" name="specialty" required>
                <option value="">Choose your specialty...</option>
                <option value="cyber">Cybercrime Investigation</option>
                <option value="forensics">Digital Forensics</option>
                <option value="fraud">Financial Fraud</option>
                <option value="security">Corporate Security</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="experience">Years of Experience:</label>
            <input type="range" id="experience" name="years" 
                   min="0" max="30" value="5" oninput="updateExperience(this.value)">
            <output id="exp-display">5 years</output>
        </div>
        
        <div class="form-group">
            <label for="case-notes">Recent Case Notes:</label>
            <textarea id="case-notes" name="notes" rows="4" 
                      placeholder="Describe your most recent investigation..."></textarea>
        </div>
        
        <fieldset class="checkbox-group">
            <legend>Available for:</legend>
            <div class="checkbox-item">
                <input type="checkbox" id="emergency" name="availability" value="emergency">
                <label for="emergency">Emergency Calls</label>
            </div>
            <div class="checkbox-item">
                <input type="checkbox" id="weekend" name="availability" value="weekend">
                <label for="weekend">Weekend Cases</label>
            </div>
            <div class="checkbox-item">
                <input type="checkbox" id="travel" name="availability" value="travel">
                <label for="travel">Out-of-State Travel</label>
            </div>
        </fieldset>
        
        <div class="form-group">
            <label>Preferred Contact Method:</label>
            <div class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="contact-phone" name="contact" value="phone" checked>
                    <label for="contact-phone">Phone</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="contact-email" name="contact" value="email">
                    <label for="contact-email">Email</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="contact-secure" name="contact" value="secure">
                    <label for="contact-secure">Secure Messaging</label>
                </div>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="submit">🔍 Register Detective</button>
            <button type="reset">Clear Form</button>
        </div>
    </fieldset>
</form>

<script>
function updateExperience(value) {
    document.getElementById('exp-display').textContent = value + ' years';
}
</script>`,
      css: `.detective-form {
    max-width: 600px;
    margin: 20px auto;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 2px solid #495057;
    border-radius: 15px;
    padding: 0;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    font-family: 'Arial', sans-serif;
}

fieldset {
    border: none;
    padding: 30px;
    margin: 0;
}

legend {
    font-size: 1.5em;
    font-weight: bold;
    color: #2c3e50;
    background: #fff;
    padding: 10px 20px;
    border: 2px solid #495057;
    border-radius: 25px;
    margin-bottom: 25px;
    text-align: center;
    width: calc(100% - 60px);
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #2c3e50;
}

input[type="text"], 
input[type="email"], 
input[type="number"],
select, 
textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #ced4da;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s, box-shadow 0.3s;
    box-sizing: border-box;
}

input[type="text"]:focus, 
input[type="email"]:focus, 
input[type="number"]:focus,
select:focus, 
textarea:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

input[type="range"] {
    width: 70%;
    margin-right: 10px;
}

output {
    font-weight: bold;
    color: #007bff;
    padding: 5px 10px;
    background: #e3f2fd;
    border-radius: 15px;
    font-size: 0.9em;
}

.checkbox-group, .radio-group {
    margin-top: 10px;
}

.checkbox-group {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 15px;
    background: #fff;
}

.checkbox-group legend {
    font-size: 1em;
    width: auto;
    margin-bottom: 10px;
    padding: 5px 10px;
    border: 1px solid #dee2e6;
    border-radius: 15px;
}

.checkbox-item, .radio-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.checkbox-item input, .radio-item input {
    width: auto;
    margin-right: 8px;
    transform: scale(1.2);
}

.checkbox-item label, .radio-item label {
    margin-bottom: 0;
    cursor: pointer;
}

.form-actions {
    text-align: center;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid #dee2e6;
}

button {
    padding: 12px 25px;
    margin: 0 10px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

button[type="submit"] {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(40,167,69,0.3);
}

button[type="submit"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40,167,69,0.4);
}

button[type="reset"] {
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(108,117,125,0.3);
}

button[type="reset"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108,117,125,0.4);
}`
    }
  };

  return (
    <div className="p-6">
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🔍 HTML Fundamentals</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            HTML (HyperText Markup Language) is the foundation of every webpage. Think of it as the skeleton that gives structure to your content - just like how a detective organizes evidence in a case file.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What You'll Learn:</h4>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Essential HTML document structure and DOCTYPE declaration</li>
              <li>• Semantic HTML elements for better accessibility and SEO</li>
              <li>• Proper use of headings, paragraphs, lists, and links</li>
              <li>• Text formatting with emphasis, highlighting, and code elements</li>
              <li>• Form creation with inputs, labels, and validation attributes</li>
              <li>• Image handling with accessibility and performance best practices</li>
              <li>• Best practices for writing clean, maintainable HTML code</li>
            </ul>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">🏗️ Structure</h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              HTML uses tags to define different parts of your content. Tags are like evidence markers that tell the browser what each piece of content represents.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3">🎯 Semantics</h3>
            <p className="text-green-800 dark:text-green-200 text-sm">
              Use semantic tags like &lt;header&gt;, &lt;main&gt;, and &lt;footer&gt; to give meaning to your content. This helps both browsers and screen readers understand your page structure.
            </p>
          </div>
        </div>

        {/* Interactive Examples */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🧪 Interactive Examples</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Explore different HTML concepts with live, interactive examples. Each example includes detailed explanations to help you understand the purpose and usage of various HTML elements.
          </p>

          {/* Example Selection Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4 w-full">
            {Object.entries(examples).map(([key, example]) => (
              <button
                key={key}
                onClick={() => setActiveExample(key as keyof typeof examples)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeExample === key
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
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

        {/* HTML Elements Reference */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📚 Essential HTML Elements</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Here's a comprehensive reference of the most commonly used HTML elements in modern web development, organized by their purpose and usage.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { tag: '<!DOCTYPE html>', desc: 'Declares HTML5 document type' },
              { tag: '<html>', desc: 'Root element of HTML document' },
              { tag: '<head>', desc: 'Contains metadata about the document' },
              { tag: '<title>', desc: 'Sets the document title (shown in browser tab)' },
              { tag: '<meta>', desc: 'Provides metadata (charset, viewport, description)' },
              { tag: '<link>', desc: 'Links external resources (CSS, fonts, icons)' },
              { tag: '<body>', desc: 'Contains all visible page content' },
              { tag: '<h1> to <h6>', desc: 'Heading elements (h1 is most important)' },
              { tag: '<p>', desc: 'Paragraph text content' },
              { tag: '<a>', desc: 'Hyperlinks to other pages or sections' },
              { tag: '<img>', desc: 'Embeds images with src and alt attributes' },
              { tag: '<ul>, <ol>, <li>', desc: 'Unordered lists, ordered lists, list items' },
              { tag: '<div>', desc: 'Generic container for styling and layout' },
              { tag: '<span>', desc: 'Inline container for styling text' },
              { tag: '<strong>', desc: 'Important text (usually bold)' },
              { tag: '<em>', desc: 'Emphasized text (usually italic)' },
              { tag: '<mark>', desc: 'Highlighted text' },
              { tag: '<code>', desc: 'Inline code snippets' },
              { tag: '<form>', desc: 'Container for form elements' },
              { tag: '<input>', desc: 'Various input types' },
              { tag: '<label>', desc: 'Labels for form controls' },
              { tag: '<button>', desc: 'Clickable buttons' },
              { tag: '<select>', desc: 'Dropdown menus' },
              { tag: '<textarea>', desc: 'Multi-line text input' },
              { tag: '<figure>', desc: 'Images with captions' },
              { tag: '<figcaption>', desc: 'Caption for figures' },
              { tag: '<header>', desc: 'Page or section header' },
              { tag: '<main>', desc: 'Main content of the page' },
              { tag: '<footer>', desc: 'Page or section footer' },
              { tag: '<nav>', desc: 'Navigation links' },
              { tag: '<article>', desc: 'Standalone content' },
              { tag: '<aside>', desc: 'Supporting sidebar content' },
              { tag: '<blockquote>', desc: 'Quoted content from sources' },
              { tag: '<dl>, <dt>, <dd>', desc: 'Description lists' }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {item.tag}
                </code>
                <span className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
