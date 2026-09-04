import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Smartphone, 
  Download, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Sparkles, 
  Clock, 
  Store as StoreIcon,
  Navigation
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
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col">
      
      {/* ── 1. PUBLIC MARKETING HERO: Discover Zooner & App Download ── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center pt-28 pb-20 px-6 sm:px-8 bg-black overflow-hidden">
        
        {/* Ambient PlayStation / Apple Deep Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-semibold text-white/80"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>The Physical Shopping Engine</span>
            <span className="text-white/30">·</span>
            <span className="text-emerald-400 font-mono">Mobile App</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-['Outfit'] font-black tracking-tighter text-white leading-[0.94]"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6.2rem)' }}
          >
            Find what's on the shelf. <br />
            <span className="text-white/40">Walk in today.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/60 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Zooner connects you directly with physical stores in your city. Check real-time shelf inventory, hold items for 30 minutes, and pick them up in person.
          </motion.p>

          {/* CTAs: Primary App Launch & Store Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.button
              onClick={onLaunchCustomerApp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-black font-bold text-sm sm:text-base hover:bg-white/95 transition-all shadow-2xl cursor-pointer"
            >
              <Smartphone className="h-4 w-4 stroke-[2.5]" />
              <span>Launch Customer Web App</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>

            <motion.button
              onClick={onNavigateToVendor}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.12] text-sm font-semibold text-white transition-all cursor-pointer"
            >
              <StoreIcon className="h-4 w-4 text-white/70" />
              <span>Are You a Store Owner?</span>
            </motion.button>
          </motion.div>

          {/* App Store / Google Play Badges Preview */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex items-center justify-center gap-6 pt-2 text-xs text-white/40 font-medium"
          >
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2">
              <Download className="h-3.5 w-3.5 text-white/50" />
              <span>iOS & Android Ready</span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Verified Store Stock Only</span>
            </div>
          </motion.div>

          {/* ── Mobile App Showcase Mockup (Hardware Framing) ── */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pt-12 sm:pt-16 max-w-4xl mx-auto"
          >
            <div className="relative mx-auto rounded-[38px] p-2 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_30px_100px_rgba(0,0,0,0.9)] max-w-sm sm:max-w-md">
              <div className="rounded-[32px] bg-[#09090b] border border-white/10 p-5 space-y-4 text-left overflow-hidden">
                
                {/* Simulated App Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">ZOONER APP</div>
                    <div className="text-sm font-bold text-white flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-400" />
                      <span>{currentLocation.name}</span>
                    </div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                {/* Simulated Search */}
                <div className="bg-white/[0.06] border border-white/[0.1] rounded-2xl p-3 flex items-center justify-between text-xs">
                  <span className="text-white/80 font-medium">"Nike Air Max 90 UK 9"</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded text-[10px]">In Stock</span>
                </div>

                {/* Simulated Store Match Result */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Nike Store · DB Road</span>
                    <span className="text-white/40 font-mono">350m (4 min)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-base font-black text-white">₹6,499</span>
                      <span className="text-[10px] text-white/40 line-through ml-1.5">₹7,995</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg font-semibold">
                      Hold for 30m Active ✓
                    </span>
                  </div>
                </div>

                {/* App CTA Inside Mockup */}
                <button
                  onClick={onLaunchCustomerApp}
                  className="w-full py-2.5 rounded-xl bg-white text-black text-xs font-bold text-center hover:bg-white/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="h-3 w-3" />
                  <span>Start Exploring on Zooner App</span>
                </button>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── 2. THE PROBLEM (Why wait 3-5 days for delivery) ── */}
      <TheProblem />

      {/* ── 3. HOW IT WORKS (01. Ask -> 02. Find -> 03. Walk In) ── */}
      <TheIdea />

      {/* ── 4. APP FEATURE MATRIX ── */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#08080a] text-white border-t border-white/[0.06] overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-16">
          
          <div className="text-left max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
              03 / Mobile Experience
            </span>
            <h2 
              className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              Built for speed. <br />
              Made for your city.
            </h2>
            <p className="text-white/60 text-base sm:text-lg">
              Everything in Zooner is designed to get you the product in your hands within minutes, not days.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-white text-base">Instant Availability</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Know immediately if the shoe size or gadget is on the shelf before leaving your house.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-white text-base">30-Min Counter Hold</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Reserve the item at the counter under your name so nobody else buys it while you're walking.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <Navigation className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-white text-base">Walking Directions</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Turn-by-turn routing directly to the shop entrance with direct store phone contact.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-white text-base">Verified Physical Retail</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Only genuine physical authorized brand dealers and top neighborhood boutiques.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── 5. PHYSICAL STORE DIRECTORY PREVIEW ── */}
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
