import React, { useState } from 'react';
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
    <section id="stores" className="relative py-28 sm:py-36 px-6 sm:px-8 bg-black text-white border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
              04 / Physical Store Network
            </span>
            <h2 
              className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
            >
              Your city is your marketplace.
            </h2>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed">
              Every verified brand store, boutique, and local dealer near you — connected directly to your pocket.
            </p>
          </div>

          {/* Location Trigger */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-white/80 transition-all cursor-pointer shrink-0"
          >
            <MapPin className="h-3.5 w-3.5 text-white/50" />
            <span>{currentLocation.name || 'RS Puram, Coimbatore'}</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/[0.03] text-white/60 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Store Directory & Google Map Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Store List (5 cols) */}
          <div className="lg:col-span-5 space-y-3 text-left max-h-[500px] overflow-y-auto no-scrollbar pr-1">
            {filteredStores.map(store => {
              const isSelected = activePin?.id === store.id;
              return (
                <div
                  key={store.id}
                  onClick={() => setActivePin(store)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer border ${
                    isSelected 
                      ? 'bg-white/[0.08] border-white/30 shadow-xl' 
                      : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.15] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-white text-sm">{store.name}</h4>
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      </div>
                      <p className="text-xs text-white/50 mt-0.5">{store.category} · {store.area}</p>
                    </div>

                    <span className="text-xs font-semibold text-white/80 bg-white/[0.06] px-2.5 py-1 rounded-full shrink-0">
                      {store.distance}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/[0.04] text-[11px] text-white/40">
                    <span>{store.openStatus}</span>
                    <span className="text-white/60 hover:text-white flex items-center gap-1">
                      View on map <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Google Map Frame (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0c0c0e] h-[400px] lg:h-[500px] relative">
            <iframe
              title="Store Map"
              src={googleMapUrl}
              className="w-full h-full border-0 filter invert-[0.9] hue-rotate-180 contrast-[1.1] opacity-80"
              loading="lazy"
            />

            {/* Selected Store Floating Info Card */}
            {activePin && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-xl border border-white/[0.12] rounded-2xl p-4 text-left flex items-center justify-between gap-4 shadow-2xl">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white">{activePin.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded">
                      Open Now
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5 truncate max-w-sm">{activePin.address}</p>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${activePin.name}, ${activePin.address}, Coimbatore`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold shrink-0 hover:bg-white/90 transition-all flex items-center gap-1.5"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Directions</span>
                </a>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
