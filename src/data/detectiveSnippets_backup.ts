// Detective Case Specific Snippets for "The Vanishing Blogger"

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

// Mission 1: Broken Blog Layout Snippets
export const MISSION_1_SNIPPETS: DetectiveSnippet[] = [
  {
    id: 'replace-center-tag',
    title: 'Replace <center> with Modern CSS',
    description: 'Convert deprecated <center> tags to semantic HTML with CSS',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'easy',
    code: `<header>
  <h1>Sam's Tech Blog</h1>
</header>`,
    explanation: 'Replace <center><font> tags with semantic <header> and style with CSS',
    tags: ['semantic-html', 'header', 'modernize']
  },
  {
    id: 'center-with-css',
    title: 'Center Content with CSS',
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
}`,
    explanation: 'Modern CSS centering replaces old <center> tags',
    tags: ['css-centering', 'typography', 'styling']
  },
  {
    id: 'reveal-hidden-message',
    title: 'Reveal Hidden Clue',
    description: 'Change display: none to display: block to reveal the hidden message',
    type: 'html',
    missionId: 'clue-1',
    difficulty: 'medium',
    code: `<div class="hidden-message" style="display: block;">
  <p><strong>Check my last Insta story if you care.</strong></p>
</div>`,
    explanation: 'Change display: none to display: block to reveal Sam\'s hidden message',
    tags: ['css-display', 'clue-reveal', 'investigation']
  },
  {
    id: 'semantic-main-content',
    title: 'Semantic Main Content',
    description: 'Wrap content in semantic <main> and <section> elements',
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
</main>`,
    explanation: 'Use semantic HTML5 elements for better structure and accessibility',
    tags: ['semantic-html', 'main', 'section', 'article']
  }
];

// Mission 2: Hidden Instagram Story Snippets
export const MISSION_2_SNIPPETS: DetectiveSnippet[] = [
  {
    id: 'reveal-instagram-story',
    title: 'Show Instagram Story',
    description: 'Make the hidden Instagram story visible',
    type: 'html',
    missionId: 'clue-2',
    difficulty: 'easy',
    code: `<div class="instagram-story" style="display: block;">
  <h3>Last Story (24hrs ago)</h3>
  <div class="story-image">
    <img src="story-final.jpg" alt="Story screenshot" />
    <div class="story-text">
      <p><strong>"Meet me where the trains don't run anymore."</strong></p>
    </div>
  </div>
</div>`,
    explanation: 'Change display: none to display: block to reveal the Instagram story clue',
    tags: ['css-display', 'instagram', 'clue-reveal']
  },
  {
    id: 'instagram-story-styling',
    title: 'Style Instagram Story',
    description: 'Add proper styling to make the story section stand out',
    type: 'css',
    missionId: 'clue-2',
    difficulty: 'medium',
    code: `.instagram-story {
  border-top: 2px solid #e1306c;
  padding-top: 20px;
  margin-top: 30px;
  animation: fadeIn 1s ease-in;
}

.story-image {
  position: relative;
  text-align: center;
}

.story-image img {
  width: 200px;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid #e1306c;
}

.story-text {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 10px;
  border-radius: 6px;
  width: 80%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}`,
    explanation: 'Style the Instagram story to look authentic with animations',
    tags: ['instagram-styling', 'animations', 'positioning']
  }
];

// Mission 3: Eastside Station Post Snippets
export const MISSION_3_SNIPPETS: DetectiveSnippet[] = [
  {
    id: 'fix-visibility-hidden',
    title: 'Make Hidden Post Visible',
    description: 'Change visibility: hidden to visibility: visible',
    type: 'html',
    missionId: 'clue-3',
    difficulty: 'easy',
    code: `<article class="hidden-post" style="visibility: visible;">`,
    explanation: 'Change visibility: hidden to visibility: visible to reveal the final clue',
    tags: ['css-visibility', 'clue-reveal', 'final-mission']
  },
  {
    id: 'modernize-deprecated-tags',
    title: 'Replace Deprecated Tags',
    description: 'Convert <center> and <font> tags to semantic HTML',
    type: 'html',
    missionId: 'clue-3',
    difficulty: 'medium',
    code: `<article class="hidden-post" style="visibility: visible;">
  <header class="post-header">
    <h2>BREAKING: Eastside Station Investigation</h2>
  </header>
  
  <div class="post-content">
    <p>I've been investigating the old Eastside Station for weeks. 
       The truth about what happened there in the 90s is finally coming to light.</p>
  </div>
  
  <div class="critical-message">
    <p><strong>Going live at midnight with the truth.</strong></p>
  </div>
  
  <footer class="post-meta">
    <p>Posted 2 days ago - Sam</p>
  </footer>
</article>`,
    explanation: 'Replace all deprecated tags with modern semantic HTML5 elements',
    tags: ['semantic-html', 'modernize', 'header', 'footer']
  },
  {
    id: 'critical-message-styling',
    title: 'Style Critical Evidence',
    description: 'Make the final clue message stand out dramatically',
    type: 'css',
    missionId: 'clue-3',
    difficulty: 'medium',
    code: `.hidden-post {
  background: rgba(255,255,255,0.95);
  color: #1f2937;
  padding: 30px;
  margin: 30px 0;
  border-radius: 12px;
  border: 3px solid #dc2626;
  animation: slideIn 1s ease-out;
}

.post-header {
  text-align: center;
  margin-bottom: 20px;
}

.post-header h2 {
  color: #dc2626;
  font-size: 1.5rem;
  margin: 0;
}

.post-content {
  text-align: center;
  margin: 20px 0;
  font-size: 1.1rem;
  line-height: 1.6;
}

.critical-message {
  text-align: center;
  background: #fef3c7;
  border: 2px solid #f59e0b;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.critical-message p {
  color: #92400e;
  font-size: 1.2rem;
  margin: 0;
  font-weight: bold;
}

.post-meta {
  text-align: center;
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 20px;
}

@keyframes slideIn {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}`,
    explanation: 'Style the final post with dramatic effects to highlight the critical evidence',
    tags: ['critical-styling', 'animations', 'evidence-highlight']
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

// Quick fix snippets for common detective case issues
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
  }
];

export default {
  DETECTIVE_CASE_SNIPPETS,
  getSnippetsForMission,
  getSnippetsByType,
  getSnippetsByDifficulty,
  QUICK_FIX_SNIPPETS
};
