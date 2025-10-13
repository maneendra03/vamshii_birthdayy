import { useState, useEffect } from 'react';
import { Sparkles, Gift, PartyPopper } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Loading 8 years of stupidity');
  const [confetti, setConfetti] = useState<Array<{id: number, color: string, left: number}>>([]);

  useEffect(() => {
    const texts = [
      'Loading 8 years of stupidity',
      'Gathering evidence of bad decisions',
      'Compiling dumb memories',
      'Preparing chaos montage',
      'Almost there'
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 800);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Generate confetti
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: [`#3b82f6`, `#06b6d4`, `#8b5cf6`, `#ec4899`, `#f59e0b`][Math.floor(Math.random() * 5)],
      left: Math.random() * 100
    }));
    setConfetti(confettiPieces);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Confetti effect */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 3 + 2}s`
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {loading ? (
          <div className="animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white text-xl font-medium">{loadingText}...</p>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="mb-8 inline-block">
              <div className="relative">
                <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse" />
                <Gift className="w-8 h-8 text-pink-500 absolute -top-2 -right-2 animate-bounce" />
                <PartyPopper className="w-8 h-8 text-cyan-400 absolute -bottom-2 -left-2 animate-pulse" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Welcome to the
              <span className="block animate-rainbow mt-2">
                Disaster Called
              </span>
              <span className="block mt-2">Our Friendship</span>
            </h1>

            <p className="text-2xl md:text-3xl text-slate-300 font-medium mb-4">
              8 Years. 100+ Photos. Infinite Dumb Decisions.
            </p>

            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
              A journey through chaos, laughter, and questionable life choices.
              Buckle up for the ride of memories that probably shouldn't exist.
            </p>

            <button
              onClick={onEnter}
              className="group relative px-12 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xl font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 animate-pulse-glow"
            >
              <span className="relative z-10 flex items-center gap-3">
                Enter the Madness
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-confetti-fall {
          animation: confetti-fall linear forwards;
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          top: -10px;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}