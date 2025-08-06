#!/usr/bin/env node

/**
 * Environment Validation Script for CodeCase.rutwikdev.com
 * Validates all environment variables are properly set
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple .env parser
function loadEnv(filepath) {
  const env = {};
  if (existsSync(filepath)) {
    const content = readFileSync(filepath, 'utf8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
  }
  return env;
}

// Load environment variables from project root
const projectRoot = dirname(__dirname);
const envFile = join(projectRoot, '.env');
const envVars = loadEnv(envFile);

console.log('🔍 CodeCase Environment Validation');
console.log('Domain: codecase.rutwikdev.com');
console.log('=' .repeat(50));

if (!existsSync(envFile)) {
  console.log('❌ .env file not found!');
  console.log('Please ensure the .env file exists in the project root.');
  process.exit(1);
}

const requiredVars = [
  'VITE_APP_URL',
  'VITE_DOMAIN', 
  'VITE_APPWRITE_PROJECT_ID',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_GOOGLE_ANALYTICS_ID'
];

const optionalVars = [
  'VITE_APPWRITE_ENDPOINT',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID'
];

let hasErrors = false;

console.log('\n✅ Required Variables:');
requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    const displayValue = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`  ✓ ${varName}: ${displayValue}`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
    hasErrors = true;
  }
});

console.log('\n📋 Optional Variables:');
optionalVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    const displayValue = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`  ✓ ${varName}: ${displayValue}`);
  } else {
    console.log(`  ⚠️  ${varName}: Not set (using defaults)`);
  }
});

// Validate domain configuration
console.log('\n🌐 Domain Configuration:');
const appUrl = envVars.VITE_APP_URL;
const domain = envVars.VITE_DOMAIN;

if (appUrl && appUrl.includes('codecase.rutwikdev.com')) {
  console.log('  ✓ App URL points to custom domain');
} else {
  console.log('  ❌ App URL should be https://codecase.rutwikdev.com');
  hasErrors = true;
}

if (domain && domain === 'codecase.rutwikdev.com') {
  console.log('  ✓ Domain correctly set to codecase.rutwikdev.com');
} else {
  console.log('  ❌ Domain should be codecase.rutwikdev.com');
  hasErrors = true;
}

// Check if Appwrite project ID is updated
const appwriteProjectId = envVars.VITE_APPWRITE_PROJECT_ID;
if (appwriteProjectId && appwriteProjectId !== 'your-appwrite-project-id-here') {
  console.log('  ✓ Appwrite Project ID updated');
} else {
  console.log('  ⚠️  Appwrite Project ID needs to be updated');
  console.log('     Please replace "your-appwrite-project-id-here" with actual ID');
}

// Firebase credentials check
console.log('\n🔥 Firebase Configuration:');
const firebaseApiKey = envVars.VITE_FIREBASE_API_KEY;
if (firebaseApiKey && firebaseApiKey.startsWith('AIzaSy')) {
  console.log('  ✓ Firebase API Key format is valid');
} else {
  console.log('  ❌ Firebase API Key missing or invalid format');
  hasErrors = true;
}

const firebaseProjectId = envVars.VITE_FIREBASE_PROJECT_ID;
if (firebaseProjectId === 'codebuster-82940') {
  console.log('  ✓ Firebase Project ID matches existing project');
} else {
  console.log('  ❌ Firebase Project ID should be codebuster-82940');
  hasErrors = true;
}

// Analytics check
console.log('\n📊 Analytics Configuration:');
const analyticsId = envVars.VITE_GOOGLE_ANALYTICS_ID;
if (analyticsId && analyticsId !== 'G-XXXXXXXXXX') {
  console.log('  ✓ Google Analytics ID configured');
} else {
  console.log('  ❌ Google Analytics ID should be configured with your actual tracking ID');
  hasErrors = true;
}

// Security check
console.log('\n🛡️  Security Check:');
try {
  const gitignoreContent = readFileSync(join(projectRoot, '.gitignore'), 'utf8');
  if (gitignoreContent.includes('.env') && gitignoreContent.includes('.env.local')) {
    console.log('  ✓ .env files are properly ignored in git');
  } else {
    console.log('  ❌ .env files should be added to .gitignore');
    hasErrors = true;
  }
} catch (error) {
  console.log('  ⚠️  Could not read .gitignore file');
}

// Final result
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Environment validation FAILED');
  console.log('Please fix the issues above before deploying.');
  process.exit(1);
} else {
  console.log('✅ Environment validation PASSED');
  console.log('🚀 Ready for deployment to codecase.rutwikdev.com!');
  console.log('\nNext steps:');
  console.log('1. Create Appwrite project and update VITE_APPWRITE_PROJECT_ID');
  console.log('2. Configure DNS for codecase.rutwikdev.com');
  console.log('3. Add GitHub secrets for deployment');
  console.log('4. Push to main branch to deploy');
}
