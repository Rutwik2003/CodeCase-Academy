// Script to fix all logger calls in CaseManagement.tsx
import fs from 'fs';

const filePath = './src/cms/pages/CaseManagement.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix patterns where parameters are in wrong order
content = content.replace(/logger\.(\w+)\(([^,]+),\s*([^,]+),\s*LogCategory\.(\w+)\)/g, 'logger.$1(LogCategory.$4, $2, $3)');
content = content.replace(/logger\.(\w+)\(([^,]+),\s*LogCategory\.(\w+)\)/g, 'logger.$1(LogCategory.$3, $2)');

// Remove extra parameters beyond 4
content = content.replace(/logger\.(\w+)\(LogCategory\.(\w+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'logger.$1(LogCategory.$2, $3, $4)');
content = content.replace(/logger\.(\w+)\(LogCategory\.(\w+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'logger.$1(LogCategory.$2, $3, $4)');

fs.writeFileSync(filePath, content);
console.log('Fixed logger calls in CaseManagement.tsx');
