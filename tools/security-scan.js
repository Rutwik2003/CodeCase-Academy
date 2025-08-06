#!/usr/bin/env node
// Security Scan Script for CodeCase Detective Academy
// Prevents deployment with exposed secrets

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Define patterns for various secret types
const SECRET_PATTERNS = [
  {
    name: 'Firebase API Key',
    pattern: /AIzaSy[A-Za-z0-9_-]{33}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'AWS Access Key',
    pattern: /AKIA[A-Z0-9]{16}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Google OAuth Client ID',
    pattern: /[0-9]+-[0-9A-Za-z_]{32}\.apps\.googleusercontent\.com/g,
    severity: 'HIGH'
  },
  {
    name: 'OpenAI API Key',
    pattern: /sk-[A-Za-z0-9]{48}/g,
    severity: 'CRITICAL'
  },
  {
    name: 'Generic API Key Pattern',
    pattern: /api[_-]?key["\s]*[:=]["\s]*[A-Za-z0-9_-]{20,}/gi,
    severity: 'MEDIUM'
  },
  {
    name: 'Private Key',
    pattern: /-----BEGIN [A-Z ]+PRIVATE KEY-----/g,
    severity: 'CRITICAL'
  }
];

// Files and directories to scan
const SCAN_PATTERNS = [
  'src/**/*.ts',
  'src/**/*.tsx',
  'src/**/*.js',
  'src/**/*.jsx',
  'docs/**/*.md',
  '*.json',
  '*.js',
  '*.ts',
  'dist/**/*.js' // Check build output
];

// Files to ignore
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'package-lock.json',
  '.env.example',
  'SECURITY_AUDIT_REPORT.md' // Our own report
];

let totalIssues = 0;
let criticalIssues = 0;

function scanFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const issues = [];

    SECRET_PATTERNS.forEach(({ name, pattern, severity }) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            file: filePath,
            secretType: name,
            severity,
            match: match.substring(0, 20) + '...', // Truncate for security
            line: content.substring(0, content.indexOf(match)).split('\\n').length
          });
        });
      }
    });

    return issues;
  } catch (error) {
    console.warn(`⚠️ Could not scan ${filePath}: ${error.message}`);
    return [];
  }
}

function getAllFiles(dir, fileList = []) {
  try {
    const files = readdirSync(dir);
    
    files.forEach(file => {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!IGNORE_PATTERNS.some(pattern => filePath.includes(pattern))) {
          getAllFiles(filePath, fileList);
        }
      } else {
        if (!IGNORE_PATTERNS.some(pattern => filePath.includes(pattern))) {
          fileList.push(filePath);
        }
      }
    });
  } catch (error) {
    // Directory doesn't exist or can't be read, skip it
  }
  
  return fileList;
}

function main() {
  console.log('🔍 Starting security scan for CodeCase Detective Academy...');
  console.log('=' .repeat(60));

  const allFiles = getAllFiles(projectRoot);
  const jsFiles = allFiles.filter(file => 
    file.endsWith('.js') || 
    file.endsWith('.ts') || 
    file.endsWith('.tsx') || 
    file.endsWith('.jsx') ||
    file.endsWith('.md') ||
    file.endsWith('.json')
  );

  console.log(`📁 Scanning ${jsFiles.length} files...`);

  const allIssues = [];

  jsFiles.forEach(file => {
    const issues = scanFile(file);
    allIssues.push(...issues);
  });

  // Report findings
  console.log('\\n📊 SECURITY SCAN RESULTS');
  console.log('=' .repeat(60));

  if (allIssues.length === 0) {
    console.log('✅ No secrets detected in codebase!');
    console.log('🚀 Safe to deploy');
    process.exit(0);
  }

  // Group issues by severity
  const critical = allIssues.filter(i => i.severity === 'CRITICAL');
  const high = allIssues.filter(i => i.severity === 'HIGH');
  const medium = allIssues.filter(i => i.severity === 'MEDIUM');

  console.log(`🚨 CRITICAL: ${critical.length} issues`);
  console.log(`⚠️ HIGH: ${high.length} issues`);
  console.log(`📝 MEDIUM: ${medium.length} issues`);

  // Display critical issues
  if (critical.length > 0) {
    console.log('\\n🚨 CRITICAL SECURITY ISSUES:');
    critical.forEach(issue => {
      console.log(`   📄 ${issue.file}:${issue.line}`);
      console.log(`   🔑 ${issue.secretType}: ${issue.match}`);
      console.log('');
    });
  }

  // Display high severity issues
  if (high.length > 0) {
    console.log('\\n⚠️ HIGH SEVERITY ISSUES:');
    high.forEach(issue => {
      console.log(`   📄 ${issue.file}:${issue.line}`);
      console.log(`   🔑 ${issue.secretType}: ${issue.match}`);
      console.log('');
    });
  }

  // Security recommendations
  console.log('\\n🛠️ SECURITY RECOMMENDATIONS:');
  
  if (critical.length > 0) {
    console.log('1. 🚨 IMMEDIATE: Revoke all exposed API keys');
    console.log('2. 🔑 Generate new secure keys');
    console.log('3. 🌍 Set up environment variables in deployment platform');
    console.log('4. 🧹 Clean and rebuild without secrets');
  }
  
  console.log('5. 📝 Use .env.local for development (not committed)');
  console.log('6. 🔍 Run this scan before every deployment');
  console.log('7. 🔐 Enable secret scanning in CI/CD pipeline');

  // Exit with error if critical issues found
  if (critical.length > 0) {
    console.log('\\n❌ DEPLOYMENT BLOCKED: Critical security issues found!');
    console.log('🔧 Fix all critical issues before deploying');
    process.exit(1);
  } else if (high.length > 0) {
    console.log('\\n⚠️ WARNING: High severity issues found');
    console.log('🔧 Recommend fixing before deployment');
    process.exit(1);
  } else {
    console.log('\\n✅ No critical issues found');
    console.log('🚀 Safe to deploy (check medium severity issues)');
    process.exit(0);
  }
}

// Run the security scan
main();
