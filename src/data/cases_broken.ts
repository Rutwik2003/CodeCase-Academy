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
        title: 'Clue 1: The Final Blog Post',
        description: 'Sam\'s last blog post contains hidden messages. Fix the broken HTML to reveal his warning.',
        objective: 'Replace deprecated HTML tags and reveal hidden content to uncover Clue 1.',
        brokenHtml: `<!DOCTYPE html>
<html>

<title>Sam's Last Blog Post</title>
<style>
body {
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
}
</style>

<body>

<center><h1>The Truth About NovaCorp</h1></center>

<p>Hey, it's Sam Lens. If you're reading this, I've probably vanished. No, I'm not kidding. The company I'm exposing—NovaCorp—has dark secrets that they don't want out. Data manipulation, stolen AI research, blackmail... you name it.</p>

<p>This might get taken down, so look closely. Maybe you'll find a message here if you care enough to look.</p>


<p hidden>Check my last Insta story before they wipe it.</hidden>

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
        brokenCss: `/* CSS is embedded in HTML - separate for game mechanics */`,
        targetHtml: `<!DOCTYPE html>
<html>

<head>
    <title>Sam's Last Blog Post</title>
</head>

<body>

<header><h1>The Truth About NovaCorp</h1></header>

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
    <strong>Warehouse 17, Dockside Street, 12:00 AM.</strong>
</section>

<p>Stay safe, and if they get me, keep searching for the truth. Maybe it's not just me they want to silence.</p>

<footer><p>Sam out.</p></footer>

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
            hint: '🎯 Remove all <center> tags and use semantic HTML elements like <header> and <footer>!',
            points: 2
          },
          {
            id: 'remove-font',
            condition: 'Remove <font> tags', 
            hint: '🎨 Replace <font> tags with CSS color and style properties!',
            points: 2
          },
          {
            id: 'remove-hidden-attr',
            condition: 'Remove hidden attribute',
            hint: '👁️ Remove the hidden attribute from the paragraph and use a semantic section!',
            points: 3
          },
          {
            id: 'reveal-image',
            condition: 'Change display none to block',
            hint: '🖼️ Change display: none to display: block to reveal the Instagram screenshot!',
            points: 3
          },
          {
            id: 'reveal-address',
            condition: 'Change visibility hidden to visible',
            hint: '📍 Change visibility: hidden to visibility: visible to show the final location!',
            points: 5
          }
        ]
      },
      {
        id: 'clue-2',
        title: 'Clue 2: The Instagram Story Archive',
        description: 'Sam\'s social media archive contains a hidden Instagram story with crucial information.',
        objective: 'Fix the CSS to reveal the hidden Instagram story containing Clue 2.',
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
        clueRevealed: 'Meet me where the shadows watch but the cameras don\'t.',
        aiHints: [
          'There\'s a hidden Instagram story section. Can you make it visible?',
          'Look for display: none in the HTML - that\'s hiding something important!',
          'Perfect! Now we can see Sam\'s last story. That message is definitely a clue.',
          'Where could "where the shadows watch but cameras don\'t" refer to? Think abandoned places...'
        ],
        hintsSteps: [
          {
            id: 'reveal-story',
            condition: 'Change display none to block',
            hint: '📱 Change display: none to display: block on the Instagram story section!',
            points: 5
          }
        ]
      },
      {
        id: 'clue-3',
        title: 'Clue 3: The Final Location',
        description: 'The final clue reveals Sam\'s exact location. Fix the broken layout to uncover where he\'s hiding.',
        objective: 'Modernize the layout and fix visibility to reveal the final clue about Sam\'s whereabouts.',
        brokenHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Warehouse District Map</title>
</head>
<body>
    <center>
        <font size="6" color="red">WAREHOUSE DISTRICT</font>
    </center>
    
    <div class="container">
        <div class="location-info" style="visibility: hidden;">
            <font size="4" color="blue">Warehouse 17 - ABANDONED</font>
            <p>This warehouse has been empty since 2019. No security cameras, perfect for hiding.</p>
            <p><strong>ADDRESS: Dockside Street, Warehouse 17</strong></p>
            <p><strong>TIME: 12:00 AM - TONIGHT</strong></p>
        </div>
        
        <div class="map-container">
            <p>Use this map to find the location...</p>
        </div>
    </div>
</body>
</html>`,
        brokenCss: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #2c3e50;
    color: white;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.location-info {
    background: #34495e;
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
}

.map-container {
    background: #ecf0f1;
    color: #2c3e50;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
}`,
        targetHtml: `<!DOCTYPE html>
<html>
<head>
    <title>Warehouse District Map</title>
</head>
<body>
    <header>
        <h1>WAREHOUSE DISTRICT</h1>
    </header>
    
    <main class="container">
        <section class="location-info">
            <h2>Warehouse 17 - ABANDONED</h2>
            <p>This warehouse has been empty since 2019. No security cameras, perfect for hiding.</p>
            <div class="address-details">
                <p><strong>ADDRESS: Dockside Street, Warehouse 17</strong></p>
                <p><strong>TIME: 12:00 AM - TONIGHT</strong></p>
            </div>
        </section>
        
        <section class="map-container">
            <p>Use this map to find the location...</p>
        </section>
    </main>
</body>
</html>`,
        targetCss: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #2c3e50;
    color: white;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

header h1 {
    color: #e74c3c;
    font-size: 3rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.location-info {
    visibility: visible;
    background: #34495e;
    padding: 30px;
    border-radius: 12px;
    border: 3px solid #e74c3c;
    box-shadow: 0 0 20px rgba(231, 76, 60, 0.3);
}

.location-info h2 {
    color: #3498db;
    font-size: 2rem;
    margin-top: 0;
}

.address-details {
    background: #e74c3c;
    padding: 15px;
    border-radius: 8px;
    margin-top: 15px;
    text-align: center;
    font-size: 1.1rem;
    animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
    from { box-shadow: 0 0 10px rgba(231, 76, 60, 0.5); }
    to { box-shadow: 0 0 20px rgba(231, 76, 60, 0.8); }
}

.map-container {
    background: #ecf0f1;
    color: #2c3e50;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    flex: 1;
}`,
        successConditions: [
          'Replace <center> and <font> tags with semantic HTML',
          'Change visibility: hidden to visibility: visible',
          'Add flexbox layout for modern structure',
          'Use semantic HTML5 elements'
        ],
        clueRevealed: 'Warehouse 17, Dockside Street - 12:00 AM TONIGHT',
        aiHints: [
          'More outdated HTML tags to fix! Replace <center> and <font> with modern elements.',
          'There\'s hidden location information. Fix the visibility to reveal it.',
          'Use semantic HTML elements like <header>, <main>, and <section>.',
          'Add some modern CSS layout techniques like flexbox.',
          'Perfect! Now we know exactly where Sam is hiding - Warehouse 17!'
        ],
        hintsSteps: [
          {
            id: 'remove-center-font',
            condition: 'Remove <center> and <font> tags',
            hint: '🏗️ Replace <center> and <font> tags with semantic HTML elements!',
            points: 3
          },
          {
            id: 'reveal-location',
            condition: 'Change visibility hidden to visible',
            hint: '📍 Change visibility: hidden to visibility: visible to reveal the location info!',
            points: 5
          },
          {
            id: 'add-flexbox',
            condition: 'Add flexbox layout',
            hint: '📐 Add display: flex to the container for modern layout!',
            points: 2
          }
        ]
      }
    ],
    finalResolution: `**CASE CLOSED: The Vanishing Blogger**
    
    Thanks to your detective work, the police were able to trace Sam to Warehouse 17 just in time. It turns out Sam had discovered that NovaCorp was planning to silence him permanently, so he staged his own disappearance to expose their crimes safely.
    
    Your HTML/CSS skills helped uncover:
    ✅ Clue 1: Sam's warning about checking his Instagram story
    ✅ Clue 2: The cryptic message about meeting "where shadows watch but cameras don't"
    ✅ Clue 3: The exact location - Warehouse 17, Dockside Street
    
    Sam is now in protective custody, and NovaCorp is under investigation. Excellent detective work!`,
    cluePoints: 100,
    difficulty: 'Beginner',
    duration: '15-20 minutes',
    // Legacy fields for compatibility
    initialHtml: '',
    initialCss: '',
    targetHtml: '',
    targetCss: '',
    hints: []
  }
];
