import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { LocationArea } from '../types';

interface HeroProps {
  currentLocation: LocationArea;
  onOpenRetailerModal: () => void;
  onOpenLocationModal: () => void;
  onSearchSubmit: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLocation,
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
    } else {
      const el = document.getElementById('request');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    onSearchSubmit(term);
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-28 pb-20 px-6 sm:px-8 bg-black text-white selection:bg-white selection:text-black">
      
      {/* ── 1. MAIN HEADLINE & EDITORIAL VOICE ── */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        <h1 
          className="font-['Outfit'] font-black tracking-tighter text-white leading-[0.95]"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.2rem)' }}
        >
          Find it. Nearby.
        </h1>

        <p className="text-white/60 text-base sm:text-xl font-normal max-w-xl mx-auto leading-relaxed">
          Find products at local stores, check real-time availability, and walk in today.
        </p>

        {/* ── 2. PRIMARY SEARCH INPUT (Apple Spotlight / PlayStation Console style) ── */}
        <div className="pt-4 max-w-2xl mx-auto w-full">
          <form 
            onSubmit={handleSubmit}
            className="group relative flex items-center bg-white/[0.06] hover:bg-white/[0.09] focus-within:bg-white/[0.1] border border-white/[0.12] focus-within:border-white/40 rounded-full p-2 pl-6 transition-all duration-300 shadow-2xl backdrop-blur-2xl"
          >
            <Search className="h-5 w-5 text-white/40 group-focus-within:text-white transition-colors shrink-0 mr-3" />
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anything nearby… (e.g. Nike Air Max, Titan watch)"
              className="w-full bg-transparent text-white placeholder-white/40 text-sm sm:text-base font-normal focus:outline-none"
            />

            <button
              type="submit"
              className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white text-black hover:bg-white/90 transition-all shrink-0 cursor-pointer shadow-md group-hover:scale-105"
              aria-label="Search Nearby"
            >
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Minimal Search Category Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <span className="text-xs text-white/40 font-medium mr-1">Try:</span>
            {[
              'Nike Air Max (UK 9)',
              'Titan Edge Watch',
              'Philips Smart Hue',
              'iPhone 16 Pro',
              'Linen Shirt'
            ].map(item => (
              <button
                key={item}
                type="button"
                onClick={() => handleChipClick(item)}
                className="text-xs text-white/60 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.07] rounded-full px-3 py-1 transition-all cursor-pointer font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── 3. LARGE HERO VISUAL: PHYSICAL SHOPPING SHOWCASE ── */}
      <div className="w-full max-w-5xl mx-auto pt-14 sm:pt-20">
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-10 backdrop-blur-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Product Image on Real Shelf */}
            <div className="md:col-span-6 relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-white/[0.08]">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85" 
                alt="Nike Shoe in Local Store"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-white/90">Nike Air Max 270</span>
                <span className="text-white/60">Size UK 9 · ₹6,499</span>
              </div>
            </div>

            {/* Right: Local Physical Store Walk-in Match */}
            <div className="md:col-span-6 text-left space-y-5">
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/50 uppercase tracking-widest">
                  <span>Verified On-Shelf</span>
                  <span>·</span>
                  <span className="text-white/80">{currentLocation.name || 'RS Puram, Coimbatore'}</span>
                </div>
                <h3 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Nike Store · DB Road
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  350 meters away · 4 minute walk. In stock and reserved on the counter right now.
                </p>
              </div>

              {/* Verified Walk-In Card */}
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>2 Pairs in Stock (UK 9)</span>
                  </div>
                  <span className="text-white/40">Direct Store Price</span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-white/[0.06]">
                  <div>
                    <span className="text-2xl font-black text-white">₹6,499</span>
                    <span className="text-xs text-white/40 line-through ml-2">₹7,995</span>
                  </div>
                  <div className="text-xs text-white/60">
                    Hold for 30 mins active
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <a
                  href="#request"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-black bg-white hover:bg-white/90 px-5 py-2.5 rounded-full transition-all shadow-md"
                >
                  <span>Try Asking Nearby</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <span className="text-xs text-white/40">
                  Zero delivery wait. Take it home today.
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
