import React from 'react';
import { X, MapPin, Check, Navigation, Search } from 'lucide-react';
import type { LocationArea } from '../types';
import { LOCATIONS } from '../data/mockData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: LocationArea;
  onSelectLocation: (location: LocationArea) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
}) => {
  const [query, setQuery] = React.useState('');

  if (!isOpen) return null;

  const filteredLocations = LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">Select Discovery Area</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Discover inventory at shops within walking & driving distance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick GPS detect button */}
          <button
            onClick={() => {
              onSelectLocation(LOCATIONS[0]);
              onClose();
            }}
            className="mb-4 flex w-full items-center justify-between rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 px-4 py-3 text-left transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
              </div>
              <div>
                <div className="text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 font-['Outfit']">
                  <Navigation className="h-3.5 w-3.5" />
                  Use Current Location (GPS)
                </div>
                <div className="text-xs text-indigo-700 dark:text-indigo-400/80">Auto-detecting RS Puram, Coimbatore</div>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">Active</span>
          </button>

          {/* Search box */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search area, neighborhood, or city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/80 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          {/* List of locations */}
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      isSelected ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-['Outfit']">
                        {loc.name}
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">({loc.city})</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{loc.storesCount} verified stores</span> • {loc.activeRequests} live customer requests
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 px-6 py-3.5 text-center text-xs text-slate-500 dark:text-slate-400">
          Zooner connects you with physical inventory within 5–15 km of your location.
        </div>
      </div>
    </div>
  );
};
