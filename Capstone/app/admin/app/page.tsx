"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DEPARTMENTS, getDepartmentSlug } from "@/lib/departments";

interface ReportCounts {
  [slug: string]: { total: number; high: number; medium: number; low: number; pending: number };
}

const DEPT_COLORS: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  red: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800", bar: "bg-red-500" },
  blue: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800", bar: "bg-blue-500" },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800", bar: "bg-yellow-500" },
  green: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", border: "border-green-200 dark:border-green-800", bar: "bg-green-500" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", bar: "bg-emerald-500" },
  teal: { bg: "bg-teal-50 dark:bg-teal-950/30", text: "text-teal-700 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800", bar: "bg-teal-500" },
  slate: { bg: "bg-slate-50 dark:bg-slate-800/30", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700", bar: "bg-slate-500" },
};

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<ReportCounts>({});
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data: { reports: Array<{ office: string; urgency: string; status: string }> }) => {
        const reportCounts: ReportCounts = {};
        DEPARTMENTS.forEach((d) => { reportCounts[d.slug] = { total: 0, high: 0, medium: 0, low: 0, pending: 0 }; });

        data.reports.forEach((r) => {
          const slug = getDepartmentSlug(r.office);
          if (!reportCounts[slug]) return;
          reportCounts[slug].total++;
          reportCounts[slug][r.urgency as "high" | "medium" | "low"]++;
          if (r.status === "pending") reportCounts[slug].pending++;
        });

        setCounts(reportCounts);
        setTotalReports(data.reports.length);
      })
      .catch(() => setError("Failed to load reports"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-10">
        <div><div className="skeleton h-8 w-48 rounded-lg mb-2" /><div className="skeleton h-4 w-72 rounded-lg" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(7)].map((_, i) => (<div key={i} className="skeleton h-40 rounded-3xl" />))}
        </div>
      </div>
    );
  }

  const totalHigh = Object.values(counts).reduce((sum, c) => sum + c.high, 0);
  const totalPending = Object.values(counts).reduce((sum, c) => sum + c.pending, 0);
  const totalResolved = totalReports - totalPending - Object.values(counts).reduce((sum, c) => sum + (c.total - c.pending - c.high - c.medium - c.low), 0);

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-10">
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-black text-[var(--color-ph-navy)] dark:text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Department report overview and triage summary</p>
      </motion.div>

      {/* Stats Cards */}
      {!error && (
        <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 via-white to-blue-100/20 dark:from-slate-800/40 dark:via-slate-900 dark:to-blue-950/20 border border-blue-200/60 dark:border-slate-800">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">Total Reports</div>
            <div className="text-3xl font-black text-[var(--color-ph-navy)] dark:text-white">{totalReports}</div>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50/50 via-white to-red-100/20 dark:from-slate-800/40 dark:via-slate-900 dark:to-red-950/20 border border-red-200/60 dark:border-slate-800">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">Urgent</div>
            <div className="text-3xl font-black text-red-600 dark:text-red-400">{totalHigh}</div>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-50/50 via-white to-yellow-100/20 dark:from-slate-800/40 dark:via-slate-900 dark:to-yellow-950/20 border border-yellow-200/60 dark:border-slate-800">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">Pending</div>
            <div className="text-3xl font-black text-yellow-600 dark:text-yellow-400">{totalPending}</div>
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50/50 via-white to-green-100/20 dark:from-slate-800/40 dark:via-slate-900 dark:to-green-950/20 border border-green-200/60 dark:border-slate-800">
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-1">Departments</div>
            <div className="text-3xl font-black text-green-600 dark:text-green-400">{DEPARTMENTS.length}</div>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm">
          <strong>No reports in database yet.</strong> Submit reports from the main app first, or connect the Supabase database with the same project.
        </motion.div>
      )}

      {/* Department Cards */}
      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">Departments & Agencies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((dept) => {
            const c = counts[dept.slug] ?? { total: 0, high: 0, medium: 0, low: 0, pending: 0 };
            const colors = DEPT_COLORS[dept.color] ?? DEPT_COLORS.slate;
            return (
              <Link key={dept.slug} href={`/departments/${dept.slug}`}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shadow-sm shrink-0">{dept.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[var(--color-text)] truncate">{dept.shortName}</div>
                    <div className="text-xs text-[var(--color-text-muted)] font-medium">{dept.acronym}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="text-3xl font-black text-[var(--color-ph-navy)] dark:text-white">{c.total}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.high > 0 ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                    {c.high} urgent
                  </span>
                </div>
                {/* Urgency bar */}
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  {c.total > 0 && (
                    <div className="flex h-full">
                      <div className="bg-red-500 h-full transition-all" style={{ width: `${(c.high / c.total) * 100}%` }} />
                      <div className="bg-yellow-500 h-full transition-all" style={{ width: `${(c.medium / c.total) * 100}%` }} />
                      <div className="bg-green-500 h-full transition-all" style={{ width: `${(c.low / c.total) * 100}%` }} />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-bold text-[var(--color-text-muted)]">{c.pending} pending</span>
                  <span className="text-xs font-bold text-[var(--color-ph-gold)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    View reports <IconArrowRight />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Info */}
      <motion.div variants={fadeUp} className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176Zm-16-72a12,12,0,1,1,12-12A12,12,0,0,1,128,104Z" />
        </svg>
        <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          Reports are stored in Supabase. Click any department card to view detailed reports routed to that agency.
          Data is synced from the main RescueMind AI application.
        </div>
      </motion.div>
    </motion.div>
  );
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" className={className} aria-hidden="true">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </svg>
  );
}
