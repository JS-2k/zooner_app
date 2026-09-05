import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Clock, Search } from 'lucide-react';

export const TheIdea: React.FC = () => {
  const steps = [
    {
      num: '01',
      action: 'Search',
      headline: 'Find what is on the shelf right now.',
      detail: 'Enter what you need. Zooner instantly scans verified inventory across authorized brand stores within 2 km.',
      metric: 'Real-time shelf check',
      icon: Search,
    },
    {
      num: '02',
      action: 'Hold',
      headline: 'Lock it at the counter for 30 minutes.',
      detail: 'Tap Hold. The store manager sets the item aside under your name so nobody else buys it while you walk over.',
      metric: 'Zero deposit · 100% reserved',
      icon: Clock,
    },
    {
      num: '03',
      action: 'Walk In',
      headline: 'Inspect in person. Take it home today.',
      detail: 'Walk in, try on the fit, verify the build quality in person, and pay directly at the store counter.',
      metric: '15-min handoff · Zero return risk',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 px-6 sm:px-8 bg-[#07080B] text-white border-t border-white/10">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header: Minimal & Confident */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-left space-y-3 max-w-xl"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block">
            How It Works
          </span>
          <h2 
            className="font-['Outfit'] font-black tracking-tight text-white leading-[0.98]"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
          >
            Three steps. <br />
            From search to shelf.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed pt-1">
            No shipping wait. No guessing sizes. Just real products in nearby stores.
          </p>
        </motion.div>

        {/* 3-Step Typographic Grid — Pure Typography, No Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 text-left pt-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="space-y-6 border-t border-white/10 pt-8 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Step Number + Category */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tighter">
                      {step.num}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                      {step.action}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-['Outfit'] font-bold text-xl sm:text-2xl text-white leading-snug pt-1">
                    {step.headline}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                    {step.detail}
                  </p>
                </div>

                {/* Sub-metric label */}
                <div className="pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Icon className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                  <span>{step.metric}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

