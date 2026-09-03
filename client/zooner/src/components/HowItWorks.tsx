import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  MessageSquare, 
  Store, 
  UploadCloud, 
  Radio, 
  ArrowRight, 
  Users, 
  Building2, 
  Sparkles 
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customer' | 'retailer'>('customer');

  const customerSteps = [
    {
      step: '01',
      title: 'Search Stock or Broadcast Request',
      description: 'Type the exact product, shoe size, or brand you need near RS Puram, Gandhipuram, or your current neighborhood.',
      icon: MapPin,
      preview: 'GPS Radar · 500m to 10km radius'
    },
    {
      step: '02',
      title: 'Get Instant Shop Replies',
      description: 'Nearby physical shop owners get notified instantly and reply with verified stock status, price quotes, and 2-hour hold options.',
      icon: Compass,
      preview: 'Live merchant responses in < 5 mins'
    },
    {
      step: '03',
      title: 'Walk In & Collect Today',
      description: 'Follow turn-by-turn store map directions. Try the product in person with zero shipping wait or return hassle.',
      icon: MessageSquare,
      preview: '0 Days delivery wait · Try before buy'
    },
  ];

  const retailerSteps = [
    {
      step: '01',
      title: 'Create your store',
      description: 'Sign up and complete your retailer profile with your shop name, physical address, business hours, and store photos.',
      icon: Store,
      preview: 'Quick verification · Zero setup fee'
    },
    {
      step: '02',
      title: 'Add your products',
      description: 'Create your digital storefront by uploading your products, sizes, prices, and in-stock counts in a few taps.',
      icon: UploadCloud,
      preview: 'Bulk CSV / barcode scan'
    },
    {
      step: '03',
      title: 'Get discovered',
      description: 'Reach customers searching for products near your store. Answer real-time product requests and turn nearby searchers into walk-in buyers.',
      icon: Radio,
      preview: 'High-intent foot traffic · Direct sales'
    },
  ];

  const activeSteps = activeTab === 'customer' ? customerSteps : retailerSteps;

  return (
    <section id="how-it-works" className="relative py-20 md:py-28 bg-slate-100/60 dark:bg-[#070A12] border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-3 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            HOW ZOONER WORKS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-4 font-['Outfit']">
            Simple. Instant. Local.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Whether you are shopping for running shoes or discovering unique boutiques, Zooner connects both sides effortlessly.
          </p>

          {/* Interactive Switcher Pill */}
          <div className="inline-flex items-center rounded-2xl bg-white dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800 mt-8 shadow-sm">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                activeTab === 'customer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>For Customers</span>
            </button>
            <button
              onClick={() => setActiveTab('retailer')}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                activeTab === 'retailer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>For Retailers</span>
            </button>
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0 -z-0" />

          {activeSteps.map((stepItem) => {
            const Icon = stepItem.icon;
            return (
              <div
                key={stepItem.step}
                className="relative z-10 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-xl dark:hover:bg-slate-900 transition-all group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Icon className="h-7 w-7 stroke-[2]" />
                    </div>
                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 font-['Outfit'] transition-colors">
                      {stepItem.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-['Outfit']">
                    {stepItem.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {stepItem.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{stepItem.preview}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
