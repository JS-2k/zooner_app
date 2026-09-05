import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  MapPin, 
  Store as StoreIcon,
  Navigation,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { TheProblem } from '../components/TheProblem';
import { TheIdea } from '../components/TheIdea';
import { LocalDiscovery } from '../components/LocalDiscovery';
import { RetailerCallout } from '../components/RetailerCallout';
import { FinalCTA } from '../components/FinalCTA';
import { Footer } from '../components/Footer';
import type { LocationArea } from '../types';

interface PublicLandingPageProps {
  currentLocation: LocationArea;
  onOpenLocationModal: () => void;
  onLaunchCustomerApp: () => void;
  onNavigateToVendor: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  currentLocation,
  onOpenLocationModal,
  onLaunchCustomerApp,
  onNavigateToVendor,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(1785);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 1800));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 3D cursor tilt for hero phone mockup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <div className="min-h-screen bg-[#06070F] text-white selection:bg-white selection:text-black flex flex-col font-sans">
      
      {/* ── 1. HERO ── */}
      <section 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-[94vh] flex flex-col justify-center items-center pt-28 sm:pt-32 pb-20 px-6 sm:px-8 bg-[#06070F] overflow-hidden"
      >
        {/* Animated drifting ambient orbs */}
        <div className="orb-1 absolute top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/12 blur-[160px] pointer-events-none rounded-full" />
        <div className="orb-2 absolute top-1/3 left-8 w-[420px] h-[420px] bg-emerald-500/8 blur-[140px] pointer-events-none rounded-full" />
        <div className="orb-3 absolute bottom-12 right-8 w-[500px] h-[500px] bg-blue-700/8 blur-[150px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold"
          >
            The Physical Shopping Engine · iOS &amp; Android
          </motion.p>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-['Outfit'] font-black tracking-tight text-white leading-[0.93]"
            style={{ fontSize: 'clamp(2.8rem, 8.5vw, 6.2rem)' }}
          >
            Find it nearby. <br />
            Know it's there. <br />
            <span className="text-slate-500">Walk in.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-400 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Search for what you need, see which nearby stores have it, reserve it for 30 minutes, and pick it up yourself.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.button
              onClick={onLaunchCustomerApp}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-sm sm:text-base hover:bg-slate-100 transition-all shadow-xl shadow-white/10 cursor-pointer"
            >
              <Download className="h-4 w-4 stroke-[2.5]" />
              <span>Download Zooner</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>

            <motion.a
              href="#stores"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full hover:bg-white/5 border border-slate-800 text-sm font-semibold text-slate-300 transition-all cursor-pointer"
            >
              <StoreIcon className="h-4 w-4 text-slate-500" />
              <span>Explore Local Stores</span>
            </motion.a>
          </motion.div>

          {/* Plain text value props — no card boxes */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-500 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5 text-slate-600" />
              Free on App Store &amp; Google Play
            </span>
            <span className="text-slate-700">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Verified Physical Shelves
            </span>
            <span className="text-slate-700">·</span>
            <span>Zero deposit · Pay in store</span>
          </motion.div>

          {/* ── 3D Floating Mobile Hardware Mockup ── */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="pt-10 sm:pt-14 max-w-[340px] mx-auto transform-gpu animate-float"
          >
            {/* Phone chassis — this is hardware, NOT a card */}
            <div className="relative mx-auto rounded-[46px] p-[3px] bg-gradient-to-b from-slate-600/50 via-slate-700/40 to-slate-900/60 shadow-[0_30px_100px_rgba(0,0,0,0.9)]">
              <div className="rounded-[43px] bg-[#08090E] border border-slate-800/60 p-5 space-y-4 text-left overflow-hidden relative">
                
                {/* Dynamic Island */}
                <div className="flex items-center justify-between px-1 pt-0.5 pb-1 text-[11px] text-slate-500 font-mono">
                  <span>9:41</span>
                  <div className="h-5 w-24 bg-black rounded-full border border-slate-800/80 mx-auto flex items-center justify-center gap-2 px-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-300">Hold Active</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span>5G</span>
                    <span className="font-bold text-slate-300">100%</span>
                  </div>
                </div>

                {/* Location + search — no card box, just a clean row */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <button 
                      onClick={onOpenLocationModal}
                      className="flex items-center gap-1.5 text-slate-200 font-bold hover:text-white transition-colors cursor-pointer"
                    >
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{currentLocation.name}</span>
                    </button>
                    <span className="text-[11px] text-indigo-400 font-medium">18 Stores</span>
                  </div>

                  {/* Search — minimal underline style */}
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
                    <span className="text-white font-medium">Sony WH-1000XM5 (Silver)</span>
                    <span className="ml-auto text-emerald-400 font-bold font-mono">In Stock</span>
                  </div>
                </div>

                {/* Store results — no card borders, just divider rows */}
                <div className="space-y-0">
                  {/* Active hold row — left accent line, not a card */}
                  <div className="flex items-start gap-3 py-3 border-b border-slate-800/60 border-l-2 border-l-emerald-500/60 pl-3 -ml-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">Croma Megastore</span>
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Avinashi Rd · 450m</p>
                      <p className="text-sm font-black text-white mt-1">₹26,990</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                        {formatTimer(secondsLeft)}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-1">
                        <Lock className="h-2.5 w-2.5" /> Held
                      </span>
                    </div>
                  </div>

                  {/* Second result row */}
                  <div className="flex items-center justify-between py-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-400">Reliance Digital</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">DB Road · 750m</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-400">₹26,990</span>
                      <p className="text-[10px] text-emerald-500 mt-0.5">2 in stock</p>
                    </div>
                  </div>
                </div>

                {/* CTA inside mockup */}
                <button
                  onClick={onLaunchCustomerApp}
                  className="w-full py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold text-center hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Start Exploring on Zooner</span>
                </button>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 2. THE PROBLEM ── */}
      <TheProblem />

      {/* ── 3. HOW IT WORKS ── */}
      <TheIdea />

      {/* ── 4. 30-MINUTE HOLD SPOTLIGHT — Editorial, No Cards ── */}
      <section id="hold-feature" className="relative py-28 sm:py-40 px-6 sm:px-8 bg-[#06070F] text-white overflow-hidden">
        
        {/* Subtle emerald ambient backlight */}
        <div className="orb-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-950/12 blur-[180px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto relative z-10">
          
          <div className="border-t border-slate-800/60 pt-16 sm:pt-20 space-y-16">

            {/* Section label + headline */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5 max-w-3xl"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-500 font-bold block">
                03 / Signature Capability
              </span>
              <h2 
                className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
              >
                Never show up to an empty shelf.
              </h2>
              <p className="text-slate-400 text-base sm:text-xl leading-relaxed max-w-2xl">
                When you spot what you need, tap <strong className="text-white">Hold for 30m</strong>. The retailer physically sets the product aside at the billing counter under your name so nobody else buys it while you walk over.
              </p>
            </motion.div>

            {/* Giant live countdown — the visual anchor, no card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <div className="flex items-baseline gap-3">
                <span 
                  className="font-mono font-black text-emerald-400 tabular-nums leading-none"
                  style={{ fontSize: 'clamp(4.5rem, 14vw, 9rem)' }}
                >
                  {formatTimer(secondsLeft)}
                </span>
                <span className="text-slate-600 font-mono text-sm uppercase tracking-widest self-end pb-3">remaining</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-white font-bold text-base sm:text-lg">Hold Pass #ZN-8842 · Nike Air Max 270 (UK 9) · Triple Black</p>
                <p className="text-slate-500 text-sm font-mono">Nike Official Store · DB Road Main Promenade · Billing Counter 01</p>
                <p className="text-slate-600 text-xs mt-2">Zero deposit · Pay only after you inspect in store</p>
              </div>
            </motion.div>

            {/* Two feature points — left-border accent, no card boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4">
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="border-l-2 border-emerald-500/50 pl-6 space-y-2"
              >
                <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest font-bold block">Physical Assurance</span>
                <h4 className="text-lg font-bold text-white">Reserved at the billing counter</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The store manager physically places the boxed item at the front desk under your name. No customer can take it while you walk over.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="border-l-2 border-indigo-500/50 pl-6 space-y-2"
              >
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold block">Turn-By-Turn · Live GPS</span>
                <h4 className="text-lg font-bold text-white">Guided straight to the store</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Get walking directions, store contact, and live operating hours directly in your navigation app with a single tap.
                </p>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 5. PHYSICAL STORE DIRECTORY ── */}
      <LocalDiscovery 
        currentLocation={currentLocation}
        onOpenLocationModal={onOpenLocationModal}
      />

      {/* ── 6. RETAILER INVITATION ── */}
      <RetailerCallout
        onOpenRetailerModal={onNavigateToVendor}
        onNavigateToVendor={onNavigateToVendor}
      />

      {/* ── 7. FINAL CTA ── */}
      <FinalCTA
        onOpenRetailerModal={onNavigateToVendor}
        onSearchClick={onLaunchCustomerApp}
      />

      {/* ── 8. FOOTER ── */}
      <Footer
        onOpenRetailerModal={onNavigateToVendor}
        onOpenLocationModal={onOpenLocationModal}
      />

    </div>
  );
};
