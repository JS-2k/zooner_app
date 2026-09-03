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
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── FULL-SCREEN CITY ANIMATION (background) ── */}
      <div className="absolute inset-0 z-0">
        <ZoonerCityAnimation />
      </div>

      {/* ── Gradient vignettes to make text readable ── */}
      {/* Left fade: dark to transparent */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#080E1C] via-[#080E1Ccc] to-transparent pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#080E1C] via-transparent to-[#080E1C88] pointer-events-none" />

      {/* ── CONTENT OVERLAY (left side) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full pt-24 pb-20">
        <div className="max-w-xl">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-7">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.14em]">
              Local discovery · Live shelf inventory
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-['Outfit'] font-black text-white leading-[1.05] tracking-tight mb-5"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)' }}>
            Your neighborhood<br />
            has everything{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                you need.
              </span>
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
                <path d="M0 5 C40 1, 80 6, 120 3 S180 1, 200 4" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Search foods, clothes, gadgets, medicines — anything. We'll show you what's <strong className="text-white font-semibold">actually on shelves</strong> at shops nearby. No waiting. Just walk in.
          </p>

          {/* Location indicator */}
          <button
            onClick={onOpenLocationModal}
            className="inline-flex items-center gap-2 text-sm text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6 hover:bg-indigo-500/20 transition-colors cursor-pointer font-semibold"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {currentLocation.lat
                ? `GPS active · showing results within 5 km`
                : currentLocation.name || 'Set your location'}
            </span>
            <span className="text-slate-500 text-xs font-normal">· change</span>
          </button>

          {/* Search bar */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/12 hover:border-indigo-500/50 rounded-2xl p-2 transition-all shadow-2xl backdrop-blur-md mb-4">
            <Search className="h-5 w-5 text-slate-500 ml-2 shrink-0" />
            <input
              type="text"
              placeholder="What are you looking for near you?"
              onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })}
              readOnly
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm py-2.5 focus:outline-none cursor-pointer"
            />
            <a
              href="#discover"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 shrink-0"
            >
              Search <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Quick searches */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-10">
            <span>Try:</span>
            {['Biryani nearby 🍛', 'Nike shoes 👟', 'Jeans ₹999', 'iPhone charger', 'Paracetamol'].map((q) => (
              <a
                key={q}
                href="#discover"
                className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-indigo-500/40 transition-colors"
              >
                {q}
              </a>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-5 text-xs text-slate-500 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-indigo-400" />
              <span>Local shops on Zooner</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div>
              <span className="font-bold text-white">0%</span> commission ever
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <button
              onClick={onOpenRetailerModal}
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Own a shop? List it free →
            </button>
          </div>

        </div>
      </div>

    </section>
  );
};
