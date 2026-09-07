import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Loader2, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [signedInRole, setSignedInRole] = useState<'Customer' | 'Merchant' | 'Customer & Merchant'>('Customer');

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const authRes = await loginUser(cleanEmail, password);

      if (!authRes) {
        setAuthError('Invalid email or password. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      // Sync user profile & shops
      const profile = await syncUserProfile();
      if (profile && profile.isVendor) {
        setSignedInRole('Customer & Merchant');
      } else {
        setSignedInRole('Customer');
      }

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        setPassword('');
        onClose();
      }, 1200);
    } catch {
      setIsLoading(false);
      setAuthError('Unable to connect to authentication server. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const authRes = await registerUser({
        fullName: fullName.trim(),
        email: cleanEmail,
        password,
        phoneNumber: phone.trim() ? `+91 ${phone.replace(/[^0-9]/g, '')}` : undefined,
        role: 'Customer'
      });

      if (!authRes) {
        setAuthError('Registration failed. An account with this email may already exist.');
        setIsLoading(false);
        return;
      }

      const profile = await syncUserProfile();
      if (profile && profile.isVendor) {
        setSignedInRole('Customer & Merchant');
      } else {
        setSignedInRole('Customer');
      }

      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        setPassword('');
        setFullName('');
        setPhone('');
        onClose();
      }, 1200);
    } catch {
      setIsLoading(false);
      setAuthError('Registration request failed. Please check your network connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Zooner Account</h3>
            <p className="text-xs text-slate-500 font-medium">One account for local shopping & store management</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        {!isSuccess && (
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-5 border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setAuthError('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'signin'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setAuthError('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
            {authError}
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 font-['Outfit']">
              {activeTab === 'signin' ? 'Signed in successfully!' : 'Account created successfully!'}
            </h4>
            <p className="text-xs text-slate-500">
              Authenticated · <span className="text-emerald-600 font-bold">{signedInRole}</span>
            </p>
          </div>
        ) : activeTab === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none shadow-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none shadow-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {onSwitchToRetailer && (
              <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100 font-medium">
                Own a physical store?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToRetailer();
                  }}
                  className="text-emerald-600 font-bold hover:underline cursor-pointer"
                >
                  Register your store →
                </button>
              </div>
            )}
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none shadow-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none shadow-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none shadow-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none shadow-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
