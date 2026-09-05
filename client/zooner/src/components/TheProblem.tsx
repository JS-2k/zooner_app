import React from 'react';
import { motion } from 'framer-motion';
import { Minus, CheckCircle2 } from 'lucide-react';

export const TheProblem: React.FC = () => {
  const oldWay = [
    'Refreshing tracking links and waiting 3–5 days for delivery vans',
    'Guessing shoe sizes, fabric texture, or audio comfort from catalog images',
    'Repacking cardboard boxes and waiting a week for return refunds',
  ];

  const zoonerWay = [
    'Know in seconds which nearby authorized store has your exact item in stock',
    'Try it on in person — test audio, fit, and quality before paying anything',
    'Hold it at the billing counter for 30 minutes and walk home with it today',
  ];

  return (
    <section className="relative py-24 sm:py-32 px-6 sm:px-8 bg-[#07080B] text-white border-t border-white/10">
      <div className="max-w-6xl mx-auto relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 max-w-xl mb-14 sm:mb-16 text-left"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block">
            The Difference
          </span>
          <h2
            className="font-['Outfit'] font-black tracking-tight text-white leading-[0.98]"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
          >
            Why wait 4 days for a box <br />
            that's already down the street?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed pt-1">
            Online shopping taught us to accept shipping delays and size guesses. Local stores already have the exact inventory on physical shelves.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] items-start text-left">

          {/* Left Column: Online E-Commerce */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 pr-0 md:pr-14 pb-12 md:pb-0"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-red-400/90 font-bold block">
                Online E-Commerce · 3–5 Days
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-300">
                The delivery & return cycle
              </h3>
            </div>

            <div className="border-t border-slate-800/80" />

            <div className="space-y-6">
              {oldWay.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <Minus className="h-4 w-4 text-red-400/80 mt-1 shrink-0" />
                  <span className="text-slate-400 leading-relaxed text-sm sm:text-base">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-slate-800/50 pt-5">
              <span className="text-xs font-mono text-slate-500">Outcome: 4 days wasted · 30% return risk</span>
            </div>
          </motion.div>

          {/* Hairline vertical divider on desktop */}
          <div className="hidden md:block w-px bg-slate-800/60 self-stretch" />

          {/* Right Column: Zooner Walk-In */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 pl-0 md:pl-14 pt-12 md:pt-0 border-t border-slate-800/60 md:border-t-0"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                Zooner Walk-In · 15 Minutes
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Instant physical verification
              </h3>
            </div>

            <div className="border-t border-slate-800/80" />

            <div className="space-y-6">
              {zoonerWay.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-1 shrink-0" />
                  <span className="text-slate-200 leading-relaxed text-sm sm:text-base">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-slate-800/50 pt-5">
              <span className="text-xs font-mono text-emerald-400/90 font-bold">Outcome: 15 min walk-in · 100% genuine · Zero return hassle</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
