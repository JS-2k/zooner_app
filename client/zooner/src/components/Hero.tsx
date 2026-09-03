import React from 'react';
import { MapPin, ArrowRight, Search, Store } from 'lucide-react';
import type { LocationArea } from '../types';
import { ZoonerCityAnimation } from './ZoonerCityAnimation';

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
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── FULL-SCREEN CITY ANIMATION ── */}
      <div className="absolute inset-0 z-0">
        <ZoonerCityAnimation />
      </div>

      {/* ── Bottom gradient fade for text readability ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[50%] z-[1] bg-gradient-to-t from-[#060B16] via-[#060B16dd] to-transparent pointer-events-none" />

      {/* ── Spacer to push content to bottom ── */}
      <div className="flex-1" />

      {/* ── COMPACT TEXT OVERLAY (bottom of screen) ── */}
      <div className="relative z-10 w-full px-5 sm:px-8 lg:px-10 pb-8 pt-4">
        <div className="max-w-5xl mx-auto">

          {/* Headline row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                  Local discovery · Live inventory
                </span>
              </div>

              <h1 className="font-['Outfit'] font-black text-white leading-[1.05] tracking-tight mb-3"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                Search anything near you.{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Walk in today.
                </span>
              </h1>

              <p className="text-slate-400 text-sm leading-relaxed">
                Foods, clothes, gadgets, medicines — we show you what's on shelves at stores nearby. No delivery wait.
              </p>
            </div>

            {/* Location chip + retailer link */}
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={onOpenLocationModal}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5 hover:bg-indigo-500/20 transition-colors cursor-pointer font-semibold"
              >
                <MapPin className="h-3 w-3" />
                {currentLocation.lat ? 'GPS active' : currentLocation.name || 'Set location'}
              </button>
              <button
                onClick={onOpenRetailerModal}
                className="text-xs text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <Store className="h-3 w-3 inline mr-1" />
                Own a shop? List free →
              </button>
            </div>
          </div>

          {/* Search bar — compact, full width */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-indigo-500/40 rounded-2xl p-1.5 transition-all backdrop-blur-md shadow-2xl">
            <Search className="h-4 w-4 text-slate-500 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="What are you looking for near you?"
              onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}
              readOnly
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm py-2 focus:outline-none cursor-pointer"
            />
            <div className="flex items-center gap-1.5 mr-1">
              {['🍛 Food', '👟 Shoes', '📱 Gadgets'].map(q => (
                <a
                  key={q}
                  href="#discover"
                  className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-[10px] text-slate-400 hover:text-white hover:border-indigo-500/40 transition-colors whitespace-nowrap"
                >
                  {q}
                </a>
              ))}
              <a
                href="#discover"
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25 shrink-0"
              >
                Search <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
