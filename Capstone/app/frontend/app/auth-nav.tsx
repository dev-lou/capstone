"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

// ────────────────────────────────────────────────────────────
// SVG Icons
// ────────────────────────────────────────────────────────────

function IconUser({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,76a32,32,0,1,1-32,32A32,32,0,0,1,128,76Zm0,48a16,16,0,1,0-16-16A16,16,0,0,0,128,124Zm0,76c-17.57,0-33.22-5.59-44.83-14.54A8,8,0,0,1,91.53,175c8.6,5.45,17.35,9,36.47,9s27.87-3.55,36.47-9a8,8,0,1,1,8.38,13.63C161.22,194.41,145.57,200,128,200Z" />
    </svg>
  );
}

function IconSignOut({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M120,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h64a8,8,0,0,1,0,16H48V208h64A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z" />
    </svg>
  );
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function AuthNav() {
  const { user, loading, signOut } = useAuth();

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-20 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg skeleton" />
    );
  }

  // Logged in
  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2"
      >
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--color-bg-secondary)]">
          <IconUser className="text-[var(--color-text-muted)] shrink-0" />
          <span className="text-xs text-[var(--color-text-muted)] truncate max-w-[100px]">
            {user.email}
          </span>
        </div>
        <button
          onClick={signOut}
          className="btn btn-ghost text-xs py-1.5 px-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5"
          aria-label="Sign out"
        >
          <IconSignOut />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </motion.div>
    );
  }

  // Not logged in
  return (
    <Link
      href="/auth"
      className="btn btn-primary text-xs py-1.5 px-3 gap-1.5"
    >
      <IconArrowRight />
      <span>Sign In</span>
    </Link>
  );
}
