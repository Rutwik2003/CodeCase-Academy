// Test script to verify scoring system
import { validateCase } from './src/utils/caseValidator.ts';

// Test Case 1 validation with all features implemented
const testHtml1 = `
<header>
  <h1>Test Header</h1>
  <nav>
    <a href="#home">Home</a>
    <a href="#about">About</a>
  </nav>
</header>
`;

const testCss1 = `
header {
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

nav a:hover {
  background: rgba(255,255,255,0.2);
  transition: all 0.3s ease;
}
`;

console.log('Testing Case 1 with all features:');
const result1 = validateCase('case-1', testHtml1, testCss1, '', '');
console.log(`Score: ${result1.score}/${result1.maxScore} (${Math.round((result1.score/result1.maxScore)*100)}%)`);
console.log('Feedback:', result1.feedback);

// Test Case 2 validation with all features
const testHtml2 = `
<div class="container">
  <button class="btn">Click me</button>
  <div class="offer-card">Special offer</div>
</div>
`;

const testCss2 = `
.btn:hover {
  background: #007bff;
  cursor: pointer;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.offer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
`;

console.log('\nTesting Case 2 with all features:');
const result2 = validateCase('case-2', testHtml2, testCss2, '', '');
console.log(`Score: ${result2.score}/${result2.maxScore} (${Math.round((result2.score/result2.maxScore)*100)}%)`);
console.log('Feedback:', result2.feedback);

// Test edge case - excessive features that might cause over 100%
const excessiveCss = `
.btn:hover {
  background: linear-gradient(45deg, red, blue);
  cursor: pointer;
  transform: scale(1.1) rotate(5deg) translateX(10px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: blur(1px);
  opacity: 0.8;
}

.offer-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  border: 2px solid gold;
}

button:hover {
  background: rainbow;
}
`;

console.log('\nTesting with excessive features:');
const result3 = validateCase('case-2', testHtml2, excessiveCss, '', '');
console.log(`Score: ${result3.score}/${result3.maxScore} (${Math.round((result3.score/result3.maxScore)*100)}%)`);
console.log('Should not exceed 100%!');
