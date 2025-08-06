import React, { useState } from 'react';
import { CodePlayground } from '../CodePlayground';

interface AnimationsContentProps {
  copyToClipboard: (code: string, id: string) => void;
  copiedCode: string | null;
}

export const AnimationsContent: React.FC<AnimationsContentProps> = ({ copyToClipboard, copiedCode }) => {
  const [activeExample, setActiveExample] = useState('css-transitions');

  const examples = {
    'css-transitions': {
      title: 'CSS Transitions',
      html: `<div class="detective-office">
    <h2>Detective's Evidence Board</h2>
    
    <div class="evidence-container">
        <div class="evidence-card clue">
            <h3>🔍 Clue #1</h3>
            <p>Hover to reveal details</p>
            <div class="details">
                Fingerprints found at crime scene match suspect database.
            </div>
        </div>
        
        <div class="evidence-card witness">
            <h3>👤 Witness</h3>
            <p>Hover to reveal details</p>
            <div class="details">
                Witness saw suspicious figure near building at 10:30 PM.
            </div>
        </div>
        
        <div class="evidence-card timeline">
            <h3>⏰ Timeline</h3>
            <p>Hover to reveal details</p>
            <div class="details">
                Crime occurred between 10:15-10:45 PM based on security footage.
            </div>
        </div>
    </div>
    
    <button class="solve-button">
        🎯 Solve Case
    </button>
</div>`,
      css: `/* Smooth transitions for interactive elements */
.detective-office {
    background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    font-family: 'Courier New', monospace;
}

.detective-office h2 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.8rem;
    color: #fbbf24;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.evidence-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.evidence-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
    padding: 1.5rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
    /* Transition properties */
    transition: all 0.3s ease-in-out;
    transform: translateY(0);
}

.evidence-card:hover {
    transform: translateY(-10px) scale(1.05);
    background: rgba(255, 255, 255, 0.2);
    border-color: #fbbf24;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.evidence-card h3 {
    margin: 0 0 0.5rem 0;
    color: #fbbf24;
    transition: color 0.3s ease;
}

.evidence-card:hover h3 {
    color: #fff;
}

.evidence-card p {
    margin: 0;
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.evidence-card:hover p {
    opacity: 0.6;
}

.details {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    color: #fbbf24;
    padding: 1rem;
    
    /* Transform and transition for reveal effect */
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.evidence-card:hover .details {
    transform: translateY(0);
}

.solve-button {
    display: block;
    margin: 2rem auto 0;
    background: linear-gradient(45deg, #fbbf24, #f59e0b);
    color: #1e3a8a;
    border: none;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
    
    /* Transition for button states */
    transition: all 0.3s ease;
    transform: scale(1);
}

.solve-button:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(251, 191, 36, 0.5);
    background: linear-gradient(45deg, #f59e0b, #fbbf24);
}

.solve-button:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
}

/* Special effects for different evidence types */
.clue {
    border-left: 4px solid #10b981;
}

.witness {
    border-left: 4px solid #f59e0b;
}

.timeline {
    border-left: 4px solid #ef4444;
}`
    },
    'keyframe-animations': {
      title: 'CSS Keyframe Animations',
      html: `<div class="crime-scene">
    <div class="scene-header">
        <h2>🕵️ Animated Crime Scene Investigation</h2>
    </div>
    
    <div class="investigation-area">
        <div class="evidence-marker marker-1">
            <div class="pulse-ring"></div>
            <div class="evidence-icon">🔍</div>
            <span class="evidence-label">DNA Sample</span>
        </div>
        
        <div class="evidence-marker marker-2">
            <div class="pulse-ring"></div>
            <div class="evidence-icon">👟</div>
            <span class="evidence-label">Footprint</span>
        </div>
        
        <div class="evidence-marker marker-3">
            <div class="pulse-ring"></div>
            <div class="evidence-icon">🔑</div>
            <span class="evidence-label">Key Evidence</span>
        </div>
    </div>
    
    <div class="detective-status">
        <div class="typing-indicator">
            <span class="typing-text">Detective analyzing evidence</span>
            <span class="cursor">|</span>
        </div>
        
        <div class="progress-container">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <span class="progress-text">Investigation Progress</span>
        </div>
    </div>
</div>`,
      css: `/* Keyframe animations for dynamic effects */
@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.7;
    }
    100% {
        transform: scale(1.5);
        opacity: 0;
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

@keyframes progressFill {
    0% { width: 0%; }
    100% { width: 75%; }
}

@keyframes slideInLeft {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeInUp {
    0% {
        transform: translateY(20px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Main container styles */
.crime-scene {
    background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    min-height: 500px;
    position: relative;
    overflow: hidden;
}

.scene-header h2 {
    text-align: center;
    color: #fbbf24;
    margin-bottom: 2rem;
    animation: slideInLeft 1s ease-out;
}

.investigation-area {
    position: relative;
    background: rgba(30, 41, 59, 0.5);
    border: 2px dashed #64748b;
    border-radius: 1rem;
    height: 300px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 2rem;
    padding: 2rem;
}

.evidence-marker {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeInUp 1s ease-out;
}

.marker-1 { animation-delay: 0.2s; }
.marker-2 { animation-delay: 0.4s; }
.marker-3 { animation-delay: 0.6s; }

.pulse-ring {
    position: absolute;
    width: 60px;
    height: 60px;
    background: rgba(239, 68, 68, 0.3);
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.evidence-icon {
    background: #ef4444;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    z-index: 1;
    animation: float 3s ease-in-out infinite;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.evidence-label {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: #cbd5e1;
    text-align: center;
    font-weight: 500;
}

.detective-status {
    background: rgba(15, 23, 42, 0.8);
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid #334155;
}

.typing-indicator {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    animation: fadeInUp 1s ease-out 1s both;
}

.typing-text {
    color: #10b981;
    font-family: 'Courier New', monospace;
    font-weight: 500;
}

.cursor {
    color: #10b981;
    animation: blink 1s infinite;
    font-weight: bold;
    margin-left: 2px;
}

.progress-container {
    animation: fadeInUp 1s ease-out 1.5s both;
}

.progress-text {
    display: block;
    font-size: 0.875rem;
    color: #94a3b8;
    margin-bottom: 0.5rem;
}

.progress-bar {
    background: #1e293b;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #334155;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    border-radius: 4px;
    animation: progressFill 3s ease-out 2s both;
    position: relative;
}

.progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}`
    },
    'transform-effects': {
      title: 'CSS Transforms & 3D Effects',
      html: `<div class="detective-desk">
    <h2>🕵️‍♂️ Detective's Desk - 3D Investigation</h2>
    
    <div class="desk-surface">
        <div class="case-file">
            <div class="file-cover">
                <h3>Case File #247</h3>
                <p>The Missing Diamond</p>
            </div>
            <div class="file-back">
                <h4>Evidence Summary</h4>
                <ul>
                    <li>Last seen: Museum gallery</li>
                    <li>Security footage: 10:45 PM</li>
                    <li>Suspects: 3 individuals</li>
                    <li>Value: $2.5 million</li>
                </ul>
            </div>
        </div>
        
        <div class="magnifying-glass">
            <div class="lens"></div>
            <div class="handle"></div>
        </div>
        
        <div class="evidence-box">
            <div class="box-face front">Evidence</div>
            <div class="box-face back">Classified</div>
            <div class="box-face left">Secure</div>
            <div class="box-face right">Locked</div>
            <div class="box-face top">Open</div>
            <div class="box-face bottom">Bottom</div>
        </div>
        
        <div class="detective-badge">
            <div class="badge-inner">
                <span class="badge-text">DETECTIVE</span>
                <span class="badge-number">#001</span>
            </div>
        </div>
    </div>
</div>`,
      css: `/* 3D transforms and perspective effects */
.detective-desk {
    background: linear-gradient(145deg, #8b5a2b 0%, #d2b48c 100%);
    padding: 2rem;
    border-radius: 1rem;
    perspective: 1000px;
    min-height: 600px;
    font-family: 'Times New Roman', serif;
}

.detective-desk h2 {
    text-align: center;
    color: #2d1810;
    margin-bottom: 2rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.desk-surface {
    background: #8b4513;
    border-radius: 1rem;
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    box-shadow: inset 0 4px 8px rgba(0,0,0,0.3);
    position: relative;
    transform-style: preserve-3d;
}

/* Case File with flip effect */
.case-file {
    width: 200px;
    height: 250px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    margin: 0 auto;
}

.case-file:hover {
    transform: rotateY(180deg);
}

.file-cover,
.file-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.file-cover {
    background: #8b1538;
    color: #fbbf24;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.file-back {
    background: #f5f5dc;
    color: #2d1810;
    transform: rotateY(180deg);
    font-size: 0.875rem;
}

.file-back h4 {
    margin-top: 0;
    color: #8b1538;
    text-decoration: underline;
}

.file-back ul {
    list-style: none;
    padding: 0;
}

.file-back li {
    margin-bottom: 0.5rem;
    padding-left: 1rem;
    position: relative;
}

.file-back li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #8b1538;
}

/* Magnifying Glass with rotation */
.magnifying-glass {
    width: 80px;
    height: 80px;
    position: relative;
    margin: 2rem auto;
    cursor: pointer;
    transition: transform 0.5s ease;
}

.magnifying-glass:hover {
    transform: rotate(15deg) scale(1.2);
}

.lens {
    width: 60px;
    height: 60px;
    border: 4px solid #silver;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    position: relative;
}

.lens::after {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
    border-radius: 50%;
}

.handle {
    width: 4px;
    height: 30px;
    background: #8b4513;
    position: absolute;
    bottom: -25px;
    right: 5px;
    transform: rotate(45deg);
    border-radius: 2px;
}

/* 3D Evidence Box */
.evidence-box {
    width: 120px;
    height: 120px;
    position: relative;
    margin: 2rem auto;
    transform-style: preserve-3d;
    animation: rotate3d 10s linear infinite;
}

.box-face {
    position: absolute;
    width: 120px;
    height: 120px;
    background: #2d4a22;
    border: 2px solid #1a2e15;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #fbbf24;
    font-size: 0.875rem;
}

.front { transform: translateZ(60px); }
.back { transform: rotateY(180deg) translateZ(60px); }
.left { transform: rotateY(-90deg) translateZ(60px); }
.right { transform: rotateY(90deg) translateZ(60px); }
.top { transform: rotateX(90deg) translateZ(60px); }
.bottom { transform: rotateX(-90deg) translateZ(60px); }

@keyframes rotate3d {
    0% { transform: rotateX(0) rotateY(0); }
    25% { transform: rotateX(90deg) rotateY(0); }
    50% { transform: rotateX(90deg) rotateY(90deg); }
    75% { transform: rotateX(0) rotateY(90deg); }
    100% { transform: rotateX(0) rotateY(0); }
}

/* Detective Badge with depth */
.detective-badge {
    width: 100px;
    height: 100px;
    margin: 2rem auto;
    perspective: 500px;
    cursor: pointer;
}

.badge-inner {
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, #ffd700 0%, #daa520 100%);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #2d1810;
    box-shadow: 0 8px 20px rgba(0,0,0,0.4);
    transition: transform 0.5s ease;
    position: relative;
}

.badge-inner::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border: 2px solid #8b4513;
    border-radius: 50%;
}

.detective-badge:hover .badge-inner {
    transform: rotateX(360deg);
}

.badge-text {
    font-size: 0.7rem;
    letter-spacing: 1px;
}

.badge-number {
    font-size: 1.2rem;
    margin-top: 0.25rem;
}`
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">✨ CSS Animations & Effects</h2>
        <p className="text-slate-200 text-lg mb-4">
          Bring your websites to life with smooth animations, engaging transitions, and eye-catching visual effects that enhance user experience.
        </p>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-4 border-l-4 border-purple-500">
          <h4 className="font-semibold text-purple-200 mb-2">Animation Skills You'll Develop:</h4>
          <ul className="text-purple-100 space-y-1">
            <li>• CSS transitions for smooth state changes and hover effects</li>
            <li>• Keyframe animations for complex, multi-step motion graphics</li>
            <li>• 3D transforms and perspective effects for depth and dimension</li>
            <li>• Performance optimization and accessibility considerations</li>
          </ul>
        </div>
      </div>

      {/* Key Animation Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-200 mb-3">🔄 Transitions</h3>
          <p className="text-purple-100 text-sm">
            Smooth changes between states when properties change. Perfect for hover effects and interactive elements.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-200 mb-3">🎬 Keyframes</h3>
          <p className="text-blue-100 text-sm">
            Complex animations with multiple steps. Create sophisticated motion graphics and continuous animations.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-400/40 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-emerald-200 mb-3">🎯 Transforms</h3>
          <p className="text-emerald-100 text-sm">
            Move, rotate, scale, and skew elements in 2D and 3D space without affecting document flow.
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
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-purple-200 mb-3">
            🔍 Understanding: {examples[activeExample as keyof typeof examples].title}
          </h4>
          {activeExample === 'css-transitions' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">⚡ CSS Transition Properties</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">transition-property</code> - Which CSS properties to animate</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">transition-duration</code> - How long the animation takes</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">transition-timing-function</code> - Easing function (ease, linear, cubic-bezier)</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">transition-delay</code> - When to start the animation</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Best Practices</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Performance:</strong> Animate transform and opacity for best performance</li>
                  <li><strong>Duration:</strong> Keep transitions under 300ms for UI interactions</li>
                  <li><strong>Easing:</strong> Use ease-out for entrances, ease-in for exits</li>
                  <li><strong>Accessibility:</strong> Respect prefers-reduced-motion media query</li>
                </ul>
              </div>
            </div>
          )}
          {activeExample === 'keyframe-animations' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🎬 Keyframe Animation Syntax</h5>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm font-mono mb-3">
                  <div>@keyframes animationName &#123;</div>
                  <div className="ml-4">0% &#123; /* start state */ &#125;</div>
                  <div className="ml-4">50% &#123; /* middle state */ &#125;</div>
                  <div className="ml-4">100% &#123; /* end state */ &#125;</div>
                  <div>&#125;</div>
                </div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">animation-name</code> - References @keyframes rule</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">animation-duration</code> - How long one cycle takes</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">animation-iteration-count</code> - How many times to repeat (infinite for loop)</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">animation-direction</code> - Forward, reverse, or alternating</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🎪 Common Animation Patterns</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><strong>Pulse:</strong> Scale up and down to draw attention</li>
                  <li><strong>Float:</strong> Subtle vertical movement for floating effect</li>
                  <li><strong>Progress bars:</strong> Width changes to show completion</li>
                  <li><strong>Loading indicators:</strong> Continuous rotation or movement</li>
                </ul>
              </div>
            </div>
          )}
          {activeExample === 'transform-effects' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🔄 Transform Functions</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">translate(x, y)</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Move element from its position</p>
                  </div>
                  <div>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">rotate(angle)</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Rotate around center point</p>
                  </div>
                  <div>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">scale(x, y)</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Resize element proportionally</p>
                  </div>
                  <div>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">skew(x, y)</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Distort element angles</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">🎲 3D Transform Properties</h5>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">perspective</code> - Sets viewing distance for 3D effects</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">transform-style: preserve-3d</code> - Maintains 3D positioning for child elements</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">backface-visibility</code> - Controls if back of element is visible when rotated</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">rotateX(), rotateY(), rotateZ()</code> - 3D rotation on specific axes</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation Performance Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-4">⚡ Performance Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">✅ Animate These Properties</h4>
            <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
              <li>• <code>transform</code> (translate, rotate, scale)</li>
              <li>• <code>opacity</code></li>
              <li>• <code>filter</code></li>
              <li>• <code>backdrop-filter</code></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">❌ Avoid Animating These</h4>
            <ul className="space-y-1 text-sm text-orange-700 dark:text-orange-300">
              <li>• <code>width</code>, <code>height</code> (causes reflow)</li>
              <li>• <code>top</code>, <code>left</code> (use transform instead)</li>
              <li>• <code>border-width</code></li>
              <li>• <code>margin</code>, <code>padding</code></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Animation Tools and Resources */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🛠️ Animation Tools & Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Easings.net', desc: 'Visual easing function reference' },
            { name: 'Animate.css', desc: 'Ready-to-use CSS animation library' },
            { name: 'Chrome DevTools', desc: 'Animation inspector and performance profiler' },
            { name: 'CSS Animation Events', desc: 'JavaScript events for animation control' },
            { name: 'Will-change property', desc: 'Optimize performance for upcoming animations' },
            { name: 'Intersection Observer', desc: 'Trigger animations when elements enter viewport' }
          ].map((tool, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <span className="font-medium text-gray-900 dark:text-white">{tool.name}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{tool.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
