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
    <svg width="48" height="48" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-80-88a12,12,0,1,1-12,12A12,12,0,0,1,128,120Z" />
    </svg>
  );
}

function IconEnvelope({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" />
    </svg>
  );
}

function IconKey({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,72a32,32,0,0,0-24.51,52.94L88,155.31l6.34,6.35a8,8,0,0,0,11.32,0L112,155.31l4.69,4.69a8,8,0,0,0,11.31,0l4.69-4.69,6.34,6.35a8,8,0,0,0,11.32,0l6.34-6.35A32,32,0,0,0,128,72Zm0,48a16,16,0,1,1,16-16A16,16,0,0,1,128,120Z" />
    </svg>
  );
}

function IconSpinner({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className={`animate-spin ${className}`} aria-hidden="true">
      <path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.26,32.75a8,8,0,0,1,11.31-11.31l22.63,22.63a8,8,0,0,1-11.32,11.32ZM232,120a8,8,0,0,1,0,16H200a8,8,0,0,1,0-16Zm-27.8,54.06a8,8,0,0,1,11.32,11.31l-22.63,22.63a8,8,0,0,1-11.31-11.31ZM128,192a8,8,0,0,1,8,8v32a8,8,0,0,1-16,0V200A8,8,0,0,1,128,192ZM77.66,175.34,55,198a8,8,0,0,1-11.31-11.32l22.63-22.63a8,8,0,0,1,11.31,11.31ZM48,128a8,8,0,0,1-8,8H8a8,8,0,0,1,0-16H40A8,8,0,0,1,48,128Zm6.06-67.34A8,8,0,0,1,65.37,49.39L88,72a8,8,0,0,1-11.31,11.32Z" />
    </svg>
  );
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

function IconWarning({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09Zm-20.17,14.43A8.17,8.17,0,0,1,215.45,208H40.55a8.17,8.17,0,0,1-7.18-5.48,7.66,7.66,0,0,1,0-7.72l87.45-151.87a8.33,8.33,0,0,1,14.36,0l87.45,151.87A7.66,7.66,0,0,1,216.63,202.52ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,28a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
    </svg>
  );
}

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
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
          "Naipadala na ang confirmation link sa iyong email. Pakitingnan ang inbox (at spam folder)."
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
        err instanceof Error ? err.message : "May error na naganap. Pakisubukan muli.";
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="card overflow-hidden p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                <IconLock />
              </div>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              RescueMind AI
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {mode === "login"
                ? "Mamahala ng mga report ng barangay"
                : "Gumawa ng account para makapagsimula"}
            </p>
          </div>

          {/* Messages */}
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
                <IconWarning className="shrink-0 mt-0.5 w-4 h-4" />
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
              className="space-y-4"
            >
              <motion.div variants={fadeUp}>
                <label
                  htmlFor="auth-email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <IconEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="captain@barangay.gov.ph"
                    required
                    autoComplete="email"
                    className="input pl-10"
                    aria-describedby={error ? "auth-error" : undefined}
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <label
                  htmlFor="auth-password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <IconKey className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                  <input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "Hindi bababa sa 6 na character" : "Ilagay ang password"}
                    required
                    minLength={6}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    className="input pl-10"
                  />
                </div>
                {mode === "signup" && (
                  <p className="helper-text mt-1">
                    Dapat hindi bababa sa 6 na character ang password
                  </p>
                )}
              </motion.div>

              <motion.div variants={fadeUp} className="pt-1">
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="btn btn-primary w-full py-2.5"
                >
                  {loading ? (
                    <>
                      <IconSpinner className="w-4 h-4" />
                      <span>
                        {mode === "login" ? "Pumapasok..." : "Gumagawa ng account..."}
                      </span>
                    </>
                  ) : mode === "login" ? (
                    <>
                      <IconArrowRight />
                      <span>Pumasok</span>
                    </>
                  ) : (
                    <>
                      <IconArrowRight />
                      <span>Gumawa ng Account</span>
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          )}

          {/* Toggle Mode */}
          {!successMsg && (
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              {mode === "login" ? (
                <span>
                  Wala pang account?{" "}
                  <button
                    onClick={toggleMode}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Gumawa ng account
                  </button>
                </span>
              ) : (
                <span>
                  May account na?{" "}
                  <button
                    onClick={toggleMode}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Pumasok
                  </button>
                </span>
              )}
            </motion.div>
          )}

          {/* Return to home (shown after signup success) */}
          {successMsg && (
            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              className="mt-6 text-center"
            >
              <button
                onClick={() => router.push("/")}
                className="btn btn-secondary text-sm"
              >
                Bumalik sa Home
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Demo info */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 alert-info text-[0.7rem] flex items-start gap-2"
        >
          <IconWarning className="shrink-0 mt-0.5 w-3 h-3" />
          <span>
            <strong>Demo:</strong> Gumawa muna ng account, pagkatapos suriin ang email (o huwag paganahin ang
            email confirmation sa Supabase Dashboard → Auth → Settings).
          </span>
        </motion.div>
      </div>
    </div>
  );
}
