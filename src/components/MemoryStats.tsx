import { useMemo } from 'react';
import { Calendar, Image, Video, Heart, Star } from 'lucide-react';
import { staticMediaItems } from '../lib/staticMedia';

interface MemoryStatsProps {
  favorites: Set<string>;
}

export default function MemoryStats({ favorites }: MemoryStatsProps) {
  const stats = useMemo(() => {
    const totalPhotos = staticMediaItems.filter(item => item.media_type === 'photo').length;
    const totalVideos = staticMediaItems.filter(item => item.media_type === 'video').length;
    
    // Group by year
    const years: Record<number, number> = {};
    staticMediaItems.forEach(item => {
      years[item.year] = (years[item.year] || 0) + 1;
    });
    
    const yearCount = Object.keys(years).length;
    const maxYear = Math.max(...Object.keys(years).map(Number));
    const minYear = Math.min(...Object.keys(years).map(Number));
    
    return {
      totalPhotos,
      totalVideos,
      totalMemories: staticMediaItems.length,
      yearCount,
      maxYear,
      minYear,
      favoriteCount: favorites.size
    };
  }, [favorites]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <Image className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">{stats.totalPhotos}</span>
        </div>
        <p className="text-slate-400 text-sm">Photos</p>
      </div>
      
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <Video className="w-8 h-8 text-cyan-400" />
          <span className="text-2xl font-bold text-white">{stats.totalVideos}</span>
        </div>
        <p className="text-slate-400 text-sm">Videos</p>
      </div>
      
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">{stats.yearCount}</span>
        </div>
        <p className="text-slate-400 text-sm">Years</p>
      </div>
      
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-red-400" />
          <span className="text-2xl font-bold text-white">{stats.favoriteCount}</span>
        </div>
        <p className="text-slate-400 text-sm">Favorites</p>
      </div>
    </div>
  );
}