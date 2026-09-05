import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2, 
  BarChart3, 
  MessageSquare, 
  Tag, 
  ShieldCheck,
  Plus,
  Eye
} from 'lucide-react';

interface RetailerSectionProps {
  onOpenRetailerModal: () => void;
}

export const RetailerSection: React.FC<RetailerSectionProps> = ({ onOpenRetailerModal }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'requests' | 'inventory'>('analytics');

  const retailerFeatures = [
    {
      icon: Store,
      title: 'Create Your Store',
      description: 'Build your digital storefront in under 5 minutes with your physical address, phone, photos, and opening hours.',
      highlight: 'Zero setup friction'
    },
    {
      icon: ShoppingBag,
      title: 'Showcase Products',
      description: 'Upload products, photos, prices, and live in-store stock availability. Customers see what is physically in your shop.',
      highlight: 'Barcode or quick photo upload'
    },
    {
      icon: Tag,
      title: 'Targeted Premium Advertisements',
      description: 'Upgrade to Zooner Premium to broadcast timed, location-targeted & preference-matched ads to shoppers within 5 km.',
      highlight: '⏱️ Timed • 📍 Geo-Radius • 🎯 Preference Matched'
    },
    {
      icon: MessageSquare,
      title: 'Connect With Customers',
      description: 'Receive real-time product requests from nearby customers searching for specific sizes, models, or brands.',
      highlight: 'Instant chat & hold confirmation'
    },
  ];

  return (
    <section id="retailers" className="relative py-24 md:py-32 bg-[#060911] border-t border-slate-900 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Top Header Bar */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-4 py-1.5 text-xs font-bold text-emerald-400 mb-4">
            <Store className="h-3.5 w-3.5" />
            FOR PHYSICAL RETAILERS & LOCAL SHOPS
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5 font-['Outfit']">
            Get discovered by <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              customers near you.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Turn your local store into a digital storefront and reach high-intent customers who are already looking for what you sell right outside your doors.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenRetailerModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 px-8 py-4 text-base font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              <span>Join as a Retailer</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Free 60-day trial · No commission on walk-ins
            </span>
          </div>
        </div>

        {/* Dashboard & Mobile Storefront Mockup Interactive Showcase */}
        <div className="mb-20 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between border-b border-slate-800 pb-6 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Zooner Merchant OS
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Your Store’s Command Center
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Manage inventory, see footfall analytics, and answer nearby customer queries in real-time.
              </p>
            </div>

            {/* Dashboard tabs */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-950 p-1.5 border border-slate-800">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Live Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                  activeTab === 'requests'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Customer Requests (3)</span>
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                  activeTab === 'inventory'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Catalog & Offers</span>
              </button>
            </div>
          </div>

          {/* Interactive Tab Content */}
          {activeTab === 'analytics' && (
            <div>
              {/* Stat metric cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Nearby Customer Views</span>
                    <Eye className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-['Space_Grotesk']">
                    1,240
                  </div>
                  <div className="text-xs text-emerald-400 mt-2 font-medium flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +38% vs last week (RS Puram area)
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Store Directions Requested</span>
                    <Store className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-['Space_Grotesk']">
                    84
                  </div>
                  <div className="text-xs text-cyan-400 mt-2 font-medium flex items-center gap-1">
                    <span>Direct physical walk-in intent</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Product Holds & Inquiries</span>
                    <MessageSquare className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-['Space_Grotesk']">
                    32
                  </div>
                  <div className="text-xs text-amber-400 mt-2 font-medium">
                    94% responded in &lt; 8 mins
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Estimated In-Store Revenue</span>
                    <Tag className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-['Space_Grotesk']">
                    ₹2,18,500
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    From Zooner customer walk-ins
                  </div>
                </div>
              </div>

              {/* Live Storefront Activity Feed */}
              <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Live Activity In Your Radius (Apex Footwear & Sports, RS Puram)
                </div>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-slate-300">Customer 450m away searched for <strong>Nike Pegasus UK 9</strong></span>
                    </div>
                    <span className="text-slate-500 text-xs">2 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" />
                      <span className="text-slate-300">Customer saved your <strong>Flat 25% Off In-Store</strong> offer coupon</span>
                    </div>
                    <span className="text-slate-500 text-xs">8 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="text-slate-300">New product request received: <strong>Asics Gel-Kayano size 10</strong></span>
                    </div>
                    <span className="text-emerald-400 font-semibold text-xs cursor-pointer hover:underline">Quick Reply →</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-950 border border-emerald-500/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-xs font-bold">New Request</span>
                    <span className="text-xs text-slate-400">From shopper in RS Puram (600m away)</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">Nike Pegasus 40 or Vomero in UK 9</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Budget: ₹6,000 – ₹7,500 · Ready to pick up in 1 hour</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400">
                    Confirm Available (₹6,499)
                  </button>
                  <button className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800">
                    Decline
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-800 text-slate-300 px-2 py-0.5 text-xs font-medium">Replied & Held</span>
                    <span className="text-xs text-slate-400">Shopper walking in before 7 PM</span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">Adidas Boston 12 (UK 8.5)</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Offered: ₹7,999 · Reserved for customer Arun K.</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                  Customer En Route
                </span>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Active products listed in your digital storefront: <strong>142 items</strong></span>
                <button 
                  onClick={onOpenRetailerModal}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80" alt="Nike shoe" className="h-12 w-12 rounded-lg object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white">Nike Pegasus 40</div>
                    <div className="text-[11px] text-emerald-400">In Stock: 4 units</div>
                    <div className="text-[11px] text-slate-400">₹6,499</div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=150&q=80" alt="Asics shoe" className="h-12 w-12 rounded-lg object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white">Asics Gel-Kayano 30</div>
                    <div className="text-[11px] text-amber-400">In Stock: 2 units</div>
                    <div className="text-[11px] text-slate-400">₹11,999</div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150&q=80" alt="Shirt" className="h-12 w-12 rounded-lg object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white">Performance DryFit Tee</div>
                    <div className="text-[11px] text-emerald-400">In Stock: 15 units</div>
                    <div className="text-[11px] text-slate-400">₹1,299</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {retailerFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.title}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 hover:bg-slate-900 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Step 0{index + 1}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{feat.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
