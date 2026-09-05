import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  MapPin, 
  Navigation,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { TheIdea } from '../components/TheIdea';
import { TheProblem } from '../components/TheProblem';
import { LocalDiscovery } from '../components/LocalDiscovery';
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
    <div className="min-h-screen bg-[#07080B] text-[#EDEDED] selection:bg-white selection:text-black flex flex-col font-sans">
      
      {/* ── HERO SECTION ── */}
      <section 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-[92vh] flex flex-col justify-center items-center pt-28 sm:pt-32 pb-20 px-6 sm:px-8 bg-[#07080B] overflow-hidden"
      >
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Subtle Label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold"
          >
            Physical Store Inventory · iOS &amp; Android
          </motion.p>

          {/* Main Typographic Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-['Outfit'] font-black tracking-tight text-white leading-[0.93]"
            style={{ fontSize: 'clamp(2.8rem, 8.5vw, 6.2rem)' }}
          >
            Find it nearby. <br />
            Know it's there. <br />
            <span className="text-slate-500">Walk in.</span>
          </motion.h1>

          {/* Concise 1-sentence subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-400 text-base sm:text-xl font-normal max-w-xl mx-auto leading-relaxed"
          >
            Search verified shelf inventory in nearby stores, reserve what you need for 30 minutes, and pick it up today.
          </motion.p>

          {/* Clean Action Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center pt-2"
          >
            <motion.button
              onClick={onLaunchCustomerApp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full bg-white text-slate-950 font-bold text-sm sm:text-base hover:bg-slate-200 transition-all cursor-pointer shadow-lg shadow-white/5"
            >
              <Download className="h-4 w-4 stroke-[2.5]" />
              <span>Download Zooner</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>

          {/* Value Props - Clean Inline Text */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-500 font-medium"
          >
            <span>Free on App Store &amp; Google Play</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400">Verified Physical Shelves</span>
            <span className="text-slate-700">·</span>
            <span>Zero Deposit</span>
          </motion.div>

          {/* Phone Hardware Mockup — Clean & Minimal */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="pt-8 sm:pt-12 max-w-[340px] mx-auto transform-gpu animate-float"
          >
            <div className="relative mx-auto rounded-[46px] p-[2px] bg-white/10 shadow-2xl">
              <div className="rounded-[44px] bg-[#0C0D12] border border-white/5 p-5 space-y-4 text-left overflow-hidden relative">
                
                {/* Hardware Header */}
                <div className="flex items-center justify-between px-1 pt-0.5 pb-1 text-[11px] text-slate-500 font-mono">
                  <span>9:41</span>
                  <div className="h-4.5 w-22 bg-black rounded-full border border-white/10 mx-auto flex items-center justify-center gap-1.5 px-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-bold text-slate-300">Held 30m</span>
                  </div>
                  <span className="font-bold text-slate-400 text-[10px]">5G</span>
                </div>

                {/* Location + Query */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <button 
                      onClick={onOpenLocationModal}
                      className="flex items-center gap-1.5 text-slate-300 font-semibold hover:text-white transition-colors cursor-pointer"
                    >
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{currentLocation.name}</span>
                    </button>
                    <span className="text-[11px] text-slate-500 font-mono">18 Stores</span>
                  </div>

                  <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs">
                    <span className="text-white font-medium">Sony WH-1000XM5</span>
                    <span className="ml-auto text-emerald-400 font-bold font-mono text-[11px]">In Stock</span>
                  </div>
                </div>

                {/* Store Results Rows */}
                <div className="space-y-0">
                  <div className="flex items-start gap-3 py-3 border-b border-white/10">
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
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-1 justify-end">
                        <Lock className="h-2.5 w-2.5" /> Held
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-400">Reliance Digital</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">DB Road · 750m</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-400">₹26,990</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">2 on shelf</p>
                    </div>
                  </div>
                </div>

                {/* Inner button */}
                <button
                  onClick={onLaunchCustomerApp}
                  className="w-full py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold text-center hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Start Exploring</span>
                </button>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 01. THREE STEPS: HOW ZOONER WORKS ── */}
      <TheIdea />

      {/* ── 02. THE DIFFERENCE: WHY LOCAL MATTERS ── */}
      <TheProblem />

      {/* ── 03. STORES: DISCOVERY, DIRECTORY & MERCHANT ACCESS ── */}
      <LocalDiscovery 
        currentLocation={currentLocation}
        onOpenLocationModal={onOpenLocationModal}
        onNavigateToVendor={onNavigateToVendor}
      />

      {/* ── 04. FINAL CTA ── */}
      <FinalCTA
        onOpenRetailerModal={onNavigateToVendor}
        onSearchClick={onLaunchCustomerApp}
      />

      {/* ── FOOTER ── */}
      <Footer
        onOpenRetailerModal={onNavigateToVendor}
        onOpenLocationModal={onOpenLocationModal}
      />

    </div>
  );
};
