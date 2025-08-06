// Comprehensive test to simulate user progression through all missions

const validateDetectiveMission = (currentHtml, currentCss, successConditions) => {
  console.log('🔍 DETECTIVE VALIDATION START');
  console.log('  Success Conditions:', successConditions);
  console.log('  HTML Length:', currentHtml.length);
  console.log('  CSS Length:', currentCss.length);
  
  const completedConditions = [];
  const remainingConditions = [];
  const feedback = [];
  let score = 0;
  const maxScore = 100;
  const pointsPerCondition = maxScore / successConditions.length;

  successConditions.forEach((condition, index) => {
    console.log(`\n📋 Checking condition ${index + 1}/${successConditions.length}: "${condition}"`);
    const isConditionMet = checkCondition(condition, currentHtml, currentCss);
    
    if (isConditionMet) {
      completedConditions.push(condition);
      score += pointsPerCondition;
      feedback.push(`✅ ${condition}`);
      console.log(`  ✅ PASSED`);
    } else {
      remainingConditions.push(condition);
      feedback.push(`❌ ${condition}`);
      console.log(`  ❌ FAILED`);
    }
  });

  const isCompleted = completedConditions.length === successConditions.length;
  const clueUnlocked = isCompleted;

  console.log(`\n🎯 VALIDATION SUMMARY:`);
  console.log(`  Completed: ${completedConditions.length}/${successConditions.length}`);
  console.log(`  Score: ${Math.round(score)}/${maxScore}`);
  console.log(`  Mission Complete: ${isCompleted}`);
  console.log('🔍 DETECTIVE VALIDATION END\n');

  return {
    isCompleted,
    clueUnlocked,
    completedConditions,
    remainingConditions,
    score: Math.round(score),
    maxScore,
    feedback
  };
};

const checkCondition = (condition, html, css) => {
  const htmlLower = html.toLowerCase();
  const cssLower = css.toLowerCase();

  console.log(`    Checking condition: "${condition}"`);

  switch (condition) {
    // Mission 1 Conditions
    case 'Remove the hidden attribute and make the message visible':
      const noHiddenAttr = !htmlLower.includes('hidden') && 
                          !htmlLower.includes('style="display: none"') &&
                          !htmlLower.includes('style="display:none"');
      const hasVisibleContent = htmlLower.includes('check my last insta story') &&
                               !htmlLower.includes('hidden>') &&
                               !htmlLower.includes('hidden ') &&
                               !htmlLower.includes(' hidden');
      console.log(`    No hidden attribute: ${noHiddenAttr}, Has visible content: ${hasVisibleContent}`);
      return noHiddenAttr && hasVisibleContent;
    
    case 'Replace <center> tags with proper HTML structure':
      const noCenterTags = !htmlLower.includes('<center>') && !htmlLower.includes('</center>');
      const originalCenterContent1 = htmlLower.includes('the truth about novacorp');
      const originalCenterContent2 = htmlLower.includes('sam out');
      const hasSemanticElements = htmlLower.includes('<header>') || 
                                 htmlLower.includes('<footer>') || 
                                 htmlLower.includes('<main>') ||
                                 htmlLower.includes('<div');
      const hasImmediateMismatch = /<header[^>]*>[^<]*<\/footer>/.test(htmlLower) ||
                                  /<footer[^>]*>[^<]*<\/header>/.test(htmlLower);
      console.log(`    No center tags: ${noCenterTags}, Content preserved: ${originalCenterContent1 && originalCenterContent2}, Has semantic elements: ${hasSemanticElements}, Has immediate mismatch: ${hasImmediateMismatch}`);
      return noCenterTags && originalCenterContent1 && originalCenterContent2 && hasSemanticElements && !hasImmediateMismatch;
    
    case 'Apply proper CSS styling for the revealed message':
      const hasRevealedMessageStyle = cssLower.includes('.revealed-message') || 
                                    cssLower.includes('.hidden-message') ||
                                    cssLower.includes('background:') || 
                                    cssLower.includes('border:') ||
                                    cssLower.includes('animation:');
      console.log(`    Has revealed message styling: ${hasRevealedMessageStyle}`);
      return hasRevealedMessageStyle;

    // Mission 2 Conditions
    case 'Change display: none to display: block on #insta-clue element':
      const hasInstaClue = cssLower.includes('#insta-clue') || htmlLower.includes('id="insta-clue"');
      const hasDisplayBlockInsta = cssLower.includes('display: block') || cssLower.includes('display:block');
      const noDisplayNoneInsta = !cssLower.includes('display: none') && !cssLower.includes('display:none');
      console.log(`    Has insta-clue: ${hasInstaClue}, Has display block: ${hasDisplayBlockInsta}, No display none: ${noDisplayNoneInsta}`);
      return hasInstaClue && hasDisplayBlockInsta && noDisplayNoneInsta;
    
    case 'Style the revealed Instagram evidence section appropriately':
      const hasInstagramStyling2 = cssLower.includes('#insta-clue') || 
                                   cssLower.includes('.instagram-evidence') ||
                                   cssLower.includes('.social-post') ||
                                   cssLower.includes('border:') || 
                                   cssLower.includes('animation:') || 
                                   cssLower.includes('background:');
      console.log(`    Has Instagram styling: ${hasInstagramStyling2}`);
      return hasInstagramStyling2;

    // Mission 3 Conditions  
    case 'Change visibility: hidden to visibility: visible on #address-clue':
      const hasAddressClue = cssLower.includes('#address-clue') || htmlLower.includes('id="address-clue"');
      const hasVisibilityVisibleAddr = cssLower.includes('visibility: visible') || cssLower.includes('visibility:visible');
      const noVisibilityHiddenAddr = !cssLower.includes('visibility: hidden') && !cssLower.includes('visibility:hidden');
      console.log(`    Has address-clue: ${hasAddressClue}, Has visibility visible: ${hasVisibilityVisibleAddr}, No visibility hidden: ${noVisibilityHiddenAddr}`);
      return hasAddressClue && hasVisibilityVisibleAddr && noVisibilityHiddenAddr;
    
    case 'Replace <font> tags with modern CSS styling':
      const noFontTagsFont = !htmlLower.includes('<font') && !htmlLower.includes('</font>');
      const hasContentPreserved = htmlLower.includes('warehouse 17') || 
                                  htmlLower.includes('dockside street') ||
                                  htmlLower.includes('12:00 am') ||
                                  htmlLower.includes('address-clue');
      console.log(`    No font tags: ${noFontTagsFont}, Content preserved: ${hasContentPreserved}`);
      return noFontTagsFont && hasContentPreserved;
    
    case 'Apply proper styling to the revealed location information':
      const hasAddressStyling = cssLower.includes('#address-clue') || 
                               cssLower.includes('.location-clue') ||
                               cssLower.includes('.critical-location') ||
                               cssLower.includes('color:') ||
                               cssLower.includes('font-size:') ||
                               cssLower.includes('background:') || 
                               cssLower.includes('animation:') ||
                               cssLower.includes('border:');
      console.log(`    Has address styling: ${hasAddressStyling}`);
      return hasAddressStyling;

    default:
      console.log(`    Unknown condition, returning false`);
      return false;
  }
};

// Test all three missions step by step
console.log('===================================');
console.log('MISSION PROGRESSION SIMULATION');
console.log('===================================');

// Mission 1 Test
console.log('\n🎮 TESTING MISSION 1 - Starting with broken code');
const mission1BrokenHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Last Blog Post</title>
</head>
<body>
    <center><h1>The Truth About NovaCorp</h1></center>
    
    <main>
        <p>I've uncovered something big. If you're reading this, I need your help to piece together the truth.</p>
        
        <div class="hidden-message" hidden>
            <p><strong>UPDATE:</strong> Check my last insta story for more clues. I can't say more here - they might be watching.</p>
            <p class="signature">- Sam out</p>
        </div>
    </main>
    
    <center><footer>© 2024 Sam's Blog</footer></center>
</body>
</html>`;

const mission1BrokenCss = `body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

center {
    text-align: center;
    color: #d32f2f;
    margin: 20px 0;
}

.hidden-message {
    background: #fff3cd;
    border: 2px solid #ffc107;
    padding: 15px;
    margin: 20px 0;
    border-radius: 5px;
}`;

const mission1Conditions = [
  'Remove the hidden attribute and make the message visible',
  'Replace <center> tags with proper HTML structure',
  'Apply proper CSS styling for the revealed message'
];

console.log('🔴 Testing broken Mission 1 code (should be incomplete):');
const mission1BrokenResult = validateDetectiveMission(mission1BrokenHtml, mission1BrokenCss, mission1Conditions);

console.log('\n🟢 Testing fixed Mission 1 code (should be complete):');
const mission1FixedHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Last Blog Post</title>
</head>
<body>
    <header><h1>The Truth About NovaCorp</h1></header>
    
    <main>
        <p>I've uncovered something big. If you're reading this, I need your help to piece together the truth.</p>
        
        <div class="revealed-message">
            <p><strong>UPDATE:</strong> Check my last insta story for more clues. I can't say more here - they might be watching.</p>
            <p class="signature">- Sam out</p>
        </div>
    </main>
    
    <footer>© 2024 Sam's Blog</footer>
</body>
</html>`;

const mission1FixedCss = `body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

header {
    text-align: center;
    color: #d32f2f;
    margin: 20px 0;
}

footer {
    text-align: center;
    color: #d32f2f;
    margin: 20px 0;
}

.revealed-message {
    background: #fff3cd;
    border: 2px solid #ffc107;
    padding: 15px;
    margin: 20px 0;
    border-radius: 5px;
    animation: fadeIn 1s ease-in;
}`;

const mission1FixedResult = validateDetectiveMission(mission1FixedHtml, mission1FixedCss, mission1Conditions);

// Mission 2 Test
console.log('\n\n🎮 TESTING MISSION 2 - Starting with broken code');
const mission2BrokenHtml = `<!DOCTYPE html>
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
        </section>
        
        <section id="insta-clue" class="instagram-evidence">
            <h3>Social Media Evidence</h3>
            <div class="social-post">
                <img src="insta_screenshot.png" alt="Instagram Screenshot">
                <div class="caption">
                    <p class="clue-text">"Meet me where the shadows watch but the cameras don't."</p>
                </div>
            </div>
        </section>
    </main>
</body>
</html>`;

const mission2BrokenCss = `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

section {
    background: white;
    margin: 20px 0;
    padding: 20px;
    border-radius: 8px;
}

#insta-clue {
    display: none;
}

.social-post {
    text-align: center;
}

.clue-text {
    font-size: 1.2em;
    font-weight: bold;
    color: #e1306c;
}`;

const mission2Conditions = [
  'Change display: none to display: block on #insta-clue element',
  'Style the revealed Instagram evidence section appropriately'
];

console.log('🔴 Testing broken Mission 2 code (should be incomplete):');
const mission2BrokenResult = validateDetectiveMission(mission2BrokenHtml, mission2BrokenCss, mission2Conditions);

console.log('\n🟢 Testing fixed Mission 2 code (should be complete):');
const mission2FixedCss = `body {
    font-family: Arial, sans-serif;
    background-color: #f3f3f3;
    color: #333;
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 30px;
}

section {
    background: white;
    margin: 20px 0;
    padding: 20px;
    border-radius: 8px;
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

.clue-text {
    font-size: 1.2em;
    font-weight: bold;
    color: #e1306c;
}

@keyframes revealEvidence {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}`;

const mission2FixedResult = validateDetectiveMission(mission2BrokenHtml, mission2FixedCss, mission2Conditions);

// Summary
console.log('\n\n📊 FINAL SUMMARY:');
console.log('================');
console.log(`Mission 1 Broken: ${mission1BrokenResult.isCompleted ? '❌ INCORRECTLY PASSED' : '✅ CORRECTLY FAILED'}`);
console.log(`Mission 1 Fixed:  ${mission1FixedResult.isCompleted ? '✅ CORRECTLY PASSED' : '❌ INCORRECTLY FAILED'}`);
console.log(`Mission 2 Broken: ${mission2BrokenResult.isCompleted ? '❌ INCORRECTLY PASSED' : '✅ CORRECTLY FAILED'}`);
console.log(`Mission 2 Fixed:  ${mission2FixedResult.isCompleted ? '✅ CORRECTLY PASSED' : '❌ INCORRECTLY FAILED'}`);

const allWorking = !mission1BrokenResult.isCompleted && mission1FixedResult.isCompleted && 
                   !mission2BrokenResult.isCompleted && mission2FixedResult.isCompleted;

console.log(`\nOverall Validation: ${allWorking ? '✅ ALL WORKING CORRECTLY' : '❌ ISSUES DETECTED'}`);

if (!allWorking) {
  console.log('\n🚨 DETECTED ISSUES:');
  if (mission1BrokenResult.isCompleted) console.log('  - Mission 1 broken code incorrectly passes');
  if (!mission1FixedResult.isCompleted) console.log('  - Mission 1 fixed code incorrectly fails');
  if (mission2BrokenResult.isCompleted) console.log('  - Mission 2 broken code incorrectly passes');
  if (!mission2FixedResult.isCompleted) console.log('  - Mission 2 fixed code incorrectly fails');
}
