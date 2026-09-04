import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Send, 
  Radio, 
  Store as StoreIcon, 
  Phone, 
  Bookmark, 
  Sparkles, 
  ArrowLeft,
  X,
  Compass,
  User,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { PHYSICAL_STORES, PRODUCTS, CATEGORIES } from '../data/mockData';
import { sendLiveRequest } from '../services/api';
import type { Store, Product, LocationArea, RetailerResponse } from '../types';

interface CustomerAppPageProps {
  currentLocation: LocationArea;
  onOpenLocationModal: () => void;
  onNavigateToHome: () => void;
  onNavigateToVendor: () => void;
  onOpenSignIn: () => void;
}

type TabType = 'discover' | 'search' | 'requests' | 'saved' | 'profile';

export const CustomerAppPage: React.FC<CustomerAppPageProps> = ({
  currentLocation,
  onOpenLocationModal,
  onNavigateToHome,
  onNavigateToVendor,
  onOpenSignIn
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [radiusFilter, setRadiusFilter] = useState<'2km' | '5km' | '10km'>('5km');
  const [inStockOnly, setInStockOnly] = useState(true);
  
  // Selected Store / Product Detail Modal State
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Active Holds / Saved Items
  const [activeHolds, setActiveHolds] = useState<{ id: string; name: string; store: string; expires: string }[]>([
    {
      id: 'hold-1',
      name: 'Nike Air Max 270 (UK 9)',
      store: 'Nike Store · DB Road',
      expires: '24 mins remaining'
    }
  ]);
  const [savedStores, setSavedStores] = useState<string[]>(['store-nike-dbroad', 'store-croma-rspuram']);

  // Live Broadcast State
  const [broadcastProduct, setBroadcastProduct] = useState('Nike Pegasus UK 9');
  const [broadcastSize, setBroadcastSize] = useState('UK 9');
  const [broadcastRadius, setBroadcastRadius] = useState('Within 5 km');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [liveResponses, setLiveResponses] = useState<RetailerResponse[]>([]);

  // Filtered Products based on Search Query & Category
  const filteredProducts = PRODUCTS.filter(prod => {
    const matchesQuery = searchQuery === '' || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      prod.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesStock = !inStockOnly || prod.inStock;

    return matchesQuery && matchesCategory && matchesStock;
  });

  // Filtered Stores based on Search Query & Category
  const filteredStores = PHYSICAL_STORES.filter(st => {
    const matchesQuery = searchQuery === '' ||
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' ||
      st.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesQuery && matchesCategory;
  });

  // Broadcast Live Request Handler
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);

    const result = await sendLiveRequest({
      productName: `${broadcastProduct} (${broadcastSize})`,
      radiusKm: parseInt(broadcastRadius) || 5,
      latitude: currentLocation.lat || 11.0168,
      longitude: currentLocation.lng || 76.9558
    });

    setIsBroadcasting(false);
    setBroadcastSent(true);

    if (result && Array.isArray(result.responses) && result.responses.length > 0) {
      setLiveResponses(result.responses);
    } else {
      setLiveResponses([
        {
          id: 'resp-live-1',
          storeName: 'Nike Store · DB Road',
          storeArea: 'RS Puram',
          distance: '350m',
          price: 6499,
          available: true,
          conditionNote: '2 pairs on shelf! Reserved 1 pair for you on counter.',
          rating: 4.9,
          verified: true,
          avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&q=80',
        },
        {
          id: 'resp-live-2',
          storeName: 'Sprint Sports Hub',
          storeArea: 'Race Course',
          distance: '900m',
          price: 6299,
          available: true,
          conditionNote: 'In stock in Black/White. Held for 2 hours for walk-in.',
          rating: 4.8,
          verified: true,
          avatar: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=120&q=80',
        }
      ]);
    }
  };

  const toggleSaveStore = (storeId: string) => {
    setSavedStores(prev => 
      prev.includes(storeId) ? prev.filter(id => id !== storeId) : [...prev, storeId]
    );
  };

  const handleHoldItem = (prodName: string, storeName: string) => {
    const newHold = {
      id: `hold-${Date.now()}`,
      name: prodName,
      store: storeName,
      expires: '30 mins remaining'
    };
    setActiveHolds(prev => [newHold, ...prev]);
    alert(`✓ Hold active! "${prodName}" reserved at ${storeName} for 30 minutes.`);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col selection:bg-white selection:text-black pb-24 md:pb-12">
      
      {/* ── TOP APP BAR (Compact, Native Feel) ── */}
      <header className="sticky top-0 z-40 bg-[#0c0c10]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Switcher */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateToHome}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
              title="Back to Public Website"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Site</span>
            </button>

            <span className="text-lg sm:text-xl font-black tracking-tight text-white font-['Outfit']">
              zooner<span className="text-indigo-400">.</span>
            </span>

            <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              App
            </span>
          </div>

          {/* Location Trigger */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] text-xs font-semibold text-white/90 cursor-pointer"
          >
            <MapPin className="h-3 w-3 text-emerald-400" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">{currentLocation.name}</span>
          </motion.button>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToVendor}
              className="hidden sm:inline-flex text-xs font-semibold text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              Store Portal
            </button>
            <button
              onClick={onOpenSignIn}
              className="flex items-center gap-1.5 text-xs font-bold text-black bg-white hover:bg-white/90 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN APP VIEW CONTAINER ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6">
        
        {/* Active Holds Notification Bar (If any) */}
        {activeHolds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-3.5 flex items-center justify-between text-xs text-emerald-300"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">Active Counter Hold:</span>
              <span className="text-white truncate">{activeHolds[0].name} at {activeHolds[0].store}</span>
            </div>
            <span className="font-mono text-emerald-400 shrink-0 font-bold">{activeHolds[0].expires}</span>
          </motion.div>
        )}

        {/* ── SEARCH BAR (Prominent, Quick Action) ── */}
        <div className="relative">
          <div className="flex items-center bg-white/[0.06] hover:bg-white/[0.09] focus-within:bg-white/[0.1] border border-white/[0.12] focus-within:border-white/40 rounded-2xl p-2 pl-4 transition-all shadow-xl backdrop-blur-md">
            <Search className="h-4 w-4 text-white/40 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for nearby? (e.g. Nike shoes, Titan watch, Philips bulb, iPhone)"
              className="w-full bg-transparent text-white placeholder-white/40 text-sm font-normal focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 text-white/40 hover:text-white mr-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── CATEGORY PILLS ── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-white text-black shadow-md' 
                    : 'bg-white/[0.04] text-white/60 hover:text-white border border-white/[0.06]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT: DISCOVER / SEARCH ── */}
        {(activeTab === 'discover' || activeTab === 'search') && (
          <div className="space-y-8">
            
            {/* Quick Filters Bar */}
            <div className="flex items-center justify-between text-xs text-white/50 border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white/70 flex items-center gap-1">
                  <SlidersHorizontal className="h-3 w-3" /> Filters:
                </span>
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    inStockOnly 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' 
                      : 'border-white/10 text-white/40'
                  }`}
                >
                  ✓ In Stock Only
                </button>
                <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.06]">
                  {(['2km', '5km', '10km'] as const).map(rad => (
                    <button
                      key={rad}
                      onClick={() => setRadiusFilter(rad)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        radiusFilter === rad ? 'bg-white text-black font-bold' : 'text-white/40'
                      }`}
                    >
                      {rad}
                    </button>
                  ))}
                </div>
              </div>

              <span>{filteredProducts.length} Items · {filteredStores.length} Stores</span>
            </div>

            {/* Verified Shelf Products Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  Verified On-Shelf Nearby
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -3 }}
                    onClick={() => setSelectedProduct(product)}
                    className="rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 p-4 space-y-3 cursor-pointer transition-all shadow-lg group"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        <span>{product.stockCount} in stock</span>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono text-white/80">
                        {product.distance}
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <div className="text-xs text-white/40">{product.storeName} · {product.storeArea}</div>
                      <h4 className="font-bold text-white text-sm leading-snug line-clamp-1">{product.name}</h4>
                      
                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="text-base font-black text-white font-['Outfit']">₹{product.price.toLocaleString('en-IN')}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-white/40 line-through ml-1.5">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded">
                          {product.badge || 'Verified'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHoldItem(product.name, product.storeName);
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 transition-colors"
                      >
                        Hold for 30m
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${product.storeName}, ${product.storeArea}, Coimbatore`)}`, '_blank');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-white/80 flex items-center gap-1"
                      >
                        <Navigation className="h-3 w-3" />
                        <span>Map</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Nearby Verified Physical Stores List */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                  <StoreIcon className="h-4 w-4 text-indigo-400" />
                  Verified Physical Stores Nearby
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredStores.map(store => {
                  const isSaved = savedStores.includes(store.id);
                  return (
                    <motion.div
                      key={store.id}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedStore(store)}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer text-left space-y-3 shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-white text-base">{store.name}</h4>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          </div>
                          <p className="text-xs text-white/50 mt-0.5">{store.category} · {store.area}</p>
                          <p className="text-[11px] text-white/40 mt-1 truncate max-w-xs">{store.address}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-white/90 bg-white/[0.08] px-2.5 py-1 rounded-full font-mono">
                            {store.distance}
                          </span>
                          <span className="block text-[10px] text-emerald-400 font-semibold mt-1">
                            {store.openStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {store.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-white/60 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.04]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveStore(store.id);
                          }}
                          className={`flex items-center gap-1 text-xs font-semibold ${
                            isSaved ? 'text-indigo-400' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-indigo-400' : ''}`} />
                          <span>{isSaved ? 'Saved' : 'Save Store'}</span>
                        </button>

                        <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>View Shelf Catalog</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB CONTENT: REQUESTS (Broadcasting) ── */}
        {activeTab === 'requests' && (
          <div className="space-y-6 text-left max-w-2xl mx-auto">
            
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 block">
                Direct Merchant Broadcast
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
                Ask all nearby stores in 1 click
              </h2>
              <p className="text-sm text-white/60">
                Can't find your exact size or model on the shelf? Broadcast what you need to local store managers.
              </p>
            </div>

            {/* Broadcast Form */}
            <form onSubmit={handleBroadcast} className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-xl">
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1.5">Product Name & Model</label>
                <input
                  type="text"
                  value={broadcastProduct}
                  onChange={(e) => setBroadcastProduct(e.target.value)}
                  placeholder="e.g. Nike Air Pegasus 40, Titan Edge watch"
                  className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-white/40 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">Size / Fit</label>
                  <input
                    type="text"
                    value={broadcastSize}
                    onChange={(e) => setBroadcastSize(e.target.value)}
                    placeholder="e.g. UK 9, 256GB"
                    className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-white/40 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">Search Radius</label>
                  <select
                    value={broadcastRadius}
                    onChange={(e) => setBroadcastRadius(e.target.value)}
                    className="w-full bg-[#121216] border border-white/[0.1] focus:border-white/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  >
                    <option value="Within 2 km">Within 2 km</option>
                    <option value="Within 5 km">Within 5 km</option>
                    <option value="Within 10 km">Within 10 km</option>
                  </select>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isBroadcasting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isBroadcasting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    <span>Pinging Verified Shops Nearby…</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Broadcast Live Request</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Broadcast Results */}
            {broadcastSent && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-white/50 pb-2 border-b border-white/[0.06]">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                    <Radio className="h-3 w-3 animate-pulse" />
                    Live Responses Feed
                  </span>
                  <span>{liveResponses.length} Shops Confirmed</span>
                </div>

                {liveResponses.map(resp => (
                  <motion.div
                    key={resp.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.1] space-y-2.5 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                          <span>{resp.storeName}</span>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <span className="text-xs text-white/40">{resp.storeArea} · {resp.distance} away</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-white">₹{resp.price.toLocaleString('en-IN')}</span>
                        <span className="block text-[10px] text-emerald-400 font-medium">In Stock</span>
                      </div>
                    </div>

                    <p className="text-xs text-white/70 italic bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
                      "{resp.conditionNote}"
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleHoldItem(broadcastProduct, resp.storeName)}
                        className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-white/90 transition-colors shadow"
                      >
                        Hold for Walk-in (30m)
                      </button>
                      <button
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${resp.storeName}, ${resp.storeArea}, Coimbatore`)}`, '_blank')}
                        className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1"
                      >
                        <Navigation className="h-3 w-3" />
                        <span>Directions</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ── TAB CONTENT: PROFILE & SAVED ── */}
        {(activeTab === 'saved' || activeTab === 'profile') && (
          <div className="space-y-6 text-left max-w-2xl mx-auto">
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white font-['Outfit']">Your Activity</h2>
              <p className="text-xs text-white/50">Active holds, saved stores, and past requests.</p>
            </div>

            {/* Active Holds Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Active Walk-in Holds</h3>
              {activeHolds.length > 0 ? (
                activeHolds.map(h => (
                  <div key={h.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{h.name}</div>
                      <div className="text-xs text-white/50">{h.store}</div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                      {h.expires}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center bg-white/[0.02] rounded-2xl text-xs text-white/40">No active holds.</div>
              )}
            </div>

            {/* Saved Stores */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Saved Stores</h3>
              {savedStores.map(storeId => {
                const st = PHYSICAL_STORES.find(s => s.id === storeId);
                if (!st) return null;
                return (
                  <div key={st.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{st.name}</div>
                      <div className="text-xs text-white/50">{st.address}</div>
                    </div>
                    <button
                      onClick={() => toggleSaveStore(st.id)}
                      className="text-xs text-red-400/80 hover:text-red-400 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </main>

      {/* ── STORE DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedStore && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0f0f13] border border-white/[0.12] rounded-3xl p-6 space-y-5 text-left shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold text-white font-['Outfit']">{selectedStore.name}</h3>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-white/50">{selectedStore.category} · {selectedStore.area}</p>
                </div>
                <button 
                  onClick={() => setSelectedStore(null)}
                  className="p-1.5 text-white/50 hover:text-white rounded-full bg-white/[0.06]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-white/70 bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{selectedStore.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-white/50" />
                  <span>{selectedStore.openStatus}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-white/50" />
                  <span>+91 422 254 8890 (Counter Desk)</span>
                </div>
              </div>

              {/* Verified Products in this Store */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">Shelf Catalog Available Today</h4>
                <div className="space-y-2">
                  {PRODUCTS.filter(p => p.storeName.includes(selectedStore.name.split('·')[0].trim())).map(p => (
                    <div key={p.id} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{p.name}</div>
                        <div className="text-[11px] text-emerald-400">₹{p.price.toLocaleString('en-IN')} · In Stock</div>
                      </div>
                      <button
                        onClick={() => handleHoldItem(p.name, selectedStore.name)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white text-black hover:bg-white/90"
                      >
                        Hold 30m
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${selectedStore.name}, ${selectedStore.address}, Coimbatore`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-xs text-center flex items-center justify-center gap-1.5 hover:bg-white/90"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Get Walking Directions</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── PRODUCT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0f0f13] border border-white/[0.12] rounded-3xl p-6 space-y-4 text-left shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">{selectedProduct.badge || 'Verified Stock'}</span>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">{selectedProduct.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 text-white/50 hover:text-white rounded-full bg-white/[0.06]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-white">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-xs text-white/40 line-through ml-2">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <span className="text-xs text-emerald-400 font-semibold">{selectedProduct.stockCount} Pairs on Counter</span>
              </div>

              <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs space-y-1">
                <div className="font-bold text-white">{selectedProduct.storeName}</div>
                <div className="text-white/50">{selectedProduct.storeArea} · {selectedProduct.distance} away (4 min walk)</div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    handleHoldItem(selectedProduct.name, selectedProduct.storeName);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90"
                >
                  Hold 30 Mins for Walk-in
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedProduct.storeName}, Coimbatore`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white hover:bg-white/[0.12]"
                >
                  <Navigation className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (iOS / Android Style) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c10]/95 backdrop-blur-2xl border-t border-white/[0.08] px-6 py-2.5 flex items-center justify-around md:hidden">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            activeTab === 'discover' ? 'text-white font-bold' : 'text-white/40'
          }`}
        >
          <Compass className="h-5 w-5" />
          <span>Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors relative ${
            activeTab === 'requests' ? 'text-white font-bold' : 'text-white/40'
          }`}
        >
          <Radio className="h-5 w-5" />
          <span>Live Ask</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            activeTab === 'saved' ? 'text-white font-bold' : 'text-white/40'
          }`}
        >
          <Bookmark className="h-5 w-5" />
          <span>Saved</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            activeTab === 'profile' ? 'text-white font-bold' : 'text-white/40'
          }`}
        >
          <User className="h-5 w-5" />
          <span>Activity</span>
        </button>
      </nav>

    </div>
  );
};
