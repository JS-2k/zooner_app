import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Navigation, ShieldCheck, Lock, ArrowRight } from 'lucide-react';

export const TheIdea: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      num: '01',
      tag: 'Step 01 / Discovery',
      title: 'Search in real time.',
      headline: 'Search what you need right now.',
      description: 'Looking for Nike sneakers in UK 9, Sony noise-canceling headphones, or an urgent USB-C hub? Enter your query once. Zooner instantly scans verified shelf inventory across authorized local stores in your immediate radius.',
      screen: (
        <div className="space-y-6 text-left py-2">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <Search className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="text-white text-base font-medium">Nike Air Max 270 · UK 9</span>
            <span className="ml-auto text-xs font-mono text-emerald-400 font-bold">
              3 Nearby
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-slate-400 border-b border-slate-800 pb-0.5">Within 2 km</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 border-b border-slate-800 pb-0.5">Open Now</span>
            <span className="text-slate-600">·</span>
            <span className="text-indigo-400 font-medium border-b border-indigo-500/30 pb-0.5">Official Dealer</span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between py-3 border-b border-slate-800/60">
              <div>
                <div className="font-bold text-white text-sm">Nike Official Store</div>
                <div className="text-xs text-slate-500 mt-0.5">DB Road · 350m (4 min walk)</div>
              </div>
              <span className="text-emerald-400 font-bold font-mono text-xs">1 pair on shelf</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-800/40">
              <div>
                <div className="font-bold text-slate-400 text-sm">Footprint Athletics</div>
                <div className="text-xs text-slate-600 mt-0.5">Crosscut Road · 800m</div>
              </div>
              <span className="text-slate-500 font-mono text-xs">2 in stock</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Broadcast matched in 0.4s</span>
            </div>
            <span className="font-mono text-slate-500">RS Puram, CBE</span>
          </div>
        </div>
      ),
    },
    {
      num: '02',
      tag: 'Step 02 / Assurance',
      title: 'Hold for 30 minutes.',
      headline: 'Lock the item on the store counter.',
      description: 'Tap "Hold for 30m". The retailer immediately receives your reservation, checks the physical shelf, and locks the item at the billing desk under your name. Zero deposit or pre-payment required.',
      screen: (
        <div className="space-y-6 text-left py-2">
          <div className="space-y-2">
            <div className="font-mono text-emerald-400 font-black tracking-tight" style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', lineHeight: 1 }}>
              29:45
            </div>
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Lock className="h-3 w-3 text-emerald-400" />
              <span>Counter Locked · Hold Remaining</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-white font-bold text-base block">Air Max 270 (Triple Black)</span>
                <span className="text-xs text-slate-400">Nike Official Store · DB Road</span>
              </div>
              <span className="text-sm font-black text-white font-mono">₹6,499</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/60 pt-2">
              <span>Size: UK 9</span>
              <span className="text-emerald-400 font-medium">Pay only at billing counter</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      tag: 'Step 03 / Fulfilment',
      title: 'Walk in & inspect.',
      headline: 'Pick up and inspect in person.',
      description: 'Follow turn-by-turn walking steps to the storefront. Walk straight to the billing counter, test the fit, feel the premium materials, and pay with any payment method. Done in 15 minutes without delivery delays.',
      screen: (
        <div className="space-y-6 text-left py-2">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Navigation className="h-4 w-4 text-indigo-400" />
                <span>4 min walk (350m)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Via DB Road Main Promenade</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold font-mono">Open Now</span>
          </div>

          <div className="border-l-2 border-emerald-500/60 pl-4 py-1 space-y-1">
            <div className="text-xs font-mono text-slate-500 uppercase">Billing Desk 01</div>
            <div className="text-sm font-bold text-white">Item held under your name for inspection</div>
          </div>

          <div className="pt-2 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="h-4 w-4" />
              Verified Authentic
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">All standard store payment options</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#06070F] text-white border-t border-slate-800/60 overflow-hidden">
      <div className="orb-1 absolute top-1/3 left-0 w-[550px] h-[550px] bg-indigo-950/10 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        <div className="text-left max-w-2xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block">
            02 / How Zooner Works
          </span>
          <h2 
            className="font-['Outfit'] font-black tracking-tight text-white leading-[0.98]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.4rem)' }}
          >
            The simplest way to <br />
            shop your neighborhood.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Three seamless beats between needing an item and walking out of the local store with it.
          </p>
        </div>

        {/* Minimal step selector tabs - clean typography underline, no heavy box */}
        <div className="flex border-b border-slate-800 gap-6 sm:gap-12 overflow-x-auto no-scrollbar">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`pb-4 text-left cursor-pointer transition-all relative shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Beat {step.num}
                </div>
                <div className="text-sm sm:text-base font-bold mt-1">
                  {step.title}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeBeatIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dual panel editorial layout without cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-6 text-left space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  {steps[activeStep].tag}
                </span>

                <h3 
                  className="font-['Outfit'] font-black tracking-tight text-white leading-tight"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
                >
                  {steps[activeStep].headline}
                </h3>

                <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg">
                  {steps[activeStep].description}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % 3)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer group"
                  >
                    <span>Next step ({steps[(activeStep + 1) % 3].num})</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-8 lg:pt-0 lg:pl-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {steps[activeStep].screen}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
