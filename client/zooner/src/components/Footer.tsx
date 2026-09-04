import React from 'react';
import { MapPin, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenRetailerModal: () => void;
  onOpenLocationModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRetailerModal, onOpenLocationModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050507] border-t border-white/[0.06] pt-20 pb-14 px-6 sm:px-8 text-white/50 text-xs selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4 text-left">
            <span className="text-xl font-black text-white font-['Outfit'] block">
              zooner<span className="text-white/40">.</span>
            </span>
            
            <p className="text-white/60 text-sm max-w-sm leading-relaxed">
              The local product discovery platform connecting shoppers with real in-store stock across physical retailers.
            </p>

            <button
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
            >
              <MapPin className="h-3 w-3 text-white/40" />
              <span>Active in <strong>Coimbatore</strong> & expanding</span>
            </button>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 text-left space-y-3">
            <span className="font-semibold text-white/90 block">Navigation</span>
            <ul className="space-y-2 text-white/50">
              <li>
                <a href="#" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#request" className="hover:text-white transition-colors">Ask Nearby</a>
              </li>
              <li>
                <a href="#stores" className="hover:text-white transition-colors">Local Stores</a>
              </li>
            </ul>
          </div>

          {/* Merchants */}
          <div className="md:col-span-3 text-left space-y-3">
            <span className="font-semibold text-white/90 block">For Stores</span>
            <ul className="space-y-2 text-white/50">
              <li>
                <button 
                  onClick={onOpenRetailerModal}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  List your inventory
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenRetailerModal}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Merchant Portal
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <div>
            © {new Date().getFullYear()} Zooner Technologies Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
