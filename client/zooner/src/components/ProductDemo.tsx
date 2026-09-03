import React, { useEffect, useState } from 'react';
import { MapPin, Search, CheckCircle2, Navigation, Star, Clock } from 'lucide-react';

// Zooner Product Demo — animated 4-scene walkthrough like Zomato/Figma-style explainer
const SCENES = [
  {
    id: 'search',
    label: 'Step 1 — Search',
    duration: 2800,
  },
  {
    id: 'ping',
    label: 'Step 2 — Shops pinged',
    duration: 2600,
  },
  {
    id: 'reply',
    label: 'Step 3 — Store replies',
    duration: 2800,
  },
  {
    id: 'walkin',
    label: 'Step 4 — Walk in!',
    duration: 2400,
  },
];

export const ProductDemo: React.FC = () => {
  const [scene, setScene] = useState(0);
  const [typed, setTyped] = useState('');
  const [showPing, setShowPing] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showWalkin, setShowWalkin] = useState(false);

  const searchText = 'Nike Air Max 270...';

  useEffect(() => {
    // Run the scene cycle
    const cycleScene = () => {
      setScene(0);
      setTyped('');
      setShowPing(false);
      setShowReply(false);
      setShowWalkin(false);

      // Scene 0: Typing
      let i = 0;
      const typeInterval = setInterval(() => {
        setTyped(searchText.slice(0, i + 1));
        i++;
        if (i >= searchText.length) clearInterval(typeInterval);
      }, 60);

      // Scene 1: Ping
      const t1 = setTimeout(() => {
        setScene(1);
        setShowPing(true);
      }, SCENES[0].duration);

      // Scene 2: Reply
      const t2 = setTimeout(() => {
        setScene(2);
        setShowReply(true);
      }, SCENES[0].duration + SCENES[1].duration);

      // Scene 3: Walk in
      const t3 = setTimeout(() => {
        setScene(3);
        setShowWalkin(true);
      }, SCENES[0].duration + SCENES[1].duration + SCENES[2].duration);

      return () => {
        clearInterval(typeInterval);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    };

    const cleanup = cycleScene();
    const loopTimer = setInterval(() => {
      if (cleanup) cleanup();
      cycleScene();
    }, SCENES.reduce((a, s) => a + s.duration, 0) + 1200);

    return () => {
      if (cleanup) cleanup();
      clearInterval(loopTimer);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[320px] mx-auto select-none">
      {/* Phone Shell */}
      <div className="relative rounded-[36px] bg-gradient-to-b from-slate-800 to-slate-950 p-[3px] shadow-2xl shadow-black/60">
        <div className="relative rounded-[33px] overflow-hidden bg-[#0C1120] border-[5px] border-slate-900">

          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-24 h-5 bg-black rounded-full" />

          {/* Status Bar */}
          <div className="flex justify-between items-center px-6 pt-10 pb-2 text-[9px] text-slate-400 font-medium">
            <span>9:41</span>
            <span className="text-emerald-400 font-bold text-[8px] tracking-wide">● LIVE</span>
          </div>

          {/* App Header */}
          <div className="px-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[11px] font-black text-white tracking-tight font-['Outfit']">Zooner</div>
                <div className="flex items-center gap-1 text-[9px] text-slate-400">
                  <MapPin className="h-2.5 w-2.5 text-indigo-400" />
                  <span className="text-indigo-400 font-semibold">RS Puram · 3 km radius</span>
                </div>
              </div>
              <div className="h-7 w-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <Navigation className="h-3 w-3 text-indigo-400" />
              </div>
            </div>

            {/* SCENE 0: Search Bar with typing animation */}
            <div className={`relative rounded-xl border transition-all duration-500 ${
              scene === 0
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                : 'border-slate-700/60 bg-slate-800/50'
            }`}>
              <div className="flex items-center gap-2 px-3 py-2">
                <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-200 font-medium">
                  {typed}
                  {scene === 0 && typed.length < searchText.length && (
                    <span className="inline-block w-0.5 h-3 bg-indigo-400 ml-0.5 animate-pulse" />
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* SCENE 1: Shops being pinged */}
          <div className={`px-4 transition-all duration-700 ${showPing ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
            {scene >= 1 && (
              <div className="mb-3">
                <div className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                  Broadcasting to 12 nearby shops...
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Apex Footwear', dist: '0.4 km', color: 'indigo', delay: '0ms' },
                    { name: 'Sprint Sports', dist: '0.9 km', color: 'violet', delay: '150ms' },
                    { name: 'Lifestyle Store', dist: '1.3 km', color: 'blue', delay: '300ms' },
                  ].map((shop) => (
                    <div
                      key={shop.name}
                      className="flex items-center gap-2 rounded-lg bg-slate-800/70 border border-slate-700/50 px-2.5 py-1.5"
                      style={{ animationDelay: shop.delay }}
                    >
                      <div className={`h-2 w-2 rounded-full bg-${shop.color}-500 animate-pulse shrink-0`} />
                      <span className="text-[10px] text-slate-200 font-semibold flex-1">{shop.name}</span>
                      <span className="text-[9px] text-slate-400">{shop.dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SCENE 2: Store replies */}
          <div className={`px-4 transition-all duration-700 ${showReply ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
            {scene >= 2 && (
              <div className="mb-3">
                <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  Shops replied!
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-white">Apex Footwear & Sports</div>
                      <div className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        In stock · UK 8, 9, 10 available
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-black text-white">₹6,499</div>
                      <div className="text-[9px] text-slate-400 flex items-center gap-0.5 justify-end">
                        <Star className="h-2 w-2 text-amber-400 fill-amber-400" />
                        <span>4.9</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-emerald-500/20" />
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-2.5 w-2.5 text-indigo-400" />
                    <span className="text-[9px] text-slate-300">400m away · 5 min walk</span>
                    <span className="ml-auto text-[8px] font-bold text-indigo-400 bg-indigo-500/20 px-1.5 py-0.5 rounded-full">Hold for 30 min</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SCENE 3: Walk in! */}
          <div className={`px-4 pb-4 transition-all duration-700 ${showWalkin ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
            {scene >= 3 && (
              <div className="rounded-xl bg-indigo-600 px-3 py-3 text-center space-y-1">
                <div className="text-sm font-black text-white font-['Outfit']">🎉 Walk in now!</div>
                <div className="flex items-center justify-center gap-1 text-[9px] text-indigo-200">
                  <Clock className="h-2.5 w-2.5" />
                  <span>Reserved for 30 mins · No payment yet</span>
                </div>
              </div>
            )}
          </div>

          {/* Scene Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 pb-3">
            {SCENES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === scene ? 'w-5 bg-indigo-500' : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute -inset-6 bg-indigo-500/15 rounded-full blur-3xl -z-10 pointer-events-none" />
    </div>
  );
};
