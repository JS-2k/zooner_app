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
    { id: 'all', label: 'All Stores' },
    { id: 'Footwear & Sports', label: 'Sports & Shoes' },
    { id: 'Fashion', label: 'Fashion & Apparel' },
    { id: 'Electronics', label: 'Electronics' },
    { id: 'Beauty', label: 'Beauty & Wellness' },
    { id: 'Grocery', label: 'Artisan Grocery' },
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
    <section id="stores" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#0B101D] text-white border-t border-slate-800/80 overflow-hidden">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 right-10 w-[600px] h-[600px] bg-blue-950/20 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 max-w-2xl"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold block">
              04 / Physical Store Network
            </span>
            <h2 
              className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              Your city is your marketplace.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Every verified brand store, boutique, and local dealer near you — connected directly to your pocket.
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
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-100 transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>{currentLocation.name || 'RS Puram, Coimbatore'}</span>
          </motion.button>
        </div>

        {/* Category Filters with Framer Motion layout pill */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 relative"
        >
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
                  <div className="absolute inset-0 bg-slate-800/80 border border-slate-700 rounded-full -z-10" />
                )}
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Main Grid: Store Directory & Google Map Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Store List (5 cols) */}
          <div className="lg:col-span-5 space-y-3 text-left max-h-[500px] overflow-y-auto no-scrollbar pr-1">
            <AnimatePresence mode="popLayout">
              {filteredStores.map(store => {
                const isSelected = activePin?.id === store.id;
                return (
                  <motion.div
                    key={store.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setActivePin(store)}
                    whileHover={{ x: 4 }}
                    className={`p-4 rounded-2xl transition-all cursor-pointer border shadow-md ${
                      isSelected 
                        ? 'bg-slate-800 border-indigo-500/80 shadow-xl shadow-indigo-950/30' 
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-sm">{store.name}</h4>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{store.category} · {store.area}</p>
                      </div>

                      <span className="text-xs font-bold text-slate-200 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full shrink-0 font-mono">
                        {store.distance}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium text-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {store.openStatus}
                      </span>
                      <span className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                        View on map <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredStores.length === 0 && (
              <div className="p-8 text-center bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                <Store className="h-6 w-6 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-300">No stores found in this category.</p>
              </div>
            )}
          </div>

          {/* Interactive Google Map Frame (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-700/80 bg-[#0E1526] h-[400px] lg:h-[500px] relative shadow-2xl"
          >
            <iframe
              title="Store Map"
              src={googleMapUrl}
              className="w-full h-full border-0 filter invert-[0.9] hue-rotate-180 contrast-[1.1] opacity-85"
              loading="lazy"
            />

            {/* Selected Store Floating Info Card */}
            <AnimatePresence>
              {activePin && (
                <motion.div 
                  key={activePin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 left-4 right-4 bg-[#0E1526]/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 text-left flex items-center justify-between gap-4 shadow-2xl"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">{activePin.name}</h4>
                      <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/90 border border-emerald-500/30 px-2 py-0.5 rounded">
                        Open Now
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 truncate max-w-sm">{activePin.address}</p>
                  </div>

                  <motion.a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${activePin.name}, ${activePin.address}, Coimbatore`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl bg-white text-slate-950 text-xs font-bold shrink-0 hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Directions</span>
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

