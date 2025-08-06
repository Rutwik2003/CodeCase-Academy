import { auth, db } from './src/config/firebase';
import { doc, setDoc } from 'firebase/firestore';

console.log('🔥 Testing Firestore connection...');
console.log('Database object:', db);

// Test writing to Firestore
const testData = {
  test: true,
  timestamp: new Date(),
  message: 'Testing Firestore write permissions'
};

const testDoc = doc(db, 'test', 'firestore-test');

console.log('📝 Attempting to write test document...');
setDoc(testDoc, testData)
  .then(() => {
    console.log('✅ Firestore write test successful!');
  })
  .catch((error) => {
    console.error('❌ Firestore write test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  });
