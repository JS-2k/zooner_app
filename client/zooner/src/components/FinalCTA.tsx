import React from 'react';
import { Compass, Store, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onOpenRetailerModal: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenRetailerModal }) => {
  return (
    <section className="relative py-24 md:py-36 bg-[#060911] border-t border-slate-900 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        
        {/* Subtle badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-indigo-500/30 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-6 shadow-inner">
          <Sparkles className="h-3.5 w-3.5" />
          READY TO EXPERIENCE LOCAL DISCOVERY?
        </div>

        {/* Big Headline */}
        <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-6 font-['Outfit']">
          Your next find could be <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">
            just around the corner.
          </span>
        </h2>

        {/* Supporting text */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Discover local products. Discover local stores. Discover what’s near you.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="#discover"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-bold text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/45 hover:-translate-y-0.5"
          >
            <Compass className="h-5 w-5 stroke-[2.2]" />
            <span>Start Discovering</span>
            <ArrowRight className="h-4 w-4" />
          </a>

          <button
            onClick={onOpenRetailerModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-700/90 bg-slate-900/80 px-8 py-4 text-base font-bold text-white hover:bg-slate-800 hover:border-slate-600 transition-all backdrop-blur-sm"
          >
            <Store className="h-5 w-5 text-indigo-400" />
            <span>For Retailers & Vendors →</span>
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <span>Verified Physical Stores Only</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            <span>Real-time In-Stock Inventory</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Zero Shipping Fees or Returns Waiting</span>
          </div>
        </div>

      </div>
    </section>
  );
};
