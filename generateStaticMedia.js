import fs from 'fs';
import path from 'path';

// Directory containing your media
const mediaDir = './vamshieee';

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

function generateStaticMedia() {
  try {
    // Read all files from the media directory
    const files = fs.readdirSync(mediaDir);
    
    console.log(`Found ${files.length} files to process`);
    
    // Generate static media items
    const staticMediaItems = files.map((file, index) => {
      const mediaType = getMediaType(file);
      if (!mediaType) {
        console.log(`Skipping ${file} - unknown media type`);
        return null;
      }
      
      // Skip directories
      const filePath = path.join(mediaDir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        console.log(`Skipping directory: ${file}`);
        return null;
      }
      
      // Extract metadata
      const year = extractYear(file);
      const caption = generateCaption(file);
      
      return {
        id: `${index + 1}`,
        filename: file,
        media_type: mediaType,
        year: year,
        caption: caption,
        order_index: index + 1,
        local_path: `/vamshieee/${file}`,
        // Initialize face tags as empty array
        face_tags: []
      };
    }).filter(item => item !== null); // Remove null items
    
    // Generate TypeScript file content
    const tsContent = `// Auto-generated static media data
// Generated on ${new Date().toISOString()}

export interface StaticMediaItem {
  id: string;
  filename: string;
  media_type: 'photo' | 'video';
  year: number;
  caption: string;
  order_index: number;
  local_path: string;
  // Add face tags for recurring individuals
  face_tags?: string[];
}

export const staticMediaItems: StaticMediaItem[] = ${JSON.stringify(staticMediaItems, null, 2)};

export interface StaticQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  order_index: number;
}

export const staticQuizQuestions: StaticQuizQuestion[] = [
  {
    id: '1',
    question: "What is Vamshi's most used excuse?",
    options: ["I forgot", "Trust me bro", "One last time", "Technical issues"],
    correct_answer: 1,
    order_index: 1
  },
  {
    id: '2',
    question: "How many times has he said 'one last game'?",
    options: ["Never", "Once a week", "Infinite times", "Only on weekends"],
    correct_answer: 2,
    order_index: 2
  },
  {
    id: '3',
    question: "What is Vamshi's superpower?",
    options: ["Being on time", "Perfect memory", "Turning 5 minutes into 5 hours", "Cooking skills"],
    correct_answer: 2,
    order_index: 3
  },
  {
    id: '4',
    question: "Vamshi's favorite activity?",
    options: ["Studying", "Going to gym", "Gaming till sunrise", "Morning jogs"],
    correct_answer: 2,
    order_index: 4
  },
  {
    id: '5',
    question: "How many times have you both almost got in trouble?",
    options: ["Never", "Once or twice", "Too many to count", "We always get caught"],
    correct_answer: 2,
    order_index: 5
  },
  {
    id: '6',
    question: "Vamshi's go-to food order?",
    options: ["Salad", "Whatever is cheapest", "Always the same thing", "Random experiments"],
    correct_answer: 2,
    order_index: 6
  },
  {
    id: '7',
    question: "When does Vamshi reply to messages?",
    options: ["Immediately", "Within an hour", "3-5 business days", "Only when reminded"],
    correct_answer: 2,
    order_index: 7
  },
  {
    id: '8',
    question: "Vamshi's morning routine?",
    options: ["5 AM workout", "Snooze alarm 10 times", "Meditation", "Healthy breakfast"],
    correct_answer: 1,
    order_index: 8
  },
  {
    id: '9',
    question: "Best way to annoy Vamshi?",
    options: ["Steal his food", "Beat him in games", "Wake him up early", "All of the above"],
    correct_answer: 3,
    order_index: 9
  },
  {
    id: '10',
    question: "Your friendship in one word?",
    options: ["Normal", "Boring", "Legendary Chaos", "Suspicious"],
    correct_answer: 2,
    order_index: 10
  }
];
`;
    
    // Write to file
    fs.writeFileSync('./src/lib/staticMedia.ts', tsContent);
    console.log('✅ Static media data generated successfully!');
    console.log(`📝 Wrote data for ${staticMediaItems.length} media items to src/lib/staticMedia.ts`);
    
  } catch (error) {
    console.error('❌ Error generating static media data:', error.message);
    process.exit(1);
  }
}

// Run the generation function
generateStaticMedia();