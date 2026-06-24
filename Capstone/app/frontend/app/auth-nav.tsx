"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

// ────────────────────────────────────────────────────────────
// SVG Icons
// ────────────────────────────────────────────────────────────

function IconUser({ className = "" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,76a32,32,0,1,1-32,32A32,32,0,0,1,128,76Zm0,48a16,16,0,1,0-16-16A16,16,0,0,0,128,124Zm0,76c-17.57,0-33.22-5.59-44.83-14.54A8,8,0,0,1,91.53,175c8.6,5.45,17.35,9,36.47,9s27.87-3.55,36.47-9a8,8,0,1,1,8.38,13.63C161.22,194.41,145.57,200,128,200Z" />
    </svg>
  );
}

function IconSignOut({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M120,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h64a8,8,0,0,1,0,16H48V208h64A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z" />
    </svg>
  );
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function AuthNav() {
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full skeleton" />
    );
  }

  // Logged in
  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1.5 pr-3 rounded-full bg-slate-950/60 hover:bg-slate-900/80 border border-white/15 hover:border-[var(--color-ph-gold)]/50 backdrop-blur-2xl text-slate-200 hover:text-white shadow-xl shadow-black/50 transition-all group focus:outline-none"
          aria-label="Profile menu"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--color-ph-gold)] text-slate-950 flex items-center justify-center shadow-inner font-black text-xs group-hover:scale-105 transition-transform">
            {user.email ? user.email[0].toUpperCase() : "U"}
          </div>
          <svg
            width="12"
            height="12"
            viewBox="0 0 256 256"
            fill="currentColor"
            className={`w-3 h-3 text-slate-400 group-hover:text-[var(--color-ph-gold)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-64 rounded-[1.5rem] bg-slate-950/95 backdrop-blur-2xl border border-slate-800 shadow-2xl shadow-black/90 p-4 z-50 text-white space-y-4"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-[var(--color-ph-gold)] text-slate-950 font-black flex items-center justify-center text-sm shrink-0 shadow-inner">
                  {user.email ? user.email[0].toUpperCase() : "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-extrabold text-slate-100 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full py-3 px-4 rounded-xl bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 hover:border-red-500 text-red-400 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <IconSignOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Not logged in
  return (
    <Link href="/auth" className="btn btn-accent text-sm py-2 px-5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
      <span>Sign In</span>
      <IconArrowRight className="w-3.5 h-3.5" />
    </Link>
  );
}
