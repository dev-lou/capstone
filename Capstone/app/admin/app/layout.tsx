import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AdminLayout } from "./components/admin-layout";

export const metadata: Metadata = {
  title: "RescueMind AI — Admin Dashboard",
  description: "Admin dashboard for RescueMind AI — Department report management and triage system",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF7" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--color-bg)]">
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
