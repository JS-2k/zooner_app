import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Store, Zap, ShieldCheck } from 'lucide-react';

interface RetailerCalloutProps {
  onOpenRetailerModal: () => void;
  onNavigateToVendor: () => void;
}

export const RetailerCallout: React.FC<RetailerCalloutProps> = ({
  onNavigateToVendor,
}) => {
  return (
    <section className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#08080a] text-white border-t border-white/[0.06] overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-10 w-[500px] h-[500px] bg-purple-950/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto text-left space-y-10 relative z-10">
        
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono uppercase tracking-widest text-white/40 block"
        >
          05 / For Merchants
        </motion.span>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <h2 
            className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
          >
            Own a store?
          </h2>

          <p className="text-white/60 text-base sm:text-xl font-normal max-w-xl leading-relaxed">
            Let people nearby discover what you already have on your shelves.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.18)' }}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 transition-colors"
          >
            <div className="h-8 w-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/80">
              <Zap className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-white text-sm">High-Intent Foot Traffic</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Connect directly with shoppers who are ready to walk into your store right now.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.18)' }}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 transition-colors"
          >
            <div className="h-8 w-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/80">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Zero Setup Fees</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Create your digital storefront in minutes. No complex hardware or POS integrations.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.18)' }}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3 transition-colors"
          >
            <div className="h-8 w-8 rounded-xl bg-white/[0.05] flex items-center justify-center text-white/80">
              <Store className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Direct Local Sales</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Answer live product requests and turn nearby searchers into loyal in-person customers.
            </p>
          </motion.div>

        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="pt-4"
        >
          <motion.button
            onClick={onNavigateToVendor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-white/95 transition-colors cursor-pointer shadow-2xl"
          >
            <span>List your store</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};

