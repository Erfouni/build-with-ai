#!/usr/bin/env node

/**
 * Validates all YAML files in the repository to prevent syntax errors
 * from reaching production or breaking automated workflows.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const SEARCH_DIRS = ['.github'];

let errorCount = 0;
let checkedCount = 0;

function validateYamlFile(filePath) {
  checkedCount++;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    yaml.load(content);
    console.log(`[PASS] ${path.relative(ROOT_DIR, filePath)}`);
  } catch (err) {
    errorCount++;
    console.error(`[FAIL] ${path.relative(ROOT_DIR, filePath)}: ${err.message}`);
  }
}

function scanDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.endsWith('.yml') || entry.endsWith('.yaml')) {
      validateYamlFile(fullPath);
    }
  }
}

console.log('Validating repository YAML files...');
for (const dir of SEARCH_DIRS) {
  scanDir(path.join(ROOT_DIR, dir));
}

console.log(`\nChecked ${checkedCount} YAML file(s). ${errorCount} error(s) found.`);

if (errorCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
