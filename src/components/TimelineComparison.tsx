import { ArrowRight } from 'lucide-react';

interface TimelineComparisonProps {
  year: number;
  then: {
    image: string;
    caption: string;
  };
  now: {
    image: string;
    caption: string;
  };
}

export default function TimelineComparison({ year, then, now }: TimelineComparisonProps) {
  return (
    <div className="card p-4 md:p-6 border-slate-700/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 mb-6 md:mb-8">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <div className="px-2 py-1 md:px-3 md:py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white text-xs md:text-sm font-bold">
          {year}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white">Comparison</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:gap-8">
        {/* First section */}
        <div className="space-y-3 md:space-y-4">
          <div className="relative group overflow-hidden rounded-xl md:rounded-2xl">
            <img
              src={then.image}
              alt={then.caption}
              className="w-full h-40 md:h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-full font-bold text-xs md:text-sm">
              THEN
            </div>
          </div>
          <p className="text-white font-medium text-center text-sm md:text-base">
            {then.caption}
          </p>
        </div>

        {/* Arrow indicator - centered on mobile, side-by-side on desktop */}
        <div className="flex justify-center my-2 md:my-0">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 md:p-3 rounded-full">
            <ArrowRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
        </div>

        {/* Second section */}
        <div className="space-y-3 md:space-y-4">
          <div className="relative group overflow-hidden rounded-xl md:rounded-2xl">
            <img
              src={now.image}
              alt={now.caption}
              className="w-full h-40 md:h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-2 py-1 md:px-3 md:py-1 rounded-full font-bold text-xs md:text-sm">
              NOW
            </div>
          </div>
          <p className="text-white font-medium text-center text-sm md:text-base">
            {now.caption}
          </p>
        </div>
      </div>
    </div>
  );
}