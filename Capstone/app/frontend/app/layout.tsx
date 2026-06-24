import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./components/toast";
import { SiteNavbar, SiteFooter } from "./navigation-shell";

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
    <html lang="fil-PH" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--color-bg)]">
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
