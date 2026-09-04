import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, ArrowRight } from 'lucide-react';
import type { LocationArea } from '../types';

interface NavbarProps {
  currentLocation: LocationArea;
  onOpenLocationModal: () => void;
  onNavigateToVendor: () => void;
  onLaunchCustomerApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  onOpenLocationModal,
  onNavigateToVendor,
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
          ? 'bg-[#0A0E17]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-black/40' 
          : 'bg-[#0A0E17]/60 backdrop-blur-md border-b border-slate-800/40'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          
          {/* Left: Brand Logo & Location */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 group">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit']">
                zooner<span className="text-indigo-400">.</span>
              </span>
            </a>

            {/* Location Selector (Apple-style luminous pill) */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenLocationModal}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-full px-3.5 py-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <MapPin className="h-3 w-3 text-emerald-400" />
              <span className="font-medium">{currentLocation.name || 'RS Puram, Coimbatore'}</span>
            </motion.button>
          </div>

          {/* Right: Desktop Navigation Links & Actions */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 text-sm tracking-wide text-slate-300 font-medium">
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
                onClick={onLaunchCustomerApp}
                className="text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 px-5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-white/10"
              >
                <span>Launch App</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1 text-xs text-slate-200 bg-slate-800/80 border border-slate-700 rounded-full px-3 py-1 font-medium"
            >
              <MapPin className="h-3 w-3 text-emerald-400" />
              <span className="truncate max-w-[100px]">{currentLocation.name.split(',')[0]}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
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
            className="md:hidden bg-[#0D1322]/98 backdrop-blur-2xl border-b border-slate-800 px-6 py-6 space-y-4 overflow-hidden"
          >
            <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-200">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchCustomerApp?.();
                }}
                className="text-left py-2 border-b border-slate-800 flex items-center justify-between"
              >
                <span>Customer App</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
              <a 
                href="#stores" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-800"
              >
                Local Stores
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToVendor();
                }}
                className="text-left py-2 border-b border-slate-800"
              >
                Own a Store?
              </button>
            </nav>

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLaunchCustomerApp?.();
                }}
                className="w-full text-center py-3 text-xs font-bold text-slate-950 bg-white rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Launch App</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

