import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';

interface FinalCTAProps {
  onOpenRetailerModal: () => void;
  onSearchClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onSearchClick }) => {
  return (
    <section className="relative py-32 sm:py-48 px-6 sm:px-8 bg-black text-white border-t border-white/[0.06] overflow-hidden text-center">
      
      {/* Background ambient lighting aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

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
          Stop waiting. <br />
          Find it nearby.
        </h2>

        <p className="text-white/50 text-base sm:text-xl font-normal max-w-lg mx-auto leading-relaxed">
          What you're searching for is already sitting on a shelf in your neighborhood.
        </p>

        {/* One Strong CTA Button with Spring */}
        <div className="pt-4 flex justify-center">
          <motion.button
            onClick={onSearchClick}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-bold text-sm sm:text-base hover:bg-white/95 transition-colors shadow-2xl cursor-pointer"
          >
            <Search className="h-4 w-4 stroke-[2.5]" />
            <span>Search Nearby Stores</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

      </motion.div>
    </section>
  );
};

