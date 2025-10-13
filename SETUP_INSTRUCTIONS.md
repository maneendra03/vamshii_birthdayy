# Vamshi Birthday Website - Static Version

## Project Overview

This is a React-based website to celebrate your best friend Vamshi's birthday. It includes:

- Personalized landing page
- Timeline of your friendship
- Photo/video gallery with all your memories (loaded statically from local files)
- Interactive quiz about your friendship
- "Bro Code" rules
- Birthday finale message

## Prerequisites

1. Node.js (version 16 or higher)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173 to see your website.

### 3. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
├── src/                 # Source code
│   ├── components/      # React components
│   ├── lib/             # Utility functions and static data
│   └── App.tsx          # Main app component
├── vamshieee/           # Your media files (97 items)
├── generateStaticMedia.js # Script to generate static media data
└── package.json         # Project dependencies
```

## How It Works

This version of the website uses static data instead of a database:

1. All media files are stored in the `vamshieee` folder
2. The `generateStaticMedia.js` script creates a TypeScript file with metadata for all media files
3. The gallery component loads and displays these files directly from the local filesystem
4. No database or cloud storage is required

## Updating Media

If you add new media files to the `vamshieee` folder:

1. Run the static media generation script:
   ```bash
   node generateStaticMedia.js
   ```

2. Restart the development server:
   ```bash
   npm run dev
   ```