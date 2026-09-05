import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ShieldCheck, Store } from 'lucide-react';

interface FinalCTAProps {
  onOpenRetailerModal: () => void;
  onSearchClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onSearchClick, onOpenRetailerModal }) => {
  return (
    <section className="relative py-32 sm:py-44 px-6 sm:px-8 bg-[#06070F] text-white border-t border-slate-800/60 overflow-hidden text-center">
      <div className="orb-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[480px] bg-gradient-to-b from-indigo-600/12 via-indigo-900/5 to-transparent blur-[180px] pointer-events-none rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto space-y-10 relative z-10"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block">
          06 / Immediate Access · iOS & Android
        </span>

        <h2 
          className="font-['Outfit'] font-black tracking-tight text-white leading-[0.93]"
          style={{ fontSize: 'clamp(2.8rem, 8.5vw, 6.4rem)' }}
        >
          Find it nearby. <br />
          Know it's there. <br />
          <span className="text-slate-500">Walk in.</span>
        </h2>

        <p className="text-slate-400 text-base sm:text-xl font-normal max-w-lg mx-auto leading-relaxed">
          Download Zooner and discover physical store inventory in your neighborhood today.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={onSearchClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-white text-slate-950 font-bold text-sm sm:text-base hover:bg-slate-100 transition-all shadow-2xl shadow-white/10 cursor-pointer"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
            <span>Download Zooner</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>

          <motion.button
            onClick={onOpenRetailerModal}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-slate-800 hover:border-slate-700 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Store className="h-4 w-4 text-slate-500" />
            <span>I'm a Store Owner</span>
          </motion.button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs text-slate-500 font-medium">
          <span>iOS & Android</span>
          <span>·</span>
          <span>Zero pre-payment</span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Physical Retail
          </span>
        </div>

      </motion.div>
    </section>
  );
};
