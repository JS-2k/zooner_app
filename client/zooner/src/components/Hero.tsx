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
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#050914]">
      {/* Subtle Background Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto text-center space-y-8 z-10">
        
        {/* ── 1. COMPANY SLOGAN & LIVE BADGE ── */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest">
              Live Hyperlocal Commerce · Zero Shipping Wait
            </span>
          </div>

          {/* Main Slogan & Headline */}
          <h1 className="font-['Outfit'] font-black text-white text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight">
            Search anything near you.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
              Walk in & buy it today.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Don't wait 3 days for delivery. Post what you need — nearby verified physical stores confirm real-time shelf stock in under 60 seconds.
          </p>
        </div>

        {/* ── 2. CLEAN SEARCH BAR ── */}
        <div className="max-w-2xl mx-auto bg-slate-900/95 border border-slate-700/90 hover:border-indigo-500/60 rounded-2xl p-2 transition-all backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-indigo-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="What are you looking for near you? (e.g. Nike Air Max, Titan Watch)"
              onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}
              readOnly
              className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm py-2.5 px-1 focus:outline-none cursor-pointer"
            />
            <a
              href="#discover"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 shrink-0 cursor-pointer"
            >
              Search <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Trending Chips */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2.5 px-2 border-t border-slate-800/80 mt-2">
            <span className="text-[11px] text-slate-500 font-medium mr-1">Trending:</span>
            {[
              { label: '👟 Nike Shoes', query: 'Nike' },
              { label: '⌚ Titan Watch', query: 'Titan' },
              { label: '💡 Philips Smart', query: 'Philips' },
              { label: '📱 iPhone 16', query: 'Apple' },
              { label: '👕 Linen Shirt', query: 'Linen' },
            ].map(item => (
              <a
                key={item.label}
                href="#discover"
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600/20 border border-slate-700/60 hover:border-indigo-500/40 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Location & Retailer Portal Chips */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <button
            onClick={onOpenLocationModal}
            className="inline-flex items-center gap-1.5 text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-1.5 hover:bg-indigo-500/20 transition-all cursor-pointer font-semibold shadow-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-indigo-400" />
            <span>{currentLocation.lat ? 'GPS Active · ' : ''}{currentLocation.name || 'RS Puram, Coimbatore'}</span>
          </button>

          <button
            onClick={onOpenRetailerModal}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer font-medium"
          >
            <Store className="h-3.5 w-3.5 text-slate-500" />
            <span>Own a retail shop? List inventory free →</span>
          </button>
        </div>

        {/* ── 3. PRODUCT EXPLANATION: STEP-BY-STEP CARD SLIDE ── */}
        <div className="pt-4">
          <ProductStepSlider />
        </div>

        {/* ── 4. TRUST VALUE METRICS ── */}
        <div className="grid grid-cols-3 max-w-xl mx-auto gap-4 pt-4 border-t border-slate-800/60 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
              <Zap className="h-4 w-4" /> &lt; 60 Seconds
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">Average Store Reply</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
              <Clock className="h-4 w-4" /> 350m Walk
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">Average Distance</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-sm">
              <ShieldCheck className="h-4 w-4" /> 100% In-Store
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5">Verified Local Inventory</span>
          </div>
        </div>

      </div>
    </section>
  );
};
