import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please set all required environment variables.');
  console.log('Required variables:');
  console.log('  VITE_SUPABASE_URL');
  console.log('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use service key for both database and storage operations (full admin access)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to determine if file is photo or video based on extension
function getMediaType(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
    return 'photo';
  } else if (['.mp4', '.mov', '.avi', '.webm'].includes(ext)) {
    return 'video';
  }
  return null; // Unknown media type
}

// Function to extract year from filename
function extractYear(filename) {
  // Try to find a 4-digit year in the filename
  const yearMatch = filename.match(/20\d{2}/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0]);
    if (year >= 2017 && year <= 2025) {
      return year;
    }
  }
  
  // Default to current year if no year found
  return new Date().getFullYear();
}

// Function to generate a funny caption based on filename
function generateCaption(filename) {
  const captions = [
    "Another legendary moment",
    "Priceless memories",
    "Bro code in action",
    "Pure chaos",
    "When life gives you lemons",
    "Epic fail or win?",
    "No comment needed",
    "Classic Vamshi moment",
    "Wish you were here",
    "Too good not to share"
  ];
  
  // Simple hash function to pick a consistent caption for each file
  let hash = 0;
  for (let i = 0; i < filename.length; i++) {
    hash = filename.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return captions[Math.abs(hash) % captions.length];
}

// Function to check if a file is already in the database
async function isFileInDatabase(filename) {
  const { data, error } = await supabase
    .from('media_items')
    .select('id')
    .eq('filename', filename)
    .limit(1);
    
  if (error) {
    console.error(`  Error checking database for ${filename}:`, error.message);
    return false;
  }
  
  return data && data.length > 0;
}

// Function to get list of files that need to be uploaded
async function getPendingFiles() {
  // Get all files from database
  const { data: dbFiles, error: dbError } = await supabase
    .from('media_items')
    .select('filename');
  
  if (dbError) {
    console.error('Error fetching database files:', dbError.message);
    return [];
  }
  
  const dbFileNames = new Set(dbFiles.map(file => file.filename));
  
  // Get all local files
  const allFiles = fs.readdirSync('./vamshieee');
  
  // Filter out files that are already in database
  const pendingFiles = allFiles.filter(file => !dbFileNames.has(file));
  
  return pendingFiles;
}

async function uploadPendingFiles() {
  try {
    console.log('🔄 Uploading pending files...\n');
    
    // Get list of pending files
    const pendingFiles = await getPendingFiles();
    
    if (pendingFiles.length === 0) {
      console.log('🎉 No pending files to upload!');
      
      // Show final count
      const { count, error: countError } = await supabase
        .from('media_items')
        .select('*', { count: 'exact', head: true });
      
      if (!countError) {
        console.log(`📊 Total media items in database: ${count}`);
      }
      
      return;
    }
    
    console.log(`Found ${pendingFiles.length} files to upload`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Separate photos and videos
    const photoFiles = pendingFiles.filter(file => getMediaType(file) === 'photo');
    const videoFiles = pendingFiles.filter(file => getMediaType(file) === 'video');
    
    console.log(`  📷 Photos: ${photoFiles.length}`);
    console.log(`  🎥 Videos: ${videoFiles.length}`);
    
    // Process photo files first
    for (const [index, file] of photoFiles.entries()) {
      try {
        const filePath = path.join('./vamshieee', file);
        const stats = fs.statSync(filePath);
        
        // Extract metadata
        const year = extractYear(file);
        const caption = generateCaption(file);
        const contentType = getContentType(file);
        
        console.log(`\nProcessing photo (${index + 1}/${photoFiles.length}): ${file} (${year})`);
        
        // Upload file to Supabase storage with retry logic
        const { data: uploadData, error: uploadError } = await uploadFileWithRetry(supabase, filePath, file, contentType);
        
        if (uploadError) {
          console.error(`Upload failed for ${file}:`, uploadError.message);
          errorCount++;
          continue;
        }
        
        // Check if metadata already exists
        const inDatabase = await isFileInDatabase(file);
        if (inDatabase) {
          console.log(`  File metadata already exists in database, skipping...`);
          successCount++;
          continue;
        }
        
        // Insert metadata into media_items table
        const { data: insertData, error: insertError } = await supabase
          .from('media_items')
          .insert({
            filename: file,
            storage_path: file,
            media_type: 'photo',
            year: year,
            caption: caption,
            order_index: Date.now()
          })
          .select();
        
        if (insertError) {
          console.error(`Metadata insert failed for ${file}:`, insertError.message);
          errorCount++;
          continue;
        }
        
        console.log(`✅ Successfully uploaded: ${file}`);
        successCount++;
        
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
        errorCount++;
      }
    }
    
    // Process video files
    console.log(`\n🎬 Uploading ${videoFiles.length} video files...`);
    
    for (const [index, file] of videoFiles.entries()) {
      try {
        const filePath = path.join('./vamshieee', file);
        const stats = fs.statSync(filePath);
        
        // Extract metadata
        const year = extractYear(file);
        const caption = generateCaption(file);
        const contentType = getContentType(file);
        
        console.log(`\nProcessing video (${index + 1}/${videoFiles.length}): ${file} (${year})`);
        console.log(`  File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
        
        // For large videos, we'll try a different approach
        if (stats.size > 50 * 1024 * 1024) { // 50MB
          console.log(`  ⚠️  Large file detected, this might take a while...`);
        }
        
        // Upload file to Supabase storage with retry logic
        const { data: uploadData, error: uploadError } = await uploadFileWithRetry(supabase, filePath, file, contentType);
        
        if (uploadError) {
          console.error(`Upload failed for ${file}:`, uploadError.message);
          errorCount++;
          continue;
        }
        
        // Check if metadata already exists
        const inDatabase = await isFileInDatabase(file);
        if (inDatabase) {
          console.log(`  File metadata already exists in database, skipping...`);
          successCount++;
          continue;
        }
        
        // Insert metadata into media_items table
        const { data: insertData, error: insertError } = await supabase
          .from('media_items')
          .insert({
            filename: file,
            storage_path: file,
            media_type: 'video',
            year: year,
            caption: caption,
            order_index: Date.now()
          })
          .select();
        
        if (insertError) {
          console.error(`Metadata insert failed for ${file}:`, insertError.message);
          errorCount++;
          continue;
        }
        
        console.log(`✅ Successfully uploaded: ${file}`);
        successCount++;
        
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\nUpload complete! Success: ${successCount}, Errors: ${errorCount}`);
    
    // Final verification
    console.log('\n🔍 Final verification...');
    const { count, error: countError } = await supabase
      .from('media_items')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`📊 Total media items in database: ${count}`);
      
      if (count === 97) {
        console.log('\n🎉 All 97 files have been successfully uploaded!');
        console.log('You can now run `npm run dev` to see your website with all media.');
      } else {
        console.log(`\n⚠️  Expected 97 files, but found ${count} in database.`);
        console.log('Some files may still need to be uploaded.');
      }
    }
    
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

// Function to determine content type based on file extension
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.webm': 'video/webm'
  };
  
  return contentTypes[ext] || 'application/octet-stream';
}

// Function to upload a file with retry logic
async function uploadFileWithRetry(supabase, filePath, filename, contentType, maxRetries = 3) {
  const fileBuffer = fs.readFileSync(filePath);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`  Upload attempt ${attempt}/${maxRetries}`);
      
      const { data, error } = await supabase.storage
        .from('brostory-media')
        .upload(filename, fileBuffer, {
          cacheControl: '3600',
          upsert: true,
          contentType: contentType
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { data, error: null };
    } catch (error) {
      console.log(`  Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      } else {
        return { data: null, error };
      }
    }
  }
}

// Run the upload function
uploadPendingFiles();