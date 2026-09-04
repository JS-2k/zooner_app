import React from 'react';
import { motion } from 'framer-motion';

export const TheProblem: React.FC = () => {
  return (
    <section className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#0A0E1A] text-white border-t border-slate-800/80 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-0 w-[550px] h-[550px] bg-red-950/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-emerald-950/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto text-left space-y-14 relative z-10">
        
        {/* Editorial Subtitle */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="space-y-4 max-w-2xl"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block">
            01 / The Friction
          </span>
          <h2 
            className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
          >
            Why wait 4 days for a box <br />
            that's already down the street?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-1">
            Online retail taught us to treat delivery delays, wrong sizes, and return hassles as inevitable. Yet in every neighborhood, authorized brand stores already have the stock waiting.
          </p>
        </motion.div>

        {/* High-Craft Contrast Columns (No AI-trope cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Column 1: The E-Commerce Delivery Loop */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="p-8 sm:p-10 rounded-3xl bg-slate-900/50 border border-slate-800/90 space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 bg-red-950/50 border border-red-500/30 px-3 py-1 rounded-full">
                Online E-Commerce
              </span>
              <span className="text-xs font-mono text-slate-400">3–5 Days</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-100">
              The delivery cycle
            </h3>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-base leading-none">✕</span>
                <span>Refreshing tracking links and waiting for delivery slots</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-base leading-none">✕</span>
                <span>Guessing shoe sizes or fabric textures from catalog images</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-base leading-none">✕</span>
                <span>Repacking cardboard boxes and waiting days for return refunds</span>
              </li>
            </ul>
          </motion.div>

          {/* Column 2: The Zooner Experience */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 to-[#0F1D2F] border border-emerald-500/40 space-y-6 shadow-2xl shadow-emerald-950/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full">
                Zooner In-Store
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">10–20 Mins</span>
            </div>

            <h3 className="text-2xl font-bold text-white">
              Instant physical pickup
            </h3>

            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold text-base leading-none">✓</span>
                <span>Know in seconds which nearby shop has your exact size on shelf</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold text-base leading-none">✓</span>
                <span>Try it on in person, test the fit, and inspect before purchasing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold text-base leading-none">✓</span>
                <span>Hold at the counter for 30 minutes and walk home with it today</span>
              </li>
            </ul>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

