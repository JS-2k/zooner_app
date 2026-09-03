import React from 'react';
import { MapPin, ArrowRight, Search, Store } from 'lucide-react';
import type { LocationArea } from '../types';
import { ProductDemo } from './ProductDemo';

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
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">

      {/* Background — dark, raw, intentional. Not AI gradient soup. */}
      <div className="absolute inset-0 bg-[#090D18]" />

      {/* Single bold accent — not five gradients competing */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/6 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#818cf8 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ─── LEFT: Copy ─── */}
          <div className="text-center lg:text-left">

            {/* Eyebrow — no buzzword salad */}
            <div className="inline-flex items-center gap-2 mb-7">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">
                Local discovery · Live shelf inventory
              </span>
            </div>

            {/* Headline — direct, opinionated, human */}
            <h1 className="font-['Outfit'] font-black text-white leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}>
              Your neighborhood<br />
              has everything{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  you need.
                </span>
                {/* hand-drawn underline feel */}
                <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
                  <path d="M0 5 C40 1, 80 6, 120 3 S180 1, 200 4" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                </svg>
              </span>
            </h1>

            {/* Subtext — honest, not hype */}
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Search foods, clothes, gadgets, medicines — anything. We'll show you what's actually on shelves at shops nearby. No waiting. No delivery fees. Just walk in.
            </p>

            {/* Location indicator */}
            <button
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-2 text-sm text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8 hover:bg-indigo-500/15 transition-colors cursor-pointer font-semibold"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {currentLocation.lat
                  ? `Showing results within 5 km of your GPS`
                  : currentLocation.name || 'Set your location'}
              </span>
              <span className="text-slate-500 text-xs font-normal">· change</span>
            </button>

            {/* Search bar — the main CTA */}
            <div className="max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-indigo-500/40 rounded-2xl p-2 transition-colors shadow-2xl backdrop-blur-sm">
                <Search className="h-5 w-5 text-slate-500 ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="What are you looking for near you?"
                  onClick={() => {
                    document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  readOnly
                  className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm py-2.5 focus:outline-none cursor-pointer"
                />
                <a
                  href="#discover"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/25 shrink-0"
                >
                  Search <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* Popular searches — feels real */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Try:</span>
                {['Biryani nearby', 'Nike shoes', 'Jeans under ₹999', 'iPhone charger', 'Paracetamol'].map((q) => (
                  <a
                    key={q}
                    href="#discover"
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:border-indigo-500/40 transition-colors"
                  >
                    {q}
                  </a>
                ))}
              </div>
            </div>

            {/* Social proof strip */}
            <div className="mt-10 flex items-center gap-5 justify-center lg:justify-start text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-indigo-400" />
                <span>Local shops on Zooner</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white">0%</span>
                <span>commission ever</span>
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

          {/* ─── RIGHT: Product Demo Video ─── */}
          <div className="flex flex-col items-center gap-5">

            {/* Label above demo */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-widest">
              <span className="h-px w-8 bg-slate-700" />
              See how it works
              <span className="h-px w-8 bg-slate-700" />
            </div>

            {/* The animated demo */}
            <ProductDemo />

            {/* Caption */}
            <p className="text-center text-xs text-slate-600 max-w-[280px] leading-relaxed">
              From search to walk-in in under 3 minutes. No app download needed.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
};
