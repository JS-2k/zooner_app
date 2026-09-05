import React from 'react';
import { X, MapPin, Navigation, Search } from 'lucide-react';
import type { LocationArea } from '../types';

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
  const [isLocating, setIsLocating] = React.useState(false);
  const [gpsError, setGpsError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        onSelectLocation({
          id: 'live-gps',
          name: 'Current Location (GPS)',
          city: 'Coimbatore',
          storesCount: 0,
          activeRequests: 0,
          lat: latitude,
          lng: longitude
        });
        onClose();
      },
      (error) => {
        setIsLocating(false);
        setGpsError(error.message || 'Unable to retrieve your location.');
        // Fallback to default location area if permission denied
        onSelectLocation({
          id: 'default-coimbatore',
          name: 'Coimbatore Central',
          city: 'Coimbatore',
          storesCount: 0,
          activeRequests: 0,
          lat: 11.0168,
          lng: 76.9558
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

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
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick GPS detect button */}
          <button
            onClick={handleDetectGPS}
            disabled={isLocating}
            className="mb-4 flex w-full items-center justify-between rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 px-4 py-3 text-left transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/40 cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
              </div>
              <div>
                <div className="text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 font-['Outfit']">
                  <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  {isLocating ? 'Detecting your GPS position...' : 'Use Current Location (GPS)'}
                </div>
                <div className="text-xs text-indigo-700 dark:text-indigo-400/80">
                  {selectedLocation.lat && selectedLocation.lng
                    ? `Active GPS (${selectedLocation.lat.toFixed(4)}°, ${selectedLocation.lng.toFixed(4)}°)`
                    : 'Auto-detect real-time GPS coordinates'}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              {isLocating ? 'Locating...' : 'Detect'}
            </span>
          </button>

          {gpsError && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold">
              {gpsError}
            </div>
          )}

          {/* Search / Custom Area Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) {
                onSelectLocation({
                  id: `custom-${Date.now()}`,
                  name: query.trim(),
                  city: 'Coimbatore',
                  storesCount: 0,
                  activeRequests: 0
                });
                onClose();
              }
            }}
            className="space-y-3"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter custom neighborhood or area name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/80 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            {query.trim() && (
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white py-3 text-sm font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
              >
                <MapPin className="h-4 w-4" />
                <span>Set Zone to "{query.trim()}"</span>
              </button>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 px-6 py-3.5 text-center text-xs text-slate-500 dark:text-slate-400">
          Zooner connects you with physical inventory within 5–15 km of your location.
        </div>
      </div>
    </div>
  );
};
