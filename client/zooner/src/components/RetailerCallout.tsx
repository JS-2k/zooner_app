import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Store, Bell, Check, Zap } from 'lucide-react';

interface RetailerCalloutProps {
  onOpenRetailerModal: () => void;
  onNavigateToVendor: () => void;
}

export const RetailerCallout: React.FC<RetailerCalloutProps> = ({
  onNavigateToVendor,
}) => {
  return (
    <section id="merchants" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#070A11] text-white border-t border-slate-800/80 overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-10 w-[550px] h-[550px] bg-purple-950/15 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto text-left relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Editorial Proposition */}
          <div className="lg:col-span-6 space-y-8">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block"
            >
              05 / For Physical Retailers
            </motion.span>

            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h2 
                className="font-['Outfit'] font-black tracking-tight text-white leading-[0.98]"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)' }}
              >
                Turn online searchers <br />
                into walk-in customers.
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-2">
                Thousands of shoppers within 2 km of your store are searching online for items already sitting on your physical shelves. Zooner routes them directly to your billing counter.
              </p>
            </motion.div>

            <ul className="space-y-3.5 text-sm text-slate-200">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>Zero hardware setup</strong> — receive and confirm holds from any smartphone or tablet</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>Direct in-store payments</strong> — customer pays directly at your store POS</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span><strong>No delivery middlemen</strong> — 100% genuine local foot traffic without packaging friction</span>
              </li>
            </ul>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center gap-4"
            >
              <motion.button
                onClick={onNavigateToVendor}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer shadow-xl shadow-white/10"
              >
                <Store className="h-4 w-4" />
                <span>Register Your Store</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right: Realistic Merchant Terminal Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="rounded-3xl bg-[#0A0F1E] border border-slate-700/80 p-6 sm:p-7 space-y-5 shadow-2xl relative overflow-hidden">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Store className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Merchant Companion</h4>
                    <p className="text-[11px] text-slate-400">Sneaker Hub · RS Puram Branch</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full font-mono">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Live (14 nearby shoppers)
                </span>
              </div>

              {/* Live Request Notification Slip */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                    <Bell className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Incoming Request (350m away)</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">Just now</span>
                </div>

                <div className="text-sm font-bold text-white">
                  "Nike Air Max 270 (UK 9) - Black"
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800">
                  <span>Price: <strong>₹6,499</strong></span>
                  <span className="text-emerald-400 font-medium">In Stock on Shelf ✓</span>
                </div>

                {/* Instant Merchant Action Button */}
                <div className="pt-1">
                  <div className="py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                    <span>Hold Reserved (30m Counter Hold #ZN-8842)</span>
                  </div>
                </div>
              </div>

              {/* Merchant Status Footer */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-emerald-400" /> Shopper arriving in: <strong>~4 mins</strong>
                </span>
                <span className="text-slate-300 font-mono">Payment: Store POS</span>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};


