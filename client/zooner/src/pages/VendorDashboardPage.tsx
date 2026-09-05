import React, { useState } from 'react';
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
  Power 
} from 'lucide-react';

interface VendorDashboardPageProps {
  onSwitchToCustomer: () => void;
  onNavigateToVendorLanding: () => void;
}

type DashboardTab = 'requests' | 'inventory' | 'holds' | 'analytics' | 'settings';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stockCount: number;
  inStock: boolean;
  badge?: string;
  imageUrl: string;
}

interface IncomingRequest {
  id: string;
  shopperName: string;
  product: string;
  size: string;
  distance: string;
  budget: string;
  timeAgo: string;
  status: 'pending' | 'accepted' | 'declined';
  quotedPrice?: number;
}

interface WalkInHold {
  id: string;
  customerName: string;
  phone: string;
  product: string;
  price: number;
  expiresIn: string;
  status: 'active' | 'completed' | 'cancelled';
}

export const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({
  onSwitchToCustomer,
  onNavigateToVendorLanding,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('requests');
  const [isLiveOnline, setIsLiveOnline] = useState(true);

  // Store profile
  const [storeName, setStoreName] = useState('Apex Footwear & Sports');
  const [storeCategory, setStoreCategory] = useState('Footwear & Sports');
  const [storeAddress, setStoreAddress] = useState('142 DB Road, RS Puram, Coimbatore - 641002');
  const [storePhone, setStorePhone] = useState('+91 98422 12345');
  const [storeHours, setStoreHours] = useState('10:00 AM – 9:30 PM (Mon–Sun)');

  // Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'inv-1',
      name: 'Nike Air Max 270 (UK 9)',
      category: 'Footwear & Sports',
      price: 6499,
      stockCount: 2,
      inStock: true,
      badge: 'Trending',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'inv-2',
      name: 'Nike Air Zoom Pegasus 40 (UK 9)',
      category: 'Footwear & Sports',
      price: 6499,
      stockCount: 4,
      inStock: true,
      badge: 'Bestseller',
      imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'inv-3',
      name: 'Nike Revolution 6 Running (UK 8)',
      category: 'Footwear & Sports',
      price: 3695,
      stockCount: 6,
      inStock: true,
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'inv-4',
      name: 'Puma Velocity Nitro 2 (UK 9)',
      category: 'Footwear & Sports',
      price: 5999,
      stockCount: 0,
      inStock: false,
      badge: 'Out of Stock',
      imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=150&q=80'
    }
  ]);

  // Incoming Live Requests State
  const [requests, setRequests] = useState<IncomingRequest[]>([
    {
      id: 'req-101',
      shopperName: 'Vignesh K.',
      product: 'Nike Air Max 270',
      size: 'Size UK 9',
      distance: '350m away (RS Puram)',
      budget: 'Under ₹7,000',
      timeAgo: '2 mins ago',
      status: 'pending'
    },
    {
      id: 'req-102',
      shopperName: 'Priya R.',
      product: 'Nike Pegasus 40 Black',
      size: 'Size UK 6',
      distance: '1.1 km away (Race Course)',
      budget: 'Around ₹6,500',
      timeAgo: '8 mins ago',
      status: 'pending'
    },
    {
      id: 'req-103',
      shopperName: 'Arun Kumar',
      product: 'Nike Court Vision Low White',
      size: 'Size UK 10',
      distance: '1.4 km away (Gandhipuram)',
      budget: '₹4,000 – ₹5,500',
      timeAgo: '15 mins ago',
      status: 'pending'
    }
  ]);

  // Active Walk-In Holds State
  const [holds, setHolds] = useState<WalkInHold[]>([
    {
      id: 'hld-1',
      customerName: 'Karthik S.',
      phone: '+91 98433 98765',
      product: 'Nike Air Max 270 (UK 9)',
      price: 6499,
      expiresIn: '22 mins remaining',
      status: 'active'
    },
    {
      id: 'hld-2',
      customerName: 'Ananya M.',
      phone: '+91 97890 12345',
      product: 'Nike Pegasus 40 (UK 8)',
      price: 6499,
      expiresIn: 'Expired',
      status: 'completed'
    }
  ]);

  // New Item Modal
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStock, setNewItemStock] = useState('3');
  const [newItemCategory, setNewItemCategory] = useState('Footwear & Sports');

  // Accept / Decline Request
  const handleAcceptRequest = (id: string, quote = 6499) => {
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

  // Toggle Stock availability
  const toggleStockStatus = (id: string) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, inStock: !item.inStock, stockCount: item.inStock ? 0 : 3 } : item
    ));
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      price: parseFloat(newItemPrice) || 0,
      stockCount: parseInt(newItemStock) || 1,
      inStock: true,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80'
    };
    setInventory(prev => [newItem, ...prev]);
    setIsAddItemOpen(false);
    setNewItemName('');
    setNewItemPrice('');
  };

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;
  const activeHoldsCount = holds.filter(h => h.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* ── TOP MERCHANT HEADER BAR ── */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-3.5">
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
              onClick={() => setIsLiveOnline(!isLiveOnline)}
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
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* ── LEFT SIDEBAR NAVIGATION ── */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
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
                              onClick={() => handleAcceptRequest(req.id, 6499)}
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
                  <p className="text-xs text-slate-400">Manage products visible to shoppers within 15 km</p>
                </div>
                <button
                  onClick={() => setIsAddItemOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Shelf Item</span>
                </button>
              </div>

              {/* Inventory Table / Grid */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                <div className="divide-y divide-slate-800">
                  {inventory.map(item => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                      <div className="flex items-center gap-3.5">
                        <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-xl object-cover bg-slate-800" />
                        <div>
                          <div className="font-bold text-white text-sm">{item.name}</div>
                          <div className="text-xs text-slate-400">{item.category}</div>
                          <div className="text-xs font-black text-indigo-400 font-['Outfit'] mt-0.5">₹{item.price.toLocaleString('en-IN')}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleStockStatus(item.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            item.inStock
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                              : 'bg-red-950/60 text-red-400 border-red-800'
                          }`}
                        >
                          {item.inStock ? `In Stock (${item.stockCount})` : 'Out of Stock'}
                        </button>
                        <button
                          onClick={() => setInventory(prev => prev.filter(i => i.id !== item.id))}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition-colors"
                >
                  Save Store Profile
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ── ADD SHELF ITEM MODAL ── */}
      <AnimatePresence>
        {isAddItemOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-['Outfit']">Add Product to Shelf</h3>
                <button onClick={() => setIsAddItemOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Product Name & Variant</label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Nike Air Max 90 (UK 9)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="Footwear & Sports">Footwear & Sports</option>
                    <option value="Watches & Jewelry">Watches & Jewelry</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Smart Home & Lighting">Smart Home & Lighting</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">In-Store Price (₹)</label>
                    <input
                      type="number"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="e.g. 6499"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Stock Count</label>
                    <input
                      type="number"
                      value={newItemStock}
                      onChange={(e) => setNewItemStock(e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white transition-colors"
                >
                  Save & Publish to Nearby Shoppers
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
