import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const friendlyError = (message: string): string => {
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Check your details and try again.';
  }
  if (message.includes('Email not confirmed')) {
    return 'This email is not confirmed yet. Open the confirmation link sent to your inbox, then sign in.';
  }
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Sign in instead.';
  }
  if (message.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  return message;
};

export const LoginView: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const configured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailSent(false);
    const client = getSupabaseClient();
    if (!client) {
      setError('Supabase is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to activate real authentication.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error: signInError } = await client.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (signInError) setError(friendlyError(signInError.message));
      } else {
        const { data, error: signUpError } = await client.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { full_name: name.trim(), role: 'super_admin' } },
        });
        if (signUpError) {
          setError(friendlyError(signUpError.message));
        } else if (!data.session) {
          setEmailSent(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Brand panel */}
      <div className="hidden lg:flex w-[46%] flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white p-10">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </span>
          <div>
            <div className="font-display font-black text-2xl tracking-tight leading-none">MANZILIQ</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Smart Housing Society Management</div>
          </div>
        </div>

        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Platform Super Admin • Prototype
          </span>
          <h1 className="font-display text-4xl font-black leading-tight">
            Governance &amp; Executive Control Center
          </h1>
          <p className="text-sm text-slate-300 max-w-md">
            Monitor verified housing societies, onboard dealers and review fraud
            flags — the same admin experience as the live ManzilIQ platform,
            rebuilt here as a representation prototype.
          </p>
          <ul className="space-y-2.5 text-sm text-slate-300">
            {['Real Supabase authentication', 'Same ManzilIQ admin UI', 'Sample data only — no real actions'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[11px] text-slate-500">
          ManzilIQ Final Year Project • UET Narowal • Prototype build — demo data only
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <div className="font-display font-black text-xl leading-none">MANZILIQ</div>
              <div className="text-[11px] text-slate-500">Admin Prototype</div>
            </div>
          </div>

          <div>
            <span className="bg-indigo-100 text-indigo-900 font-bold text-xs px-2.5 py-0.5 rounded border border-indigo-200">
              Platform Super Admin
            </span>
            <h2 className="font-display text-2xl font-black text-slate-900 mt-2">
              {mode === 'signin' ? 'Sign in to Admin Portal' : 'Create admin account'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'signin'
                ? 'Use a real account from the ManzilQ Supabase project.'
                : 'Creates a real account in the ManzilQ Supabase project.'}
            </p>
          </div>

          {!configured && (
            <div className="flex gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Supabase is not configured. Set <code className="font-mono font-bold">VITE_SUPABASE_URL</code> and{' '}
                <code className="font-mono font-bold">VITE_SUPABASE_ANON_KEY</code> in <code className="font-mono font-bold">.env</code> to
                activate real authentication.
              </span>
            </div>
          )}

          {emailSent && (
            <div className="flex gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl p-3">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Account created. A confirmation link was sent to <strong>{email}</strong> — open it,
                then sign in.
              </span>
            </div>
          )}

          {error && (
            <div className="flex gap-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl p-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Shoukat"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !configured}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            {mode === 'signin' ? (
              <>
                No account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="text-indigo-700 font-bold hover:underline"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(null); }}
                  className="text-indigo-700 font-bold hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          <p className="text-[11px] text-center text-slate-400">
            Prototype — real Supabase Auth, dashboard is a visual shell with sample data.
          </p>
        </div>
      </div>
    </div>
  );
};
