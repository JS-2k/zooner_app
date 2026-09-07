import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Navigation, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export interface HoldPass {
  id: string;
  passCode: string;
  qrToken?: string;
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
  holdId?: string;
  storeId?: string;
  storeInventoryId?: string;
}

interface HoldPassSheetProps {
  pass: HoldPass | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelHold: (passId: string) => void;
  onOpenChat: (pass: HoldPass) => void;
}

const generateQrMatrix = (text: string) => {
  const size = 21;
  const matrix = Array(size).fill(0).map(() => Array(size).fill(false));

  const addFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix[row + r][col + c] = true;
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(0, 14);
  addFinder(14, 0);

  let hash = 0;
  for (let idx = 0; idx < text.length; idx++) {
    hash = (hash << 5) - hash + text.charCodeAt(idx);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7)) continue;
      const bit = Math.abs(Math.sin(hash + r * 21 + c)) > 0.45;
      matrix[r][c] = bit;
    }
  }

  return matrix;
};

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

  const qrTokenString = pass.qrToken || `zhold:${pass.id}:${pass.passCode}`;
  const qrMatrix = generateQrMatrix(qrTokenString);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full sm:max-w-md bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto text-left shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  isExpired 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${isExpired ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                  {isExpired ? 'Hold Pass Expired' : 'Active Counter Hold Pass'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* QR Code Container */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Scan QR at Store Counter
                </div>

                {/* Clean High-Contrast QR Code */}
                <div className="mx-auto w-48 h-48 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 21 21">
                    {qrMatrix.map((row, r) =>
                      row.map((cell, c) =>
                        cell ? (
                          <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0F172A" />
                        ) : null
                      )
                    )}
                  </svg>
                </div>

                {/* Fallback Pass Code */}
                <div className="pt-2">
                  <div className="text-[11px] text-slate-400 font-medium">Fallback Pass Code</div>
                  <div className="text-2xl font-black font-mono tracking-widest text-slate-900 mt-0.5">
                    {pass.passCode}
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium pt-1 max-w-xs mx-auto">
                  Show this QR code to the store clerk for instant pickup verification. Pay at store.
                </p>
              </div>

              {/* Countdown Clock */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Counter Reservation Time
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
                    {isExpired ? '00:00' : timeFormatted}
                  </div>
                  <span className="text-xs text-slate-500 font-medium block mt-0.5">
                    {isExpired ? 'Hold pass expired' : 'Item reserved on store counter'}
                  </span>
                </div>

                <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-slate-200"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={163}
                      strokeDashoffset={163 - (163 * progressPercent) / 100}
                      className={isExpired ? 'text-rose-500' : 'text-emerald-500'}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <Clock className={`h-5 w-5 absolute ${isExpired ? 'text-rose-500' : 'text-emerald-600'}`} />
                </div>
              </div>

              {/* Store & Product Details */}
              <div className="space-y-3.5 text-sm pt-1 border-t border-slate-100">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-slate-500 font-medium text-xs">Item</span>
                  <span className="text-slate-900 font-bold text-right">{pass.productName}</span>
                </div>

                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-slate-500 font-medium text-xs">Store Price</span>
                  <span className="text-slate-900 font-black text-base font-['Outfit']">₹{pass.price.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <span className="text-slate-500 font-medium text-xs">Store Location</span>
                  <div className="text-right">
                    <div className="text-slate-900 font-bold flex items-center gap-1 justify-end">
                      <span>{pass.storeName}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{pass.storeAddress}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${pass.storeName}, ${pass.storeAddress}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Get Walking Directions</span>
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onOpenChat(pass)}
                    className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                    <span>Chat Store</span>
                  </button>

                  <a
                    href={`tel:${pass.storePhone.replace(/[^0-9+]/g, '')}`}
                    className="py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Phone className="h-3.5 w-3.5 text-slate-600" />
                    <span>Call Store</span>
                  </a>
                </div>

                {!isExpired && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => {
                        if (confirm('Cancel this 30-minute hold and release inventory back to store?')) {
                          onCancelHold(pass.id);
                          onClose();
                        }
                      }}
                      className="text-xs text-slate-400 hover:text-rose-600 font-medium transition-colors cursor-pointer"
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
