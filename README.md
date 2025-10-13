# Vamshi Birthday Website - Static Version

A special website dedicated to celebrating my best friend Vamshi's birthday with memories, photos, and fun interactions.

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── BirthdayFinale.tsx       # Final birthday message and replay option
│   │   ├── BroCodeSection.tsx       # The "Bro Code" rules section
│   │   ├── LandingPage.tsx          # Initial landing page with enter button
│   │   ├── StaticMemeGallery.tsx    # Gallery displaying photos and videos (static version)
│   │   ├── Navigation.tsx           # Navigation bar for switching sections
│   │   ├── StaticQuizSection.tsx    # Interactive quiz about your friendship (static version)
│   │   └── TimelineSection.tsx      # Timeline of memorable moments
│   ├── lib/
│   │   └── staticMedia.ts           # Static media data and quiz questions
│   ├── App.tsx                      # Main app component and routing
│   ├── index.css                    # Global styles
│   ├── main.tsx                     # Entry point
│   └── vite-env.d.ts                # TypeScript declarations
├── vamshieee/                       # Your media files (97 items)
│   ├── Photos (79 items)            # .jpg, .jpeg, .png files
│   ├── Videos (18 items)            # .mp4, .webm files
│   └── Other media                  # .webp and other formats
├── generateStaticMedia.js           # Script to generate static media data
├── index.html                       # HTML entry point
├── package.json                     # Project dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── vite.config.ts                   # Vite configuration
```

## Features

- **Personalized Landing Page**: A welcoming entrance with a special message
- **Timeline of Memories**: A chronological journey through your friendship
- **Media Gallery**: Display all photos and videos from the vamshieee folder
- **Interactive Quiz**: Test knowledge about your friendship
- **Bro Code Rules**: The sacred rules of your friendship
- **Birthday Finale**: A special birthday message and replay option

## How It Works

This website uses a static approach instead of a database:

1. All media files are stored in the `vamshieee` folder
2. The `generateStaticMedia.js` script creates a TypeScript file with metadata for all media files
3. The gallery component loads and displays these files directly from the local filesystem
4. No database or cloud storage is required

## Setup Instructions

### Prerequisites

1. Node.js (version 16 or higher)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

```bash
npm run dev
```

Visit http://localhost:5173 to see your website.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

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

## Customization

You can customize various aspects of the website:

- **Media**: Add your own photos and videos to the `vamshieee` folder
- **Quiz Questions**: Modify the quiz questions in `src/lib/staticMedia.ts`
- **Styling**: Adjust the Tailwind CSS classes or add custom styles in `src/index.css`
- **Content**: Update text and messages in the various component files

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling