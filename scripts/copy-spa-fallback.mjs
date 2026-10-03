#!/usr/bin/env node
/**
 * Script to copy index.html to 404.html for GitHub Pages SPA fallback
 * This ensures that client-side routing works correctly on GitHub Pages
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = resolve(__dirname, '..', 'dist');
const indexPath = join(distDir, 'index.html');
const fallbackPath = join(distDir, '404.html');

// Check if dist directory exists
if (!existsSync(distDir)) {
  console.error('Dist directory not found. Please run the build first.');
  process.exit(1);
}

// Check if index.html exists
if (!existsSync(indexPath)) {
  console.error('index.html not found in dist directory.');
  process.exit(1);
}

// Copy index.html to 404.html
try {
  const data = readFileSync(indexPath);
  writeFileSync(fallbackPath, data);
  console.log('SPA fallback created successfully: 404.html copied from index.html');
} catch (err) {
  console.error('Error copying file:', err);
  process.exit(1);
}