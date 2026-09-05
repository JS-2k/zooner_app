import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ShieldCheck, Store } from 'lucide-react';

interface FinalCTAProps {
  onOpenRetailerModal: () => void;
  onSearchClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onSearchClick, onOpenRetailerModal }) => {
  return (
    <section className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#07080B] text-white border-t border-white/10 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto space-y-8 relative z-10"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block">
          Get Started · iOS & Android
        </span>

        <h2 
          className="font-['Outfit'] font-black tracking-tight text-white leading-[0.93]"
          style={{ fontSize: 'clamp(2.8rem, 8.5vw, 6.4rem)' }}
        >
          Find it nearby. <br />
          Know it's there. <br />
          <span className="text-slate-500">Walk in.</span>
        </h2>

        <p className="text-slate-400 text-base sm:text-lg font-normal max-w-lg mx-auto leading-relaxed">
          Download Zooner and explore verified store inventory in your neighborhood today.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={onSearchClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-white text-slate-950 font-bold text-sm sm:text-base hover:bg-slate-200 transition-all shadow-xl shadow-white/5 cursor-pointer"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
            <span>Download Zooner</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>

          <motion.button
            onClick={onOpenRetailerModal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/10 hover:border-white/20 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Store className="h-4 w-4 text-slate-400" />
            <span>I'm a Store Owner</span>
          </motion.button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs text-slate-500 font-medium">
          <span>iOS & Android</span>
          <span>·</span>
          <span>Zero pre-payment</span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-300" /> Verified Physical Retail
          </span>
        </div>

      </motion.div>
    </section>
  );
};
