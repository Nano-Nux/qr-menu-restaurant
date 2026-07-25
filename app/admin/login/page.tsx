'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Utensils, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('aurelia2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    let active = true;

    const timeoutId = setTimeout(() => {
      if (active) setCheckingAuth(false);
    }, 3000);

    const token = typeof window !== 'undefined' ? localStorage.getItem('aurelia_admin_session') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch('/api/admin/me', { headers })
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          clearTimeout(timeoutId);
          if (data.authenticated) {
            router.replace('/admin');
          } else {
            setCheckingAuth(false);
          }
        }
      })
      .catch(() => {
        if (active) {
          clearTimeout(timeoutId);
          setCheckingAuth(false);
        }
      });

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('aurelia_admin_session', data.token);
      }

      // Success -> Show toast notification and redirect after brief delay
      setSuccessMessage('Authentication successful! Redirecting to Management Dashboard...');

      setTimeout(() => {
        window.location.href = '/admin';
      }, 900);
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to login service.');
      setLoading(false);
    }
  };

  const fillDemoCreds = () => {
    setUsername('admin');
    setPassword('aurelia2026');
    setError(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0d0b08] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#d1c7b7] font-mono uppercase tracking-widest">Checking Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0b08] text-[#f4efe6] flex flex-col justify-between selection:bg-[#d4af37] selection:text-black">
      {/* Floating Success Toast Notification */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#142318] border border-emerald-500/60 text-emerald-100 shadow-2xl backdrop-blur-md transition-all">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-emerald-300 block">Authenticated</span>
            <span className="text-[#d1c7b7]">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="p-6 border-b border-white/5 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f9e79f] p-[1px] shadow-md">
            <div className="w-full h-full bg-[#0d0b08] rounded-full flex items-center justify-center group-hover:bg-[#1a1711] transition-colors">
              <Utensils className="w-4 h-4 text-[#d4af37]" />
            </div>
          </div>
          <div>
            <span className="font-serif text-lg tracking-[0.2em] font-bold text-gradient-gold block leading-tight">
              AURELIA
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#d1c7b7]/60 block font-sans">
              Haute Cuisine
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs text-[#d1c7b7]/80 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20"
        >
          <span>Return to Menu</span>
        </Link>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-[#13110c] border border-[#d4af37]/30 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Subtle gold ambient lighting glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Badge & Title */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-[11px] font-semibold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Management Portal</span>
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-wide text-white">
              Admin Authentication
            </h1>
            <p className="text-xs text-[#d1c7b7]/70">
              Sign in to manage digital menu, promotions, orders, and reservations.
            </p>
          </div>

          {/* Demo Credentials Callout */}
          <div className="mb-6 p-3.5 rounded-xl bg-[#1c1812] border border-[#d4af37]/20 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[#d4af37] font-semibold text-[11px]">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Default Credentials</span>
              </div>
              <p className="text-[11px] text-[#d1c7b7]/90">
                User: <code className="text-white bg-black/40 px-1 py-0.5 rounded">admin</code> | Pass: <code className="text-white bg-black/40 px-1 py-0.5 rounded">aurelia2026</code>
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemoCreds}
              className="px-2.5 py-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] text-[11px] font-medium transition-all shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Autofill</span>
            </button>
          </div>

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3 shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-300">Access Granted</p>
                <p className="text-[11px] text-emerald-200/80">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-500/30 text-red-200 text-xs text-center animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#d1c7b7] uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#d1c7b7]/50">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 bg-[#0d0b08] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#d1c7b7] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#d1c7b7]/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-10 py-3 bg-[#0d0b08] border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#d4af37] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#d1c7b7]/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gold-gradient hover:opacity-95 text-black font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="p-6 text-center border-t border-white/5 text-xs text-[#d1c7b7]/40">
        &copy; {new Date().getFullYear()} Aurelia Fine Dining. Protected Management System.
      </footer>
    </div>
  );
}
