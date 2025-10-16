import { execSync } from 'child_process';

console.log('Starting prebuild script...');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log('Running in Vercel environment:', isVercel);

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
try {
  const lsFilesOutput = execSync('git lfs ls-files', { encoding: 'utf8' });
  console.log('LFS files count:', lsFilesOutput.split('\n').filter(line => line.trim()).length);
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
  }
  
  const pullOutput = execSync('git lfs pull', { 
    encoding: 'utf8',
    env
  });
  console.log('LFS files pulled successfully');
  console.log('Pull output length:', pullOutput.length);
} catch (error) {
  console.log('Could not pull LFS files, continuing with build...');
  console.error(error);
}

// Verify that files exist after pulling
console.log('Verifying file existence...');
try {
  const fileCount = execSync('find public/vamshieee -type f | wc -l', { encoding: 'utf8' });
  console.log('Files in public/vamshieee:', fileCount.trim());
} catch (error) {
  console.log('Could not count files');
  console.error(error);
}

console.log('Prebuild script completed');