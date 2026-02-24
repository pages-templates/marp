#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync, readdirSync, renameSync } from 'fs';
import { join, relative, dirname, basename } from 'path';

const SOURCE_DIR = './content';
const OUTPUT_DIR = './dist';

// Clean and prepare output
console.log('🧹 Cleaning output directory...');
if (existsSync(OUTPUT_DIR)) {
  rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
mkdirSync(OUTPUT_DIR, { recursive: true });

console.log(`🎞️ Generating all slides from '${SOURCE_DIR}'...`);

// Generate all HTML slides in-place under content/
try {
  execSync(`npx @marp-team/marp-cli@latest "${SOURCE_DIR}/**/*.md"`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error generating slides');
  process.exit(1);
}

// Find all generated .html files
function findHtmlFiles(dir) {
  const files = [];
  const items = readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

const htmlFiles = findHtmlFiles(SOURCE_DIR);

// Move generated .html files into dist/
for (const htmlFile of htmlFiles) {
  // Get relative path from SOURCE_DIR
  const relPath = relative(SOURCE_DIR, htmlFile);
  const dir = dirname(relPath);
  const base = basename(relPath);
  const name = basename(base, '.html');
  
  // Normalize dir: if it's "." then make it empty
  const normalizedDir = dir === '.' ? '' : dir;
  
  let outDir;
  if (name === 'index') {
    // Keep index in the same directory inside dist
    outDir = normalizedDir ? join(OUTPUT_DIR, normalizedDir) : OUTPUT_DIR;
  } else {
    // Create directory dist/<dir>/<name>/ and move there as index.html
    outDir = normalizedDir 
      ? join(OUTPUT_DIR, normalizedDir, name)
      : join(OUTPUT_DIR, name);
  }
  
  mkdirSync(outDir, { recursive: true });
  const destPath = join(outDir, 'index.html');
  
  console.log(`🧩 Moving: ${htmlFile} → ${destPath}`);
  renameSync(htmlFile, destPath);
}

console.log(`✅ All slides built successfully in '${OUTPUT_DIR}'`);
