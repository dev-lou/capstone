"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getDepartmentBySlug, getDepartmentSlug, DEPARTMENTS } from "@/lib/departments";

interface Report {
  id: number;
  tracking_id: string;
  text: string;
  category: string;
  confidence: number;
  needs_human_review: boolean;
  urgency: string;
  office: string;
  explanation: string;
  status: string;
  created_at: string;
  barangay: string;
  city: string;
  province: string;
  user_id: string;
}

const URGENCY_META: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  high: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-700 dark:text-red-400", dot: "text-red-500", border: "border-red-200 dark:border-red-800" },
  medium: { bg: "bg-yellow-50 dark:bg-yellow-950/30", text: "text-yellow-700 dark:text-yellow-400", dot: "text-yellow-500", border: "border-yellow-200 dark:border-yellow-800" },
  low: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-400", dot: "text-green-500", border: "border-green-200 dark:border-green-800" },
};

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

export default function DepartmentPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const dept = getDepartmentBySlug(slug);

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data: { reports: Report[] }) => {
        const filtered = data.reports.filter((r) => getDepartmentSlug(r.office) === slug);
        setReports(filtered);
      })
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [slug]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return reports;
    return reports.filter((r) => r.status === statusFilter);
  }, [reports, statusFilter]);

  const stats = useMemo(() => ({
    total: reports.length,
    high: reports.filter((r) => r.urgency === "high").length,
    medium: reports.filter((r) => r.urgency === "medium").length,
    low: reports.filter((r) => r.urgency === "low").length,
    pending: reports.filter((r) => r.status === "pending").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  }), [reports]);

  if (!dept) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Department Not Found</h2>
          <Link href="/" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-64 rounded-lg mb-4" />
        <div className="skeleton h-5 w-96 rounded-lg mb-8" />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-ph-navy)] dark:hover:text-white transition-colors">Dashboard</Link>
            <span className="text-[var(--color-text-muted)]">/</span>
            <span className="text-sm font-bold text-[var(--color-text)]">{dept.shortName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-ph-navy)] dark:text-white tracking-tight flex items-center gap-3">
            <span className="text-2xl">{dept.icon}</span>
            {dept.name}
            <span className="text-xs font-bold text-[var(--color-text-muted)] bg-[var(--color-bg-alt)] px-3 py-1 rounded-full">({dept.acronym})</span>
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{dept.description}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Total</div>
          <div className="text-2xl font-black text-[var(--color-ph-navy)] dark:text-white">{stats.total}</div>
        </div>
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <div className="text-xs font-extrabold uppercase tracking-widest text-red-400 mb-0.5">Urgent</div>
          <div className="text-2xl font-black text-red-600 dark:text-red-400">{stats.high}</div>
        </div>
        <div className="p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
          <div className="text-xs font-extrabold uppercase tracking-widest text-yellow-400 mb-0.5">Medium</div>
          <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">{stats.medium}</div>
        </div>
        <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <div className="text-xs font-extrabold uppercase tracking-widest text-green-400 mb-0.5">Low</div>
          <div className="text-2xl font-black text-green-600 dark:text-green-400">{stats.low}</div>
        </div>
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <div className="text-xs font-extrabold uppercase tracking-widest text-blue-400 mb-0.5">Pending</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.pending}</div>
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 w-fit">
        {[
          { key: "all", label: `All (${stats.total})` },
          { key: "pending", label: `Pending (${stats.pending})` },
          { key: "in-progress", label: `In Progress (${reports.filter(r => r.status === "in-progress").length})` },
          { key: "resolved", label: `Resolved (${stats.resolved})` },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${statusFilter === tab.key ? "bg-[#0a1915] text-white dark:bg-[var(--color-ph-gold)] dark:text-slate-900" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"}`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Report List */}
      {filtered.length === 0 ? (
        <motion.div variants={fadeUp} className="p-16 text-center">
          <div className="text-5xl mb-4">{dept.icon}</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Reports Yet</h3>
          <p className="text-[var(--color-text-muted)] text-sm max-w-md mx-auto">No reports have been routed to {dept.name} yet. Reports submitted in the main RescueMind app will appear here once saved to the database.</p>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="space-y-4">
          {filtered.map((report) => {
            const urgency = URGENCY_META[report.urgency] ?? URGENCY_META.medium;
            const timestamp = new Date(report.created_at).toLocaleString("fil-PH", { timeZone: "Asia/Manila", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
            const statusLabel = report.status === "pending" ? "Pending" : report.status === "in-progress" ? "In Progress" : "Resolved";
            const statusClass = report.status === "resolved" ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800" : report.status === "in-progress" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700";

            return (
              <div key={report.id ?? report.tracking_id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${urgency.bg} ${urgency.text} ${urgency.border} flex items-center gap-1.5`}>
                        <svg width="8" height="8" viewBox="0 0 256 256" fill="currentColor" className={`${urgency.dot} w-2 h-2`}><circle cx="128" cy="128" r="96" /></svg>
                        {report.urgency}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{report.tracking_id}</span>
                      <span className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider ${statusClass}`}>{statusLabel}</span>
                      {report.needs_human_review && (
                        <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 text-xs font-bold">For Review</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{report.category}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">{report.text}</p>
                    {report.barangay && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-2">
                        📍 {[report.barangay, report.city, report.province].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">{timestamp}</span>
                    <Link href={`/reports/${report.tracking_id}`} className="text-xs font-bold text-[var(--color-ph-gold)] hover:underline">View Details →</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <motion.p variants={fadeUp} className="text-center text-xs font-bold text-[var(--color-text-muted)] pt-2">
          Showing {filtered.length} of {reports.length} reports
        </motion.p>
      )}
    </motion.div>
  );
}
