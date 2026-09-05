import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Send, 
  Radio, 
  Phone, 
  Bookmark, 
  ArrowLeft,
  X, 
  Compass, 
  User, 
  SlidersHorizontal, 
  ChevronRight,
  MessageSquare,
  Store as StoreIcon
} from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { fetchShops, fetchCategories, sendLiveRequest, searchProducts, reserveInventoryHold } from '../services/api';
import { HoldPassSheet, type HoldPass } from '../components/HoldPassSheet';
import { DirectChatDrawer } from '../components/DirectChatDrawer';
import { MobileWelcomeModal } from '../components/MobileWelcomeModal';
import type { Store, Product, LocationArea, RetailerResponse } from '../types';

interface CustomerAppPageProps {
  currentLocation: LocationArea;
  onOpenLocationModal: () => void;
  onNavigateToHome: () => void;
  onNavigateToVendor: () => void;
  onOpenSignIn: (roleHint?: 'C' | 'V' | 'VC') => void;
}

type TabType = 'discover' | 'requests' | 'holds' | 'account';

export const CustomerAppPage: React.FC<CustomerAppPageProps> = ({
  currentLocation,
  onOpenLocationModal,
  onNavigateToHome,
  onNavigateToVendor,
  onOpenSignIn,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(() => {
    const saved = localStorage.getItem('zooner_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });

  useEffect(() => {
    const syncUser = () => {
      const saved = localStorage.getItem('zooner_user_profile');
      if (saved) {
        try { setUserProfile(JSON.parse(saved)); } catch {}
      } else {
        setUserProfile(null);
      }
    };
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const isVendor = userProfile && (
    userProfile.role === 'V' || 
    userProfile.role === 'VC' || 
    userProfile.role === 'Vendor' || 
    userProfile.role === 'ShopOwner' || 
    userProfile.isVendor
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [radiusFilter, setRadiusFilter] = useState<'2km' | '5km' | '10km' | '15km'>('5km');
  const [inStockOnly, setInStockOnly] = useState(true);

  const [liveStores, setLiveStores] = useState<Store[]>([]);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<{ id: string; label: string }[]>([
    { id: 'all', label: 'All Categories' }
  ]);

  // Fetch Live Database Data from API (Supabase)
  useEffect(() => {
    async function loadLiveData() {
      try {
        const [shopsData, categoriesData] = await Promise.all([
          fetchShops(currentLocation.lat, currentLocation.lng),
          fetchCategories()
        ]);

        if (shopsData && shopsData.length > 0) {
          const formatted: Store[] = shopsData.map((s: any) => ({
            id: s.id,
            name: s.name,
            category: s.categoryName || 'General Store',
            area: s.address || s.city || 'Local Area',
            address: s.address || s.city || '',
            phone: s.phone || '',
            openStatus: s.isOpen ? 'Open Now' : 'Closed',
            verified: s.isVerified ?? true,
            rating: s.rating || 4.9,
            reviewCount: 24,
            tags: s.tags ? s.tags.split(',') : ['verified', 'store'],
            latitude: s.latitude,
            longitude: s.longitude,
            distance: s.distanceKm ? `${s.distanceKm.toFixed(1)} km` : '350m'
          }));
          setLiveStores(formatted);

          const prods: Product[] = [];
          shopsData.forEach((s: any) => {
            if (Array.isArray(s.products)) {
              s.products.forEach((p: any) => {
                prods.push({
                  id: p.id,
                  name: p.name,
                  category: s.categoryName || 'General',
                  price: p.price,
                  originalPrice: p.originalPrice,
                  storeName: s.name,
                  storeArea: s.address || s.city || 'Local Area',
                  distance: s.distanceKm ? `${s.distanceKm.toFixed(1)} km` : '350m',
                  inStock: p.inStock ?? true,
                  stockCount: p.stockCount || 5,
                  imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
                  rating: 4.8,
                  reviewsCount: 12
                });
              });
            }
          });
          setLiveProducts(prods);
        }

        if (categoriesData && categoriesData.length > 0) {
          setCategoriesList([
            { id: 'all', label: 'All Categories' },
            ...categoriesData.map((c: any) => ({
              id: c.name,
              label: c.name
            }))
          ]);
        }
      } catch (err) {
        console.error('API live fetch:', err);
      }
    }
    loadLiveData();
  }, [currentLocation]);

  // 300ms Search Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Global Canonical Product Catalog State
  const [canonicalProducts, setCanonicalProducts] = useState<any[]>([]);
  const [isSearchingCanonical, setIsSearchingCanonical] = useState<boolean>(false);
  const [selectedCanonicalProduct, setSelectedCanonicalProduct] = useState<any | null>(null);

  // Fetch Global Product Catalog results
  const refreshCanonicalSearch = async () => {
    setIsSearchingCanonical(true);
    try {
      const results = await searchProducts(
        debouncedQuery,
        selectedCategory,
        currentLocation.lat,
        currentLocation.lng
      );
      setCanonicalProducts(results);
    } catch (err) {
      console.error('Error fetching global catalog:', err);
    } finally {
      setIsSearchingCanonical(false);
    }
  };

  useEffect(() => {
    refreshCanonicalSearch();
  }, [debouncedQuery, selectedCategory, currentLocation]);

  // Hold reservation for a specific store inventory item
  const handleHoldStoreInventory = async (
    storeInventoryId: string,
    productName: string,
    storeName: string,
    price: number,
    storeAddress?: string,
    storePhone?: string
  ) => {
    // 1. Call backend API to reserve hold (decrements AvailableQuantity)
    // Find carrying store from canonical search results to get storeId
    const carryingStore = selectedCanonicalProduct?.carryingStores?.find((s: any) => s.storeInventoryId.toString() === storeInventoryId.toString());
    const storeId = carryingStore ? carryingStore.storeId.toString() : '1';

    await reserveInventoryHold(storeId, storeInventoryId.toString(), 1);
    
    // 2. Generate local pass ticket sheet
    handleHoldItem(productName, storeName, price, storeAddress, storePhone);

    // 3. Refresh search data
    refreshCanonicalSearch();

    // 4. Close canonical product detail modal if open
    if (selectedCanonicalProduct) {
      setSelectedCanonicalProduct(null);
    }
  };

  // Selected Store / Product Detail State
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Active Hold Passes (persisted in localStorage)
  const [holds, setHolds] = useState<HoldPass[]>(() => {
    const saved = localStorage.getItem('zooner_customer_holds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Sheet & Drawer States
  const [selectedPassForSheet, setSelectedPassForSheet] = useState<HoldPass | null>(null);
  const [chatPass, setChatPass] = useState<HoldPass | null>(null);

  // Customer Profile (Counter Identity)
  const [customerProfile, setCustomerProfile] = useState<{ name: string; phone: string }>(() => {
    const saved = localStorage.getItem('zooner_customer_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return { name: 'Karthik S.', phone: '+91 98422 12345' };
  });
  const [profileSavedFeedback, setProfileSavedFeedback] = useState(false);

  // Saved Stores
  const [savedStores, setSavedStores] = useState<string[]>(() => {
    const saved = localStorage.getItem('zooner_saved_stores');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return ['store-nike-dbroad', 'store-croma-rspuram'];
  });

  // Live Broadcast State
  const [broadcastProduct, setBroadcastProduct] = useState('');
  const [broadcastSize, setBroadcastSize] = useState('UK 9');
  const [broadcastRadius, setBroadcastRadius] = useState('5 km');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [liveResponses, setLiveResponses] = useState<RetailerResponse[]>([]);

  // Sync holds to localStorage
  const saveHolds = (updated: HoldPass[]) => {
    setHolds(updated);
    localStorage.setItem('zooner_customer_holds', JSON.stringify(updated));
  };

  const handleHoldItem = (
    prodName: string, 
    storeName: string, 
    price: number = 0,
    storeAddress?: string,
    storePhone?: string
  ) => {
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const now = Date.now();
    const matchingStore = liveStores.find((s: Store) => 
      s.name.toLowerCase().includes(storeName.toLowerCase().split('·')[0].trim())
    );

    const newPass: HoldPass = {
      id: `hold-${now}`,
      passCode: `ZN-${codeNum}`,
      productName: prodName,
      storeName: storeName,
      storeAddress: storeAddress || matchingStore?.address || '142 DB Road, RS Puram, Coimbatore',
      storePhone: storePhone || '+91 422 254 8890',
      storeClosing: matchingStore?.openStatus || 'Open until 9:30 PM',
      price: price || 6499,
      customerName: customerProfile.name || 'Customer',
      customerPhone: customerProfile.phone || '+91 98422 12345',
      createdAt: now,
      expiresAt: now + 30 * 60 * 1000,
      status: 'active'
    };

    const updated = [newPass, ...holds];
    saveHolds(updated);
    setSelectedPassForSheet(newPass);
  };

  const handleCancelHold = (passId: string) => {
    const updated = holds.map(h => h.id === passId ? { ...h, status: 'cancelled' as const } : h);
    saveHolds(updated);
  };

  const toggleSaveStore = (storeId: string) => {
    setSavedStores(prev => {
      const next = prev.includes(storeId) ? prev.filter(id => id !== storeId) : [...prev, storeId];
      localStorage.setItem('zooner_saved_stores', JSON.stringify(next));
      return next;
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('zooner_customer_profile', JSON.stringify(customerProfile));
    setProfileSavedFeedback(true);
    setTimeout(() => setProfileSavedFeedback(false), 2000);
  };

  // Broadcast Live Request Handler
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastProduct.trim()) return;
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
      setLiveResponses([]);
    }
  };

  // Radius limit parsing (numeric km)
  const maxRadiusKm = parseInt(radiusFilter) || 5;

  // Products filtering based on query, category, and radius
  const filteredProducts = liveProducts.filter(prod => {
    const matchesQuery = debouncedQuery === '' || 
      prod.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      prod.storeName.toLowerCase().includes(debouncedQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      prod.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(prod.category.toLowerCase());

    const matchesStock = !inStockOnly || prod.inStock;

    // Radius distance check (e.g. "350m", "1.2 km")
    let prodDistanceKm = 1.0;
    if (prod.distance) {
      if (prod.distance.includes('km')) {
        prodDistanceKm = parseFloat(prod.distance) || 1.0;
      } else if (prod.distance.includes('m')) {
        prodDistanceKm = (parseFloat(prod.distance) || 300) / 1000;
      }
    }
    const matchesRadius = prodDistanceKm <= maxRadiusKm;

    return matchesQuery && matchesCategory && matchesStock && matchesRadius;
  });

  // Stores filtering
  const filteredStores = liveStores.filter(st => {
    const matchesQuery = debouncedQuery === '' ||
      st.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      st.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      st.tags.some(t => t.toLowerCase().includes(debouncedQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' ||
      st.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(st.category.toLowerCase());

    let storeDistanceKm = 1.0;
    if (st.distance) {
      if (st.distance.includes('km')) {
        storeDistanceKm = parseFloat(st.distance) || 1.0;
      } else if (st.distance.includes('m')) {
        storeDistanceKm = (parseFloat(st.distance) || 300) / 1000;
      }
    }
    const matchesRadius = storeDistanceKm <= maxRadiusKm;

    return matchesQuery && matchesCategory && matchesRadius;
  });

  // Active holds count
  const activeHolds = holds.filter(h => h.status === 'active' && h.expiresAt > Date.now());

  return (
    <div className="min-h-screen bg-[#07080B] text-white flex flex-col selection:bg-white selection:text-black pb-28 md:pb-16 font-sans">
      
      {/* ── TOP APP BAR (Compact, Minimalist) ── */}
      <header className="sticky top-0 z-40 bg-[#07080B]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            {!Capacitor.isNativePlatform() && (
              <button 
                onClick={onNavigateToHome}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Back to Landing Page"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Website</span>
              </button>
            )}

            <span className="text-lg font-black tracking-tight text-white font-['Outfit']">
              zooner<span className="text-slate-500">.</span>
            </span>

            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider px-2 py-0.5 border border-emerald-500/30 rounded bg-emerald-950/40">
              LIVE APP
            </span>
          </div>

          {/* Location Trigger (GPS) */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <MapPin className="h-3 w-3 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-[200px]">{currentLocation.name || 'RS Puram'}</span>
          </button>

          {/* Right link: Vendor Dashboard / Sign In */}
          <div className="flex items-center gap-2">
            {isVendor && (
              <button
                onClick={onNavigateToVendor}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/10"
              >
                <StoreIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Merchant OS</span>
                <span className="sm:hidden">Vendor</span>
              </button>
            )}

            <button
              onClick={() => setIsWelcomeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-emerald-400" />
              <span>{userProfile ? (userProfile.name.split(' ')[0]) : 'Sign In'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── GLOBAL ACTIVE HOLD TICKER BANNER ── */}
      {activeHolds.length > 0 && (
        <div className="bg-[#07080B] border-b border-white/10 px-4 sm:px-8 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
            <div 
              onClick={() => setSelectedPassForSheet(activeHolds[0])}
              className="flex items-center gap-2.5 truncate cursor-pointer group"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-mono text-emerald-400 font-bold uppercase text-[10px] tracking-wider shrink-0">
                Active Hold
              </span>
              <span className="text-white truncate font-medium group-hover:underline">
                {activeHolds[0].productName} · {activeHolds[0].storeName}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setSelectedPassForSheet(activeHolds[0])}
                className="font-mono text-xs font-bold text-white px-3 py-1 rounded-full border border-white/20 hover:border-white/40 transition-colors cursor-pointer"
              >
                View Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN APP VIEW CONTAINER ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 space-y-8">
        
        {/* ========================================================
            TAB 1: DISCOVER (Search, Categories, Shelf Feed & Stores)
           ======================================================== */}
        {activeTab === 'discover' && (
          <div className="space-y-6 text-left">
            
            {/* Search Bar with 300ms Debounce */}
            <div className="space-y-3">
              <div className="flex items-center border border-white/15 focus-within:border-white/40 rounded-full px-4 py-3 bg-[#0B0C11] transition-colors">
                <Search className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search global product catalog (e.g. sony xm5, iphone 15, air max)..."
                  className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm font-normal focus:outline-none"
                />
                {isSearchingCanonical && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse mr-2 shrink-0" title="Searching Catalog..." />
                )}
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filters Bar: Scope Radius & In-Stock */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3" /> Radius:
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {(['2km', '5km', '10km', '15km'] as const).map(rad => (
                      <button
                        key={rad}
                        onClick={() => setRadiusFilter(rad)}
                        className={`px-2.5 py-1 text-xs font-mono rounded-full border transition-colors cursor-pointer ${
                          radiusFilter === rad 
                            ? 'bg-white text-slate-950 font-bold border-white' 
                            : 'border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {rad}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-full border transition-colors cursor-pointer ${
                      inStockOnly 
                        ? 'border-emerald-400/40 text-emerald-400 font-bold bg-emerald-950/20' 
                        : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    In Stock Only
                  </button>
                </div>

                <div className="text-slate-500 font-mono text-[11px]">
                  {filteredProducts.length} Items · {filteredStores.length} Stores
                </div>
              </div>

              {/* Visual Category Chips */}
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pt-1 pb-1">
                {categoriesList.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                        isSelected 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                          : 'bg-[#12141D] text-slate-300 border-white/10 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">
                        {cat.id === 'all' ? '✨' : cat.id === 'footwear' ? '👟' : cat.id === 'electronics' ? '📱' : cat.id === 'appliances' ? '⚡' : cat.id === 'clothing' ? '👕' : '🛍️'}
                      </span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Empty State / Out of Range Handler */}
            {filteredProducts.length === 0 && (
              <div className="border border-white/10 bg-[#0B0C11]/80 backdrop-blur-md rounded-2xl p-8 sm:p-12 text-center space-y-4 my-8">
                <div className="text-xs font-mono uppercase tracking-widest text-slate-500">
                  Search Result Notice
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                  No shelf inventory found within {radiusFilter}.
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Local physical stores might still carry this in their backroom stock, or a store slightly farther away may have it.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  {radiusFilter !== '15km' && (
                    <button
                      onClick={() => setRadiusFilter(radiusFilter === '2km' ? '5km' : radiusFilter === '5km' ? '10km' : '15km')}
                      className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-xs font-bold font-mono text-white transition-colors cursor-pointer"
                    >
                      Expand Radius to {radiusFilter === '2km' ? '5km' : radiusFilter === '5km' ? '10km' : '15km'}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setBroadcastProduct(searchQuery || 'Product inquiry');
                      setActiveTab('requests');
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-300 transition-colors cursor-pointer shadow-lg shadow-emerald-400/20"
                  >
                    <Radio className="h-3.5 w-3.5" />
                    <span>Broadcast Live Ask to Stores</span>
                  </button>
                </div>
              </div>
            )}

            {/* Verified Global Products Catalog & In-Store Shelf Items */}
            {(canonicalProducts.length > 0 || filteredProducts.length > 0) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                      Global Product Discovery ({canonicalProducts.length > 0 ? canonicalProducts.length : filteredProducts.length} Products)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    Within {radiusFilter} · Store Comparison & 30-Min Hold
                  </span>
                </div>

                {/* 2-Column / 3-Column Visual Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {canonicalProducts.length > 0 ? (
                    canonicalProducts.map(cp => {
                      const carryingCount = cp.carryingStores ? cp.carryingStores.length : 0;
                      const lowestPrice = cp.carryingStores && cp.carryingStores.length > 0
                        ? Math.min(...cp.carryingStores.map((s: any) => s.price))
                        : 0;
                      const nearestStore = cp.carryingStores && cp.carryingStores.length > 0 ? cp.carryingStores[0] : null;
                      const distanceLabel = nearestStore
                        ? (nearestStore.distanceKm < 1 ? `${(nearestStore.distanceKm * 1000).toFixed(0)}m` : `${nearestStore.distanceKm.toFixed(1)} km`)
                        : 'Nearby';

                      return (
                        <div
                          key={cp.id}
                          onClick={() => setSelectedCanonicalProduct(cp)}
                          className="group border border-white/10 hover:border-emerald-500/40 bg-[#0B0C11] hover:bg-[#0E1017] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between cursor-pointer relative"
                        >
                          {/* Top Badges over Image */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                            <img 
                              src={cp.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'} 
                              alt={cp.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                            
                            {/* Status Badges */}
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                              <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {carryingCount} {carryingCount === 1 ? 'Store' : 'Stores'} Carrying
                              </span>

                              <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-300 font-semibold flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5 text-emerald-400" />
                                {distanceLabel}
                              </span>
                            </div>

                            {/* Store Overlay Pill */}
                            {nearestStore && (
                              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <span className="text-xs font-semibold text-white drop-shadow-md truncate">
                                  Nearest: {nearestStore.storeName}
                                </span>
                                <span className="text-[10px] text-slate-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                                  {nearestStore.availableQuantity} available
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Card Content Body */}
                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                                {cp.name}
                              </h4>
                              <p className="text-xs text-slate-400 line-clamp-1">
                                {cp.brandName ? `${cp.brandName} · ` : ''}{cp.categoryName || 'General'}
                              </p>
                            </div>

                            {/* Price & Action Row */}
                            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                              <div className="font-mono">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">In Stock From</div>
                                <div className="text-base font-extrabold text-white">
                                  ₹{lowestPrice.toLocaleString('en-IN')}
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCanonicalProduct(cp);
                                }}
                                className="px-3.5 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-400/20 active:scale-95 cursor-pointer"
                              >
                                View Stores ({carryingCount})
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  ) : (
                    filteredProducts.map(product => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="group border border-white/10 hover:border-emerald-500/40 bg-[#0B0C11] hover:bg-[#0E1017] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between cursor-pointer relative"
                      >
                        {/* Top Badges over Image */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                          
                          {/* Status Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {product.stockCount} on counter
                            </span>

                            <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono text-slate-300 font-semibold flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5 text-emerald-400" />
                              {product.distance}
                            </span>
                          </div>

                          {/* Store Overlay Pill */}
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <span className="text-xs font-semibold text-white drop-shadow-md truncate">
                              {product.storeName}
                            </span>
                            <span className="text-[10px] text-slate-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                              {product.storeArea}
                            </span>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                              {product.name}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-1">
                              Category: {product.category}
                            </p>
                          </div>

                          {/* Price & Action Row */}
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                            <div className="font-mono">
                              <div className="text-base font-extrabold text-white">
                                ₹{product.price.toLocaleString('en-IN')}
                              </div>
                              {product.originalPrice && (
                                <div className="text-[10px] text-slate-500 line-through">
                                  ₹{product.originalPrice.toLocaleString('en-IN')}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHoldItem(product.name, product.storeName, product.price);
                                }}
                                className="px-3.5 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-400/20 active:scale-95 cursor-pointer"
                              >
                                Hold 30m
                              </button>

                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${product.storeName}, ${product.storeArea}, Coimbatore`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-full border border-white/15 hover:border-white/40 text-slate-300 hover:text-white transition-colors shrink-0 cursor-pointer"
                                title="View Map Navigation"
                              >
                                <Navigation className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Nearby Verified Physical Stores Directory */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                  Physical Stores Nearby
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Within {radiusFilter}
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {filteredStores.map(store => {
                  const isSaved = savedStores.includes(store.id);
                  return (
                    <div
                      key={store.id}
                      onClick={() => setSelectedStore(store)}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.015] transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{store.name}</span>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        </div>
                        <div className="text-xs text-slate-400">
                          <span>{store.category}</span>
                          <span className="mx-2 text-slate-600">·</span>
                          <span>{store.area}</span>
                          <span className="mx-2 text-slate-600">·</span>
                          <span className="font-mono text-slate-400">{store.distance}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {store.openStatus}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveStore(store.id);
                          }}
                          className="p-2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                          title={isSaved ? 'Remove Bookmark' : 'Save Store'}
                        >
                          <Bookmark className={`h-4 w-4 ${isSaved ? 'text-white fill-white' : ''}`} />
                        </button>

                        <span className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1">
                          <span>Catalog</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: LIVE ASK (Direct Merchant Stock Broadcast)
           ======================================================== */}
        {activeTab === 'requests' && (
          <div className="space-y-6 text-left max-w-2xl mx-auto">

            {/* Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950/80 via-[#0B0C11] to-[#07080B] border border-emerald-500/20 p-6">
              <div className="absolute top-3 right-4 opacity-10">
                <Radio className="h-20 w-20 text-emerald-400" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 font-bold block mb-2">
                Direct Merchant Broadcast
              </span>
              <h2 className="text-2xl font-black text-white font-['Outfit'] leading-tight">
                Ask all local stores<br />in 1 tap.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Can't find your exact size or variant? Broadcast to verified shopkeepers nearby.
              </p>
            </div>

            {/* Broadcast Form */}
            <form onSubmit={handleBroadcast} className="space-y-4 border border-white/10 rounded-2xl p-6 bg-[#0B0C11]">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                  Product Name &amp; Model
                </label>
                <input
                  type="text"
                  value={broadcastProduct}
                  onChange={(e) => setBroadcastProduct(e.target.value)}
                  placeholder="e.g. Nike Pegasus 40, Titan Edge watch, Philips 12W LED"
                  className="w-full bg-[#07080B] border border-white/15 focus:border-white/40 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                    Size / Variant
                  </label>
                  <input
                    type="text"
                    value={broadcastSize}
                    onChange={(e) => setBroadcastSize(e.target.value)}
                    placeholder="e.g. UK 9, 256GB"
                    className="w-full bg-[#07080B] border border-white/15 focus:border-white/40 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                    Target Radius
                  </label>
                  <select
                    value={broadcastRadius}
                    onChange={(e) => setBroadcastRadius(e.target.value)}
                    className="w-full bg-[#07080B] border border-white/15 focus:border-white/40 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none"
                  >
                    <option value="2 km">Within 2 km</option>
                    <option value="5 km">Within 5 km</option>
                    <option value="10 km">Within 10 km</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBroadcasting || !broadcastProduct.trim()}
                className="w-full py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {isBroadcasting ? (
                  <>
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Pinging Verified Retailers...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Broadcast Live Request</span>
                  </>
                )}
              </button>
            </form>

            {/* Broadcast Live Response Feed */}
            {broadcastSent && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs pb-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                    <Radio className="h-3.5 w-3.5 animate-pulse" />
                    <span>Live Merchant Replies</span>
                  </div>
                  <span className="text-slate-500 font-mono">{liveResponses.length} Shops Responded</span>
                </div>

                <div className="space-y-3">
                  {liveResponses.map(resp => (
                    <div
                      key={resp.id}
                      className="border border-white/10 rounded-2xl p-5 bg-[#0B0C11] space-y-3 text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                            <span>{resp.storeName}</span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{resp.storeArea} · {resp.distance}</span>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-base font-bold text-white">₹{resp.price.toLocaleString('en-IN')}</span>
                          <span className="block text-[10px] text-emerald-400 font-bold uppercase">In Stock</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 font-normal leading-relaxed border-l-2 border-white/20 pl-3">
                        "{resp.conditionNote}"
                      </p>

                      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                        <button
                          onClick={() => {
                            handleHoldItem(broadcastProduct, resp.storeName, resp.price);
                            setActiveTab('holds');
                          }}
                          className="flex-1 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer text-center"
                        >
                          Accept &amp; Hold for 30m
                        </button>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${resp.storeName}, ${resp.storeArea}, Coimbatore`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-full border border-white/15 text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        >
                          <Navigation className="h-3 w-3" />
                          <span>Directions</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================
            TAB 3: MY HOLDS (The 30-Minute Counter Pass & Timer)
           ======================================================== */}
        {activeTab === 'holds' && (
          <div className="space-y-6 text-left max-w-2xl mx-auto">

            {/* Header with live count */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white font-['Outfit']">My Holds</h2>
                <p className="text-xs text-slate-500 mt-0.5">Show pass code at store counter</p>
              </div>
              {activeHolds.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-amber-400">{activeHolds.length} Active</span>
                </div>
              )}
            </div>

            {/* Active Holds List */}
            <div className="space-y-4">
              {holds.length === 0 ? (
                <div className="border border-white/10 rounded-2xl p-10 text-center space-y-3">
                  <Clock className="h-8 w-8 text-slate-600 mx-auto" />
                  <div className="text-sm font-bold text-white">No active holds</div>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    When you reserve an item on Discover or Live Ask, your 30-minute counter ticket will appear here.
                  </p>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="px-6 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer mt-2"
                  >
                    Search In-Store Shelves
                  </button>
                </div>
              ) : (
                holds.map(hold => {
                  const isHoldActive = hold.status === 'active' && hold.expiresAt > Date.now();
                  const remainingSecs = Math.max(0, Math.floor((hold.expiresAt - Date.now()) / 1000));
                  const mins = Math.floor(remainingSecs / 60);
                  const secs = remainingSecs % 60;
                  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

                  return (
                    <div key={hold.id} className="rounded-2xl overflow-hidden bg-[#0B0C11] border border-white/10">
                      {/* Status strip */}
                      <div className={`h-1 ${
                        isHoldActive ? 'bg-gradient-to-r from-amber-400 to-emerald-400' : 'bg-white/10'
                      }`} />

                      <div className="p-5 space-y-4">
                        {/* Pass code + timer badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-mono font-black text-white">#{hold.passCode}</span>
                            {isHoldActive && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                            isHoldActive
                              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                              : 'bg-white/5 border border-white/10 text-slate-500'
                          }`}>
                            {isHoldActive ? `⏱ ${timeFormatted}` : hold.status}
                          </span>
                        </div>

                        {/* Item card */}
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <div className="h-9 w-9 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4 text-amber-400" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">{hold.productName}</h4>
                            <div className="text-xs text-slate-400 truncate">{hold.storeName}</div>
                            <div className="text-[11px] text-slate-500 font-mono truncate">{hold.storeAddress}</div>
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between text-xs font-mono">
                          <span className="text-slate-500">Counter Price</span>
                          <span className="text-white font-bold text-base">₹{hold.price.toLocaleString('en-IN')}</span>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedPassForSheet(hold)}
                            className="py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            View Pass
                          </button>
                          <button
                            onClick={() => setChatPass(hold)}
                            className="py-2.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Chat
                          </button>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${hold.storeName}, ${hold.storeAddress}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="col-span-2 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Navigation className="h-3.5 w-3.5" />
                            Get Directions
                          </a>
                        </div>

                        {isHoldActive && (
                          <div className="text-right">
                            <button
                              onClick={() => { if (confirm('Cancel reservation and release item?')) handleCancelHold(hold.id); }}
                              className="text-[11px] font-mono text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              Release Hold
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 4: ACCOUNT & SAVED (Profile, Bookmarks, Merchant Link)
           ======================================================== */}
        {activeTab === 'account' && (
          <div className="space-y-6 text-left max-w-2xl mx-auto">

            {/* Profile Hero Card */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-950/60 to-[#0B0C11] border border-violet-500/20">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-base font-bold text-white truncate">{customerProfile.name || 'Guest User'}</div>
                <div className="text-xs text-slate-400 font-mono truncate">{customerProfile.phone}</div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Shopper</span>
                </div>
              </div>
            </div>

            {/* Counter Reservation Identity Form */}
            <form onSubmit={handleSaveProfile} className="border border-white/10 rounded-2xl p-5 bg-[#0B0C11] space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">Counter Identity</span>
                <span className="text-[10px] text-slate-500 font-mono">· shown at store pickup</span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 block">Your Full Name</label>
                  <input
                    type="text"
                    value={customerProfile.name}
                    onChange={(e) => setCustomerProfile({ ...customerProfile, name: e.target.value })}
                    className="w-full bg-[#07080B] border border-white/15 focus:border-white/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 block">Mobile Number (For Pass SMS/Verification)</label>
                  <input
                    type="text"
                    value={customerProfile.phone}
                    onChange={(e) => setCustomerProfile({ ...customerProfile, phone: e.target.value })}
                    className="w-full bg-[#07080B] border border-white/15 focus:border-white/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Save Counter Info
                </button>

                {profileSavedFeedback && (
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Saved to device
                  </span>
                )}
              </div>
            </form>

            {/* Saved Stores List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                  Bookmarked Local Stores
                </span>
                <span className="text-[11px] font-mono text-slate-500">{savedStores.length} Saved</span>
              </div>

              {savedStores.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 border border-white/5 rounded-xl">
                  No bookmarked stores. Tap the bookmark icon on any store card to save it.
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {savedStores.map(storeId => {
                    const st = liveStores.find((s: Store) => s.id === storeId);
                    if (!st) return null;
                    return (
                      <div key={st.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div 
                          onClick={() => setSelectedStore(st)}
                          className="cursor-pointer group"
                        >
                          <div className="text-sm font-bold text-white group-hover:underline">{st.name}</div>
                          <div className="text-xs text-slate-400">{st.area} · {st.category}</div>
                        </div>

                        <button
                          onClick={() => toggleSaveStore(st.id)}
                          className="text-xs font-mono text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Store Owner & Vendor Passport Switcher */}
            <div className="border border-amber-500/30 rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 via-[#0B0C11] to-[#07080B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
                    {isVendor ? 'Vendor Passport (V / VC)' : 'Retailer Access'}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  {isVendor ? 'Your Merchant OS Dashboard is Active' : 'Own a physical store in the city?'}
                </div>
                <p className="text-xs text-slate-400">
                  {isVendor 
                    ? 'Manage incoming live requests, shelf inventory, and customer 30-min hold passes.' 
                    : 'Manage in-store holds and receive live shopper requests from nearby.'}
                </p>
              </div>

              <button
                onClick={onNavigateToVendor}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-mono font-bold hover:brightness-105 transition-all cursor-pointer shrink-0 shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <StoreIcon className="h-4 w-4" />
                <span>{isVendor ? 'Open Vendor Dashboard →' : 'Store Portal →'}</span>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ── STORE DETAIL & SHELF CATALOG MODAL ── */}
      <AnimatePresence>
        {selectedStore && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full sm:max-w-lg bg-[#07080B] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto text-left selection:bg-white selection:text-black"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#07080B]/95 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-['Outfit']">{selectedStore.name}</h3>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                </div>
                <button
                  onClick={() => setSelectedStore(null)}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Store Meta */}
                <div className="space-y-2 border-b border-white/10 pb-5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{selectedStore.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-mono">
                    <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>{selectedStore.openStatus}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-mono">
                    <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>+91 422 254 8890 (Counter Desk)</span>
                  </div>
                </div>

                {/* Available Shelf Inventory */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                      Available on Shelf Today
                    </span>
                  </div>

                  <div className="divide-y divide-white/10">
                    {liveProducts.filter((p: Product) => p.storeName.includes(selectedStore.name.split('·')[0].trim())).map((p: Product) => (
                      <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-white">{p.name}</div>
                          <div className="text-[11px] font-mono text-emerald-400">
                            ₹{p.price.toLocaleString('en-IN')} · {p.stockCount} in stock
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            handleHoldItem(p.name, selectedStore.name, p.price);
                            setSelectedStore(null);
                          }}
                          className="px-4 py-1.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                        >
                          Hold 30m
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Button */}
                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${selectedStore.name}, ${selectedStore.address}, Coimbatore`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Get Walking Directions</span>
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CANONICAL GLOBAL PRODUCT DETAIL SHEET (Store Comparison & Inventory Hold) ── */}
      <AnimatePresence>
        {selectedCanonicalProduct && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full sm:max-w-lg bg-[#07080B] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto text-left selection:bg-white selection:text-black"
            >
              <div className="sticky top-0 bg-[#07080B]/95 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between z-10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Canonical Product · Carrying Stores ({selectedCanonicalProduct.carryingStores?.length || 0})
                </span>
                <button
                  onClick={() => setSelectedCanonicalProduct(null)}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Canonical Header */}
                <div className="flex items-start gap-4">
                  <img 
                    src={selectedCanonicalProduct.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'} 
                    alt={selectedCanonicalProduct.name} 
                    className="h-20 w-20 rounded-2xl object-cover bg-zinc-900 border border-white/10 shrink-0" 
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white font-['Outfit']">{selectedCanonicalProduct.name}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Brand: <strong className="text-white">{selectedCanonicalProduct.brandName}</strong>
                      {selectedCanonicalProduct.modelNumber ? ` · Model: ${selectedCanonicalProduct.modelNumber}` : ''}
                    </div>
                    {selectedCanonicalProduct.categoryName && (
                      <div className="text-[11px] font-mono text-emerald-400 mt-1">
                        Category: {selectedCanonicalProduct.categoryName}
                      </div>
                    )}
                  </div>
                </div>

                {selectedCanonicalProduct.description && (
                  <p className="text-xs text-slate-400 bg-white/[0.03] p-3 rounded-xl border border-white/5 leading-relaxed">
                    {selectedCanonicalProduct.description}
                  </p>
                )}

                {/* Nearby Stores Carrying This Canonical Product */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-300 font-bold">
                      Available Nearby Stores
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Real-Time Counter Inventory
                    </span>
                  </div>

                  {!selectedCanonicalProduct.carryingStores || selectedCanonicalProduct.carryingStores.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-zinc-900/60 rounded-xl border border-white/10">
                      No nearby store currently has active stock for this product.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/10">
                      {selectedCanonicalProduct.carryingStores.map((st: any) => {
                        const distText = st.distanceKm < 1 ? `${(st.distanceKm * 1000).toFixed(0)}m` : `${st.distanceKm.toFixed(1)} km`;
                        const isAvailable = st.availableQuantity > 0 && st.isAvailable;

                        return (
                          <div key={st.storeInventoryId} className="py-4 space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-sm">{st.storeName}</span>
                                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.2 rounded">
                                    {distText} away
                                  </span>
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">{st.storeAddress}</div>
                                {st.shelfLocation && (
                                  <div className="text-[11px] font-mono text-indigo-300 mt-0.5">
                                    Shelf: {st.shelfLocation}
                                  </div>
                                )}
                              </div>

                              <div className="text-right font-mono">
                                <div className="text-base font-extrabold text-white">
                                  ₹{st.price.toLocaleString('en-IN')}
                                </div>
                                <div className="text-[11px] font-bold text-emerald-400">
                                  {isAvailable ? `${st.availableQuantity} available` : 'Out of Stock'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                disabled={!isAvailable}
                                onClick={() => handleHoldStoreInventory(
                                  st.storeInventoryId,
                                  selectedCanonicalProduct.name,
                                  st.storeName,
                                  st.price,
                                  st.storeAddress,
                                  st.storePhone
                                )}
                                className={`flex-1 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer text-center ${
                                  isAvailable
                                    ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-md shadow-emerald-400/20 active:scale-95'
                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                }`}
                              >
                                {isAvailable ? 'Hold 30 Mins at Counter' : 'Currently Unavailable'}
                              </button>

                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${st.storeName}, ${st.storeAddress}, Coimbatore`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-full border border-white/20 hover:border-white/40 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                                title="Map Navigation"
                              >
                                <Navigation className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── PRODUCT DETAIL SHEET ── */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full sm:max-w-md bg-[#07080B] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto text-left selection:bg-white selection:text-black"
            >
              <div className="sticky top-0 bg-[#07080B]/95 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between z-10">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Verified In-Store Stock
                </span>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
                  <img 
                    src={selectedProduct.imageUrl} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{selectedProduct.name}</h3>
                  <div className="text-xs text-slate-400">{selectedProduct.storeName} · {selectedProduct.storeArea}</div>
                </div>

                <div className="flex items-baseline justify-between border-t border-b border-white/10 py-3 font-mono">
                  <div>
                    <span className="text-xl font-bold text-white">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-xs text-slate-600 line-through ml-2">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{selectedProduct.stockCount} on Counter</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      handleHoldItem(selectedProduct.name, selectedProduct.storeName, selectedProduct.price);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer text-center"
                  >
                    Hold for 30 Mins
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedProduct.storeName}, Coimbatore`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-full border border-white/20 hover:border-white/40 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="View Map"
                  >
                    <Navigation className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── HOLD PASS TICKET SHEET ── */}
      <HoldPassSheet
        pass={selectedPassForSheet}
        isOpen={Boolean(selectedPassForSheet)}
        onClose={() => setSelectedPassForSheet(null)}
        onCancelHold={handleCancelHold}
        onOpenChat={(pass) => {
          setSelectedPassForSheet(null);
          setChatPass(pass);
        }}
      />

      {/* ── DIRECT TEXT CHAT DRAWER ── */}
      <DirectChatDrawer
        pass={chatPass}
        isOpen={Boolean(chatPass)}
        onClose={() => setChatPass(null)}
      />

      {/* ── MOBILE WELCOME ENTRY SHEET ── */}
      <MobileWelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        onContinueAsGuest={() => setIsWelcomeModalOpen(false)}
        onOpenSignIn={(roleHint) => onOpenSignIn(roleHint)}
      />

      {/* ── NATIVE MOBILE BOTTOM NAVIGATION (4 Tabs) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#07080B]/98 backdrop-blur-2xl border-t border-white/[0.07] safe-area-pb">
        <div className="flex items-center justify-around px-2 pt-2 pb-3">

          {/* Tab 1: Discover */}
          <button
            onClick={() => setActiveTab('discover')}
            className="flex flex-col items-center gap-1.5 min-w-[64px] cursor-pointer group"
          >
            <div className={`flex items-center justify-center w-12 h-8 rounded-2xl transition-all duration-200 ${
              activeTab === 'discover'
                ? 'bg-indigo-500/20'
                : 'group-hover:bg-white/5'
            }`}>
              <Compass className={`h-5 w-5 transition-colors ${
                activeTab === 'discover' ? 'text-indigo-400' : 'text-slate-500'
              }`} />
            </div>
            <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
              activeTab === 'discover' ? 'text-indigo-400' : 'text-slate-500'
            }`}>Explore</span>
          </button>

          {/* Tab 2: Live Ask — center hero tab */}
          <button
            onClick={() => setActiveTab('requests')}
            className="flex flex-col items-center gap-1.5 min-w-[64px] cursor-pointer group relative -mt-5"
          >
            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg transition-all duration-200 ${
              activeTab === 'requests'
                ? 'bg-emerald-500 shadow-emerald-500/40 scale-105'
                : 'bg-[#1A1D26] border border-white/10 group-hover:border-white/20'
            }`}>
              <Radio className={`h-6 w-6 ${
                activeTab === 'requests' ? 'text-white' : 'text-slate-400'
              }`} />
              {liveResponses.length > 0 && activeTab !== 'requests' && (
                <span className="absolute top-0 right-2 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#07080B]" />
              )}
            </div>
            <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
              activeTab === 'requests' ? 'text-emerald-400' : 'text-slate-500'
            }`}>Live Ask</span>
          </button>

          {/* Tab 3: My Holds */}
          <button
            onClick={() => setActiveTab('holds')}
            className="flex flex-col items-center gap-1.5 min-w-[64px] cursor-pointer group relative"
          >
            <div className={`flex items-center justify-center w-12 h-8 rounded-2xl transition-all duration-200 relative ${
              activeTab === 'holds'
                ? 'bg-amber-500/20'
                : 'group-hover:bg-white/5'
            }`}>
              <Clock className={`h-5 w-5 transition-colors ${
                activeTab === 'holds' ? 'text-amber-400' : 'text-slate-500'
              }`} />
              {activeHolds.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-400 text-[9px] font-black text-slate-950 flex items-center justify-center">
                  {activeHolds.length}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
              activeTab === 'holds' ? 'text-amber-400' : 'text-slate-500'
            }`}>My Holds</span>
          </button>

          {/* Tab 4: Account */}
          <button
            onClick={() => setActiveTab('account')}
            className="flex flex-col items-center gap-1.5 min-w-[64px] cursor-pointer group"
          >
            <div className={`flex items-center justify-center w-12 h-8 rounded-2xl transition-all duration-200 ${
              activeTab === 'account'
                ? 'bg-violet-500/20'
                : 'group-hover:bg-white/5'
            }`}>
              <User className={`h-5 w-5 transition-colors ${
                activeTab === 'account' ? 'text-violet-400' : 'text-slate-500'
              }`} />
            </div>
            <span className={`text-[10px] font-semibold tracking-wide transition-colors ${
              activeTab === 'account' ? 'text-violet-400' : 'text-slate-500'
            }`}>Account</span>
          </button>

        </div>
      </nav>

    </div>
  );
};
