#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping console methods to Logger methods and levels
const consoleToLogger = {
  'console.log': 'logger.info',
  'console.info': 'logger.info', 
  'console.warn': 'logger.warn',
  'console.error': 'logger.error',
  'console.debug': 'logger.debug'
};

// Files to exclude from processing
const excludePatterns = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /\.mjs$/,
  /\.md$/,
  /package\.json$/,
  /\.config\./,
  /\.log$/
];

// Function to determine appropriate log category based on file path
function getLogCategory(filePath) {
  if (filePath.includes('cms')) return 'LogCategory.CMS';
  if (filePath.includes('auth') || filePath.includes('Auth')) return 'LogCategory.AUTH';
  if (filePath.includes('firebase') || filePath.includes('Firebase')) return 'LogCategory.FIREBASE';
  if (filePath.includes('components')) return 'LogCategory.COMPONENT';
  if (filePath.includes('utils')) return 'LogCategory.UTILITY';
  if (filePath.includes('hooks')) return 'LogCategory.HOOK';
  if (filePath.includes('contexts')) return 'LogCategory.CONTEXT';
  if (filePath.includes('data')) return 'LogCategory.DATA';
  return 'LogCategory.GENERAL';
}

// Function to check if file should be excluded
function shouldExcludeFile(filePath) {
  return excludePatterns.some(pattern => pattern.test(filePath));
}

// Function to add logger import if not present
function ensureLoggerImport(content, filePath) {
  if (content.includes('import') && !content.includes("from '../utils/logger'") && !content.includes("from './utils/logger'")) {
    const relativePath = path.relative(path.dirname(filePath), path.join(__dirname, 'src/utils/logger')).replace(/\\/g, '/');
    const importPath = relativePath.startsWith('.') ? relativePath : './' + relativePath;
    
    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('import{')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, `import { logger, LogCategory } from '${importPath}';`);
      return lines.join('\n');
    }
  }
  return content;
}

// Function to replace console statements
function replaceConsoleStatements(content, filePath) {
  let modified = content;
  const category = getLogCategory(filePath);
  
  // Replace various console statement patterns
  Object.entries(consoleToLogger).forEach(([consoleMethod, loggerMethod]) => {
    // Simple console.log("message") pattern
    const simplePattern = new RegExp(`${consoleMethod.replace('.', '\\.')}\\s*\\(([^;]+)\\)\\s*;?`, 'g');
    modified = modified.replace(simplePattern, (match, args) => {
      return `${loggerMethod}(${args}, ${category});`;
    });
    
    // Multi-line console statements
    const multiLinePattern = new RegExp(`${consoleMethod.replace('.', '\\.')}\\s*\\(([\\s\\S]*?)\\)\\s*;?`, 'g');
    modified = modified.replace(multiLinePattern, (match, args) => {
      return `${loggerMethod}(${args}, ${category});`;
    });
  });
  
  return modified;
}

// Function to process a single file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains console statements
    if (!/console\.(log|info|warn|error|debug)/.test(content)) {
      return false; // No changes needed
    }
    
    let newContent = content;
    newContent = ensureLoggerImport(newContent, filePath);
    newContent = replaceConsoleStatements(newContent, filePath);
    
    // Only write if content changed
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Processed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find and process files
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let processedCount = 0;
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    if (shouldExcludeFile(fullPath)) {
      return;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processedCount += processDirectory(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx'))) {
      if (processFile(fullPath)) {
        processedCount++;
      }
    }
  });
  
  return processedCount;
}

// Main execution
const srcPath = path.join(__dirname, 'src');
console.log('🔄 Starting console.log replacement process...');
console.log(`📁 Processing directory: ${srcPath}`);

const processedCount = processDirectory(srcPath);

console.log(`\n✅ Process complete!`);
console.log(`📊 Files processed: ${processedCount}`);
console.log('🎯 All console statements have been replaced with professional logging.');
