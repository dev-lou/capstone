"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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

function IconSpinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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

export default function AdminAuthPage() {
  const router = useRouter();
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

      router.push("/dashboard");
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0c1f3e] to-[#0f172a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(30deg, #ffffff 12%, transparent 12.5%),
            linear-gradient(150deg, #ffffff 12%, transparent 12.5%),
            linear-gradient(270deg, #ffffff 12%, transparent 12.5%),
            linear-gradient(90deg, #ffffff 12%, transparent 12.5%)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-[#c8911e]/6 via-transparent to-transparent rounded-full" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center border-b border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-lg">
              <div className="text-[#c8911e]/80"><IconShield /></div>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">RescueMind Auth</h1>
            <p className="text-slate-400 text-xs mt-1 font-medium">Admin Command Center</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
                <div className="shrink-0 mt-0.5"><IconExclamationTriangle /></div>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="text-xs font-semibold text-slate-300 block">
                  Email address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@barangay.gov.ph"
                  required
                  autoComplete="email"
                  autoFocus
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8911e]/30 focus:border-[#c8911e]/50 transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="auth-password" className="text-xs font-semibold text-slate-300 block">
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#c8911e]/30 focus:border-[#c8911e]/50 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full h-11 bg-gradient-to-r from-[#c8911e] to-[#d4a42a] hover:from-[#b07d18] hover:to-[#c8911e] text-[#0c1f3e] font-semibold text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <IconSpinner />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate</span>
                    <IconArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <p className="text-xs text-amber-400/80 leading-relaxed">
                <span className="font-semibold text-amber-300">Authorized personnel only.</span> Requires an <code className="px-1 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[11px]">admin</code> role in Supabase. Unauthorized access is monitored.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
