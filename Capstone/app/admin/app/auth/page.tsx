"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

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

      // Check if user has admin role
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
          : "May error na naganap. Pakisubukan muli."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_70%)]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]" />
      </div>

      <div className="w-full max-w-[440px] z-10 relative">
        {/* High-end Glass Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative group">
          
          {/* Subtle Top Border Glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />

          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center border-b border-slate-800/50 bg-slate-900/40">
            <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center mb-5 shadow-[0_0_15px_rgba(14,165,233,0.15)] relative">
              <div className="absolute inset-0 rounded-xl ring-1 ring-sky-500/20 animate-pulse" />
              <svg width="28" height="28" viewBox="0 0 256 256" fill="currentColor" className="text-sky-400" aria-hidden="true">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,76a32,32,0,1,1-32,32A32,32,0,0,1,128,76Zm0,48a16,16,0,1,0-16-16A16,16,0,0,0,128,124Zm0,76c-17.57,0-33.22-5.59-44.83-14.54A8,8,0,0,1,91.53,175c8.6,5.45,17.35,9,36.47,9s27.87-3.55,36.47-9a8,8,0,1,1,8.38,13.63C161.22,194.41,145.57,200,128,200Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-100 tracking-tight mb-1">RescueMind Nexus</h1>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <p className="text-sky-400/80 text-xs font-mono uppercase tracking-widest">Admin Command Center</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-lg flex items-start gap-3 mb-6 shadow-[0_0_15px_rgba(239,68,68,0.1)]" role="alert">
                <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true">
                  <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Zm-15.63,14a8.29,8.29,0,0,1-7.27,4.19H40.55a8.29,8.29,0,0,1-7.27-4.19,7.56,7.56,0,0,1,0-8l87.5-151.87a8.68,8.68,0,0,1,14.44,0l87.5,151.87A7.56,7.56,0,0,1,221.17,202.09Z" />
                </svg>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="admin-email" className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Secure ID (Email)</label>
                <div className="relative">
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@barangay.gov.ph"
                    required
                    autoComplete="email"
                    className="w-full bg-slate-950/50 border border-slate-700/50 text-slate-200 placeholder:text-slate-600 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label htmlFor="admin-password" className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Access Protocol (Password)</label>
                </div>
                <div className="relative">
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="current-password"
                    className="w-full bg-slate-950/50 border border-slate-700/50 text-slate-200 placeholder:text-slate-600 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-200 tracking-widest font-mono shadow-inner"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || !email || !password} 
                className="w-full mt-4 bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-medium py-3.5 rounded-lg shadow-[0_0_20px_rgba(14,165,233,0.2)] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 border border-sky-400/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Initialize Session</span>
                )}
              </button>
            </form>
          </div>
          
          {/* Footer Info */}
          <div className="px-8 py-5 bg-slate-900/80 border-t border-slate-800/50">
            <div className="flex items-start gap-2.5">
              <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" className="text-amber-500/70 shrink-0 mt-0.5">
                <path d="M112,176a8,8,0,0,1,16,0v32a8,8,0,0,1-16,0Zm16-96a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V88A8,8,0,0,0,128,80ZM236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Zm-15.63,14a8.29,8.29,0,0,1-7.27,4.19H40.55a8.29,8.29,0,0,1-7.27-4.19,7.56,7.56,0,0,1,0-8l87.5-151.87a8.68,8.68,0,0,1,14.44,0l87.5,151.87A7.56,7.56,0,0,1,221.17,202.09Z" />
              </svg>
              <p className="text-[11px] leading-relaxed text-slate-400">
                <span className="font-semibold text-slate-300">Level 4 Clearance Required.</span> Unauthorized access is monitored. Requires <code className="font-mono text-[10px] bg-slate-950 border border-slate-800 text-sky-400 px-1 py-0.5 rounded">admin</code> role in the central registry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
