import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Store } from 'lucide-react';

interface RetailerCalloutProps {
  onOpenRetailerModal: () => void;
  onNavigateToVendor: () => void;
}

export const RetailerCallout: React.FC<RetailerCalloutProps> = ({
  onNavigateToVendor,
}) => {
  return (
    <section id="merchants" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#06070F] text-white border-t border-slate-800/60 overflow-hidden">
      <div className="orb-3 absolute top-1/2 left-10 w-[550px] h-[550px] bg-purple-950/10 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto text-left relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
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

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed pt-2">
                Thousands of shoppers within 2 km of your store are searching online for items already sitting on your physical shelves. Zooner routes them directly to your billing counter.
              </p>
            </motion.div>

            <ul className="space-y-4 text-sm sm:text-base text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                <span><strong className="text-white font-semibold">Zero hardware setup</strong> � receive and confirm holds from any smartphone or tablet</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                <span><strong className="text-white font-semibold">Direct in-store payments</strong> � customer pays directly at your store POS</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                <span><strong className="text-white font-semibold">No delivery middlemen</strong> � 100% genuine local foot traffic without packaging friction</span>
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
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all cursor-pointer shadow-xl shadow-white/10"
              >
                <Store className="h-4 w-4" />
                <span>Register Your Store</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right: Editorial stats without card boxes */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 space-y-10 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-8 lg:pt-0 lg:pl-12"
          >
            <div>
              <div 
                className="font-['Outfit'] font-black text-white leading-none tracking-tight"
                style={{ fontSize: 'clamp(3.8rem, 8vw, 6.5rem)' }}
              >
                &lt; 2 km
              </div>
              <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
                Average distance between a local customer searching on their phone and the product already in your store.
              </p>
            </div>

            <div className="border-t border-slate-800" />

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="text-emerald-400 font-mono font-bold text-sm shrink-0">01</span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Immediate Hold Confirmation</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Accept holds in 1-tap. Shoppers are given a 30-minute window to walk in.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-emerald-400 font-mono font-bold text-sm shrink-0">02</span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Zero Commission on Walk-Ins</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Keep 100% of your retail margin. No platform deductions at counter checkout.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-emerald-400 font-mono font-bold text-sm shrink-0">03</span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Verified Merchant Network</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Join leading authorized footwear, electronics, and fashion brands in your district.</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
