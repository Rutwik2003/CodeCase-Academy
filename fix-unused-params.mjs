#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modifiedContent = content;
  let hasChanges = false;

  // Common patterns for unused parameters that should be prefixed with _
  const patterns = [
    // Arrow functions with unused params
    /\(([\w\s,]*)(error|err|event|e|index|idx)(\s*:\s*[^,)]+)?\s*\)\s*=>/g,
    // Function parameters that are commonly unused
    /\(([^)]*)(error|err|event|e|index|idx)(\s*:\s*[^,)]+)?([^)]*)\)/g,
  ];

  // Specific fixes for common unused parameter patterns
  const specificFixes = [
    // error parameters in catch blocks
    { from: /(catch\s*\(\s*)(error)(\s*[^)]*\))/g, to: '$1_$2$3' },
    { from: /(catch\s*\(\s*)(err)(\s*[^)]*\))/g, to: '$1_$2$3' },
    // map/forEach index parameters that aren't used
    { from: /(\.\s*map\s*\(\s*\([^,)]+,\s*)(index)(\s*[^)]*\))/g, to: '$1_$2$3' },
    { from: /(\.\s*forEach\s*\(\s*\([^,)]+,\s*)(index)(\s*[^)]*\))/g, to: '$1_$2$3' },
  ];

  specificFixes.forEach(fix => {
    const newContent = modifiedContent.replace(fix.from, fix.to);
    if (newContent !== modifiedContent) {
      modifiedContent = newContent;
      hasChanges = true;
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, modifiedContent);
    console.log(`✅ Fixed unused parameters in: ${path.relative(srcDir, filePath)}`);
    return true;
  }
  return false;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let totalChanges = 0;

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      totalChanges += processDirectory(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (processFile(fullPath)) {
        totalChanges++;
      }
    }
  });

  return totalChanges;
}

console.log('🔧 Fixing unused parameters by adding underscore prefixes...');
const changes = processDirectory(srcDir);
console.log(`\n✨ Completed! Fixed unused parameters in ${changes} files.`);
