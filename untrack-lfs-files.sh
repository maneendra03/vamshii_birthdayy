#!/bin/bash

# Script to untrack small/medium files from LFS and track them normally with Git
echo "=== Untracking small/medium files from LFS ==="

# Store current directory
CURRENT_DIR=$(pwd)
echo "Working in: $CURRENT_DIR"

# List of files that should NOT be tracked with LFS (small and medium files)
# Only the largest file (> 50MB) should remain tracked with LFS
FILES_TO_UNTRACK=(
  "public/vamshieee/VIDEO-2025-10-13-16-42-28.mp4"
)

echo "Files that will remain tracked with LFS:"
for file in "${FILES_TO_UNTRACK[@]}"; do
  echo "  $file"
done

echo ""
echo "Untracking all other files from LFS..."

# Untrack all files from LFS
git lfs untrack "*.jpg"
git lfs untrack "*.jpeg" 
git lfs untrack "*.png"
git lfs untrack "*.webp"
git lfs untrack "*.mp4"

# Specifically untrack the files we identified as not needing LFS
echo "Untracking specific files from LFS..."
git lfs untrack "public/vamshieee/20201231054713_IMG_2725-01.jpeg"
git lfs untrack "public/vamshieee/20210810_093418.mp4"
git lfs untrack "public/vamshieee/20231021_142621.mp4"
git lfs untrack "public/vamshieee/IMG-20201110-WA0000.jpg"
git lfs untrack "public/vamshieee/IMG-20201110-WA0009.jpg"
git lfs untrack "public/vamshieee/IMG-20201110-WA0011.jpg"
git lfs untrack "public/vamshieee/IMG-20210920-WA0023.jpg"
git lfs untrack "public/vamshieee/IMG20201111132919.jpg"
git lfs untrack "public/vamshieee/IMG20201111133842.jpg"
git lfs untrack "public/vamshieee/IMG20201111134018.jpg"
git lfs untrack "public/vamshieee/IMG20201111134634.jpg"
git lfs untrack "public/vamshieee/IMG20201111134758.jpg"
git lfs untrack "public/vamshieee/IMG20201112210043.jpg"
git lfs untrack "public/vamshieee/IMG20201215132212.jpg"
git lfs untrack "public/vamshieee/IMG20201216160917.jpg"
git lfs untrack "public/vamshieee/IMG20201216164056.jpg"
git lfs untrack "public/vamshieee/IMG20201224204056.jpg"
git lfs untrack "public/vamshieee/IMG20201224205932.jpg"
git lfs untrack "public/vamshieee/IMG20201224210013.jpg"
git lfs untrack "public/vamshieee/IMG20210205112206.jpg"

echo "Adding files back to regular Git tracking..."
# Add all files back to Git (this will commit the actual files, not pointers)
git add public/vamshieee/

echo "=== LFS untracking completed ==="
echo "Next steps:"
echo "1. Commit the changes: git commit -m 'Untrack small files from LFS for Vercel compatibility'"
echo "2. Push to GitHub: git push origin main"
echo "3. Deploy to Vercel"