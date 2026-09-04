import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Navigation, 
  ArrowRight, 
  ArrowLeft, 
  MapPin
} from 'lucide-react';

interface StepData {
  stepNumber: string;
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  cardPreview: React.ReactNode;
}

export const ProductStepSlider: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 3 Core Steps of the LocalLive / Zooner Concept
  const steps: StepData[] = [
    {
      stepNumber: '01',
      badge: 'Step 1: Ask Near You',
      badgeColor: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
      title: 'Post what you need in plain words',
      description: 'Looking for Nike Air Max 270 (UK 9), a Titan watch, or cold-brew beans? Type it once. We broadcast your request to all verified physical stores in your 2 km radius.',
      cardPreview: (
        <div className="space-y-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          {/* Customer Request Bubble */}
          <div className="flex items-start gap-3 bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shrink-0 shadow-md">
              S
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Surya · Shopper</span>
                <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> RS Puram (2 km radius)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                "Does any store nearby have <span className="text-indigo-300 font-bold">Nike Air Max 270 (Size UK 9)</span> in stock right now?"
              </p>
            </div>
          </div>

          {/* Broadcast Status Indicator */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-[11px] text-indigo-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              <span>Broadcasting to <strong>6 verified local shoe stores</strong>…</span>
            </div>
            <span className="font-mono text-[10px] text-indigo-400">Live Ping</span>
          </div>
        </div>
      ),
    },
    {
      stepNumber: '02',
      badge: 'Step 2: Real-Time Replies',
      badgeColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      title: 'Store managers confirm stock in < 60s',
      description: 'Physical retailers nearby check their shelf inventory and reply with live availability, direct in-store price, and photos. No outdated catalog data.',
      cardPreview: (
        <div className="space-y-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          {/* Store Live Response Card */}
          <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  ✔
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Nike Store (DB Road)</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-slate-400">42, DB Road, RS Puram</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/80 border border-emerald-500/50 px-2 py-0.5 rounded-full">
                🟢 2 pairs in stock
              </span>
            </div>

            {/* Price & Offer */}
            <div className="flex items-center justify-between pt-1 border-t border-emerald-900/60 text-left">
              <div>
                <span className="text-xs text-slate-400">Direct In-Store Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-white">₹6,499</span>
                  <span className="text-xs text-slate-400 line-through">₹7,995</span>
                  <span className="text-[10px] text-emerald-400 font-bold">18% OFF</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Walk Time</span>
                <div className="text-xs font-bold text-slate-200">🚶 350m · 4 mins</div>
              </div>
            </div>

            {/* Merchant Live Quote */}
            <p className="text-[11px] text-emerald-200/90 italic bg-emerald-950/90 p-2 rounded-lg border border-emerald-900/60 text-left">
              "We have UK 9 in both Black and White. Reserved 1 pair for 30 minutes under your name!"
            </p>
          </div>
        </div>
      ),
    },
    {
      stepNumber: '03',
      badge: 'Step 3: Instant Walk-In',
      badgeColor: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      title: 'Walk in, try it on, take it home today',
      description: 'The store holds your item for 30–60 minutes. Walk in, inspect the item in person, try your exact size, and purchase instantly with zero 3-day shipping wait.',
      cardPreview: (
        <div className="space-y-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          {/* Reservation Pass Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700">
              <div className="flex items-center gap-2 text-left">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-white">30-Min Hold Pass Active</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                PASS #ZN-8492
              </span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80" 
                alt="Nike Shoe"
                className="h-14 w-14 rounded-lg object-cover border border-slate-700 shrink-0"
              />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white">Nike Air Max 270 (UK 9)</h4>
                <p className="text-[11px] text-slate-400">At counter · Ready for trial</p>
                <p className="text-[11px] text-emerald-400 font-semibold">📍 Nike Store · 42 DB Road</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700 text-xs">
              <span className="text-slate-400">Walking Direction:</span>
              <span className="text-indigo-400 font-bold flex items-center gap-1">
                <Navigation className="h-3 w-3" /> Turn right onto DB Road (350m)
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Auto slide ticker (every 5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [isPaused, steps.length]);

  return (
    <div 
      className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/95 via-slate-950 to-[#050914] p-5 sm:p-7 shadow-2xl backdrop-blur-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── STEP TABS / NAVIGATION HEADER ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 pb-6 border-b border-slate-800/80">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          return (
            <button
              key={step.stepNumber}
              onClick={() => setActiveStep(idx)}
              className={`flex flex-col text-left p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer relative overflow-hidden ${
                isActive 
                  ? 'bg-slate-800/90 border border-indigo-500/50 shadow-lg' 
                  : 'bg-slate-900/50 border border-slate-800/60 hover:bg-slate-800/40 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Progress Line */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-400 to-emerald-400 animate-pulse" />
              )}
              
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                  Step {step.stepNumber}
                </span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                )}
              </div>
              <span className={`text-xs sm:text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {idx === 0 ? '1. Ask Item' : idx === 1 ? '2. Live Stock Reply' : '3. Walk In & Buy'}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── MAIN SLIDE CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6">
        
        {/* Left Side: Step Narrative & Explanation */}
        <div className="lg:col-span-6 text-left space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${steps[activeStep].badgeColor}`}>
              {steps[activeStep].badge}
            </span>
          </div>

          <h3 className="font-['Outfit'] font-extrabold text-xl sm:text-2xl text-white leading-tight">
            {steps[activeStep].title}
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {steps[activeStep].description}
          </p>

          {/* Key Advantages Checklist for active step */}
          <div className="pt-2 space-y-2 border-t border-slate-800/80">
            {activeStep === 0 && (
              <>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span>Works for shoes, gadgets, clothes, food & medicines</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span>No need to browse 50 static online catalogs</span>
                </div>
              </>
            )}

            {activeStep === 1 && (
              <>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Verified physical stores only (Nike, Titan, Philips, etc.)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Live discount and exact on-shelf stock count</span>
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>30–60 minute hold pass guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Inspect & try before paying — zero return hassles</span>
                </div>
              </>
            )}
          </div>

          {/* Navigation Prev / Next Controls */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setActiveStep(prev => (prev - 1 + steps.length) % steps.length)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Previous Step"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveStep(prev => (prev + 1) % steps.length)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              <span>{activeStep === 2 ? 'Restart Walkthrough' : 'Next Step'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs text-slate-500 ml-2">
              {activeStep + 1} of 3
            </span>
          </div>
        </div>

        {/* Right Side: Visual Card Preview for the Step */}
        <div className="lg:col-span-6">
          {steps[activeStep].cardPreview}
        </div>

      </div>

    </div>
  );
};
