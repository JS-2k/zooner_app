import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Navigation, Radio, Sparkles } from 'lucide-react';

export const TheIdea: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Ask.',
      tagline: 'Tell Zooner what you need.',
      description: 'Looking for Nike shoes in UK 9, a Titan watch, or a smart lightbulb? Type it once. Your request reaches verified local retailers in your immediate neighborhood.',
      visual: (
        <div className="bg-black/60 border border-white/[0.08] rounded-2xl p-5 text-left space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-white/40">
            <span className="flex items-center gap-1.5 font-mono text-indigo-400">
              <Radio className="h-3 w-3 animate-pulse" />
              Live Shopper Request
            </span>
            <span>RS Puram</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-white">
            "Looking for Nike Air Max 270 (Size UK 9) today."
          </div>
          <div className="text-xs text-white/60 flex items-center gap-2 bg-white/[0.03] p-2 rounded-lg border border-white/[0.04]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>Broadcasting to 6 verified shops within 2 km…</span>
          </div>
        </div>
      ),
    },
    {
      num: '02',
      title: 'Find.',
      tagline: 'Nearby stores respond with availability.',
      description: 'Physical store managers check their live shelf inventory and reply within seconds with direct in-store pricing, exact sizes, and ready hold confirmations.',
      visual: (
        <div className="bg-black/60 border border-white/[0.08] rounded-2xl p-5 text-left space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Nike Store · DB Road
            </span>
            <span className="text-white/40 font-mono">350m · 4 min</span>
          </div>
          <div className="text-sm font-semibold text-white">
            "Yes! 2 pairs in UK 9 in stock. Direct store price ₹6,499."
          </div>
          <div className="text-xs text-emerald-400/90 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Reserved on billing counter for 30m</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-emerald-400">29:54</span>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      title: 'Walk in.',
      tagline: 'Go to the store and take it home.',
      description: 'Walk into the store. Try your exact size, inspect the product with your own hands, and purchase directly. No 3-day delivery wait.',
      visual: (
        <div className="bg-black/60 border border-white/[0.08] rounded-2xl p-5 text-left space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>In-Store Collection</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Ready at Counter
            </span>
          </div>
          <div className="text-sm font-bold text-white">
            Try on, inspect, and take home in minutes.
          </div>
          <div className="text-xs text-white/70 flex items-center justify-between bg-white/[0.03] p-2.5 rounded-lg border border-white/[0.05]">
            <div className="flex items-center gap-2">
              <Navigation className="h-3.5 w-3.5 text-indigo-400" />
              <span>Follow DB Road route (350m)</span>
            </div>
            <span className="text-white/40 font-mono text-[10px]">Open until 9 PM</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative py-28 sm:py-36 px-6 sm:px-8 bg-black text-white border-t border-white/[0.06] overflow-hidden">
      
      {/* Background radial accent */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-indigo-950/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto space-y-20 relative z-10">
        
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-left max-w-2xl space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
            02 / How It Works
          </span>
          <h2 
            className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            The simplest way to shop locally.
          </h2>
          <p className="text-white/60 text-base sm:text-lg">
            Three straightforward beats between you and what’s in your city right now.
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
              className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center border-b border-white/[0.06] pb-16 sm:pb-24 last:border-b-0"
            >
              {/* Text Side */}
              <div className="md:col-span-6 text-left space-y-4">
                <span className="font-mono text-xs font-bold text-white/40">
                  BEAT {step.num}
                </span>
                
                <h3 
                  className="font-['Outfit'] font-black tracking-tight text-white leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)' }}
                >
                  {step.title}
                </h3>

                <p className="text-base sm:text-lg font-medium text-white/90">
                  {step.tagline}
                </p>

                <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>

              {/* Visual Side */}
              <div className="md:col-span-6">
                <motion.div 
                  whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.18)' }}
                  className="rounded-3xl p-6 sm:p-8 bg-white/[0.02] border border-white/[0.08] shadow-2xl transition-all"
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

