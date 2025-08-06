export interface DetectiveMissionValidation {
  isCompleted: boolean;
  clueUnlocked: boolean;
  completedConditions: string[];
  remainingConditions: string[];
  score: number;
  maxScore: number;
  feedback: string[];
}

export const validateDetectiveMission = (
  currentHtml: string,
  currentCss: string,
  successConditions: string[]
): DetectiveMissionValidation => {
  
  // logger.info('🔍 DETECTIVE VALIDATION START', LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
  // logger.info('  Success Conditions:', successConditions, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
  // logger.info('  HTML Length:', currentHtml.length, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
  // logger.info('  CSS Length:', currentCss.length, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
  
  const completedConditions: string[] = [];
  const remainingConditions: string[] = [];
  const feedback: string[] = [];
  let score = 0;
  const maxScore = 100;
  const pointsPerCondition = maxScore / successConditions.length;

  successConditions.forEach((condition, index) => {
    // logger.info(`\n📋 Checking condition ${index + 1}/${successConditions.length}: "${condition}"`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    const isConditionMet = checkCondition(condition, currentHtml, currentCss);
    
    if (isConditionMet) {
      completedConditions.push(condition);
      score += pointsPerCondition;
      feedback.push(`✅ ${condition}`);
      // logger.info(`  ✅ PASSED`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    } else {
      remainingConditions.push(condition);
      feedback.push(`❌ ${condition}`);
      // logger.info(`  ❌ FAILED`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
    }
  });

  const isCompleted = completedConditions.length === successConditions.length;
  const clueUnlocked = isCompleted;

  // logger.info(`\n🎯 VALIDATION SUMMARY:`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
  // logger.info(`  Completed: ${completedConditions.length}/${successConditions.length}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
  // logger.info(`  Score: ${Math.round(score)}/${maxScore}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
  // logger.info(`  Mission Complete: ${isCompleted}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
  // logger.info('🔍 DETECTIVE VALIDATION END\n', LogCategory.UTILITY); // COMMENTED FOR PRODUCTION

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

const checkCondition = (condition: string, html: string, css: string): boolean => {
  const htmlLower = html.toLowerCase();
  const cssLower = css.toLowerCase();

  // logger.info(`Checking condition: "${condition}"`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION

  switch (condition) {
    // Mission 1 Conditions - Enhanced validation like tutorial
    case 'Remove the hidden attribute and make the message visible':
      // Check that 'hidden' attribute is completely removed
      const noHiddenAttr = !htmlLower.includes('hidden>') && 
                          !htmlLower.includes('hidden ') &&
                          !htmlLower.includes(' hidden') &&
                          !htmlLower.includes('style="display: none"') &&
                          !htmlLower.includes('style="display:none"');
      
      // Ensure the critical content is visible (more specific check)
      const hasVisibleContent = htmlLower.includes('check my last insta story') &&
                               noHiddenAttr;
      
      // logger.info(`  No hidden attribute: ${noHiddenAttr}, Has visible content: ${hasVisibleContent}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return noHiddenAttr && hasVisibleContent;
    
    case 'Replace <center> tags with proper HTML structure':
      // Check that ALL center tags are removed (more thorough)
      const noCenterTags = !htmlLower.includes('<center>') && !htmlLower.includes('</center>');
      
      // More lenient check - just need the content to be present and center tags gone
      const hasContent = htmlLower.includes('the truth about novacorp') || 
                        htmlLower.includes('sam out');
      
      // logger.info(`  No center tags: ${noCenterTags}, Has content: ${hasContent}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return noCenterTags && hasContent;
    
    case 'Apply proper CSS styling for the revealed message':
      const hasRevealedMessageStyle = cssLower.includes('.revealed-message') || 
                                    cssLower.includes('.hidden-message') ||
                                    cssLower.includes('background:') || 
                                    cssLower.includes('border:') ||
                                    cssLower.includes('animation:');
      // logger.info(`  Has revealed message styling: ${hasRevealedMessageStyle}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return hasRevealedMessageStyle;

    // Mission 2 Conditions - Enhanced validation
    case 'Change display: none to display: block on #insta-clue element':
      // Check that the CSS actually sets display: block for the element
      const hasInstaClue = cssLower.includes('#insta-clue') || htmlLower.includes('id="insta-clue"');
      const hasDisplayBlockInsta = cssLower.includes('display: block') || cssLower.includes('display:block');
      const noDisplayNoneInsta = !cssLower.includes('display: none') && !cssLower.includes('display:none');
      
      // logger.info(`  Has insta-clue: ${hasInstaClue}, Has display block: ${hasDisplayBlockInsta}, No display none: ${noDisplayNoneInsta}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return hasInstaClue && hasDisplayBlockInsta && noDisplayNoneInsta;
    
    case 'Style the revealed Instagram evidence section appropriately':
      // Check that there's proper styling for the Instagram section
      const hasInstagramStyling2 = cssLower.includes('#insta-clue') || 
                                   cssLower.includes('.instagram-evidence') ||
                                   cssLower.includes('.social-post') ||
                                   cssLower.includes('border:') || 
                                   cssLower.includes('animation:') || 
                                   cssLower.includes('background:');
      
      // logger.info(`  Has Instagram styling: ${hasInstagramStyling2}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return hasInstagramStyling2;

    // Mission 3 Conditions - Enhanced validation  
    case 'Change visibility: hidden to visibility: visible on #address-clue':
      // Check that visibility is properly set to visible
      const hasAddressClue = cssLower.includes('#address-clue') || htmlLower.includes('id="address-clue"');
      const hasVisibilityVisibleAddr = cssLower.includes('visibility: visible') || cssLower.includes('visibility:visible');
      const noVisibilityHiddenAddr = !cssLower.includes('visibility: hidden') && !cssLower.includes('visibility:hidden');
      
      // logger.info(`  Has address-clue: ${hasAddressClue}, Has visibility visible: ${hasVisibilityVisibleAddr}, No visibility hidden: ${noVisibilityHiddenAddr}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return hasAddressClue && hasVisibilityVisibleAddr && noVisibilityHiddenAddr;
    
    case 'Replace <font> tags with modern CSS styling':
      // Check that ALL font tags are removed AND content is preserved
      const noFontTagsFont = !htmlLower.includes('<font') && !htmlLower.includes('</font>');
      
      // Ensure the content is still there but with proper styling
      const hasContentPreserved = htmlLower.includes('warehouse 17') || 
                                  htmlLower.includes('dockside street') ||
                                  htmlLower.includes('12:00 am') ||
                                  htmlLower.includes('address-clue');
      
      // logger.info(`  No font tags: ${noFontTagsFont}, Content preserved: ${hasContentPreserved}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return noFontTagsFont && hasContentPreserved;
    
    case 'Apply proper styling to the revealed location information':
      // Check that there's proper CSS styling for the address clue
      const hasAddressStyling = cssLower.includes('#address-clue') || 
                               cssLower.includes('.location-clue') ||
                               cssLower.includes('.critical-location') ||
                               cssLower.includes('color:') ||
                               cssLower.includes('font-size:') ||
                               cssLower.includes('background:') || 
                               cssLower.includes('animation:') ||
                               cssLower.includes('border:');
      
      // logger.info(`  Has address styling: ${hasAddressStyling}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return hasAddressStyling;
    
    // Legacy conditions for backward compatibility with stricter validation
    case 'Replace <center> tags with proper semantic HTML elements':
      const noCenterTagsLegacy = !htmlLower.includes('<center>') && !htmlLower.includes('</center>');
      const hasSemanticTags = (htmlLower.includes('<header>') || htmlLower.includes('<footer>') || htmlLower.includes('<main>')) &&
                             htmlLower.includes('<body>'); // Ensure it's a complete document
      // logger.info(`  No center tags: ${noCenterTagsLegacy}, Has semantic: ${hasSemanticTags}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return noCenterTagsLegacy && hasSemanticTags;
    
    case 'Use modern HTML5 semantic elements (header, main, footer)':
      const hasAllSemantic = htmlLower.includes('<header>') && 
                             htmlLower.includes('<main>') && 
                             (htmlLower.includes('<footer>') || htmlLower.includes('</body>'));
      // logger.info(`  Has all semantic elements: ${hasAllSemantic}`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return hasAllSemantic;

    default:
      // logger.info(`  Unknown condition, returning false`, LogCategory.UTILITY); // COMMENTED FOR PRODUCTION
      return false;
  }
};
