import { execSync } from 'child_process';
import fs from 'fs';

console.log('Starting prebuild script...');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log('Running in Vercel environment:', isVercel);

// Log environment variables for debugging
console.log('Environment variables:');
console.log('  VERCEL:', process.env.VERCEL);
console.log('  CI:', process.env.CI);
console.log('  GIT_LFS_SKIP_SMUDGE:', process.env.GIT_LFS_SKIP_SMUDGE);

console.log('Checking if Git LFS is installed...');
try {
  const versionOutput = execSync('git lfs --version', { encoding: 'utf8' });
  console.log('Git LFS is installed:', versionOutput.trim());
} catch (error) {
  console.log('Git LFS is not installed, installing...');
  // Try to install Git LFS
  try {
    execSync('npm install -g git-lfs', { stdio: 'inherit' });
    execSync('git lfs install', { stdio: 'inherit' });
  } catch (installError) {
    console.log('Could not install Git LFS automatically, continuing without it...');
  }
}

console.log('Checking LFS status...');
try {
  const statusOutput = execSync('git lfs status', { encoding: 'utf8' });
  console.log('LFS status:', statusOutput);
} catch (error) {
  console.log('Could not get LFS status');
  console.error(error);
}

console.log('Checking LFS files...');
let lfsFiles = [];
try {
  const lsFilesOutput = execSync('git lfs ls-files', { encoding: 'utf8' });
  lfsFiles = lsFilesOutput.split('\n').filter(line => line.trim());
  console.log('LFS files count:', lfsFiles.length);
  
  // Show first few LFS files for verification
  const firstFiles = lfsFiles.slice(0, 5);
  console.log('First few LFS files:');
  firstFiles.forEach(file => console.log('  ', file));
} catch (error) {
  console.log('Could not list LFS files');
  console.error(error);
}

console.log('Pulling LFS files...');
try {
  // Set Git LFS environment variables for Vercel
  const env = { ...process.env };
  if (isVercel) {
    env.GIT_LFS_SKIP_SMUDGE = '0'; // Ensure files are downloaded in Vercel
    console.log('Setting GIT_LFS_SKIP_SMUDGE=0 for Vercel');
  }
  
  // Also set GIT_TRACE to get more detailed logging
  env.GIT_TRACE = '1';
  
  const pullOutput = execSync('git lfs pull', { 
    encoding: 'utf8',
    env,
    stdio: 'pipe'
  });
  console.log('LFS files pulled successfully');
  console.log('Pull output length:', pullOutput.length);
} catch (error) {
  console.log('Could not pull LFS files with git lfs pull, trying alternative approaches...');
  console.error('Error during git lfs pull:', error.message);
  
  // Try git lfs fetch + git lfs checkout
  try {
    console.log('Trying git lfs fetch...');
    execSync('git lfs fetch', { stdio: 'inherit' });
    console.log('Fetching LFS files completed');
    
    console.log('Trying git lfs checkout...');
    execSync('git lfs checkout', { stdio: 'inherit' });
    console.log('LFS files checked out successfully');
  } catch (checkoutError) {
    console.log('Could not fetch/checkout LFS files either');
    console.error('Error during git lfs checkout:', checkoutError.message);
    
    // Last resort: try to manually download if we're in Vercel
    if (isVercel) {
      console.log('Trying manual download approach for Vercel...');
      try {
        // This is a fallback for Vercel environments where LFS might not work properly
        console.log('WARNING: Manual download approach may not work for all files');
      } catch (manualError) {
        console.log('Manual download also failed');
        console.error(manualError);
      }
    }
  }
}

// Verify that files exist after pulling and check if they are actual files or pointers
console.log('Verifying file existence and content...');
let pointerFiles = [];
try {
  const fileCount = execSync('find public/vamshieee -type f | wc -l', { encoding: 'utf8' });
  console.log('Files in public/vamshieee:', fileCount.trim());
  
  // Check a sample of files to see if they are LFS pointers or actual files
  const sampleFiles = [
    'public/vamshieee/IMG20201111132919.jpg',
    'public/vamshieee/20210810_093418.mp4'
  ];
  
  sampleFiles.forEach(file => {
    try {
      execSync(`test -f ${file}`);
      console.log(`File exists: ${file}`);
      
      // Check file size
      const size = execSync(`wc -c < ${file}`, { encoding: 'utf8' });
      console.log(`  Size: ${size.trim()} bytes`);
      
      // Check if it's an LFS pointer or actual file
      const head = execSync(`head -c 50 ${file}`, { encoding: 'utf8' });
      if (head.includes('version https://git-lfs.github.com')) {
        console.log('  WARNING: This is an LFS pointer file, not the actual file!');
        pointerFiles.push(file);
      } else {
        console.log('  This appears to be the actual file');
      }
    } catch (err) {
      console.log(`File does not exist: ${file}`);
    }
  });
  
  // If we found pointer files, we need to take additional action
  if (pointerFiles.length > 0 && isVercel) {
    console.log('Found LFS pointer files in Vercel environment. This indicates LFS files were not properly downloaded.');
    console.log('Attempting to force download of LFS files...');
    
    try {
      // Force download specific files
      console.log('Force downloading specific LFS files...');
      pointerFiles.forEach(file => {
        const relativePath = file.replace('public/', '');
        try {
          execSync(`git lfs pull --include="${relativePath}"`, { stdio: 'inherit' });
          console.log(`  Successfully pulled ${relativePath}`);
        } catch (pullError) {
          console.log(`  Failed to pull ${relativePath}`);
          console.error(pullError.message);
        }
      });
    } catch (forceError) {
      console.log('Force download approach also failed');
      console.error(forceError);
    }
  }
} catch (error) {
  console.log('Could not verify files');
  console.error(error);
}

console.log('Prebuild script completed');