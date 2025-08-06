// Debug script to check existing referral codes and create test data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';

// Firebase config (using the same config from your project)
// For security, move to .env file:
// VITE_FIREBASE_API_KEY=your_api_key_here
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: "codebuster-82940.firebaseapp.com",
  projectId: "codebuster-82940",
  storageBucket: "codebuster-82940.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Generate referral code (same logic as in AuthContext)
const generateReferralCode = (uid) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const baseCode = uid.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  
  for (let i = 0; i < 6; i++) {
    if (i < baseCode.length) {
      result += baseCode[i];
    } else {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return result;
};

async function debugReferralSystem() {
  try {
    console.log('🔍 Debugging CodeBuster Referral System...\n');
    
    // 1. Check existing users and their referral codes
    console.log('=== Existing Users and Referral Codes ===');
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const existingCodes = [];
    snapshot.forEach((doc) => {
      const userData = doc.data();
      console.log(`User: ${userData.displayName || userData.email}`);
      console.log(`  UID: ${userData.uid}`);
      console.log(`  Referral Code: ${userData.referralCode}`);
      console.log(`  Email: ${userData.email}`);
      console.log(`  Referred By: ${userData.referredBy || 'None'}`);
      console.log('---');
      
      if (userData.referralCode) {
        existingCodes.push(userData.referralCode);
      }
    });
    
    console.log(`\n📊 Total users: ${snapshot.size}`);
    console.log(`📊 Existing referral codes: ${existingCodes.join(', ')}\n`);
    
    // 2. Check if W5LHCH exists
    const hasW5LHCH = existingCodes.includes('W5LHCH');
    console.log(`🔍 Does W5LHCH exist? ${hasW5LHCH ? 'YES ✅' : 'NO ❌'}\n`);
    
    // 3. Create a test user with W5LHCH code if it doesn't exist
    if (!hasW5LHCH) {
      console.log('🛠️ Creating test user with W5LHCH referral code...');
      
      const testUserData = {
        uid: 'test-user-w5lhch',
        email: 'testuser.w5lhch@codebuster.dev',
        displayName: 'Test User (W5LHCH)',
        level: 1,
        hints: 2,
        completedCases: [],
        unlockedCases: ['case-vanishing-blogger'],
        totalPoints: 500,
        achievements: [],
        evidence: [],
        preferences: {
          theme: 'dark',
          notifications: true,
          soundEffects: true,
          language: 'en'
        },
        statistics: {
          totalCasesStarted: 0,
          totalCasesCompleted: 0,
          totalTimeSpent: 0,
          averageCaseTime: 0,
          hintsUsed: 0,
          currentStreak: 0,
          bestStreak: 0
        },
        createdAt: new Date(),
        lastLogin: new Date(),
        referralCode: 'W5LHCH',
        referralStats: {
          totalReferrals: 0,
          successfulReferrals: 0,
          pendingReferrals: 0,
          totalRewards: 0,
          referralHistory: []
        },
        referredBy: null
      };
      
      await setDoc(doc(db, 'users', 'test-user-w5lhch'), testUserData);
      console.log('✅ Test user created successfully!\n');
    }
    
    // 4. Generate some sample referral codes for testing
    console.log('=== Sample Referral Codes for Testing ===');
    const sampleUIDs = [
      'user123test',
      'detective456',
      'codemaster789',
      'websleuths012'
    ];
    
    sampleUIDs.forEach(uid => {
      const code = generateReferralCode(uid);
      console.log(`UID: ${uid} => Referral Code: ${code}`);
    });
    
    console.log('\n🎯 Debug complete! Now try using W5LHCH as a referral code.');
    
  } catch (error) {
    console.error('❌ Error in debug script:', error);
  }
}

// Run the debug
debugReferralSystem().then(() => {
  console.log('\n🏁 Debug script finished.');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
