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
  // Field to mark cases as coming soon
  isComingSoon?: boolean;
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
  clueUnlockCondition: string; // What the user needs to do to reveal the clue
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
    title: 'Detective Tutorial Case',
    description: 'Learn the basics! A local blogger has gone missing. Fix his broken blog to uncover the truth behind his disappearance.',
    story: `**🎓 TUTORIAL MISSION**

    Welcome to CodeCase! This tutorial will teach you everything you need to know about our detective coding platform.

    Sam Lens, a popular local blogger, has vanished without a trace. His last known activity was on his personal blog, which is now broken and messy. As a web detective, you must fix the HTML and CSS issues to reveal hidden clues about what happened to Sam.

    **What You'll Learn:**
    • How to navigate the CodeCase interface
    • Using the AI partner for help and guidance
    • Understanding the hint system
    • Reading validation feedback
    • Collecting detective achievements

    **Your Mission**: Navigate through three critical clues hidden within Sam's broken blog code. Each clue will bring you closer to solving the mystery of his disappearance.

    **Detective Tools**: Use your HTML/CSS skills to:
    • Replace outdated tags with modern alternatives
    • Reveal hidden content by fixing CSS visibility
    • Modernize broken layouts using flexbox
    • Uncover the truth behind Sam's vanishing act

    Complete this tutorial to unlock the full visual investigation experience!`,
    objective: 'TUTORIAL: Learn CodeCase basics by investigating Sam\'s broken blog and fixing HTML/CSS issues to reveal three hidden clues.',
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
        title: 'Clue 1: The Truth About NovaCorp',
        description: 'Sam\'s explosive blog post about NovaCorp contains a hidden message. Fix the broken HTML to unlock Clue 1 and reveal what Sam discovered.',
        objective: 'Replace deprecated HTML tags and reveal the hidden content to unlock Clue 1.',
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

    <p>They won't find me if I keep moving, but they're watching. Always watching.</p>

    <p>Stay safe, and if they get me, keep searching for the truth. Maybe it's not just me they want to silence.</p>

    <center><p>Sam out.</p></center>
</body>
</html>`,
        brokenCss: `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

h1 {
    color: #d32f2f;
    margin-bottom: 30px;
}

p {
    line-height: 1.6;
    margin: 20px 0;
    font-size: 16px;
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

        <div class="revealed-message">
            <p><strong>Check my last Insta story before they wipe it.</strong></p>
        </div>

        <p>They control everything: the media, the feeds, the ads. They think they can silence me like they silenced others.</p>

        <p>They won't find me if I keep moving, but they're watching. Always watching.</p>

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

h1 {
    color: #d32f2f;
    margin-bottom: 30px;
}

p {
    line-height: 1.6;
    margin: 20px 0;
    font-size: 16px;
}

.revealed-message {
    background: #fff3cd;
    border: 2px solid #f0ad4e;
    padding: 15px;
    border-radius: 8px;
    margin: 25px 0;
    animation: highlight 2s ease-in-out;
}

.revealed-message p {
    margin: 0;
    color: #856404;
    font-weight: bold;
    text-align: center;
}

footer {
    text-align: center;
    margin-top: 40px;
    font-style: italic;
}

@keyframes highlight {
    0%, 100% { background: #fff3cd; }
    50% { background: #fcf8e3; }
}`,
        successConditions: [
          'Remove the hidden attribute and make the message visible',
          'Replace <center> tags with proper HTML structure'
        ],
        clueRevealed: 'Check my last Insta story before they wipe it.',
        clueUnlockCondition: 'Remove the "hidden" attribute from the paragraph to reveal Sam\'s secret message',
        aiHints: [
          '� **Hidden Message Alert**: I can see there\'s a paragraph with the `hidden` attribute! This is blocking a secret message. Simply remove the word `hidden` from that paragraph to reveal Sam\'s clue.',
          '�️ **Old HTML Detected**: I notice some `<center>` tags in the code. These are outdated! Just delete the opening `<center>` and closing `</center>` tags to clean up the code.',
          '✨ **Perfect! Clue 1 Found**: Great detective work! You\'ve revealed Sam\'s secret message: "Check my last Insta story before they wipe it." This gives us our first lead in the investigation!'
        ],
        hintsSteps: [
          {
            id: 'remove-center',
            condition: 'Remove <center> tags',
            hint: '🎯 **Modernize HTML**: Replace the old `<center>` tags with semantic elements like `<header>` for the title and `<footer>` for the signature. Modern web development uses semantic HTML!',
            points: 3
          },
          {
            id: 'reveal-hidden-message',
            condition: 'Remove hidden attribute',
            hint: '� Remove the "hidden" attribute to unlock Clue 1 and reveal Sam\'s secret message!',
            points: 5
          },
          {
            id: 'add-semantic-elements',
            condition: 'Add semantic HTML5 elements',
            hint: '📝 Use <header>, <main>, and <footer> for proper document structure!',
            points: 4
          }
        ]
      },
      {
        id: 'clue-2',
        title: 'Clue 2: The Hidden Instagram Screenshot',
        description: 'Sam\'s investigation files contain hidden Instagram evidence. Fix the CSS to unlock Clue 2 and see what Sam discovered.',
        objective: 'Fix the CSS display property to reveal the hidden Instagram screenshot and unlock Clue 2.',
        brokenHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Investigation Files</title>
</head>
<body>
    <header>
        <h1>My Investigation Archive</h1>
    </header>
    
    <main>
        <section class="investigation-notes">
            <h2>Recent Findings</h2>
            <p>I've been gathering evidence for weeks. The corruption runs deeper than anyone imagined.</p>
            <p>If something happens to me, these files contain everything you need to know.</p>
        </section>
        
        <section class="evidence">
            <h3>Digital Evidence</h3>
            <div class="file-grid">
                <div class="file-item">Document_1.pdf</div>
                <div class="file-item">Audio_Recording.mp3</div>
                <div class="file-item">Email_Thread.eml</div>
            </div>
        </section>
        
        <section id="insta-clue" class="instagram-evidence">
            <h3>Social Media Evidence</h3>
            <div class="social-post">
                <img src="insta_screenshot.png" alt="Instagram Screenshot with text: 'Meet me where the shadows watch but the cameras don't.'">
                <div class="caption">
                    <p><strong>Screenshot from my last Instagram story</strong></p>
                    <p class="clue-text">"Meet me where the shadows watch but the cameras don't."</p>
                </div>
            </div>
        </section>
        
        <section class="warning">
            <p><strong>Warning:</strong> If you're reading this, I may be in danger. Follow the clues carefully.</p>
        </section>
    </main>
</body>
</html>`,
        brokenCss: `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
}

header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #d32f2f;
    padding-bottom: 20px;
}

h1 {
    color: #d32f2f;
    margin: 0;
}

section {
    background: white;
    margin: 20px 0;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 15px 0;
}

.file-item {
    background: #f8f9fa;
    padding: 15px;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    text-align: center;
    font-family: monospace;
}

#insta-clue {
    display: none;
}

.social-post {
    text-align: center;
}

.social-post img {
    max-width: 300px;
    height: auto;
    border: 3px solid #e1306c;
    border-radius: 12px;
    margin-bottom: 15px;
}

.caption {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #e1306c;
}

.clue-text {
    font-size: 1.2em;
    font-weight: bold;
    color: #e1306c;
    margin: 10px 0;
}

.warning {
    background: #fff3cd !important;
    border: 2px solid #ffc107 !important;
    color: #856404;
}`,
        targetHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Investigation Files</title>
</head>
<body>
    <header>
        <h1>My Investigation Archive</h1>
    </header>
    
    <main>
        <section class="investigation-notes">
            <h2>Recent Findings</h2>
            <p>I've been gathering evidence for weeks. The corruption runs deeper than anyone imagined.</p>
            <p>If something happens to me, these files contain everything you need to know.</p>
        </section>
        
        <section class="evidence">
            <h3>Digital Evidence</h3>
            <div class="file-grid">
                <div class="file-item">Document_1.pdf</div>
                <div class="file-item">Audio_Recording.mp3</div>
                <div class="file-item">Email_Thread.eml</div>
            </div>
        </section>
        
        <section id="insta-clue" class="instagram-evidence">
            <h3>Social Media Evidence</h3>
            <div class="social-post">
                <img src="insta_screenshot.png" alt="Instagram Screenshot with text: 'Meet me where the shadows watch but the cameras don't.'">
                <div class="caption">
                    <p><strong>Screenshot from my last Instagram story</strong></p>
                    <p class="clue-text">"Meet me where the shadows watch but the cameras don't."</p>
                </div>
            </div>
        </section>
        
        <section class="warning">
            <p><strong>Warning:</strong> If you're reading this, I may be in danger. Follow the clues carefully.</p>
        </section>
    </main>
</body>
</html>`,
        targetCss: `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
}

header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #d32f2f;
    padding-bottom: 20px;
}

h1 {
    color: #d32f2f;
    margin: 0;
}

section {
    background: white;
    margin: 20px 0;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 15px 0;
}

.file-item {
    background: #f8f9fa;
    padding: 15px;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    text-align: center;
    font-family: monospace;
}

#insta-clue {
    display: block;
    border: 3px solid #e1306c;
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    animation: revealEvidence 1.5s ease-in-out;
}

.social-post {
    text-align: center;
}

.social-post img {
    max-width: 300px;
    height: auto;
    border: 3px solid #e1306c;
    border-radius: 12px;
    margin-bottom: 15px;
    box-shadow: 0 4px 8px rgba(225, 48, 108, 0.3);
}

.caption {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #e1306c;
}

.clue-text {
    font-size: 1.2em;
    font-weight: bold;
    color: #e1306c;
    margin: 10px 0;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.warning {
    background: #fff3cd !important;
    border: 2px solid #ffc107 !important;
    color: #856404;
}

@keyframes revealEvidence {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`,
        successConditions: [
          'Change display: none to display: block on #insta-clue element',
          'Style the revealed Instagram evidence section appropriately'
        ],
        clueRevealed: 'Meet me where the shadows watch but the cameras don\'t.',
        clueUnlockCondition: 'Change the CSS display property from "none" to "block" on the #insta-clue element to reveal the hidden Instagram evidence',
        aiHints: [
          '🕵️ **Evidence Discovery**: Sam\'s investigation files contain hidden Instagram evidence! I can see there\'s an element with `id="insta-clue"` that\'s currently hidden from view.',
          '🔍 **CSS Detective Work**: Look in the CSS for the `#insta-clue` selector. I bet it has `display: none` - change this to `display: block` to reveal the hidden Instagram screenshot!',
          '🎨 **Styling Tip**: Once revealed, add some nice styling like borders, backgrounds, or animations to make the evidence stand out and look professional.',
          '✨ **Breakthrough! Clue 2 Revealed**: Outstanding detective work! You\'ve uncovered Clue 2: "Meet me where the shadows watch but the cameras don\'t." This cryptic message must be referring to a specific location - somewhere off the surveillance grid!'
        ],
        hintsSteps: [
          {
            id: 'find-hidden-element',
            condition: 'Locate the hidden Instagram evidence',
            hint: '🔍 **Hidden Evidence**: Look for an element with `id="insta-clue"` in the HTML. This contains Sam\'s Instagram screenshot that\'s currently hidden!',
            points: 3
          },
          {
            id: 'fix-display-none',
            condition: 'Change display: none to display: block',
            hint: '👁️ **CSS Display Fix**: Find the CSS rule for `#insta-clue` and change `display: none` to `display: block` to reveal the Instagram evidence!',
            points: 5
          },
          {
            id: 'style-evidence',
            condition: 'Add styling to the revealed evidence',
            hint: '🎨 **Evidence Styling**: Make the revealed Instagram evidence stand out with borders, backgrounds, or animations to highlight this important clue!',
            points: 4
          }
        ]
      },
      {
        id: 'clue-3',
        title: 'Clue 3: The Final Location',
        description: 'Sam\'s final message contains the key to finding him, but it\'s hidden in broken code. Fix the HTML and CSS to unlock the final Clue 3.',
        objective: 'Replace deprecated font tags and fix visibility to unlock Clue 3 and discover Sam\'s location.',
        brokenHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Final Message</title>
</head>
<body>
    <header>
        <h1>If You're Reading This...</h1>
    </header>
    
    <main>
        <section class="final-warning">
            <p>I don't have much time. They're closing in, and this might be my last chance to leave a trail.</p>
            <p>The evidence I've gathered will expose everything, but I need to disappear for a while.</p>
        </section>
        
        <section class="location-clue">
            <h2>Meeting Point</h2>
            <p>I've found the perfect place where old security doesn't reach and new surveillance hasn't arrived yet.</p>
            
            <div id="address-clue">
                <font color="red" size="5">
                    Warehouse 17, Dockside Street, 12:00 AM.
                </font>
            </div>
            
            <p>This is where I'll broadcast the truth to the world. The whole story will come out at midnight.</p>
        </section>
        
        <section class="final-plea">
            <p>If I don't make it back, tell everyone what really happened. The world deserves to know.</p>
            <p><strong>Remember: The truth can't stay buried forever.</strong></p>
        </section>
    </main>
</body>
</html>`,
        brokenCss: `body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #1e3c72, #2a5298);
    color: white;
    padding: 20px;
    min-height: 100vh;
    margin: 0;
}

header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #ffffff33;
    padding-bottom: 20px;
}

h1 {
    color: #fff;
    font-size: 2.5rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

main {
    max-width: 800px;
    margin: 0 auto;
}

section {
    background: rgba(255,255,255,0.1);
    padding: 25px;
    margin: 20px 0;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
}

h2 {
    color: #ffeb3b;
    margin-top: 0;
}

p {
    line-height: 1.6;
    margin: 15px 0;
}

#address-clue {
    visibility: hidden;
}

.final-plea {
    border: 2px solid #ff9800;
    background: rgba(255, 152, 0, 0.2);
}`,
        targetHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Final Message</title>
</head>
<body>
    <header>
        <h1>If You're Reading This...</h1>
    </header>
    
    <main>
        <section class="final-warning">
            <p>I don't have much time. They're closing in, and this might be my last chance to leave a trail.</p>
            <p>The evidence I've gathered will expose everything, but I need to disappear for a while.</p>
        </section>
        
        <section class="location-clue">
            <h2>Meeting Point</h2>
            <p>I've found the perfect place where old security doesn't reach and new surveillance hasn't arrived yet.</p>
            
            <div id="address-clue" class="critical-location">
                <h3>Final Location:</h3>
                <p><strong>Warehouse 17, Dockside Street, 12:00 AM.</strong></p>
            </div>
            
            <p>This is where I'll broadcast the truth to the world. The whole story will come out at midnight.</p>
        </section>
        
        <section class="final-plea">
            <p>If I don't make it back, tell everyone what really happened. The world deserves to know.</p>
            <p><strong>Remember: The truth can't stay buried forever.</strong></p>
        </section>
    </main>
</body>
</html>`,
        targetCss: `body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #1e3c72, #2a5298);
    color: white;
    padding: 20px;
    min-height: 100vh;
    margin: 0;
}

header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #ffffff33;
    padding-bottom: 20px;
}

h1 {
    color: #fff;
    font-size: 2.5rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

main {
    max-width: 800px;
    margin: 0 auto;
}

section {
    background: rgba(255,255,255,0.1);
    padding: 25px;
    margin: 20px 0;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
}

h2 {
    color: #ffeb3b;
    margin-top: 0;
}

p {
    line-height: 1.6;
    margin: 15px 0;
}

#address-clue {
    visibility: visible;
}

.critical-location {
    background: rgba(220, 38, 38, 0.9);
    border: 3px solid #ff4444;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    margin: 20px 0;
    animation: pulseWarning 2s infinite;
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
}

.critical-location h3 {
    color: #ffeb3b;
    margin: 0 0 10px 0;
    font-size: 1.3rem;
}

.critical-location p {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
}

.final-plea {
    border: 2px solid #ff9800;
    background: rgba(255, 152, 0, 0.2);
}

@keyframes pulseWarning {
    0%, 100% {
        box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
    }
    50% {
        box-shadow: 0 0 30px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.3);
    }
}`,
        successConditions: [
          'Change visibility: hidden to visibility: visible on #address-clue',
          'Replace <font> tags with modern CSS styling',
          'Apply proper styling to the revealed location information'
        ],
        clueRevealed: 'Warehouse 17, Dockside Street, 12:00 AM.',
        clueUnlockCondition: 'Change the CSS visibility property from "hidden" to "visible" on the #address-clue element to reveal Sam\'s final location',
        aiHints: [
          '🕵️ **Final Investigation**: We\'re close to finding Sam! I can see there\'s an element with `id="address-clue"` that contains critical location information, but it\'s hidden with `visibility: hidden`.',
          '👀 **CSS Visibility Fix**: Look for the `#address-clue` selector in the CSS and change `visibility: hidden` to `visibility: visible` to reveal Sam\'s exact location!',
          '🧹 **Code Cleanup**: I also notice some old `<font>` tags in the HTML - these are deprecated! Replace them with modern CSS styling for better practices.',
          '� **Case Solved! Final Clue Revealed**: Incredible detective work! You\'ve uncovered the final Clue 3: "Warehouse 17, Dockside Street, 12:00 AM." - We\'ve found Sam\'s location! The mystery is solved!'
        ],
        hintsSteps: [
          {
            id: 'find-address-clue',
            condition: 'Locate the hidden address information',
            hint: '🕵️ **Hidden Location**: Look for an element with `id="address-clue"` in the HTML. This contains Sam\'s final location but it\'s currently hidden!',
            points: 3
          },
          {
            id: 'fix-visibility-hidden',
            condition: 'Change visibility: hidden to visibility: visible',
            hint: '👁️ **CSS Visibility Fix**: Find the CSS rule for `#address-clue` and change `visibility: hidden` to `visibility: visible` to reveal the location!',
            points: 5
          },
          {
            id: 'modernize-font-tags',
            condition: 'Replace deprecated <font> tags',
            hint: '🧹 **Modernize HTML**: Replace the old `<font>` tags with modern CSS styling using classes or inline styles for better web standards!',
            points: 4
          }
        ]
      }
    ],
    finalResolution: `🎉 **CASE SOLVED: The Vanishing Blogger**

    After fixing Sam's broken blog and uncovering all three clues, the truth is revealed:

    **The Resolution:**
    Police traced Sam's planned midnight broadcast to Warehouse 17 on Dockside Street. When they arrived at 11:45 PM, they found Sam setting up professional streaming equipment for what he claimed would be "the exposé of the century."

    **The Truth:**
    Sam had staged his own disappearance as an elaborate publicity stunt! He planned to "reappear" during a dramatic live stream, claiming he had been in hiding while investigating NovaCorp corruption. The broken website was intentional - he wanted people to dig deeper and find the clues leading to his "dramatic return."

    **The Arrest:**
    Sam was arrested for filing a false missing person report, wasting police resources, and public mischief. His followers were devastated to learn the whole conspiracy was fabricated for social media fame and potential book deals.

    **Your Detective Work:**
    By fixing the HTML/CSS issues, you uncovered:
    1. ✅ Sam's hidden message about checking his Instagram story
    2. ✅ The Instagram screenshot revealing the cryptic meeting location  
    3. ✅ The exact address and timing: Warehouse 17, Dockside Street, 12:00 AM

    **Case Status:** ✅ CLOSED - Suspect in custody, mystery solved!

    **Skills Learned:**
    • Replacing deprecated HTML tags with semantic elements
    • Fixing CSS visibility and display properties
    • Modern HTML5 structure and best practices
    • CSS animations and styling techniques

    Outstanding work, Detective! Your web development skills helped crack this digital mystery. The internet is a safer place thanks to your coding expertise! 🕵️‍♂️💻`,
    // Legacy fields for compatibility - START WITH BROKEN CODE
    initialHtml: `<!DOCTYPE html>
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

    <p>They won't find me if I keep moving, but they're watching. Always watching.</p>

    <p>Stay safe, and if they get me, keep searching for the truth. Maybe it's not just me they want to silence.</p>

    <center><p>Sam out.</p></center>
</body>
</html>`,
    initialCss: `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

h1 {
    color: #d32f2f;
    margin-bottom: 30px;
}

p {
    line-height: 1.6;
    margin: 20px 0;
    font-size: 16px;
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

        <div class="revealed-message">
            <p><strong>Check my last Insta story before they wipe it.</strong></p>
        </div>

        <p>They control everything: the media, the feeds, the ads. They think they can silence me like they silenced others.</p>

        <p>They won't find me if I keep moving, but they're watching. Always watching.</p>

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

h1 {
    color: #d32f2f;
    margin-bottom: 30px;
}

p {
    line-height: 1.6;
    margin: 20px 0;
    font-size: 16px;
}

.revealed-message {
    background: #fff3cd;
    border: 2px solid #f0ad4e;
    padding: 15px;
    border-radius: 8px;
    margin: 25px 0;
    animation: highlight 2s ease-in-out;
}

.revealed-message p {
    margin: 0;
    color: #856404;
    font-weight: bold;
    text-align: center;
}

footer {
    text-align: center;
    margin-top: 40px;
    font-style: italic;
}

@keyframes highlight {
    0%, 100% { background: #fff3cd; }
    50% { background: #fcf8e3; }
}`,
    hints: [],
    cluePoints: 750,
    difficulty: 'Beginner',
    duration: '20-25 min'
  },
  {
    id: 'visual-vanishing-blogger',
    title: 'Vanishing Blogger',
    description: 'Your first real case! A tech blogger named Rishi has vanished. Use visual investigation and coding skills to uncover the truth.',
    story: `🔍 **FIRST REAL CASE - VISUAL INVESTIGATION**

    Congratulations Detective! You've completed the tutorial. Now it's time for your first real case featuring our advanced visual investigation system.

    Rishi Nair, a tech and health blogger, has been reported missing after posting about exposing Sherpa companies. The police suspect foul play, but your tech skills might reveal the real truth.

    **New Features You'll Experience:**
    • Cinematic investigation scenes with character dialogue
    • Point-and-click evidence collection
    • Real coding puzzles integrated into the story
    • Multiple evidence pieces to analyze
    • Dramatic conclusion with real-world consequences

    **Your Mission**: Navigate through Rishi's apartment building, investigate his room, and solve HTML/CSS puzzles hidden in his devices to uncover the shocking truth about his "disappearance."

    This case represents the future of detective coding - where programming skills meet immersive storytelling!`,
    objective: 'Use visual investigation techniques and coding skills to solve the mystery of Rishi\'s disappearance.',
    initialHtml: '', // Not used for visual investigation
    initialCss: '', // Not used for visual investigation  
    targetHtml: '', // Not used for visual investigation
    targetCss: '', // Not used for visual investigation
    hints: [
      'Look for CSS properties that hide elements',
      'Check flex container alignment properties', 
      'Adjust overflow and positioning values',
      'Fix grid-auto-rows for proper layout'
    ],
    cluePoints: 750,
    difficulty: 'Beginner',
    duration: '15-20 min',
    isDetectiveMission: false // Special visual case, not standard detective mission
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
    duration: '15 min',
    isComingSoon: true
  },
  {
    id: 'case-3',
    title: 'Last Frame',
    description: 'A murder investigation in Arjun’s apartment. Use detective skills and HTML/CSS debugging to reveal clues and catch the killer.',
    story: `Arjun Shetty, a crime photographer, is found dead in his 1BHK apartment. Police find only a broken coffee cup near the body. Your team is called to investigate his digital and physical traces.\n\nYou are a web detective who fixes Arjun’s broken local files to reveal hidden photos and text clues to find the killer.\n\nScene: Arjun’s Apartment (pixel-art 1BHK hall, arjun_room.png).\n\nCharacters:\n• police_guy.png – introduces the case outside the building.\n• subordinate.png – explains what you need to investigate in the room.\n• hint_guy.png – appears only when hints are needed, guiding where to look or what CSS to check.\n\nGameplay: Click interactive images (laptop, books, phone) to open HTML/CSS debug micro-puzzles revealing hidden clues.\n\nObjectives:\n1️⃣ Laptop: Fix hidden/misaligned image containers (laptop_closeup.png) to reveal photos: a boy at night, an expensive car, a family crest.\n2️⃣ Books: Fix hidden div in books (books_closeup.png) to reveal a photo snippet of a boy arguing in an alleyway.\n3️⃣ Phone: Fix glitchy gallery webpage (phone_closeup.png) to reveal a message about “a boy whose family controls the biggest company in the city.”\n\nProgression: After all clues, subordinate suggests questioning the boy in the photos.\n\nInterrogation: (room with dark overlay, boy_hoodie.png and police_guy.png). Player shows recovered photos. Minimal CSS fix reveals a timestamp proving the boy’s location.\n\nClimax: The boy confesses to killing Arjun in a rage after being threatened with exposure, claiming it was an accident. The police arrest him, and the case is closed.`,
    objective: 'Investigate Arjun’s apartment, debug HTML/CSS micro-puzzles, and reveal clues to solve the murder.',
    initialHtml: `<div class="room">
  <img src="arjun_room.png" alt="Arjun’s Apartment" class="scene-bg" />
  <img src="police_guy.png" class="character police" />
  <img src="subordinate.png" class="character subordinate" />
  <div class="interactives">
    <img src="laptop_closeup.png" class="interactive laptop" alt="Laptop" />
    <img src="books_closeup.png" class="interactive books" alt="Books" />
    <img src="phone_closeup.png" class="interactive phone" alt="Phone" />
  </div>
</div>`,
    initialCss: `.room {
  position: relative;
  width: 900px;
  height: 600px;
  background: #222;
}
.scene-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}
.character {
  position: absolute;
  z-index: 2;
}
.police {
  left: 30px;
  bottom: 0;
}
.subordinate {
  right: 30px;
  bottom: 0;
}
.interactives {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}
.interactive {
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s;
}
.interactive:hover {
  opacity: 1;
  filter: drop-shadow(0 0 8px #fff);
}
.laptop {
  position: absolute;
  left: 60%;
  top: 55%;
  width: 90px;
}
.books {
  position: absolute;
  left: 35%;
  top: 70%;
  width: 80px;
}
.phone {
  position: absolute;
  left: 75%;
  top: 80%;
  width: 60px;
}
`,
    targetHtml: `<div class="room">
  <img src="arjun_room.png" alt="Arjun’s Apartment" class="scene-bg" />
  <img src="police_guy.png" class="character police" />
  <img src="subordinate.png" class="character subordinate" />
  <div class="interactives">
    <img src="laptop_closeup.png" class="interactive laptop" alt="Laptop" />
    <img src="books_closeup.png" class="interactive books" alt="Books" />
    <img src="phone_closeup.png" class="interactive phone" alt="Phone" />
  </div>
</div>`,
    targetCss: `.room {
  position: relative;
  width: 900px;
  height: 600px;
  background: #222;
}
.scene-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}
.character {
  position: absolute;
  z-index: 2;
}
.police {
  left: 30px;
  bottom: 0;
}
.subordinate {
  right: 30px;
  bottom: 0;
}
.interactives {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}
.interactive {
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s;
}
.interactive:hover {
  opacity: 1;
  filter: drop-shadow(0 0 8px #fff);
}
.laptop {
  position: absolute;
  left: 60%;
  top: 55%;
  width: 90px;
}
.books {
  position: absolute;
  left: 35%;
  top: 70%;
  width: 80px;
}
.phone {
  position: absolute;
  left: 75%;
  top: 80%;
  width: 60px;
}
`,
    hints: [
      "🖥️ **Laptop**: Fix hidden/misaligned containers to reveal all photos.",
      "📚 **Books**: Reveal the hidden div between book pages.",
      "📱 **Phone**: Debug the gallery CSS to reveal the message.",
      "💡 **Hint Guy**: Appears if you get stuck, guiding you to the right element or CSS property.",
      "🕵️‍♂️ **Final Interrogation**: Reveal the timestamp in the final scene to solve the case."
    ],
    cluePoints: 200,
    difficulty: 'Intermediate',
    duration: '30 min',
    isComingSoon: true
  },
  {
    id: 'case-broken-portfolio',
    title: 'The Broken Portfolio',
    description: 'A developer\'s portfolio website has critical CSS and HTML issues that need immediate fixing.',
    story: `Alex, a talented web developer, is about to present their portfolio to potential employers tomorrow. However, their website is completely broken! The layout is messed up, images aren't displaying, colors are wrong, and the responsive design has failed.

    **Your Mission**: Fix the critical issues in Alex's portfolio website to make it professional and presentable.

    **The Problems**: 
    • Broken CSS flexbox layout causing content to overflow
    • Missing alt attributes on images hurting accessibility  
    • Incorrect color values making text unreadable
    • Broken responsive design on mobile devices
    • Missing closing tags causing layout chaos`,
    objective: 'Fix the HTML structure, CSS layout, color scheme, and responsive design to create a professional portfolio website.',
    initialHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Alex's Portfolio - Web Developer
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <header class="header">
        <nav class="navigation">
            <div class="logo">Alex Smith</div>
            <ul class="nav-menu">
                <li><a href="#home">Home</li>
                <li><a href="#about">About</li>
                <li><a href="#projects">Projects</li>
                <li><a href="#contact">Contact</li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1>Hi, I'm Alex Smith</h1>
                <p class="hero-subtitle">Full-Stack Web Developer & UI/UX Designer</p>
                <img src="profile.jpg" class="profile-image">
                <button class="cta-button">View My Work</button>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2>About Me</h2>
                <div class="about-grid">
                    <div class="about-text">
                        <p>I'm a passionate web developer with 3+ years of experience creating modern, responsive websites and applications.</p>
                        <div class="skills">
                            <h3>Skills</h3>
                            <div class="skill-tags">
                                <span class="skill-tag">HTML5</span>
                                <span class="skill-tag">CSS3</span>
                                <span class="skill-tag">JavaScript</span>
                                <span class="skill-tag">React</span>
                                <span class="skill-tag">Node.js</span>
                            </div>
                        </div>
                    </div>
                    <div class="about-image">
                        <img src="workspace.jpg" class="workspace-img">
                    </div>
                </div>
        </section>

        <section id="projects" class="projects">
            <div class="container">
                <h2>My Projects</h2>
                <div class="project-grid">
                    <div class="project-card">
                        <img src="project1.jpg" class="project-image">
                        <div class="project-info">
                            <h3>E-Commerce Website</h3>
                            <p>A modern online store built with React and Node.js</p>
                            <div class="project-links">
                                <a href="#" class="project-link">Live Demo</a>
                                <a href="#" class="project-link">GitHub</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-card">
                        <img src="project2.jpg" class="project-image">
                        <div class="project-info">
                            <h3>Task Management App</h3>
                            <p>A productivity app with drag-and-drop functionality</p>
                            <div class="project-links">
                                <a href="#" class="project-link">Live Demo</a>
                                <a href="#" class="project-link">GitHub
                            </div>
                        </div>
                    </div>

                    <div class="project-card">
                        <img src="project3.jpg" class="project-image">
                        <div class="project-info">
                            <h3>Weather Dashboard</h3>
                            <p>Real-time weather app with beautiful animations</p>
                            <div class="project-links">
                                <a href="#" class="project-link">Live Demo</a>
                                <a href="#" class="project-link">GitHub</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Alex Smith. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`,
    initialCss: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #ffffff;
    background: #000000;
}

.header {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.navigation {
    display: flexbox;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #00ff00;
}

.nav-menu {
    display: flexbox;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: #ff0000;
    text-decoration: none;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: #ffffff;
}

.hero {
    height: 100vh;
    display: flexbox;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding-top: 80px;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #00ff00;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #ff0000;
}

.profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 2rem 0;
    border: 4px solid #ffffff;
}

.cta-button {
    background: #ff0000;
    color: #00ff00;
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.cta-button:hover {
    background: #00ff00;
    color: #ff0000;
}

.about {
    padding: 5rem 0;
    background: #111111;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.about h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #00ff00;
}

.about-grid {
    display: flexbox;
    gap: 3rem;
    align-items: center;
}

.about-text {
    flex: 1;
}

.about-text p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: #ff0000;
}

.skills h3 {
    margin-bottom: 1rem;
    color: #00ff00;
}

.skill-tags {
    display: flexbox;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-tag {
    background: #333333;
    color: #ff0000;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
}

.about-image {
    flex: 1;
}

.workspace-img {
    width: 100%;
    border-radius: 10px;
}

.projects {
    padding: 5rem 0;
    background: #222222;
}

.projects h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #00ff00;
}

.project-grid {
    display: flexbox;
    gap: 2rem;
    flex-wrap: wrap;
}

.project-card {
    background: #333333;
    border-radius: 10px;
    overflow: hidden;
    flex: 1;
    min-width: 300px;
    transition: transform 0.3s ease;
}

.project-card:hover {
    transform: translateY(-10px);
}

.project-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.project-info {
    padding: 1.5rem;
}

.project-info h3 {
    margin-bottom: 0.5rem;
    color: #00ff00;
}

.project-info p {
    margin-bottom: 1rem;
    color: #ff0000;
}

.project-links {
    display: flexbox;
    gap: 1rem;
}

.project-link {
    color: #00ff00;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid #00ff00;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.project-link:hover {
    background: #00ff00;
    color: #000000;
}

.footer {
    background: #000000;
    padding: 2rem 0;
    text-align: center;
    color: #ff0000;
}

@media (max-width: 768px) {
    .navigation {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-menu {
        flex-direction: column;
        text-align: center;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .about-grid {
        flex-direction: column;
    }
    
    .project-grid {
        flex-direction: column;
    }
}`,
    targetHtml: `<!DOCTYPE html>
<html lang="en">
<head>
    <title>Alex's Portfolio - Web Developer</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <header class="header">
        <nav class="navigation">
            <div class="logo">Alex Smith</div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1>Hi, I'm Alex Smith</h1>
                <p class="hero-subtitle">Full-Stack Web Developer & UI/UX Designer</p>
                <img src="profile.jpg" alt="Alex Smith profile photo" class="profile-image">
                <button class="cta-button">View My Work</button>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2>About Me</h2>
                <div class="about-grid">
                    <div class="about-text">
                        <p>I'm a passionate web developer with 3+ years of experience creating modern, responsive websites and applications.</p>
                        <div class="skills">
                            <h3>Skills</h3>
                            <div class="skill-tags">
                                <span class="skill-tag">HTML5</span>
                                <span class="skill-tag">CSS3</span>
                                <span class="skill-tag">JavaScript</span>
                                <span class="skill-tag">React</span>
                                <span class="skill-tag">Node.js</span>
                            </div>
                        </div>
                    </div>
                    <div class="about-image">
                        <img src="workspace.jpg" alt="Alex's modern workspace setup" class="workspace-img">
                    </div>
                </div>
            </div>
        </section>

        <section id="projects" class="projects">
            <div class="container">
                <h2>My Projects</h2>
                <div class="project-grid">
                    <div class="project-card">
                        <img src="project1.jpg" alt="E-Commerce Website Screenshot" class="project-image">
                        <div class="project-info">
                            <h3>E-Commerce Website</h3>
                            <p>A modern online store built with React and Node.js</p>
                            <div class="project-links">
                                <a href="#" class="project-link">Live Demo</a>
                                <a href="#" class="project-link">GitHub</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-card">
                        <img src="project2.jpg" alt="Task Management App Interface" class="project-image">
                        <div class="project-info">
                            <h3>Task Management App</h3>
                            <p>A productivity app with drag-and-drop functionality</p>
                            <div class="project-links">
                                <a href="#" class="project-link">Live Demo</a>
                                <a href="#" class="project-link">GitHub</a>
                            </div>
                        </div>
                    </div>

                    <div class="project-card">
                        <img src="project3.jpg" alt="Weather Dashboard Interface" class="project-image">
                        <div class="project-info">
                            <h3>Weather Dashboard</h3>
                            <p>Real-time weather app with beautiful animations</p>
                            <div class="project-links">
                                <a href="#" class="project-link">Live Demo</a>
                                <a href="#" class="project-link">GitHub</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Alex Smith. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`,
    targetCss: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333333;
    background: #ffffff;
}

.header {
    background: rgba(255, 255, 255, 0.95);
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #667eea;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    color: #333333;
    text-decoration: none;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: #667eea;
}

.hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding-top: 80px;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ffffff;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #e0e0e0;
}

.profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 2rem 0;
    border: 4px solid #ffffff;
    object-fit: cover;
}

.cta-button {
    background: #ffffff;
    color: #667eea;
    padding: 12px 30px;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.cta-button:hover {
    background: #667eea;
    color: #ffffff;
    transform: translateY(-2px);
}

.about {
    padding: 5rem 0;
    background: #f8f9fa;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.about h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #333333;
}

.about-grid {
    display: flex;
    gap: 3rem;
    align-items: center;
}

.about-text {
    flex: 1;
}

.about-text p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: #666666;
}

.skills h3 {
    margin-bottom: 1rem;
    color: #333333;
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-tag {
    background: #667eea;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
}

.about-image {
    flex: 1;
}

.workspace-img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.projects {
    padding: 5rem 0;
    background: #ffffff;
}

.projects h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: #333333;
}

.project-grid {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
}

.project-card {
    background: #ffffff;
    border-radius: 10px;
    overflow: hidden;
    flex: 1;
    min-width: 300px;
    transition: transform 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.project-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.project-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.project-info {
    padding: 1.5rem;
}

.project-info h3 {
    margin-bottom: 0.5rem;
    color: #333333;
}

.project-info p {
    margin-bottom: 1rem;
    color: #666666;
}

.project-links {
    display: flex;
    gap: 1rem;
}

.project-link {
    color: #667eea;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border: 1px solid #667eea;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.project-link:hover {
    background: #667eea;
    color: #ffffff;
}

.footer {
    background: #333333;
    padding: 2rem 0;
    text-align: center;
    color: #ffffff;
}

@media (max-width: 768px) {
    .navigation {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-menu {
        flex-direction: column;
        text-align: center;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .about-grid {
        flex-direction: column;
    }
    
    .project-grid {
        flex-direction: column;
    }
}`,
    hints: [
      "🏗️ **Step 1 - Fix HTML Structure**: Missing closing tags! Look for unclosed `<title>`, `<a>`, and other tags. Add proper `alt` attributes to images for accessibility.",
      "🎨 **Step 2 - Fix CSS Display Issues**: The layout is broken because `flexbox` should be `flex`. Change all instances of `display: flexbox` to `display: flex`.",
      "🌈 **Step 3 - Fix Color Scheme**: The current colors (#00ff00 green and #ff0000 red) look unprofessional. Replace with a proper color palette using blues (#667eea) and neutral grays.",
      "📱 **Step 4 - Add Missing Elements**: The HTML is missing proper `lang` attribute, some closing tags, and proper semantic structure for better accessibility."
    ],
    cluePoints: 200,
    difficulty: 'Intermediate',
    duration: '30 min',
    isComingSoon: true
  }
];