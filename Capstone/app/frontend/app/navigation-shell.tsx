"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthNav } from "./auth-nav";
import { IconSun, IconMoon } from "./components/icons";
import { NavLink } from "./components/nav-link";

export function SiteNavbar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/report")) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 max-w-7xl mx-auto w-full pointer-events-none">
      <nav
        className="pointer-events-auto bg-[#0a1915]/60 dark:bg-[#06120e]/60 backdrop-blur-2xl border border-white/15 rounded-full shadow-2xl shadow-black/50 px-6 sm:px-8 flex items-center justify-between h-16 transition-all duration-300 relative"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Left: Shield wordmark + nav links */}
        <div className="flex items-center gap-2 sm:gap-6 mt-0.5">
          {/* Brand wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 mr-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ph-gold)]"
            aria-label="RescueMind AI — Bumalik sa home"
          >
            {/* Shield badge */}
            <span
              className="w-10 h-10 rounded-full bg-[var(--color-ph-navy)] text-[var(--color-ph-gold)] flex items-center justify-center text-xs font-black tracking-tight shrink-0 shadow-sm border border-white/10"
              aria-hidden="true"
            >
              RM
            </span>

            {/* Text lockup */}
            <span className="flex flex-col -space-y-0.5">
              <span className="text-sm font-extrabold text-white tracking-tight leading-tight">
                RescueMind
              </span>
              {/* Subtitle: sm+ only */}
              <span className="hidden sm:block text-[0.65rem] text-[var(--color-ph-gold)] font-bold uppercase tracking-wider leading-tight">
                AI Triage System
              </span>
            </span>
          </Link>

          {/* Primary nav links */}
          <NavLink href="/" label="Home" />
          <NavLink href="/report" label="Mag-Report" />
          <NavLink href="/dashboard" label="Dashboard" />
        </div>

        {/* Right: Theme toggle + Auth */}
        <div className="flex items-center gap-3 mt-0.5">
          <ThemeToggle />
          <AuthNav />
        </div>
      </nav>
    </div>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/report")) return null;

  return (
    <footer className="bg-[var(--color-ph-navy)] text-white relative overflow-hidden" role="contentinfo">
      {/* Philippine flag tricolor bar: blue | red | gold */}
      <div className="ph-flag-bar" />

      {/* Subtle background mesh illustration hint */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#c8911e_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-12">
          {/* ── Brand column (5/12 width) ──────────────── */}
          <div className="sm:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ph-gold)] rounded-full"
              aria-label="RescueMind AI Home"
            >
              <span
                className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-sm font-black tracking-tight group-hover:bg-[var(--color-ph-gold)] group-hover:text-[var(--color-ph-navy)] transition-all shadow-md"
                aria-hidden="true"
              >
                RM
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                RescueMind AI
              </span>
            </Link>

            <p className="text-base text-slate-300 leading-relaxed max-w-md">
              AI-powered Barangay Disaster &amp; Complaint Triage System.
              Offline-first na pag-uuri ng mga ulat para sa mabilis at
              tamang pag-ruta sa tamang ahensya ng gobyerno.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[var(--color-ph-gold-light)] text-xs font-bold tracking-wider uppercase border border-white/15">
                🇵🇭 E-Governance Standard
              </span>
              <span className="text-xs text-slate-400 tracking-wide">
                Capstone Project &middot; 2026
              </span>
            </div>
          </div>

          {/* ── Serbisyo column (3/12 width) ───────────────────────── */}
          <div className="sm:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ph-gold)] mb-6">
              Serbisyo / Services
            </h3>
            <ul className="space-y-3.5">
              <li>
                <FooterLink href="/report" label="Mag-Report ng Insidente" />
              </li>
              <li>
                <FooterLink href="/dashboard" label="Barangay Dashboard" />
              </li>
              <li>
                <FooterLink href="/auth" label="Sign In (Officials)" />
              </li>
            </ul>
          </div>

          {/* ── Legal + Impormasyon column (4/12 width) ────────────── */}
          <div className="sm:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ph-gold)] mb-6">
              Legal &amp; Panuntunan
            </h3>
            <ul className="space-y-3.5">
              <li>
                <FooterLink href="/privacy" label="Privacy Policy" />
              </li>
              <li>
                <FooterLink href="/terms" label="Terms of Service" />
              </li>
            </ul>

            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ph-gold)] mt-8 mb-6">
              Impormasyon ng Pamahalaan
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="https://www.dilg.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[var(--color-ph-gold)] transition-colors text-base font-medium inline-flex items-center gap-1.5"
                >
                  <span>DILG Philippines</span>
                  <span className="text-xs opacity-50">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://dict.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-[var(--color-ph-gold)] transition-colors text-base font-medium inline-flex items-center gap-1.5"
                >
                  <span>DICT Philippines</span>
                  <span className="text-xs opacity-50">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar: disclaimer + copyright ──────── */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Ang RescueMind AI ay gumagamit ng AI-assisted classification
            lamang. Ang final action at routing ay responsibilidad ng
            barangay.{" "}
            <span className="text-slate-500 block mt-1">
              AI-assisted classification only. Final action and routing
              remains the responsibility of the barangay.
            </span>
          </p>
          <p className="text-xs text-slate-500 shrink-0 whitespace-nowrap font-medium">
            &copy; 2026 RescueMind AI &mdash; All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-slate-300 hover:text-[var(--color-ph-gold)] transition-colors text-base font-medium"
    >
      {label}
    </Link>
  );
}

export function ThemeToggle() {
  return (
    <button
      id="theme-toggle"
      className="w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-alt)] transition-all flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)] shadow-xs"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <IconSun className="hidden dark:block w-4 h-4" />
      <IconMoon className="block dark:hidden w-4 h-4" />
    </button>
  );
}
