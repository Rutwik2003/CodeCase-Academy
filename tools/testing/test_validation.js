// Test script to verify our validation fixes
// This simulates the user's reported bug

const testHTML1 = `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Last Blog Post</title>
</head>
<body>
    <header><h1>The Truth About NovaCorp</h1></footer>

    <p>Hey, it's Sam Lens. If you're reading this, I've probably vanished. No, I'm not kidding. The company I'm exposing—NovaCorp—has dark secrets that they don't want out. Data manipulation, stolen AI research, blackmail... you name it.</p>

    <p>This might get taken down, so look closely. Maybe you'll find a message here if you care enough to look.</p>

    <p>Check my last Insta story before they wipe it.</p>

    <p>They control everything: the media, the feeds, the ads. They think they can silence me like they silenced others.</p>

    <p>They won't find me if I keep moving, but they're watching. Always watching.</p>

    <p>Stay safe, and if they get me, keep searching for the truth. Maybe it's not just me they want to silence.</p>

    <p>Sam out.</p>
</body>
</html>`;

const testCSS1 = `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}`;

console.log("TEST 1: User's reported bug - <header> closed with </footer> + hidden removed");
console.log("HTML contains:");
console.log("- <header> with mismatched </footer>");
console.log("- 'hidden' attribute removed"); 
console.log("- 'Check my last Insta story' text visible");
console.log("- No <center> tags");

// Test condition checks
const htmlLower = testHTML1.toLowerCase();

// Hidden attribute check
const noHiddenAttr = !htmlLower.includes('hidden') && 
                    !htmlLower.includes('style="display: none"') &&
                    !htmlLower.includes('style="display:none"');
                    
const hasVisibleContent = htmlLower.includes('check my last insta story') &&
                         !htmlLower.includes('hidden>') &&
                         !htmlLower.includes('hidden ') &&
                         !htmlLower.includes(' hidden');

console.log("Hidden attribute condition:", noHiddenAttr && hasVisibleContent);

// Center tags check  
const noCenterTags = !htmlLower.includes('<center>') && !htmlLower.includes('</center>');
const hasHeader = htmlLower.includes('<header>') && htmlLower.includes('</header>');
const hasFooter = htmlLower.includes('<footer>') && htmlLower.includes('</footer>');
const originalCenterContent1 = htmlLower.includes('the truth about novacorp');
const originalCenterContent2 = htmlLower.includes('sam out');

// Check for mismatched patterns
const mismatchedPattern = /<header[^>]*>.*?<\/footer>/s;
const hasMismatch = mismatchedPattern.test(htmlLower);

console.log("Center tags condition parts:");
console.log("- No center tags:", noCenterTags);
console.log("- Has proper header:", hasHeader);
console.log("- Has proper footer:", hasFooter);
console.log("- Content preserved:", originalCenterContent1 && originalCenterContent2);
console.log("- Has mismatched tags:", hasMismatch);

console.log("This should FAIL validation due to mismatched <header></footer> tags");
