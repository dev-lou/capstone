import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AuthNav } from "./auth-nav";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./components/toast";
import { IconSun, IconMoon } from "./components/icons";
import { NavLink } from "./components/nav-link";

export const metadata: Metadata = {
  title: "RescueMind AI — Barangay Disaster & Complaint Triage System",
  description:
    "AI-powered Barangay Disaster & Complaint Triage — offline-first classification for Philippine barangays. Mag-report ng insidente gamit ang AI.",
  keywords: [
    "barangay", "disaster", "complaint", "AI", "Philippines", "triage",
    "rescue", "DILG", "DICT", "e-governance", "rescuemind",
  ],
  authors: [{ name: "RescueMind AI Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "RescueMind AI — Barangay Triage System",
    description:
      "AI-powered Barangay Disaster & Complaint Triage — offline-first classification for Philippine barangays.",
    type: "website",
    locale: "fil_PH",
    siteName: "RescueMind AI",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF7" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fil-PH" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <a href="#main-content" className="skip-link">
              Laktawan sa pangunahing nilalaman
            </a>

            {/* ══ Philippine Navbar ═══════════════════════ */}
            <nav
              className="sticky top-0 z-50 bg-[var(--color-surface-soft,#FDFBF7)]/90 dark:bg-[var(--color-surface,#1E1B17)]/90 backdrop-blur-xl border-b border-[var(--color-border)]"
              role="navigation"
              aria-label="Main navigation"
            >
              <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
                {/* Left: Brand wordmark + nav links */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-2 py-1.5 -ml-2 mr-1"
                    aria-label="RescueMind AI Home"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[var(--color-ph-navy)] dark:bg-[var(--color-accent)] text-white dark:text-[var(--color-ph-navy)] flex items-center justify-center text-xs font-bold shrink-0">
                      RM
                    </span>
                    <span className="hidden sm:inline text-sm font-semibold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)] tracking-tight">
                      RescueMind
                    </span>
                  </Link>

                  <NavLink href="/" label="Home" />
                  <NavLink href="/report" label="Mag-Report" />
                  <NavLink href="/dashboard" label="Dashboard" />
                </div>

                {/* Right: Theme toggle + Auth */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <ThemeToggle />
                  <AuthNav />
                </div>
              </div>
            </nav>

            {/* ══ Main Content ════════════════════════════ */}
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
          </AuthProvider>

          {/* ══ Philippine Footer ═════════════════════════ */}
          <footer
            className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
            role="contentinfo"
          >
            <div className="flag-bar" />

            <div className="max-w-6xl mx-auto px-4 py-10">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-[var(--color-ph-navy)] dark:bg-[var(--color-accent)] text-white dark:text-[var(--color-ph-navy)] flex items-center justify-center text-xs font-bold">
                      RM
                    </span>
                    <span className="text-sm font-semibold text-[var(--color-ph-navy)] dark:text-[var(--color-primary)]">
                      RescueMind AI
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-sm">
                    AI-powered Barangay Disaster & Complaint Triage System.
                    Offline-first classification para sa mabilis at tamang
                    pag-ruta ng mga report sa tamang ahensya ng gobyerno.
                  </p>
                  <p className="text-[0.65rem] text-[var(--color-text-muted)] mt-3 opacity-60">
                    Capstone Project 2026
                  </p>
                </div>
                <div>
                  <h3 className="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                    Serbisyo
                  </h3>
                  <ul className="space-y-2">
                    <li><FooterLink href="/report" label="Mag-Report" /></li>
                    <li><FooterLink href="/dashboard" label="Dashboard" /></li>
                    <li><FooterLink href="/auth" label="Sign In" /></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[0.65rem] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
                    Legal
                  </h3>
                  <ul className="space-y-2">
                    <li><FooterLink href="/privacy" label="Privacy Policy" /></li>
                    <li><FooterLink href="/terms" label="Terms of Service" /></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center">
                <p className="text-[0.6rem] text-[var(--color-text-muted)] opacity-60">
                  AI-assisted classification lamang. Ang final action at routing
                  ay responsibilidad ng barangay.
                </p>
                <p className="text-[0.55rem] text-[var(--color-text-muted)] opacity-40 mt-1">
                  © {new Date().getFullYear()} RescueMind AI
                </p>
              </div>
            </div>
          </footer>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

// ── FooterLink Component ───────────────────────────────
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-ph-navy)] dark:hover:text-[var(--color-accent)] transition-colors"
    >
      {label}
    </Link>
  );
}

// ── Theme Toggle using shared icons ─────────────────────
function ThemeToggle() {
  return (
    <button
      id="theme-toggle"
      className="inline-flex items-center justify-center w-8 h-8 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-muted)] rounded-lg transition-all"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <IconSun className="hidden dark:block w-4 h-4" />
      <IconMoon className="block dark:hidden w-4 h-4" />
    </button>
  );
}
