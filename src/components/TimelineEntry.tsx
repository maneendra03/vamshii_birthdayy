import { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Image, Video } from 'lucide-react';
import { StaticMediaItem } from '../lib/staticMedia';

interface TimelineEntryProps {
  year: number;
  title: string;
  description: string;
  media: StaticMediaItem[];
  isActive: boolean;
  onYearSelect: () => void;
  position: 'left' | 'right';
}

export default function TimelineEntry({ 
  year, 
  title, 
  description, 
  media, 
  isActive, 
  onYearSelect,
  position
}: TimelineEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedMedia, setExpandedMedia] = useState<string | null>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMediaExpand = (id: string) => {
    setExpandedMedia(expandedMedia === id ? null : id);
  };

  return (
    <div className={`relative flex flex-col md:flex-row items-center mb-12 md:mb-16 ${position === 'right' ? 'md:flex-row-reverse' : ''}`}>
      {/* Year marker */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center z-10 border-2 md:border-4 border-slate-900">
        <span className="text-white font-bold text-xs md:text-sm">{year.toString().slice(-2)}</span>
      </div>
      
      {/* Content - stacked on mobile, side-by-side on desktop */}
      <div className={`w-full md:w-5/12 ${position === 'left' ? 'md:pr-8 md:text-right' : 'md:pl-8'} md:mt-0 mb-6 md:mb-0`}>
        <div 
          className={`card p-4 md:p-6 border-slate-700/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-105 ${
            isActive ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 md:p-2 bg-slate-700 rounded-full text-blue-400">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white">{year}</h3>
          </div>
          
          <h4 className="text-lg md:text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-2 md:mb-3">
            {title}
          </h4>
          
          <p className="text-slate-300 text-sm md:text-base mb-3 md:mb-4">
            {description}
          </p>
          
          <button
            onClick={toggleExpand}
            className="flex items-center gap-1 md:gap-2 text-cyan-400 hover:text-cyan-300 mb-3 md:mb-4 text-sm md:text-base"
          >
            {isExpanded ? (
              <>
                <span>Show Less</span>
                <ChevronUp className="w-3 h-3 md:w-4 md:h-4" />
              </>
            ) : (
              <>
                <span>Show More</span>
                <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
              </>
            )}
          </button>
          
          {isExpanded && (
            <div className="mb-3 md:mb-4 p-3 md:p-4 bg-slate-700/50 rounded-xl border border-slate-600/50 animate-fadeIn">
              <h5 className="font-bold text-white mb-2">Behind the Scenes</h5>
              <p className="text-slate-300 text-xs md:text-sm mb-2 md:mb-3">
                This was one of those moments that defined our friendship. We were {year === 2020 ? 'stuck inside during lockdown' : 'just being our usual chaotic selves'}, 
                but somehow managed to turn it into an unforgettable memory. Looking back, it's amazing how these simple moments 
                became the foundation of our incredible {new Date().getFullYear() - 2017}+ year friendship.
              </p>
              <p className="text-slate-300 text-xs md:text-sm">
                {year === 2020 
                  ? "We survived the impossible together, proving that our friendship could withstand anything."
                  : "Another chapter in our never-ending story of questionable decisions and legendary memories."}
              </p>
            </div>
          )}
          
          <button
            onClick={onYearSelect}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium hover:scale-105 transition-all duration-300 w-full md:w-auto"
          >
            View All Memories
          </button>
        </div>
      </div>
      
      {/* Media preview - full width on mobile, side-by-side on desktop */}
      <div className={`w-full md:w-5/12 ${position === 'left' ? 'md:pl-8' : 'md:pr-8'} mt-0 md:mt-0`}>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          {media.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 border border-slate-700/50"
              onClick={() => toggleMediaExpand(item.id)}
            >
              {item.media_type === 'photo' ? (
                <img
                  src={item.local_path}
                  alt={item.caption || `Memory from ${item.year}`}
                  className="w-full h-24 md:h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="relative h-24 md:h-32 bg-slate-700 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                      <Video className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                    <p className="text-[10px] md:text-xs">Video</p>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1.5 md:p-2">
                <p className="text-white text-[10px] md:text-xs font-medium truncate">
                  {item.caption || 'Memory'}
                </p>
              </div>
              
              {expandedMedia === item.id && (
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-2 animate-fadeIn">
                  <p className="text-white text-[10px] md:text-xs text-center">
                    {item.caption || `A special moment from ${item.year} that we'll never forget.`}
                  </p>
                </div>
              )}
            </div>
          ))}
          
          {media.length > 4 && (
            <div className="flex items-center justify-center bg-slate-800/50 backdrop-blur-sm rounded-lg md:rounded-xl border border-slate-700/50">
              <div className="text-center p-1 md:p-2">
                <div className="text-lg md:text-2xl font-bold text-cyan-400">+{media.length - 4}</div>
                <div className="text-[10px] md:text-xs text-slate-400">More Photos</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}