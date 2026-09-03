import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  ArrowRight, 
  Store, 
  Tag, 
  Heart,
  Compass,
  Zap,
  CheckCircle2
} from 'lucide-react';
import type { LocationArea } from '../types';

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
  const [activeHeroTab, setActiveHeroTab] = useState<'all' | 'shoes' | 'fashion'>('all');

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-slate-50/50 dark:bg-transparent transition-colors duration-200">
      {/* Aesthetic Tech Ambient Background (No Radar) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Ambient Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[90px]" />

        {/* Minimalist Micro Grid Texture */}
        <div 
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.04]" 
          style={{
            backgroundImage: `radial-gradient(#6366f1 1.2px, transparent 1.2px)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Subtle Diagonal Aesthetic Accent Line */}
        <div className="absolute -top-24 left-1/4 w-[1px] h-[600px] bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent rotate-12 hidden lg:block" />
        <div className="absolute top-12 right-1/4 w-[1px] h-[700px] bg-gradient-to-b from-transparent via-violet-500/20 to-transparent -rotate-12 hidden lg:block" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Concept Value Prop Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-slate-900/90 border border-slate-800 px-4 py-1.5 shadow-sm mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                HYPER-LOCAL PRODUCT DISCOVERY
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-medium text-emerald-400">
                100% Free • Walk In Today
              </span>
            </div>

            {/* Clear Concept Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.08] mb-6 font-['Outfit']">
              Don’t wait 3 days for delivery.{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-violet-400 to-emerald-400 bg-clip-text text-transparent block sm:inline">
                Find local store stock near you now.
              </span>
            </h1>

            {/* Clear Concept Subtext */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed mb-8">
              Search live shelf inventory in your neighborhood or broadcast a request to local shops. Nearby merchants reply with stock & price in minutes so you can walk in, try it on, and buy today.
            </p>

            {/* Concept Comparison Pill Card (Human-crafted feel) */}
            <div className="mb-8 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 shadow-sm text-left max-w-xl">
              <div className="grid grid-cols-2 gap-4 divide-x divide-slate-100 dark:divide-slate-800">
                <div>
                  <div className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>❌</span> Online E-Commerce
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">3–5 days shipping wait, wrong sizes, return hassles</div>
                </div>
                <div className="pl-4">
                  <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>⚡</span> Zooner Local
                  </div>
                  <div className="text-xs text-slate-900 dark:text-slate-200 font-medium">Instant shop replies, try in store, walk home with it today</div>
                </div>
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <a
                href="#discover"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-7 py-4 text-base font-bold text-white transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/45 hover:-translate-y-0.5"
              >
                <Compass className="h-5 w-5 stroke-[2.2]" />
                <span>Explore Nearby Inventory</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                onClick={onOpenRetailerModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 px-7 py-4 text-base font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
              >
                <Store className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Register Store (0% Commission)</span>
              </button>
            </div>

            {/* Proof Points (Zero Wait, Try In-Store, Real Stocks) */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center">
                  0<span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold ml-1">Days</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Zero shipping wait</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center">
                  100<span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold ml-0.5">%</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Try before you buy</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] flex items-center">
                  Live
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">In-store inventory sync</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Modern Mobile Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Ambient Background Glow behind device */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-violet-500/15 to-transparent rounded-[50px] blur-2xl -z-10" />

            {/* Floating Live Badge Top-Left */}
            <div className="hidden sm:flex absolute -left-6 top-16 z-20 items-center gap-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 p-3 shadow-xl backdrop-blur-md animate-float">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-left pr-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white">In Stock 400m Away</div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">Ready for in-store pickup</div>
              </div>
            </div>

            {/* Floating Premium Sponsored Ad Badge (Timed + Location + Preference) */}
            <div className="hidden sm:flex absolute -right-8 bottom-16 z-20 items-start gap-3 rounded-2xl bg-slate-900/95 border border-indigo-500/40 p-3.5 shadow-2xl backdrop-blur-md animate-float [animation-delay:2s] max-w-[240px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold shrink-0">
                <Tag className="h-4 w-4" />
              </div>
              <div className="text-left pr-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded">
                    👑 Premium Ad
                  </span>
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                    ⏱️ 02h 45m
                  </span>
                </div>
                <div className="text-xs font-bold text-white leading-tight">
                  25% Off Nike Running Shoes
                </div>
                <div className="text-[10px] text-slate-300 mt-1 flex flex-col gap-0.5 font-medium">
                  <span>📍 Matched: 400m from your GPS</span>
                  <span>🎯 Matched: Running Shoes preference</span>
                </div>
              </div>
            </div>

            {/* Realistic Modern Phone Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-[48px] bg-gradient-to-b from-slate-200 dark:from-slate-700 via-slate-300 dark:via-slate-800 to-slate-400 dark:to-slate-950 p-[3px] shadow-2xl shadow-slate-950/20 dark:shadow-indigo-950/40">
              
              {/* Phone Inner Border & Screen */}
              <div className="relative overflow-hidden rounded-[45px] bg-slate-50 dark:bg-[#070A12] border-[6px] border-slate-900 shadow-inner">
                
                {/* Dynamic Island / Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 h-5 w-24 rounded-full bg-slate-950 flex items-center justify-between px-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-800" />
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  </div>
                </div>

                {/* Mobile App Header */}
                <div className="pt-9 pb-3 px-4 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md">
                  {/* Location indicator inside App */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping-slow" />
                      <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        {currentLocation.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">· 3 km radius</span>
                    </div>
                    <button 
                      onClick={onOpenLocationModal}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  {/* App Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="text"
                      readOnly
                      value="Nike running shoes, linen shirt..."
                      className="w-full rounded-xl bg-slate-100 dark:bg-slate-800/90 py-1.5 pl-8 pr-3 text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 focus:outline-none cursor-pointer"
                    />
                  </div>

                  {/* Filter Pills inside App */}
                  <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-1">
                    <button 
                      onClick={() => setActiveHeroTab('all')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors ${
                        activeHeroTab === 'all' 
                          ? 'bg-indigo-600 text-white font-bold' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      All Stores (14)
                    </button>
                    <button 
                      onClick={() => setActiveHeroTab('shoes')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors ${
                        activeHeroTab === 'shoes' 
                          ? 'bg-indigo-600 text-white font-bold' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Shoes & Sports
                    </button>
                    <button 
                      onClick={() => setActiveHeroTab('fashion')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors ${
                        activeHeroTab === 'fashion' 
                          ? 'bg-indigo-600 text-white font-bold' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Men's Shirts
                    </button>
                  </div>
                </div>

                {/* App Content Feed: Local Discovery Feed */}
                <div className="p-3.5 space-y-3 bg-slate-100 dark:bg-[#070A12] max-h-[460px] overflow-y-auto no-scrollbar">
                  
                  {/* Hero Product Card 1: Nike Running Shoe */}
                  <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:border-indigo-500/50 transition-all">
                    <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                      <img 
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" 
                        alt="Nike Air Zoom Pegasus"
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      {/* Distance & Availability Pill */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/30">
                        <MapPin className="h-2.5 w-2.5" />
                        0.4 km away
                      </div>

                      <div className="absolute top-2 right-2 rounded-full bg-slate-950/70 p-1.5 text-slate-300">
                        <Heart className="h-3 w-3" />
                      </div>

                      <div className="absolute bottom-2 left-2 rounded-md bg-indigo-600 text-white px-2 py-0.5 text-[10px] font-black tracking-tight">
                        Available In Store Now
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1">
                          <Store className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                          Apex Footwear & Sports
                        </span>
                        <span className="text-amber-500 font-bold">★ 4.9</span>
                      </div>

                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate mb-2">
                        Nike Air Zoom Pegasus 40 (UK 8, 9, 10)
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2">
                        <div>
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white font-['Outfit']">₹6,499</span>
                          <span className="text-[10px] text-slate-400 line-through ml-1.5">₹8,999</span>
                        </div>
                        <span className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 px-2 py-1 text-[10px] font-bold">
                          Walk-In Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hero Product Card 2: Linen Shirt */}
                  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="flex items-center p-2.5 gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80" 
                        alt="Pure Linen Shirt"
                        className="h-16 w-16 rounded-xl object-cover" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">1.1 km · Race Course</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">3 sizes left</span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                          Pure Linen Mandarin Shirt
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-['Outfit']">₹1,899</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">Thread & Loom</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verified Store Broadcast Strip */}
                  <div className="rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 dark:from-indigo-950/50 dark:to-slate-900 border border-indigo-500/25 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white">
                        <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        3 local shops ready for hold in 15m
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">View →</span>
                  </div>

                </div>

                {/* Bottom App Navigation Bar inside phone */}
                <div className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 px-6 py-2.5 flex items-center justify-around text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center text-indigo-600 dark:text-indigo-400">
                    <Compass className="h-4 w-4" />
                    <span className="text-[9px] font-bold mt-0.5">Explore</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="h-4 w-4" />
                    <span className="text-[9px] mt-0.5">Stores</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap className="h-4 w-4" />
                    <span className="text-[9px] mt-0.5">Request</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Heart className="h-4 w-4" />
                    <span className="text-[9px] mt-0.5">Saved</span>
                  </div>
                </div>

                {/* Phone Home Bar */}
                <div className="bg-white dark:bg-slate-950 pb-2 pt-1 flex justify-center">
                  <div className="h-1 w-28 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

