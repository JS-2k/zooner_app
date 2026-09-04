import React from 'react';
import { MapPin, ArrowRight, Search, Store, Zap, ShieldCheck, Clock } from 'lucide-react';
import type { LocationArea } from '../types';
import { ProductStepSlider } from './ProductStepSlider';

interface HeroProps {
  currentLocation: LocationArea;
  onOpenRetailerModal: () => void;
  onOpenLocationModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLocation,
  onOpenRetailerModal,
  onOpenLocationModal,
}) => {
  return (
    <section className="relative flex flex-col justify-center overflow-hidden pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-[#050914]">
      {/* Subtle Background Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto text-center space-y-5 z-10">
        
        {/* ── 1. SLOGAN & HEADLINE ── */}
        <div className="space-y-2.5 max-w-2xl mx-auto">
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
              Hyperlocal Live Discovery · Zero Shipping Wait
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-['Outfit'] font-black text-white text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
            Search anything near you.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
              Walk in today.
            </span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Post what you need. Nearby verified physical stores confirm shelf stock in under 60 seconds.
          </p>
        </div>

        {/* ── 2. COMPACT SEARCH BAR ── */}
        <div className="max-w-xl mx-auto bg-slate-900/95 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-1.5 transition-all shadow-xl">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-indigo-400 ml-2.5 shrink-0" />
            <input
              type="text"
              placeholder="What are you looking for near you? (e.g. Nike shoes, Titan watch)"
              onClick={() => document.getElementById('request-feature')?.scrollIntoView({ behavior: 'smooth' })}
              readOnly
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm py-2 px-1 focus:outline-none cursor-pointer"
            />
            <a
              href="#request-feature"
              className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/30 shrink-0 cursor-pointer"
            >
              Search <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Trending Chips */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2 px-2 border-t border-slate-800/80 mt-1.5">
            <span className="text-[10px] text-slate-500 font-medium mr-1">Trending:</span>
            {[
              { label: '👟 Nike Shoes', query: 'Nike' },
              { label: '⌚ Titan Watch', query: 'Titan' },
              { label: '💡 Philips Light', query: 'Philips' },
              { label: '📱 iPhone 16', query: 'Apple' },
            ].map(item => (
              <a
                key={item.label}
                href="#request-feature"
                className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-indigo-600/20 border border-slate-700/60 hover:border-indigo-500/40 text-[10px] text-slate-300 hover:text-white transition-all cursor-pointer font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Location & Retailer Portal Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          <button
            onClick={onOpenLocationModal}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 hover:bg-indigo-500/20 transition-all cursor-pointer font-semibold"
          >
            <MapPin className="h-3 w-3 text-indigo-400" />
            <span>{currentLocation.lat ? 'GPS Active · ' : ''}{currentLocation.name || 'RS Puram, Coimbatore'}</span>
          </button>

          <button
            onClick={onOpenRetailerModal}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer font-medium"
          >
            <Store className="h-3 w-3 text-slate-500" />
            <span>Own a shop? List free →</span>
          </button>
        </div>

        {/* ── 3. COMPACT 3-STEP EXPLANATION ── */}
        <div className="pt-1">
          <ProductStepSlider />
        </div>

        {/* ── 4. TRUST VALUE METRICS ── */}
        <div className="grid grid-cols-3 max-w-lg mx-auto gap-2 pt-3 border-t border-slate-800/60 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-xs">
              <Zap className="h-3.5 w-3.5" /> &lt; 60s
            </div>
            <span className="text-[10px] text-slate-500">Store Reply</span>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-xs">
              <Clock className="h-3.5 w-3.5" /> 350m
            </div>
            <span className="text-[10px] text-slate-500">Avg Walk</span>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-indigo-400 font-bold text-xs">
              <ShieldCheck className="h-3.5 w-3.5" /> 100%
            </div>
            <span className="text-[10px] text-slate-500">Verified Stock</span>
          </div>
        </div>

      </div>
    </section>
  );
};
