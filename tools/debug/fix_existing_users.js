// Script to fix existing users who don't have referral codes
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Firebase config
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

async function fixExistingUsers() {
  try {
    console.log('🔧 Fixing existing users without referral codes...\n');
    
    // Get all users
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    let fixedCount = 0;
    
    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      
      // Check if user is missing referral code
      if (!userData.referralCode) {
        const newReferralCode = generateReferralCode(userData.uid || userId);
        
        console.log(`Fixing user: ${userData.displayName || userData.email}`);
        console.log(`  UID: ${userData.uid || userId}`);
        console.log(`  New Referral Code: ${newReferralCode}`);
        
        // Update user with referral code and stats
        await updateDoc(doc(db, 'users', userId), {
          referralCode: newReferralCode,
          referralStats: {
            totalReferrals: 0,
            successfulReferrals: 0,
            pendingReferrals: 0,
            totalRewards: 0,
            referralHistory: []
          }
        });
        
        fixedCount++;
        console.log('  ✅ Fixed!\n');
      } else {
        console.log(`User ${userData.displayName || userData.email} already has referral code: ${userData.referralCode}`);
      }
    }
    
    console.log(`🎉 Fixed ${fixedCount} users!`);
    console.log('\n=== Updated Referral Codes ===');
    
    // Show updated codes
    const updatedSnapshot = await getDocs(usersRef);
    updatedSnapshot.forEach((doc) => {
      const userData = doc.data();
      console.log(`${userData.displayName || userData.email}: ${userData.referralCode}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing users:', error);
  }
}

// Run the fix
fixExistingUsers().then(() => {
  console.log('\n🏁 User fix complete!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
