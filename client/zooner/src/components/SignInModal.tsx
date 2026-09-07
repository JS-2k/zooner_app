import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';
import { loginUser, registerUser, syncUserProfile } from '../services/api';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRetailer?: () => void;
  initialRole?: 'C' | 'V' | 'VC';
  initialTab?: 'signin' | 'register';
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRetailer,
  initialTab = 'signin',
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        setAuthError('An account with this email already exists.');
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
      setAuthError('An account with this email already exists.');
    }
  };

  const handleGoogleAuth = () => {
    // Demo / quick Google sign in integration
    const dummyUser = {
      id: 'usr-google-1',
      name: 'Surya',
      email: email.trim() || 'lpycho3@gmail.com',
      role: 'Customer',
      isVendor: false
    };
    localStorage.setItem('zooner_user_profile', JSON.stringify(dummyUser));
    localStorage.setItem('zooner_customer_profile', JSON.stringify({
      name: dummyUser.name,
      phone: phone || '+91 6381382644'
    }));
    window.dispatchEvent(new Event('storage'));
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 text-gray-900 z-10">
        {/* Top Header Bar */}
        <div className="relative flex items-center justify-center mb-6">
          <button 
            onClick={onClose}
            type="button"
            className="absolute left-0 p-2 -ml-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="font-bold text-2xl tracking-tight text-gray-950 select-none">
            zooner<span className="text-[#00A859]">.</span>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-[#00A859] border border-green-200">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 font-['Inter']">
              {activeTab === 'signin' ? 'Welcome back!' : 'Account created successfully!'}
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              Signed in as <span className="text-[#00A859] font-bold">{signedInRole}</span>
            </p>
          </div>
        ) : activeTab === 'signin' ? (
          /* ── Screen 7: Sign In ── */
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-950 tracking-tight">Welcome back</h3>
              <p className="text-xs text-gray-500 mt-1">Sign in to continue shopping local.</p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600">
                {authError}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-white border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#00A859] focus:ring-1 focus:ring-[#00A859] outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-white border border-gray-200 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#00A859] focus:ring-1 focus:ring-[#00A859] outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your registered email.')}
                    className="text-xs font-medium text-[#00A859] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00A859] hover:bg-[#00924d] py-3 text-sm font-semibold text-white transition-all shadow-xs disabled:opacity-60 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs text-gray-400">
                  <span className="bg-white px-2">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27a7.195 7.195 0 0 1 0-4.54V6.58H1.25a11.96 11.96 0 0 0 0 10.84l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <p className="text-center text-xs text-gray-500 pt-3">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setAuthError('');
                  }}
                  className="font-semibold text-[#00A859] hover:underline cursor-pointer"
                >
                  Create one
                </button>
              </p>

              {onSwitchToRetailer && (
                <p className="text-center text-[11px] text-gray-400 pt-1 font-medium">
                  Own a physical store?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSwitchToRetailer();
                    }}
                    className="text-[#00A859] font-semibold hover:underline cursor-pointer"
                  >
                    Register your store →
                  </button>
                </p>
              )}
            </form>
          </div>
        ) : (
          /* ── Screen 8: Create Account ── */
          <div>
            <div className="text-center mb-5">
              <h3 className="text-2xl font-bold text-gray-950 tracking-tight">Create your account</h3>
              <p className="text-xs text-gray-500 mt-1">Join Zooner for a better local shopping experience.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Surya"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl bg-white border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#00A859] focus:ring-1 focus:ring-[#00A859] outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${authError ? 'text-red-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    required
                    placeholder="lpycho3@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    className={`w-full rounded-xl bg-white border py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-hidden transition-all ${
                      authError ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400 bg-red-50/10' : 'border-gray-200 focus:border-[#00A859] focus:ring-1 focus:ring-[#00A859]'
                    }`}
                  />
                </div>
                {authError && (
                  <p className="text-[11px] font-medium text-red-500 mt-1 pl-1">
                    {authError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile number (optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="6381382644"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl bg-white border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-[#00A859] focus:ring-1 focus:ring-[#00A859] outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-white border border-gray-200 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-[#00A859] focus:ring-1 focus:ring-[#00A859] outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00A859] hover:bg-[#00924d] py-3 text-sm font-semibold text-white transition-all shadow-xs disabled:opacity-60 cursor-pointer mt-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs text-gray-400">
                  <span className="bg-white px-2">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27a7.195 7.195 0 0 1 0-4.54V6.58H1.25a11.96 11.96 0 0 0 0 10.84l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <p className="text-center text-xs text-gray-500 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setAuthError('');
                  }}
                  className="font-semibold text-[#00A859] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
