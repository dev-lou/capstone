"use client";

import { useState, type FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";

// ────────────────────────────────────────────────────────────
// SVG Icons
// ────────────────────────────────────────────────────────────

function IconLock({ className = "" }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-80-88a12,12,0,1,1-12,12A12,12,0,0,1,128,120Z" />
    </svg>
  );
}

function IconEnvelope({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" />
    </svg>
  );
}

function IconKey({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,72a32,32,0,0,0-24.51,52.94L88,155.31l6.34,6.35a8,8,0,0,0,11.32,0L112,155.31l4.69,4.69a8,8,0,0,0,11.31,0l4.69-4.69,6.34,6.35a8,8,0,0,0,11.32,0l6.34-6.35A32,32,0,0,0,128,72Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,120Z" />
    </svg>
  );
}

function IconSpinner({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={`animate-spin ${className}`}
      aria-hidden="true"
    >
      <path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.26,32.75a8,8,0,0,1,11.31-11.31l22.63,22.63a8,8,0,0,1-11.32,11.32ZM232,120a8,8,0,0,1,0,16H200a8,8,0,0,1,0-16Zm-27.8,54.06a8,8,0,0,1,11.32,11.31l-22.63,22.63a8,8,0,0,1-11.31-11.31ZM128,192a8,8,0,0,1,8,8v32a8,8,0,0,1-16,0V200A8,8,0,0,1,128,192ZM77.66,175.34,55,198a8,8,0,0,1-11.31-11.32l22.63-22.63a8,8,0,0,1,11.31,11.31ZM48,128a8,8,0,0,1-8,8H8a8,8,0,0,1,0-16H40A8,8,0,0,1,48,128Zm6.06-67.34A8,8,0,0,1,65.37,49.39L88,72a8,8,0,0,1-11.31,11.32Z" />
    </svg>
  );
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

function IconWarning({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Zm-20.17,14.43A8.17,8.17,0,0,1,215.45,208H40.55a8.17,8.17,0,0,1-7.18-5.48,7.66,7.66,0,0,1,0-7.72l87.45-151.87a8.33,8.33,0,0,1,14.36,0l87.45,151.87A7.66,7.66,0,0,1,216.63,202.52ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,28a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
    </svg>
  );
}

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Motion Variants
// ────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        setSuccessMsg(
          "Naipadala na ang confirmation link sa iyong email. Pakitingnan ang inbox (at spam folder).",
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "May error na naganap. Pakisubukan muli.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
    setSuccessMsg(null);
  }, []);

  return (
    <div className="min-h-[85vh] bg-[var(--color-bg)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ── Auth Card ─────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="card-ph overflow-hidden"
        >
          {/* Card Header — navy top section */}
          <div className="bg-[var(--color-ph-navy)] px-8 py-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <IconLock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              RescueMind AI
            </h1>
            <p className="text-slate-300 text-sm">
              {mode === "login"
                ? "Barangay Management Portal"
                : "Gumawa ng Bagong Account"}
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Mode Indicator Tabs */}
            <div
              className="flex bg-[var(--color-bg)] rounded-lg p-1 mb-6"
              role="tablist"
              aria-label="Authentication mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                onClick={() => mode !== "login" && toggleMode()}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  mode === "login"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-[var(--color-ph-navy)] dark:text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                onClick={() => mode !== "signup" && toggleMode()}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  mode === "signup"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-[var(--color-ph-navy)] dark:text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error / Success Alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key={`error-${error}`}
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="alert-error flex items-start gap-2 mb-4"
                  role="alert"
                >
                  <IconWarning className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  key={`success-${successMsg}`}
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="alert-success flex items-start gap-2 mb-4"
                  role="status"
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 rounded-full bg-green-200 dark:bg-green-800">
                    <IconCheck className="w-3 h-3 text-green-800 dark:text-green-200" />
                  </div>
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            {!successMsg && (
              <motion.form
                variants={stagger}
                initial="initial"
                animate="animate"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Email */}
                <motion.div variants={fadeUp}>
                  <label htmlFor="auth-email" className="label">
                    Email Address
                  </label>
                  <div className="relative">
                    <IconEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5 pointer-events-none" />
                    <input
                      id="auth-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="captain@barangay.gov.ph"
                      required
                      autoComplete="email"
                      aria-describedby={error ? "auth-error" : undefined}
                      className="input pl-11 text-base"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeUp}>
                  <label htmlFor="auth-password" className="label">
                    Password
                  </label>
                  <div className="relative">
                    <IconKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5 pointer-events-none" />
                    <input
                      id="auth-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        mode === "signup"
                          ? "Minimum 6 characters"
                          : "Enter your password"
                      }
                      required
                      minLength={6}
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                      className="input pl-11 text-base"
                    />
                  </div>
                  {mode === "signup" && (
                    <p className="helper-text mt-1">
                      Password must be at least 6 characters
                    </p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={fadeUp} className="pt-1">
                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="btn btn-primary w-full py-4 text-base"
                  >
                    {loading ? (
                      <>
                        <IconSpinner className="w-5 h-5" />
                        <span>
                          {mode === "login"
                            ? "Signing in..."
                            : "Creating account..."}
                        </span>
                      </>
                    ) : mode === "login" ? (
                      <>
                        <IconArrowRight />
                        <span>Sign In</span>
                      </>
                    ) : (
                      <>
                        <IconArrowRight />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.form>
            )}

            {/* Post-signup: back to home */}
            {successMsg && (
              <motion.div
                variants={fadeUp}
                initial="initial"
                animate="animate"
                className="mt-4"
              >
                <button
                  onClick={() => router.push("/")}
                  className="btn btn-secondary w-full"
                >
                  Back to Home
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── Demo Info Box ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 alert-info flex items-start gap-2"
        >
          <IconWarning className="shrink-0 w-4 h-4 mt-0.5" />
          <span className="text-sm">
            <strong>Demo:</strong> Create an account first, then check your
            email (or disable email confirmation in Supabase Dashboard &rarr;
            Auth &rarr; Settings).
          </span>
        </motion.div>
      </div>
    </div>
  );
}
