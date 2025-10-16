import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting postbuild script...');

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

// Function to verify files in dist directory
function verifyDistFiles() {
  console.log('Verifying files in dist directory...');
  
  try {
    // Check if dist/vamshieee directory exists
    if (!fs.existsSync('dist/vamshieee')) {
      console.log('dist/vamshieee directory does not exist, creating it...');
      fs.mkdirSync('dist/vamshieee', { recursive: true });
    }
    
    // Count files in dist/vamshieee
    const distFileCount = execSync('find dist/vamshieee -type f | wc -l', { encoding: 'utf8' });
    console.log('Files in dist/vamshieee:', distFileCount.trim());
    
    // Count files in public/vamshieee
    const publicFileCount = execSync('find public/vamshieee -type f | wc -l', { encoding: 'utf8' });
    console.log('Files in public/vamshieee:', publicFileCount.trim());
    
    // Check if we need to copy files
    if (parseInt(distFileCount.trim()) < parseInt(publicFileCount.trim())) {
      console.log('Missing files in dist directory, copying from public...');
      
      // Copy all files from public/vamshieee to dist/vamshieee
      execSync('cp -r public/vamshieee/* dist/vamshieee/', { stdio: 'inherit' });
      console.log('Files copied successfully');
    }
    
    // Check for LFS pointers in dist
    console.log('Checking for LFS pointers in dist directory...');
    const checkCmd = 'find dist/vamshieee -type f';
    const files = execSync(checkCmd, { encoding: 'utf8' }).split('\n').filter(f => f.trim());
    
    let pointerCount = 0;
    let pointerFiles = [];
    
    console.log(`Checking ${files.length} files in dist for LFS pointers...`);
    
    files.forEach(file => {
      if (file && isLfsPointer(file)) {
        pointerCount++;
        pointerFiles.push(file);
        console.log('  LFS pointer found in dist:', file);
      }
    });
    
    console.log(`Found ${pointerCount} LFS pointer files in dist directory`);
    
    if (pointerCount > 0) {
      console.log('WARNING: LFS pointers found in dist directory!');
      console.log('This indicates that Vercel is not properly handling LFS files.');
      console.log('RECOMMENDATION: Optimize media files to avoid LFS requirements.');
    } else {
      console.log('SUCCESS: No LFS pointers found in dist directory.');
    }
    
    return pointerCount;
  } catch (error) {
    console.log('Error during dist verification:', error.message);
    return -1;
  }
}

// Run verification
const pointerCount = verifyDistFiles();

console.log('Postbuild script completed');
console.log(`Result: ${pointerCount} LFS pointers found in dist directory`);