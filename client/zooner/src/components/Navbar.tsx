import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, ArrowRight } from 'lucide-react';
import type { LocationArea } from '../types';

interface NavbarProps {
  currentLocation: LocationArea;
  onOpenLocationModal: () => void;
  onNavigateToVendor: () => void;
  onOpenSignInModal: () => void;
  onLaunchCustomerApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  onOpenLocationModal,
  onNavigateToVendor,
  onOpenSignInModal,
  onLaunchCustomerApp,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          
          {/* Left: Brand Logo & Location */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 group">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit']">
                zooner<span className="text-white/40">.</span>
              </span>
            </a>

            {/* Location Selector (Subtle Apple-style pill) */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenLocationModal}
              className="hidden sm:flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-full px-3 py-1.5 transition-colors cursor-pointer"
            >
              <MapPin className="h-3 w-3 text-white/50" />
              <span>{currentLocation.name || 'RS Puram, Coimbatore'}</span>
            </motion.button>
          </div>

          {/* Right: Desktop Navigation Links & Actions */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 text-xs tracking-wide text-white/60 font-medium">
              <button 
                onClick={onLaunchCustomerApp}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Customer App
              </button>
              <a 
                href="#stores" 
                className="hover:text-white transition-colors"
              >
                Local Stores
              </a>
              <button
                onClick={onNavigateToVendor}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Own a Store?
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenSignInModal}
                className="text-xs font-semibold text-white/80 hover:text-white px-3.5 py-1.5 rounded-full border border-white/[0.12] hover:border-white/30 hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                Sign In
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onLaunchCustomerApp}
                className="text-xs font-semibold text-black bg-white hover:bg-white/90 px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span>Launch App</span>
                <ArrowRight className="h-3 w-3" />
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1 text-[11px] text-white/70 bg-white/[0.05] border border-white/[0.08] rounded-full px-2.5 py-1"
            >
              <MapPin className="h-2.5 w-2.5" />
              <span className="truncate max-w-[100px]">{currentLocation.name.split(',')[0]}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-6 space-y-4 overflow-hidden"
          >
            <nav className="flex flex-col space-y-3 text-sm text-white/80">
              <a 
                href="#request" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-white/[0.05]"
              >
                Ask Nearby
              </a>
              <a 
                href="#stores" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-white/[0.05]"
              >
                Local Stores
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToVendor();
                }}
                className="text-left py-2 border-b border-white/[0.05]"
              >
                Own a Store?
              </button>
            </nav>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignInModal();
                }}
                className="w-full text-center py-2.5 text-xs font-semibold text-white bg-white/[0.06] border border-white/[0.12] rounded-xl"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToVendor();
                }}
                className="w-full text-center py-2.5 text-xs font-semibold text-black bg-white rounded-xl"
              >
                List Your Store
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

