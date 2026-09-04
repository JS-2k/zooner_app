import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, ArrowUpRight, CheckCircle2, Store } from 'lucide-react';
import { PHYSICAL_STORES } from '../data/mockData';
import type { Store as StoreType, LocationArea } from '../types';

interface LocalDiscoveryProps {
  currentLocation: LocationArea;
  onOpenLocationModal: () => void;
}

export const LocalDiscovery: React.FC<LocalDiscoveryProps> = ({
  currentLocation,
  onOpenLocationModal,
}) => {
  const [activePin, setActivePin] = useState<StoreType | null>(PHYSICAL_STORES[0] || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Verified Stores' },
    { id: 'Footwear & Sports', label: 'Sports & Footwear' },
    { id: 'Fashion', label: 'Fashion & Apparel' },
    { id: 'Electronics', label: 'Electronics & Audio' },
    { id: 'Beauty', label: 'Beauty & Skincare' },
  ];

  const filteredStores = PHYSICAL_STORES.filter(st => {
    if (selectedCategory === 'all') return true;
    return st.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const mapSearchQuery = activePin
    ? `${activePin.name}, ${activePin.address}, ${activePin.area}, Coimbatore, Tamil Nadu`
    : `${currentLocation.name}, ${currentLocation.city}, Tamil Nadu`;
  const googleMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapSearchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="stores" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#090D18] text-white border-t border-slate-800/80 overflow-hidden">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 right-10 w-[600px] h-[600px] bg-blue-950/15 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 max-w-2xl"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block">
              04 / Physical Store Network
            </span>
            <h2 
              className="font-['Outfit'] font-black tracking-tight text-white leading-[0.98]"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.4rem)' }}
            >
              Your city has the product.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Every authorized brand store, boutique, and local dealer near you — connected in real time to your mobile screen.
            </p>
          </motion.div>

          {/* Location Trigger */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>{currentLocation.name || 'RS Puram, Coimbatore'}</span>
          </motion.button>
        </div>

        {/* Category Filters with Framer Motion layout pill */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap z-10 ${
                  isSelected ? 'text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-white rounded-full -z-10 shadow-lg"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {!isSelected && (
                  <div className="absolute inset-0 bg-slate-900/90 border border-slate-800 rounded-full -z-10" />
                )}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Centerpiece Dominant Map Layout */}
        <div className="space-y-6">
          
          {/* Dominant Map Container */}
          <div className="rounded-3xl overflow-hidden border border-slate-700/80 bg-[#0A0F1E] h-[380px] sm:h-[460px] relative shadow-2xl">
            <iframe
              title="Store Map"
              src={googleMapUrl}
              className="w-full h-full border-0 filter invert-[0.9] hue-rotate-180 contrast-[1.1] opacity-85"
              loading="lazy"
            />

            {/* Selected Store Floating Overlay Card */}
            <AnimatePresence>
              {activePin && (
                <motion.div 
                  key={activePin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bg-[#0A0F1E]/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 text-left flex items-center justify-between gap-4 shadow-2xl z-20"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">{activePin.name}</h4>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 truncate max-w-xs">{activePin.address}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                      <span className="text-emerald-400 font-bold">{activePin.distance}</span>
                      <span>·</span>
                      <span>{activePin.openStatus}</span>
                    </div>
                  </div>

                  <motion.a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${activePin.name}, ${activePin.address}, Coimbatore`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-bold shrink-0 hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Directions</span>
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Horizontal Quick-Select Store Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
            {filteredStores.slice(0, 6).map(store => {
              const isSelected = activePin?.id === store.id;
              return (
                <div
                  key={store.id}
                  onClick={() => setActivePin(store)}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer border ${
                    isSelected 
                      ? 'bg-slate-800/95 border-indigo-500/80 shadow-lg' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-white text-xs truncate max-w-[180px]">{store.name}</div>
                    <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                      {store.distance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span className="truncate">{store.category}</span>
                    <span className="text-indigo-400 font-medium flex items-center gap-0.5">
                      Focus <ArrowUpRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStores.length === 0 && (
            <div className="p-8 text-center bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
              <Store className="h-6 w-6 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-300">No stores found in this category.</p>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};


