import React, { useState } from 'react';
import { 
  MapPin, 
  Store, 
  Sparkles, 
  Navigation, 
  ShieldCheck,
  Footprints,
  Shirt,
  Smartphone,
  Home,
  Sparkle,
  ShoppingBag
} from 'lucide-react';
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
  const [activePin, setActivePin] = useState<StoreType>(PHYSICAL_STORES[0]);
  const [selectedMapCategory, setSelectedMapCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Stores', icon: Sparkles },
    { id: 'fashion', label: 'Fashion', icon: Shirt },
    { id: 'electronics', label: 'Electronics', icon: Smartphone },
    { id: 'beauty', label: 'Beauty', icon: Sparkle },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'sports', label: 'Sports', icon: Footprints },
    { id: 'grocery', label: 'Grocery', icon: ShoppingBag },
  ];

  // Google Map search query for active store
  const mapSearchQuery = `${activePin.name}, ${activePin.address}, ${activePin.area}, Coimbatore, Tamil Nadu`;
  const googleMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapSearchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${activePin.name}, ${activePin.address}, Coimbatore`)}`;

  return (
    <section className="relative py-20 md:py-32 bg-white dark:bg-[#070A12] border-t border-slate-200 dark:border-slate-800/80 overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-3 shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            LIVE GOOGLE MAP DISCOVERY NETWORK
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4 font-['Outfit']">
            Your city has more to discover.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Experience the joy of touching fabrics, testing gadget screens, and getting verified sizes right now. Zooner connects you with <strong className="text-slate-950 dark:text-white font-bold">real physical stores</strong> just down the road.
          </p>

          {/* Map category filter pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pt-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedMapCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedMapCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 shadow-sm'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real Interactive Google Map Board */}
        <div className="relative rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl dark:shadow-2xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Col: Physical Stores Picker & Details */}
            <div className="lg:col-span-4 flex flex-col space-y-3 order-2 lg:order-1">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Nearby Stores ({PHYSICAL_STORES.length})
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  {currentLocation.name}
                </span>
              </div>

              {/* Scrollable list of stores */}
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {PHYSICAL_STORES.map((store) => {
                  const isSelected = activePin.id === store.id;
                  return (
                    <div
                      key={store.id}
                      onClick={() => setActivePin(store)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/80 shadow-md shadow-indigo-500/10'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={store.avatarUrl}
                          alt={store.name}
                          className="h-11 w-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate font-['Outfit']">
                              {store.name}
                            </h4>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              {store.distance}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {store.address}
                          </p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/40 text-[11px]">
                            <span className="text-slate-600 dark:text-slate-300 font-medium">
                              <strong>{store.featuredProductsCount}</strong> items on shelf
                            </span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                              {store.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button: Open Directions in Google Maps */}
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-3 text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
              >
                <Navigation className="h-4 w-4" />
                <span>Open {activePin.name} in Google Maps</span>
              </a>
            </div>

            {/* Right Col: Real Embedded Google Map */}
            <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 min-h-[380px] lg:min-h-[500px] shadow-inner order-1 lg:order-2">
              
              {/* Google Maps Iframe */}
              <iframe
                title={`Google Map - ${activePin.name}`}
                src={googleMapUrl}
                width="100%"
                height="100%"
                className="w-full h-full min-h-[380px] lg:min-h-[500px] border-0"
                loading="lazy"
                allowFullScreen
              />

              {/* Map Floating Header Badge */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 shadow-md">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">
                  Google Map: <strong>{activePin.name}</strong> ({activePin.area})
                </span>
              </div>

              {/* Switch Neighborhood Button Top Right */}
              <button
                onClick={onOpenLocationModal}
                className="absolute top-3 right-3 z-10 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-md transition-colors"
              >
                Switch Area
              </button>

              {/* Map Bottom Hint */}
              <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 text-[10px] text-slate-300">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>Verified physical GPS address</span>
              </div>

            </div>

          </div>

          {/* Offline Retail Advantages (Physical Stores Superpowers) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 p-4 flex items-center gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Footprints className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">Instant Gratification</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Take it home immediately. No return shipping hassles.</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 p-4 flex items-center gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Shirt className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">True Fit Guarantee</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Try on multiple sizes and feel the authentic material.</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 p-4 flex items-center gap-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">Support Local Economy</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Keep neighborhood merchants thriving with every purchase.</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
