"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthNav } from "./auth-nav";
import { IconSun, IconMoon } from "./components/icons";
import { NavLink } from "./components/nav-link";
import { LanguageSelector } from "./components/language-selector";
import { useTheme } from "./theme-provider";
import { useI18n } from "@/lib/i18n";

export function SiteNavbar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/report") || pathname?.startsWith("/auth")) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 mx-auto w-full pointer-events-none transition-all duration-500 ease-in-out ${scrolled ? 'py-4 max-w-6xl' : 'max-w-7xl py-0'}`}>
      <nav
        className={`pointer-events-auto flex items-center justify-between w-full relative transition-all duration-500 ease-in-out ${
          scrolled 
            ? "bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/50 py-3 px-6 rounded-[2rem]" 
            : "bg-transparent py-6 px-4 sm:px-8 rounded-none border-transparent shadow-none"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Left: Shield wordmark + nav links */}
        <div className="flex items-center gap-4 sm:gap-8 mt-0.5">
          {/* Brand wordmark */}
          <Link
            href="/"
            className="flex items-center gap-3 mr-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ph-gold)]"
            aria-label="RescueMind AI — Bumalik sa home"
          >
            {/* Real generated logo */}
            <img
              src="/rescuemind_logo.png"
              alt="RescueMind Logo"
              className="w-10 h-10 rounded-full object-cover border border-[var(--color-ph-gold)]/40 shadow-md shadow-black/50 shrink-0 group-hover:border-[var(--color-ph-gold)] transition-all"
            />

            {/* Text lockup */}
            <span className="flex flex-col -space-y-0.5">
              <span className={`text-base font-black tracking-tight leading-tight group-hover:text-[var(--color-ph-gold)] transition-colors ${scrolled ? "text-slate-900 dark:text-white" : "text-white"}`}>
                RescueMind
              </span>
              {/* Subtitle: sm+ only */}
              <span className="hidden sm:block text-[0.65rem] text-[var(--color-ph-gold)] font-extrabold uppercase tracking-wider leading-tight">
                AI Triage System
              </span>
            </span>
          </Link>

          {/* Primary nav links */}
          <div className="flex items-center gap-1 sm:gap-4">
            <NavLink href="/" label={t("nav.home")} scrolled={scrolled} />
            <NavLink href="/report" label={t("nav.report")} scrolled={scrolled} />
            <NavLink href="/dashboard" label={t("nav.dashboard")} scrolled={scrolled} />
          </div>
        </div>

        {/* Right: Language, Theme toggle + Auth */}
        <div className="flex items-center gap-2 mt-0.5">
          <LanguageSelector />
          <ThemeToggle />
          <AuthNav />
        </div>
      </nav>
    </div>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/report") || pathname?.startsWith("/auth")) return null;

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
              <img
                src="/rescuemind_logo.png"
                alt="RescueMind Logo"
                className="w-11 h-11 rounded-full object-cover border border-white/20 shadow-md shrink-0 group-hover:border-[var(--color-ph-gold)] transition-all"
              />
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
                <FooterLink href="/report" label={t("form.title")} />
              </li>
              <li>
                <FooterLink href="/dashboard" label={`${t("landing.barangay")} ${t("nav.dashboard")}`} />
              </li>
              <li>
                <FooterLink href="/auth" label={`${t("auth.signIn")} (Officials)`} />
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
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-950/60 hover:bg-slate-900/80 border border-white/15 hover:border-[var(--color-ph-gold)]/50 backdrop-blur-2xl text-slate-200 hover:text-white shadow-xl shadow-black/50 transition-all group focus:outline-none"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      {/* Real physical toggle switch track */}
      <div className="relative w-11 h-6 rounded-full bg-slate-800 border border-slate-700 p-1 flex items-center transition-colors duration-300 group-hover:border-[var(--color-ph-gold)]/50">
        <div
          className={`w-4 h-4 rounded-full bg-[var(--color-ph-gold)] text-slate-950 flex items-center justify-center shadow-md transition-transform duration-300 transform ${
            theme === "dark" ? "translate-x-5" : "translate-x-0"
          }`}
        >
          {theme === "dark" ? (
            <IconMoon className="w-2.5 h-2.5 font-bold" />
          ) : (
            <IconSun className="w-2.5 h-2.5 font-bold" />
          )}
        </div>
      </div>

      {/* Label */}
      <span className="text-xs font-bold tracking-wide hidden sm:block">
        {theme === "dark" ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
}
