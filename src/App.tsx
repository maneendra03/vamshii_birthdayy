import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import TimelineSection from './components/TimelineSection';
import StaticMemeGallery from './components/StaticMemeGallery';
import StaticQuizSection from './components/StaticQuizSection';
import BroCodeSection from './components/BroCodeSection';
import BirthdayFinale from './components/BirthdayFinale';
import MemoryMapSection from './components/MemoryMapSection';
import GamesSection from './components/GamesSection';
import VideoPlayerSection from './components/VideoPlayerSection';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentSection, setCurrentSection] = useState('timeline');

  const handleEnter = () => {
    setShowLanding(false);
  };

  const handleReplay = () => {
    setShowLanding(true);
    setCurrentSection('timeline');
  };

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  if (showLanding) {
    return <LandingPage onEnter={handleEnter} />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation onNavigate={handleNavigate} currentSection={currentSection} />

      <div className="pt-20">
        {currentSection === 'timeline' && <TimelineSection />}
        {currentSection === 'videos' && <VideoPlayerSection />}
        {currentSection === 'gallery' && <StaticMemeGallery />}
        {currentSection === 'map' && <MemoryMapSection />}
        {currentSection === 'games' && <GamesSection />}
        {currentSection === 'bro-code' && <BroCodeSection />}
        {currentSection === 'finale' && <BirthdayFinale onReplay={handleReplay} />}
      </div>
    </div>
  );
}

export default App;