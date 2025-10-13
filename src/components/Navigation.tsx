import { Calendar, ImageIcon, Brain, ArrowLeftRight, Shield, Cake, Play, MapPin, Gamepad2 } from 'lucide-react';

interface NavigationProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export default function Navigation({ onNavigate, currentSection }: NavigationProps) {
  const sections = [
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'bro-code', label: 'Bro Code', icon: Shield },
    { id: 'finale', label: 'Birthday', icon: Cake }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center animate-pulse-glow">
              <span className="text-white font-black text-lg">BS</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline animate-rainbow">BroStory</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700/50">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => onNavigate(section.id)}
                  className={`flex items-center gap-2 px-2 py-2 sm:px-3 rounded-full transition-all duration-300 ${
                    currentSection === section.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  title={section.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium hidden lg:inline">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}