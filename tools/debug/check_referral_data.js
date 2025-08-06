// Debug script to check referral stats and history
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

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

async function checkReferralData() {
  try {
    console.log('🔍 Checking referral data for all users...\n');
    
    // Get all users
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    console.log('=== USER REFERRAL DATA ===\n');
    
    snapshot.forEach((doc) => {
      const userData = doc.data();
      const userId = doc.id;
      
      console.log(`👤 User: ${userData.displayName || userData.email}`);
      console.log(`   ID: ${userId}`);
      console.log(`   UID: ${userData.uid}`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Referral Code: ${userData.referralCode || 'NONE'}`);
      console.log(`   Referred By: ${userData.referredBy || 'NONE'}`);
      console.log(`   Points: ${userData.totalPoints || 0}`);
      console.log(`   Hints: ${userData.hints || 0}`);
      
      if (userData.referralStats) {
        console.log('   📊 Referral Stats:');
        console.log(`      Total Referrals: ${userData.referralStats.totalReferrals || 0}`);
        console.log(`      Successful: ${userData.referralStats.successfulReferrals || 0}`);
        console.log(`      Total Rewards: ${userData.referralStats.totalRewards || 0}`);
        console.log(`      History Count: ${userData.referralStats.referralHistory?.length || 0}`);
        
        if (userData.referralStats.referralHistory?.length > 0) {
          console.log('      📝 Recent Referrals:');
          userData.referralStats.referralHistory.forEach((ref, index) => {
            console.log(`         ${index + 1}. ${ref.referredUserEmail} (${ref.status}) - ${ref.pointsEarned}pts`);
          });
        }
      } else {
        console.log('   📊 Referral Stats: NONE');
      }
      
      console.log('   ─────────────────────────────\n');
    });
    
    // Check for specific issues
    console.log('=== ANALYSIS ===\n');
    
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    // Find users who referred others
    const referrers = users.filter(user => 
      user.referralStats && user.referralStats.totalReferrals > 0
    );
    
    // Find users who were referred
    const referred = users.filter(user => user.referredBy);
    
    console.log(`👥 Total Users: ${users.length}`);
    console.log(`📤 Users with referrals: ${referrers.length}`);
    console.log(`📥 Users who were referred: ${referred.length}`);
    
    // Check for mismatches
    if (referred.length > 0) {
      console.log('\n🔍 Checking referral connections...');
      referred.forEach(referredUser => {
        const referrerCode = referredUser.referredBy;
        const referrer = users.find(user => user.referralCode === referrerCode);
        
        if (referrer) {
          const hasHistory = referrer.referralStats?.referralHistory?.some(
            ref => ref.referredUserEmail === referredUser.email
          );
          
          console.log(`✅ ${referredUser.displayName || referredUser.email} → ${referrer.displayName || referrer.email}`);
          console.log(`   Code: ${referrerCode}`);
          console.log(`   In History: ${hasHistory ? 'YES' : 'NO ❌'}`);
          
          if (!hasHistory) {
            console.log(`   ⚠️  MISSING: ${referrer.displayName || referrer.email} should have ${referredUser.displayName || referredUser.email} in their referral history!`);
          }
        } else {
          console.log(`❌ ${referredUser.displayName || referredUser.email} used code ${referrerCode} but no referrer found!`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking referral data:', error);
  }
}

// Run the check
checkReferralData().then(() => {
  console.log('\n🏁 Referral data check complete!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});
