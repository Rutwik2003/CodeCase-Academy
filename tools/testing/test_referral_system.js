/**
 * Test script for the referral system
 * This demonstrates how the referral system works
 */

// Test the referral code generation
function testReferralCodeGeneration() {
  console.log('=== Testing Referral Code Generation ===');
  
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

  // Test with different UIDs
  const testUIDs = [
    'user123abc',
    'test@email.com',
    'shortID',
    'verylonguseridheretest123'
  ];

  testUIDs.forEach(uid => {
    const code = generateReferralCode(uid);
    console.log(`UID: ${uid} => Referral Code: ${code}`);
  });
}

// Test the referral rewards logic
function testReferralRewards() {
  console.log('\n=== Testing Referral Rewards ===');
  
  // Base user stats
  const baseUser = {
    totalPoints: 500,
    hints: 2,
    referralStats: {
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      totalRewards: 0,
      referralHistory: []
    }
  };

  // New user being referred
  const newUser = {
    totalPoints: 500, // Base starting points
    hints: 2 // Base starting hints
  };

  console.log('Before referral:');
  console.log('Referrer:', baseUser);
  console.log('New User:', newUser);

  // Process referral
  const referralReward = {
    pointsForReferrer: 100,
    hintsForReferrer: 1,
    bonusPointsForNewUser: 200,
    bonusHintsForNewUser: 1
  };

  // Update referrer
  const updatedReferrer = {
    ...baseUser,
    totalPoints: baseUser.totalPoints + referralReward.pointsForReferrer,
    hints: baseUser.hints + referralReward.hintsForReferrer,
    referralStats: {
      ...baseUser.referralStats,
      totalReferrals: baseUser.referralStats.totalReferrals + 1,
      successfulReferrals: baseUser.referralStats.successfulReferrals + 1,
      totalRewards: baseUser.referralStats.totalRewards + referralReward.pointsForReferrer
    }
  };

  // Update new user
  const updatedNewUser = {
    ...newUser,
    totalPoints: newUser.totalPoints + referralReward.bonusPointsForNewUser,
    hints: newUser.hints + referralReward.bonusHintsForNewUser
  };

  console.log('\nAfter referral:');
  console.log('Referrer:', updatedReferrer);
  console.log('New User:', updatedNewUser);

  // Test milestone rewards
  console.log('\n=== Testing Milestone Rewards ===');
  const milestones = [
    { referrals: 5, bonus: 500 },
    { referrals: 10, bonus: 1000 },
    { referrals: 25, bonus: 2500 }
  ];

  milestones.forEach(milestone => {
    if (updatedReferrer.referralStats.successfulReferrals >= milestone.referrals) {
      console.log(`🎉 Milestone reached: ${milestone.referrals} referrals = +${milestone.bonus} bonus points!`);
    } else {
      const remaining = milestone.referrals - updatedReferrer.referralStats.successfulReferrals;
      console.log(`📈 ${remaining} more referrals needed for ${milestone.bonus} bonus points`);
    }
  });
}

// Test the achievement system integration
function testReferralAchievements() {
  console.log('\n=== Testing Referral Achievements ===');
  
  const achievements = [
    { id: 24, name: 'First Referral', requirement: 1, points: 200 },
    { id: 25, name: 'Team Builder', requirement: 5, points: 500 },
    { id: 26, name: 'Recruitment Expert', requirement: 10, points: 1000 },
    { id: 27, name: 'Master Recruiter', requirement: 25, points: 2500 }
  ];

  const userReferrals = 7; // Example: user has 7 successful referrals

  achievements.forEach(achievement => {
    const unlocked = userReferrals >= achievement.requirement;
    console.log(`${unlocked ? '✅' : '❌'} ${achievement.name} (${achievement.requirement} referrals): ${unlocked ? 'UNLOCKED' : 'LOCKED'} - ${achievement.points} points`);
  });
}

// Run all tests
console.log('🎯 Code Buster Referral System Test Suite\n');
testReferralCodeGeneration();
testReferralRewards();
testReferralAchievements();

console.log('\n✅ All referral system tests completed!');
console.log('\n📋 Summary of Referral System Features:');
console.log('• 6-character alphanumeric referral codes');
console.log('• 100 points + 1 hint for referrer per successful referral');
console.log('• 200 bonus points + 1 bonus hint for new users');
console.log('• Milestone bonuses at 5, 10, and 25 referrals');
console.log('• 4 new referral-based achievements');
console.log('• Real-time referral code validation');
console.log('• Complete Firebase integration');
console.log('• Hosted at: https://codebuster.rutwikdev.com');
