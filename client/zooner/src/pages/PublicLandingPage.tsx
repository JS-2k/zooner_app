import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Store as StoreIcon,
  Navigation,
  Clock,
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
  // Live ticking countdown for the hero & hold pass demonstration
  const [secondsLeft, setSecondsLeft] = useState(1785); // 29m 45s

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

  // Subtle 3D cursor tilt for hero phone mockup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-white selection:bg-white selection:text-black flex flex-col font-sans">
      
      {/* ── 1. HERO SECTION: Pure Product Positioning ── */}
      <section 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-[94vh] flex flex-col justify-center items-center pt-28 sm:pt-32 pb-20 px-6 sm:px-8 bg-[#070A11] overflow-hidden"
      >
        {/* Subtle Ambient Background Auras */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] sm:w-[950px] h-[480px] bg-gradient-to-b from-indigo-600/20 via-indigo-900/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>The Physical Shopping Engine</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-mono font-bold">iOS & Android</span>
          </motion.div>

          {/* Main Headline: Minimal, confident, punchy */}
          <motion.h1 
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-['Outfit'] font-black tracking-tight text-white leading-[0.93]"
            style={{ fontSize: 'clamp(2.8rem, 8.5vw, 6.2rem)' }}
          >
            Find it nearby. <br />
            Know it's there. <br />
            <span className="text-slate-400">Walk in.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-200 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Search for what you need, see which nearby stores have it, reserve it for 30 minutes, and pick it up yourself.
          </motion.p>

          {/* Primary & Secondary Action CTAs */}
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/90 text-sm font-semibold text-slate-200 transition-all cursor-pointer shadow-sm"
            >
              <StoreIcon className="h-4 w-4 text-slate-400" />
              <span>Explore Local Stores</span>
            </motion.a>
          </motion.div>

          {/* Value Badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs text-slate-300 font-medium"
          >
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2">
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>Free on App Store & Google Play</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-100">Verified Physical Shelves</span>
            </div>
          </motion.div>

          {/* ── 3D Floating Mobile Hardware Mockup ── */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="pt-10 sm:pt-14 max-w-lg mx-auto transform-gpu"
          >
            <div className="relative mx-auto rounded-[46px] p-3 bg-gradient-to-b from-slate-700/40 via-slate-800/60 to-slate-950/80 shadow-[0_25px_80px_rgba(0,0,0,0.85)] border border-slate-700/50">
              
              {/* Outer Phone Shell */}
              <div className="rounded-[38px] bg-[#0A0F1D] border border-slate-800/90 p-5 space-y-4 text-left overflow-hidden shadow-2xl relative">
                
                {/* Simulated Notch / Dynamic Island */}
                <div className="flex items-center justify-between px-2 pt-0.5 pb-2 text-[11px] text-slate-400 font-mono">
                  <span>9:41 AM</span>
                  <div className="h-4.5 w-24 bg-slate-950 rounded-full border border-slate-800 mx-auto flex items-center justify-center gap-2 px-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-300 font-sans">Hold Active</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span>5G</span>
                    <span className="font-bold text-slate-200">100%</span>
                  </div>
                </div>

                {/* Location & Real-Time Query */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <button 
                      onClick={onOpenLocationModal}
                      className="flex items-center gap-1.5 text-slate-200 font-bold hover:text-white transition-colors cursor-pointer"
                    >
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{currentLocation.name}</span>
                    </button>
                    <span className="text-[11px] text-indigo-400 font-medium">18 Stores Nearby</span>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs shadow-inner">
                    <div className="flex items-center gap-2 text-white">
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                      <span className="font-medium">Sony WH-1000XM5 (Silver)</span>
                    </div>
                    <span className="text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
                      In Stock
                    </span>
                  </div>
                </div>

                {/* Simulated Store Match with Live 30-Min Hold */}
                <div className="space-y-2.5">
                  
                  {/* Active Reserved Result */}
                  <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-white">Croma Megastore</h5>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <p className="text-[11px] text-slate-400">Avinashi Road · 450m (5 min walk)</p>
                      </div>
                      <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                        Hold: {formatTimer(secondsLeft)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-sm font-black text-white">₹26,990</span>
                        <span className="text-[10px] text-slate-500 line-through ml-1.5">₹29,990</span>
                      </div>
                      <span className="text-[11px] text-indigo-300 font-medium flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Reserved at Counter
                      </span>
                    </div>
                  </div>

                  {/* Secondary Store Match */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
                    <div>
                      <h5 className="font-bold text-slate-200">Reliance Digital</h5>
                      <p className="text-[11px] text-slate-400">DB Road · 750m away</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-white">₹26,990</span>
                      <span className="block text-[10px] text-emerald-400 font-medium">2 units on shelf</span>
                    </div>
                  </div>
                </div>

                {/* Primary App Action Inside Mockup */}
                <button
                  onClick={onLaunchCustomerApp}
                  className="w-full py-3 rounded-xl bg-white text-slate-950 text-xs font-bold text-center hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Start Exploring on Zooner</span>
                </button>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 2. THE PROBLEM: Why wait 4 days when it's down the street ── */}
      <TheProblem />

      {/* ── 3. HOW IT WORKS: Connected 3-Beat Storytelling ── */}
      <TheIdea />

      {/* ── 4. DEDICATED 30-MINUTE HOLD SPOTLIGHT FEATURE ── */}
      <section id="hold-feature" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#0A0F1D] text-white border-t border-slate-800/80 overflow-hidden">
        
        {/* Ambient emerald backlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-950/15 blur-[150px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto space-y-16 relative z-10">
          
          <div className="text-left max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              03 / Signature Capability
            </span>
            <h2 
              className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)' }}
            >
              Never show up to an empty shelf.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              When you spot what you need, tap <strong>Hold for 30m</strong>. The retailer physically sets the product aside on the billing counter under your name so nobody else buys it while you walk over.
            </p>
          </div>

          {/* Asymmetric Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Main Tactile Hold Pass Ticket (7 Cols) */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#0E1526] border border-slate-700/80 space-y-8 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-3 text-left">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Zero Deposit Required
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                  Guaranteed in-store hold. Pay only after you inspect.
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike online orders where your payment is charged up front, Zooner holds are 100% deposit-free. You only pay at the counter once you’ve personally verified the exact fit, texture, and condition.
                </p>
              </div>

              {/* Digital Pass Card with Live Counter */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-4 text-left shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-white font-mono">HOLD PASS #ZN-8842</span>
                  </div>
                  <span className="text-emerald-300 font-mono font-bold bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {formatTimer(secondsLeft)} remaining
                  </span>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-800">
                  <div className="text-sm font-bold text-white">Nike Air Max 270 (UK 9) · Triple Black</div>
                  <div className="text-xs text-slate-400">Nike Official Store · DB Road Main Promenade</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-300">
                  <span className="text-emerald-400 font-medium">Pickup Desk: Billing Counter 01 ✓</span>
                  <span className="font-bold text-white">₹6,499 (Pay in Store)</span>
                </div>
              </div>
            </motion.div>

            {/* Side Column: 2 Supporting Pillars (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left">
              
              {/* Pillar 1 */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex-1 p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    Physical Assurance
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Real Retail</span>
                </div>
                <h4 className="text-lg font-bold text-white">Reserved at the billing counter</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The store manager physically places the boxed item at the front desk under your name. No customer can take it off the shelf while you travel.
                </p>
              </motion.div>

              {/* Pillar 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                    Turn-By-Turn
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">Live GPS</span>
                </div>
                <h4 className="text-lg font-bold text-white">Guided straight to the store</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Get walking directions, store phone contact, and live operating hours directly in your navigation app with a single tap.
                </p>
              </motion.div>

            </div>

          </div>

        </div>
      </section>

      {/* ── 5. PHYSICAL STORE DIRECTORY & MAP ── */}
      <LocalDiscovery 
        currentLocation={currentLocation}
        onOpenLocationModal={onOpenLocationModal}
      />

      {/* ── 6. RETAILER INVITATION ── */}
      <RetailerCallout
        onOpenRetailerModal={onNavigateToVendor}
        onNavigateToVendor={onNavigateToVendor}
      />

      {/* ── 7. FINAL DOWNLOAD CALL-TO-ACTION ── */}
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

