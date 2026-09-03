import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Radio
} from 'lucide-react';
import { sendLiveRequest } from '../services/api';
import type { RetailerResponse } from '../types';

interface ProductRequestProps {
  prefillProduct?: string;
}

export const ProductRequest: React.FC<ProductRequestProps> = ({ prefillProduct }) => {
  const [productName, setProductName] = useState(prefillProduct || 'Nike Running Shoes');
  const [size, setSize] = useState('UK 9');
  const [budget, setBudget] = useState('₹5,000 – ₹8,000');
  const [radius, setRadius] = useState('Within 10 km');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [responses, setResponses] = useState<RetailerResponse[]>([]);
  const [heldStore, setHeldStore] = useState<string | null>(null);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);

    const result = await sendLiveRequest({
      productName: `${productName} (${size})`,
      specifications: `Budget: ${budget}`,
      radiusKm: parseInt(radius) || 10,
      latitude: 11.0168,
      longitude: 76.9558
    });

    setIsBroadcasting(false);
    setRequestSent(true);
    if (result && Array.isArray(result.responses)) {
      setResponses(result.responses);
    }
  };

  return (
    <section id="request-feature" className="relative py-20 md:py-32 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-900 overflow-hidden transition-colors duration-200">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-3 shadow-sm">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            ZOONER UNIQUE SUPERPOWER
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4 font-['Outfit']">
            Can’t find what you’re looking for?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Tell nearby retailers what you need. Zooner connects your request directly with relevant local stores so you don't have to call around town.
          </p>
        </div>

        {/* Two-Column Interactive Request Demonstration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Left: Beautiful Request Form Card */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xl dark:shadow-2xl relative">
            {requestSent && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Live request broadcast to physical stores nearby!</span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">What are you looking for?</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Broadcasts to physical stores nearby</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded">
                Live
              </span>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Product
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Nike Running Shoes, Linen Shirt"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Size / Spec
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none shadow-sm"
                  >
                    <option value="UK 8">UK 8</option>
                    <option value="UK 9">UK 9</option>
                    <option value="UK 10">UK 10</option>
                    <option value="Size M">Size M</option>
                    <option value="Size L">Size L</option>
                    <option value="256GB Storage">256GB Storage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none shadow-sm"
                  >
                    <option value="Under ₹2,000">Under ₹2,000</option>
                    <option value="₹2,000 – ₹5,000">₹2,000 – ₹5,000</option>
                    <option value="₹5,000 – ₹8,000">₹5,000 – ₹8,000</option>
                    <option value="₹8,000 – ₹15,000">₹8,000 – ₹15,000</option>
                    <option value="Above ₹15,000">Above ₹15,000</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Location Radius
                </label>
                <div className="flex items-center gap-2">
                  {['Within 5 km', 'Within 10 km', 'Whole City'].map((rad) => (
                    <button
                      key={rad}
                      type="button"
                      onClick={() => setRadius(rad)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors ${
                        radius === rad
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {rad}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-70"
                >
                  {isBroadcasting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Broadcasting to local stores...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Request to Nearby Retailers</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400 pt-1">
                ⚡ Average retailer response time in Coimbatore: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">11 minutes</span>
              </div>
            </form>
          </div>

          {/* Right: Live Responses Feed */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {responses.length} verified retailers replied
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Request: {productName} ({size})</span>
            </div>

            {/* List of Retailer Responses */}
            <div className="space-y-3">
              {responses.map((resp) => {
                const isHeld = heldStore === resp.id;
                return (
                  <div
                    key={resp.id}
                    className={`rounded-2xl border p-4.5 sm:p-5 transition-all shadow-sm ${
                      isHeld
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md shadow-indigo-500/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resp.avatar}
                          alt={resp.storeName}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">{resp.storeName}</h4>
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {resp.storeArea} • <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{resp.distance} away</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          ✓ Available
                        </div>
                        <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-['Outfit'] mt-1">
                          ₹{resp.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl p-2.5 border border-slate-200 dark:border-slate-800/80">
                      "{resp.conditionNote}"
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        Reply received 8m ago
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setHeldStore(isHeld ? null : resp.id)}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                            isHeld
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {isHeld ? '✓ Item Held for You' : 'Hold for 2 Hours'}
                        </button>
                        <button
                          onClick={() => {
                            const query = `${resp.storeName}, ${resp.storeArea}, Coimbatore`;
                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                          }}
                          className="rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          View Store
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Micro guarantee badge */}
            <div className="rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3.5 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>
                Zero obligation to buy. Store holds are free and reserved directly under your name for 2 hours.
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
