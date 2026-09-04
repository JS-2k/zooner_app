import React from 'react';
import { PackageX, Store } from 'lucide-react';

export const TheProblem: React.FC = () => {
  return (
    <section className="relative py-28 sm:py-36 px-6 sm:px-8 bg-[#08080a] text-white border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-4xl mx-auto text-left space-y-12">
        
        {/* Editorial Subtitle */}
        <span className="text-xs font-mono uppercase tracking-widest text-white/40 block">
          01 / The Problem
        </span>

        {/* Massive Headline */}
        <h2 
          className="font-['Outfit'] font-black tracking-tighter text-white leading-[1.0]"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}
        >
          Sometimes tomorrow <br />
          isn't good enough.
        </h2>

        {/* Narrative Copy */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-white/60 text-base sm:text-lg leading-relaxed pt-2">
          <p className="md:col-span-6 font-normal">
            Online shopping taught us to wait 3 to 5 days for a cardboard box. We accept delivery delays, wrong sizes, and return hassles as normal.
          </p>
          <p className="md:col-span-6 font-normal text-white/80">
            Yet, in every neighborhood, physical retail stores already have the shoes, watches, electronics, and clothes sitting ready on their shelves. You just need to know who has it in stock.
          </p>
        </div>

        {/* Two-Way Comparison Statement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase">
              <PackageX className="h-4 w-4" />
              <span>Online E-Commerce</span>
            </div>
            <div className="text-xl font-bold text-white/50">3 to 5 Days Waiting</div>
            <p className="text-xs text-white/40">Tracking numbers, delayed shipping, wrong fits & return courier pickups.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/[0.12] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase">
              <Store className="h-4 w-4" />
              <span>With Zooner</span>
            </div>
            <div className="text-xl font-bold text-white">Walk In & Take It Home Today</div>
            <p className="text-xs text-white/60">Verified nearby stock, 4-minute walk, try before paying.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
