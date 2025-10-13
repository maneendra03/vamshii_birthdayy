import { useState, useEffect } from 'react';
import { Eye, RotateCcw, Trophy, Star, ChevronLeft, HelpCircle } from 'lucide-react';
import { staticMediaItems } from '../lib/staticMedia';

interface MemoryGameItem {
  id: string;
  mediaPath: string;
  caption: string;
  blurLevel: number;
  hints: string[];
}

export default function MemoryGuessingGame({ onBack }: { onBack: () => void }) {
  // Filter only photos for the game
  const photoItems = staticMediaItems.filter(item => item.media_type === 'photo');
  
  // Create game items with different blur levels and hints
  const gameItems: MemoryGameItem[] = photoItems.map((item, index) => {
    // Generate more descriptive hints based on caption categories
    let hints: string[] = [];
    
    if (item.caption === "Another legendary moment") {
      hints = [
        "Look for people in a memorable pose or situation",
        "Focus on facial expressions and body language",
        "Notice any distinctive clothing or accessories",
        "This legendary moment features friends in a classic pose"
      ];
    } else if (item.caption === "Pure chaos") {
      hints = [
        "Look for a scene with lots of movement or action",
        "Focus on multiple people and their interactions",
        "Notice any props, food, or items in the scene",
        "This chaotic moment shows friends in a wild situation"
      ];
    } else if (item.caption === "When life gives you lemons") {
      hints = [
        "Look for people making the best of a situation",
        "Focus on expressions showing resilience or humor",
        "Notice the setting and any objects present",
        "This moment shows friends staying positive together"
      ];
    } else if (item.caption === "Too good not to share") {
      hints = [
        "Look for something exciting or special happening",
        "Focus on reactions and shared excitement",
        "Notice any items or activities that bring joy",
        "This moment was so good they had to share it"
      ];
    } else if (item.caption === "Bro code in action") {
      hints = [
        "Look for friends showing loyalty or support",
        "Focus on gestures or actions between people",
        "Notice any items that represent friendship",
        "This shows the unbreakable bond between friends"
      ];
    } else if (item.caption === "Epic fail or win?") {
      hints = [
        "Look for people in a humorous or unexpected situation",
        "Focus on reactions and expressions of surprise",
        "Notice any items or elements that caused the moment",
        "This moment could be a funny fail or a surprising win"
      ];
    } else if (item.caption === "Classic Vamshi moment") {
      hints = [
        "Look for a signature pose or characteristic style",
        "Focus on distinctive features or expressions",
        "Notice the setting that's typical for such moments",
        "This shows a typical moment with Vamshi's unique style"
      ];
    } else if (item.caption === "Priceless memories") {
      hints = [
        "Look for people creating special memories together",
        "Focus on genuine emotions and connections",
        "Notice the setting and elements that make it memorable",
        "This captures a truly priceless moment between friends"
      ];
    } else if (item.caption === "No comment needed") {
      hints = [
        "Look for a scene that speaks for itself",
        "Focus on visual elements that tell the whole story",
        "Notice any obvious or humorous aspects of the moment",
        "This moment is so clear that no words are needed"
      ];
    } else if (item.caption === "Wish you were here") {
      hints = [
        "Look for people enjoying a special place or event",
        "Focus on the setting and what makes it special",
        "Notice any activities or elements that show fun times",
        "This moment shows friends wishing others could join"
      ];
    } else {
      // Default hints for any other captions
      hints = [
        "Look for people and the setting they're in",
        "Focus on visual details like clothing and expressions",
        "Notice any objects or elements that define the scene",
        `This memory from ${item.year} shows: ${item.caption}`
      ];
    }
    
    return {
      id: item.id,
      mediaPath: item.local_path,
      caption: item.caption,
      blurLevel: Math.floor(Math.random() * 20) + 10, // Random blur between 10-30
      hints
    };
  });

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const currentItem = gameItems[currentItemIndex];

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('memoryGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('memoryGameHighScore', score.toString());
    }
  }, [score, highScore]);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correct = userGuess.toLowerCase().includes(currentItem.caption.toLowerCase()) || 
                   currentItem.caption.toLowerCase().includes(userGuess.toLowerCase());
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + (3 - hintLevel)); // More points for fewer hints
    }
    
    // Move to next item after delay
    setTimeout(() => {
      if (currentItemIndex < gameItems.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
        setUserGuess('');
        setHintLevel(0);
        setShowResult(false);
      } else {
        setGameCompleted(true);
      }
    }, 2000);
  };

  const handleHintRequest = () => {
    if (hintLevel < currentItem.hints.length - 1) {
      setHintLevel(hintLevel + 1);
    }
  };

  const restartGame = () => {
    setCurrentItemIndex(0);
    setUserGuess('');
    setScore(0);
    setHintLevel(0);
    setShowResult(false);
    setIsCorrect(false);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-8 md:p-12 border-purple-500/30 animate-bounce-in">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Game Complete!</h2>
            <p className="text-xl text-slate-300 mb-4">
              Final Score: <span className="text-cyan-400 font-bold">{score}</span>
            </p>
            <p className="text-xl text-slate-300 mb-8">
              High Score: <span className="text-purple-400 font-bold">{highScore}</span>
            </p>
            
            <div className="mb-8">
              {score >= highScore && score > 0 ? (
                <div className="animate-fadeIn">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 text-yellow-400 mx-1 animate-pulse" />
                    ))}
                  </div>
                  <p className="text-2xl text-green-400 font-bold">New High Score! 🏆</p>
                </div>
              ) : score >= gameItems.length * 2 ? (
                <p className="text-2xl text-cyan-400 font-bold">Amazing Memory! 👍</p>
              ) : (
                <p className="text-2xl text-yellow-400 font-bold">Good Effort! Keep Practicing! 💪</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartGame}
                className="btn-primary flex items-center gap-3 mx-auto animate-pulse-glow"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
              <button
                onClick={onBack}
                className="btn-secondary flex items-center gap-3 mx-auto"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Games
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="text-center">
            <h2 className="section-title text-2xl md:text-3xl">
              <span className="flex items-center justify-center gap-2">
                <Eye className="w-8 h-8 text-green-400" />
                Guess the Memory
              </span>
            </h2>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-full py-2 px-4 border border-purple-500/30">
            <span className="text-cyan-400 font-bold">
              Score: {score}
            </span>
          </div>
        </div>

        <div className="card p-6 md:p-8 border-purple-500/30 animate-fadeIn">
          <div className="text-center mb-6">
            <div className="bg-slate-800/50 rounded-full py-2 px-6 inline-block mb-4">
              <span className="text-green-400 font-bold">
                Memory {currentItemIndex + 1} of {gameItems.length}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-slate-300">
                High Score: <span className="text-purple-400 font-bold">{highScore}</span>
              </div>
              <div className="text-slate-300">
                Hints Used: <span className="text-yellow-400 font-bold">{hintLevel}/3</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative rounded-2xl overflow-hidden border-4 border-slate-700 mx-auto max-w-2xl">
              <div 
                className="w-full h-96 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url('${currentItem.mediaPath}')`,
                  filter: `blur(${Math.max(2, currentItem.blurLevel - (hintLevel * 5))}px)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
            </div>
          </div>

          {hintLevel > 0 && (
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700 animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">Hint #{hintLevel}</span>
              </div>
              <p className="text-slate-200">{currentItem.hints[hintLevel - 1]}</p>
            </div>
          )}

          <form onSubmit={handleGuessSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="What do you think this memory is about?"
                className="flex-grow px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={showResult}
              />
              <button
                type="submit"
                className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={showResult || !userGuess.trim()}
              >
                Submit Guess
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleHintRequest}
              disabled={hintLevel >= 3 || showResult}
              className="px-6 py-3 bg-slate-700 text-slate-200 font-medium rounded-xl hover:bg-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              Get Hint {hintLevel < 3 ? `(${3 - hintLevel} left)` : '(No more hints)'}
            </button>
          </div>

          {showResult && (
            <div className={`mt-6 p-4 rounded-xl text-center animate-fadeIn ${isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
              <p className={`text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '🎉 Correct! Well done!' : `😅 Not quite! The memory was: "${currentItem.caption}"`}
              </p>
              {isCorrect && (
                <p className="text-slate-300 mt-2">
                  +{3 - hintLevel} points {hintLevel > 0 ? `(used ${hintLevel} hint${hintLevel > 1 ? 's' : ''})` : '(no hints used)'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

