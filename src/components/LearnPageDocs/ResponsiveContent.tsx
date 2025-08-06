import React, { useState } from 'react';
import { CodePlayground } from '../CodePlayground';

interface ResponsiveContentProps {
  copyToClipboard: (code: string, id: string) => void;
  copiedCode: string | null;
}

export const ResponsiveContent: React.FC<ResponsiveContentProps> = ({ copyToClipboard, copiedCode }) => {
  const [activeExample, setActiveExample] = useState('mobile-first');

  const examples = {
    'mobile-first': {
      title: 'Mobile-First Design',
      html: `<div class="container">
    <header class="header">
        <h1>Detective Agency</h1>
        <nav class="nav">
            <a href="#cases">Cases</a>
            <a href="#team">Team</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>
    
    <main class="main-content">
        <section class="hero">
            <h2>Solving Mysteries Since 1985</h2>
            <p>Professional detective services for all your investigative needs.</p>
            <button class="cta-button">Start Investigation</button>
        </section>
        
        <section class="services">
            <div class="service-card">
                <h3>Missing Persons</h3>
                <p>Expert tracking and investigation services.</p>
            </div>
            <div class="service-card">
                <h3>Corporate Fraud</h3>
                <p>Uncovering financial irregularities.</p>
            </div>
            <div class="service-card">
                <h3>Background Checks</h3>
                <p>Comprehensive personal verification.</p>
            </div>
        </section>
    </main>
</div>`,
      css: `/* Mobile-First Approach: Start with mobile styles */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
}

.header {
    text-align: center;
    margin-bottom: 2rem;
}

.header h1 {
    color: #1e40af;
    margin-bottom: 1rem;
    font-size: 1.8rem;
}

.nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.nav a {
    color: #4b5563;
    text-decoration: none;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    text-align: center;
    transition: all 0.3s;
}

.nav a:hover {
    background-color: #1e40af;
    color: white;
}

.main-content {
    space-y: 2rem;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
}

.hero h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.cta-button {
    background-color: #fbbf24;
    color: #1f2937;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 1rem;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
}

.services {
    display: grid;
    gap: 1rem;
    margin-top: 2rem;
}

.service-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.service-card h3 {
    color: #1e40af;
    margin-bottom: 0.5rem;
}

/* Tablet Styles (768px and up) */
@media (min-width: 768px) {
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;
    }
    
    .nav {
        flex-direction: row;
        gap: 1rem;
    }
    
    .hero h2 {
        font-size: 2rem;
    }
    
    .services {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktop Styles (1024px and up) */
@media (min-width: 1024px) {
    .container {
        padding: 2rem;
    }
    
    .header h1 {
        font-size: 2.5rem;
    }
    
    .hero {
        padding: 3rem;
    }
    
    .hero h2 {
        font-size: 2.5rem;
    }
    
    .services {
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
    }
    
    .service-card {
        padding: 2rem;
    }
}`
    },
    'breakpoints': {
      title: 'CSS Breakpoints & Media Queries',
      html: `<div class="responsive-demo">
    <div class="viewport-indicator">
        <span class="mobile-only">📱 Mobile View</span>
        <span class="tablet-only">📱 Tablet View</span>
        <span class="desktop-only">🖥️ Desktop View</span>
        <span class="large-only">🖥️ Large Desktop View</span>
    </div>
    
    <div class="layout-demo">
        <div class="sidebar">
            <h3>Evidence Locker</h3>
            <ul>
                <li>Case File #001</li>
                <li>Witness Statements</li>
                <li>Photo Evidence</li>
                <li>DNA Results</li>
            </ul>
        </div>
        
        <div class="content">
            <h2>Case Investigation Dashboard</h2>
            <p>This layout adapts to different screen sizes using CSS media queries.</p>
            
            <div class="card-grid">
                <div class="card">Active Cases: 12</div>
                <div class="card">Solved: 45</div>
                <div class="card">Pending: 8</div>
                <div class="card">Team Members: 6</div>
            </div>
        </div>
    </div>
</div>`,
      css: `/* Base styles (Mobile first) */
.responsive-demo {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f8fafc;
    min-height: 100vh;
    padding: 1rem;
}

/* Viewport indicators - only show relevant one */
.viewport-indicator {
    background: #1e40af;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
    font-weight: bold;
}

.tablet-only, .desktop-only, .large-only {
    display: none;
}

.layout-demo {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.sidebar {
    background: #374151;
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    order: 2;
}

.sidebar h3 {
    margin: 0 0 1rem 0;
    color: #fbbf24;
}

.sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.sidebar li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #4b5563;
}

.content {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    order: 1;
}

.content h2 {
    color: #1e40af;
    margin: 0 0 1rem 0;
}

.card-grid {
    display: grid;
    gap: 1rem;
    margin-top: 1.5rem;
}

.card {
    background: #e0f2fe;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
    font-weight: bold;
    color: #0369a1;
    border: 2px solid #0284c7;
}

/* Tablet: 768px and up */
@media (min-width: 768px) {
    .mobile-only { display: none; }
    .tablet-only { display: inline; }
    
    .responsive-demo {
        padding: 2rem;
    }
    
    .layout-demo {
        flex-direction: row;
    }
    
    .sidebar {
        flex: 0 0 250px;
        order: 1;
    }
    
    .content {
        flex: 1;
        order: 2;
    }
    
    .card-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktop: 1024px and up */
@media (min-width: 1024px) {
    .tablet-only { display: none; }
    .desktop-only { display: inline; }
    
    .sidebar {
        flex: 0 0 300px;
    }
    
    .card-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* Large Desktop: 1440px and up */
@media (min-width: 1440px) {
    .desktop-only { display: none; }
    .large-only { display: inline; }
    
    .responsive-demo {
        max-width: 1400px;
        margin: 0 auto;
    }
}`
    },
    'fluid-typography': {
      title: 'Fluid Typography & Images',
      html: `<article class="article">
    <header class="article-header">
        <h1 class="fluid-title">The Case of the Responsive Detective</h1>
        <p class="subtitle">How modern web detectives solve crimes across all devices</p>
    </header>
    
    <div class="hero-image">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23667eea'/%3E%3Ctext x='400' y='200' text-anchor='middle' dy='.3em' fill='white' font-size='24' font-family='Arial'%3EResponsive Detective Agency%3C/text%3E%3C/svg%3E" 
             alt="Detective Agency Hero" class="responsive-image">
    </div>
    
    <div class="content-body">
        <p class="lead">In the digital age, detectives must be as adaptable as the criminals they pursue. This case study explores how responsive design principles help solve the mystery of cross-device compatibility.</p>
        
        <h2 class="section-heading">The Evidence</h2>
        <p>Our investigation revealed that websites must scale seamlessly across devices. Using fluid typography and responsive images, we can ensure our detective work looks professional on any screen size.</p>
        
        <div class="image-gallery">
            <div class="gallery-item">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f59e0b'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='.3em' fill='white' font-size='16'%3EEvidence Photo 1%3C/text%3E%3C/svg%3E" 
                     alt="Evidence 1" class="responsive-image">
                <p class="caption">Crime scene analysis</p>
            </div>
            <div class="gallery-item">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%2310b981'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='.3em' fill='white' font-size='16'%3EEvidence Photo 2%3C/text%3E%3C/svg%3E" 
                     alt="Evidence 2" class="responsive-image">
                <p class="caption">Fingerprint database</p>
            </div>
            <div class="gallery-item">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23ef4444'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='.3em' fill='white' font-size='16'%3EEvidence Photo 3%3C/text%3E%3C/svg%3E" 
                     alt="Evidence 3" class="responsive-image">
                <p class="caption">Witness interview</p>
            </div>
        </div>
        
        <h3 class="subsection-heading">The Solution</h3>
        <p>By implementing fluid typography scales and responsive image techniques, we ensure optimal readability and visual impact across all devices.</p>
    </div>
</article>`,
      css: `/* Fluid Typography using clamp() */
.article {
    max-width: 800px;
    margin: 0 auto;
    padding: clamp(1rem, 4vw, 2rem);
    font-family: Georgia, serif;
    line-height: 1.6;
    background: white;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.fluid-title {
    /* Fluid typography: min-size, preferred-size (4vw), max-size */
    font-size: clamp(1.8rem, 4vw, 3rem);
    color: #1e40af;
    margin-bottom: 0.5rem;
    font-weight: bold;
    line-height: 1.2;
}

.subtitle {
    font-size: clamp(1rem, 2.5vw, 1.3rem);
    color: #6b7280;
    margin-bottom: 2rem;
    font-style: italic;
}

.section-heading {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    color: #374151;
    margin: 2rem 0 1rem 0;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
}

.subsection-heading {
    font-size: clamp(1.2rem, 2.5vw, 1.8rem);
    color: #4b5563;
    margin: 1.5rem 0 0.75rem 0;
}

/* Responsive Images */
.responsive-image {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 0.5rem;
}

.hero-image {
    margin: 2rem 0;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Responsive Image Gallery */
.image-gallery {
    display: grid;
    gap: clamp(1rem, 3vw, 2rem);
    margin: 2rem 0;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.gallery-item {
    text-align: center;
}

.caption {
    margin-top: 0.5rem;
    font-size: clamp(0.875rem, 1.8vw, 1rem);
    color: #6b7280;
    font-style: italic;
}

/* Fluid spacing */
.content-body p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    margin-bottom: clamp(1rem, 2.5vw, 1.5rem);
    color: #374151;
}

.lead {
    font-size: clamp(1.125rem, 2.5vw, 1.375rem) !important;
    color: #1f2937 !important;
    font-weight: 500;
    border-left: 4px solid #3b82f6;
    padding-left: 1rem;
    background: #f0f9ff;
    padding: 1rem;
    border-radius: 0.5rem;
}

/* Container queries simulation for smaller components */
@media (max-width: 480px) {
    .image-gallery {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 768px) {
    .article-header {
        text-align: center;
        margin-bottom: 3rem;
    }
}

@media (min-width: 1024px) {
    .image-gallery {
        grid-template-columns: repeat(3, 1fr);
    }
}`
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">📱 Responsive Design</h2>
        <p className="text-slate-200 text-lg mb-4">
          Responsive design ensures your website looks and functions beautifully on all devices, from mobile phones to large desktop monitors.
        </p>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/40 rounded-lg p-4 border-l-4 border-purple-500">
          <h4 className="font-semibold text-purple-200 mb-2">What You'll Master:</h4>
          <ul className="text-purple-100 space-y-1">
            <li>• Mobile-first design methodology and implementation</li>
            <li>• CSS media queries and breakpoint strategies</li>
            <li>• Fluid typography and responsive image techniques</li>
            <li>• Modern responsive layout patterns and best practices</li>
          </ul>
        </div>
      </div>

      {/* Key Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-200 mb-3">📱 Mobile-First</h3>
          <p className="text-blue-100 text-sm">
            Start designing for mobile devices first, then enhance for larger screens. This ensures optimal performance and user experience.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-emerald-200 mb-3">🎯 Flexible Grids</h3>
          <p className="text-emerald-100 text-sm">
            Use fluid grid systems that adapt to any screen size, creating layouts that flow naturally across devices.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-200 mb-3">🖼️ Responsive Media</h3>
          <p className="text-purple-100 text-sm">
            Images and videos that scale appropriately, maintaining quality and performance across all devices.
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
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-200 mb-3">
            🔍 Understanding: {examples[activeExample as keyof typeof examples].title}
          </h4>
          {activeExample === 'mobile-first' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">📱 Mobile-First Strategy</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Base Styles:</strong> Start with mobile layout (single column, stacked elements)</li>
                  <li><strong>Progressive Enhancement:</strong> Add complexity as screen size increases</li>
                  <li><strong>Performance:</strong> Smaller devices load faster with minimal initial CSS</li>
                  <li><strong>User Focus:</strong> Forces you to prioritize essential content first</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Key Techniques</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">@media (min-width: 768px)</code> - Tablet styles</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">@media (min-width: 1024px)</code> - Desktop styles</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">flex-direction: column/row</code> - Layout switching</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">grid-template-columns</code> - Responsive grids</li>
                </ul>
              </div>
            </div>
          )}
          {activeExample === 'breakpoints' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">📏 Common Breakpoints</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">320px - 767px</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mobile devices</p>
                  </div>
                  <div>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">768px - 1023px</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tablets</p>
                  </div>
                  <div>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">1024px - 1439px</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Desktop</p>
                  </div>
                  <div>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">1440px+</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Large screens</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Best Practices</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Content-Based:</strong> Choose breakpoints based on content, not devices</li>
                  <li><strong>Logical Flow:</strong> Ensure layout makes sense at every screen size</li>
                  <li><strong>Touch-Friendly:</strong> Maintain adequate touch target sizes (44px minimum)</li>
                  <li><strong>Testing:</strong> Test on real devices, not just browser dev tools</li>
                </ul>
              </div>
            </div>
          )}
          {activeExample === 'fluid-typography' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">📝 Fluid Typography with clamp()</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">clamp(min, preferred, max)</code> - Modern fluid sizing</li>
                  <li><strong>min:</strong> Minimum size for small screens</li>
                  <li><strong>preferred:</strong> Viewport-based size (vw units)</li>
                  <li><strong>max:</strong> Maximum size for large screens</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🖼️ Responsive Images</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">max-width: 100%</code> - Never overflow container</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">height: auto</code> - Maintain aspect ratio</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">object-fit</code> - Control image scaling behavior</li>
                  <li><strong>Performance:</strong> Use appropriate image formats and sizes</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Design Checklist */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">✅ Responsive Design Checklist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Set viewport meta tag in HTML head',
            'Use relative units (%, em, rem, vw, vh)',
            'Implement mobile-first CSS approach',
            'Test on multiple devices and screen sizes',
            'Ensure touch targets are at least 44px',
            'Optimize images for different screen densities',
            'Use flexible grid systems (CSS Grid/Flexbox)',
            'Implement readable font sizes at all scales',
            'Consider content priority and layout flow',
            'Test with slow network connections',
            'Validate HTML and CSS for consistency',
            'Use progressive enhancement strategies'
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-green-500 text-lg">✓</span>
              <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
