import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRetailer: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRetailer,
}) => {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
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

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">Sign In to Zooner</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Discover & save products at nearby stores</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 py-2.5 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/25"
            >
              <span>Get Verification Code</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
              Are you a local shop owner?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSwitchToRetailer();
                }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Log in to Merchant Portal →
              </button>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Enter the 4-digit OTP sent via SMS to <strong className="text-slate-900 dark:text-white">+91 {phone || '9876543210'}</strong>
            </p>

            <div className="flex justify-center gap-3 my-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  defaultValue={index === 0 ? '7' : index === 1 ? '4' : index === 2 ? '2' : '9'}
                  className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center text-lg font-bold text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none shadow-sm"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/25"
            >
              Verify & Continue
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white font-['Outfit']">Signed in successfully!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Loading your nearby store preferences...</p>
          </div>
        )}
      </div>
    </div>
  );
};
