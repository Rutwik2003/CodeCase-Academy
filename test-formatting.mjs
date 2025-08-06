// Test the formatPoints function
const formatPoints = (points) => {
  if (points < 1000) {
    return points.toString();
  }
  
  const thousands = points / 1000;
  
  // If it's a whole number of thousands, show without decimal
  if (thousands % 1 === 0) {
    return `${thousands}k`;
  }
  
  // For decimal values, show up to 2 decimal places and remove trailing zeros
  const formatted = thousands.toFixed(2);
  const withoutTrailingZeros = formatted.replace(/\.?0+$/, '');
  
  return `${withoutTrailingZeros}k`;
};

// Test cases for different point values
const testCases = [
  999,    // Should be "999"
  1000,   // Should be "1k"
  1250,   // Should be "1.25k"
  1500,   // Should be "1.5k"
  1750,   // Should be "1.75k"
  2000,   // Should be "2k"
  2300,   // Should be "2.3k"
  2500,   // Should be "2.5k"
  12500,  // Should be "12.5k"
  15000,  // Should be "15k"
  15750   // Should be "15.75k"
];

console.log('🧪 Testing Points Formatting Function\n');

testCases.forEach(points => {
  const formatted = formatPoints(points);
  console.log(`${points} points → "${formatted}"`);
});

console.log('\n✅ Points formatting test complete!');
