"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function IconShield() {
  return (
    <svg width="40" height="40" viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path d="M128 24L48 52V112C48 172.8 82.4 228.8 128 240C173.6 228.8 208 172.8 208 112V52L128 24Z" fill="currentColor" opacity="0.2" />
      <path d="M208 52V112C208 172.8 173.6 228.8 128 240C82.4 228.8 48 172.8 48 112V52L128 24L208 52Z" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M169.6 101.6L117.6 153.6L86.4 122.4" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function IconExclamationTriangle() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,96a8,8,0,0,1,16,0v48a8,8,0,0,1-16,0Zm8,80a12,12,0,1,1,12-12A12,12,0,0,1,128,176Z" />
    </svg>
  );
}

function IconAlertTriangle() {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Z" />
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM128,96a12,12,0,1,1,12-12A12,12,0,0,1,128,96Z" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role !== "admin") {
          await supabase.auth.signOut();
          setError("Access denied. You do not have admin privileges.");
          setLoading(false);
          return;
        }
      }

      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex">
      {/* ── Left Panel: Brand / Visual ────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-[#0c1f3e] via-[#0f2a50] to-[#0c1f3e] relative overflow-hidden items-center justify-center">
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(30deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
              linear-gradient(150deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
              linear-gradient(270deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff),
              linear-gradient(90deg, #ffffff 12%, transparent 12.5%, transparent 87%, #ffffff 87.5%, #ffffff)
            `,
            backgroundSize: '80px 80px'
          }} />
        </div>

        {/* Gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#c8911e]/8 via-transparent to-transparent rounded-full" />

        <div className="relative z-10 max-w-md mx-auto px-12">
          {/* Shield icon */}
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-8 shadow-2xl mx-auto">
            <div className="text-[#c8911e]">
              <svg width="44" height="44" viewBox="0 0 256 256" fill="none" aria-hidden="true">
                <path d="M128 24L48 52V112C48 172.8 82.4 228.8 128 240C173.6 228.8 208 172.8 208 112V52L128 24Z" fill="currentColor" opacity="0.15" />
                <path d="M208 52V112C208 172.8 173.6 228.8 128 240C82.4 228.8 48 172.8 48 112V52L128 24L208 52Z" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M169.6 101.6L117.6 153.6L86.4 122.4" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white text-center tracking-tight mb-3">
            RescueMind AI
          </h1>
          <p className="text-slate-400 text-center text-lg leading-relaxed mb-8">
            Centralized department report management and AI-powered triage system for barangay operations.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#c8911e]/15 border border-[#c8911e]/20 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className="text-[#c8911e]" aria-hidden="true">
                  <path d="M128,136a8,8,0,0,1-8-8V80a8,8,0,0,1,16,0v48A8,8,0,0,1,128,136Zm-8,32a12,12,0,1,1,12-12A12,12,0,0,1,120,168Zm112-40A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI-Powered Classification</p>
                <p className="text-slate-500 text-xs">Automated report routing to 7 departments</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#c8911e]/15 border border-[#c8911e]/20 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className="text-[#c8911e]" aria-hidden="true">
                  <path d="M240,104H228.2A92.37,92.37,0,0,0,152,27.8V16a8,8,0,0,0-16,0V27.8A92.37,92.37,0,0,0,59.8,104H16a8,8,0,0,0,0,16H59.8A92.37,92.37,0,0,0,136,196.2V208a8,8,0,0,0,16,0V196.2A92.37,92.37,0,0,0,228.2,120H240a8,8,0,0,0,0-16Zm-64,48a76,76,0,1,1-76-76A76.08,76.08,0,0,1,176,152Z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Real-Time Dashboard</p>
                <p className="text-slate-500 text-xs">Live reports from every connected barangay</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#c8911e]/15 border border-[#c8911e]/20 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className="text-[#c8911e]" aria-hidden="true">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-156a8,8,0,0,1,8-8h0a8,8,0,0,1,8,8v55.48L162.49,148a8,8,0,0,1-11.32,11.32l-28-28A8,8,0,0,1,120,128ZM56,128a72,72,0,1,1,72,72A72.08,72.08,0,0,1,56,128Z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Instant Triage</p>
                <p className="text-slate-500 text-xs">Urgency scoring and priority routing</p>
              </div>
            </div>
          </div>

          {/* Bottom decorative bar */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <span className="w-12 h-0.5 rounded-full bg-slate-700" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">RescueMind v1.0</span>
            <span className="w-12 h-0.5 rounded-full bg-slate-700" />
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ───────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo (visible only on small screens) */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#0c1f3e] flex items-center justify-center shadow-lg">
              <svg width="28" height="28" viewBox="0 0 256 256" fill="none" className="text-[#c8911e]" aria-hidden="true">
                <path d="M128 24L48 52V112C48 172.8 82.4 228.8 128 240C173.6 228.8 208 172.8 208 112V52L128 24Z" fill="currentColor" opacity="0.15" />
                <path d="M208 52V112C208 172.8 173.6 228.8 128 240C82.4 228.8 48 172.8 48 112V52L128 24L208 52Z" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M169.6 101.6L117.6 153.6L86.4 122.4" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Sign in to your account</h2>
            <p className="text-[#6b7280] text-sm mt-1.5">
              Enter your credentials to access the admin dashboard.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
              <div className="shrink-0 mt-0.5 text-red-500"><IconExclamationTriangle /></div>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-xs font-semibold text-[#374151] block">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@barangay.gov.ph"
                required
                autoComplete="email"
                autoFocus
                className="w-full h-12 px-4 rounded-xl border border-[#d1d5db] bg-white text-[#111827] placeholder:text-[#9ca3af] text-sm focus:outline-none focus:ring-2 focus:ring-[#c8911e]/30 focus:border-[#c8911e] transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="admin-password" className="text-xs font-semibold text-[#374151] block">
                  Password
                </label>
              </div>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                autoComplete="current-password"
                className="w-full h-12 px-4 rounded-xl border border-[#d1d5db] bg-white text-[#111827] placeholder:text-[#9ca3af] text-sm focus:outline-none focus:ring-2 focus:ring-[#c8911e]/30 focus:border-[#c8911e] transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-12 bg-[#0c1f3e] hover:bg-[#162d58] text-white font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <IconSpinner />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <IconArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2.5">
              <div className="shrink-0 mt-0.5 text-amber-600"><IconAlertTriangle /></div>
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-0.5">Restricted Access</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  This portal requires an <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[11px]">admin</code> role in your Supabase profile. Only authorized personnel can access department data.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[#9ca3af]">
            &copy; {new Date().getFullYear()} RescueMind AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
