"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

function IconShield({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className}>
      <path d="M208,40H48A16,16,0,0,0,32,56V124c0,51.89,35.54,94.62,88.27,106.19a39.69,39.69,0,0,0,15.46,0C188.46,218.62,224,175.89,224,124V56A16,16,0,0,0,208,40ZM128,214.33c-43.27-10.45-80-45.71-80-90.33V56H208v68C208,168.62,171.27,203.88,128,214.33Z" />
    </svg>
  );
}

function IconGlobe({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-144a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0ZM80,112a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96v16a8,8,0,0,1-16,0V112Zm96,60.79V192a8,8,0,0,1-16,0v-8.39A70.59,70.59,0,0,1,128,200a71.07,71.07,0,0,1-21.92-3.46,8,8,0,1,1,5.49-15,55.2,55.2,0,0,0,32.86,0,8,8,0,1,1,5.49,15A71.07,71.07,0,0,1,128,200a70.59,70.59,0,0,1-32-8.39V192a8,8,0,0,1-16,0v-19.21C64.36,156.66,56,139.06,56,120a72,72,0,1,1,144,0C200,139.06,191.64,156.66,176,172.79ZM128,64a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,64Z" />
    </svg>
  );
}

function IconQuote({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className}>
      <path d="M112,120a40,40,0,1,1-40-40,8,8,0,0,0,8-8V40a8,8,0,0,0-8-8C36.8,32,8,64.44,8,120V176a40,40,0,0,0,40,40h24a40,40,0,0,0,40-40V120Zm136,0a40,40,0,1,1-40-40,8,8,0,0,0,8-8V40a8,8,0,0,0-8-8c-35.2,0-64,32.44-64,88v56a40,40,0,0,0,40,40h24a40,40,0,0,0,40-40V120Z" />
    </svg>
  );
}

function IconEye({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className}>
      <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.48c.35.79,8.82,19.58,27.65,38.41C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.35c18.83-18.83,27.3-37.62,27.65-38.41A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" />
    </svg>
  );
}

function IconEyeSlash({ className = "" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 256 256" fill="currentColor" className={className}>
      <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38l28.69,32.35C45.33,96.39,26.43,115.34,11.83,124.1a8,8,0,0,0,0,13.8c14.6,8.76,33.5,27.71,58.94,46.37l25.66,28.94a8,8,0,1,0,11.93-10.58Zm28.61,48.33L101,103.8a47.88,47.88,0,0,0-17.2,17.2L64.55,99.3A125.75,125.75,0,0,1,82.53,83ZM128,192c-30.68,0-58-13.89-80.46-32.9l20.4-17a48,48,0,0,0,59.39-49.5l25.54-21.28A123.63,123.63,0,0,1,192,92c22.48,19,22.48,19,36.57,36-14.09,17-14.09,17-36.57,36C169.58,183.1,142.27,192,128,192ZM244.17,124.1c-14.6-8.76-33.5-27.71-58.94-46.37l-15.5-13A8,8,0,1,0,159.4,77L171.6,87.16A48,48,0,0,0,103.22,144.1L82.17,161.64c-3.1-2.6-6-5.4-8.8-8.2l12.18-10.15A48,48,0,0,0,133.8,95a8,8,0,1,0-10.56-11.92,32,32,0,0,1,32.48,32.48,8,8,0,1,0,11.92,10.56A48.06,48.06,0,0,0,154.55,101l13.78,11.48c18.52,15.44,43.23,39.69,57.17,55.51a8,8,0,0,0,6.08,2.83,8.08,8.08,0,0,0,4.09-1.12A8,8,0,0,0,244.17,124.1Z" />
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
  const [showPassword, setShowPassword] = useState(false);
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

      // Check if user has admin role — admins must use the standalone admin portal
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          await supabase.auth.signOut();
          setError("Admin access is restricted to the Admin Portal only. Please use the admin dashboard at the admin URL.");
          setLoading(false);
          return;
        }
      }

      router.push("/dashboard");
      router.refresh();
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

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col lg:flex-row transition-all duration-500 ease-in-out">
      
      {/* ── HALF 1: TRUST & HERO BACKGROUND (w-1/2) ─────────────────────────────────────── */}
      <div className="lg:w-1/2 relative min-h-[380px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-16 overflow-hidden bg-slate-950 text-white">
        {/* Absolute Background Image with Smooth Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105 transform bg-[url('/command_center_hero.png')]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 backdrop-blur-[2px]" />
        </div>

        {/* Top Header inside Trust Panel */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-ph-gold)] flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-[var(--color-ph-gold)]/30">
              RM
            </div>
            <span className="font-bold text-lg tracking-tight text-white">RescueMind AI</span>
          </div>
          <Link href="/" className="text-xs font-bold text-slate-300 hover:text-[var(--color-ph-gold)] flex items-center gap-1.5 transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            &larr; Back to Portal
          </Link>
        </div>

        {/* Center Content: Premium Headlines & Trust Badges */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-ph-gold)]/15 border border-[var(--color-ph-gold)]/40 text-[var(--color-ph-gold)] text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ph-gold)] animate-pulse" />
            Civic Intelligence Portal
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] mb-6">
            <>Empowering Local Government Units with <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--color-ph-gold-light)] to-[var(--color-ph-gold)]">Civic Intelligence.</span></>
          </h1>

          <p className="text-slate-300 text-base lg:text-lg leading-relaxed mb-8">
            Access the unified central dashboard for real-time dispatch, AI-powered citizen intake, and multi-agency coordination across the Philippines.
          </p>

          {/* Compliance & Standard Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[var(--color-ph-gold)]">
                <IconShield className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-none">DILG</span>
                <span className="text-[0.6rem] text-slate-400 mt-0.5">Routing Standard</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-blue-400">
                <IconGlobe className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-none">DICT</span>
                <span className="text-[0.6rem] text-slate-400 mt-0.5">E-Gov Framework</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-emerald-400">
                <IconCheck className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-none">RA 10173</span>
                <span className="text-[0.6rem] text-slate-400 mt-0.5">Data Privacy Act</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quote Card */}
        <div className="relative z-10 w-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-2xl hidden sm:block">
          <IconQuote className="w-8 h-8 text-[var(--color-ph-gold)] mb-3 opacity-80" />
          <p className="text-sm font-medium text-slate-200 italic mb-4 leading-relaxed">
            &ldquo;RescueMind transformed our barangay dispatch during the super typhoons. The AI triage correctly categorized priority cases instantly, saving countless lives.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-[var(--color-ph-gold)]">
              PB
            </div>
            <div>
              <div className="text-xs font-bold text-white">Punong Barangay Santos</div>
              <div className="text-[0.65rem] text-slate-400">NCR Disaster Response Taskforce</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── HALF 2: AUTH FORM (w-1/2) ─────────────────────────────────────── */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[var(--color-bg)] transition-all duration-500">
        <div className="w-full max-w-md">
          
          {/* Main Form Box */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[2rem] shadow-2xl shadow-slate-900/10 dark:shadow-black/50 p-8 sm:p-10 relative overflow-hidden"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-ph-navy)] via-[var(--color-ph-gold)] to-[var(--color-ph-red)]" />

            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text-strong)] tracking-tight mb-2">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
                Enter your credentials to access the central triage dashboard
              </p>
            </div>

            <div className="mb-8 text-center">
              <p className="text-xs text-[var(--color-text-muted)]">
                For barangay officials and LGU personnel. Citizens can submit reports without an account.
              </p>
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
                  className="alert-error flex items-start gap-3 mb-6 p-4 rounded-xl border"
                  role="alert"
                >
                  <IconWarning className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form
                variants={stagger}
                initial="initial"
                animate="animate"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Email */}
                <motion.div variants={fadeUp}>
                  <label htmlFor="auth-email" className="label text-xs sm:text-sm font-bold text-[var(--color-text-strong)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <IconEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5 pointer-events-none" />
                    <input
                      id="auth-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="captain@barangay.gov.ph"
                      required
                      autoComplete="email"
                      aria-describedby={error ? "auth-error" : undefined}
                      className="input pl-12 py-3.5 text-sm sm:text-base rounded-xl bg-[var(--color-bg)] focus:bg-[var(--color-surface)]"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeUp}>
                  <label htmlFor="auth-password" className="label text-xs sm:text-sm font-bold text-[var(--color-text-strong)] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <IconKey className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5 pointer-events-none" />
                    <input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      minLength={6}
                      autoComplete="current-password"
                      className="input pl-12 pr-12 py-3.5 text-sm sm:text-base rounded-xl bg-[var(--color-bg)] focus:bg-[var(--color-surface)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <IconEyeSlash className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                    </button>
                  </div>

                </motion.div>

                {/* Submit Button */}
                <motion.div variants={fadeUp} className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full py-4 px-6 rounded-xl bg-[var(--color-ph-navy)] hover:bg-[var(--color-ph-navy-light)] text-white font-bold text-sm sm:text-base shadow-xl shadow-[var(--color-ph-navy)]/20 hover:shadow-[var(--color-ph-navy)]/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <IconSpinner className="w-5 h-5" />
                        <span>Authenticating credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Portal</span>
                        <IconArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
