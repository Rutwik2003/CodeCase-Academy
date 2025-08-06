// Debug script for Mission 2 validation

const testMission2 = () => {
  // Mission 2 success conditions
  const successConditions = [
    'Change display: none to display: block on #insta-clue element',
    'Style the revealed Instagram evidence section appropriately'
  ];

  // Test HTML (should contain the Instagram clue element)
  const testHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Sam's Investigation Files</title>
</head>
<body>
    <header>
        <h1>The Truth About NovaCorp</h1>
    </header>
    
    <main>
        <section id="insta-clue">
            <div class="social-post">
                <img src="https://via.placeholder.com/300x300/e1306c/white?text=Instagram" alt="Sam's Instagram Story">
                <div class="caption">
                    <p class="clue-text">Check my last insta story for location clues 👀</p>
                </div>
            </div>
        </section>
    </main>
</body>
</html>`;

  // Test CSS with correct changes
  const testCss = `body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 20px;
    min-height: 100vh;
    margin: 0;
}

#insta-clue {
    display: block;
    border: 3px solid #e1306c;
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    animation: revealEvidence 1.5s ease-in-out;
}`;

  // Simulate validation logic
  const checkCondition = (condition, html, css) => {
    const htmlLower = html.toLowerCase();
    const cssLower = css.toLowerCase();

    console.log(`Checking condition: "${condition}"`);

    switch (condition) {
      case 'Change display: none to display: block on #insta-clue element':
        const hasInstaClue = cssLower.includes('#insta-clue') || htmlLower.includes('id="insta-clue"');
        const hasDisplayBlockInsta = cssLower.includes('display: block') || cssLower.includes('display:block');
        const noDisplayNoneInsta = !cssLower.includes('display: none') && !cssLower.includes('display:none');
        
        console.log(`  Has insta-clue: ${hasInstaClue}, Has display block: ${hasDisplayBlockInsta}, No display none: ${noDisplayNoneInsta}`);
        return hasInstaClue && hasDisplayBlockInsta && noDisplayNoneInsta;
      
      case 'Style the revealed Instagram evidence section appropriately':
        const hasInstagramStyling2 = cssLower.includes('#insta-clue') || 
                                     cssLower.includes('.instagram-evidence') ||
                                     cssLower.includes('.social-post') ||
                                     cssLower.includes('border:') || 
                                     cssLower.includes('animation:') || 
                                     cssLower.includes('background:');
        
        console.log(`  Has Instagram styling: ${hasInstagramStyling2}`);
        return hasInstagramStyling2;
      
      default:
        console.log(`  Unknown condition, returning false`);
        return false;
    }
  };

  // Test validation
  console.log('=== Mission 2 Debug Test ===');
  console.log('Testing Mission 2 validation...');
  
  successConditions.forEach(condition => {
    const result = checkCondition(condition, testHtml, testCss);
    console.log(`✅ ${condition}: ${result ? 'PASS' : 'FAIL'}`);
  });

  const allPassed = successConditions.every(condition => checkCondition(condition, testHtml, testCss));
  console.log(`\nOverall Mission 2 Result: ${allPassed ? 'COMPLETED' : 'INCOMPLETE'}`);
};

testMission2();
