import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to admin immediately
  const from = (location.state as any)?.from?.pathname || '/admin';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your staff email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c050c] text-[#f7efe7] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#e8c7bc] selection:text-[#2c0c15]">
      {/* Ambient background glow accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#731d34]/25 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#c58e91]/20 blur-[120px] pointer-events-none" />

      {/* Top Bar: Return to Public Site */}
      <header className="px-6 py-5 max-w-6xl mx-auto w-full flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[rgba(203,184,185,0.85)] hover:text-[#f7efe7] transition-colors py-2 px-3 rounded-full hover:bg-white/5 border border-transparent hover:border-[rgba(226,184,178,0.2)]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Souparnika Website</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] text-[#e2b8b2] bg-white/5 px-3 py-1 rounded-full border border-[rgba(226,184,178,0.2)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#e7cfaf]" />
          <span>Staff Studio Portal</span>
        </div>
      </header>

      {/* Central Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md glass-panel rounded-3xl border border-[rgba(226,184,178,0.25)] p-8 sm:p-10 shadow-luxury space-y-8 backdrop-blur-xl relative">
          {/* Brand & Crest */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#731d34] to-[#2c0c15] text-[#e7cfaf] font-serif font-bold text-xl flex items-center justify-center mx-auto border border-[rgba(226,184,178,0.4)] shadow-subtle">
              TS
            </div>
            <div>
              <h1 className="font-serif text-3xl font-normal text-[#f7efe7] tracking-tight">
                Staff Studio
              </h1>
              <p className="text-xs text-[rgba(203,184,185,0.8)] mt-1">
                Thekkanath Souparnika Management & Operations
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#e2b8b2]">
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[rgba(203,184,185,0.6)]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. staff@thekkanath.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/30 border border-[rgba(226,184,178,0.22)] focus:border-[#e7cfaf] focus:outline-none focus:ring-1 focus:ring-[#e7cfaf] text-sm text-[#f7efe7] placeholder-[rgba(203,184,185,0.4)] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-[#e2b8b2]">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[rgba(203,184,185,0.6)]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-black/30 border border-[rgba(226,184,178,0.22)] focus:border-[#e7cfaf] focus:outline-none focus:ring-1 focus:ring-[#e7cfaf] text-sm text-[#f7efe7] placeholder-[rgba(203,184,185,0.4)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[rgba(203,184,185,0.6)] hover:text-[#f7efe7]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl text-xs font-semibold text-[#2c0c15] bg-gradient-to-r from-[#e8c7bc] via-[#d8aba2] to-[#c58e91] hover:from-[#f3ded8] hover:to-[#d4a098] shadow-luxury border border-[rgba(226,184,178,0.5)] transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Staff Studio</span>
              )}
            </button>
          </form>

          {/* Secure System Notice */}
          <div className="pt-4 border-t border-[rgba(226,184,178,0.15)] text-center text-[11px] text-[rgba(203,184,185,0.65)] leading-relaxed">
            Authorized personnel only. Access sessions and administrative activities are audited in PostgreSQL system logs.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[rgba(203,184,185,0.6)] z-10">
        Thekkanath Souparnika Hall &copy; {new Date().getFullYear()} &middot; Nellikunnu, Thrissur, Kerala
      </footer>
    </div>
  );
};
