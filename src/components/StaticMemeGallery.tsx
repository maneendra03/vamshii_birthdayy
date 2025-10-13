import { useEffect, useState, useMemo } from 'react';
import { ImageIcon, Heart, Download, Calendar, Users, Star, Clock } from 'lucide-react';
import { staticMediaItems, StaticMediaItem } from '../lib/staticMedia';
import MemoryShowcase from './MemoryShowcase';
import MemoryStats from './MemoryStats';

// Function to assign random sizes to images for masonry layout
const getImageSizeClass = (index: number) => {
  const sizes = [
    'row-span-2', // Tall
    'col-span-2', // Wide
    'row-span-1', // Medium
    'col-span-1', // Standard
  ];
  // Create a pattern based on index for consistent sizing
  return sizes[index % sizes.length];
};

// Function to get thematic icons for different years
const getYearIcon = (year: number) => {
  const icons: Record<number, JSX.Element> = {
    2017: <Star className="w-6 h-6 text-yellow-400" />,
    2018: <Users className="w-6 h-6 text-blue-400" />,
    2019: <Clock className="w-6 h-6 text-green-400" />,
    2020: <Star className="w-6 h-6 text-purple-400" />,
    2021: <Users className="w-6 h-6 text-cyan-400" />,
    2022: <Clock className="w-6 h-6 text-pink-400" />,
    2023: <Star className="w-6 h-6 text-orange-400" />,
    2024: <Users className="w-6 h-6 text-teal-400" />,
    2025: <Clock className="w-6 h-6 text-red-400" />,
  };
  return icons[year] || <Calendar className="w-6 h-6 text-gray-400" />;
};

// Function to get year themes
const getYearTheme = (year: number) => {
  const themes: Record<number, { bg: string; text: string; border: string }> = {
    2017: { bg: 'bg-gradient-to-br from-yellow-900/50 to-yellow-800/50', text: 'text-yellow-300', border: 'border-yellow-500/30' },
    2018: { bg: 'bg-gradient-to-br from-blue-900/50 to-blue-800/50', text: 'text-blue-300', border: 'border-blue-500/30' },
    2019: { bg: 'bg-gradient-to-br from-green-900/50 to-green-800/50', text: 'text-green-300', border: 'border-green-500/30' },
    2020: { bg: 'bg-gradient-to-br from-purple-900/50 to-purple-800/50', text: 'text-purple-300', border: 'border-purple-500/30' },
    2021: { bg: 'bg-gradient-to-br from-cyan-900/50 to-cyan-800/50', text: 'text-cyan-300', border: 'border-cyan-500/30' },
    2022: { bg: 'bg-gradient-to-br from-pink-900/50 to-pink-800/50', text: 'text-pink-300', border: 'border-pink-500/30' },
    2023: { bg: 'bg-gradient-to-br from-orange-900/50 to-orange-800/50', text: 'text-orange-300', border: 'border-orange-500/30' },
    2024: { bg: 'bg-gradient-to-br from-teal-900/50 to-teal-800/50', text: 'text-teal-300', border: 'border-teal-500/30' },
    2025: { bg: 'bg-gradient-to-br from-red-900/50 to-red-800/50', text: 'text-red-300', border: 'border-red-500/30' },
  };
  return themes[year] || { bg: 'bg-gradient-to-br from-gray-900/50 to-gray-800/50', text: 'text-gray-300', border: 'border-gray-500/30' };
};

export default function StaticMemeGallery() {
  const [media, setMedia] = useState<StaticMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<StaticMediaItem | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  // Group media by year
  const mediaByYear = useMemo(() => {
    const grouped: Record<number, StaticMediaItem[]> = {};
    staticMediaItems.forEach(item => {
      if (!grouped[item.year]) {
        grouped[item.year] = [];
      }
      grouped[item.year].push(item);
    });
    
    // Sort years in descending order
    return Object.entries(grouped)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .reduce((acc, [year, items]) => {
        acc[parseInt(year)] = items;
        return acc;
      }, {} as Record<number, StaticMediaItem[]>);
  }, []);

  // Filter media based on selected year
  const filteredMedia = useMemo(() => {
    if (selectedYear === 'all') {
      return staticMediaItems;
    }
    return mediaByYear[selectedYear] || [];
  }, [selectedYear, mediaByYear]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Sort media by order_index
      const sortedMedia = [...staticMediaItems].sort((a, b) => a.order_index - b.order_index);
      setMedia(sortedMedia);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading gallery...</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ImageIcon className="w-10 h-10 text-cyan-400 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-black text-white">Certified Bro Moments</h2>
          </div>
          <p className="text-xl text-slate-300">The Hall of Fame (and Shame)</p>
          <p className="text-slate-400 mt-2">{staticMediaItems.length} memories and counting...</p>
        </div>

        {/* Memory statistics */}
        <MemoryStats favorites={favorites} />

        {/* Memory showcase for favorites */}
        {favorites.size > 0 && (
          <MemoryShowcase favorites={favorites} />
        )}

        {/* View mode and year filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 p-3 sm:p-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base transition-all duration-300 ${
                viewMode === 'timeline'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Timeline
            </button>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm transition-all duration-300 ${
                selectedYear === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {Object.keys(mediaByYear).map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(parseInt(year))}
                className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm transition-all duration-300 flex items-center gap-0.5 sm:gap-1 ${
                  selectedYear === parseInt(year)
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {getYearIcon(parseInt(year))}
                <span className="hidden xs:inline">{year}</span>
              </button>
            ))}
          </div>
        </div>

        {filteredMedia.length === 0 ? (
          <div className="text-center py-20 card">
            <p className="text-slate-400 text-lg">
              No media found for the selected year.
            </p>
            <button
              onClick={() => setSelectedYear('all')}
              className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors"
            >
              View All Memories
            </button>
          </div>
        ) : viewMode === 'timeline' ? (
          // Timeline view
          <div className="space-y-16">
            {Object.entries(mediaByYear).map(([year, yearMedia]) => {
              // Skip if we're filtering by year and this isn't the selected year
              if (selectedYear !== 'all' && selectedYear !== parseInt(year)) return null;
              
              const yearTheme = getYearTheme(parseInt(year));
              
              return (
                <div key={year} className="animate-fadeIn">
                  <div className={`flex items-center gap-4 mb-8 p-4 rounded-2xl ${yearTheme.bg} ${yearTheme.border} border`}>
                    <div className="p-3 bg-slate-800/50 rounded-full">
                      {getYearIcon(parseInt(year))}
                    </div>
                    <h3 className={`text-3xl font-bold ${yearTheme.text}`}>
                      {year} Memories
                    </h3>
                    <span className="px-3 py-1 bg-slate-800/50 rounded-full text-slate-300">
                      {yearMedia.length} photos
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {yearMedia.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-slate-700/50 card-hover"
                        onClick={() => setSelectedMedia(item)}
                      >
                        {item.media_type === 'photo' ? (
                          <img
                            src={item.local_path}
                            alt={item.caption || 'Bro moment'}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 min-h-[180px]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="relative bg-slate-700 flex items-center justify-center aspect-video">
                            <div className="text-white text-center p-2">
                              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 animate-pulse">
                                <div className="w-0 h-0 border-l-4 sm:border-l-6 border-l-white border-y-2 sm:border-y-4 border-y-transparent ml-0.5 sm:ml-1"></div>
                              </div>
                              <p className="text-[10px] sm:text-xs">Video: {item.filename}</p>
                            </div>
                          </div>
                        )}

                        <div className="p-4">
                          <p className="text-white font-medium line-clamp-2">
                            {item.caption || 'Another legendary moment'}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-cyan-400 text-sm">{item.year}</p>
                            {favorites.has(item.id) && (
                              <Heart className="w-4 h-4 text-red-500 fill-current" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Masonry grid view
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredMedia.map((item, index) => {
              const sizeClass = getImageSizeClass(index);
              const yearTheme = getYearTheme(item.year);
              
              return (
                <div
                  key={item.id}
                  className={`${sizeClass} group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl border border-slate-700/50 card-hover flex flex-col`}
                  onClick={() => setSelectedMedia(item)}
                  style={{ 
                    gridColumn: sizeClass.includes('col-span-2') ? 'span 2' : 'span 1',
                    gridRow: sizeClass.includes('row-span-2') ? 'span 2' : 'span 1'
                  }}
                >
                  {item.media_type === 'photo' ? (
                    <img
                      src={item.local_path}
                      alt={item.caption || 'Bro moment'}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 min-h-[120px]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative w-full bg-slate-700 flex items-center justify-center aspect-video">
                      <div className="text-white text-center p-2">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 animate-pulse">
                          <div className="w-0 h-0 border-l-4 sm:border-l-6 border-l-white border-y-2 sm:border-y-4 border-y-transparent ml-0.5 sm:ml-1"></div>
                        </div>
                        <p className="text-[10px] sm:text-xs px-1">Video: {item.filename}</p>
                      </div>
                    </div>
                  )}

                  {/* Overlay with caption and actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between">
                    <div className="p-3 flex justify-between">
                      <div className={`px-2 py-1 rounded-full text-xs ${yearTheme.bg} ${yearTheme.text}`}>
                        {item.year}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className={`p-1.5 rounded-full transition-all duration-300 ${
                          favorites.has(item.id)
                            ? 'text-red-500 bg-red-500/20 animate-pulse'
                            : 'text-white bg-white/20 hover:bg-white/30'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-white text-sm font-medium line-clamp-3">
                        {item.caption || 'Another legendary moment'}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // In a real app, this would trigger a download
                            console.log('Download', item.filename);
                          }}
                          className="text-white bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-all duration-300"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Favorite indicator */}
                  {favorites.has(item.id) && (
                    <div className="absolute top-2 left-2 text-red-500 animate-bounce">
                      <Heart className="w-5 h-5 fill-current" />
                    </div>
                  )}
                  
                  {/* Year badge */}
                  <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs ${yearTheme.bg} ${yearTheme.text}`}>
                    {item.year}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Modal for selected media */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-cyan-400 transition-colors z-10"
            >
              ×
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3">
                {selectedMedia.media_type === 'photo' ? (
                  <img
                    src={selectedMedia.local_path}
                    alt={selectedMedia.caption}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
                  />
                ) : (
                  <div className="w-full">
                    <video
                      src={selectedMedia.local_path}
                      controls
                      autoPlay
                      className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
                    />
                  </div>
                )}
              </div>
              
              <div className="md:w-1/3 p-6 border-l border-slate-700/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Memory from {selectedMedia.year}
                    </h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getYearTheme(selectedMedia.year).bg} ${getYearTheme(selectedMedia.year).text}`}>
                      {getYearIcon(selectedMedia.year)}
                      {selectedMedia.year}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedMedia.id)}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      favorites.has(selectedMedia.id)
                        ? 'text-red-500 bg-red-500/20'
                        : 'text-white bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${favorites.has(selectedMedia.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-white text-lg font-medium mb-4">
                    {selectedMedia.caption}
                  </p>
                  
                  <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                    <h4 className="text-cyan-400 font-bold mb-2">Story Behind This Moment</h4>
                    <p className="text-slate-300 text-sm">
                      This memory captures one of those unforgettable moments we shared. 
                      Looking back, it's amazing how these simple moments became the foundation 
                      of our incredible friendship over {new Date().getFullYear() - 2017}+ years.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>File: {selectedMedia.filename}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // In a real app, this would trigger a download
                      console.log('Download', selectedMedia.filename);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  
                  {favorites.has(selectedMedia.id) ? (
                    <button
                      onClick={() => toggleFavorite(selectedMedia.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleFavorite(selectedMedia.id)}
                      className="px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}