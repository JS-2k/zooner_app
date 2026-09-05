import React from 'react';
import { motion } from 'framer-motion';

export const TheProblem: React.FC = () => {
  const oldWay = [
    'Refreshing tracking links and waiting 3-5 days for delivery vans',
    'Guessing shoe sizes, fabric texture, or audio comfort from catalog images',
    'Repacking cardboard boxes and waiting a week for return refunds',
  ];

  const zoonerWay = [
    'Know in seconds which nearby authorized store has your exact item in stock',
    'Try it on in person � test audio, fit, and quality before paying anything',
    'Hold it at the billing counter for 30 minutes and walk home with it today',
  ];

  return (
    <section className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#06070F] text-white overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-950/5 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-950/6 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="space-y-5 max-w-2xl mb-16 sm:mb-20"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block">
            01 / The Friction
          </span>
          <h2
            className="font-['Outfit'] font-black tracking-tight text-white leading-[0.98]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.4rem)' }}
          >
            Why wait 4 days for a box <br />
            that is already down the street?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Online retail taught us to treat delays, wrong sizes, and return hassles as inevitable. Yet authorized brand stores near you already have the exact stock waiting on physical shelves.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] items-start">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="space-y-8 pr-0 md:pr-14 pb-12 md:pb-0"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold block">
                Online E-Commerce 3-5 Days
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-300">
                The delivery and return cycle
              </h3>
            </div>

            <div className="border-t border-slate-800/80" />

            <div className="space-y-7">
              {oldWay.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <span className="text-red-500 font-bold text-base leading-none mt-0.5 shrink-0">-</span>
                  <span className="text-slate-400 leading-relaxed text-sm sm:text-base">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-slate-800/50 pt-5">
              <span className="text-xs font-mono text-slate-600">Outcome: 4 days wasted 30% return risk</span>
            </div>
          </motion.div>

          <div className="hidden md:block w-px bg-slate-800/60 self-stretch" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-8 pl-0 md:pl-14 pt-12 md:pt-0 border-t border-slate-800/60 md:border-t-0"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-bold block">
                Zooner Walk-In 15 Minutes
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Instant physical verification
              </h3>
            </div>

            <div className="border-t border-slate-800/80" />

            <div className="space-y-7">
              {zoonerWay.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <span className="text-emerald-500 font-bold text-base leading-none mt-0.5 shrink-0">+</span>
                  <span className="text-slate-200 leading-relaxed text-sm sm:text-base">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-slate-800/50 pt-5">
              <span className="text-xs font-mono text-emerald-500/70 font-bold">Outcome: 15 min walk-in 100% genuine Zero return hassle</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
