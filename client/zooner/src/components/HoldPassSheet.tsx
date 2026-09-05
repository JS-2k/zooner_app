import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Navigation, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export interface HoldPass {
  id: string;
  passCode: string;
  productName: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeClosing?: string;
  price: number;
  customerName: string;
  customerPhone: string;
  createdAt: number;
  expiresAt: number;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
}

interface HoldPassSheetProps {
  pass: HoldPass | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelHold: (passId: string) => void;
  onOpenChat: (pass: HoldPass) => void;
}

export const HoldPassSheet: React.FC<HoldPassSheetProps> = ({
  pass,
  isOpen,
  onClose,
  onCancelHold,
  onOpenChat,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(1800);

  useEffect(() => {
    if (!pass) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((pass.expiresAt - now) / 1000));
      setSecondsRemaining(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [pass]);

  if (!pass) return null;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isExpired = secondsRemaining <= 0;
  const progressPercent = Math.min(100, (secondsRemaining / 1800) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full sm:max-w-lg bg-[#07080B] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto text-left selection:bg-white selection:text-black"
          >
            {/* Header with drag pill and close button */}
            <div className="sticky top-0 bg-[#07080B]/95 backdrop-blur-md px-6 pt-4 pb-3 border-b border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  {isExpired ? 'Hold Expired' : 'Active Counter Pass'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Pass ID and Barcode Graphic */}
              <div className="space-y-2 border-b border-white/10 pb-6 text-center">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-500">
                  Verification Pass Code
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-white">
                  {pass.passCode}
                </div>
                {/* Clean SVG Barcode Graphic */}
                <div className="flex items-center justify-center gap-1 pt-1 opacity-70">
                  {[4, 2, 6, 2, 4, 8, 2, 4, 6, 2, 8, 4, 2, 6, 4, 2, 8, 4, 2, 6].map((h, i) => (
                    <span 
                      key={i} 
                      className="bg-white" 
                      style={{ width: `${(i % 3 === 0) ? 2 : 1}px`, height: `${h * 3}px` }} 
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Show code to clerk at store counter · Pay directly upon pickup
                </p>
              </div>

              {/* Live Countdown Clock */}
              <div className="border-b border-white/10 pb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">
                    Counter Hold Timer
                  </span>
                  <div className="text-3xl font-mono font-bold text-white mt-1">
                    {isExpired ? '00:00' : timeFormatted}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {isExpired ? 'Held item released back to shelf' : 'Item reserved on counter'}
                  </span>
                </div>

                {/* Circular timer indicator */}
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-white/10"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={176}
                      strokeDashoffset={176 - (176 * progressPercent) / 100}
                      className={isExpired ? 'text-red-500' : 'text-emerald-400'}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <Clock className={`h-5 w-5 absolute ${isExpired ? 'text-red-500' : 'text-emerald-400'}`} />
                </div>
              </div>

              {/* Store & Product Information (Typographic rows) */}
              <div className="space-y-4 border-b border-white/10 pb-6 text-sm">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-slate-500 shrink-0 font-mono text-xs">Product</span>
                  <span className="text-white font-semibold text-right">{pass.productName}</span>
                </div>

                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-slate-500 shrink-0 font-mono text-xs">Counter Price</span>
                  <span className="text-white font-mono font-bold text-base">₹{pass.price.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <span className="text-slate-500 shrink-0 font-mono text-xs">Store</span>
                  <div className="text-right">
                    <div className="text-white font-bold flex items-center gap-1 justify-end">
                      <span>{pass.storeName}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{pass.storeAddress}</div>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <span className="text-slate-500 shrink-0 font-mono text-xs">Reserved For</span>
                  <span className="text-slate-300 font-mono text-xs text-right">
                    {pass.customerName} ({pass.customerPhone})
                  </span>
                </div>

                {pass.storeClosing && (
                  <div className="flex items-center gap-2 p-3 bg-white/[0.03] border border-white/10 text-xs text-amber-400 font-mono">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Store Alert: {pass.storeClosing}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-1">
                {/* 1. Walking Directions */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${pass.storeName}, ${pass.storeAddress}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-white text-slate-950 font-bold text-xs rounded-full flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Get Walking Directions</span>
                </a>

                {/* 2. Chat & Call Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onOpenChat(pass)}
                    className="py-3 px-4 border border-white/20 hover:border-white/40 text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Chat with Store</span>
                  </button>

                  <a
                    href={`tel:${pass.storePhone.replace(/[^0-9+]/g, '')}`}
                    className="py-3 px-4 border border-white/20 hover:border-white/40 text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call Counter</span>
                  </a>
                </div>

                {/* 3. Release / Cancel Hold */}
                {!isExpired && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => {
                        if (confirm('Cancel this 30-minute hold and release inventory back to the store?')) {
                          onCancelHold(pass.id);
                          onClose();
                        }
                      }}
                      className="text-xs text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Cancel Reservation & Release Item
                    </button>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
