import React from 'react';
import { ArrowRight, Search } from 'lucide-react';

interface FinalCTAProps {
  onOpenRetailerModal: () => void;
  onSearchClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onSearchClick }) => {
  return (
    <section className="relative py-32 sm:py-48 px-6 sm:px-8 bg-black text-white border-t border-white/[0.06] overflow-hidden text-center">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Massive, confident headline */}
        <h2 
          className="font-['Outfit'] font-black tracking-tighter text-white leading-[0.95]"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
        >
          Stop waiting. <br />
          Find it nearby.
        </h2>

        <p className="text-white/50 text-base sm:text-xl font-normal max-w-lg mx-auto leading-relaxed">
          What you're searching for is already sitting on a shelf in your neighborhood.
        </p>

        {/* One Strong CTA Button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={onSearchClick}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-sm sm:text-base hover:bg-white/90 transition-all shadow-2xl hover:scale-105 cursor-pointer"
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
            <span>Search Nearby Stores</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
