import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import type { LocationArea } from '../types';

interface HeroProps {
  currentLocation: LocationArea;
  onOpenRetailerModal: () => void;
  onOpenLocationModal: () => void;
  onSearchSubmit: (query: string) => void;
}

const PLACEHOLDERS = [
  'Nike Air Max 90 (UK 9)',
  'Sony WH-1000XM5 Black',
  'Titan Edge Ceramic Watch',
  'Philips Smart Hue Bulbs',
  'Zara Linen Overshirt (M)',
  'MacBook Pro 16-inch M3'
];

export const Hero: React.FC<HeroProps> = ({
  currentLocation,
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  // Cycle animated placeholder every 3.2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setMousePos({ x, y });
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-28 pb-20 px-6 sm:px-8 bg-black text-white selection:bg-white selection:text-black overflow-hidden">
      
      {/* Subtle PlayStation / Apple Ambient Background Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* ── 1. MAIN HEADLINE & EDITORIAL VOICE ── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto text-center space-y-6 relative z-10"
      >
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-['Outfit'] font-black tracking-tighter text-white leading-[0.95]"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.2rem)' }}
        >
          Find it. Nearby.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/60 text-base sm:text-xl font-normal max-w-xl mx-auto leading-relaxed"
        >
          Find products at local stores, check real-time availability, and walk in today.
        </motion.p>

        {/* ── 2. PRIMARY SEARCH INPUT (Apple Spotlight / PlayStation Console style) ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4 max-w-2xl mx-auto w-full"
        >
          <form 
            onSubmit={handleSubmit}
            className="group relative flex items-center bg-white/[0.06] hover:bg-white/[0.09] focus-within:bg-white/[0.1] border border-white/[0.14] focus-within:border-white/50 rounded-full p-2 pl-6 transition-all duration-300 shadow-2xl backdrop-blur-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.06)]"
          >
            <Search className="h-5 w-5 text-white/40 group-focus-within:text-white transition-colors shrink-0 mr-3" />
            
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-white text-sm sm:text-base font-normal focus:outline-none z-10"
              />
              
              {!query && (
                <div className="absolute inset-0 flex items-center pointer-events-none text-white/40 text-sm sm:text-base overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="truncate text-left"
                    >
                      Search for <span className="text-white/70">"{PLACEHOLDERS[placeholderIndex]}"</span>
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white text-black hover:bg-white/95 transition-colors shrink-0 cursor-pointer shadow-lg ml-2"
              aria-label="Search Nearby"
            >
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </motion.button>
          </form>

          {/* Minimal Search Category Suggestions with stagger hover */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <span className="text-xs text-white/40 font-medium mr-1">Try:</span>
            {[
              'Nike Air Max (UK 9)',
              'Titan Edge Watch',
              'Philips Smart Hue',
              'iPhone 16 Pro',
              'Linen Shirt'
            ].map(item => (
              <motion.button
                key={item}
                type="button"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleChipClick(item)}
                className="text-xs text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/20 rounded-full px-3 py-1 transition-colors cursor-pointer font-medium"
              >
                {item}
              </motion.button>
            ))}
          </div>
        </motion.div>

      </motion.div>

      {/* ── 3. LARGE HERO VISUAL: PHYSICAL SHOPPING SHOWCASE (With 3D Parallax & Radar Pulse) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl mx-auto pt-14 sm:pt-20 perspective-[1000px]"
      >
        <motion.div 
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringCard(true)}
          onMouseLeave={() => {
            setIsHoveringCard(false);
            setMousePos({ x: 0, y: 0 });
          }}
          animate={{
            rotateX: isHoveringCard ? mousePos.y : 0,
            rotateY: isHoveringCard ? mousePos.x : 0,
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent p-6 sm:p-10 backdrop-blur-md shadow-2xl transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,255,255,0.05)]"
        >
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Product Image on Real Shelf */}
            <div className="md:col-span-6 relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-white/[0.08] group">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85" 
                alt="Nike Shoe in Local Store"
                className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              
              {/* Pulsing Sonar Ping on Shoe Location */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-white/90">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Verified In Stock</span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-white/95 text-sm">Nike Air Max 270</span>
                <span className="text-white/70">Size UK 9 · ₹6,499</span>
              </div>
            </div>

            {/* Right: Local Physical Store Walk-in Match */}
            <div className="md:col-span-6 text-left space-y-5">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/50 uppercase tracking-widest">
                  <span className="flex items-center gap-1 text-emerald-400 font-mono">
                    <MapPin className="h-3 w-3" />
                    <span>350m AWAY</span>
                  </span>
                  <span>·</span>
                  <span className="text-white/80">{currentLocation.name || 'RS Puram, Coimbatore'}</span>
                </div>

                <h3 className="font-['Outfit'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Nike Store · DB Road
                </h3>

                <p className="text-sm text-white/60 leading-relaxed">
                  4-minute walk from you. 2 pairs verified in stock and reserved at the billing counter right now.
                </p>
              </div>

              {/* Verified Walk-In Card with Subtle Lift */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white/[0.04] border border-white/[0.09] hover:border-white/20 rounded-2xl p-4 space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>2 Pairs Ready in UK 9</span>
                  </div>
                  <span className="text-white/40">Direct Store Price</span>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-white/[0.06]">
                  <div>
                    <span className="text-2xl font-black text-white">₹6,499</span>
                    <span className="text-xs text-white/40 line-through ml-2">₹7,995</span>
                  </div>
                  <div className="text-xs text-emerald-400/90 font-medium">
                    Hold active for 30 mins
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center gap-4 pt-1">
                <motion.a
                  href="#request"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-black bg-white hover:bg-white/95 px-5 py-2.5 rounded-full transition-colors shadow-lg cursor-pointer"
                >
                  <span>Try Asking Nearby</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.a>
                <span className="text-xs text-white/40 hidden sm:inline">
                  Zero delivery wait. Walk in today.
                </span>
              </div>

            </div>

          </div>

        </motion.div>
      </motion.div>

    </section>
  );
};

