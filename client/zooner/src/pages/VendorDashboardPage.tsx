import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  Send, 
  Package, 
  Clock, 
  BarChart3, 
  Settings, 
  Plus, 
  CheckCircle2, 
  X, 
  Trash2, 
  Compass, 
  Radio, 
  Check, 
  Power,
  Search,
  AlertTriangle
} from 'lucide-react';
import { 
  searchProducts, 
  getStoreInventory, 
  addStoreInventory, 
  updateStoreInventory, 
  deleteStoreInventory, 
  checkDuplicateProduct, 
  createGlobalProduct, 
  fetchCategories,
  getMyShops,
  getIncomingRequests,
  respondToLiveRequest,
  setShopLiveStatus
} from '../services/api';

interface VendorDashboardPageProps {
  onSwitchToCustomer: () => void;
  onNavigateToVendorLanding: () => void;
}

type DashboardTab = 'requests' | 'inventory' | 'holds' | 'analytics' | 'settings';

export const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({
  onSwitchToCustomer,
  onNavigateToVendorLanding,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('requests');
  const [isLiveOnline, setIsLiveOnline] = useState(false);

  // Store profile
  const [storeName, setStoreName] = useState('');
  const [storeCategory, setStoreCategory] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeHours, setStoreHours] = useState('10:00 AM – 9:30 PM (Mon–Sun)');

  // Store ID
  const [currentStoreId, setCurrentStoreId] = useState<string>('');

  // Modal Visibility State
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // Incoming Live Requests State
  const [requests, setRequests] = useState<any[]>([]);

  // Active Walk-In Holds State
  const [holds, setHolds] = useState<any[]>([]);

  const handleAcceptRequest = async (id: string) => {
    if (!currentStoreId) return;
    const response = await respondToLiveRequest(id, currentStoreId);
    if (response) {
      setRequests(previous => previous.filter(request => request.id !== id));
      return;
    }
    return;
    /* Legacy local demo path retained below temporarily. */
    const quote = 0;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted', quotedPrice: quote } : r));
    const targetReq = requests.find(r => r.id === id);
    if (targetReq) {
      setHolds(prev => [
        {
          id: `hld-${Date.now()}`,
          customerName: targetReq.shopperName,
          phone: '+91 98400 00000',
          product: `${targetReq.product} (${targetReq.size})`,
          price: quote,
          expiresIn: '30 mins remaining',
          status: 'active'
        },
        ...prev
      ]);
    }
  };

  const handleDeclineRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'declined' } : r));
  };

  // Inventory State
  const [inventory, setInventory] = useState<any[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState<boolean>(false);

  // Catalog Search & Add Inventory State
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogResults, setCatalogResults] = useState<any[]>([]);
  const [isSearchingCatalog, setIsSearchingCatalog] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  
  // Store-specific inventory input fields
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState('2');
  const [itemShelf, setItemShelf] = useState('');

  // Create New Product Fallback State
  const [showCreateProductForm, setShowCreateProductForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdModel, setNewProdModel] = useState('');
  const [newProdGtin, setNewProdGtin] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Electronics');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [duplicateCheckWarning, setDuplicateCheckWarning] = useState<any | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // Categories list for product creation
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  // Initial Data Fetching
  useEffect(() => {
    async function initVendorData() {
      setInventoryLoading(true);
      try {
        const shops = await getMyShops();
        const storeId = shops[0]?.id?.toString() || '';
        setCurrentStoreId(storeId);
        
        if (shops && shops.length > 0) {
          setStoreName(shops[0].name || '');
          setStoreAddress(shops[0].address || '');
          setStorePhone(shops[0].phone || '');
          setStoreCategory(shops[0].categories?.map((category: any) => category.name).join(', ') || '');
          setIsLiveOnline(Boolean(shops[0].isLiveEnabled));
          const incoming = await getIncomingRequests(storeId);
          setRequests(incoming.map((request: any) => ({ ...request, product: request.requestText, status: request.status?.toLowerCase() || 'pending', distance: request.distanceToShopKm ? `${request.distanceToShopKm.toFixed(1)} km away` : 'Nearby', timeAgo: new Date(request.createdAtUtc).toLocaleString() })));
          setHolds([]);
        }

        if (storeId) setInventory(await getStoreInventory(storeId));

        const cats = await fetchCategories();
        setDbCategories(cats);
      } catch (err) {
        console.error('Failed loading vendor inventory:', err);
      } finally {
        setInventoryLoading(false);
      }
    }
    initVendorData();
  }, []);

  // Debounced Catalog Search
  useEffect(() => {
    if (!catalogSearchQuery.trim()) {
      setCatalogResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingCatalog(true);
      const results = await searchProducts(catalogSearchQuery.trim());
      setCatalogResults(results);
      setIsSearchingCatalog(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [catalogSearchQuery]);

  // Select a product from catalog search
  const handleSelectCatalogProduct = (prod: any) => {
    setSelectedProduct(prod);
    if (prod.variants && prod.variants.length > 0) {
      setSelectedVariantId(prod.variants[0].id.toString());
    }
  };

  // Add Inventory to Store
  const handleSaveInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantId || !itemPrice || !itemQuantity) {
      alert('Please fill in price and quantity.');
      return;
    }

    const newItem = await addStoreInventory(currentStoreId, {
      productVariantId: selectedVariantId,
      price: parseFloat(itemPrice),
      quantity: parseInt(itemQuantity),
      shelfLocation: itemShelf || 'Shelf Main'
    });

    if (newItem) {
      const refreshed = await getStoreInventory(currentStoreId);
      setInventory(refreshed);
      resetModalState();
    } else {
      alert('Failed to add store inventory. Please ensure variant ID is valid.');
    }
  };

  // Check Duplicate Product before Creation
  const handleCheckAndCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    setIsCheckingDuplicate(true);
    const check = await checkDuplicateProduct(
      newProdGtin.trim(),
      newProdBrand.trim(),
      newProdModel.trim(),
      newProdName.trim()
    );
    setIsCheckingDuplicate(false);

    const isDup = check && (check.possibleDuplicateFound || check.isDuplicate);
    const matched = check?.matchedProduct || check?.matchingProduct;

    if (isDup && matched) {
      setDuplicateCheckWarning({ matchedProduct: matched, reason: check.reason });
      return; // Stop and let user confirm or pick existing
    }

    // Proceed to create
    await executeProductCreation();
  };

  const executeProductCreation = async () => {
    const matchedCategory = dbCategories.find(c => c.name.toLowerCase() === newProdCategory.toLowerCase());
    const categoryId = matchedCategory ? matchedCategory.id.toString() : (dbCategories[0]?.id?.toString() || '1');

    const created = await createGlobalProduct({
      name: newProdName,
      brandName: newProdBrand || 'Generic',
      categoryId: categoryId,
      modelNumber: newProdModel,
      gtin: newProdGtin,
      description: newProdDesc,
      imageUrl: newProdImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'
    });

    if (created && created.variants && created.variants.length > 0) {
      setSelectedProduct(created);
      setSelectedVariantId(created.variants[0].id.toString());
      setShowCreateProductForm(false);
      setDuplicateCheckWarning(null);
    } else {
      alert('Could not create global product.');
    }
  };

  const resetModalState = () => {
    setIsAddItemOpen(false);
    setSelectedProduct(null);
    setSelectedVariantId('');
    setCatalogSearchQuery('');
    setCatalogResults([]);
    setItemPrice('');
    setItemQuantity('2');
    setItemShelf('');
    setShowCreateProductForm(false);
    setDuplicateCheckWarning(null);
  };

  // Toggle Inventory Stock via API
  const handleToggleInventoryStock = async (item: any) => {
    const newQty = item.quantity > 0 ? 0 : 3;
    await updateStoreInventory(currentStoreId, item.id.toString(), {
      price: item.price,
      quantity: newQty,
      shelfLocation: item.shelfLocation,
      isActive: newQty > 0
    });
    const refreshed = await getStoreInventory(currentStoreId);
    setInventory(refreshed);
  };

  // Delete Inventory Item via API
  const handleDeleteInventoryItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this item from your store inventory?')) return;
    await deleteStoreInventory(currentStoreId, itemId.toString());
    const refreshed = await getStoreInventory(currentStoreId);
    setInventory(refreshed);
  };

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const activeHoldsCount = holds.filter(h => h.status === 'active').length;

  return (
    <div className="zooner-merchant min-h-screen text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* ── TOP MERCHANT HEADER BAR ── */}
      <header className="zooner-merchant-header sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Store Info & Live Switch */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base font-['Outfit']">{storeName}</span>
                <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.2 rounded">
                  ZNR-8842
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${isLiveOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>{isLiveOnline ? 'Live · Accepting Walk-in Requests' : 'Offline'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Live Status Toggle */}
            <button
              onClick={async () => {
                if (!currentStoreId) return;
                const nextStatus = !isLiveOnline;
                if (await setShopLiveStatus(currentStoreId, nextStatus)) setIsLiveOnline(nextStatus);
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isLiveOnline 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Power className="h-3.5 w-3.5" />
              <span>{isLiveOnline ? 'Online' : 'Go Online'}</span>
            </button>

            {/* Switch to Customer Site */}
            <button
              onClick={onSwitchToCustomer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-indigo-400" />
              <span>Customer View</span>
            </button>

            <button
              onClick={onNavigateToVendorLanding}
              className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1.5"
            >
              Portal Home
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN DASHBOARD CONTAINER ── */}
      <div className="zooner-merchant-content max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* ── LEFT SIDEBAR NAVIGATION ── */}
        <aside className="zooner-merchant-nav w-full md:w-64 shrink-0 space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 px-3 py-2">
            Store Operations
          </div>

          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'requests'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Send className="h-4 w-4" />
              <span>Live Requests</span>
            </div>
            {pendingRequestsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-indigo-700">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="h-4 w-4" />
              <span>Shelf Inventory</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{inventory.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('holds')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'holds'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4" />
              <span>Walk-in Holds</span>
            </div>
            {activeHoldsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-black">
                {activeHoldsCount}
              </span>
            )}
          </button>

          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 px-3 pt-5 pb-2">
            Performance & Admin
          </div>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Footfall Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Store Profile & Hours</span>
          </button>
        </aside>

        {/* ── RIGHT MAIN PANEL ── */}
        <main className="flex-1 space-y-6 text-left">
          
          {/* ── TAB 1: LIVE REQUESTS ── */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                    <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
                    Incoming Shopper Broadcasts
                  </h2>
                  <p className="text-xs text-slate-400">Shoppers within 5 km looking for items right now</p>
                </div>
              </div>

              <div className="space-y-3">
                {requests.map(req => (
                  <div 
                    key={req.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      req.status === 'accepted'
                        ? 'bg-emerald-950/20 border-emerald-800/40'
                        : req.status === 'declined'
                        ? 'bg-slate-900/40 border-slate-800 opacity-60'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base">{req.product}</h3>
                          <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                            {req.size}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <span>By {req.shopperName}</span>
                          <span>·</span>
                          <span className="text-emerald-400 font-medium">{req.distance}</span>
                          <span>·</span>
                          <span>{req.timeAgo}</span>
                        </div>
                        <div className="text-xs text-slate-300 mt-2 font-mono">
                          Customer Target Budget: <strong className="text-white">{req.budget}</strong>
                        </div>
                      </div>

                      {/* Request Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAcceptRequest(req.id)}
                              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Confirm In-Stock (₹6,499)</span>
                            </button>
                            <button
                              onClick={() => handleDeclineRequest(req.id)}
                              className="px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {req.status === 'accepted' && (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Confirmed & Held 30m ✓</span>
                          </span>
                        )}
                        {req.status === 'declined' && (
                          <span className="text-xs text-slate-500 font-semibold">Declined</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 2: INVENTORY MANAGEMENT ── */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white font-['Outfit']">Physical Shelf Inventory</h2>
                  <p className="text-xs text-slate-400">Manage store inventory attached to the global product catalog</p>
                </div>
                <button
                  onClick={() => { resetModalState(); setIsAddItemOpen(true); }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Shelf Inventory</span>
                </button>
              </div>

              {/* Inventory Table / Grid */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                {inventoryLoading ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-mono">Loading store inventory...</div>
                ) : inventory.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="text-sm font-bold text-white">No shelf inventory found.</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Search the global catalog to add existing products (e.g. Sony WH-1000XM5, iPhone 15) to your store!
                    </p>
                    <button
                      onClick={() => { resetModalState(); setIsAddItemOpen(true); }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      + Add First Product
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {inventory.map((item: any) => {
                      const prodName = item.productName || item.productVariantName || 'Product Item';
                      const isAvailable = item.availableQuantity > 0 && item.quantity > 0 && item.isActive;
                      return (
                        <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                          <div className="flex items-center gap-3.5">
                            <img 
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80'} 
                              alt={prodName} 
                              className="h-12 w-12 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0" 
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{prodName}</span>
                                {item.shelfLocation && (
                                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 border border-indigo-800 px-1.5 py-0.2 rounded">
                                    {item.shelfLocation}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400">
                                {item.brandName ? `${item.brandName} · ` : ''}{item.categoryName || 'General'}
                              </div>
                              <div className="text-xs font-black text-indigo-400 font-['Outfit'] mt-0.5">
                                ₹{item.price ? item.price.toLocaleString('en-IN') : '0'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <button
                              onClick={() => handleToggleInventoryStock(item)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                isAvailable
                                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                                  : 'bg-red-950/60 text-red-400 border-red-800'
                              }`}
                            >
                              {isAvailable ? `In Stock (${item.availableQuantity} available)` : 'Out of Stock'}
                            </button>

                            <button
                              onClick={() => handleDeleteInventoryItem(item.id)}
                              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete from Inventory"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 3: ACTIVE HOLDS ── */}
          {activeTab === 'holds' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white font-['Outfit']">Counter Holds & Walk-in Reservations</h2>
                <p className="text-xs text-slate-400">Items reserved under shopper names on billing counter</p>
              </div>

              <div className="space-y-3">
                {holds.map(hold => (
                  <div key={hold.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{hold.product}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                          ₹{hold.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>Customer: <strong>{hold.customerName}</strong></span>
                        <span>·</span>
                        <span>{hold.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-lg">
                        {hold.expiresIn}
                      </span>
                      {hold.status === 'active' && (
                        <button
                          onClick={() => setHolds(prev => prev.map(h => h.id === hold.id ? { ...h, status: 'completed', expiresIn: 'Picked Up ✓' } : h))}
                          className="px-3.5 py-1.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-slate-200 transition-colors"
                        >
                          Mark Sold
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 4: ANALYTICS ── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white font-['Outfit']">Store Footfall Analytics</h2>
                <p className="text-xs text-slate-400">Weekly performance summary for {storeName}</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Shopper Impressions</div>
                  <div className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">1,420</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">↑ +38% this week</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Directions Clicked</div>
                  <div className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">94</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">Direct store visits</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">30-Min Holds</div>
                  <div className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">36</div>
                  <div className="text-[11px] text-indigo-400 font-semibold mt-1">89% conversion rate</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400">Estimated Sales</div>
                  <div className="text-2xl font-extrabold text-white font-['Outfit'] mt-1">₹2,84,500</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">0% commission taken</div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 5: SETTINGS & HOURS ── */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h2 className="text-xl font-bold text-white font-['Outfit']">Store Profile & Location</h2>
                <p className="text-xs text-slate-400">Your verified storefront details on Zooner</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Store Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Category</label>
                  <input
                    type="text"
                    value={storeCategory}
                    onChange={(e) => setStoreCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Physical Address</label>
                  <input
                    type="text"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={storeHours}
                    onChange={(e) => setStoreHours(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => alert('✓ Store profile settings updated successfully!')}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition-colors cursor-pointer"
                >
                  Save Store Profile
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ── ADD SHELF ITEM MODAL (Global Catalog + Store Inventory Flow) ── */}
      <AnimatePresence>
        {isAddItemOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-left shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">Add Product to Store Inventory</h3>
                  <p className="text-xs text-slate-400">Link your store to canonical global catalog products</p>
                </div>
                <button onClick={resetModalState} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!showCreateProductForm ? (
                /* STEP 1: CATALOG SEARCH & SELECTION */
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1">Search Product Catalog</label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={catalogSearchQuery}
                        onChange={(e) => setCatalogSearchQuery(e.target.value)}
                        placeholder="Search by product name, model (e.g. sony xm5, iphone 15)..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Catalog Results Dropdown */}
                  {catalogSearchQuery.trim() && (
                    <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 divide-y divide-slate-800/60">
                      {isSearchingCatalog ? (
                        <div className="p-3 text-xs text-slate-400 text-center font-mono">Searching canonical catalog...</div>
                      ) : catalogResults.length === 0 ? (
                        <div className="p-3 text-xs text-slate-400 text-center">
                          No matching product found in catalog.
                        </div>
                      ) : (
                        catalogResults.map((prod: any) => (
                          <div
                            key={prod.id}
                            onClick={() => handleSelectCatalogProduct(prod)}
                            className={`p-3 flex items-center justify-between cursor-pointer hover:bg-indigo-950/40 transition-colors ${
                              selectedProduct?.id === prod.id ? 'bg-indigo-950/70 border-l-4 border-indigo-500' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={prod.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'} 
                                alt={prod.name} 
                                className="h-10 w-10 rounded-lg object-cover bg-slate-800 shrink-0" 
                              />
                              <div>
                                <div className="text-xs font-bold text-white">{prod.name}</div>
                                <div className="text-[11px] text-slate-400">
                                  {prod.brandName ? `${prod.brandName} · ` : ''}{prod.categoryName || 'General'}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-indigo-400 px-2 py-1 rounded bg-indigo-950 border border-indigo-800">
                              Select
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Selected Product Banner & Form */}
                  {selectedProduct ? (
                    <form onSubmit={handleSaveInventory} className="space-y-4 border-t border-slate-800 pt-4">
                      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 flex items-center gap-3">
                        <img 
                          src={selectedProduct.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'} 
                          alt={selectedProduct.name} 
                          className="h-12 w-12 rounded-lg object-cover bg-slate-800 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-mono text-indigo-300 font-bold uppercase">Selected Global Product</div>
                          <div className="text-sm font-bold text-white truncate">{selectedProduct.name}</div>
                          <div className="text-xs text-slate-400">{selectedProduct.brandName}</div>
                        </div>
                      </div>

                      {/* Variant Selection if available */}
                      {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">Product Variant</label>
                          <select
                            value={selectedVariantId}
                            onChange={(e) => setSelectedVariantId(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          >
                            {selectedProduct.variants.map((v: any) => (
                              <option key={v.id} value={v.id}>
                                {v.variantName} {v.color ? `(${v.color})` : ''} {v.sku ? `- SKU: ${v.sku}` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">Your Price (₹)</label>
                          <input
                            type="number"
                            value={itemPrice}
                            onChange={(e) => setItemPrice(e.target.value)}
                            placeholder="e.g. 26990"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">Quantity</label>
                          <input
                            type="number"
                            value={itemQuantity}
                            onChange={(e) => setItemQuantity(e.target.value)}
                            placeholder="e.g. 2"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">Shelf Location</label>
                          <input
                            type="text"
                            value={itemShelf}
                            onChange={(e) => setItemShelf(e.target.value)}
                            placeholder="e.g. A12"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
                      >
                        Save Inventory to Store
                      </button>
                    </form>
                  ) : (
                    <div className="pt-2 text-center space-y-2 border-t border-slate-800">
                      <p className="text-xs text-slate-400">Can't find this product in the global catalog?</p>
                      <button
                        type="button"
                        onClick={() => setShowCreateProductForm(true)}
                        className="text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
                      >
                        + Create New Global Product
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* STEP 2: CREATE NEW GLOBAL PRODUCT (WITH DUPLICATE PREVENTION) */
                <form onSubmit={handleCheckAndCreateProduct} className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                      New Global Product Entry
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCreateProductForm(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ← Back to Search
                    </button>
                  </div>

                  {/* DUPLICATE WARNING ALERT */}
                  {duplicateCheckWarning && (
                    <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-700/80 space-y-3 text-left">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-amber-300">
                            Potential Duplicate Product Found!
                          </div>
                          <p className="text-xs text-amber-200/80 mt-1">
                            Did you mean: <strong className="text-white">{duplicateCheckWarning.matchingProduct.name}</strong> ({duplicateCheckWarning.matchingProduct.brandName})?
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProduct(duplicateCheckWarning.matchingProduct);
                            if (duplicateCheckWarning.matchingProduct.variants && duplicateCheckWarning.matchingProduct.variants.length > 0) {
                              setSelectedVariantId(duplicateCheckWarning.matchingProduct.variants[0].id.toString());
                            }
                            setShowCreateProductForm(false);
                            setDuplicateCheckWarning(null);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer"
                        >
                          Yes, Select Existing Product
                        </button>
                        <button
                          type="button"
                          onClick={executeProductCreation}
                          className="px-3 py-1.5 rounded-xl border border-amber-600/60 text-amber-200 font-semibold text-xs hover:bg-amber-900/40 cursor-pointer"
                        >
                          Create New Anyway
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Name *</label>
                    <input
                      type="text"
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value)}
                      placeholder="e.g. Sony, Apple, Nike"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Model Number</label>
                      <input
                        type="text"
                        value={newProdModel}
                        onChange={(e) => setNewProdModel(e.target.value)}
                        placeholder="e.g. WH-1000XM5"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">GTIN / Barcode</label>
                      <input
                        type="text"
                        value={newProdGtin}
                        onChange={(e) => setNewProdGtin(e.target.value)}
                        placeholder="e.g. 4548736132580"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      {dbCategories.length > 0 ? (
                        dbCategories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))
                      ) : (
                        <>
                          <option value="Electronics">Electronics</option>
                          <option value="Footwear">Footwear</option>
                          <option value="Appliances">Appliances</option>
                          <option value="Clothing">Clothing</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                    <textarea
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      placeholder="Key specifications, features, color, size details..."
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Image URL</label>
                    <input
                      type="text"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCheckingDuplicate}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition-colors cursor-pointer shadow-lg shadow-indigo-600/30"
                  >
                    {isCheckingDuplicate ? 'Checking Catalog Duplicates...' : 'Create & Proceed to Add Inventory'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
