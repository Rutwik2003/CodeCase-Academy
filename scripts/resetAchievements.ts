// Achievement Reset Script
// Run this script to reset all user achievements in the Firebase database

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch } from 'firebase/firestore';

// Your Firebase config (you should use your actual config)
const firebaseConfig = {
  // Add your Firebase config here
  // This should match your src/config/firebase.ts configuration
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetAllUserAchievements() {
  try {
    console.log('🔄 Starting achievement reset for all users...');
    
    // Get all user documents
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    if (usersSnapshot.empty) {
      console.log('❌ No users found to reset achievements for');
      return;
    }

    console.log(`📋 Found ${usersSnapshot.size} users to update`);

    // Create a batch to update all users at once
    const batch = writeBatch(db);
    let updateCount = 0;

    // Add each user update to the batch
    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      console.log(`📝 Preparing reset for user: ${userData.displayName || userData.email || userDoc.id}`);
      
      batch.update(userDoc.ref, {
        achievements: []
      });
      updateCount++;
    });

    // Execute the batch
    console.log('💾 Executing batch update...');
    await batch.commit();
    
    console.log(`✅ Successfully reset achievements for ${updateCount} users!`);
    
    return { success: true, updatedUsers: updateCount };
    
  } catch (error) {
    console.error('❌ Error resetting achievements for all users:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  resetAllUserAchievements()
    .then((result) => {
      if (result) {
        console.log(`🎉 Achievement reset completed! Updated ${result.updatedUsers} users.`);
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { resetAllUserAchievements };
