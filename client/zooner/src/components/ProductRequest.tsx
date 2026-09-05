import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Clock, Store, Radio } from 'lucide-react';
import { sendLiveRequest } from '../services/api';
import type { RetailerResponse } from '../types';

interface ProductRequestProps {
  prefillProduct?: string;
}

export const ProductRequest: React.FC<ProductRequestProps> = ({ prefillProduct }) => {
  const [productName, setProductName] = useState(prefillProduct || 'Nike Air Max 270');
  const [size, setSize] = useState('UK 9');
  const [budget, setBudget] = useState('₹5,000 – ₹8,000');
  const [radius, setRadius] = useState('Within 5 km');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [responses, setResponses] = useState<RetailerResponse[]>([]);
  const [heldStore, setHeldStore] = useState<string | null>(null);

  useEffect(() => {
    if (prefillProduct) {
      setProductName(prefillProduct);
    }
  }, [prefillProduct]);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);

    const result = await sendLiveRequest({
      requestText: `${productName} (${size}) - Budget: ${budget}`,
      categoryId: 'all',
      searchRadiusKm: parseInt(radius) || 5,
      latitude: 11.0168,
      longitude: 76.9558
    });

    setIsBroadcasting(false);
    setRequestSent(true);
    if (result && Array.isArray(result.responses)) {
      setResponses(result.responses);
    } else {
      setResponses([]);
    }
  };

  return (
    <section id="request" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#08080a] text-white border-t border-white/[0.06] overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-500/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-left max-w-2xl space-y-4"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
            03 / Live Request
          </span>
          <h2 
            className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            Ask your city live.
          </h2>
          <p className="text-white/60 text-base sm:text-lg">
            Broadcast what you need to local retailers. See who has it in stock before stepping out.
          </p>
        </motion.div>

        {/* The Interactive Request Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Request Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 bg-black/60 border border-white/[0.08] hover:border-white/[0.14] transition-colors rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md"
          >
            <form onSubmit={handleSendRequest} className="space-y-4 text-left">
              
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-2">
                  What are you looking for?
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Nike Air Max 270, Titan Edge watch"
                  className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-white/50 focus:bg-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-2">
                    Size / Variant
                  </label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. UK 9, 256GB, M"
                    className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-white/50 focus:bg-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-2">
                    Distance Radius
                  </label>
                  <select
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full bg-[#121215] border border-white/[0.1] focus:border-white/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  >
                    <option value="Within 2 km">Within 2 km</option>
                    <option value="Within 5 km">Within 5 km</option>
                    <option value="Within 10 km">Within 10 km</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70 block mb-2">
                  Target Budget
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. Under ₹7,000"
                  className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-white/50 focus:bg-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isBroadcasting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/95 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
              >
                {isBroadcasting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    <span>Pinging Verified Stores…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Broadcast Live Request</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right: Live Responses Feed with AnimatePresence */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-4 text-left"
          >
            <div className="flex items-center justify-between text-xs text-white/40 pb-2 border-b border-white/[0.06]">
              <span className="flex items-center gap-1.5 font-mono">
                <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
                Live Store Feed
              </span>
              <span className="font-mono">{requestSent ? `${responses.length} Stores Responded` : 'Awaiting Broadcast'}</span>
            </div>

            <AnimatePresence mode="wait">
              {requestSent ? (
                <motion.div 
                  key="responses-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {responses.map((resp, index) => {
                    const isHeld = heldStore === resp.id;
                    return (
                      <motion.div 
                        key={resp.id}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.12 }}
                        whileHover={{ borderColor: 'rgba(255,255,255,0.22)', y: -2 }}
                        className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all space-y-3 shadow-lg"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                              <span>{resp.storeName}</span>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            </div>
                            <span className="text-xs text-white/40">{resp.storeArea} · {resp.distance} away</span>
                          </div>

                          <div className="text-right">
                            <span className="text-base font-black text-white">₹{resp.price.toLocaleString('en-IN')}</span>
                            <span className="block text-[10px] text-emerald-400 font-medium">In Stock</span>
                          </div>
                        </div>

                        <p className="text-xs text-white/70 italic bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
                          "{resp.conditionNote}"
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <motion.button
                            onClick={() => setHeldStore(isHeld ? null : resp.id)}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                              isHeld 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                : 'bg-white text-black hover:bg-white/90 shadow'
                            }`}
                          >
                            {isHeld ? 'Held for 30m ✓' : 'Hold for Walk-in'}
                          </motion.button>
                          <span className="text-xs text-white/40 flex items-center gap-1 font-mono">
                            <Clock className="h-3 w-3" /> Ready on shelf
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-3"
                >
                  <Store className="h-8 w-8 text-white/20 mx-auto" />
                  <p className="text-sm text-white/60 max-w-xs mx-auto">
                    Hit <strong>"Broadcast Live Request"</strong> to see nearby shops confirm stock in real time.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

