export interface CaseData {
  id: string;
  title: string;
  description: string;
  story: string;
  objective: string;
  initialHtml: string;
  initialCss: string;
  targetHtml: string;
  targetCss: string;
  hints: string[];
  cluePoints: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  // New fields for detective missions
  isDetectiveMission?: boolean;
  cinematicSlides?: CinematicSlide[];
  missions?: Mission[];
  finalResolution?: string;
}

export interface CinematicSlide {
  id: string;
  title: string;
  dialogue: string;
  speaker: string;
  background: string;
  characterImage?: string;
  soundEffect?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  objective: string;
  brokenHtml: string;
  brokenCss: string;
  targetHtml: string;
  targetCss: string;
  successConditions: string[];
  clueRevealed: string;
  aiHints: string[];
  hintsSteps?: HintStep[];
}

export interface HintStep {
  id: string;
  condition: string;
  hint: string;
  points: number;
}

export const cases: CaseData[] = [
  {
    id: 'case-vanishing-blogger',
    title: 'The Vanishing Blogger',
    description: 'A local blogger has gone missing. Fix his broken blog to uncover the truth behind his disappearance.',
    story: `Sam Lens, a popular local blogger, has vanished without a trace. His last known activity was on his personal blog, which is now broken and messy. As a web detective, you must fix the HTML and CSS issues to reveal hidden clues about what happened to Sam.

    **Your Mission**: Navigate through three critical clues hidden within Sam's broken blog code. Each clue will bring you closer to solving the mystery of his disappearance.

    **Detective Tools**: Use your HTML/CSS skills to:
    • Replace outdated tags with modern alternatives
    • Reveal hidden content by fixing CSS visibility
    • Modernize broken layouts using flexbox
    • Uncover the truth behind Sam's vanishing act`,
    objective: 'Investigate Sam\'s broken blog by fixing HTML/CSS issues to reveal three hidden clues and solve the mystery.',
    isDetectiveMission: true,
    cinematicSlides: [
      {
        id: 'intro-1',
        title: 'Missing Person Report',
        dialogue: 'Detective, we have a missing person case. Sam Lens, a local blogger, hasn\'t been seen for 48 hours.',
        speaker: 'Police Chief',
        background: 'police-station',
        characterImage: 'police-chief.png',
        soundEffect: 'typewriter'
      },
      {
        id: 'intro-2',
        title: 'Last Known Activity',
        dialogue: 'His last activity was on his personal blog. The site is completely broken - almost like someone sabotaged it.',
        speaker: 'Detective Codec',
        background: 'detective-office',
        characterImage: 'detective-codec.png',
        soundEffect: 'investigation'
      },
      {
        id: 'intro-3',
        title: 'The Investigation Begins',
        dialogue: 'Something tells me the answers are hidden in that broken code. Let\'s investigate and see what we can uncover.',
        speaker: 'Detective Codec',
        background: 'computer-screen',
        characterImage: 'detective-codec.png',
        soundEffect: 'keyboard-clicks'
      }
    ],
    missions: [
      {
        id: 'clue-1',
        title: 'Clue 1: The Broken Blog Layout',
        description: 'Sam\'s main blog layout is broken using old HTML tags. Fix it to reveal his hidden message.',
        objective: 'Replace deprecated HTML tags with modern semantic elements to reveal Clue 1.',
        brokenHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Last Blog Post</title>
</head>
<body>
    <center><h1>The Truth About NovaCorp</h1></center>
    
    <p>Hey, it's Sam Lens. If you're reading this, I've probably vanished. No, I'm not kidding. The company I'm exposing—NovaCorp—has dark secrets that they don't want out. Data manipulation, stolen AI research, blackmail... you name it.</p>
    
    <p>This might get taken down, so look closely. Maybe you'll find a message here if you care enough to look.</p>
    
    <p hidden>Check my last Insta story before they wipe it.</p>
    
    <p>They control everything: the media, the feeds, the ads. They think they can silence me like they silenced others.</p>
    
    <img id="insta-clue" src="insta_screenshot.png" alt="Instagram Screenshot with text: 'Meet me where the shadows watch but the cameras don't.'">
    
    <p>They won't find me if I keep moving, but they're watching. Always watching.</p>
    
    <font id="address-clue" color="red" size="5">
        Warehouse 17, Dockside Street, 12:00 AM.
    </font>
    
    <p>Stay safe, and if they get me, keep searching for the truth. Maybe it's not just me they want to silence.</p>
    
    <center><p>Sam out.</p></center>
</body>
</html>`,
        brokenCss: `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
}

#insta-clue {
    display: none;
}

#address-clue {
    visibility: hidden;
}

.post-image {
    float: left;
    margin: 20px;
}`,
        targetHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Last Blog Post</title>
</head>
<body>
    <header>
        <h1>The Truth About NovaCorp</h1>
    </header>
    
    <main>
        <p>Hey, it's Sam Lens. If you're reading this, I've probably vanished. No, I'm not kidding. The company I'm exposing—NovaCorp—has dark secrets that they don't want out. Data manipulation, stolen AI research, blackmail... you name it.</p>
        
        <p>This might get taken down, so look closely. Maybe you'll find a message here if you care enough to look.</p>
        
        <section class="hidden-message">
            <p><strong>Check my last Insta story before they wipe it.</strong></p>
        </section>
        
        <p>They control everything: the media, the feeds, the ads. They think they can silence me like they silenced others.</p>
        
        <img id="insta-clue" src="insta_screenshot.png" alt="Instagram Screenshot with text: 'Meet me where the shadows watch but the cameras don't.'">
        
        <p>They won't find me if I keep moving, but they're watching. Always watching.</p>
        
        <section id="address-clue" class="final-location">
            <p><strong>Warehouse 17, Dockside Street, 12:00 AM.</strong></p>
        </section>
        
        <p>Stay safe, and if they get me, keep searching for the truth. Maybe it's not just me they want to silence.</p>
        
        <footer>
            <p>Sam out.</p>
        </footer>
    </main>
</body>
</html>`,
        targetCss: `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

header h1 {
    color: #d32f2f;
    font-size: 2.5rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

main {
    line-height: 1.6;
}

.hidden-message {
    background: #fff3cd;
    border: 2px solid #ffc107;
    padding: 15px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
}

#insta-clue {
    display: block;
    max-width: 300px;
    margin: 20px auto;
    border: 3px solid #e1306c;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.final-location {
    visibility: visible;
    background: #ffebee;
    border: 3px solid #f44336;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
    font-size: 1.2rem;
    color: #d32f2f;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
    100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
}

footer {
    text-align: center;
    margin-top: 30px;
    font-style: italic;
    color: #666;
}`,
        successConditions: [
          'Replace <center> tags with semantic elements',
          'Replace <font> tags with CSS styling',
          'Change display: none to display: block for #insta-clue',
          'Change visibility: hidden to visibility: visible for #address-clue',
          'Remove hidden attribute and use semantic HTML'
        ],
        clueRevealed: 'Check my last Insta story before they wipe it.',
        aiHints: [
          'Those <center> and <font> tags look outdated. Try using semantic HTML instead.',
          'There\'s something hidden in the HTML. Look for hidden attributes and CSS display properties.',
          'Replace the <center> tags with proper <header> and <footer> elements.',
          'That hidden paragraph needs to be revealed - remove the hidden attribute!',
          'Great! Now you can see Sam\'s first clue about checking his Instagram story.'
        ],
        hintsSteps: [
          {
            id: 'remove-center',
            condition: 'Remove <center> tags',
            hint: '🎯 Remove all <center> tags and use CSS text-align: center instead!',
            points: 2
          },
          {
            id: 'remove-font',
            condition: 'Remove <font> tags', 
            hint: '🎨 Replace <font> tags with CSS color and style properties!',
            points: 2
          },
          {
            id: 'add-semantic-header',
            condition: 'Add semantic header tag',
            hint: '📝 Use <header> tag for the main header section instead of <div>!',
            points: 3
          },
          {
            id: 'reveal-hidden',
            condition: 'Change display none to block',
            hint: '👁️ Change display: none to display: block to reveal hidden content!',
            points: 5
          }
        ]
      },
      {
        id: 'clue-2',
        title: 'Clue 2: The Hidden Instagram Story',
        description: 'There\'s a hidden Instagram story screenshot on Sam\'s site. Make it visible to see the crucial clue.',
        objective: 'Fix the CSS to reveal the hidden Instagram story image containing Clue 2.',
        brokenHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Social Media Archive</title>
</head>
<body>
    <header>
        <h1>My Social Media Archive</h1>
    </header>
    
    <main class="content">
        <div class="social-post">
            <h3>Recent Instagram Posts</h3>
            <div class="instagram-grid">
                <img src="post1.jpg" alt="Coffee time" />
                <img src="post2.jpg" alt="Coding session" />
                <img src="post3.jpg" alt="Sunset view" />
            </div>
        </div>
        
        <div class="instagram-story" style="display: none;">
            <h3>Last Story (24hrs ago)</h3>
            <div class="story-image">
                <img src="insta_screenshot.png" alt="Instagram Story Screenshot" />
                <div class="story-text">
                    <p><strong>"Meet me where the shadows watch but the cameras don't."</strong></p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>`,
        brokenCss: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

.content {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.instagram-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 20px 0;
}

.instagram-grid img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
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
}`,
        targetHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Social Media Archive</title>
</head>
<body>
    <header>
        <h1>My Social Media Archive</h1>
    </header>
    
    <main class="content">
        <div class="social-post">
            <h3>Recent Instagram Posts</h3>
            <div class="instagram-grid">
                <img src="post1.jpg" alt="Coffee time" />
                <img src="post2.jpg" alt="Coding session" />
                <img src="post3.jpg" alt="Sunset view" />
            </div>
        </div>
        
        <div class="instagram-story" style="display: block;">
            <h3>Last Story (24hrs ago)</h3>
            <div class="story-image">
                <img src="insta_screenshot.png" alt="Instagram Story Screenshot" />
                <div class="story-text">
                    <p><strong>"Meet me where the shadows watch but the cameras don't."</strong></p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>`,
        brokenCss: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

.content {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.instagram-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 20px 0;
}

.instagram-grid img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
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
}`,
        targetCss: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

.content {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.instagram-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 20px 0;
}

.instagram-grid img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
}

.instagram-story {
    border-top: 2px solid #e1306c;
    padding-top: 20px;
    margin-top: 30px;
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
    animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
}`,
                <img src="post1.jpg" alt="Coffee time" />
                <img src="post2.jpg" alt="Coding session" />
                <img src="post3.jpg" alt="Sunset view" />
            </div>
        </div>
        
        <div class="instagram-story" style="display: block;">
            <h3>Last Story (24hrs ago)</h3>
            <div class="story-image">
                <img src="story-final.jpg" alt="Story screenshot" />
                <div class="story-text">
                    <p><strong>"Meet me where the trains don't run anymore."</strong></p>
                </div>
            </div>
        </div>
    </main>
</body>
</html>`,
        targetCss: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

.content {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.instagram-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 20px 0;
}

.instagram-grid img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
}

.instagram-story {
    border-top: 2px solid #e1306c;
    padding-top: 20px;
    margin-top: 30px;
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
    animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
}`,
        successConditions: [
          'Change display: none to display: block on .instagram-story',
          'Add styling to make the story section visible and highlighted'
        ],
        clueRevealed: 'Meet me where the trains don\'t run anymore.',
        aiHints: [
          'There\'s a hidden Instagram story section. Can you make it visible?',
          'Look for display: none in the HTML - that\'s hiding something important!',
          'Perfect! Now we can see Sam\'s last story. That message is definitely a clue.',
          'Where could "where the trains don\'t run anymore" refer to? An old station perhaps?'
        ]
      },
      {
        id: 'clue-3',
        title: 'Clue 3: The Eastside Station Post',
        description: 'Find and fix Sam\'s hidden blog post about Eastside Station to uncover the final clue.',
        objective: 'Modernize the layout and fix visibility to reveal the final clue about Sam\'s whereabouts.',
        brokenHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Blog - Hidden Post</title>
</head>
<body>
    <header>
        <h1>Sam's Urban Explorer Blog</h1>
    </header>
    
    <main class="content">
        <div class="post-list">
            <article class="post">
                <h3>Exploring Abandoned Places</h3>
                <p>Today I visited some incredible abandoned locations...</p>
            </article>
            
            <article class="post">
                <h3>Urban Photography Tips</h3>
                <p>Here are my best tips for capturing urban landscapes...</p>
            </article>
        </div>
        
        <article class="hidden-post" style="visibility: hidden;">
            <center>
                <font size="4" color="red">BREAKING: Eastside Station Investigation</font>
            </center>
            <br>
            <center>
                <font size="3">
                    I've been investigating the old Eastside Station for weeks. 
                    The truth about what happened there in the 90s is finally coming to light.
                </font>
            </center>
            <br>
            <div style="text-align: center;">
                <font color="blue" size="3">
                    <strong>Going live at midnight with the truth.</strong>
                </font>
            </div>
            <br>
            <center>
                <font size="2">Posted 2 days ago - Sam</font>
            </center>
        </article>
    </main>
</body>
</html>`,
        brokenCss: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #1e3c72, #2a5298);
    color: white;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

.content {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255,255,255,0.1);
    padding: 30px;
    border-radius: 15px;
    backdrop-filter: blur(10px);
}

.post {
    background: rgba(255,255,255,0.2);
    padding: 20px;
    margin: 20px 0;
    border-radius: 10px;
    border-left: 4px solid #4ade80;
}

.hidden-post {
    background: rgba(255,255,255,0.95);
    color: #1f2937;
    padding: 30px;
    margin: 30px 0;
    border-radius: 12px;
    border: 3px solid #dc2626;
}`,
        targetHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Blog - Hidden Post</title>
</head>
<body>
    <header>
        <h1>Sam's Urban Explorer Blog</h1>
    </header>
    
    <main class="content">
        <div class="post-list">
            <article class="post">
                <h3>Exploring Abandoned Places</h3>
                <p>Today I visited some incredible abandoned locations...</p>
            </article>
            
            <article class="post">
                <h3>Urban Photography Tips</h3>
                <p>Here are my best tips for capturing urban landscapes...</p>
            </article>
        </div>
        
        <article class="hidden-post" style="visibility: visible;">
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
        </article>
    </main>
</body>
</html>`,
        targetCss: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #1e3c72, #2a5298);
    color: white;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

.content {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255,255,255,0.1);
    padding: 30px;
    border-radius: 15px;
    backdrop-filter: blur(10px);
}

.post {
    background: rgba(255,255,255,0.2);
    padding: 20px;
    margin: 20px 0;
    border-radius: 10px;
    border-left: 4px solid #4ade80;
}

.hidden-post {
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
        successConditions: [
          'Change visibility: hidden to visibility: visible',
          'Replace <center> and <font> tags with modern CSS',
          'Use semantic HTML5 elements for proper structure',
          'Apply modern flexbox or CSS layout techniques'
        ],
        clueRevealed: 'Going live at midnight with the truth.',
        aiHints: [
          'This post is hidden with visibility: hidden. Let\'s make it visible!',
          'Those old <center> and <font> tags need to be modernized with CSS.',
          'Try using semantic elements like <header>, <section>, and <footer>.',
          'Excellent! Now we know Sam planned to go live at midnight. This case is coming together!'
        ]
      }
    ],
    finalResolution: `🎉 **CASE SOLVED: The Vanishing Blogger**

    After fixing Sam's broken blog and uncovering all three clues, the truth is revealed:

    **The Resolution:**
    Police traced Sam's planned midnight live stream to the abandoned Eastside Station. When they arrived, they found Sam setting up camera equipment for what he called "the biggest story of the decade."

    **The Truth:**
    Sam had staged his own disappearance as a publicity stunt! He planned to "reappear" during a live stream at the old station, claiming he had been investigating corruption there. The broken website was intentional - he wanted people to dig deeper and find the clues.

    **The Arrest:**
    Sam was arrested for filing a false missing person report and wasting police resources. His followers were disappointed to learn the whole mystery was fake.

    **Your Detective Work:**
    By fixing the HTML/CSS issues, you uncovered:
    1. Sam's Instagram story hint
    2. The location clue about the abandoned station  
    3. His plan to go live at midnight

    **Case Status:** ✅ CLOSED - Suspect in custody, mystery solved!

    Great work, Detective! Your web development skills helped crack the case.`,
    // Legacy fields for compatibility
    initialHtml: '',
    initialCss: '',
    targetHtml: '',
    targetCss: '',
    hints: [],
    cluePoints: 300,
    difficulty: 'Beginner',
    duration: '15-20 min'
  },
  {
    id: 'case-2',
    title: 'The Missing Navigation Mystery',
    description: 'A modern website\'s navigation has disappeared! Use smart IDE features to create a professional header with navigation.',
    story: `Detective, TechCorp's website navigation has gone missing! The company needs a modern, responsive navigation bar that works on all devices.
    
    Use our Smart IDE to:
    • Try typing "nav" and use auto-complete to insert a navigation snippet
    • Add CSS with "flex-center" snippet for modern alignment
    • Use the code quality analyzer to improve your code
    • Get real-time AI suggestions for better practices
    
    The Smart IDE will guide you with professional features like auto-closing tags, intelligent suggestions, and code quality feedback!`,
    objective: 'Create a modern navigation header using the Smart IDE features including auto-complete, snippets, and AI suggestions.',
    initialHtml: `<div class="container">
  <div class="content">
    <h1>Welcome to TechCorp</h1>
    <p>We provide cutting-edge technology solutions.</p>
  </div>
  
  <div class="navigation">
    <a href="#home">Home</a>
    <a href="#about">About</a>
    <a href="#services">Services</a>
    <a href="#contact">Contact</a>
  </div>
  
  <div class="main-content">
    <h2>Our Services</h2>
    <p>We offer a wide range of technology services to help your business grow.</p>
  </div>
</div>`,
    initialCss: `.container {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.content {
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
}

.navigation {
  background-color: #333;
  padding: 10px;
}

.navigation a {
  color: white;
  text-decoration: none;
  margin: 0 15px;
}

.main-content {
  padding: 20px;
  background-color: white;
}`,
    targetHtml: `<div class="container">
  <header class="header">
    <div class="content">
      <h1>Welcome to TechCorp</h1>
      <p>We provide cutting-edge technology solutions.</p>
    </div>
    
    <nav class="navigation">
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
  
  <div class="main-content">
    <h2>Our Services</h2>
    <p>We offer a wide range of technology services to help your business grow.</p>
  </div>
</div>`,
    targetCss: `.container {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.header {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.content {
  padding: 20px;
  text-align: center;
}

.navigation {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: flex;
  justify-content: center;
}

.navigation a {
  color: white;
  text-decoration: none;
  margin: 0 15px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navigation a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.main-content {
  padding: 20px;
  background-color: white;
}`,
    hints: [
      "🔍 **Step 1 - Find the Navigation**: Look at line 7-12 in your HTML. You have a `<div class=\"navigation\">` - this should be a `<nav>` tag for better semantics! **Smart Tip**: Click 'Smart Snippets' → 'nav' to fix this automatically!",
      "🎨 **Step 2 - Style the Header**: Your content div (lines 2-5) should be wrapped in a `<header>` tag. **Smart Tip**: Click 'Smart Snippets' → 'header' to wrap it properly, then switch to CSS tab.",
      "⚡ **Step 3 - Modern CSS Layout**: In CSS tab, your `.navigation` class needs flexbox for modern alignment. **Smart Tip**: Click 'Smart Snippets' → 'flex-center' to add `display: flex` and centering properties instantly!",
      "✨ **Step 4 - Professional Styling**: Add a gradient background to your header and hover effects to navigation links. **Smart Tip**: The CSS snippets include modern gradients and transitions - try them out!"
    ],
    cluePoints: 100,
    difficulty: 'Beginner',
    duration: '15 min'
  },
  {
    id: 'case-3',
    title: 'The Broken Button Caper',
    description: 'Interactive buttons have stopped working. Master CSS hover effects and transitions.',
    story: `A popular e-commerce site has reported that their call-to-action buttons have lost their interactive appeal. Customers are no longer clicking on them, and sales have dropped dramatically.
    
    The buttons exist, but they look flat and unresponsive. They need proper hover effects, transitions, and visual feedback to encourage user interaction.
    
    Your detective skills are needed to restore these buttons to their former glory and save the company's conversion rates!`,
    objective: 'Add proper hover effects, transitions, and interactive styling to make the buttons engaging and clickable.',
    initialHtml: `<div class="container">
  <h1>Special Offers</h1>
  <div class="offers">
    <div class="offer-card">
      <h3>Premium Package</h3>
      <p>Get access to all premium features</p>
      <button class="btn">Buy Now - $99</button>
    </div>
    
    <div class="offer-card">
      <h3>Standard Package</h3>
      <p>Perfect for small businesses</p>
      <button class="btn">Buy Now - $49</button>
    </div>
    
    <div class="offer-card">
      <h3>Basic Package</h3>
      <p>Great for getting started</p>
      <button class="btn">Buy Now - $19</button>
    </div>
  </div>
</div>`,
    targetHtml: `<div class="container">
  <h1>Special Offers</h1>
  <div class="offers">
    <div class="offer-card">
      <h3>Premium Package</h3>
      <p>Get access to all premium features</p>
      <button class="btn">Buy Now - $99</button>
    </div>
    
    <div class="offer-card">
      <h3>Standard Package</h3>
      <p>Perfect for small businesses</p>
      <button class="btn">Buy Now - $49</button>
    </div>
    
    <div class="offer-card">
      <h3>Basic Package</h3>
      <p>Great for getting started</p>
      <button class="btn">Buy Now - $19</button>
    </div>
  </div>
</div>`,
    initialCss: `.container {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.offers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.offer-card {
  background: white;
  border: 1px solid #ddd;
  padding: 20px;
  text-align: center;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 15px;
}`,
    targetCss: `.container {
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.offers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.offer-card {
  background: white;
  border: 1px solid #ddd;
  padding: 20px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.offer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.btn {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 15px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.btn:hover {
  background: linear-gradient(135deg, #0056b3, #004085);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.3);
}`,
    hints: [
      "👆 **Step 1 - Make Buttons Clickable**: Your buttons (lines 6, 12, 18) look flat! Add `cursor: pointer` to the `.btn` CSS class so users know they can click them. **Smart Tip**: Click 'Smart Snippets' → 'button-modern' for instant professional buttons!",
      "✨ **Step 2 - Add Hover Effects**: Buttons need visual feedback when users hover over them. Add a `:hover` pseudo-class to change the background color. **Smart Tip**: The 'button-modern' snippet includes perfect hover animations!",
      "🎭 **Step 3 - Smooth Transitions**: Make interactions feel professional with `transition: all 0.3s ease` on your buttons. This creates smooth color and movement changes. **Smart Tip**: Already included in the 'button-modern' snippet!",
      "🃏 **Step 4 - Card Enhancement**: Your offer cards need depth! Add shadows and hover effects to make them feel interactive. **Smart Tip**: Click 'Smart Snippets' → 'card-style' to add professional shadows and lift animations!"
    ],
    cluePoints: 150,
    difficulty: 'Beginner',
    duration: '20 min'
  }
];