import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, MapPin, ShieldCheck, ArrowRight, Store, Radio, UserCheck } from 'lucide-react';
import { LocalDiscovery } from '../components/LocalDiscovery';
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
  onNavigateToVendor
}) => {
  const [seconds, setSeconds] = useState(1787);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-300, 300], [6, -6]), { stiffness: 180, damping: 24 });
  const rotateY = useSpring(useTransform(pointerX, [-300, 300], [-6, 6]), { stiffness: 180, damping: 24 });

  useEffect(() => {
    const interval = window.setInterval(() => setSeconds(value => value > 0 ? value - 1 : 1800), 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div className="flex min-h-screen flex-col bg-[#07080B] font-sans text-white selection:bg-emerald-400 selection:text-black">
      
      {/* ── 1. HERO SECTION (High-Tech 3D Phone Showcase) ── */}
      <section 
        onMouseMove={event => {
          const rect = event.currentTarget.getBoundingClientRect();
          pointerX.set(event.clientX - rect.left - rect.width / 2);
          pointerY.set(event.clientY - rect.top - rect.height / 2);
        }}
        onMouseLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
        className="relative isolate min-h-screen overflow-hidden bg-[#07080B] px-6 pt-32 pb-20 sm:px-8 lg:pt-36 border-b border-white/10"
      >
        {/* Glow Effects */}
        <div className="pointer-events-none absolute left-1/4 top-20 h-[38rem] w-[38rem] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute right-10 top-40 h-[32rem] w-[32rem] rounded-full bg-teal-500/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Headlines & Action CTAs */}
          <div className="relative z-10 lg:col-span-7 space-y-8 text-left">
            
            {/* Live GPS Chip */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-xs font-mono text-emerald-400 backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold uppercase tracking-wider">Live Hyperlocal Radar</span>
              <span className="text-slate-400">· {currentLocation.name || 'RS Puram, Coimbatore'}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 24 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1, duration: 0.75 }} 
              className="font-['Outfit'] text-[clamp(3.2rem,6.8vw,6.4rem)] font-black leading-[0.92] tracking-tight text-white"
            >
              Real Stock.<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Verified Nearby.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 18 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.65 }} 
              className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              Discover products on nearby physical store shelves in real time. Know they are available, hold them at the counter for 30 minutes with zero deposit, and pick them up today.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.6 }} 
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={onLaunchCustomerApp} 
                className="flex items-center gap-3 rounded-full bg-emerald-400 hover:bg-emerald-300 px-7 py-4 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-400/25 transition-all cursor-pointer"
              >
                <Play className="h-5 w-5 fill-slate-950 text-slate-950" />
                <span>Launch Customer App</span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={onNavigateToVendor} 
                className="flex items-center gap-2.5 rounded-full border border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-md px-6 py-4 text-white text-sm font-semibold transition-all cursor-pointer"
              >
                <Store className="h-4.5 w-4.5 text-emerald-400" />
                <span>Store Portal</span>
              </motion.button>
            </motion.div>

            {/* Location selector link */}
            <div className="pt-4 flex items-center gap-3 text-xs font-mono text-slate-400">
              <button 
                onClick={onOpenLocationModal}
                className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <span>Searching near {currentLocation.name || 'RS Puram'}</span>
                <span className="text-emerald-400 font-bold">· 42 Stores Active</span>
              </button>
            </div>

          </div>

          {/* Right Column: Floating 3D Device Frame with Generated High-Res Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} 
            style={{ rotateX, rotateY, perspective: 1400 }} 
            className="relative z-10 lg:col-span-5 flex items-center justify-center"
          >
            <div className="relative w-full max-w-[420px] aspect-[9/16] rounded-[2.5rem] border border-white/20 bg-[#0B0C11] p-3 shadow-2xl shadow-emerald-500/10 overflow-hidden group">
              
              {/* Generated Image Asset */}
              <img 
                src="/images/app_hero_mockup.jpg" 
                alt="Zooner App Interface" 
                className="w-full h-full object-cover rounded-[2rem] group-hover:scale-105 transition-transform duration-700" 
              />

              {/* Floating Overlay Badge: Live Hold Pass */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/20 space-y-2 shadow-2xl text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Hold Pass
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-extrabold">{mins}:{secs}</span>
                </div>

                <div className="text-sm font-bold text-white">Nike Air Max 270 (UK 9)</div>
                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Nike Store · DB Road</span>
                  <span className="font-mono text-emerald-400 font-bold">₹6,499</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 2. FEATURE SHOWCASE (Shopper Counter Pickup Lifestyle Photo) ── */}
      <section className="py-24 px-6 sm:px-8 border-b border-white/10 bg-[#0A0C12] relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
            <img 
              src="/images/shopper_pickup.jpg" 
              alt="Shopper picking up reserved product"
              className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 text-left space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                Instant Counter Pickup
              </span>
              <p className="text-sm text-white font-medium">
                Reserve on your phone $\rightarrow$ Walk into the store $\rightarrow$ Inspect &amp; pay at the counter.
              </p>
            </div>
          </div>

          {/* Right Column: Value Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              Why Shoppers Love Zooner
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white leading-tight">
              No delivery waits.<br />No out-of-stock surprises.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Why wait 3 days for shipping or drive around town blindly? Zooner gives you instant visibility into physical inventory around your exact location.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">100% Zero Deposit Holds</h4>
                  <p className="text-xs text-slate-400">Reserve any item at the store counter for 30 minutes without paying anything upfront.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Radio className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Merchant Ask (Live Radar)</h4>
                  <p className="text-xs text-slate-400">Can't find a specific size or variant? Broadcast your ask to verified stores within 5 km.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Try Before You Buy</h4>
                  <p className="text-xs text-slate-400">Walk in, touch, try on, and verify the quality in person before making your purchase.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onLaunchCustomerApp}
                className="px-6 py-3.5 rounded-full bg-white text-slate-950 text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Launch Customer App</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. RETAILER OS SHOWCASE (Merchant Owner Lifestyle Photo) ── */}
      <section className="py-24 px-6 sm:px-8 border-b border-white/10 bg-[#07080B] relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          {/* Left Column: Text & Stats */}
          <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
            <span className="text-xs font-mono uppercase tracking-widest text-teal-400 font-bold block">
              For Local Retail Store Owners
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white leading-tight">
              Turn Nearby Online Searches Into In-Store Foot Traffic.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Stop losing local customers to online e-commerce giants. List your physical store inventory or respond to live shopper requests within your neighborhood.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#0B0C11] border border-white/10 space-y-1">
                <div className="text-2xl font-black text-emerald-400 font-['Outfit']">+35%</div>
                <div className="text-xs font-bold text-white">Higher Counter Traffic</div>
                <div className="text-[11px] text-slate-400">Shoppers walking in with active hold passes.</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0C11] border border-white/10 space-y-1">
                <div className="text-2xl font-black text-teal-400 font-['Outfit']">&lt; 30s</div>
                <div className="text-xs font-bold text-white">Instant Request Replies</div>
                <div className="text-[11px] text-slate-400">Confirm stock from your phone in 1 tap.</div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onNavigateToVendor}
                className="px-6 py-3.5 rounded-full border border-teal-400/40 text-teal-400 hover:bg-teal-400/10 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Store className="h-4 w-4" />
                <span>Open Merchant Store Portal</span>
              </button>
            </div>

          </div>

          {/* Right Column: Merchant Image */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group order-1 lg:order-2">
            <img 
              src="/images/merchant_owner.jpg" 
              alt="Retail Store Owner holding phone"
              className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 text-left space-y-1">
              <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider block">
                Zooner Merchant OS
              </span>
              <p className="text-sm text-white font-medium">
                Empowering physical store owners to capture digital intent in real-time.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. LIVE NEARBY DISCOVERY VISUALIZER ── */}
      <LocalDiscovery 
        currentLocation={currentLocation} 
        onOpenLocationModal={onOpenLocationModal} 
        onNavigateToVendor={onNavigateToVendor} 
      />

      {/* ── 5. FOOTER ── */}
      <Footer 
        onOpenRetailerModal={onNavigateToVendor} 
        onOpenLocationModal={onOpenLocationModal} 
      />

    </div>
  );
};
