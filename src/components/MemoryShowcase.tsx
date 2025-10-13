import { useState, useEffect } from 'react';
import { Heart, Star, Calendar, Users } from 'lucide-react';
import { staticMediaItems, StaticMediaItem } from '../lib/staticMedia';

interface MemoryShowcaseProps {
  favorites: Set<string>;
}

export default function MemoryShowcase({ favorites }: MemoryShowcaseProps) {
  const [featuredMemories, setFeaturedMemories] = useState<StaticMediaItem[]>([]);
  
  useEffect(() => {
    // Get favorite memories
    const favoriteMemories = staticMediaItems.filter(item => favorites.has(item.id));
    
    // If we don't have enough favorites, add some random memories
    let memoriesToShow = [...favoriteMemories];
    if (memoriesToShow.length < 5) {
      const additionalMemories = staticMediaItems
        .filter(item => !favorites.has(item.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, 5 - memoriesToShow.length);
      memoriesToShow = [...memoriesToShow, ...additionalMemories];
    }
    
    // Sort by year and order index
    memoriesToShow.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return a.order_index - b.order_index;
    });
    
    setFeaturedMemories(memoriesToShow.slice(0, 5));
  }, [favorites]);

  if (featuredMemories.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-6 h-6 text-yellow-400" />
        <h3 className="text-2xl font-bold text-white">Featured Memories</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {featuredMemories.map((item, index) => (
          <div 
            key={item.id}
            className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              zIndex: 10 - index
            }}
          >
            <img
              src={item.local_path}
              alt={item.caption}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400 text-xs font-medium">{item.year}</span>
              </div>
              <p className="text-white text-xs font-medium line-clamp-2">
                {item.caption}
              </p>
            </div>
            
            <div className="absolute top-2 right-2">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}