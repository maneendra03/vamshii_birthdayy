import { useState, useEffect } from 'react';
import { Quote, Heart, Star, X, Check, XCircle } from 'lucide-react';

interface Opinion {
  id: number;
  text: string;
  mood: 'funny' | 'heartfelt' | 'nostalgic' | 'admiring';
}

interface FriendOption {
  id: number;
  name: string;
  avatar: string;
}

// Sample opinions - in a real app, these would come from a data source
const sampleOpinions: Opinion[] = [
  {
    id: 1,
    text: "I've never met someone who can turn a simple hangout into an epic adventure. Every moment with you is a story worth telling!",
    mood: 'funny'
  },
  {
    id: 2,
    text: "Your friendship has been a constant source of joy and laughter through all of life's ups and downs. You make even the mundane moments special.",
    mood: 'heartfelt'
  },
  {
    id: 3,
    text: "Remember when we thought we were so cool for staying up all night talking about our dreams? Look how far we've come since then!",
    mood: 'nostalgic'
  },
  {
    id: 4,
    text: "You have this incredible ability to make everyone around you feel valued and heard. That's a rare quality that makes you truly special.",
    mood: 'admiring'
  },
  {
    id: 5,
    text: "The way you handle chaos with humor and grace is honestly inspiring. You turn every disaster into a comedy show!",
    mood: 'funny'
  },
  {
    id: 6,
    text: "Even after all these years, your friendship still feels like a warm hug on a cold day. Thank you for being such an amazing friend.",
    mood: 'heartfelt'
  },
  {
    id: 7,
    text: "Those early days of figuring out who we were and where we were going - I wouldn't trade those memories for anything in the world.",
    mood: 'nostalgic'
  },
  {
    id: 8,
    text: "Your loyalty and genuine care for others is something I deeply admire. You're the kind of friend everyone wishes they had.",
    mood: 'admiring'
  }
];

// Sample friend options for the quiz
const friendOptions: FriendOption[] = [
  { id: 1, name: "Alex Johnson", avatar: "AJ" },
  { id: 2, name: "Sam Wilson", avatar: "SW" },
  { id: 3, name: "Jordan Lee", avatar: "JL" },
  { id: 4, name: "Taylor Kim", avatar: "TK" },
  { id: 5, name: "Morgan Reed", avatar: "MR" },
  { id: 6, name: "Casey Brown", avatar: "CB" },
  { id: 7, name: "Riley Smith", avatar: "RS" },
  { id: 8, name: "Quinn Davis", avatar: "QD" }
];

export default function FriendOpinionsSection() {
  const [opinions, setOpinions] = useState<Opinion[]>(sampleOpinions);
  const [visibleOpinions, setVisibleOpinions] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<FriendOption | null>(null);
  const [quizResult, setQuizResult] = useState<boolean | null>(null);
  const [shuffledFriends, setShuffledFriends] = useState<FriendOption[]>([]);

  useEffect(() => {
    // Initialize with the first opinion visible
    if (visibleOpinions.length === 0 && sampleOpinions.length > 0) {
      setVisibleOpinions([sampleOpinions[0].id]);
      setCurrentIndex(1);
    }
    
    // Reveal opinions one by one with a delay
    else if (currentIndex < sampleOpinions.length) {
      const timer = setTimeout(() => {
        setVisibleOpinions(prev => [...prev, sampleOpinions[currentIndex].id]);
        setCurrentIndex(prev => prev + 1);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, visibleOpinions.length]);

  const openQuizModal = (opinion: Opinion) => {
    setSelectedOpinion(opinion);
    setShowQuizModal(true);
    setSelectedFriend(null);
    setQuizResult(null);
    
    // Shuffle friends and select 4 random options
    const shuffled = [...friendOptions].sort(() => Math.random() - 0.5);
    setShuffledFriends(shuffled.slice(0, 4));
  };

  const closeQuizModal = () => {
    setShowQuizModal(false);
    setSelectedOpinion(null);
    setSelectedFriend(null);
    setQuizResult(null);
  };

  const handleFriendSelect = (friend: FriendOption) => {
    if (quizResult !== null) return; // Prevent re-selection after answer
    
    setSelectedFriend(friend);
    
    // In a real app, this would check against the actual author
    // For now, we'll simulate a random correct/incorrect result
    const isCorrect = Math.random() > 0.5;
    setQuizResult(isCorrect);
  };

  const nextOpinion = () => {
    closeQuizModal();
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'funny': return <span className="text-yellow-400">😂</span>;
      case 'heartfelt': return <Heart className="w-5 h-5 text-pink-400" />;
      case 'nostalgic': return <span className="text-purple-400">💭</span>;
      case 'admiring': return <Star className="w-5 h-5 text-blue-400" />;
      default: return <Quote className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'funny': return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 'heartfelt': return 'from-pink-500/20 to-rose-500/20 border-pink-500/30';
      case 'nostalgic': return 'from-purple-500/20 to-indigo-500/20 border-purple-500/30';
      case 'admiring': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      default: return 'from-slate-700/20 to-slate-600/20 border-slate-500/30';
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16 animate-fadeIn">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Quote className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 animate-bounce" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">Friend Opinions</h2>
          </div>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto">
            What others say about our birthday boy - anonymously shared thoughts and feelings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {opinions.map((opinion, index) => (
            <div
              key={opinion.id}
              onClick={() => openQuizModal(opinion)}
              className={`card p-5 md:p-6 border transition-all duration-500 transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br ${getMoodColor(opinion.mood)} ${
                visibleOpinions.includes(opinion.id) 
                  ? 'opacity-100 translate-y-0 animate-fadeIn cursor-pointer' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                minHeight: '200px'
              }}
            >
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="p-2 bg-slate-700/50 rounded-full">
                  {getMoodIcon(opinion.mood)}
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-slate-200 text-base md:text-lg mb-4 flex-grow">
                "{opinion.text}"
              </p>
              
              <div className="flex justify-end">
                <span className="text-xs md:text-sm text-slate-400 italic">
                  - A Friend
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Modal */}
        {showQuizModal && selectedOpinion && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">Who Wrote This?</h3>
                  <button 
                    onClick={closeQuizModal}
                    className="p-2 rounded-full hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                
                <div className="mb-6 p-4 bg-slate-700/50 rounded-xl border border-slate-600">
                  <p className="text-slate-200 text-lg mb-4">"{selectedOpinion.text}"</p>
                  <div className="flex justify-end">
                    <span className="text-sm text-slate-400 italic">- A Friend</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Select the friend who wrote this:</h4>
                  <div className="space-y-3">
                    {shuffledFriends.map((friend) => (
                      <button
                        key={friend.id}
                        onClick={() => handleFriendSelect(friend)}
                        disabled={quizResult !== null}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          selectedFriend?.id === friend.id
                            ? quizResult === true
                              ? 'bg-green-500/20 border-green-500'
                              : quizResult === false
                                ? 'bg-red-500/20 border-red-500'
                                : 'bg-blue-500/20 border-blue-500'
                            : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                        } ${quizResult !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {friend.avatar}
                        </div>
                        <span className="text-white font-medium">{friend.name}</span>
                        {selectedFriend?.id === friend.id && quizResult !== null && (
                          <div className="ml-auto">
                            {quizResult ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {quizResult !== null && (
                  <div className={`p-4 rounded-xl mb-6 ${quizResult ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {quizResult ? (
                        <>
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="font-bold text-green-400">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-400" />
                          <span className="font-bold text-red-400">Not quite!</span>
                        </>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm">
                      {quizResult 
                        ? "You know your friends well!"
                        : "That's okay, it was a tough one!"}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={closeQuizModal}
                    className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                  >
                    Close
                  </button>
                  {quizResult !== null && (
                    <button
                      onClick={nextOpinion}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium transition-all"
                    >
                      Next Opinion
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12 md:mt-16">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
          >
            Back to Top
          </button>
        </div>
      </div>
    </section>
  );
}