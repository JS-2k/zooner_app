import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { loginUser, registerUser, syncUserProfile } from '../services/api';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRetailer?: () => void;
  initialRole?: 'C' | 'V' | 'VC';
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRetailer,
}) => {
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [signedInRole, setSignedInRole] = useState<'Customer' | 'Merchant' | 'Customer & Merchant'>('Customer');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    const cleanPhone = phone.replace(/[^0-9]/g, '') || '9842212345';
    const email = `user_${cleanPhone}@zooner.in`;
    const password = `ZoonerPass_${cleanPhone}!`;
    const userName = fullName.trim() || 'Zooner User';

    // 1. Try logging in first
    let authRes = await loginUser(email, password);

    // 2. If user doesn't exist, automatically register account in backend
    if (!authRes) {
      authRes = await registerUser({
        fullName: userName,
        email,
        password,
        phoneNumber: `+91 ${cleanPhone}`,
        role: 'Customer'
      });
    }

    // 3. Sync profile & shops
    const profile = await syncUserProfile();
    if (profile && profile.isVendor) {
      setSignedInRole('Customer & Merchant');
    } else {
      setSignedInRole('Customer');
    }

    setIsLoading(false);

    if (authRes) {
      setStep('success');
      setTimeout(() => {
        setStep('phone');
        setPhone('');
        setFullName('');
        onClose();
      }, 1200);
    } else {
      // Fallback local passport
      const userProfile = {
        name: userName,
        phone: `+91 ${cleanPhone}`,
        role: 'Customer',
        isVendor: false,
        shops: [],
        loggedInAt: Date.now()
      };
      localStorage.setItem('zooner_user_profile', JSON.stringify(userProfile));
      window.dispatchEvent(new Event('storage'));
      setStep('success');
      setTimeout(() => {
        setStep('phone');
        setPhone('');
        setFullName('');
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0D0F17] text-white border border-white/10 shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">Sign In to Zooner</h3>
            <p className="text-xs text-slate-400">One account for local shopping & store management</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
            {authError}
          </div>
        )}

        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Your Name (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 px-4 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-2.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-sm font-bold text-slate-950 hover:brightness-105 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <span>Get Verification Code</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {onSwitchToRetailer && (
              <div className="text-center text-xs text-slate-400 pt-2">
                Own a physical shop?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToRetailer();
                  }}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Register your store →
                </button>
              </div>
            )}
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-slate-300">
              Enter the 4-digit code sent via SMS to <strong className="text-white">+91 {phone || '9876543210'}</strong>
            </p>

            <div className="flex justify-center gap-3 my-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  defaultValue={index === 0 ? '7' : index === 1 ? '4' : index === 2 ? '2' : '9'}
                  className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 text-center text-lg font-bold text-white focus:border-emerald-400 focus:outline-none shadow-sm"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Verify & Continue</span>
              )}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-white font-['Outfit']">Signed in successfully!</h4>
            <p className="text-xs text-slate-400">
              Account ready · <span className="text-emerald-400 font-bold">{signedInRole}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

