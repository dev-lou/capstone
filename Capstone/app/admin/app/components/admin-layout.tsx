"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { DEPARTMENTS, type Department } from "@/lib/departments";

// ── Icons (inline SVGs to avoid dependency) ───────────────

function IconChartBar({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V200H224A8,8,0,0,1,232,208ZM72,168a8,8,0,0,0,16,0V120a8,8,0,0,0-16,0Zm48,0a8,8,0,0,0,16,0V72a8,8,0,0,0-16,0Zm48,0a8,8,0,0,0,16,0V96a8,8,0,0,0-16,0Z" />
    </svg>
  );
}

function IconBuilding({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M248,208H224V40a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8V208H8a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16ZM56,80V64h32V80Zm48,0V64h32V80Zm0,48V112h32v16ZM56,128V112h32v16Zm96-48V64h32V80Zm32,16v16H152V112ZM72,208V176h40v32Zm72,0V176h40v32Z" />
    </svg>
  );
}

function IconSun({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z" />
    </svg>
  );
}

function IconMoon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.78-109.78,8,8,0,0,0-10-10,104.84,104.84,0,0,0-36.86,173.68A104.84,104.84,0,0,0,173.68,220.56a8,8,0,0,0,10-10,88.08,88.08,0,0,1,109.78-109.78A8,8,0,0,0,233.54,142.23ZM190.73,202.7A88.89,88.89,0,0,1,53.3,65.27,89.06,89.06,0,0,1,98.9,39.44,104.14,104.14,0,0,0,216.56,157.1,89.06,89.06,0,0,1,190.73,202.7Z" />
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

// ── Department icon colors ───────────────────────────────

const DEPT_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  red: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  blue: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-400", dot: "bg-yellow-500" },
  green: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  teal: { bg: "bg-teal-50 dark:bg-teal-950/30", text: "text-teal-700 dark:text-teal-400", dot: "bg-teal-500" },
  slate: { bg: "bg-slate-50 dark:bg-slate-800/30", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-400" },
};

// ── Component ────────────────────────────────────────────

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme
    const stored = localStorage.getItem("rescuemind_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored === "dark" || (!stored && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);

    // Load user
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email ?? null);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("rescuemind_theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [router]);

  const isLoginPage = pathname === "/";

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isDeptActive = (slug: string) => pathname === `/departments/${slug}`;

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col md:flex-row">
      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className={`shrink-0 bg-[var(--color-bg)] border-r border-[var(--color-border)] flex flex-col justify-between transition-all duration-300 ${sidebarCollapsed ? "w-20 p-4 items-center" : "w-72 p-6"} hidden md:flex`}>
        <div className={`space-y-8 w-full ${sidebarCollapsed ? "flex flex-col items-center" : ""}`}>
          
          {/* Logo */}
          <Link href="/dashboard" className={`flex items-center gap-3.5 pt-2 ${sidebarCollapsed ? "justify-center" : "px-2"}`}>
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-ph-navy)] dark:bg-[var(--color-ph-gold)] text-white dark:text-slate-900 flex items-center justify-center font-black text-base shadow-md shrink-0 border border-white/10">
              RM
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-[var(--color-ph-navy)] dark:text-white leading-none">RescueMind</span>
                <span className="text-xs font-bold text-[var(--color-ph-gold)] uppercase tracking-wider mt-1.5">Admin Portal</span>
              </div>
            )}
          </Link>

          {/* NAVIGATION SECTION */}
          <div className="w-full">
            {!sidebarCollapsed && <div className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3">Navigation</div>}
            <div className={`space-y-1.5 w-full ${sidebarCollapsed ? "flex flex-col items-center" : ""}`}>
              <Link href="/dashboard"
                className={sidebarCollapsed
                  ? `w-12 h-12 flex items-center justify-center rounded-2xl ${isActive("/dashboard") && !isDeptActive("") ? "bg-white dark:bg-slate-900 text-[var(--color-ph-navy)] dark:text-white font-bold shadow-md border border-slate-200/80 dark:border-slate-800/80" : "text-slate-600 dark:text-slate-400"} mx-auto transition-all`
                  : `flex items-center gap-3.5 px-4 py-3.5 rounded-2xl ${isActive("/dashboard") && !pathname.startsWith("/departments") && !pathname.startsWith("/reports") ? "bg-white dark:bg-slate-900 text-[var(--color-ph-navy)] dark:text-white font-bold shadow-md border border-slate-200/80 dark:border-slate-800/80" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60"} font-bold text-sm transition-all`}
                title={sidebarCollapsed ? "Dashboard" : undefined}
              >
                <IconChartBar className={`w-5 h-5 shrink-0 ${isActive("/dashboard") && !pathname.startsWith("/departments") ? "text-[var(--color-ph-gold)]" : "text-slate-400"}`} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </Link>
            </div>
          </div>

          {/* DEPARTMENTS SECTION */}
          <div className="w-full">
            {!sidebarCollapsed && <div className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3 flex items-center gap-2">
              <IconBuilding className="w-3.5 h-3.5" />
              <span>Departments</span>
            </div>}
            <div className={`space-y-0.5 w-full ${sidebarCollapsed ? "flex flex-col items-center" : ""}`}>
              {DEPARTMENTS.map((dept) => {
                const active = isDeptActive(dept.slug);
                const colors = DEPT_COLORS[dept.color] ?? DEPT_COLORS.slate;
                return (
                  <Link
                    key={dept.slug}
                    href={`/departments/${dept.slug}`}
                    className={sidebarCollapsed
                      ? `w-12 h-12 flex items-center justify-center rounded-2xl ${active ? "bg-white dark:bg-slate-900 shadow-md border border-slate-200/80 dark:border-slate-800/80" : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60"} mx-auto transition-all`
                      : `w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl ${active ? `${colors.bg} ${colors.text} font-bold shadow-sm border border-slate-200 dark:border-slate-800` : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60"} text-sm font-semibold transition-all`}
                    title={sidebarCollapsed ? dept.acronym : undefined}
                  >
                    <span className={`w-7 h-7 rounded-xl ${active ? colors.bg : "bg-slate-100 dark:bg-slate-800"} flex items-center justify-center shrink-0 text-sm`}
                      dangerouslySetInnerHTML={{ __html: dept.icon }} />
                    {!sidebarCollapsed && (
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="truncate">{dept.shortName}</span>
                        {active && <span className={`w-2 h-2 rounded-full ${colors.dot} shrink-0`} />}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`space-y-4 w-full ${sidebarCollapsed ? "flex flex-col items-center" : "px-1"}`}>
          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={sidebarCollapsed
              ? "w-12 h-12 flex items-center justify-center rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 mx-auto transition-all"
              : "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 font-bold text-sm transition-all"}
            title={sidebarCollapsed ? "Expand Sidebar" : undefined}
          >
            <IconArrowRight className={`w-5 h-5 shrink-0 transition-transform duration-300 ${sidebarCollapsed ? "" : "rotate-180"}`} />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={sidebarCollapsed
              ? "w-12 h-12 flex items-center justify-center rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 mx-auto transition-all"
              : "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 font-bold text-sm transition-all"}
            title={sidebarCollapsed ? "Toggle Theme" : undefined}
          >
            {isDark ? <IconSun className="w-5 h-5 text-amber-500 shrink-0" /> : <IconMoon className="w-5 h-5 text-indigo-500 shrink-0" />}
            {!sidebarCollapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className={sidebarCollapsed
              ? "w-12 h-12 flex items-center justify-center rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 mx-auto transition-all"
              : "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold text-sm transition-all"}
            title={sidebarCollapsed ? "Sign Out" : undefined}
          >
            <IconSignOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>

          {/* Profile Lockup */}
          {sidebarCollapsed ? (
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-ph-navy)] text-[var(--color-ph-gold)] flex items-center justify-center font-black text-base mx-auto border border-white/10 shadow-md" title="Admin">
              A
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[var(--color-ph-navy)] text-[var(--color-ph-gold)] flex items-center justify-center font-black text-base shrink-0 border border-white/10 shadow-sm">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-sm text-slate-800 dark:text-slate-200 truncate">Admin</div>
                  <div className="text-xs text-slate-400 font-medium truncate max-w-[130px]">{userEmail ?? "Admin User"}</div>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0 mr-1" />
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="flex-1 p-3 sm:p-4 md:pl-0 min-w-0 flex flex-col h-screen overflow-hidden">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800/80 flex-1 flex flex-col p-6 sm:p-10 pb-24 md:pb-10 overflow-y-auto">
          {children}
        </div>
      </main>
      {/* ── Mobile Bottom Navigation (md:hidden) ──────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl shadow-black/20 dark:shadow-black/60 safe-bottom">
        <div className="flex items-center justify-around py-1.5 px-2 max-w-lg mx-auto">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[var(--color-ph-navy)] dark:text-[var(--color-ph-gold)] font-bold"
            aria-label="Dashboard"
          >
            <IconChartBar className="w-5 h-5" />
            <span className="text-[0.55rem] font-bold uppercase tracking-wider">Dashboard</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <IconSun className="w-5 h-5 text-amber-500" /> : <IconMoon className="w-5 h-5 text-indigo-500" />}
            <span className="text-[0.55rem] font-bold uppercase tracking-wider">Theme</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            aria-label="Sign Out"
          >
            <IconSignOut className="w-5 h-5" />
            <span className="text-[0.55rem] font-bold uppercase tracking-wider">Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
