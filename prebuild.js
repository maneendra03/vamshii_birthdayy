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
    // Properly escape the file path for shell commands
    const escapedPath = filePath.replace(/(["\s'$`\\])/g, '\\$1');
    const head = execSync(`head -c 50 ${escapedPath}`, { encoding: 'utf8' });
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

// Function to force download all LFS files with maximum verbosity
function forceDownloadAllLfsFiles() {
  try {
    console.log('Force downloading ALL LFS files with maximum verbosity...');
    
    // Set environment variables to ensure LFS files are downloaded
    const env = { ...process.env };
    env.GIT_LFS_SKIP_SMUDGE = '0';
    env.GIT_TRACE = '2'; // Maximum verbosity
    env.GIT_CURL_VERBOSE = '2';
    
    // Force download all LFS files
    execSync('git lfs pull --exclude="" --include="*" --verbose', {
      env,
      stdio: 'inherit'
    });
    
    console.log('ALL LFS files force downloaded successfully');
    return true;
  } catch (error) {
    console.log('Failed to force download ALL LFS files:', error.message);
    return false;
  }
}

// Function to verify and fix LFS files
function verifyAndFixLfsFiles() {
  console.log('Verifying and fixing LFS files...');
  
  try {
    // Count total files
    const fileCount = execSync('find public/vamshieee -type f | wc -l', { encoding: 'utf8' });
    console.log('Total files in public/vamshieee:', fileCount.trim());
    
    // Check all files in the vamshieee directory
    const checkCmd = 'find public/vamshieee -type f';
    const files = execSync(checkCmd, { encoding: 'utf8' }).split('\n').filter(f => f.trim());
    
    let pointerCount = 0;
    let pointerFiles = [];
    
    console.log(`Checking ${files.length} files for LFS pointers...`);
    
    files.forEach(file => {
      if (file && isLfsPointer(file)) {
        pointerCount++;
        pointerFiles.push(file);
        console.log('  LFS pointer found:', file);
      }
    });
    
    console.log(`Found ${pointerCount} LFS pointer files out of ${files.length} total files`);
    
    // If we found pointer files, try to convert them
    if (pointerCount > 0) {
      console.log('Attempting to convert pointer files to actual files...');
      
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
      return { pointerCount, convertedCount };
    }
    
    return { pointerCount: 0, convertedCount: 0 };
  } catch (error) {
    console.log('Error during verification and fixing:', error.message);
    return { pointerCount: -1, convertedCount: -1 };
  }
}

// NEW: Function to check if we're in a git repository with LFS
function checkGitLfsRepo() {
  try {
    // Check if this is a git repo
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    console.log('Confirmed: This is a git repository');
    
    // Check if LFS is initialized
    execSync('git lfs ls-files', { stdio: 'ignore' });
    console.log('Confirmed: Git LFS is initialized');
    
    return true;
  } catch (error) {
    console.log('This is not a git repository with LFS or there was an error:', error.message);
    return false;
  }
}

// NEW: Function to copy files from LFS storage if available
function copyLfsFilesIfAvailable() {
  try {
    console.log('Checking for LFS files in local storage...');
    
    // In some environments, LFS files might be available in .git/lfs/objects
    const lfsObjectsPath = '.git/lfs/objects';
    if (fs.existsSync(lfsObjectsPath)) {
      console.log('LFS objects directory found');
      // This is a complex operation that would require parsing the LFS structure
      // For now, we'll just log that it exists
    } else {
      console.log('LFS objects directory not found locally');
    }
    
    return true;
  } catch (error) {
    console.log('Error checking LFS files in local storage:', error.message);
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

// NEW: Check if we're in a proper git repo with LFS
if (!checkGitLfsRepo()) {
  console.log('WARNING: Not in a proper git repository with LFS. This may cause issues.');
}

// NEW: Try to copy LFS files if available locally
copyLfsFilesIfAvailable();

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
  console.log('Sample LFS files:');
  lfsFiles.slice(0, 5).forEach(file => {
    console.log('  ', file.oid, file.filepath);
  });
}

// In Vercel environment, force download all LFS files
if (isVercel && lfsFiles.length > 0) {
  console.log('Forcing download of ALL LFS files in Vercel environment...');
  forceDownloadAllLfsFiles();
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

// Verify and fix LFS files
console.log('Verifying and fixing LFS files...');
const fixResult = verifyAndFixLfsFiles();

// NEW: Final check to ensure all files are actual files, not pointers
console.log('Performing final verification...');
try {
  const fileCheck = execSync('find public/vamshieee -type f -exec head -c 20 {} \\; -exec echo " {}" \\; | grep "version https://git-lfs.github.com" || echo "No LFS pointers found"', { encoding: 'utf8' });
  
  if (fileCheck.includes('No LFS pointers found')) {
    console.log('SUCCESS: No LFS pointer files found. All files appear to be actual media files.');
  } else {
    console.log('WARNING: Some LFS pointer files may still be present:');
    console.log(fileCheck);
  }
} catch (error) {
  console.log('Could not perform final verification:', error.message);
}

console.log('Prebuild script completed');
console.log(`Summary: Found ${fixResult.pointerCount} pointer files, converted ${fixResult.convertedCount}`);