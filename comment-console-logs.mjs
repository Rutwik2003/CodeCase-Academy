#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const projectRoot = process.cwd();
const srcDir = join(projectRoot, 'src');

// Function to recursively find all TypeScript/JavaScript files
function findSourceFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      findSourceFiles(fullPath, files);
    } else if (item.match(/\.(ts|tsx|js|jsx)$/)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to comment out console statements
function commentOutConsoleStatements(content) {
  const lines = content.split('\n');
  const modifiedLines = lines.map(line => {
    // Skip already commented lines
    if (line.trim().startsWith('//')) {
      return line;
    }
    
    // Check if line contains console.log, console.error, console.warn, console.info
    if (line.match(/\s*console\.(log|error|warn|info)\s*\(/)) {
      // Add comment prefix and production note
      const indentation = line.match(/^(\s*)/)[1];
      return `${indentation}// ${line.trim()} // COMMENTED FOR PRODUCTION`;
    }
    
    return line;
  });
  
  return modifiedLines.join('\n');
}

// Main execution
console.log('🔧 Commenting out console statements for production...');

const sourceFiles = findSourceFiles(srcDir);
let modifiedCount = 0;

for (const filePath of sourceFiles) {
  try {
    const originalContent = readFileSync(filePath, 'utf8');
    const modifiedContent = commentOutConsoleStatements(originalContent);
    
    if (originalContent !== modifiedContent) {
      writeFileSync(filePath, modifiedContent, 'utf8');
      console.log(`✅ Modified: ${filePath.replace(projectRoot, '.')}`);
      modifiedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log(`\n🎉 Completed! Modified ${modifiedCount} files.`);
console.log('All console statements in src/ have been commented out for production.');
console.log('To re-enable debugging, uncomment the lines marked with "// COMMENTED FOR PRODUCTION"');
