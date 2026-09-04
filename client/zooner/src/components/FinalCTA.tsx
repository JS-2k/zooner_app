import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ShieldCheck } from 'lucide-react';

interface FinalCTAProps {
  onOpenRetailerModal: () => void;
  onSearchClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onSearchClick }) => {
  return (
    <section className="relative py-32 sm:py-48 px-6 sm:px-8 bg-[#0B101D] text-white border-t border-slate-800/80 overflow-hidden text-center">
      
      {/* Background ambient lighting aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto space-y-10 relative z-10"
      >
        
        {/* Massive, confident headline */}
        <h2 
          className="font-['Outfit'] font-black tracking-tighter text-white leading-[0.95]"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
        >
          Find it nearby. <br />
          Know it's there. <br />
          <span className="text-slate-400">Walk in.</span>
        </h2>

        <p className="text-slate-200 text-base sm:text-xl font-normal max-w-lg mx-auto leading-relaxed">
          Download Zooner and start discovering real shelf inventory in your neighborhood today.
        </p>

        {/* Primary Download Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={onSearchClick}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-white text-slate-950 font-bold text-sm sm:text-base hover:bg-slate-100 transition-colors shadow-2xl shadow-white/10 cursor-pointer"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
            <span>Download Zooner</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Badges */}
        <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400 font-medium">
          <span>iOS & Android</span>
          <span>·</span>
          <span>Zero pre-payment</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Retail
          </span>
        </div>

      </motion.div>
    </section>
  );
};

