import React, { useState } from 'react';
import { 
  Store, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Tag, 
  ShieldCheck, 
  Plus, 
  UploadCloud, 
  Check, 
  Sun, 
  Moon, 
  Compass, 
  Send,
  Building2,
  Phone,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface VendorLandingPageProps {
  onSwitchToCustomer: () => void;
  onOpenSignIn: () => void;
  onNavigateToDashboard?: () => void;
}

export const VendorLandingPage: React.FC<VendorLandingPageProps> = ({
  onSwitchToCustomer,
  onOpenSignIn,
  onNavigateToDashboard
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'requests' | 'inventory'>('analytics');
  
  // Registration Form State
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Footwear & Sports');
  const [area, setArea] = useState('RS Puram, Coimbatore');
  const [address, setAddress] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
  };

  const faqs = [
    {
      q: 'Do I have to handle home delivery or courier shipping?',
      a: 'No! Zooner is designed specifically to drive high-intent shoppers directly through your physical shop doors. Customers discover your in-store inventory online, verify the exact size or fit, and walk into your store to purchase directly at your counter.'
    },
    {
      q: 'Does Zooner charge commission on my in-store walk-in sales?',
      a: 'Zero commission. You keep 100% of all in-store walk-in sales. Zooner works on a predictable, flat subscription model after your free 60-day trial with no hidden fees or percentage cuts.'
    },
    {
      q: 'How long does it take to upload and list our store inventory?',
      a: 'Under 10 minutes. You can scan barcodes with your smartphone camera, upload a simple Excel/CSV file from your existing billing POS, or snap quick photos of shelf displays. Our local onboarding executive can also assist you in person.'
    },
    {
      q: 'How does the "Customer Product Request" system work?',
      a: 'When a customer nearby searches for an item or size you carry (e.g. "Nike Pegasus UK 9" or "Mandarin Linen Shirt"), you receive an instant alert on your phone. Simply tap "In Stock & Hold for 2 Hours" to lock in the customer visit.'
    },
    {
      q: 'What verification documents are required to get listed?',
      a: 'To maintain platform trust, we require basic verification of physical storefront presence: a photo of your shop signage or GST registration document. Verification is completed within 2 business hours.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-slate-100 selection:bg-indigo-600 selection:text-white transition-colors duration-200">
      
      {/* 1. Dedicated Vendor Header: Exactly matching Customer Navbar height and alignment */}
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#070A12]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-[70px] items-center justify-between gap-4">
            
            {/* Left: Brand Logo & Partner Badge */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <a href="#" className="flex items-center gap-2.5 group">
                <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-slate-950">
                    <Store className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-['Outfit']">
                    Zooner<span className="text-indigo-600 dark:text-indigo-400">.</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 px-2 text-[11px] font-bold uppercase tracking-wider">
                    Partner Portal
                  </span>
                </div>
              </a>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <a href="#benefits" className="h-9 inline-flex items-center px-3.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                Benefits
              </a>
              <a href="#dashboard-demo" className="h-9 inline-flex items-center px-3.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                Live Demo
              </a>
              <a href="#how-it-works" className="h-9 inline-flex items-center px-3.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="h-9 inline-flex items-center px-3.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="h-9 inline-flex items-center px-3.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors">
                FAQ
              </a>
            </nav>

            {/* Right: Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Switch to Customer Site */}
              <button
                onClick={onSwitchToCustomer}
                className="h-9 inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
                title="Switch back to Customer shopping view"
              >
                <Compass className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Shop on Zooner</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
                title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
              </button>

              {/* Vendor Login */}
              <button
                onClick={onOpenSignIn}
                className="h-9 inline-flex items-center px-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                Vendor Login
              </button>

              {/* Register Free CTA */}
              <a
                href="#register"
                className="group h-9 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 text-sm font-bold text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all hover:-translate-y-0.5"
              >
                <span>Register Store Free</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Mobile & Tablet Right Bar (< lg): Clean, Compact, Evenly Aligned */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Quick Customer Switcher */}
              <button
                onClick={onSwitchToCustomer}
                className="h-9 inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Compass className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Shop</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Responsive Mobile Drawer for Vendor */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-16 sm:top-[70px] bg-white/95 dark:bg-[#070A12]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 px-6 py-6 shadow-2xl lg:hidden transition-all duration-300 max-h-[calc(100vh-70px)] overflow-y-auto">
            <div className="flex flex-col space-y-3 max-w-lg mx-auto">
              
              {/* Switch to Shopper mode */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSwitchToCustomer();
                }}
                className="flex items-center justify-between rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 text-left transition-colors hover:border-indigo-500/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Looking to discover products?</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Switch to Customer App</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline">Switch →</span>
              </button>

              {/* Vendor Nav Links */}
              <div className="py-2 space-y-1 border-y border-slate-100 dark:border-slate-800/80">
                {[
                  { name: 'Benefits', href: '#benefits' },
                  { name: 'Live Dashboard Demo', href: '#dashboard-demo' },
                  { name: 'How It Works', href: '#how-it-works' },
                  { name: 'Flat Pricing', href: '#pricing' },
                  { name: 'Retailer FAQ', href: '#faq' }
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </a>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSignIn();
                  }}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  Vendor Login
                </button>
                <a
                  href="#register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-colors"
                >
                  <span>Register Store Free</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

            </div>
          </div>
        )}
      </header>

      {/* 2. Vendor Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Eye-catching Ambient Aura Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-violet-500/15 dark:bg-violet-500/15 rounded-full blur-[110px] pointer-events-none" />
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(#6366f1 1.2px, transparent 1.2px)',
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 px-4 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
              <Building2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              FOR LOCAL PHYSICAL SHOPS & RETAILERS
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.1] mb-6 font-['Outfit']">
              Turn nearby searchers into{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500 dark:from-indigo-400 dark:via-violet-300 dark:to-blue-400 bg-clip-text text-transparent">
                walk-in footfall.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              Zooner connects your physical shop with customers within 15 km who are searching for what you stock right now. Answer live product requests, showcase real inventory, and win local sales with <strong>zero delivery hassle</strong>.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href="#register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
              >
                <span>Register Store Free (60 Days)</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                onClick={() => onNavigateToDashboard ? onNavigateToDashboard() : window.location.hash = '#vendor/dashboard'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-4 text-base font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
              >
                <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Launch Merchant OS</span>
              </button>
            </div>

            {/* Key Proof Points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white font-['Outfit']">0%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Walk-in commission</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white font-['Outfit']">11 mins</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Avg request answer</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white font-['Outfit']">+38%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Footfall growth</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white font-['Outfit']">1,420+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Active retail partners</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Interactive Merchant Command Center Dashboard Demo */}
      <section id="dashboard-demo" className="relative py-20 bg-slate-100/70 dark:bg-[#050810] border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Merchant Operating System
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-1 font-['Outfit']">
              Your Store's Digital Command Center
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              Everything you need to turn digital search intent into cash register sales.
            </p>
          </div>

          {/* Interactive Mockup Container */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-xl dark:shadow-2xl">
            
            {/* Dashboard Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Apex Footwear & Sports (DB Road, RS Puram)
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Store ID: ZNR-CBE-8842 · Verified Partner</div>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Footfall Analytics
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'requests'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Live Requests (3)
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'inventory'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Quick Inventory
                </button>
              </div>
            </div>

            {/* TAB 1: Analytics */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700/80">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Nearby Shopper Impressions</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mt-1">1,420</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">↑ +38% this week</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700/80">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Store Directions Clicked</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mt-1">94</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Walk-ins in progress</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700/80">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">2-Hour Hold Requests</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mt-1">36</div>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">89% completion rate</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700/80">
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Estimated Walk-In Sales</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] mt-1">₹2,84,500</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">0% commission taken</div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 sm:p-5 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Peak Local Discovery Hours (Coimbatore)</span>
                    <span className="text-indigo-600 dark:text-indigo-400">4 PM – 9 PM Highest Traffic</span>
                  </div>
                  <div className="flex items-end gap-2 h-20 pt-2">
                    {[35, 45, 30, 60, 80, 95, 90, 75, 50].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className="w-full rounded-t-lg bg-indigo-500 hover:bg-indigo-400 transition-all"
                          style={{ height: `${val}%` }}
                        />
                        <span className="text-[9px] text-slate-400 font-mono">{idx + 12}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Requests */}
            {activeTab === 'requests' && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Broadcasts from shoppers located within 5 km of your store:
                </div>
                
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Nike Pegasus 40 (Size UK 9)</span>
                      <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.5">Under 2 km away</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Budget: ₹6,000 – ₹7,500 · Shopper at Race Course</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 shadow-sm">
                      Confirm In-Stock (₹6,499)
                    </button>
                    <button className="rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1.5">
                      Decline
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Pure Linen Full Sleeve Shirt (Size 42)</span>
                      <span className="rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-1.5 py-0.5">Under 800m away</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Budget: ₹1,500 – ₹2,200 · Customer ready to walk in</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 shadow-sm">
                      Confirm In-Stock (₹1,899)
                    </button>
                    <button className="rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1.5">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Inventory */}
            {activeTab === 'inventory' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Shelf Catalog (184 Items)</div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 text-white text-xs font-bold px-3 py-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Product</span>
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold px-3 py-1.5 text-slate-700 dark:text-slate-300">
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>Sync POS</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80" alt="Shoe" className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Nike Air Zoom Pegasus</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">4 units in stock</div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white font-['Outfit']">₹6,499</div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=100&q=80" alt="Shirt" className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Pure Linen Mandarin Shirt</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">7 units in stock</div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white font-['Outfit']">₹1,899</div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=100&q=80" alt="Phone" className="h-12 w-12 rounded-lg object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Nothing Phone (2a) 256GB</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">2 units in stock</div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white font-['Outfit']">₹23,999</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 4. Why Physical Retailers Choose Zooner (Core Pillars) */}
      <section id="benefits" className="relative py-20 bg-white dark:bg-[#070A12] border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Retailer Advantage
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight mt-1 font-['Outfit']">
              Why Physical Stores Win with Zooner
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-2">
              E-commerce platforms take 15–30% cuts and force you to wait for returns. Zooner brings customer feet right to your physical counter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-5">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-['Outfit']">
                  Direct Store Footfall
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Appear at the exact moment a high-intent shopper within 5 km is searching for your items. They visit, try on, and buy on the spot.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                ✓ Zero packing or courier stress
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 flex items-center justify-center mb-5">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-['Outfit']">
                  Customer Request Alerts
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Receive live broadcast requests when shoppers can't find their exact shoe size or color. Tap once to confirm availability and win the sale.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-violet-600 dark:text-violet-400">
                ✓ 3x faster conversion than ads
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center mb-5">
                  <Tag className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-['Outfit']">
                  Promote Local Flash Deals
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Have surplus stock or weekend discounts? Broadcast localized offers to active shoppers in your neighborhood within 10 minutes.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-blue-600 dark:text-blue-400">
                ✓ Hyperlocal push notifications
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-['Outfit']">
                  100% Retained Revenue
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Never pay 20% commission or advertising click costs. Walk-in customers pay directly to your cash counter or UPI scanner.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ✓ Transparent flat subscription
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. How It Works (3 Steps for Retailers) */}
      <section id="how-it-works" className="relative py-20 bg-slate-100/60 dark:bg-[#060911] border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple Onboarding
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-1 font-['Outfit']">
              Live in Your Neighborhood in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-['Outfit'] mb-4 block">01</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-['Outfit']">Claim Your Physical Store</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enter your store name, physical address, business hours, and phone number. Our team verifies your location pin in 2 hours.
                </p>
              </div>
              <div className="mt-6 text-xs text-slate-500 font-medium pt-3 border-t border-slate-100 dark:border-slate-800">
                ✓ Free GPS positioning & verified badge
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-['Outfit'] mb-4 block">02</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-['Outfit']">Sync Your Shelf Inventory</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Scan barcodes, upload your POS spreadsheet, or snap photos of popular models. You decide what stock items to showcase.
                </p>
              </div>
              <div className="mt-6 text-xs text-slate-500 font-medium pt-3 border-t border-slate-100 dark:border-slate-800">
                ✓ Barcode auto-catalog & price sync
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-['Outfit'] mb-4 block">03</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-['Outfit']">Welcome Walk-In Buyers</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Answer incoming size requests, place 2-hour holds for verified shoppers, and ring up high-margin purchases at your store counter.
                </p>
              </div>
              <div className="mt-6 text-xs text-slate-500 font-medium pt-3 border-t border-slate-100 dark:border-slate-800">
                ✓ Repeat customers who live right around you
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Retailer Store Registration Form (Interactive On-Page) */}
      <section id="register" className="relative py-20 bg-white dark:bg-[#070A12] border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl dark:shadow-2xl">
            
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Partner Onboarding
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-1 font-['Outfit']">
                Register Your Store on Zooner
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Join 1,420+ physical stores in Coimbatore and across Tamil Nadu. Free for 60 days.
              </p>
            </div>

            {isRegistered ? (
              <div className="py-10 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-['Outfit']">
                  Registration Received, {storeName || 'Partner'}!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Our Coimbatore merchant field team will reach out to <strong>{phone || '+91 98422 10987'}</strong> within 2 hours to activate your live GPS pin and catalog access.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsRegistered(false)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Register Another Store Location
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Apex Footwear & Athleisure"
                      className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Owner / Manager Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      WhatsApp / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none shadow-sm"
                    >
                      <option value="Footwear & Sports">Footwear & Sports</option>
                      <option value="Men's & Women's Fashion">Men's & Women's Fashion</option>
                      <option value="Electronics & Mobile">Electronics & Mobile</option>
                      <option value="Home & Decor">Home & Decor</option>
                      <option value="Beauty & Wellness">Beauty & Wellness</option>
                      <option value="Artisan Groceries">Artisan Groceries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Neighborhood Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. RS Puram, Race Course"
                      className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Physical Store Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Building No, Street, Landmark (e.g. 42, DB Road, Opposite Flower Market)"
                    className="w-full rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-indigo-600/30"
                  >
                    <span>Submit Free Store Registration</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>No credit card required. Free trial starts upon physical verification.</span>
                </div>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* 7. Retailer Pricing Plans */}
      <section id="pricing" className="relative py-20 bg-slate-50 dark:bg-[#050810] border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Simple, Honest Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-1 font-['Outfit']">
              Zero Commissions. Flat Pricing.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Unlike delivery platforms that take 25% of your margins, Zooner only charges a flat monthly platform fee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Plan 1: 60-Day Pilot */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Free Pilot Trial</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Outfit']">60 Days Free</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-white font-['Outfit']">₹0</span>
                  <span className="text-xs text-slate-500 ml-1">for two full months</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Verified GPS store pin on Zooner map</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Catalog up to 100 shelf items</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Receive live customer product requests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Basic store footfall analytics</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <a
                  href="#register"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-3 text-sm font-bold transition-colors"
                >
                  Start 60-Day Pilot
                </a>
              </div>
            </div>

            {/* Plan 2: Merchant Pro */}
            <div className="relative rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-600 p-8 flex flex-col justify-between shadow-xl">
              <div className="absolute -top-3.5 right-6 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Full Power</span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-['Outfit']">Retailer Growth Pro</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-white font-['Outfit']">₹1,499</span>
                  <span className="text-xs text-slate-500 ml-1">/ month</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Priority top ranking in nearby search results</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Unlimited product catalog & barcode sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Instant SMS & WhatsApp customer broadcast alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Push weekend flash discounts to 5 km radius</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Dedicated local merchant account manager</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <a
                  href="#register"
                  className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-3 text-sm font-bold shadow-md shadow-indigo-600/25 transition-colors"
                >
                  Get Started With Pro
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. Vendor FAQ */}
      <section id="faq" className="relative py-20 bg-white dark:bg-[#070A12] border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white mt-1 font-['Outfit']">
              Frequently Asked Retailer Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-indigo-600 dark:text-indigo-400 text-lg transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. Dedicated Vendor Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              Z
            </div>
            <span className="text-white font-bold text-sm font-['Outfit']">Zooner Retailer Network</span>
            <span className="text-slate-600">|</span>
            <span>Supporting Physical Merchants Across India</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={onSwitchToCustomer}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Switch to Customer Discovery
            </button>
            <a href="#" className="hover:text-white">Partner Terms</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="tel:+919842210987" className="hover:text-white flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>Merchant Helpline</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};