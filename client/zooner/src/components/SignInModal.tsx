import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, UserCheck, Store, ShieldCheck } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRetailer: () => void;
  initialRole?: 'C' | 'V' | 'VC';
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRetailer: _onSwitchToRetailer,
  initialRole = 'C',
}) => {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'C' | 'V' | 'VC'>(initialRole);
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');

    // Save logged in user profile with role C / V / VC into localStorage
    const userProfile = {
      name: role === 'V' || role === 'VC' ? 'Local Merchant' : 'Customer Account',
      phone: `+91 ${phone || '98422 12345'}`,
      role: role, // 'C', 'V', or 'VC'
      isVendor: role === 'V' || role === 'VC',
      loggedInAt: Date.now()
    };
    localStorage.setItem('zooner_user_profile', JSON.stringify(userProfile));
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      setStep('phone');
      setPhone('');
      onClose();
    }, 1200);
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
            <p className="text-xs text-slate-400">Unified Passport · Customer & Vendor Access</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            
            {/* Account Role Selector (C, V, VC) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('C')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    role === 'C'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Customer (C)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('V')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    role === 'V'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Store className="h-4 w-4" />
                  <span>Vendor (V)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('VC')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    role === 'VC'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Both (V/C)</span>
                </button>
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
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-sm font-bold text-slate-950 hover:brightness-105 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Get Verification Code</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {role !== 'V' && (
              <div className="text-center text-xs text-slate-400 pt-2">
                Are you a local shop owner?{' '}
                <button
                  type="button"
                  onClick={() => setRole('V')}
                  className="text-amber-400 font-bold hover:underline"
                >
                  Switch to Vendor Mode (V) →
                </button>
              </div>
            )}
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-slate-300">
              Enter the 4-digit OTP sent via SMS to <strong className="text-white">+91 {phone || '9876543210'}</strong>
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
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
            >
              Verify & Continue
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
              Logged in as <span className="text-emerald-400 font-bold">{role === 'V' ? 'Vendor (V)' : role === 'VC' ? 'Both (V/C)' : 'Customer (C)'}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
