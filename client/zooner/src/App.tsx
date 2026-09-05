import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { CustomerAppPage } from './pages/CustomerAppPage';
import { VendorLandingPage } from './pages/VendorLandingPage';
import { VendorDashboardPage } from './pages/VendorDashboardPage';
import { LocationModal } from './components/LocationModal';
import { RetailerModal } from './components/RetailerModal';
import { SignInModal } from './components/SignInModal';
import { DEFAULT_LOCATION } from './data/mockData';
import { Capacitor } from '@capacitor/core';
import type { LocationArea } from './types';

type AppRoute = 'marketing' | 'customer' | 'vendor' | 'vendor-dashboard';

export function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('vendor/dashboard') || hash.includes('vendordashboard')) return 'vendor-dashboard';
    if (hash.includes('vendor')) return 'vendor';
    if (hash.includes('app') || hash.includes('customer')) return 'customer';
    if (Capacitor.isNativePlatform()) return 'customer';
    return 'marketing';
  });

  const [currentLocation, setCurrentLocation] = useState<LocationArea>(DEFAULT_LOCATION);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isRetailerModalOpen, setIsRetailerModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Auto-detect real-time browser GPS location on startup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(prev => ({
            ...prev,
            id: 'live-gps',
            name: 'Current Location (GPS)',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
        },
        () => {
          // Silent fallback to default Coimbatore location
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    }
  }, []);

  // Sync with browser hash changes for back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('vendor/dashboard') || hash.includes('vendordashboard')) {
        setCurrentRoute('vendor-dashboard');
      } else if (hash.includes('vendor')) {
        setCurrentRoute('vendor');
      } else if (hash.includes('app') || hash.includes('customer')) {
        setCurrentRoute('customer');
      } else {
        setCurrentRoute(Capacitor.isNativePlatform() ? 'customer' : 'marketing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    if (route === 'vendor-dashboard') {
      window.location.hash = '#vendor/dashboard';
    } else if (route === 'vendor') {
      window.location.hash = '#vendor';
    } else if (route === 'customer') {
      window.location.hash = '#app';
    } else {
      window.location.hash = '#';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── EXPERIENCE 3B: VENDOR OPERATIONAL DASHBOARD (Merchant OS) ──
  if (currentRoute === 'vendor-dashboard') {
    return (
      <VendorDashboardPage
        onSwitchToCustomer={() => navigateTo('customer')}
        onNavigateToVendorLanding={() => navigateTo('vendor')}
      />
    );
  }

  // ── EXPERIENCE 3A: VENDOR MARKETING / REGISTRATION ──
  if (currentRoute === 'vendor') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
        <VendorLandingPage
          onSwitchToCustomer={() => navigateTo('customer')}
          onOpenSignIn={() => setIsSignInModalOpen(true)}
          onNavigateToDashboard={() => navigateTo('vendor-dashboard')}
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

  // ── EXPERIENCE 2: CUSTOMER MOBILE-FIRST APPLICATION (Discovery & Shopping) ──
  if (Capacitor.isNativePlatform() || currentRoute === 'customer') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
        <CustomerAppPage
          currentLocation={currentLocation}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onNavigateToHome={() => navigateTo('marketing')}
          onNavigateToVendor={() => navigateTo('vendor-dashboard')}
          onOpenSignIn={() => setIsSignInModalOpen(true)}
        />
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          selectedLocation={currentLocation}
          onSelectLocation={(loc) => setCurrentLocation(loc)}
        />
        <SignInModal
          isOpen={isSignInModalOpen}
          onClose={() => setIsSignInModalOpen(false)}
          onSwitchToRetailer={() => navigateTo('vendor-dashboard')}
        />
      </div>
    );
  }

  // ── EXPERIENCE 1: PUBLIC MARKETING WEBSITE (App Promotion & Trust - Desktop Web Only) ──
  return (
    <div className="min-h-screen bg-[#070A11] text-white flex flex-col selection:bg-white selection:text-black relative">
      <Navbar
        currentLocation={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onNavigateToVendor={() => navigateTo('vendor')}
        onLaunchCustomerApp={() => navigateTo('customer')}
      />

      <main className="flex-1">
        <PublicLandingPage
          currentLocation={currentLocation}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onLaunchCustomerApp={() => navigateTo('customer')}
          onNavigateToVendor={() => navigateTo('vendor')}
        />
      </main>

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

