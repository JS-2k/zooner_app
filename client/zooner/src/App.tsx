import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductRequest } from './components/ProductRequest';
import { LocalDiscovery } from './components/LocalDiscovery';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { LocationModal } from './components/LocationModal';
import { RetailerModal } from './components/RetailerModal';
import { SignInModal } from './components/SignInModal';
import { VendorLandingPage } from './pages/VendorLandingPage';
import { DEFAULT_LOCATION } from './data/mockData';
import type { LocationArea } from './types';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<'customer' | 'vendor'>(() => {
    return window.location.hash.includes('vendor') ? 'vendor' : 'customer';
  });
  const [currentLocation, setCurrentLocation] = useState<LocationArea>(DEFAULT_LOCATION);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isRetailerModalOpen, setIsRetailerModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [requestPrefill] = useState<string>('Nike Running Shoes');

  // Auto-detect real-time browser GPS location on startup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            id: 'live-gps',
            name: 'Current Location (GPS)',
            city: 'Coimbatore',
            storesCount: 0,
            activeRequests: 0,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Silent fallback to default Coimbatore location if permission not granted yet
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    }
  }, []);

  // Sync with browser hash changes for back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('vendor')) {
        setCurrentPage('vendor');
      } else {
        setCurrentPage('customer');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: 'customer' | 'vendor') => {
    setCurrentPage(page);
    window.location.hash = page === 'vendor' ? '#vendor' : '#';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'vendor') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white transition-colors duration-200">
        <VendorLandingPage
          onSwitchToCustomer={() => navigateTo('customer')}
          onOpenSignIn={() => setIsSignInModalOpen(true)}
        />
        <SignInModal
          isOpen={isSignInModalOpen}
          onClose={() => setIsSignInModalOpen(false)}
          onSwitchToRetailer={() => setIsRetailerModalOpen(true)}
        />
        <RetailerModal
          isOpen={isRetailerModalOpen}
          onClose={() => setIsRetailerModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white relative transition-colors duration-200">
      {/* 1. Navbar */}
      <Navbar
        currentLocation={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onNavigateToVendor={() => navigateTo('vendor')}
        onOpenSignInModal={() => setIsSignInModalOpen(true)}
      />

      {/* Main Content Area - 100% Focused on Hyperlocal Live Requests & Walk-in */}
      <main className="flex-1">
        {/* 2. Hero Section (Slogan + Search + 3-Step Walk-in Explanation) */}
        <Hero
          currentLocation={currentLocation}
          onOpenRetailerModal={() => navigateTo('vendor')}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
        />

        {/* 3. Live Product Request Feature (Core USP Spotlight) */}
        <ProductRequest
          prefillProduct={requestPrefill}
        />

        {/* 4. Local Physical Store Directory & Google Map Network */}
        <div id="map-discovery">
          <LocalDiscovery
            currentLocation={currentLocation}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
          />
        </div>

        {/* 5. Final Call-to-Action */}
        <FinalCTA
          onOpenRetailerModal={() => navigateTo('vendor')}
        />
      </main>

      {/* 6. Footer */}
      <Footer
        onOpenRetailerModal={() => navigateTo('vendor')}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      {/* Interactive Global Modals */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={currentLocation}
        onSelectLocation={(loc) => setCurrentLocation(loc)}
      />

      <RetailerModal
        isOpen={isRetailerModalOpen}
        onClose={() => setIsRetailerModalOpen(false)}
      />

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSwitchToRetailer={() => navigateTo('vendor')}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
