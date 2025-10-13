import { useEffect, useState } from 'react';
import { Cake, PartyPopper, Beer, RotateCcw, Sparkles, Camera } from 'lucide-react';
import { staticMediaItems, StaticMediaItem } from '../lib/staticMedia';

interface BirthdayFinaleProps {
  onReplay: () => void;
}

export default function BirthdayFinale({ onReplay }: BirthdayFinaleProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [birthdayPhotos, setBirthdayPhotos] = useState<StaticMediaItem[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<StaticMediaItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);

    // Filter photos for birthday/celebration moments
    let birthdayMedia = staticMediaItems.filter(item => 
      item.year >= 2023 && item.media_type === 'photo' && 
      (item.caption.toLowerCase().includes('chaos') || 
       item.caption.toLowerCase().includes('legendary') || 
       item.caption.toLowerCase().includes('pure') ||
       item.caption.toLowerCase().includes('epic'))
    ).slice(0, 4); // Take only 4 photos initially

    // Add the two WhatsApp BVC photos
    const bvcPhotos = staticMediaItems.filter(item => 
      item.filename.includes('WhatsApp Image 1947-07-21')
    ).slice(0, 2); // Take the first two BVC photos

    // Combine the photos: first 2 from birthdayMedia, then 2 BVC photos, then remaining 2 from birthdayMedia
    if (birthdayMedia.length >= 4 && bvcPhotos.length >= 2) {
      const combinedPhotos = [
        birthdayMedia[0],     // 1st photo
        birthdayMedia[1],     // 2nd photo
        bvcPhotos[0],         // 3rd photo (BVC)
        birthdayMedia[2],     // 4th photo
        birthdayMedia[3],     // 5th photo
        bvcPhotos[1]          // 6th photo (BVC)
      ];
      setBirthdayPhotos(combinedPhotos);
    } else {
      // Fallback to original selection if not enough photos
      setBirthdayPhotos(birthdayMedia.slice(0, 6));
    }

    return () => clearTimeout(timer);
  }, []);

  const handleBeerClick = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
      {showConfetti && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="confetti absolute w-3 h-3 rounded-full animate-confetti-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  backgroundColor: ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'][
                    Math.floor(Math.random() * 5)
                  ],
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              />
            ))}
          </div>

          <div className="firework absolute top-20 left-20"></div>
          <div className="firework absolute top-32 right-32"></div>
          <div className="firework absolute bottom-40 left-40"></div>
          <div className="firework absolute bottom-20 right-20"></div>
        </>
      )}

      <div className="relative z-10 text-center max-w-4xl animate-bounce-in">
        <div className="mb-8 sm:mb-12 inline-block">
          <div className="relative">
            <Cake className="w-16 sm:w-24 h-16 sm:h-24 text-pink-400 animate-bounce" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
          <span className="block">Happy Birthday</span>
          <span className="block animate-rainbow mt-2">
            Vamshi!
          </span>
        </h1>

        <div className="mb-8 sm:mb-12 space-y-2 sm:space-y-4">
          <p className="text-xl sm:text-2xl md:text-3xl text-white font-bold">
            8 Years of Chaos
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl text-white font-bold">
            Countless Memories
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl text-white font-bold">
            Infinite Brotherhood
          </p>
        </div>

        <div className="card p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 border-purple-500/30">
          <PartyPopper className="w-12 sm:w-16 h-12 sm:h-16 text-yellow-400 mx-auto mb-4 sm:mb-6 animate-spin" style={{ animationDuration: '3s' }} />
          <p className="text-base sm:text-xl md:text-2xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
            From school days to now, we've survived everything together—bad decisions, worse haircuts,
            and countless "what were we thinking?" moments. Here's to many more years of legendary chaos!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <button
            onClick={onReplay}
            className="btn-primary px-6 sm:px-10 py-3 sm:py-5 text-base sm:text-xl gap-2 sm:gap-3"
          >
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-180 transition-transform duration-500" />
            <span>Replay the Madness</span>
          </button>

          <button
            onClick={handleBeerClick}
            className={`btn-secondary px-6 sm:px-10 py-3 sm:py-5 text-base sm:text-xl gap-2 sm:gap-3 ${
              isPlaying ? 'animate-bounce' : ''
            }`}
          >
            <Beer className={`w-5 h-5 sm:w-6 sm:h-6 ${isPlaying ? 'animate-spin' : ''}`} />
            <span>Send Virtual Beer</span>
          </button>
        </div>

        {isPlaying && (
          <div className="mt-6 sm:mt-8 text-3xl sm:text-4xl animate-fadeIn">🍺🎉🥳🎊✨</div>
        )}

        {/* Birthday Photo Gallery */}
        {birthdayPhotos.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
              <Camera className="w-6 h-6 text-cyan-400" />
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Birthday Moments</h3>
              <Camera className="w-6 h-6 text-cyan-400" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {birthdayPhotos.map((photo) => (
                <div 
                  key={photo.id}
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-slate-700/50 card-hover"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.local_path}
                    alt={photo.caption}
                    className="w-full h-40 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 sm:mt-16 inline-block">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-2xl">
            <div className="bg-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl">
              <p className="text-white text-base sm:text-lg">
                Made with <span className="text-red-400 animate-pulse">❤️</span> and{' '}
                <span className="text-yellow-400">way too many memories</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .firework {
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: firework-animation 2s ease-out infinite;
        }

        @keyframes firework-animation {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx, 0), var(--ty, 0));
            opacity: 0;
          }
        }

        .firework::before,
        .firework::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: white;
        }

        .firework::before {
          animation: firework-particle 2s ease-out infinite;
          --tx: 100px;
          --ty: -100px;
        }

        .firework::after {
          animation: firework-particle 2s ease-out infinite;
          --tx: -100px;
          --ty: -100px;
        }

        @keyframes firework-particle {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
          }
        }
      `}</style>
      
      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-cyan-400 transition-colors z-10"
            >
              ×
            </button>
            <img
              src={selectedPhoto.local_path}
              alt={selectedPhoto.caption}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl border border-slate-700/50"
            />
            <div className="mt-4 text-center">
              <p className="text-white text-lg font-medium">{selectedPhoto.caption}</p>
              <p className="text-slate-400 text-sm mt-1">{selectedPhoto.year} Memory</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}