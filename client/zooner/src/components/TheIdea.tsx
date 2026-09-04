import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Phone, Navigation, ShieldCheck } from 'lucide-react';

export const TheIdea: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Ask.',
      tagline: 'Search what you need right now.',
      description: 'Looking for Nike sneakers in UK 9, a Sony headset, or an urgent charger? Search once. Zooner queries real-time shelf inventory across authorized physical stores in your neighborhood.',
      visual: (
        <div className="bg-[#0E1526] border border-slate-700/80 rounded-3xl p-6 text-left space-y-4 shadow-2xl">
          {/* Simulated In-App Search Bar */}
          <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 shadow-inner">
            <Search className="h-4 w-4 text-indigo-400 shrink-0" />
            <span className="text-white text-sm font-medium">Nike Air Max 270 · UK 9</span>
            <span className="ml-auto text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
              Nearby
            </span>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-medium">
              Within 2 km
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-medium">
              Open Now
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-medium">
              Official Dealer
            </span>
          </div>

          {/* Real-time Broadcast Status */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Matching against 6 stores in RS Puram</span>
            </div>
            <span className="font-mono text-slate-400 font-medium">0.4s</span>
          </div>
        </div>
      ),
    },
    {
      num: '02',
      title: 'Hold.',
      tagline: 'Lock the item on the store counter.',
      description: 'The store manager confirms shelf stock and reserves the product under your name for 30 minutes. You get guaranteed availability before walking out of your house.',
      visual: (
        <div className="bg-[#0E1526] border border-slate-700/80 rounded-3xl p-6 text-left space-y-4 shadow-2xl relative overflow-hidden">
          {/* Reservation Ticket Header */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 block">
                STORE HOLD PASS
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">Nike Official Store</h4>
              <p className="text-xs text-slate-400">DB Road, RS Puram · 350m away</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
              Active Hold
            </span>
          </div>

          {/* Reserved Item Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-200 font-medium">Air Max 270 (Black / White)</span>
              <span className="font-mono font-bold text-white">Size: UK 9</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/60">
              <span className="text-slate-400">Direct In-Store Price</span>
              <span className="text-base font-black text-white">₹6,499</span>
            </div>
          </div>

          {/* Countdown & Safety Guarantee */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
              <Clock className="h-3.5 w-3.5" />
              <span>29:45 remaining</span>
            </div>
            <span className="text-slate-400 text-[11px]">No pre-payment required</span>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      title: 'Walk in.',
      tagline: 'Pick up and inspect in person.',
      description: 'Follow turn-by-turn walking navigation. Walk into the store, try your exact fit, feel the genuine materials, and pay directly at the counter. Done in 15 minutes.',
      visual: (
        <div className="bg-[#0E1526] border border-slate-700/80 rounded-3xl p-6 text-left space-y-4 shadow-2xl">
          {/* Navigation & Store Access */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Navigation className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">4 min walk (350m)</h4>
                <p className="text-[11px] text-slate-400">Via DB Road Main Promenade</p>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              Open until 9 PM
            </span>
          </div>

          {/* Counter Collection Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400">Pickup Counter</span>
              <div className="text-xs font-bold text-white">Show pass at Billing Desk 01</div>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>Ready</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button className="flex-1 py-2 rounded-xl bg-white text-slate-950 text-xs font-bold text-center hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
              <MapPin className="h-3 w-3" />
              <span>Open in Maps</span>
            </button>
            <button className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>Call Store</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#070A11] text-white border-t border-slate-800/80 overflow-hidden">
      
      {/* Background radial accent */}
      <div className="absolute top-1/3 left-0 w-[550px] h-[550px] bg-indigo-950/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto space-y-20 relative z-10">
        
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-left max-w-2xl space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block">
            02 / How It Works
          </span>
          <h2 
            className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            The simplest way to shop locally.
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Three straightforward steps between you and what’s in your city right now.
          </p>
        </motion.div>

        {/* 3 Generous Cinematic Beats */}
        <div className="space-y-16 sm:space-y-24">
          {steps.map((step, idx) => (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center border-b border-slate-800/80 pb-16 sm:pb-24 last:border-b-0"
            >
              {/* Text Side */}
              <div className="md:col-span-6 text-left space-y-4">
                <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-full">
                  BEAT {step.num}
                </span>
                
                <h3 
                  className="font-['Outfit'] font-black tracking-tight text-white leading-none pt-1"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)' }}
                >
                  {step.title}
                </h3>

                <p className="text-base sm:text-lg font-bold text-white">
                  {step.tagline}
                </p>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>

              {/* Visual Side */}
              <div className="md:col-span-6">
                <motion.div 
                  whileHover={{ y: -3 }}
                  className="rounded-3xl transition-all"
                >
                  {step.visual}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

