"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AdminLoginPage() {
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
          : "May error na naganap. Pakisubukan muli."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card-ph overflow-hidden">
          <div className="bg-[var(--color-ph-navy)] px-8 py-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 256 256" fill="currentColor" className="text-white" aria-hidden="true">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,76a32,32,0,1,1-32,32A32,32,0,0,1,128,76Zm0,48a16,16,0,1,0-16-16A16,16,0,0,0,128,124Zm0,76c-17.57,0-33.22-5.59-44.83-14.54A8,8,0,0,1,91.53,175c8.6,5.45,17.35,9,36.47,9s27.87-3.55,36.47-9a8,8,0,1,1,8.38,13.63C161.22,194.41,145.57,200,128,200Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">RescueMind Admin</h1>
            <p className="text-slate-300 text-sm">Department Management Portal</p>
          </div>

          <div className="p-8">
            <div className="flex bg-[var(--color-bg)] rounded-lg p-1 mb-6">
              <div className="flex-1 py-2 text-sm font-semibold rounded-md bg-white dark:bg-slate-700 shadow-sm text-[var(--color-ph-navy)] dark:text-white text-center">
                Admin Sign In
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm p-4 rounded-xl flex items-start gap-2 mb-4" role="alert">
                <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true">
                  <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="label">Email Address</label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@barangay.gov.ph"
                  required
                  autoComplete="email"
                  className="input text-base"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="label">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  className="input text-base"
                />
              </div>

              <button type="submit" disabled={loading || !email || !password} className="btn btn-primary w-full py-4 text-base">
                {loading ? "Signing in..." : "Sign In to Admin"}
              </button>
            </form>

            <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                <strong>Admin access only.</strong> Only users with the{" "}
                <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 font-mono text-xs">admin</code>{" "}
                role in their Supabase profile can access this portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
