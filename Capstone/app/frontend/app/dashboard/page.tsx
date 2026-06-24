"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  getReports,
  type SavedReport,
} from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import {
  IconChartBar,
  IconCircle,
  IconSearch,
  IconPlus,
  IconBuilding,
  IconClock,
  IconArrowRight,
} from "../components/icons";
import { ThemeToggle } from "../navigation-shell";

// ────────────────────────────────────────────────────────────
// Urgency Config
// ────────────────────────────────────────────────────────────

const URGENCY_META: Record<
  string,
  { bg: string; text: string; dot: string; border: string; bar: string }
> = {
  high: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    dot: "text-red-500",
    border: "border-red-200 dark:border-red-800",
    bar: "bg-red-500",
  },
  medium: {
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    text: "text-yellow-700 dark:text-yellow-400",
    dot: "text-yellow-500",
    border: "border-yellow-200 dark:border-yellow-800",
    bar: "bg-yellow-500",
  },
  low: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    dot: "text-green-500",
    border: "border-green-200 dark:border-green-800",
    bar: "bg-green-500",
  },
};

// ────────────────────────────────────────────────────────────
// Motion Variants
// ────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ────────────────────────────────────────────────────────────
// Component — Enterprise Dashboard with Enhanced Readable Sidebar
// ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { t, lang } = useI18n();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "resolved">("all");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setReports(getReports());
  }, []);

  const refreshReports = useCallback(() => setReports(getReports()), []);

  const filtered = useMemo(() => {
    let list = reports;
    if (filter !== "all") list = list.filter((r) => r.status === filter);
    if (urgencyFilter) list = list.filter((r) => r.urgency === urgencyFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.text.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.trackingId.toLowerCase().includes(q),
      );
    }
    return list;
  }, [reports, filter, search, urgencyFilter]);

  const stats = useMemo(() => {
    const total = reports.length;
    const byUrgency = { high: 0, medium: 0, low: 0 };
    const byStatus = { pending: 0, "in-progress": 0, resolved: 0 };
    reports.forEach((r) => {
      byUrgency[r.urgency as keyof typeof byUrgency]++;
      byStatus[r.status]++;
    });
    return { total, byUrgency, byStatus };
  }, [reports]);

  // ── Skeleton loading ──────────────────────────────────────

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex">
        <div className="w-72 bg-slate-100 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/60 p-6 hidden md:block">
          <div className="skeleton h-10 w-48 mb-10 rounded-2xl" />
          <div className="skeleton h-12 w-full mb-8 rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-6 w-28 rounded-lg" />
            <div className="skeleton h-12 w-full rounded-2xl" />
            <div className="skeleton h-12 w-full rounded-2xl" />
          </div>
        </div>
        <div className="flex-1 p-4 pl-0">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl h-full p-10 skeleton" />
        </div>
      </div>
    );
  }

  // ── Render — Modern Layout with Enhanced Sidebar Typography ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-800 dark:text-slate-100 font-sans">
      {/* ── Left Sidebar — Enhanced Typography & Layout ─────────────────────────────────────── */}
      <aside className={`shrink-0 bg-slate-100 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/60 flex flex-col justify-between transition-all duration-300 ${sidebarCollapsed ? "w-20 p-4 items-center" : "w-72 p-6"} hidden md:flex`}>
        {/* Top Section */}
        <div className={`space-y-8 w-full ${sidebarCollapsed ? "flex flex-col items-center" : ""}`}>
          {/* Logo Lockup */}
          <div className={`flex items-center gap-3.5 pt-2 ${sidebarCollapsed ? "px-0 justify-center" : "px-2"}`}>
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-ph-navy)] dark:bg-[var(--color-ph-gold)] text-white dark:text-slate-900 flex items-center justify-center font-black text-base shadow-md shrink-0 border border-white/10">
              RM
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-[var(--color-ph-navy)] dark:text-white leading-none">
                  RescueMind
                </span>
                <span className="text-xs font-bold text-[var(--color-ph-gold)] uppercase tracking-wider mt-1.5">
                  Barangay Triage
                </span>
              </div>
            )}
          </div>

          {/* Sidebar Search */}
          {!sidebarCollapsed && (
            <div className="relative px-1">
              <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("dashboard.search")}
                className="w-full py-2.5 pl-10 pr-4 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[var(--color-ph-gold)] text-slate-800 dark:text-slate-100 font-bold placeholder-slate-400 shadow-sm"
              />
            </div>
          )}

          {/* Navigation Sections */}
          <div className={`space-y-8 w-full ${sidebarCollapsed ? "px-0 flex flex-col items-center" : "px-1"}`}>
            {/* MAIN NAVIGATION */}
            <div className="w-full">
              {!sidebarCollapsed && (
                <div className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3">
                  Navigation
                </div>
              )}
              <div className={`space-y-1.5 w-full ${sidebarCollapsed ? "flex flex-col items-center" : ""}`}>
                <Link
                  href="/dashboard"
                  className={sidebarCollapsed ? "w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 text-[var(--color-ph-navy)] dark:text-white font-bold shadow-md border border-slate-200/80 dark:border-slate-800/80 mx-auto" : "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 text-[var(--color-ph-navy)] dark:text-white font-bold text-sm shadow-md border border-slate-200/80 dark:border-slate-800/80"}
                  title={sidebarCollapsed ? t("nav.dashboard") : undefined}
                >
                  <IconChartBar className="w-5 h-5 text-[var(--color-ph-gold)] shrink-0" />
                  {!sidebarCollapsed && <span>{t("nav.dashboard")}</span>}
                </Link>
                <Link
                  href="/report"
                  className={sidebarCollapsed ? "w-12 h-12 flex items-center justify-center rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 mx-auto transition-all" : "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 font-bold text-sm transition-all"}
                  title={sidebarCollapsed ? t("nav.report") : undefined}
                >
                  <IconPlus className="w-5 h-5 text-[var(--color-ph-gold)] shrink-0" />
                  {!sidebarCollapsed && <span>{t("nav.submitReport")}</span>}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section (Collapse Sidebar + Home Page + Profile Lockup) */}
        <div className={`space-y-6 w-full ${sidebarCollapsed ? "px-0 flex flex-col items-center" : "px-1"}`}>
          <div className={`space-y-1.5 w-full ${sidebarCollapsed ? "flex flex-col items-center" : ""}`}>
            {/* Collapse Sidebar */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={sidebarCollapsed ? "w-12 h-12 flex items-center justify-center rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 mx-auto transition-all" : "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 font-bold text-sm transition-all"}
              title={sidebarCollapsed ? "Expand Sidebar" : undefined}
            >
              <IconArrowRight className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300 ${sidebarCollapsed ? "" : "rotate-180"}`} />
              {!sidebarCollapsed && <span>Collapse Sidebar</span>}
            </button>

            {/* Home Page at the bottom below collapse sidebar */}
            <Link
              href="/"
              className={sidebarCollapsed ? "w-12 h-12 flex items-center justify-center rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 mx-auto transition-all" : "w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60 font-bold text-sm transition-all"}
              title={sidebarCollapsed ? "Home Page" : undefined}
            >
              <IconBuilding className="w-5 h-5 text-slate-500 shrink-0" />
              {!sidebarCollapsed && <span>Home Page</span>}
            </Link>
          </div>

          {/* Official Profile Lockup */}
          {sidebarCollapsed ? (
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-ph-navy)] text-[var(--color-ph-gold)] flex items-center justify-center font-black text-base mx-auto border border-white/10 shadow-md" title="Barangay Resident">
              <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,76a32,32,0,1,1-32,32A32,32,0,0,1,128,76Zm0,48a16,16,0,1,0-16-16A16,16,0,0,0,128,124Zm0,76c-17.57,0-33.22-5.59-44.83-14.54A8,8,0,0,1,91.53,175c8.6,5.45,17.35,9,36.47,9s27.87-3.55,36.47-9a8,8,0,1,1,8.38,13.63C161.22,194.41,145.57,200,128,200Z" /></svg>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[var(--color-ph-navy)] text-[var(--color-ph-gold)] flex items-center justify-center font-black text-base shrink-0 border border-white/10 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM128,76a32,32,0,1,1-32,32A32,32,0,0,1,128,76Zm0,48a16,16,0,1,0-16-16A16,16,0,0,0,128,124Zm0,76c-17.57,0-33.22-5.59-44.83-14.54A8,8,0,0,1,91.53,175c8.6,5.45,17.35,9,36.47,9s27.87-3.55,36.47-9a8,8,0,1,1,8.38,13.63C161.22,194.41,145.57,200,128,200Z" /></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-sm text-slate-800 dark:text-slate-200 truncate">Barangay Resident</div>
                  <div className="text-xs text-slate-400 font-medium truncate">Citizen Portal</div>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0 mr-1" />
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Content Area — Embedded Rounded Content Container ─────────────────────────────────────── */}
      <main className="flex-1 p-3 sm:p-4 md:pl-0 min-w-0 flex flex-col h-screen overflow-hidden">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800/80 flex-1 flex flex-col p-6 sm:p-10 overflow-y-auto relative">
          
          {/* ── Top Bar inside Rounded Container ────────────────────────────────────── */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 pb-6 border-b border-slate-100 dark:border-slate-800/60">
            {/* Left Tabs (All Reports, Pending, In-Progress, Resolved) */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 w-fit">
              <button
                onClick={() => setFilter("all")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  filter === "all"
                    ? "bg-[#0a1915] text-white dark:bg-[var(--color-ph-gold)] dark:text-slate-900 font-extrabold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {t("dashboard.filterAll")} ({stats.total})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  filter === "pending"
                    ? "bg-[#0a1915] text-white dark:bg-[var(--color-ph-gold)] dark:text-slate-900 font-extrabold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {t("dashboard.filterPending")} ({stats.byStatus.pending})
              </button>
              <button
                onClick={() => setFilter("in-progress")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  filter === "in-progress"
                    ? "bg-[#0a1915] text-white dark:bg-[var(--color-ph-gold)] dark:text-slate-900 font-extrabold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {t("dashboard.filterInProgress")} ({stats.byStatus["in-progress"]})
              </button>
              <button
                onClick={() => setFilter("resolved")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  filter === "resolved"
                    ? "bg-[#0a1915] text-white dark:bg-[var(--color-ph-gold)] dark:text-slate-900 font-extrabold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                {t("dashboard.filterResolved")} ({stats.byStatus.resolved})
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Search reports input */}
              <div className="relative w-full sm:w-60">
                <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("dashboard.search")}
                  className="w-full py-2 pl-10 pr-4 text-xs rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[var(--color-ph-gold)] text-slate-800 dark:text-slate-100 font-bold placeholder-slate-400 shadow-xs"
                />
              </div>

              {/* Urgency Filter */}
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="py-2 px-4 text-xs rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:border-[var(--color-ph-gold)] shadow-xs cursor-pointer"
              >
                <option value="">{t("dashboard.allUrgencies")}</option>
                <option value="high">{t("dashboard.high")}</option>
                <option value="medium">{t("dashboard.medium")}</option>
                <option value="low">{t("dashboard.low")}</option>
              </select>

              <ThemeToggle />
            </div>
          </header>

          {/* ── Section 1: Barangay Triage Analytics (Actual RescueMind Stats) ────────────────────────────────────── */}
          <section className="mb-12">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
              {lang !== "en" ? "Pagsusuri ng mga Ulat sa Barangay" : "Barangay Incident Analytics"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Total Reports */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/50 via-white to-blue-100/20 dark:from-slate-800/40 dark:via-slate-900 dark:to-blue-950/20 border border-blue-200/60 dark:border-slate-800 shadow-lg shadow-blue-500/5 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-2 bottom-2 opacity-10 font-black text-8xl text-blue-500 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  #
                </div>
                <div>
                  <div className="flex items-center justify-between text-[0.65rem] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                    <span>{t("dashboard.total")}</span>
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div className="text-4xl font-black text-[var(--color-ph-navy)] dark:text-white tracking-tight">
                    {stats.total}
                  </div>
                </div>
                <div className="mt-8 pt-3 border-t border-blue-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>{lang !== "en" ? "Nalutas na Ulat" : "Resolved Reports"}</span>
                  <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 font-bold text-[0.65rem] border border-green-200 dark:border-green-800">
                    {stats.byStatus.resolved}
                  </span>
                </div>
              </div>

              {/* Card 2: High Urgency */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-red-50/50 via-white to-red-100/20 dark:from-slate-800/40 dark:via-slate-900 dark:to-red-950/20 border border-red-200/60 dark:border-slate-800 shadow-lg shadow-red-500/5 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-2 bottom-2 opacity-10 font-black text-8xl text-red-500 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  !
                </div>
                <div>
                  <div className="flex items-center justify-between text-[0.65rem] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                    <span>{t("dashboard.high")}</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div className="text-4xl font-black text-red-600 dark:text-red-400 tracking-tight">
                    {stats.byUrgency.high}
                  </div>
                </div>
                <div className="mt-8 pt-3 border-t border-red-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="text-red-600 dark:text-red-400">{lang !== "en" ? "Kailangan ng agarang aksyon" : "Immediate action required"}</span>
                </div>
              </div>

              {/* Card 3: Medium Urgency */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-yellow-50/50 via-white to-yellow-100/20 dark:from-slate-800/40 dark:via-slate-900 dark:to-yellow-950/20 border border-yellow-200/60 dark:border-slate-800 shadow-lg shadow-yellow-500/5 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-2 bottom-2 opacity-10 font-black text-8xl text-yellow-500 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center justify-between text-[0.65rem] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                    <span>{t("dashboard.medium")}</span>
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  </div>
                  <div className="text-4xl font-black text-yellow-600 dark:text-yellow-400 tracking-tight">
                    {stats.byUrgency.medium}
                  </div>
                </div>
                <div className="mt-8 pt-3 border-t border-yellow-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>{lang !== "en" ? "Katamtamang priyoridad" : "Medium priority level"}</span>
                </div>
              </div>

              {/* Card 4: Low Urgency */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-green-50/50 via-white to-green-100/20 dark:from-slate-800/40 dark:via-slate-900 dark:to-green-950/20 border border-green-200/60 dark:border-slate-800 shadow-lg shadow-green-500/5 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-2 bottom-2 opacity-10 font-black text-8xl text-green-500 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  ✓
                </div>
                <div>
                  <div className="flex items-center justify-between text-[0.65rem] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                    <span>{t("dashboard.low")}</span>
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div className="text-4xl font-black text-green-600 dark:text-green-400 tracking-tight">
                    {stats.byUrgency.low}
                  </div>
                </div>
                <div className="mt-8 pt-3 border-t border-green-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>{lang !== "en" ? "Karaniwang priyoridad" : "Standard priority level"}</span>
                </div>
              </div>

            </div>
          </section>

          {/* ── Section 2: Active Incident Ledger (Actual Reports List) ────────────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {lang !== "en" ? "Listahan ng mga Aktibong Insidente" : "Active Incident Ledger"}
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="p-16 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/60 text-center my-6"
                >
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-6 shadow-xs">
                    <IconSearch className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
                    {t("dashboard.noReports")}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-md mx-auto">
                    {lang !== "en"
                      ? "Wala pang mga ulat na tumutugma sa inyong filter o paghahanap."
                      : "No incident reports match your active filter or search query."}
                  </p>
                  <Link href="/report" className="px-6 py-3 rounded-full bg-[var(--color-ph-navy)] text-[var(--color-ph-gold)] hover:bg-[#0a1915] text-xs font-extrabold tracking-wider uppercase transition-all shadow-md inline-flex items-center gap-2">
                    <IconPlus className="w-4 h-4" />
                    <span>{t("nav.report")}</span>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="space-y-4"
                >
                  {filtered.map((report) => {
                    const urgency = URGENCY_META[report.urgency] ?? URGENCY_META.medium;
                    const timestamp = new Date(report.timestamp).toLocaleString("fil-PH", {
                      timeZone: "Asia/Manila",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    const statusLabel =
                      report.status === "pending"
                        ? t("dashboard.statusPending")
                        : report.status === "in-progress"
                          ? t("dashboard.statusInProgress")
                          : t("dashboard.statusResolved");

                    const statusClasses =
                      report.status === "resolved"
                        ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800"
                        : report.status === "in-progress"
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700";

                    return (
                      <motion.div
                        key={report.trackingId}
                        variants={fadeUp}
                        className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
                      >
                        {/* Left: report info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${urgency.bg} ${urgency.text} ${urgency.border} flex items-center gap-1.5 shadow-xs`}>
                              <IconCircle className={`${urgency.dot} w-2 h-2`} />
                              {report.urgency === "high"
                                ? t("dashboard.high")
                                : report.urgency === "medium"
                                  ? t("dashboard.medium")
                                  : t("dashboard.low")}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-500 dark:text-slate-400 shadow-xs">
                              {report.trackingId}
                            </span>
                            {report.needsHumanReview && (
                              <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 text-xs font-bold shadow-xs">
                                {lang !== "en" ? "Para sa Review" : "For Review"}
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[var(--color-ph-navy)] dark:group-hover:text-[var(--color-ph-gold)] transition-colors mb-2 flex items-center gap-2">
                            <span>{report.category}</span>
                            <IconArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[var(--color-ph-gold)]" />
                          </h3>

                          <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4 leading-relaxed font-medium">
                            {report.text}
                          </p>

                          <div className="flex items-center gap-6 text-xs font-bold text-slate-400 flex-wrap pt-3 border-t border-slate-200 dark:border-slate-800/60">
                            <span className="flex items-center gap-1.5">
                              <IconBuilding className="w-3.5 h-3.5 text-[var(--color-ph-gold)]" />
                              {report.office}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <IconClock className="w-3.5 h-3.5 text-[var(--color-ph-gold)]" />
                              {timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Right: Status + Actions */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-4 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-200 dark:border-slate-800">
                          <span className={`px-3.5 py-1.5 rounded-full font-black text-xs uppercase tracking-wider shadow-xs ${statusClasses}`}>
                            {statusLabel}
                          </span>


                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination Footer */}
            {filtered.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-10 text-center text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-950/60 py-3 px-6 rounded-full border border-slate-200 dark:border-slate-800 max-w-xs mx-auto shadow-xs"
              >
                {filtered.length} {lang !== "en" ? "sa" : "of"} {reports.length}{" "}
                {lang !== "en" ? "mga report" : "reports"}
                {filter !== "all" && (lang !== "en" ? " ang ipinapakita" : " shown")}
              </motion.p>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
