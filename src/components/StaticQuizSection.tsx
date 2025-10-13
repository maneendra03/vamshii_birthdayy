import { useState } from 'react';
import { Trophy, RotateCcw, Award, Star, Brain, ChevronLeft } from 'lucide-react';
import { staticQuizQuestions } from '../lib/staticMedia';

export default function StaticQuizSection({ onBack }: { onBack?: () => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const currentQuestion = staticQuizQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    
    // Check if answer is correct
    if (answerIndex === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < staticQuizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  if (showResult) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-8 md:p-12 border-purple-500/30 animate-bounce-in">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Quiz Complete!</h2>
            <p className="text-xl text-slate-300 mb-8">
              You scored <span className="text-cyan-400 font-bold">{score}</span> out of{' '}
              <span className="text-purple-400 font-bold">{staticQuizQuestions.length}</span>
            </p>
            
            <div className="mb-8">
              {score === staticQuizQuestions.length ? (
                <div className="animate-fadeIn">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 text-yellow-400 mx-1 animate-pulse" />
                    ))}
                  </div>
                  <p className="text-2xl text-green-400 font-bold">Perfect! True Broscore! 🏆</p>
                </div>
              ) : score >= staticQuizQuestions.length * 0.7 ? (
                <p className="text-2xl text-cyan-400 font-bold">Great job! Bro status confirmed! 👍</p>
              ) : (
                <p className="text-2xl text-yellow-400 font-bold">Good effort! Keep bonding! 💪</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="btn-primary flex items-center gap-3 mx-auto animate-pulse-glow"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="btn-secondary flex items-center gap-3 mx-auto"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Games
                </button>
              )}
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
          {onBack ? (
            <button
              onClick={onBack}
              className="btn-secondary flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          <div className="text-center">
            <h2 className="section-title text-2xl md:text-3xl">
              <span className="flex items-center justify-center gap-2">
                <Brain className="w-8 h-8 text-purple-400" />
                Broship Quiz
              </span>
            </h2>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-full py-2 px-6 inline-block border border-purple-500/30">
            <span className="text-cyan-400 font-bold">
              Question {currentQuestionIndex + 1} of {staticQuizQuestions.length}
            </span>
          </div>
        </div>

        <div className="card p-8 md:p-12 border-purple-500/30 animate-fadeIn">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            {currentQuestion.question}
          </h3>
          
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={answered}
                className={`w-full text-left p-6 rounded-2xl text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  !answered
                    ? 'bg-slate-700 hover:bg-slate-600 text-white card-hover'
                    : selectedAnswer === index
                    ? index === currentQuestion.correct_answer
                      ? 'bg-green-500 text-white animate-pulse'
                      : 'bg-red-500 text-white'
                    : index === currentQuestion.correct_answer
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                } ${
                  !answered ? 'hover:shadow-lg hover:shadow-purple-500/20' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    !answered
                      ? 'bg-slate-600 text-slate-300'
                      : selectedAnswer === index
                      ? index === currentQuestion.correct_answer
                        ? 'bg-white text-green-500'
                        : 'bg-white text-red-500'
                      : index === currentQuestion.correct_answer
                      ? 'bg-white text-green-500'
                      : 'bg-slate-600 text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          {answered && (
            <div className="mt-8 text-center animate-fadeIn">
              <p className={`text-xl font-bold flex items-center justify-center gap-2 ${
                selectedAnswer === currentQuestion.correct_answer
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <>
                    <Award className="w-6 h-6" />
                    Correct! 🎉
                  </>
                ) : (
                  <>
                    Not quite! 😅
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}