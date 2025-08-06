/**
 * Browser Console Achievement Reset Script (Updated for Firebase v9+)
 * 
 * To use this script:
 * 1. Open your web app in the browser
 * 2. Make sure you're logged in
 * 3. Open Developer Tools (F12)
 * 4. Go to Console tab
 * 5. Copy and paste this entire script
 * 6. Press Enter to execute
 */

async function resetAllAchievementsConsole() {
  console.log('🔄 Starting achievement reset...');
  
  try {
    // Check if the app's Firebase modules are available
    // Since we're using Firebase v9+ modular SDK, we need to access it differently
    
    // Try to get the reset function from the AuthContext if available
    if (window.React && window.resetAllUserAchievements) {
      console.log('📱 Using app\'s reset function...');
      const result = await window.resetAllUserAchievements();
      if (result?.success) {
        console.log(`✅ Successfully reset achievements for ${result.updatedUsers} users!`);
      }
      return;
    }
    
    // Alternative: Try to access the app's context directly
    console.log('🔍 Looking for app context...');
    
    // Look for React app root and try to trigger the reset through UI
    const resetButton = document.querySelector('[title*="Reset All User Achievements"]');
    if (resetButton) {
      console.log('🎯 Found reset button, clicking it...');
      resetButton.click();
      return;
    }
    
    // If nothing else works, show instructions
    console.log('ℹ️ Could not find automatic reset method.');
    console.log('📋 Please use one of these methods instead:');
    console.log('   1. Go to Profile page and click the red trophy button in the header');
    console.log('   2. Or refresh the page and make sure you\'re logged in, then try again');
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('💡 Try using the red trophy button in the Profile page header instead');
  }
}

// Execute the function
resetAllAchievementsConsole();
