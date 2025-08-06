// Debug script to check mission data structure

// Since we can't directly import the TypeScript file, let's check the structure manually
console.log('=== Mission Data Structure Debug ===');

// Simulate what should be the missions structure based on what we read
const testMissionStructure = {
  missions: [
    {
      id: 'clue-1',
      title: 'Clue 1: The Hidden Message',
      successConditions: [
        'Remove the hidden attribute and make the message visible',
        'Replace <center> tags with proper HTML structure',
        'Apply proper CSS styling for the revealed message'
      ]
    },
    {
      id: 'clue-2', 
      title: 'Clue 2: The Hidden Instagram Screenshot',
      successConditions: [
        'Change display: none to display: block on #insta-clue element',
        'Style the revealed Instagram evidence section appropriately'
      ]
    },
    {
      id: 'clue-3',
      title: 'Clue 3: The Final Location', 
      successConditions: [
        'Change visibility: hidden to visibility: visible on #address-clue',
        'Replace <font> tags with modern CSS styling',
        'Apply proper styling to the revealed location information'
      ]
    }
  ]
};

console.log('Expected number of missions:', testMissionStructure.missions.length);

testMissionStructure.missions.forEach((mission, index) => {
  console.log(`\nMission ${index + 1}:`);
  console.log(`  ID: ${mission.id}`);
  console.log(`  Title: ${mission.title}`);
  console.log(`  Success Conditions (${mission.successConditions.length}):`);
  mission.successConditions.forEach((condition, i) => {
    console.log(`    ${i + 1}. ${condition}`);
  });
});

console.log('\n=== Checking Mission 2 specifically ===');
const mission2 = testMissionStructure.missions[1];
console.log('Mission 2 ID:', mission2.id);
console.log('Mission 2 conditions:', mission2.successConditions);

// Check if any conditions are empty or malformed
const hasInvalidConditions = mission2.successConditions.some(condition => 
  !condition || condition.trim() === '' || condition.length < 10
);

console.log('Mission 2 has invalid conditions:', hasInvalidConditions);

if (!hasInvalidConditions) {
  console.log('✅ Mission 2 structure appears valid');
} else {
  console.log('❌ Mission 2 has structural issues');
}
