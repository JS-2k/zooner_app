import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Store, 
  Compass, 
  CheckCircle, 
  Heart, 
  Navigation, 
  ArrowUpRight,
  Footprints,
  Shirt,
  Smartphone,
  Home,
  Sparkles,
  Dumbbell,
  ShoppingBag,
  Sparkle
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import type { Product, LocationArea } from '../types';

interface DiscoveryPreviewProps {
  currentLocation: LocationArea;
  onOpenLocationModal: () => void;
  onOpenRequestModal: (prefillProduct?: string) => void;
}

export const DiscoveryPreview: React.FC<DiscoveryPreviewProps> = ({
  currentLocation,
  onOpenLocationModal,
  onOpenRequestModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProducts(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <Footprints className="h-4 w-4" />;
      case 'Shirt': return <Shirt className="h-4 w-4" />;
      case 'Smartphone': return <Smartphone className="h-4 w-4" />;
      case 'Home': return <Home className="h-4 w-4" />;
      case 'Sparkle': return <Sparkle className="h-4 w-4" />;
      case 'Dumbbell': return <Dumbbell className="h-4 w-4" />;
      case 'ShoppingBag': return <ShoppingBag className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(prod => {
      const matchesSearch = 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.storeArea.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'all' || prod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section id="discover" className="relative py-20 md:py-32 bg-white dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
      {/* Background visual elements */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-3 shadow-sm">
              <Compass className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              LIVE INVENTORY EXPLORER
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight font-['Outfit']">
              What are you looking for?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              Real-time physical stock from verified retailers in your neighborhood. Discover, compare prices, and walk in today.
            </p>
          </div>

          {/* Interactive Location Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Current discovery zone</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Near {currentLocation.city}</div>
            </div>
            <button
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-white transition-all shadow-sm hover:border-indigo-500/40"
            >
              <MapPin className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Near {currentLocation.name}, {currentLocation.city}</span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 underline ml-1 font-bold">Change</span>
            </button>
          </div>
        </div>

        {/* Discovery Control Center: Search + Radius + Categories */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 mb-10 shadow-lg dark:shadow-2xl backdrop-blur-md">
          {/* Main Search Bar */}
          <div className="relative mb-5">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, categories (e.g. Nike running shoes, linen shirt, Nothing Phone)..."
              className="w-full rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700/80 py-3.5 sm:py-4 pl-12 sm:pl-14 pr-12 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                      : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700/50 shadow-sm'
                  }`}
                >
                  {getCategoryIcon(cat.icon)}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Status Subtitle */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span>
              Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredProducts.length}</strong> available items near <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{currentLocation.name}</strong>
            </span>
          </div>
          <span className="hidden sm:inline text-slate-500 dark:text-slate-400">
            Updated in real-time by physical store POS
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isLiked = likedProducts.includes(product.id);
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:-translate-y-1 cursor-pointer shadow-sm"
              >
                {/* Image Container */}
                <div className="relative h-56 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                  {/* Top Badges: Distance & Favorite */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/85 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/30">
                      <MapPin className="h-3 w-3" />
                      {product.distance}
                    </span>

                    <button
                      onClick={(e) => toggleLike(product.id, e)}
                      className={`rounded-full p-2 backdrop-blur-md transition-all ${
                        isLiked
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-950/70 text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                      aria-label="Save to favorites"
                    >
                      <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Availability Indicator Ribbon */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-black text-white tracking-wide uppercase">
                      <CheckCircle className="h-2.5 w-2.5 stroke-[3]" />
                      Available Nearby
                    </span>
                    {product.stockCount && (
                      <span className="rounded-md bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-slate-700/60">
                        {product.stockCount} in stock
                      </span>
                    )}
                  </div>

                  {/* Badge (Trending / New Arrival / Exclusive) */}
                  {product.badge && (
                    <div className="absolute top-3 right-12">
                      <span className="rounded-md bg-slate-900/90 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Store Name & Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                        <Store className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="truncate">{product.storeName}</span>
                      </span>
                      <span className="text-amber-500 font-bold shrink-0">
                        ★ {product.rating}
                      </span>
                    </div>

                    {/* Area tag */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium">
                      Located in <span className="text-slate-800 dark:text-slate-300 font-semibold">{product.storeArea}</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug mb-3 font-['Outfit']">
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing & Quick Action */}
                  <div>
                    {product.offerTag && (
                      <div className="mb-2 inline-block text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 rounded-md px-2 py-0.5">
                        {product.offerTag}
                      </div>
                    )}

                    <div className="flex items-baseline justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="text-lg font-black text-slate-900 dark:text-white font-['Outfit']">
                          ₹{product.price.toLocaleString()}
                        </div>
                        {product.originalPrice && (
                          <div className="text-xs text-slate-400 line-through font-medium">
                            ₹{product.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-800 dark:text-slate-300 text-xs font-bold px-3 py-2 transition-colors">
                        <span>Details</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Can't Find What You Need Prompt Bar */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-slate-100 via-indigo-50/50 to-slate-100 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 dark:text-white font-['Outfit']">Can't spot your exact model, size, or color?</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Send an instant broadcast to all verified stores in {currentLocation.name}.</div>
            </div>
          </div>
          <button
            onClick={() => onOpenRequestModal(searchQuery || 'Custom product')}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/25"
          >
            <span>Request This Product</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Physical In-Store Product
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Outfit']">
                  {selectedProduct.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name}
                className="rounded-2xl h-48 w-full object-cover border border-slate-200 dark:border-slate-800"
              />
              <div className="flex flex-col justify-between space-y-3">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/80 p-3 border border-slate-200 dark:border-slate-700/80">
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1 font-medium">
                    <Store className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    Store Location
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{selectedProduct.storeName}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">{selectedProduct.storeArea} ({selectedProduct.distance} away)</div>
                </div>

                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 p-3 border border-indigo-200 dark:border-indigo-800/60">
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 font-bold mb-1">Availability Verified</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedProduct.stockCount || 3} units available in-store
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">Ready to inspect, try on, or collect</div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Store Price</div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                    ₹{selectedProduct.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  onOpenRequestModal(selectedProduct.name);
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 py-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Hold / Inquire Size
              </button>
              <button
                onClick={() => {
                  const query = `${selectedProduct.storeName}, ${selectedProduct.storeArea}, Coimbatore`;
                  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                  setSelectedProduct(null);
                }}
                className="w-full rounded-xl bg-indigo-600 py-3 text-xs sm:text-sm font-bold text-white hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25"
              >
                <Navigation className="h-4 w-4" />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
