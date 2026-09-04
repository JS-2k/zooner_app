import React from 'react';
import { motion } from 'framer-motion';
import { PackageX, Store, Clock, Zap } from 'lucide-react';

export const TheProblem: React.FC = () => {
  return (
    <section className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#0B101D] text-white border-t border-slate-800/80 overflow-hidden">
      
      {/* Background radial gradient */}
      <div className="absolute top-1/2 right-0 w-[550px] h-[550px] bg-red-950/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-emerald-950/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto text-left space-y-12 relative z-10">
        
        {/* Editorial Subtitle */}
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block"
        >
          01 / The Problem
        </motion.span>

        {/* Massive Headline */}
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
        >
          Sometimes tomorrow <br />
          isn't good enough.
        </motion.h2>

        {/* Narrative Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 text-slate-200 text-base sm:text-lg leading-relaxed pt-2"
        >
          <p className="md:col-span-6 font-normal">
            Online shopping taught us to wait 3 to 5 days for a cardboard box. We accept delivery delays, wrong sizes, and return hassles as normal.
          </p>
          <p className="md:col-span-6 font-normal text-white">
            Yet, in every neighborhood, physical retail stores already have the shoes, watches, electronics, and clothes sitting ready on their shelves. You just need to know who has it in stock.
          </p>
        </motion.div>

        {/* Two-Way Comparison Statement with Spring Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          
          {/* Card 1: Old Way */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -4, borderColor: 'rgba(239,68,68,0.3)' }}
            className="p-6 sm:p-7 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 transition-colors relative overflow-hidden group shadow-lg"
          >
            <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
              <div className="flex items-center gap-2">
                <PackageX className="h-4 w-4 text-red-400" />
                <span className="font-semibold text-slate-300">Online E-Commerce</span>
              </div>
              <span className="flex items-center gap-1 text-red-400 font-bold">
                <Clock className="h-3 w-3" /> 72–120 hrs
              </span>
            </div>

            <div>
              <div className="text-xl font-bold text-slate-200">3 to 5 Days Waiting</div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Tracking numbers, shipping delays, wrong sizes, and repacking for return courier pickups.
              </p>
            </div>

            {/* Delay Progress Timeline */}
            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500/60 h-full w-[25%] rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono font-medium">
                <span>Ordered</span>
                <span>In Transit…</span>
                <span>Day 4</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Zooner Way */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ y: -4, borderColor: 'rgba(16,185,129,0.5)', boxShadow: '0 10px 30px -10px rgba(16,185,129,0.25)' }}
            className="p-6 sm:p-7 rounded-2xl bg-slate-800/90 border border-emerald-500/40 space-y-4 transition-all relative overflow-hidden group shadow-xl shadow-emerald-950/20"
          >
            <div className="flex items-center justify-between text-xs font-mono uppercase">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Store className="h-4 w-4" />
                <span>With Zooner</span>
              </div>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Zap className="h-3 w-3" /> 10–20 mins
              </span>
            </div>

            <div>
              <div className="text-xl font-bold text-white">Walk In & Take It Home Today</div>
              <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                Verified nearby stock, 4-minute walk, inspect with your own hands, try your exact fit.
              </p>
            </div>

            {/* Instant Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                  className="bg-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.9)]" 
                />
              </div>
              <div className="flex justify-between text-[10px] text-emerald-300 font-mono font-bold">
                <span>Ping Store</span>
                <span>Verified Stock</span>
                <span>Picked Up ✓</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

