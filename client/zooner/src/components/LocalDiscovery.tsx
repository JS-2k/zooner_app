import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, ArrowUpRight, CheckCircle2 } from 'lucide-react';
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
    { id: 'Footwear & Sports', label: 'Footwear & Sports' },
    { id: 'Fashion', label: 'Fashion' },
    { id: 'Electronics', label: 'Electronics & Audio' },
    { id: 'Beauty', label: 'Beauty' },
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
    <section id="stores" className="relative py-24 sm:py-32 px-6 sm:px-8 bg-[#07080B] text-white border-t border-white/10">
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 max-w-xl"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold block">
              Store Directory
            </span>
            <h2 
              className="font-['Outfit'] font-black tracking-tight text-white leading-[0.98]"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
            >
              Your city has the product.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed pt-1">
              Authorized brand stores and local retailers near you — connected in real time.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer shrink-0"
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>{currentLocation.name || 'RS Puram, Coimbatore'}</span>
          </motion.button>
        </div>

        {/* Category Filters - Sleek typographic tabs */}
        <div className="flex items-center gap-6 border-b border-slate-800/80 overflow-x-auto no-scrollbar pb-3">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap relative pb-1 ${
                  isSelected ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {cat.label}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Map view */}
        <div className="space-y-8">
          <div className="overflow-hidden border border-slate-800 h-[360px] sm:h-[420px] relative">
            <iframe
              title="Store Map"
              src={googleMapUrl}
              className="w-full h-full border-0 filter invert-[0.92] hue-rotate-180 contrast-[1.15] opacity-80"
              loading="lazy"
            />

            {/* Selected Store Floating Info */}
            <AnimatePresence>
              {activePin && (
                <motion.div 
                  key={activePin.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.25 }}
                  className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bg-[#06070F]/95 border border-slate-700/80 p-4 text-left flex items-center justify-between gap-4 backdrop-blur-md z-20"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">{activePin.name}</h4>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{activePin.address}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                      <span className="text-emerald-400 font-bold">{activePin.distance}</span>
                      <span>·</span>
                      <span>{activePin.openStatus}</span>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${activePin.name}, ${activePin.address}, Coimbatore`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white text-slate-950 text-xs font-bold shrink-0 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Navigation className="h-3 w-3" />
                    <span>Directions</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clean Directory Table List - No Card Boxes */}
          <div className="border-t border-slate-800/80">
            {filteredStores.slice(0, 6).map((store) => {
              const isSelected = activePin?.id === store.id;
              return (
                <div
                  key={store.id}
                  onClick={() => setActivePin(store)}
                  className={`py-3.5 px-2 flex items-center justify-between border-b border-slate-800/50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white/[0.03] text-white' : 'hover:bg-white/[0.015] text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                    <div className="truncate">
                      <span className={`text-sm font-bold block sm:inline ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {store.name}
                      </span>
                      <span className="text-xs text-slate-500 sm:ml-3">
                        {store.area} · {store.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0 font-mono">
                    <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {store.distance}
                    </span>
                    <span className="text-slate-600 hidden sm:inline">·</span>
                    <span className="text-slate-400 hidden sm:inline">{store.openStatus}</span>
                    <ArrowUpRight className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStores.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No stores found in this category.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
