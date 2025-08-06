// Detective Case Specific Snippets for "The Vanishing Blogger" - ENHANCED VERSION

export interface DetectiveSnippet {
  id: string;
  title: string;
  description: string;
  type: 'html' | 'css';
  missionId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  code: string;
  explanation: string;
  tags: string[];
}

// Mission 1: Broken Blog Layout Snippets - COMPREHENSIVE COLLECTION
export const MISSION_1_SNIPPETS: DetectiveSnippet[] = [
  // CRITICAL CLUE SNIPPETS
  {
    id: 'reveal-hidden-message',
    title: '🔍 REVEAL THE HIDDEN CLUE!',
    description: 'Change display: none to display: block to reveal the critical message',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'easy',
    code: `<div class="hidden-message" style="display: block;">
  <p><strong>Check my last Insta story if you care.</strong></p>
</div>`,
    explanation: 'THE KEY CLUE! Change display: none to display: block to reveal Sam\'s hidden message about Instagram!',
    tags: ['css-display', 'clue-reveal', 'investigation', 'critical', 'instagram']
  },

  // EASY FIXES - DIRECT REPLACEMENTS
  {
    id: 'replace-center-tag',
    title: '🏗️ Replace <center> with Header',
    description: 'Convert deprecated <center> tags to semantic HTML',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'easy',
    code: `<header>
  <h1>Sam's Tech Blog</h1>
</header>`,
    explanation: 'Replace <center><font> tags with semantic <header> and proper heading',
    tags: ['semantic-html', 'header', 'modernize', 'deprecated']
  },
  {
    id: 'replace-font-title',
    title: '🎨 Replace Main Title Font',
    description: 'Convert main title <font> tag to proper H1 heading element',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'easy',
    code: `<h1>Sam's Tech Blog</h1>`,
    explanation: 'Use proper H1 heading instead of deprecated <font size="5" color="blue">',
    tags: ['semantic-html', 'heading', 'modernize', 'title']
  },
  {
    id: 'replace-font-subtitle',
    title: '📝 Replace Subtitle Font',
    description: 'Convert subtitle font tag to proper H2 heading',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'easy',
    code: `<h2>Welcome to my blog about technology and life!</h2>`,
    explanation: 'Use H2 for subtitle instead of <font size="3">',
    tags: ['semantic-html', 'heading', 'modernize', 'subtitle']
  },
  {
    id: 'replace-font-post-title',
    title: '📰 Replace Post Title Font',
    description: 'Convert post title font tag to H3 heading',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'easy',
    code: `<h3>Latest Post: My Thoughts on AI</h3>`,
    explanation: 'Use H3 for post title instead of <font size="4" color="red">',
    tags: ['semantic-html', 'heading', 'post', 'modernize']
  },
  {
    id: 'remove-center-around-content',
    title: '🚫 Remove Center Around Content',
    description: 'Remove the center tag around the intro content',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'easy',
    code: `<section class="intro">
  <h2>Welcome to my blog about technology and life!</h2>
</section>`,
    explanation: 'Remove <center> tags and use semantic <section> instead',
    tags: ['semantic-html', 'section', 'modernize', 'intro']
  },

  // MEDIUM DIFFICULTY - STRUCTURAL IMPROVEMENTS
  {
    id: 'semantic-main-content',
    title: '🏗️ Semantic Main Content',
    description: 'Wrap content in semantic <main> and organize sections',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'medium',
    code: `<main class="content">
  <section class="intro">
    <h2>Welcome to my blog about technology and life!</h2>
  </section>
  
  <article class="post">
    <h3>Latest Post: My Thoughts on AI</h3>
    <p>Artificial Intelligence is changing everything...</p>
  </article>
  
  <div class="hidden-message" style="display: block;">
    <p><strong>Check my last Insta story if you care.</strong></p>
  </div>
</main>`,
    explanation: 'Use semantic HTML5 elements for better structure, accessibility, and clue reveal',
    tags: ['semantic-html', 'main', 'section', 'article', 'structure']
  },
  {
    id: 'complete-header-section',
    title: '📱 Complete Header Section',
    description: 'Create a complete header with navigation potential',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'medium',
    code: `<header class="site-header">
  <h1>Sam's Tech Blog</h1>
  <nav class="site-nav">
    <p>Latest thoughts on technology and AI</p>
  </nav>
</header>`,
    explanation: 'A complete header structure ready for navigation and branding',
    tags: ['semantic-html', 'header', 'navigation', 'structure']
  },
  {
    id: 'article-with-metadata',
    title: '📅 Article with Metadata',
    description: 'Structure the post as a proper article with metadata',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'medium',
    code: `<article class="post">
  <header class="post-header">
    <h3>Latest Post: My Thoughts on AI</h3>
    <time datetime="2024-01-15">January 15, 2024</time>
  </header>
  <div class="post-content">
    <p>Artificial Intelligence is changing everything...</p>
  </div>
  <footer class="post-footer">
    <p>By Sam • Tech Blog</p>
  </footer>
</article>`,
    explanation: 'Structure posts as proper articles with semantic metadata and proper sections',
    tags: ['semantic-html', 'article', 'metadata', 'time', 'structure']
  },

  // CSS STYLING SNIPPETS
  {
    id: 'center-with-css',
    title: '🎯 Center Content with CSS',
    description: 'Use text-align instead of <center> tags',
    type: 'css',
    missionId: 'clue-1',
    difficulty: 'easy',
    code: `header {
  text-align: center;
  margin-bottom: 20px;
}

header h1 {
  color: #2563eb;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
}`,
    explanation: 'Modern CSS centering replaces old <center> tags with better control',
    tags: ['css-centering', 'typography', 'styling', 'modern']
  },
  {
    id: 'intro-section-styling',
    title: '✨ Style Introduction Section',
    description: 'Add beautiful styling for the intro section',
    type: 'css',
    missionId: 'clue-1',
    difficulty: 'medium',
    code: `.intro {
  text-align: center;
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.05));
  border-radius: 12px;
  border-left: 4px solid #2563eb;
  border-right: 1px solid rgba(37, 99, 235, 0.2);
}

.intro h2 {
  color: #1f2937;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
}`,
    explanation: 'Style the introduction section with gradient background and modern borders',
    tags: ['css-styling', 'intro', 'gradient', 'typography', 'modern']
  },
  {
    id: 'post-styling',
    title: '📰 Style Blog Post Card',
    description: 'Add modern card-style formatting for the blog post',
    type: 'css',
    missionId: 'clue-1',
    difficulty: 'medium',
    code: `.post {
  margin: 25px 0;
  padding: 25px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.post:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.post h3 {
  color: #dc2626;
  font-size: 1.25rem;
  margin-bottom: 12px;
  font-weight: 600;
}

.post p {
  color: #4b5563;
  line-height: 1.7;
  margin: 0;
  font-size: 1rem;
}`,
    explanation: 'Style the blog post with modern card appearance, hover effects, and better typography',
    tags: ['css-styling', 'post', 'card', 'shadow', 'hover', 'typography']
  },
  {
    id: 'hidden-message-styling',
    title: '⚡ STYLE THE CLUE MESSAGE!',
    description: 'Make the revealed clue message stand out dramatically',
    type: 'css',
    missionId: 'clue-1',
    difficulty: 'medium',
    code: `.hidden-message {
  background: linear-gradient(135deg, #fef3c7, #fed7aa, #fbbf24);
  border: 3px solid #f59e0b;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  margin: 30px 0;
  animation: glow 2s ease-in-out infinite alternate;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
}

.hidden-message::before {
  content: '🔍';
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 1.8rem;
  animation: bounce 1s infinite;
}

.hidden-message::after {
  content: 'CLUE FOUND!';
  position: absolute;
  top: 5px;
  left: 15px;
  font-size: 0.7rem;
  color: #92400e;
  font-weight: bold;
  letter-spacing: 1px;
}

.hidden-message p {
  color: #92400e;
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  line-height: 1.4;
}

@keyframes glow {
  from { box-shadow: 0 0 10px #f59e0b, 0 8px 25px rgba(245, 158, 11, 0.3); }
  to { box-shadow: 0 0 30px #f59e0b, 0 0 40px #f59e0b, 0 8px 25px rgba(245, 158, 11, 0.5); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-3px); }
}`,
    explanation: 'Make the clue message impossible to miss with glowing effects, animations, and detective styling!',
    tags: ['css-styling', 'clue', 'animation', 'glow', 'critical', 'detective']
  },

  // ADVANCED/COMPLETE SOLUTIONS
  {
    id: 'complete-modern-css',
    title: '🎨 Complete Modern CSS',
    description: 'Professional CSS for the entire blog layout',
    type: 'css',
    missionId: 'clue-1',
    difficulty: 'hard',
    code: `body {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  line-height: 1.6;
}

header {
  text-align: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

header h1 {
  color: #ffffff;
  font-size: 2.8rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.intro {
  text-align: center;
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.05));
  border-radius: 12px;
  border-left: 4px solid #2563eb;
}

.intro h2 {
  color: #1f2937;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 400;
}

.post {
  margin: 25px 0;
  padding: 25px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.post:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.post h3 {
  color: #dc2626;
  font-size: 1.25rem;
  margin-bottom: 12px;
  font-weight: 600;
}

.post p {
  color: #4b5563;
  line-height: 1.7;
  margin: 0;
}`,
    explanation: 'Complete professional CSS with glassmorphism, modern typography, and beautiful effects',
    tags: ['complete-solution', 'modern-css', 'glassmorphism', 'professional', 'advanced']
  },
  {
    id: 'complete-html-structure',
    title: '🏗️ COMPLETE HTML SOLUTION',
    description: 'The entire modernized HTML structure with clue revealed',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'hard',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sam's Tech Blog</title>
</head>
<body>
    <header>
        <h1>Sam's Tech Blog</h1>
    </header>
    
    <main class="content">
        <section class="intro">
            <h2>Welcome to my blog about technology and life!</h2>
        </section>
        
        <article class="post">
            <h3>Latest Post: My Thoughts on AI</h3>
            <p>Artificial Intelligence is changing everything...</p>
        </article>
        
        <div class="hidden-message" style="display: block;">
            <p><strong>Check my last Insta story if you care.</strong></p>
        </div>
    </main>
</body>
</html>`,
    explanation: 'COMPLETE SOLUTION: All deprecated tags replaced, semantic structure, proper meta tags, and CLUE REVEALED!',
    tags: ['complete-solution', 'semantic-html', 'modernize', 'clue-reveal', 'victory', 'accessible']
  },

  // DIAGNOSTIC AND HELPER SNIPPETS
  {
    id: 'find-deprecated-tags',
    title: '🔍 Find Deprecated Tags',
    description: 'Quick reference for identifying deprecated HTML',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'easy',
    code: `<!-- FIND AND REPLACE THESE:

❌ <center>content</center>
✅ <header>content</header>

❌ <font size="5" color="blue">
✅ <h1>

❌ <font size="3">
✅ <h2>

❌ <font size="4" color="red">
✅ <h3>

❌ style="display: none"
✅ style="display: block"  ← CLUE!
-->`,
    explanation: 'Use this reference to identify and fix all deprecated HTML patterns',
    tags: ['diagnostic', 'deprecated', 'reference', 'helper']
  },
  {
    id: 'clue-hunting-guide',
    title: '🕵️ Clue Hunting Guide',
    description: 'Detective tips for finding hidden elements',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'easy',
    code: `<!-- DETECTIVE SKILLS:

1. Search for: style="display: none"
   👆 This hides clues!

2. Change to: style="display: block"
   👆 This reveals clues!

3. Look for class="hidden-message"
   👆 Sam's secret messages!

4. Check for suspicious styling
   👆 visibility: hidden is also suspicious!
-->`,
    explanation: 'Essential detective skills for finding hidden clues in HTML code',
    tags: ['detective', 'hidden-elements', 'investigation', 'guide']
  }
];

// Mission 2: Hidden Instagram Story Snippets - EXPANDED
export const MISSION_2_SNIPPETS: DetectiveSnippet[] = [
  // CRITICAL CLUE SNIPPETS
  {
    id: 'reveal-instagram-story',
    title: '📱 REVEAL INSTAGRAM STORY!',
    description: 'Make the hidden Instagram story visible to find the next clue',
    type: 'html',
    missionId: 'clue-2',
    difficulty: 'easy',
    code: `<div class="instagram-story" style="display: block;">
  <h3>Last Story (24hrs ago)</h3>
  <div class="story-image">
    <img src="story-final.jpg" alt="Sam's final story" />
    <div class="story-text">
      <p><strong>"Meet me where the trains don't run anymore."</strong></p>
    </div>
  </div>
</div>`,
    explanation: 'CRITICAL! Change display: none to display: block to reveal Sam\'s Instagram story with the train station clue!',
    tags: ['css-display', 'instagram', 'clue-reveal', 'critical', 'train-station']
  },

  // STYLING SNIPPETS
  {
    id: 'instagram-story-styling',
    title: '📸 Style Instagram Story',
    description: 'Add authentic Instagram-style formatting',
    type: 'css',
    missionId: 'clue-2',
    difficulty: 'medium',
    code: `.instagram-story {
  border-top: 3px solid #e1306c;
  padding: 25px 20px;
  margin: 30px 0;
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  border-radius: 12px;
  animation: slideDown 1s ease-out;
  position: relative;
}

.instagram-story::before {
  content: '📸';
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 1.5rem;
}

.instagram-story h3 {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  font-size: 1.2rem;
}

.story-image {
  position: relative;
  text-align: center;
  display: inline-block;
  width: 100%;
}

.story-image img {
  width: 200px;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid #ffffff;
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

.story-text {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 20px;
  width: 80%;
  backdrop-filter: blur(10px);
}

.story-text p {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
}

@keyframes slideDown {
  from { 
    opacity: 0; 
    transform: translateY(-30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}`,
    explanation: 'Style the Instagram story to look authentic with Instagram gradient and story-like effects',
    tags: ['instagram-styling', 'animations', 'positioning', 'authentic', 'gradient']
  },
  {
    id: 'story-container-layout',
    title: '📱 Instagram Container Layout',
    description: 'Create proper container structure for the Instagram story',
    type: 'html',
    missionId: 'clue-2',
    difficulty: 'medium',
    code: `<section class="social-media-section">
  <h2>Sam's Social Media</h2>
  
  <div class="instagram-story" style="display: block;">
    <header class="story-header">
      <h3>📱 Last Story (24hrs ago)</h3>
      <span class="story-badge">Instagram</span>
    </header>
    
    <div class="story-content">
      <div class="story-image">
        <img src="story-final.jpg" alt="Sam's final story" />
        <div class="story-text">
          <p><strong>"Meet me where the trains don't run anymore."</strong></p>
        </div>
      </div>
    </div>
  </div>
</section>`,
    explanation: 'Complete semantic structure for the Instagram story section with proper organization',
    tags: ['semantic-html', 'instagram', 'structure', 'organization', 'social-media']
  },
  {
    id: 'story-metadata',
    title: '⏰ Add Story Metadata',
    description: 'Add timestamp and story information',
    type: 'html',
    missionId: 'clue-2',
    difficulty: 'medium',
    code: `<div class="story-metadata">
  <time datetime="2024-01-14T23:45:00">24 hours ago</time>
  <span class="story-type">Story</span>
  <span class="story-status">Expired</span>
</div>`,
    explanation: 'Add proper metadata to make the Instagram story feel more authentic',
    tags: ['metadata', 'time', 'instagram', 'authentic']
  },

  // ADVANCED STYLING
  {
    id: 'complete-instagram-css',
    title: '🎨 Complete Instagram Story CSS',
    description: 'Professional Instagram-style CSS with all effects',
    type: 'css',
    missionId: 'clue-2',
    difficulty: 'hard',
    code: `.social-media-section {
  margin: 40px 0;
  padding: 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.social-media-section h2 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 30px;
  font-size: 1.8rem;
  position: relative;
}

.social-media-section h2::after {
  content: '👁️‍🗨️';
  position: absolute;
  right: -40px;
  top: 0;
}

.instagram-story {
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  border-radius: 16px;
  padding: 25px;
  position: relative;
  overflow: hidden;
  animation: reveaInstagram 1.5s ease-out;
  box-shadow: 0 8px 30px rgba(225, 48, 108, 0.4);
}

.instagram-story::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
  animation: storyProgress 3s ease-in-out;
}

.story-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.story-header h3 {
  color: white;
  margin: 0;
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.story-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.story-content {
  text-align: center;
}

.story-image {
  position: relative;
  display: inline-block;
}

.story-image img {
  width: 200px;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
}

.story-text {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 20px;
  width: 85%;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.story-text p {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.4;
}

.story-metadata {
  margin-top: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.story-metadata span {
  margin: 0 8px;
}

@keyframes reveaInstagram {
  from { 
    opacity: 0; 
    transform: scale(0.9) translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
  }
}

@keyframes storyProgress {
  from { width: 0%; }
  to { width: 100%; }
}`,
    explanation: 'Complete professional Instagram story styling with authentic animations and effects',
    tags: ['complete-solution', 'instagram', 'professional', 'animations', 'authentic']
  },

  // DIAGNOSTIC SNIPPETS
  {
    id: 'find-instagram-clue',
    title: '🔍 Find Instagram Clue',
    description: 'Guide for finding the Instagram story clue',
    type: 'html',
    missionId: 'clue-2',
    difficulty: 'easy',
    code: `<!-- DETECTIVE CHECKLIST:

✅ Found Sam's blog message: "Check my last Insta story"
🔍 Now find: class="instagram-story"
❌ Currently: style="display: none"
✅ Change to: style="display: block"

🎯 The clue mentions: "trains don't run anymore"
📍 This points to: Eastside Station (abandoned)
-->`,
    explanation: 'Step-by-step guide for finding and revealing the Instagram story clue',
    tags: ['detective', 'guide', 'instagram', 'investigation']
  }
];

// Mission 3: Eastside Station Post Snippets - EXPANDED
export const MISSION_3_SNIPPETS: DetectiveSnippet[] = [
  // CRITICAL CLUE SNIPPETS
  {
    id: 'fix-visibility-hidden',
    title: '👁️ MAKE HIDDEN POST VISIBLE!',
    description: 'Change visibility: hidden to visibility: visible to reveal the final clue',
    type: 'html',
    missionId: 'clue-3',
    difficulty: 'easy',
    code: `<article class="hidden-post" style="visibility: visible;">`,
    explanation: 'FINAL CLUE! Change visibility: hidden to visibility: visible to reveal Sam\'s last post about Eastside Station!',
    tags: ['css-visibility', 'clue-reveal', 'final-mission', 'critical', 'eastside-station']
  },

  // MODERNIZATION SNIPPETS
  {
    id: 'modernize-deprecated-tags',
    title: '🏗️ Modernize All Deprecated Tags',
    description: 'Convert all <center> and <font> tags to semantic HTML',
    type: 'html',
    missionId: 'clue-3',
    difficulty: 'medium',
    code: `<article class="hidden-post" style="visibility: visible;">
  <header class="post-header">
    <h2>BREAKING: Eastside Station Investigation</h2>
    <div class="post-meta">
      <time datetime="2024-01-13">Posted 2 days ago</time>
      <span class="author">by Sam</span>
    </div>
  </header>
  
  <div class="post-content">
    <p>I've been investigating the old Eastside Station for weeks. 
       The truth about what happened there in the 90s is finally coming to light.</p>
  </div>
  
  <div class="critical-message">
    <p><strong>Going live at midnight with the truth.</strong></p>
  </div>
</article>`,
    explanation: 'Replace all deprecated tags with modern semantic HTML5 elements and proper structure',
    tags: ['semantic-html', 'modernize', 'header', 'article', 'final-post']
  },
  {
    id: 'replace-center-post-header',
    title: '📰 Replace Center Post Header',
    description: 'Convert post header center tag to semantic header',
    type: 'html',
    missionId: 'clue-3',
    difficulty: 'easy',
    code: `<header class="post-header">
  <h2>BREAKING: Eastside Station Investigation</h2>
</header>`,
    explanation: 'Use semantic header element instead of deprecated center tag',
    tags: ['semantic-html', 'header', 'modernize', 'post']
  },
  {
    id: 'replace-font-breaking-news',
    title: '🚨 Replace Breaking News Font',
    description: 'Convert breaking news font tag to proper H2',
    type: 'html',
    missionId: 'clue-3',
    difficulty: 'easy',
    code: `<h2>BREAKING: Eastside Station Investigation</h2>`,
    explanation: 'Use H2 heading for breaking news instead of font with size and color attributes',
    tags: ['semantic-html', 'heading', 'breaking-news', 'modernize']
  },
  {
    id: 'replace-critical-message-center',
    title: '⚠️ Replace Critical Message Center',
    description: 'Convert critical message center tag to div with class',
    type: 'html',
    missionId: 'clue-3',
    difficulty: 'easy',
    code: `<div class="critical-message">
  <p><strong>Going live at midnight with the truth.</strong></p>
</div>`,
    explanation: 'Use semantic div with class instead of center tag for the critical message',
    tags: ['semantic-html', 'critical-message', 'modernize']
  },

  // STYLING SNIPPETS
  {
    id: 'critical-message-styling',
    title: '🚨 Style Critical Evidence',
    description: 'Make the final clue message stand out dramatically',
    type: 'css',
    missionId: 'clue-3',
    difficulty: 'medium',
    code: `.hidden-post {
  background: rgba(255, 255, 255, 0.98);
  color: #1f2937;
  padding: 35px;
  margin: 30px 0;
  border-radius: 16px;
  border: 3px solid #dc2626;
  animation: emergencyReveal 1.5s ease-out;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.3);
  position: relative;
  overflow: hidden;
}

.hidden-post::before {
  content: '🚨';
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 2rem;
  animation: flash 1s infinite;
}

.hidden-post::after {
  content: 'FINAL EVIDENCE';
  position: absolute;
  top: 8px;
  left: 20px;
  font-size: 0.7rem;
  color: #dc2626;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.post-header {
  text-align: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #fca5a5;
  padding-bottom: 15px;
}

.post-header h2 {
  color: #dc2626;
  font-size: 1.6rem;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-meta {
  color: #6b7280;
  font-size: 0.9rem;
}

.post-meta time,
.post-meta .author {
  margin: 0 8px;
}

.post-content {
  text-align: center;
  margin: 25px 0;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #374151;
}

.critical-message {
  text-align: center;
  background: linear-gradient(135deg, #fef3c7, #fed7aa);
  border: 3px solid #f59e0b;
  padding: 20px;
  border-radius: 12px;
  margin: 25px 0;
  position: relative;
  animation: pulse 2s infinite;
}

.critical-message::before {
  content: '⚠️';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #f59e0b;
  padding: 5px 10px;
  border-radius: 50%;
  font-size: 1.2rem;
}

.critical-message p {
  color: #92400e;
  font-size: 1.3rem;
  margin: 0;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

@keyframes emergencyReveal {
  from { 
    opacity: 0; 
    transform: scale(0.9) rotateX(10deg); 
  }
  to { 
    opacity: 1; 
    transform: scale(1) rotateX(0deg); 
  }
}

@keyframes flash {
  0%, 50% { opacity: 1; }
  25%, 75% { opacity: 0.3; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}`,
    explanation: 'Style the final post with dramatic emergency effects to highlight the critical evidence and timeline',
    tags: ['critical-styling', 'animations', 'evidence-highlight', 'emergency', 'final-clue']
  },
  {
    id: 'breaking-news-styling',
    title: '📺 Breaking News Style',
    description: 'Style the post like a breaking news report',
    type: 'css',
    missionId: 'clue-3',
    difficulty: 'hard',
    code: `.hidden-post {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 3px solid #dc2626;
  border-radius: 16px;
  padding: 35px;
  margin: 30px 0;
  position: relative;
  overflow: hidden;
  animation: newsReveal 2s ease-out;
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.2);
}

.hidden-post::before {
  content: 'BREAKING NEWS';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #dc2626;
  color: white;
  padding: 8px 0;
  text-align: center;
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 2px;
  animation: ticker 1s ease-in-out;
}

.hidden-post::after {
  content: '🔴 LIVE';
  position: absolute;
  top: 35px;
  right: 20px;
  background: #dc2626;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  animation: blink 1s infinite;
}

.post-header {
  margin-top: 25px;
  text-align: center;
  border-bottom: 3px solid #fca5a5;
  padding-bottom: 20px;
  margin-bottom: 25px;
}

.post-header h2 {
  color: #dc2626;
  font-size: 1.8rem;
  margin: 0 0 15px 0;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.2;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
}

.post-meta {
  background: rgba(220, 38, 38, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
  color: #7f1d1d;
  font-size: 0.9rem;
  font-weight: 600;
}

.post-content {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #1f2937;
  text-align: justify;
  margin: 25px 0;
  padding: 0 10px;
}

.critical-message {
  background: linear-gradient(45deg, #fef3c7, #fed7aa);
  border: 4px solid #f59e0b;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  margin: 30px 0;
  position: relative;
  animation: criticalAlert 2s ease-in-out infinite;
}

.critical-message::before {
  content: '⚠️ URGENT ⚠️';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #f59e0b;
  color: white;
  padding: 6px 16px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.critical-message p {
  color: #92400e;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 10px 0 0 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

@keyframes newsReveal {
  0% { 
    opacity: 0; 
    transform: translateY(50px) scale(0.9); 
  }
  50% { 
    opacity: 0.8; 
    transform: translateY(-10px) scale(1.02); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

@keyframes ticker {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

@keyframes criticalAlert {
  0%, 100% { box-shadow: 0 0 10px #f59e0b; }
  50% { box-shadow: 0 0 30px #f59e0b, 0 0 50px #f59e0b; }
}`,
    explanation: 'Complete breaking news styling with live ticker, urgent alerts, and professional news formatting',
    tags: ['breaking-news', 'professional', 'news-style', 'urgent', 'complete-solution']
  },

  // COMPLETE SOLUTIONS
  {
    id: 'complete-final-post',
    title: '🏆 COMPLETE FINAL POST',
    description: 'The complete modernized final post with all clues revealed',
    type: 'html',
    missionId: 'clue-3',
    difficulty: 'hard',
    code: `<article class="hidden-post" style="visibility: visible;">
  <header class="post-header">
    <h2>BREAKING: Eastside Station Investigation</h2>
    <div class="post-meta">
      <time datetime="2024-01-13T22:30:00">Posted 2 days ago at 10:30 PM</time>
      <span class="author">by Sam Mitchell</span>
      <span class="category">Investigation</span>
    </div>
  </header>
  
  <div class="post-content">
    <p>I've been investigating the old Eastside Station for weeks. 
       The truth about what happened there in the 90s is finally coming to light.</p>
       
    <p>The evidence I've uncovered is bigger than I thought. 
       This isn't just about an abandoned train station...</p>
  </div>
  
  <div class="critical-message">
    <p><strong>Going live at midnight with the truth.</strong></p>
  </div>
  
  <footer class="post-footer">
    <div class="tags">
      <span class="tag">#EastsideStation</span>
      <span class="tag">#Investigation</span>
      <span class="tag">#Truth</span>
    </div>
    <div class="post-actions">
      <span class="timestamp">Last seen: 2 days ago</span>
    </div>
  </footer>
</article>`,
    explanation: 'COMPLETE SOLUTION: All deprecated tags modernized, semantic structure, and final clue revealed with full context!',
    tags: ['complete-solution', 'final-clue', 'semantic-html', 'victory', 'case-solved']
  },

  // DIAGNOSTIC SNIPPETS
  {
    id: 'find-final-clue',
    title: '🔍 Find Final Clue',
    description: 'Guide for finding the final hidden post',
    type: 'html',
    missionId: 'clue-3',
    difficulty: 'easy',
    code: `<!-- FINAL DETECTIVE CHECKLIST:

✅ Found Instagram clue: "trains don't run anymore"
🔍 Now find: class="hidden-post"
❌ Currently: style="visibility: hidden"
✅ Change to: style="visibility: visible"

🎯 Sam's final message: "Going live at midnight"
📍 CASE BREAKTHROUGH: Sam planned to expose something!
⏰ Timeline critical: Last post 2 days ago

🏆 MISSION COMPLETE: All clues found!
-->`,
    explanation: 'Final detective checklist for completing the case and finding all evidence',
    tags: ['detective', 'final-mission', 'case-solved', 'investigation', 'timeline']
  }
];

// Complete Detective Case Snippet Collection
export const DETECTIVE_CASE_SNIPPETS = {
  'clue-1': MISSION_1_SNIPPETS,
  'clue-2': MISSION_2_SNIPPETS,
  'clue-3': MISSION_3_SNIPPETS
};

// Helper function to get snippets for a specific mission
export const getSnippetsForMission = (missionId: string): DetectiveSnippet[] => {
  return DETECTIVE_CASE_SNIPPETS[missionId as keyof typeof DETECTIVE_CASE_SNIPPETS] || [];
};

// Helper function to get snippets by type and mission
export const getSnippetsByType = (missionId: string, type: 'html' | 'css'): DetectiveSnippet[] => {
  const missionSnippets = getSnippetsForMission(missionId);
  return missionSnippets.filter(snippet => snippet.type === type);
};

// Helper function to get snippets by difficulty
export const getSnippetsByDifficulty = (missionId: string, difficulty: 'easy' | 'medium' | 'hard'): DetectiveSnippet[] => {
  const missionSnippets = getSnippetsForMission(missionId);
  return missionSnippets.filter(snippet => snippet.difficulty === difficulty);
};

// Helper function to get critical clue snippets
export const getCriticalClueSnippets = (missionId: string): DetectiveSnippet[] => {
  const missionSnippets = getSnippetsForMission(missionId);
  return missionSnippets.filter(snippet => snippet.tags.includes('critical') || snippet.tags.includes('clue-reveal'));
};

// Enhanced Quick fix snippets for common detective case issues
export const QUICK_FIX_SNIPPETS = [
  {
    id: 'fix-display-none',
    title: '🔍 Show Hidden Element',
    code: 'style="display: block;"',
    description: 'Change display: none to display: block to reveal hidden clues'
  },
  {
    id: 'fix-visibility-hidden',
    title: '👁️ Make Visible',
    code: 'style="visibility: visible;"',
    description: 'Change visibility: hidden to visibility: visible'
  },
  {
    id: 'replace-center',
    title: '🏗️ Modernize Center Tag',
    code: '<header>\n  <h1>Title Here</h1>\n</header>',
    description: 'Replace <center> tags with semantic <header> elements'
  },
  {
    id: 'replace-font',
    title: '🎨 Modernize Font Tag',
    code: '<h1 class="title">Title Here</h1>',
    description: 'Replace <font> tags with proper heading elements and CSS'
  },
  {
    id: 'replace-font-h2',
    title: '📝 Font to H2',
    code: '<h2>Subtitle Here</h2>',
    description: 'Replace font size="3" with H2 heading'
  },
  {
    id: 'replace-font-h3',
    title: '📰 Font to H3',
    code: '<h3>Post Title Here</h3>',
    description: 'Replace font size="4" with H3 heading'
  },
  {
    id: 'semantic-main',
    title: '🏗️ Add Main Element',
    code: '<main class="content">\n  <!-- content here -->\n</main>',
    description: 'Wrap content in semantic <main> element'
  },
  {
    id: 'semantic-section',
    title: '📦 Add Section Element',
    code: '<section class="intro">\n  <!-- content here -->\n</section>',
    description: 'Wrap content in semantic <section> element'
  }
];

export default {
  DETECTIVE_CASE_SNIPPETS,
  getSnippetsForMission,
  getSnippetsByType,
  getSnippetsByDifficulty,
  getCriticalClueSnippets,
  QUICK_FIX_SNIPPETS
};
