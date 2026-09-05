import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Store, UserCheck, ShieldCheck, Compass } from 'lucide-react';

interface MobileWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
  onOpenSignIn: (roleHint?: 'C' | 'V') => void;
}

export const MobileWelcomeModal: React.FC<MobileWelcomeModalProps> = ({
  isOpen,
  onClose,
  onContinueAsGuest,
  onOpenSignIn,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="w-full max-w-md bg-[#0D0F17] border border-white/10 rounded-t-[2.5rem] sm:rounded-[2rem] p-6 sm:p-8 text-white relative shadow-2xl overflow-hidden"
        >
          {/* Top Decorative Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Brand Logo & Header */}
          <div className="text-center pt-2 pb-6">
            <span className="text-3xl font-black tracking-tight text-white font-['Outfit'] block">
              zooner<span className="text-emerald-400">.</span>
            </span>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-2">
              Real Shelf Stock · 15-Min Hold Pass
            </p>
          </div>

          {/* Main Action Options */}
          <div className="space-y-3.5">
            
            {/* 1. Continue as Guest (Explore Nearby Stores) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onContinueAsGuest();
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border border-emerald-500/30 hover:border-emerald-400 text-left transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Continue as Guest
                  </h4>
                  <p className="text-xs text-slate-400">Explore nearby real-time store stock without logging in</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </motion.button>

            {/* 2. Sign In / Log In */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onOpenSignIn('C');
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sign In / Log In</h4>
                  <p className="text-xs text-slate-400">Access active hold passes, saved stores & direct chat</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
            </motion.button>

            {/* 3. Are you a Vendor / Store Owner? */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onOpenSignIn('V');
                onClose();
              }}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-left transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-amber-200">Are you a Vendor / Store Owner?</h4>
                  </div>
                  <p className="text-xs text-slate-400">Register store, manage live requests & open Merchant OS</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </motion.button>

          </div>

          {/* Footer Security Badge */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Unified Zooner Passport · Customer & Vendor Access</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
