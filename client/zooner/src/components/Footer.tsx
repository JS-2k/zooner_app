import React from 'react';
import { ArrowUp, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenRetailerModal: () => void;
  onOpenLocationModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRetailerModal, onOpenLocationModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 p-0.5 shadow-md shadow-indigo-600/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                  <svg className="h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
                    <circle cx="12" cy="12" r="4" fill="#6366F1" />
                    <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
                  </svg>
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">
                Zooner<span className="text-indigo-400">.</span>
              </span>
            </a>

            <p className="text-sm text-slate-300 font-medium mb-3">
              Discover locally. Shop smarter.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6">
              The local product discovery platform that bridges high-intent shoppers with nearby physical retailers. Check shelf inventory before stepping outside.
            </p>

            {/* Live discovery cities badge */}
            <button
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-indigo-500/40 transition-colors text-left"
            >
              <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>Active in <strong>Coimbatore</strong> & expanding across South India</span>
            </button>
          </div>

          {/* Col 1: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#discover" className="hover:text-indigo-400 transition-colors">
                  Discover Products
                </a>
              </li>
              <li>
                <a href="#customers" className="hover:text-indigo-400 transition-colors">
                  For Customers
                </a>
              </li>
              <li>
                <button onClick={onOpenRetailerModal} className="hover:text-indigo-400 transition-colors text-left">
                  For Retailers (Portal)
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#request-feature" className="hover:text-indigo-400 transition-colors">
                  Product Request
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Retailers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              For Retailers
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={onOpenRetailerModal} className="hover:text-indigo-400 transition-colors text-left font-bold text-indigo-400">
                  Join as a Retailer →
                </button>
              </li>
              <li>
                <button onClick={onOpenRetailerModal} className="hover:text-indigo-400 transition-colors text-left">
                  Merchant App Demo
                </button>
              </li>
              <li>
                <button onClick={onOpenRetailerModal} className="hover:text-indigo-400 transition-colors text-left">
                  Store Footfall Analytics
                </button>
              </li>
              <li>
                <button onClick={onOpenRetailerModal} className="hover:text-indigo-400 transition-colors text-left">
                  Broadcast Flash Offers
                </button>
              </li>
              <li>
                <button onClick={onOpenRetailerModal} className="hover:text-indigo-400 transition-colors text-left">
                  Customer Request Stream
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#customers" className="hover:text-indigo-400 transition-colors">
                  About Zooner
                </a>
              </li>
              <li>
                <a href="mailto:support@zooner.in" className="hover:text-indigo-400 transition-colors">
                  Contact & Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Merchant Verification
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and social row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Zooner Technologies Inc. All rights reserved.</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter / X" className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors">
              <svg className="h-3.5 w-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors">
              <svg className="h-3.5 w-3.5 stroke-currentColor fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors">
              <svg className="h-3.5 w-3.5 fill-currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.92 0 1.66-.74 1.66-1.66 0-.92-.74-1.66-1.66-1.66-.92 0-1.66.74-1.66 1.66 0 .92.74 1.66 1.66 1.66m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
              </svg>
            </a>
            <button
              onClick={scrollToTop}
              className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors ml-2"
              title="Back to Top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
