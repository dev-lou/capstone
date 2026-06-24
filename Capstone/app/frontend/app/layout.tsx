import type { Metadata, Viewport } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./components/toast";
import { ChatWidget } from "./components/chat-widget";
import { SiteNavbar, SiteFooter } from "./navigation-shell";
import { I18nProvider } from "@/lib/i18n";

// ── Typography ──────────────────────────────────────────────────────────────

const fontOutfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: "swap" 
});

const fontSpace = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space",
  display: "swap"
});

// ── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "RescueMind AI — Barangay Disaster & Complaint Triage System",
  description:
    "AI-powered Barangay Disaster & Complaint Triage — offline-first classification for Philippine barangays. Mag-report ng insidente gamit ang AI.",
  keywords: [
    "barangay",
    "disaster",
    "complaint",
    "AI",
    "Philippines",
    "triage",
    "rescue",
    "DILG",
    "DICT",
    "e-governance",
    "rescuemind",
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
    icon: [{ url: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
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

// ── Root Layout ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fil-PH" suppressHydrationWarning className={`${fontOutfit.variable} ${fontSpace.variable}`}>
      <body className="min-h-screen flex flex-col bg-[var(--color-bg)] font-sans antialiased text-[var(--color-text)] selection:bg-[var(--color-ph-gold)]/30">
        <ThemeProvider>
          <I18nProvider>
          <AuthProvider>
            {/* Skip to main content — accessibility */}
            <a href="#main-content" className="skip-link">
              Laktawan sa pangunahing nilalaman
            </a>

            {/* ══════════════════════════════════════════════════════
                NAVBAR — Conditional Navigation Shell
            ══════════════════════════════════════════════════════ */}
            <SiteNavbar />

            {/* ══════════════════════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════════════════════ */}
            <main id="main-content" className="flex-1 flex flex-col min-h-[60vh]" role="main">
              {children}
            </main>
          </AuthProvider>

          {/* ══════════════════════════════════════════════════════
              FOOTER — Conditional Navigation Shell
          ══════════════════════════════════════════════════════ */}
          <SiteFooter />

          <Toaster />
          <ChatWidget />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
