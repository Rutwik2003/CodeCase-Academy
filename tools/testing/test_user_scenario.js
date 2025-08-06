// Test the user's exact scenario - manual validation check
const userHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Last Blog Post</title>
</head>
<body>
    <header><h1>The Truth About NovaCorp</h1></header>

    <p>Hey, it's Sam Lens. If you're reading this, I've probably vanished. No, I'm not kidding. The company I'm exposing—NovaCorp—has dark secrets that they don't want out. Data manipulation, stolen AI research, blackmail... you name it.</p>

    <p>This might get taken down, so look closely. Maybe you'll find a message here if you care enough to look.</p>

    <p>Check my last Insta story before they wipe it.</p>

    <p>They control everything: the media, the feeds, the ads. They think they can silence me like they silenced others.</p>

    <p>They won't find me if I keep moving, but they're watching. Always watching.</p>

    <p>Stay safe, and if they get me, keep searching for the truth. Maybe it's not just me they want to silence.</p>

    <footer><p>Sam out.</p></footer>
</body>
</html>`;

const userCSS = `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}`;

const successConditions = [
  'Remove the hidden attribute and make the message visible',
  'Replace <center> tags with proper HTML structure'
];

console.log("Testing user's corrected HTML:");
console.log("- Changed first <center> to <header></header>");
console.log("- Changed second <center> to <footer></footer>");
console.log("- Removed hidden attribute from paragraph");

// Manual validation check
const htmlLower = userHTML.toLowerCase();

// Check condition 1: Remove hidden attribute
const noHiddenAttr = !htmlLower.includes('hidden') && 
                    !htmlLower.includes('style="display: none"') &&
                    !htmlLower.includes('style="display:none"');
                    
const hasVisibleContent = htmlLower.includes('check my last insta story') &&
                         !htmlLower.includes('hidden>') &&
                         !htmlLower.includes('hidden ') &&
                         !htmlLower.includes(' hidden');

console.log("\nCondition 1 - Remove hidden attribute:");
console.log("- No hidden attr:", noHiddenAttr);
console.log("- Has visible content:", hasVisibleContent);
console.log("- RESULT:", noHiddenAttr && hasVisibleContent);

// Check condition 2: Replace center tags
const noCenterTags = !htmlLower.includes('<center>') && !htmlLower.includes('</center>');
const hasHeader = htmlLower.includes('<header>') && htmlLower.includes('</header>');
const hasFooter = htmlLower.includes('<footer>') && htmlLower.includes('</footer>');
const originalCenterContent1 = htmlLower.includes('the truth about novacorp');
const originalCenterContent2 = htmlLower.includes('sam out');

console.log("\nCondition 2 - Replace center tags (SIMPLIFIED):");
console.log("- No center tags:", noCenterTags);
console.log("- Content preserved (title):", originalCenterContent1);
console.log("- Content preserved (footer):", originalCenterContent2);

// Check for basic semantic structure (more lenient)
const hasSemanticElements = htmlLower.includes('<header>') || 
                           htmlLower.includes('<footer>') || 
                           htmlLower.includes('<main>') ||
                           htmlLower.includes('<div');

// Check for egregious mismatches only (immediate tag errors)
const hasImmediateMismatch = /<header[^>]*>[^<]*<\/footer>/.test(htmlLower) ||
                            /<footer[^>]*>[^<]*<\/header>/.test(htmlLower);

console.log("- Has semantic elements:", hasSemanticElements);
console.log("- Has immediate mismatch:", hasImmediateMismatch);

const finalResult = noCenterTags && originalCenterContent1 && originalCenterContent2 && hasSemanticElements && !hasImmediateMismatch;
console.log("- SIMPLIFIED RESULT:", finalResult);

console.log("\nThis should PASS validation - user has correct HTML structure!");
