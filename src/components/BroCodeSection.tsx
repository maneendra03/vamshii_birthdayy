import { Shield, Flame, Heart, Star } from 'lucide-react';

export default function BroCodeSection() {
  const broCodeRules = [
    "He's an introvert but opens up completely with close friends",
    "Spends more time with friends and homies than anyone else",
    "The undisputed roast king who can turn any situation into comedy",
    "Captures moments in photos like a pro - never misses a memory",
    "Deeply emotional guy who feels everything intensely",
    "Travel enthusiast who loves exploring new places with friends",
    "Always has a story behind every photo he takes",
    "Master of turning ordinary moments into legendary memories"
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <div className="animate-fadeIn">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-12 h-12 text-blue-400 animate-bounce" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">The Official Bro Code</h2>
            </div>

            <div className="space-y-4">
              {broCodeRules.map((rule, index) => (
                <div
                  key={index}
                  className="card p-6 rounded-2xl border-slate-700/50 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 group animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center font-bold text-white animate-pulse">
                      {index + 1}
                    </div>
                    <p className="text-lg sm:text-xl text-white font-medium pt-1 group-hover:text-blue-400 transition-colors">
                      {rule}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-8">
              <Flame className="w-12 h-12 text-orange-400 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">Roast Zone</h2>
            </div>

            <div className="card p-6 sm:p-8 border-orange-500/50 hover:scale-[1.02] transition-all duration-300">
              <div className="space-y-6 text-white">
                <p className="text-xl sm:text-2xl font-bold leading-relaxed">
                  Happy Birthday, Vamshi!
                </p>

                <p className="text-base sm:text-lg leading-relaxed">
                  Hiii pannnuuuu,
                </p>

                <p className="text-base sm:text-lg leading-relaxed">
                  First of all, happy birthday ra! Nakem cheppalo telusthale — natho prathi moment unnavu, and we enjoyed a lot — like long bike rides, cinemas , late nights,  trips, planning to visit locations, etc.
                </p>

                <p className="text-base sm:text-lg leading-relaxed">
                  Nak exact ga set ayyye mentality nedhi, but emo mana gang lo nene corner 😅. But I like you a lot and respect you every time. Manam spend chesina moments gurthukosthane, oka great memory la untayi.Nenu matram netho aa situation vachina, promise chesthunna — nenu nipakkane untanu. 💪These many years of friendship are going strong with a solid bond, and I hope even in the future it continues the same.
                </p>

                <p className="text-base sm:text-lg leading-relaxed">
                  And at the end — for your birthday gift, chala alochinchina! chala gifts select chesina, but nak em nachale 😅. Oka moment lo nēku specs nene gift eddham anukunna, but nuvve konesav. Em cheyyali chinchi chinchi, final ga na style lo oka perfect gift isthunna anukuntunna.
                </p>

                <p className="text-base sm:text-lg leading-relaxed">
                  I hope you don't think this website is late — build cheyyadam lo chala time ayyindi, andhuke intiki rale. 😄
                </p>

                <p className="text-base sm:text-lg leading-relaxed">
                  Emmainna mistakess vunte vadhileyyy raaa plss malla edipinchakuuu nayana🙏🙏
                </p>

                <div className="pt-4 border-t border-orange-500/30">
                  <p className="text-lg sm:text-xl font-bold text-orange-400">
                    You're stuck with me, bro. Deal with it.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 card p-6 text-center border-slate-700/50">
              <p className="text-slate-400 text-sm mb-2">Friendship Status:</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xl sm:text-2xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                  UNBREAKABLE
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 text-center animate-bounce-in">
          <div className="inline-block bg-slate-800/50 backdrop-blur-sm px-6 sm:px-8 py-4 rounded-full border border-slate-700/50">
            <p className="text-white font-medium">
              <span className="text-blue-400 font-bold">8 Years</span> of Chaos,{' '}
              <span className="text-cyan-400 font-bold">Countless</span> Memories,{' '}
              <span className="text-purple-400 font-bold">Infinite</span> Brotherhood
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 hidden lg:block">
          <Heart className="w-8 h-8 text-pink-500 opacity-20 animate-pulse" />
        </div>
        <div className="absolute bottom-20 left-10 hidden lg:block">
          <Star className="w-6 h-6 text-yellow-400 opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </section>
  );
}