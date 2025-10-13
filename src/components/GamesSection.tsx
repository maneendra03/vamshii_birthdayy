import { useState } from 'react';
import { Gamepad2, Brain, Trophy } from 'lucide-react';
import StaticQuizSection from './StaticQuizSection';

export default function GamesSection() {
  const [activeGame, setActiveGame] = useState<'quiz' | null>(null);

  const handleBackToMenu = () => {
    setActiveGame(null);
  };

  if (activeGame === 'quiz') {
    return <StaticQuizSection onBack={handleBackToMenu} />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="section-title">
            <span className="flex items-center justify-center gap-2">
              <Gamepad2 className="w-10 h-10 text-purple-400" />
              Bro Games
            </span>
          </h2>
          <p className="section-subtitle">
            Test your broship with these fun challenges!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 justify-items-center">
          {/* Quiz Game Card */}
          <div 
            className="card p-8 border-purple-500/30 hover:border-cyan-400/50 cursor-pointer transform hover:scale-105 transition-all duration-300 animate-fadeIn"
            onClick={() => setActiveGame('quiz')}
          >
            <div className="text-center">
              <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Broship Quiz</h3>
              <p className="text-slate-300 mb-6">
                How well do you know your bro? Test your knowledge with our interactive quiz!
              </p>
              <div className="bg-slate-800/50 rounded-full py-2 px-4 inline-block">
                <span className="text-cyan-400 font-medium">10 Questions</span>
              </div>
            </div>
          </div>

          {/* Placeholder for removed game */}
          <div className="card p-8 border-purple-500/30 opacity-50 cursor-not-allowed animate-fadeIn delay-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl text-slate-500">?</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-500 mb-4">More Games</h3>
              <p className="text-slate-500 mb-6">
                New games coming soon! Stay tuned for more fun challenges.
              </p>
              <div className="bg-slate-800/50 rounded-full py-2 px-4 inline-block">
                <span className="text-slate-500 font-medium">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center animate-fadeIn delay-200">
          <div className="card p-8 border-purple-500/30 inline-block">
            <div className="flex items-center gap-3 justify-center">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">High Scores</h3>
            </div>
            <p className="text-slate-300 mt-4">
              Beat your personal best and compete with friends!
            </p>
            <p className="text-sm text-slate-400 mt-4">
              Scores are saved locally on your device
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}