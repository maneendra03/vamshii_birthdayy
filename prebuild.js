import { execSync } from 'child_process';

console.log('Checking if Git LFS is installed...');
try {
  execSync('git lfs --version', { stdio: 'inherit' });
  console.log('Git LFS is installed');
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

console.log('Pulling LFS files...');
try {
  execSync('git lfs pull', { stdio: 'inherit' });
  console.log('LFS files pulled successfully');
} catch (error) {
  console.log('Could not pull LFS files, continuing with build...');
}

console.log('Prebuild script completed');