import { execSync } from 'child_process';

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
try {
  const lsFilesOutput = execSync('git lfs ls-files', { encoding: 'utf8' });
  const fileCount = lsFilesOutput.split('\n').filter(line => line.trim()).length;
  console.log('LFS files count:', fileCount);
  
  // Show first few LFS files for verification
  const firstFiles = lsFilesOutput.split('\n').filter(line => line.trim()).slice(0, 3);
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
  
  // Check if specific files exist
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
      const head = execSync(`head -c 20 ${file}`, { encoding: 'utf8' });
      if (head.includes('version https://git-lfs.github.com')) {
        console.log('  WARNING: This is an LFS pointer file, not the actual file!');
      } else {
        console.log('  This appears to be the actual file');
      }
    } catch (err) {
      console.log(`File does not exist: ${file}`);
    }
  });
} catch (error) {
  console.log('Could not count files');
  console.error(error);
}

console.log('Prebuild script completed');