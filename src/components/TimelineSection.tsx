import { useEffect, useState, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Star, Users, Heart, Award, Clock, ArrowDown, ArrowUp, GraduationCap } from 'lucide-react';
import { staticMediaItems, StaticMediaItem } from '../lib/staticMedia';
import TimelineEntry from './TimelineEntry';
import TimelineComparison from './TimelineComparison';

interface YearData {
  year: number;
  title: string;
  media: StaticMediaItem[];
  description: string;
  icon: JSX.Element;
  isBVCSection?: boolean;
}

export default function TimelineSection() {
  const [years, setYears] = useState<YearData[]>([]);
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMediaByYear();
    
    // Add keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevYear();
      } else if (e.key === 'ArrowRight') {
        nextYear();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add touch swipe detection for mobile
  useEffect(() => {
    if (!timelineRef.current) return;
    
    let startX = 0;
    let endX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    };
    
    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = startX - endX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next year
          nextYear();
        } else {
          // Swipe right - previous year
          prevYear();
        }
      }
    };
    
    const timelineElement = timelineRef.current;
    timelineElement.addEventListener('touchstart', handleTouchStart);
    timelineElement.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      timelineElement.removeEventListener('touchstart', handleTouchStart);
      timelineElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentYearIndex, years.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const scrollTop = timelineRef.current.scrollTop;
        const scrollHeight = timelineRef.current.scrollHeight - timelineRef.current.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        setScrollProgress(Math.min(Math.max(progress, 0), 100));
      }
    };
    
    const timelineElement = timelineRef.current;
    if (timelineElement) {
      timelineElement.addEventListener('scroll', handleScroll);
      return () => timelineElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const loadMediaByYear = () => {
    const yearTitles: Record<number, string> = {
      2017: 'The Dumb Duo Assembles',
      2018: 'Learning to be Idiots Together',
      2019: 'Peak Chaos Era',
      2020: 'Survived the Impossible',
      2021: 'Still Going Strong',
      2022: 'New Level of Madness',
      2023: 'Eight Years and Counting',
      2024: 'The Legend Continues',
      2025: 'Current Status: Still Dumb',
      2026: 'BVC Memories'
    };
    
    const yearDescriptions: Record<number, string> = {
      2017: 'The beginning of our epic friendship. We met and immediately knew we were going to cause chaos together.',
      2018: 'Our bond strengthened as we navigated through life\'s challenges, making questionable decisions every step of the way.',
      2019: 'The year we truly embraced our inner chaos. Nothing could stop us from making bad choices together.',
      2020: 'The ultimate test of our friendship. We survived lockdowns, uncertainty, and each other\'s questionable life choices.',
      2021: 'We emerged stronger than ever, ready to take on the world (or at least make each other laugh).',
      2022: 'New adventures, same old chaos. Our friendship continued to flourish despite our best efforts to ruin it.',
      2023: 'Eight years down, infinity to go. We celebrated our enduring friendship with more questionable decisions.',
      2024: 'The legend continues as we find new ways to embarrass ourselves and each other.',
      2025: 'Still causing chaos and making memories. Some things never change, and we wouldn\'t have it any other way.',
      2026: 'Special memories from our BVC days'
    };
    
    const yearIcons: Record<number, JSX.Element> = {
      2017: <Users className="w-6 h-6" />,
      2018: <Heart className="w-6 h-6" />,
      2019: <Award className="w-6 h-6" />,
      2020: <Star className="w-6 h-6" />,
      2021: <Clock className="w-6 h-6" />,
      2022: <Users className="w-6 h-6" />,
      2023: <Heart className="w-6 h-6" />,
      2024: <Award className="w-6 h-6" />,
      2025: <Star className="w-6 h-6" />,
      2026: <GraduationCap className="w-6 h-6" />
    };

    // Group media items by year
    const groupedByYear: Record<number, StaticMediaItem[]> = {};
    const bvcMedia: StaticMediaItem[] = [];
    
    staticMediaItems.forEach(item => {
      // Check if this is a BVC memory (based on filename)
      if (item.filename.includes('WhatsApp Image 1947-07-21')) {
        bvcMedia.push(item);
      } else {
        if (!groupedByYear[item.year]) {
          groupedByYear[item.year] = [];
        }
        groupedByYear[item.year].push(item);
      }
    });

    // Sort media within each year by order_index
    Object.values(groupedByYear).forEach(mediaList => {
      mediaList.sort((a, b) => a.order_index - b.order_index);
    });
    
    // Sort BVC media by order_index
    bvcMedia.sort((a, b) => a.order_index - b.order_index);

    // Create years data array
    const yearsData: YearData[] = Object.entries(groupedByYear)
      .map(([year, media]) => ({
        year: parseInt(year),
        title: yearTitles[parseInt(year)] || `Year ${year}`,
        media,
        description: yearDescriptions[parseInt(year)] || `Memories from ${year}`,
        icon: yearIcons[parseInt(year)] || <Calendar className="w-6 h-6" />
      }))
      .sort((a, b) => a.year - b.year); // Sort years chronologically

    // Add BVC section after all regular years
    if (bvcMedia.length > 0) {
      yearsData.push({
        year : 2022,
        title: 'BVC Memories',
        media: bvcMedia,
        description: 'Special memories from our BVC days',
        icon: <GraduationCap className="w-6 h-6" />,
        isBVCSection: true
      });
    }

    setYears(yearsData);
    setLoading(false);
  };

  const nextYear = () => {
    setCurrentYearIndex((prev) => (prev + 1) % years.length);
  };

  const prevYear = () => {
    setCurrentYearIndex((prev) => (prev - 1 + years.length) % years.length);
  };

  const scrollToTop = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollTo({ 
        top: timelineRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading memories...</div>
      </div>
    );
  }

  const currentYear = years[currentYearIndex];

  return (
    <section 
      ref={timelineRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20 px-4 sm:px-6 overflow-y-auto"
      style={{ height: 'calc(100vh - 80px)', maxHeight: 'calc(100vh - 80px)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12 animate-fadeIn">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Calendar className="w-8 h-8 md:w-10 md:h-10 text-blue-400 animate-bounce" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">Timeline of Chaos</h2>
          </div>
          <p className="text-base md:text-xl text-slate-300">2017 → 2025: Every Chapter of Our Nonsense</p>
        </div>

        {/* Progress indicator - hidden on mobile */}
        <div className="fixed top-20 md:top-24 right-4 md:right-6 z-30 hidden md:block">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-full p-1.5 md:p-2 border border-slate-700/50">
            <div className="w-24 h-24 md:w-32 md:h-32 relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * scrollProgress) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dy="0.3em"
                  className="text-white font-bold"
                  fontSize="10"
                >
                  {Math.round(scrollProgress)}%
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Scroll navigation buttons - stacked vertically on mobile */}
        <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-30 flex md:flex-col gap-2">
          <button
            onClick={scrollToTop}
            className="p-2 md:p-3 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700/50 text-white hover:bg-slate-700 transition-all duration-300 shadow-lg"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={scrollToBottom}
            className="p-2 md:p-3 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700/50 text-white hover:bg-slate-700 transition-all duration-300 shadow-lg"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {years.length === 0 ? (
          <div className="text-center py-16 md:py-20 card">
            <p className="text-slate-400 text-base md:text-lg">
              No memories found. Add media to the vamshieee folder and regenerate static data.
            </p>
            <p className="text-slate-500 mt-3 md:mt-4 text-xs md:text-sm">
              Tip: Run 'node generateStaticMedia.js' to update the timeline with your media
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 md:w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
              
              {/* Timeline items */}
              <div className="space-y-0">
                {years.map((yearData, index) => (
                  <div key={yearData.year}>
                    <TimelineEntry
                      year={yearData.year}
                      title={yearData.title}
                      description={yearData.description}
                      media={yearData.media}
                      isActive={index === currentYearIndex}
                      onYearSelect={() => setCurrentYearIndex(index)}
                      position={index % 2 === 0 ? 'left' : 'right'}
                    />
                    
                    {/* Removed Then vs Now comparisons */}
                  </div>
                ))}
              </div>
            </div>

            {/* Year navigation */}
            <div className="flex items-center justify-between mt-10 md:mt-16 mb-6 md:mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-slate-700/50 sticky top-16 md:top-20 z-20">
              <button
                onClick={prevYear}
                className="p-2 md:p-4 bg-slate-800 hover:bg-slate-700 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                aria-label="Previous year"
              >
                <ChevronLeft className="w-5 h-5 md:w-8 md:h-8 text-white" />
              </button>

              <div className="text-center px-2 md:px-4">
                <h3 className="text-2xl md:text-5xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text mb-1 md:mb-2">
                  {currentYear?.year}
                </h3>
                <p className="text-base md:text-2xl text-white font-bold">{currentYear?.title}</p>
                <div className="flex justify-center mt-1 md:mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2 h-2 md:w-5 md:h-5 text-yellow-400 mx-0.5 md:mx-1 animate-pulse" />
                  ))}
                </div>
              </div>

              <button
                onClick={nextYear}
                className="p-2 md:p-4 bg-slate-800 hover:bg-slate-700 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
                aria-label="Next year"
              >
                <ChevronRight className="w-5 h-5 md:w-8 md:h-8 text-white" />
              </button>
            </div>

            {/* Media grid for current year */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
              {currentYear?.media.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 border border-slate-700/50 card-hover animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.media_type === 'photo' ? (
                    <img
                      src={item.local_path}
                      alt={item.caption || `Memory from ${item.year}`}
                      className="w-full h-40 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative h-40 md:h-80 bg-slate-700 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-10 h-10 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 animate-pulse">
                          <div className="w-0 h-0 border-l-5 md:border-l-8 border-l-white border-y-2.5 md:border-y-4 border-y-transparent ml-0.5 md:ml-1"></div>
                        </div>
                        <p className="text-xs md:text-sm">Video: {item.filename}</p>
                      </div>
                    </div>
                  )}

                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm md:text-lg font-medium">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Year indicators */}
            <div className="flex justify-center gap-1 md:gap-2 flex-wrap mb-8 md:mb-12">
              {years.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentYearIndex(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                    index === currentYearIndex
                      ? 'bg-blue-400 w-5 md:w-8 animate-pulse-glow'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to year ${years[index].year}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}