import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting prebuild script...');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log('Running in Vercel environment:', isVercel);

// Log environment variables for debugging
console.log('Environment variables:');
console.log('  VERCEL:', process.env.VERCEL);
console.log('  CI:', process.env.CI);
console.log('  GIT_LFS_SKIP_SMUDGE:', process.env.GIT_LFS_SKIP_SMUDGE);

// Function to check if a file is an LFS pointer
function isLfsPointer(filePath) {
  try {
    const head = execSync(`head -c 50 ${filePath}`, { encoding: 'utf8' });
    return head.includes('version https://git-lfs.github.com');
  } catch (error) {
    return false;
  }
}

// Function to get LFS file info
function getLfsFileInfo() {
  try {
    const lsFilesOutput = execSync('git lfs ls-files', { encoding: 'utf8' });
    const lines = lsFilesOutput.split('\n').filter(line => line.trim());
    
    return lines.map(line => {
      // Parse lines like: 9cfa81b271 * public/vamshieee/IMG20201111132919.jpg
      const parts = line.split(/\s+/);
      const oid = parts[0];
      // The filepath is everything after the second space
      const filepath = line.split('* ')[1];
      return { oid, filepath };
    }).filter(item => item.filepath); // Filter out any malformed entries
  } catch (error) {
    console.log('Could not get LFS file info');
    console.error(error);
    return [];
  }
}

// Function to convert LFS pointer to actual file using git lfs smudge
function convertLfsPointer(filepath) {
  try {
    console.log(`Converting LFS pointer: ${filepath}`);
    
    // Read the pointer file content
    const pointerContent = fs.readFileSync(filepath, 'utf8');
    
    // Use git lfs smudge to convert pointer to actual file
    const smudgeProcess = require('child_process').spawnSync('git', ['lfs', 'smudge'], {
      input: pointerContent,
      encoding: 'buffer'
    });
    
    if (smudgeProcess.status === 0) {
      // Write the actual file content
      fs.writeFileSync(filepath, smudgeProcess.stdout);
      console.log(`  Successfully converted pointer to actual file`);
      return true;
    } else {
      console.log(`  Failed to smudge file:`, smudgeProcess.stderr.toString());
      return false;
    }
  } catch (error) {
    console.log(`Failed to convert LFS pointer ${filepath}:`, error.message);
    return false;
  }
}

// Function to force download LFS files
function forceDownloadLfsFiles() {
  try {
    console.log('Force downloading LFS files...');
    
    // Set environment variables to ensure LFS files are downloaded
    const env = { ...process.env };
    env.GIT_LFS_SKIP_SMUDGE = '0';
    env.GIT_TRACE = '1';
    
    // Force download all LFS files
    execSync('git lfs pull --exclude="" --include="*"', {
      env,
      stdio: 'inherit'
    });
    
    console.log('LFS files force downloaded successfully');
    return true;
  } catch (error) {
    console.log('Failed to force download LFS files:', error.message);
    return false;
  }
}

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
const lfsFiles = getLfsFileInfo();
console.log('LFS files count:', lfsFiles.length);

if (lfsFiles.length > 0) {
  console.log('First few LFS files:');
  lfsFiles.slice(0, 3).forEach(file => {
    console.log('  ', file.oid, file.filepath);
  });
  
  // In Vercel environment, force download LFS files
  if (isVercel) {
    console.log('Forcing LFS file download in Vercel environment...');
    forceDownloadLfsFiles();
  }
}

// Try to pull LFS files normally first
console.log('Pulling LFS files...');
let pullSuccess = false;
try {
  // Set Git LFS environment variables for Vercel
  const env = { ...process.env };
  if (isVercel) {
    env.GIT_LFS_SKIP_SMUDGE = '0'; // Ensure files are downloaded in Vercel
    console.log('Setting GIT_LFS_SKIP_SMUDGE=0 for Vercel');
  }
  
  const pullOutput = execSync('git lfs pull', { 
    encoding: 'utf8',
    env,
    stdio: 'pipe'
  });
  console.log('LFS files pulled successfully');
  console.log('Pull output length:', pullOutput.length);
  pullSuccess = true;
} catch (error) {
  console.log('Could not pull LFS files with git lfs pull');
  console.error('Error during git lfs pull:', error.message);
}

// If normal pull failed or we're in Vercel, try alternative approaches
if (!pullSuccess || isVercel) {
  console.log('Trying alternative approaches for LFS files...');
  
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
  }
}

// Verify that files exist after pulling and check if they are actual files or pointers
console.log('Verifying file existence and content...');
let pointerFiles = [];

try {
  const fileCount = execSync('find public/vamshieee -type f | wc -l', { encoding: 'utf8' });
  console.log('Files in public/vamshieee:', fileCount.trim());
  
  // Check if files are LFS pointers
  console.log('Checking for LFS pointer files...');
  let pointerCount = 0;
  
  // Check all files in the vamshieee directory
  const checkCmd = 'find public/vamshieee -type f';
  const files = execSync(checkCmd, { encoding: 'utf8' }).split('\n').filter(f => f.trim());
  
  files.forEach(file => {
    if (file && isLfsPointer(file)) {
      pointerCount++;
      pointerFiles.push(file);
      console.log('  LFS pointer found:', file);
    }
  });
  
  console.log(`Found ${pointerCount} LFS pointer files`);
  
  // If we found pointer files in Vercel, try to convert them
  if (pointerCount > 0 && isVercel) {
    console.log('WARNING: LFS pointer files found in Vercel environment!');
    console.log('This indicates that LFS files were not properly downloaded.');
    console.log('Attempting to convert pointer files to actual files using git lfs smudge...');
    
    // Try to convert each pointer file
    let convertedCount = 0;
    for (const file of pointerFiles) {
      try {
        const success = convertLfsPointer(file);
        if (success) {
          console.log(`  Successfully converted ${file}`);
          convertedCount++;
        } else {
          console.log(`  Failed to convert ${file}`);
        }
      } catch (convertError) {
        console.log(`  Error converting ${file}:`, convertError.message);
      }
    }
    
    console.log(`Converted ${convertedCount} of ${pointerCount} pointer files`);
    
    // If we still have pointer files, try one more approach
    if (convertedCount < pointerCount) {
      console.log('Trying one more approach to download LFS files...');
      try {
        execSync('git lfs pull --exclude=""', { stdio: 'inherit' });
        console.log('Additional LFS pull completed');
      } catch (error) {
        console.log('Additional LFS pull failed:', error.message);
      }
    }
  }
  
  if (pointerCount > 0 && isVercel) {
    console.log('Vercel may have limitations with Git LFS.');
    console.log('If conversion fails, consider these alternatives:');
    console.log('1. Move large files to external storage (S3, Cloudinary, etc.)');
    console.log('2. Reduce file sizes to avoid LFS requirements');
    console.log('3. Use Vercel\'s file upload capabilities for large assets');
  }
} catch (error) {
  console.log('Could not verify files');
  console.error(error);
}

console.log('Prebuild script completed');