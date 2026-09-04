import React from 'react';
import { ArrowRight } from 'lucide-react';

interface RetailerCalloutProps {
  onOpenRetailerModal: () => void;
  onNavigateToVendor: () => void;
}

export const RetailerCallout: React.FC<RetailerCalloutProps> = ({
  onNavigateToVendor,
}) => {
  return (
    <section className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#08080a] text-white border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-4xl mx-auto text-left space-y-10">
        
        <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
          05 / For Merchants
        </span>

        <div className="space-y-4">
          <h2 
            className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
            style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
          >
            Own a store?
          </h2>

          <p className="text-white/60 text-base sm:text-xl font-normal max-w-xl leading-relaxed">
            Let people nearby discover what you already have on your shelves.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">High-Intent Foot Traffic</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Connect directly with shoppers who are ready to walk into your store right now.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Zero Setup Fees</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Create your digital storefront in minutes. No complex hardware or expensive POS integrations.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Direct Local Sales</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Answer live product requests and turn nearby searchers into loyal in-person customers.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onNavigateToVendor}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-all cursor-pointer shadow-xl hover:scale-105"
          >
            <span>List your store</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
