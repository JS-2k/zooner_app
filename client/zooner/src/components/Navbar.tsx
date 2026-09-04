import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, ChevronDown, ArrowRight, Sun, Moon, Store } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { LocationArea } from '../types';

interface NavbarProps {
  currentLocation: LocationArea;
  onOpenLocationModal: () => void;
  onNavigateToVendor: () => void;
  onOpenSignInModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  onOpenLocationModal,
  onNavigateToVendor,
  onOpenSignInModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Live Request', href: '#request-feature' },
    { name: 'Nearby Stores', href: '#map-discovery' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white/85 dark:bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 ${
        scrolled ? 'shadow-sm dark:shadow-md dark:shadow-black/30' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-[70px] items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Location Pill */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-slate-950">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                    <circle cx="12" cy="12" r="3.5" fill="#6366F1" />
                    <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                  </svg>
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white font-['Outfit']">
                Zooner<span className="text-indigo-600 dark:text-indigo-400">.</span>
              </span>
            </a>

            {/* Desktop Location selector badge */}
            <button
              onClick={onOpenLocationModal}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 px-3 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm cursor-pointer"
              title="Change discovery zone"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-slate-900 dark:text-white">{currentLocation.name}</span>
              <span className="text-slate-500 dark:text-slate-400 hidden xl:inline">, {currentLocation.city}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </div>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="h-9 inline-flex items-center px-3.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right: Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Dedicated For Retailers Switcher Pill */}
            <button
              onClick={onNavigateToVendor}
              className="h-9 inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/40 px-3 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all shadow-sm"
              title="Switch to Merchant / Vendor Portal"
            >
              <Store className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>For Retailers →</span>
            </button>

            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 transition-transform -rotate-12 hover:rotate-0" />
              )}
            </button>

            {/* Sign In Button */}
            <button
              onClick={onOpenSignInModal}
              className="h-9 inline-flex items-center px-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              Sign In
            </button>

            {/* Primary CTA Button */}
            <a
              href="#discover"
              className="group h-9 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 text-sm font-bold text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all hover:-translate-y-0.5"
            >
              <span>Explore Products</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Mobile & Tablet Right Bar (< lg): Compact, Evenly Aligned */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Location Pill */}
            <button
              onClick={onOpenLocationModal}
              className="h-9 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium"
            >
              <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="max-w-[75px] sm:max-w-[120px] truncate">{currentLocation.name}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Responsive Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 sm:top-[70px] bg-white/95 dark:bg-[#070A12]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 px-6 py-6 shadow-2xl lg:hidden transition-all duration-300 max-h-[calc(100vh-70px)] overflow-y-auto">
          <div className="flex flex-col space-y-3 max-w-lg mx-auto">
            
            {/* Drawer Location Row */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLocationModal();
              }}
              className="flex items-center justify-between rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 text-left transition-colors hover:border-indigo-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Current Discovery Area</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{currentLocation.name}, {currentLocation.city}</div>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline">Change</span>
            </button>

            {/* Nav Links */}
            <div className="py-2 space-y-1 border-y border-slate-100 dark:border-slate-800/80">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </a>
              ))}
            </div>

            {/* Dedicated Switcher Pill */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToVendor();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50 dark:bg-indigo-950/60 py-3 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-sm transition-colors"
            >
              <Store className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Switch to Retailer / Vendor Page →</span>
            </button>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignInModal();
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>
              <a
                href="#discover"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-colors"
              >
                <span>Explore Products</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

