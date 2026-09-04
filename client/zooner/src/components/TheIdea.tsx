import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Phone, Navigation, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export const TheIdea: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-progress through steps every 6 seconds if user hasn't clicked
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
      badge: 'Live Shelf Scan',
      badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/60',
      screen: (
        <div className="bg-[#0A0F1E] border border-slate-700/80 rounded-3xl p-6 text-left space-y-4 shadow-2xl">
          {/* Simulated In-App Search Bar */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-700 rounded-2xl px-4 py-3 shadow-inner">
            <Search className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="text-white text-sm font-medium">Nike Air Max 270 · UK 9</span>
            <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              3 Nearby
            </span>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-200 font-medium">
              Within 2 km
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-200 font-medium">
              Open Now
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-medium">
              Official Dealer
            </span>
          </div>

          {/* Results Broadcast */}
          <div className="space-y-2 pt-1">
            <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Nike Official Store</div>
                <div className="text-[11px] text-slate-400">DB Road · 350m (4 min walk)</div>
              </div>
              <span className="text-emerald-400 font-bold font-mono">1 pair on shelf</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-300">Footprint Athletics</div>
                <div className="text-[11px] text-slate-500">Crosscut Road · 800m</div>
              </div>
              <span className="text-slate-400 font-mono">2 in stock</span>
            </div>
          </div>

          {/* Real-time Broadcast Status */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Broadcast matched in 0.4s</span>
            </div>
            <span className="font-mono text-slate-400 font-medium text-[11px]">RS Puram, CBE</span>
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
      badge: 'Zero Pre-Payment',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/60',
      screen: (
        <div className="bg-[#0A0F1E] border border-emerald-500/40 rounded-3xl p-6 text-left space-y-4 shadow-2xl relative overflow-hidden">
          {/* Reservation Ticket Header */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
                OFFICIAL STORE PASS
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">Nike Official Store</h4>
              <p className="text-xs text-slate-400">DB Road, RS Puram · 350m away</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Lock className="h-3 w-3" />
              Counter Locked
            </span>
          </div>

          {/* Reserved Item Summary */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-bold">Air Max 270 (Triple Black)</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">Size: UK 9</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400">Store Direct Price</span>
              <span className="text-base font-black text-white">₹6,499</span>
            </div>
          </div>

          {/* Countdown & Safety Guarantee */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
              <Clock className="h-3.5 w-3.5" />
              <span>29:45 remaining</span>
            </div>
            <span className="text-slate-400 text-[11px]">Pay at billing counter</span>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      tag: 'Step 03 / Fulfilment',
      title: 'Walk in & try it on.',
      headline: 'Pick up and inspect in person.',
      description: 'Follow turn-by-turn walking steps to the storefront. Walk straight to the billing counter, test the fit, feel the premium materials, and pay with any payment method. Done in 15 minutes without delivery delays.',
      badge: 'Instant Hand-off',
      badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/60',
      screen: (
        <div className="bg-[#0A0F1E] border border-slate-700/80 rounded-3xl p-6 text-left space-y-4 shadow-2xl">
          {/* Navigation Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">4 min walk (350m)</h4>
                <p className="text-[11px] text-slate-400">Via DB Road Main Promenade</p>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              Open Now
            </span>
          </div>

          {/* Counter Collection Badge */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400">Pickup Counter</span>
              <div className="text-xs font-bold text-white">Show pass at Billing Desk 01</div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <ShieldCheck className="h-4 w-4" />
              <span>Ready for Inspection</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button className="flex-1 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold text-center hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
              <MapPin className="h-3.5 w-3.5" />
              <span>Open Walking Directions</span>
            </button>
            <button className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer">
              <Phone className="h-3.5 w-3.5" />
              <span>Call Store</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#070A11] text-white border-t border-slate-800/80 overflow-hidden">
      
      {/* Background radial accent */}
      <div className="absolute top-1/3 left-0 w-[550px] h-[550px] bg-indigo-950/15 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Editorial Header */}
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
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Three seamless beats between needing an item and walking out of the local store with it.
          </p>
        </div>

        {/* Step Progress Timeline Bar */}
        <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl max-w-2xl">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`py-3 px-3 sm:px-4 rounded-xl text-left transition-all cursor-pointer relative overflow-hidden ${
                  isActive 
                    ? 'bg-white text-slate-950 shadow-md font-bold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider block">
                    Beat {step.num}
                  </span>
                  {isActive && <CheckCircle2 className="h-3.5 w-3.5 text-slate-950 shrink-0" />}
                </div>
                <div className="text-xs sm:text-sm font-bold truncate mt-0.5">
                  {step.title.split('.')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Dual-Panel Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Step Description */}
          <div className="lg:col-span-6 text-left space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold border ${steps[activeStep].badgeColor}`}>
                  {steps[activeStep].tag}
                </span>

                <h3 
                  className="font-['Outfit'] font-black tracking-tight text-white leading-none"
                  style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}
                >
                  {steps[activeStep].headline}
                </h3>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg">
                  {steps[activeStep].description}
                </p>

                {/* Step controls */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % 3)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    <span>Next step ({steps[(activeStep + 1) % 3].num})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Evolving Live Interactive Mockup */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.4 }}
                className="relative"
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


