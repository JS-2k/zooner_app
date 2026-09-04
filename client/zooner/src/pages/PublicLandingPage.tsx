import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
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
    <div className="min-h-screen bg-[#070A11] text-white selection:bg-white selection:text-black flex flex-col">
      
      {/* ── 1. PUBLIC MARKETING HERO: Target Positioning & App Download ── */}
      <section className="relative min-h-[92vh] flex flex-col justify-center items-center pt-28 pb-20 px-6 sm:px-8 bg-[#070A11] overflow-hidden">
        
        {/* Ambient PlayStation / Apple Deep Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-500/25 via-purple-500/15 to-transparent blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-blue-500/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/90 text-xs font-semibold text-slate-200 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>The Physical Shopping Engine</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400 font-mono font-bold">iOS & Android</span>
          </motion.div>

          {/* Main Headline: Pure, confident positioning */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-['Outfit'] font-black tracking-tighter text-white leading-[0.94]"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6.2rem)' }}
          >
            Find it nearby. <br />
            Know it's there. <br />
            <span className="text-slate-400">Walk in.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-200 text-base sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Search for what you need, see which nearby stores have it, reserve it for 30 minutes, and pick it up yourself.
          </motion.p>

          {/* CTAs: Primary App Download & Store Discovery */}
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-sm font-semibold text-slate-100 transition-all cursor-pointer shadow-sm"
            >
              <StoreIcon className="h-4 w-4 text-slate-300" />
              <span>Explore Local Stores</span>
            </motion.a>
          </motion.div>

          {/* App Store / Google Play Badges Preview */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-300 font-medium"
          >
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2">
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>Free on iOS & Android</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-100">Verified Physical Shelves</span>
            </div>
          </motion.div>

          {/* ── Mobile App Showcase Mockup (Real Hardware & Native App UI) ── */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pt-12 sm:pt-16 max-w-4xl mx-auto"
          >
            <div className="relative mx-auto rounded-[44px] p-2.5 bg-gradient-to-b from-indigo-500/30 via-slate-700/40 to-slate-900/60 shadow-[0_30px_100px_rgba(0,0,0,0.85)] max-w-sm sm:max-w-md">
              <div className="rounded-[36px] bg-[#0E1526] border border-slate-700/80 p-5 space-y-4 text-left overflow-hidden shadow-2xl">
                
                {/* Simulated Phone Notch / Dynamic Island */}
                <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-800/80 text-[11px] text-slate-400 font-mono">
                  <span>9:41 AM</span>
                  <div className="h-4 w-20 bg-slate-950 rounded-full border border-slate-800 mx-auto flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span>5G</span>
                    <span className="font-bold text-slate-200">100%</span>
                  </div>
                </div>

                {/* App Location & Search Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-200 font-bold">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{currentLocation.name}</span>
                    </div>
                    <span className="text-[11px] text-indigo-400 font-medium">18 Stores Nearby</span>
                  </div>

                  <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3 flex items-center justify-between text-xs shadow-inner">
                    <div className="flex items-center gap-2 text-white">
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                      <span className="font-medium">Sony WH-1000XM5 (Silver)</span>
                    </div>
                    <span className="text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
                      In Stock
                    </span>
                  </div>
                </div>

                {/* Simulated Real Store Cards Inside App */}
                <div className="space-y-2.5">
                  {/* Result 1: Active Hold */}
                  <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <h5 className="font-bold text-white">Croma Megastore</h5>
                        <p className="text-[11px] text-slate-400">Avinashi Road · 450m (5 min walk)</p>
                      </div>
                      <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                        Hold: 29:45
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/60">
                      <div>
                        <span className="text-sm font-black text-white">₹26,990</span>
                        <span className="text-[10px] text-slate-400 line-through ml-1.5">₹29,990</span>
                      </div>
                      <span className="text-[11px] text-indigo-300 font-medium">Reserved at Counter</span>
                    </div>
                  </div>

                  {/* Result 2: Secondary Store */}
                  <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
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

                {/* App CTA Inside Mockup */}
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

      {/* ── 2. THE PROBLEM (Why wait 3-5 days for delivery) ── */}
      <TheProblem />

      {/* ── 3. HOW IT WORKS (01. Search -> 02. Hold -> 03. Walk In) ── */}
      <TheIdea />

      {/* ── 4. DEDICATED 30-MINUTE HOLD SPOTLIGHT FEATURE ── */}
      <section id="hold-feature" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#0A0F1D] text-white border-t border-slate-800/80 overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-16">
          
          <div className="text-left max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              03 / Signature Feature
            </span>
            <h2 
              className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              Never show up to an empty shelf.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              When you spot what you need, tap <strong>Hold for 30m</strong>. The retailer sets it aside on the billing counter under your name so nobody else buys it while you walk over.
            </p>
          </div>

          {/* Asymmetric Product Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Main Feature: Live Local Shelf Matching (7 Cols) */}
            <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#0E1526] border border-slate-700/80 space-y-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Zero Deposit Required
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                  Guaranteed in-store hold. Pay only after you inspect.
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike online orders where money is debited immediately, Zooner holds are 100% deposit-free. You only pay at the counter once you’ve verified the exact fit and condition.
                </p>
              </div>

              {/* Digital Pass Preview */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Hold Pass #ZN-8842</span>
                  <span className="text-emerald-300 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                    29:45 remaining
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-700/60">
                  <span>Nike Official Store · DB Road</span>
                  <span className="text-emerald-400 font-medium">Billing Desk 01 ✓</span>
                </div>
              </div>
            </div>

            {/* Side Column: 2 Stacked Capabilities (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Feature 2: 30-Min Counter Hold */}
              <div className="flex-1 p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    Physical Assurance
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Real Retail</span>
                </div>
                <h4 className="text-lg font-bold text-white">Reserved at the billing counter</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The store manager checks the live stockroom and physically places the item at the pickup desk.
                </p>
              </div>

              {/* Feature 3: Walking Navigation */}
              <div className="flex-1 p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                    Turn-By-Turn
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">Live GPS</span>
                </div>
                <h4 className="text-lg font-bold text-white">Guided straight to the store</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Turn-by-turn walking steps, direct store telephone contact, and live closing times.
                </p>
              </div>

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
