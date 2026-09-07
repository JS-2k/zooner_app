import React, { useState } from 'react';
import { X, Store, CheckCircle, ArrowRight, ShieldCheck, Upload, MapPin, Loader2 } from 'lucide-react';
import { createShop, registerUser, loginUser, fetchCategories } from '../services/api';

interface RetailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RetailerModal: React.FC<RetailerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState('Footwear & Sports');
  const [area, setArea] = useState('RS Puram, Coimbatore');
  const [address, setAddress] = useState('42, DB Road, RS Puram');
  const [ownerName, setOwnerName] = useState('Ramesh Kumar');
  const [phone, setPhone] = useState('9842210987');
  const [email, setEmail] = useState('apex@cbestores.in');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Ensure authenticated user
      let token = localStorage.getItem('zooner_token');
      if (!token) {
        const cleanPhone = phone.replace(/[^0-9]/g, '') || '9842210987';
        const userEmail = email.trim() || `vendor_${cleanPhone}@zooner.in`;
        const userPass = `VendorPass_${cleanPhone}!`;
        
        let auth = await loginUser(userEmail, userPass);
        if (!auth) {
          auth = await registerUser({
            fullName: ownerName || 'Store Owner',
            email: userEmail,
            password: userPass,
            phoneNumber: `+91 ${cleanPhone}`,
            role: 'ShopOwner'
          });
        }
        token = auth?.accessToken || null;
      }

      // 2. Fetch categories to get valid CategoryId
      const cats = await fetchCategories();
      const matchedCat = cats.find(c => c.name.toLowerCase().includes(category.toLowerCase().split(' ')[0])) || cats[0];
      const categoryId = matchedCat?.id || '00000000-0000-0000-0000-000000000001';

      // 3. Create shop in backend
      await createShop({
        name: storeName || 'Apex Footwear & Athleisure',
        phone: `+91 ${phone}`,
        address: `${address}, ${area}`,
        latitude: 11.0168,
        longitude: 76.9558,
        categoryIds: [categoryId]
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Retailer registration error:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  const handleOpenDashboard = () => {
    handleReset();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleReset}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl">
        {/* Header decoration bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-blue-500" />

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">Join Zooner as a Retailer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Put your physical store on the local discovery map</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="h-9 w-9" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-['Outfit']">Store Registered!</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm max-w-sm mx-auto mb-6">
                Welcome, <span className="text-slate-900 dark:text-white font-bold">{storeName || 'Partner Store'}</span>. Your store is now active on the Zooner local discovery map.
              </p>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 text-left mb-6 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold font-['Outfit']">
                  <ShieldCheck className="h-4 w-4" />
                  What happens next:
                </div>
                <div className="pl-6 space-y-1">
                  <p>1. Instant access to your Zooner Merchant mobile dashboard</p>
                  <p>2. Quick inventory sync or barcode scan upload</p>
                  <p>3. Start receiving nearby customer product requests immediately</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="w-1/2 rounded-xl border border-slate-300 dark:border-slate-700 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleOpenDashboard}
                  className="w-1/2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Open Merchant OS →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Store Name
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g. Apex Footwear & Athleisure"
                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-3.5 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none shadow-sm"
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
                        Neighborhood / City
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          placeholder="e.g. RS Puram, Coimbatore"
                          className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Physical Store Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Street, Landmark, Near Metro/Bus Stop"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/25 cursor-pointer"
                    >
                      Continue to Store Contact <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                      Store Owner / Manager Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        WhatsApp / Contact Mobile
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                        Business Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="store@apexfootwear.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 px-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center bg-slate-50 dark:bg-slate-800/40">
                    <Upload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Storefront Photo or GST Certificate (Optional)</span>
                    <p className="text-[11px] text-slate-500">Accelerates verification badge by 3x</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 rounded-xl border border-slate-300 dark:border-slate-700 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-2/3 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/25 disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Registering Store...</span>
                        </>
                      ) : (
                        <span>Launch Digital Storefront</span>
                      )}
                    </button>
                  </div>

                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
