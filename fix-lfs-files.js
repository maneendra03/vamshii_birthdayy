#!/usr/bin/env node

// Script to fix LFS file issues for Vercel deployment
import { execSync } from 'child_process';
import fs from 'fs';

console.log('=== LFS File Fix Script ===');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log('Running in Vercel environment:', isVercel);

// Function to check if a file is an LFS pointer
function isLfsPointer(filePath) {
  try {
    const head = execSync(`head -c 50 ${filePath}`, { encoding: 'utf8' });
    return head.includes('version https://git-lfs.github.com');
  } catch (error) {
    return false;
  }
}

// Function to get file size in MB
function getFileSizeMB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024); // Convert to MB
  } catch (error) {
    return 0;
  }
}

// Function to identify large files that should use LFS
function identifyLargeFiles() {
  console.log('\n=== Identifying large files ===');
  
  try {
    // Find all files in public/vamshieee
    const findCmd = 'find public/vamshieee -type f';
    const files = execSync(findCmd, { encoding: 'utf8' }).split('\n').filter(f => f.trim());
    
    console.log(`Found ${files.length} files in public/vamshieee`);
    
    // Categorize files by size
    const smallFiles = [];
    const mediumFiles = [];
    const largeFiles = [];
    
    files.forEach(file => {
      const sizeMB = getFileSizeMB(file);
      
      if (sizeMB < 10) {
        smallFiles.push({ file, sizeMB });
      } else if (sizeMB < 50) {
        mediumFiles.push({ file, sizeMB });
      } else {
        largeFiles.push({ file, sizeMB });
      }
    });
    
    console.log(`\nSmall files (< 10MB): ${smallFiles.length}`);
    smallFiles.slice(0, 5).forEach(f => console.log(`  ${f.file} (${f.sizeMB.toFixed(2)} MB)`));
    
    console.log(`\nMedium files (10-50MB): ${mediumFiles.length}`);
    mediumFiles.slice(0, 5).forEach(f => console.log(`  ${f.file} (${f.sizeMB.toFixed(2)} MB)`));
    
    console.log(`\nLarge files (> 50MB): ${largeFiles.length}`);
    largeFiles.forEach(f => console.log(`  ${f.file} (${f.sizeMB.toFixed(2)} MB)`));
    
    return { smallFiles, mediumFiles, largeFiles };
  } catch (error) {
    console.log('Error identifying large files:', error.message);
    return { smallFiles: [], mediumFiles: [], largeFiles: [] };
  }
}

// Function to check current LFS tracking
function checkLfsTracking() {
  console.log('\n=== Checking current LFS tracking ===');
  
  try {
    const lfsFiles = execSync('git lfs ls-files', { encoding: 'utf8' });
    const lines = lfsFiles.split('\n').filter(line => line.trim());
    
    console.log(`Currently tracking ${lines.length} files with LFS:`);
    lines.slice(0, 10).forEach(line => console.log(`  ${line}`));
    
    if (lines.length > 10) {
      console.log(`  ... and ${lines.length - 10} more files`);
    }
    
    return lines;
  } catch (error) {
    console.log('Error checking LFS tracking:', error.message);
    return [];
  }
}

// Function to suggest .gitattributes configuration
function suggestGitAttributes(largeFiles) {
  console.log('\n=== Suggested .gitattributes configuration ===');
  
  console.log('# Only track largest files with LFS (for GitHub storage limits)');
  largeFiles.slice(0, 10).forEach(f => {
    console.log(`${f.file.replace('public/', '')} filter=lfs diff=lfs merge=lfs -text`);
  });
  
  console.log('\n# All other files should be tracked normally');
  console.log('# Remove any broad patterns like *.jpg or *.mp4');
}

// Function to verify files in dist directory
function verifyDistFiles() {
  console.log('\n=== Verifying dist directory ===');
  
  try {
    // Check if dist/vamshieee exists
    if (!fs.existsSync('dist/vamshieee')) {
      console.log('dist/vamshieee directory does not exist');
      return;
    }
    
    // Check for LFS pointers in dist
    const findCmd = 'find dist/vamshieee -type f';
    const files = execSync(findCmd, { encoding: 'utf8' }).split('\n').filter(f => f.trim());
    
    let pointerCount = 0;
    const pointerFiles = [];
    
    files.forEach(file => {
      if (file && isLfsPointer(file)) {
        pointerCount++;
        pointerFiles.push(file);
      }
    });
    
    console.log(`Found ${pointerCount} LFS pointer files in dist directory`);
    
    if (pointerCount > 0) {
      console.log('LFS pointer files found:');
      pointerFiles.slice(0, 5).forEach(f => console.log(`  ${f}`));
      
      if (pointerCount > 5) {
        console.log(`  ... and ${pointerCount - 5} more files`);
      }
      
      console.log('\n=== RECOMMENDATION ===');
      console.log('Vercel has issues with Git LFS. Consider these options:');
      console.log('1. Optimize media files to reduce size and avoid LFS');
      console.log('2. Only use LFS for the largest files (> 50MB)');
      console.log('3. For immediate fix, try to untrack files from LFS and commit directly to Git');
    } else {
      console.log('No LFS pointer files found in dist directory - GOOD!');
    }
  } catch (error) {
    console.log('Error verifying dist files:', error.message);
  }
}

// Main execution
function main() {
  // Identify file sizes
  const { smallFiles, mediumFiles, largeFiles } = identifyLargeFiles();
  
  // Check current LFS tracking
  const lfsFiles = checkLfsTracking();
  
  // Suggest .gitattributes configuration
  suggestGitAttributes(largeFiles);
  
  // Verify dist files
  verifyDistFiles();
  
  console.log('\n=== Script completed ===');
}

// Run the script
main();