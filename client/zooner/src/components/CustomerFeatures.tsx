import React from 'react';
import { Radar, Search, Heart, Send, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const CustomerFeatures: React.FC = () => {
  const features = [
    {
      id: 'discover',
      icon: Radar,
      color: 'from-indigo-500/20 to-blue-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      tag: 'Hyperlocal Discovery',
      title: 'Discover Nearby',
      description: 'Find products and retailers around your current location within walking or driving distance.',
      metric: '< 15 mins away',
      preview: [
        'GPS-precision radius filtering (1km to 15km)',
        'Live "In Stock" indicators for walk-ins',
        'Direct store navigation & WhatsApp connect'
      ]
    },
    {
      id: 'search',
      icon: Search,
      color: 'from-blue-500/20 to-cyan-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      tag: 'Multi-Filter Search',
      title: 'Search What You Need',
      description: 'Search for a specific product, category, brand, size, or budget across hundreds of local shop inventories.',
      metric: 'Real physical inventory',
      preview: [
        'Filter by exact shoe size, fit, and color',
        'Price comparison between neighborhood stores',
        'Compare authentic brand authorized dealers'
      ]
    },
    {
      id: 'save',
      icon: Heart,
      color: 'from-rose-500/20 to-pink-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30',
      tag: 'Favorite Shops',
      title: 'Save & Follow',
      description: 'Follow your favorite retailers and save products and exclusive local store offers for later.',
      metric: 'Instant restock alerts',
      preview: [
        'Get notified when a boutique drops new collections',
        'Save weekend flash offers to your pocket',
        'Keep a wishlist of local finds to try on later'
      ]
    },
    {
      id: 'request',
      icon: Send,
      color: 'from-violet-500/20 to-indigo-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30',
      tag: 'USP Feature',
      title: 'Request a Product',
      description: 'Can’t find what you’re looking for? Send a request to nearby retailers with your preferred product, size, and budget.',
      metric: '3x faster than shipping',
      preview: [
        'Broadcast request to verified physical merchants',
        'Receive instant answers & hold confirmations',
        'No endless phone calls or store hopping'
      ]
    },
  ];

  return (
    <section id="customers" className="relative py-20 md:py-28 bg-slate-100/70 dark:bg-[#070A12] border-t border-slate-200 dark:border-slate-800/80 overflow-hidden transition-colors duration-200">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
            <Zap className="h-3.5 w-3.5" />
            FOR SMART SHOPPERS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-5 font-['Outfit']">
            Your local shopping, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500 dark:from-indigo-400 dark:via-violet-300 dark:to-blue-400 bg-clip-text text-transparent">
              made smarter.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Stop searching across dozens of websites and waiting days for couriers. Discover products and stores around you based on your location and interests.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Top bar: Icon & Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} border group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/60 font-mono">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-['Outfit']">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                {/* Sub-bullets / Micro-features */}
                <div>
                  <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    {feature.preview.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Metric Pill */}
                  <div className="mt-5 pt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-transparent">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{feature.metric}</span>
                    <a href="#discover" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-semibold">
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
